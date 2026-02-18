-- Add DELETE policy for video_analyses table to allow users to delete their own analyses
CREATE POLICY "Users can delete their own analyses" 
ON public.video_analyses 
FOR DELETE 
USING (auth.uid() = user_id);