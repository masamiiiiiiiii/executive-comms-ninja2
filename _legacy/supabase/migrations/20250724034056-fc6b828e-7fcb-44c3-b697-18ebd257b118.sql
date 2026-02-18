-- Fix RLS policies to allow proper authentication flow

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies that work with the authentication flow
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix video_analyses policies
DROP POLICY IF EXISTS "Users can create their own analyses" ON public.video_analyses;
DROP POLICY IF EXISTS "Users can view their own analyses" ON public.video_analyses;
DROP POLICY IF EXISTS "Users can update their own analyses" ON public.video_analyses;

CREATE POLICY "Users can create their own analyses" 
ON public.video_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analyses" 
ON public.video_analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" 
ON public.video_analyses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix usage_tracking policies
DROP POLICY IF EXISTS "Users can create their own usage records" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can view their own usage" ON public.usage_tracking;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.usage_tracking;

CREATE POLICY "Users can create their own usage records" 
ON public.usage_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage" 
ON public.usage_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.usage_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);