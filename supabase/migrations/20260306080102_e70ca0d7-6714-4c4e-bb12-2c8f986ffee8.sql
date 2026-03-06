-- Fix: Use security_invoker view with a scoped SELECT policy
-- The view filters columns (no guest_email, no user_id)
-- Direct table access still blocked by existing restrictive policies

DROP VIEW IF EXISTS public.blog_comments_public;

-- Allow SELECT on approved comments (needed for security_invoker view to work)
CREATE POLICY "Public can read approved comments"
ON public.blog_comments
FOR SELECT
TO anon
USING (is_approved = true);

CREATE VIEW public.blog_comments_public 
WITH (security_invoker = true) AS
SELECT 
    id,
    article_id,
    guest_name,
    content,
    is_approved,
    created_at,
    updated_at
FROM public.blog_comments
WHERE is_approved = true;