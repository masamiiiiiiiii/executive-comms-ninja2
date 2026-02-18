-- 1. Create the video_analyses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.video_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  video_title TEXT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  target_person TEXT NOT NULL,
  video_duration_hours DECIMAL NOT NULL DEFAULT 0,
  analysis_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (Security best practice)
ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;

-- 3. Add RLS Policies (Allow users to see/edit only their own data)
-- We drop them first to avoid "policy already exists" errors if you run this twice.
DROP POLICY IF EXISTS "Users can view their own analyses" ON public.video_analyses;
CREATE POLICY "Users can view their own analyses" ON public.video_analyses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own analyses" ON public.video_analyses;
CREATE POLICY "Users can create their own analyses" ON public.video_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own analyses" ON public.video_analyses;
CREATE POLICY "Users can update their own analyses" ON public.video_analyses FOR UPDATE USING (auth.uid() = user_id);

-- 4. Add the new columns for the Worker (status, error_message)
ALTER TABLE public.video_analyses 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- 5. Create an index for faster worker polling
CREATE INDEX IF NOT EXISTS idx_video_analyses_status ON public.video_analyses(status);
