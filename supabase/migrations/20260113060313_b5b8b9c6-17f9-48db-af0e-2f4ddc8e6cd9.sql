-- Drop the legacy permissive policy that exposes all contact submissions to the public
-- The admin-only policy "Admins can view all contact submissions" will remain active
DROP POLICY IF EXISTS "Public can view all contact submissions" ON public.contact_submissions;