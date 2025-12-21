-- Add phone column to contact_submissions for lead capture
ALTER TABLE public.contact_submissions 
ADD COLUMN phone text;