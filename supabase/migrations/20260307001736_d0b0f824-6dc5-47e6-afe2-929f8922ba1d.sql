
-- Drop the public SELECT policy on blog_comments base table that exposes guest_email
DROP POLICY IF EXISTS "Public can read approved comments" ON public.blog_comments;

-- Recreate the blog_comments_public view WITHOUT security_invoker so it doesn't need base table policies for anon access
DROP VIEW IF EXISTS public.blog_comments_public;
CREATE VIEW public.blog_comments_public
WITH (security_invoker = false)
AS
SELECT
  id,
  article_id,
  content,
  guest_name,
  is_approved,
  created_at,
  updated_at
FROM public.blog_comments
WHERE is_approved = true;

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.blog_comments_public TO anon;
GRANT SELECT ON public.blog_comments_public TO authenticated;
