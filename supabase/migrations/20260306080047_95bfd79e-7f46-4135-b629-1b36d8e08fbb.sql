-- Remove the public SELECT policy that re-exposes guest_email on base table
DROP POLICY IF EXISTS "Anyone can view approved comments via public view" ON public.blog_comments;

-- Recreate view as security_definer (intentional: only exposes safe columns)
DROP VIEW IF EXISTS public.blog_comments_public;

CREATE VIEW public.blog_comments_public AS
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