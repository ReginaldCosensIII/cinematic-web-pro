-- Remove the permissive SELECT policy that exposes guest_email to anonymous users
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.blog_comments;