-- Create a public view for blog comments that excludes guest_email
CREATE OR REPLACE VIEW public.blog_comments_public AS
SELECT id, article_id, user_id, guest_name, content, is_approved, created_at, updated_at
FROM public.blog_comments
WHERE is_approved = true;

-- Grant access to the view
GRANT SELECT ON public.blog_comments_public TO anon, authenticated;

-- Revoke direct SELECT on blog_comments from anon (keep authenticated for comment authors)
REVOKE SELECT ON public.blog_comments FROM anon;