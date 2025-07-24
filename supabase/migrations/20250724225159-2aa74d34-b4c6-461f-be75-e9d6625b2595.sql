-- Create access requests table
CREATE TABLE public.access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Admin can view all requests (mkito@ap.equinix.com)
CREATE POLICY "Admin can view all requests"
ON public.access_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.email = 'mkito@ap.equinix.com'
  )
);

-- Admin can update all requests
CREATE POLICY "Admin can update all requests"
ON public.access_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.email = 'mkito@ap.equinix.com'
  )
);

-- Anyone can create access requests
CREATE POLICY "Anyone can create access requests"
ON public.access_requests
FOR INSERT
WITH CHECK (true);

-- Users can view their own requests
CREATE POLICY "Users can view their own requests"
ON public.access_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.email = access_requests.email
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_access_requests_updated_at
BEFORE UPDATE ON public.access_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();