-- Fix the view to use SECURITY INVOKER instead of SECURITY DEFINER
CREATE OR REPLACE VIEW public.blog_comments_public
WITH (security_invoker = true)
AS
SELECT id, article_id, user_id, guest_name, content, is_approved, created_at, updated_at
FROM public.blog_comments
WHERE is_approved = true;