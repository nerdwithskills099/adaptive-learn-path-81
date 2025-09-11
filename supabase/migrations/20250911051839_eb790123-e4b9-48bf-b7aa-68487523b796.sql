-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'parent');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  roll_number TEXT,
  class_grade TEXT,
  school_name TEXT,
  interested_subjects TEXT[],
  language_preference TEXT DEFAULT 'en',
  parent_id UUID REFERENCES public.profiles(id),
  teacher_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  skill TEXT NOT NULL CHECK (skill IN ('listening', 'grasping', 'retention', 'application')),
  subject TEXT NOT NULL,
  chapter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assessment_type TEXT NOT NULL DEFAULT 'adaptive',
  current_level INTEGER DEFAULT 1,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  skill_scores JSONB DEFAULT '{"listening": 0, "grasping": 0, "retention": 0, "application": 0}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE
);

-- Create assessment responses table
CREATE TABLE public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create practice sessions table
CREATE TABLE public.practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  practice_mode TEXT NOT NULL CHECK (practice_mode IN ('difficulty_based', 'mixed')),
  target_skills TEXT[],
  difficulty_level TEXT,
  questions_completed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for questions (readable by all authenticated users)
CREATE POLICY "Questions are viewable by authenticated users" ON public.questions
FOR SELECT TO authenticated USING (true);

-- Create RLS policies for assessments
CREATE POLICY "Students can view their own assessments" ON public.assessments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = assessments.student_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Students can create their own assessments" ON public.assessments
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = assessments.student_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Students can update their own assessments" ON public.assessments
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = assessments.student_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Create RLS policies for assessment responses
CREATE POLICY "Students can view their own assessment responses" ON public.assessment_responses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assessments a
    JOIN public.profiles p ON p.id = a.student_id
    WHERE a.id = assessment_responses.assessment_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Students can create their own assessment responses" ON public.assessment_responses
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assessments a
    JOIN public.profiles p ON p.id = a.student_id
    WHERE a.id = assessment_responses.assessment_id 
    AND p.user_id = auth.uid()
  )
);

-- Create RLS policies for practice sessions
CREATE POLICY "Students can view their own practice sessions" ON public.practice_sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = practice_sessions.student_id 
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Students can create their own practice sessions" ON public.practice_sessions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = practice_sessions.student_id 
    AND profiles.user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample questions
INSERT INTO public.questions (text, options, correct_answer, difficulty, skill, subject, chapter) VALUES
('What is the sum of the interior angles of a triangle?', '["90 degrees", "180 degrees", "270 degrees", "360 degrees"]', 1, 'easy', 'grasping', 'Mathematics', 'Geometry'),
('If a car travels 60 miles in 2 hours, what is its average speed?', '["20 mph", "25 mph", "30 mph", "35 mph"]', 2, 'medium', 'application', 'Mathematics', 'Speed and Distance'),
('Which of the following is the chemical formula for water?', '["CO2", "H2O", "NaCl", "O2"]', 1, 'easy', 'retention', 'Science', 'Chemistry'),
('In the sentence "The quick brown fox jumps," what part of speech is "quick"?', '["Noun", "Verb", "Adjective", "Adverb"]', 2, 'medium', 'grasping', 'English', 'Grammar'),
('If you have a rectangular garden that is 8m long and 6m wide, how much fencing is needed?', '["14 meters", "28 meters", "48 meters", "56 meters"]', 1, 'hard', 'application', 'Mathematics', 'Perimeter');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();