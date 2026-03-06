-- Use security_invoker view + add a SELECT policy for approved comments
DROP VIEW IF EXISTS public.blog_comments_public;

-- Add a SELECT policy allowing anyone to read approved comments (sensitive columns are excluded by the view)
CREATE POLICY "Anyone can view approved comments via public view"
ON public.blog_comments
FOR SELECT
USING (is_approved = true);

-- Recreate view with security_invoker so it respects RLS
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