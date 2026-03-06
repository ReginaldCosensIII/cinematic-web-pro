-- Recreate view with security_invoker to respect underlying table RLS
DROP VIEW IF EXISTS public.blog_comments_public;

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