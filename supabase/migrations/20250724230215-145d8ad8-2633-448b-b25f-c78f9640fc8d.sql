-- Make email column nullable since we're no longer requiring email input
ALTER TABLE public.access_requests 
ALTER COLUMN email DROP NOT NULL;