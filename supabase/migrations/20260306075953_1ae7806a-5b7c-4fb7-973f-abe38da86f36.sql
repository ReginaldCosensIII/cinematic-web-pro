-- Drop and recreate the view without user_id to prevent identity correlation
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