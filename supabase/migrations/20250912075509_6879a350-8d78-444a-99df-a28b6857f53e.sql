-- 1) Ensure the enum type exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'user_role' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'parent');
  END IF;
END;
$$;

-- 2) Ensure profiles.role default uses the qualified enum (idempotent)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    -- Set default to qualified enum value
    EXECUTE 'ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT ''student''::public.user_role';
  END IF;
END;
$$;

-- 3) Recreate the function with a safe enum cast and proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data ? 'role' 
           AND (NEW.raw_user_meta_data->>'role') IN ('student','teacher','parent')
        THEN (NEW.raw_user_meta_data->>'role')::public.user_role
      ELSE 'student'::public.user_role
    END
  );
  RETURN NEW;
END;
$$;

-- 4) Create the trigger on auth.users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;