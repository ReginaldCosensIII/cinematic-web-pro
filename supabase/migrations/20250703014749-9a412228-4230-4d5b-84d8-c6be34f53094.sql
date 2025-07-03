
-- Create blog articles table
CREATE TABLE public.blog_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true
);

-- Create blog comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.blog_articles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_email TEXT,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog votes table for thumbs-up functionality
CREATE TABLE public.blog_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES public.blog_articles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_identifier TEXT, -- For guest users (IP or session)
  vote_type TEXT NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, user_id),
  UNIQUE(article_id, guest_identifier)
);

-- Enable RLS on all blog tables
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_articles
CREATE POLICY "Anyone can view published articles" 
  ON public.blog_articles 
  FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Authors can view their own articles" 
  ON public.blog_articles 
  FOR SELECT 
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all articles" 
  ON public.blog_articles 
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can create articles" 
  ON public.blog_articles 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own articles" 
  ON public.blog_articles 
  FOR UPDATE 
  USING (auth.uid() = author_id);

-- RLS policies for blog_comments
CREATE POLICY "Anyone can view approved comments" 
  ON public.blog_comments 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Admins can view all comments" 
  ON public.blog_comments 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create comments" 
  ON public.blog_comments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own comments" 
  ON public.blog_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" 
  ON public.blog_comments 
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for blog_votes
CREATE POLICY "Anyone can view votes" 
  ON public.blog_votes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create votes" 
  ON public.blog_votes 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own votes" 
  ON public.blog_votes 
  FOR UPDATE 
  USING (auth.uid() = user_id OR (user_id IS NULL AND guest_identifier IS NOT NULL));

CREATE POLICY "Admins can manage all votes" 
  ON public.blog_votes 
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  slug TEXT;
  counter INTEGER := 0;
  base_slug TEXT;
BEGIN
  -- Convert title to slug format
  base_slug := lower(trim(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  slug := base_slug;
  
  -- Check if slug exists and increment if needed
  WHILE EXISTS (SELECT 1 FROM public.blog_articles WHERE slug = slug) LOOP
    counter := counter + 1;
    slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN slug;
END;
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_blog_articles_updated_at 
  BEFORE UPDATE ON public.blog_articles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at 
  BEFORE UPDATE ON public.blog_comments 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
