
-- Add a pinned column to blog_articles table
ALTER TABLE public.blog_articles ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT false;

-- Create a unique index to ensure only one article can be pinned at a time
CREATE UNIQUE INDEX unique_pinned_article ON public.blog_articles (is_pinned) WHERE is_pinned = true;
