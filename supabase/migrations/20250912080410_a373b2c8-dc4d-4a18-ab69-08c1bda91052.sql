-- Create custom_questions table for user-created questions
CREATE TABLE public.custom_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  skill TEXT NOT NULL DEFAULT 'application',
  subject TEXT NOT NULL,
  chapter TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom_tests table for user-created test collections
CREATE TABLE public.custom_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  questions_count INTEGER NOT NULL DEFAULT 0,
  time_limit INTEGER, -- in minutes
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom_test_questions junction table
CREATE TABLE public.custom_test_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL,
  question_id UUID NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_resources table for external websites
CREATE TABLE public.learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  subject TEXT,
  difficulty_level TEXT,
  icon_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.custom_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- RLS policies for custom_questions
CREATE POLICY "Users can view custom questions from their role group" 
ON public.custom_questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2 
    WHERE p1.user_id = auth.uid() 
    AND p2.user_id = custom_questions.creator_id
    AND (p1.role = p2.role OR custom_questions.creator_id = p1.id)
  )
);

CREATE POLICY "Users can create their own custom questions" 
ON public.custom_questions 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND id = creator_id)
);

CREATE POLICY "Users can update their own custom questions" 
ON public.custom_questions 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND id = creator_id)
);

-- RLS policies for custom_tests
CREATE POLICY "Users can view custom tests from their role group" 
ON public.custom_tests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles p1, profiles p2 
    WHERE p1.user_id = auth.uid() 
    AND p2.user_id = custom_tests.creator_id
    AND (p1.role = p2.role OR custom_tests.creator_id = p1.id OR is_published = true)
  )
);

CREATE POLICY "Users can create their own custom tests" 
ON public.custom_tests 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND id = creator_id)
);

CREATE POLICY "Users can update their own custom tests" 
ON public.custom_tests 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND id = creator_id)
);

-- RLS policies for custom_test_questions
CREATE POLICY "Users can view test questions for accessible tests" 
ON public.custom_test_questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM custom_tests ct, profiles p1, profiles p2 
    WHERE ct.id = custom_test_questions.test_id
    AND p1.user_id = auth.uid() 
    AND p2.user_id = ct.creator_id
    AND (p1.role = p2.role OR ct.creator_id = p1.id OR ct.is_published = true)
  )
);

CREATE POLICY "Users can manage their own test questions" 
ON public.custom_test_questions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM custom_tests ct, profiles p 
    WHERE ct.id = custom_test_questions.test_id
    AND p.user_id = auth.uid() 
    AND ct.creator_id = p.id
  )
);

-- RLS policies for learning_resources (public read-only for authenticated users)
CREATE POLICY "Learning resources are viewable by authenticated users" 
ON public.learning_resources 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add triggers for updated_at
CREATE TRIGGER update_custom_questions_updated_at
BEFORE UPDATE ON public.custom_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_tests_updated_at
BEFORE UPDATE ON public.custom_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample learning resources
INSERT INTO public.learning_resources (title, description, url, category, subject, difficulty_level, is_featured) VALUES
('Khan Academy', 'Free online courses and lessons for all subjects', 'https://www.khanacademy.org', 'academic', 'Mathematics', 'beginner', true),
('Coursera', 'Online courses from top universities and companies', 'https://www.coursera.org', 'academic', 'Various', 'intermediate', true),
('edX', 'High-quality courses from universities and institutions', 'https://www.edx.org', 'academic', 'Various', 'intermediate', true),
('Duolingo', 'Learn languages for free with fun lessons', 'https://www.duolingo.com', 'language', 'Languages', 'beginner', true),
('Codecademy', 'Interactive coding lessons and projects', 'https://www.codecademy.com', 'programming', 'Computer Science', 'beginner', true),
('Crash Course', 'Educational YouTube videos on various subjects', 'https://www.youtube.com/user/crashcourse', 'video', 'Various', 'beginner', false),
('MIT OpenCourseWare', 'Free course materials from MIT', 'https://ocw.mit.edu', 'academic', 'Various', 'advanced', false),
('TED-Ed', 'Educational videos and lessons', 'https://ed.ted.com', 'video', 'Various', 'intermediate', false);