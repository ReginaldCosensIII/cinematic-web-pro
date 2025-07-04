-- Add main_image_url column to blog_articles table
ALTER TABLE public.blog_articles 
ADD COLUMN main_image_url TEXT;