-- Revert to security_definer (default) since this view intentionally provides
-- public access to non-sensitive comment data (no guest_email, no user_id)
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