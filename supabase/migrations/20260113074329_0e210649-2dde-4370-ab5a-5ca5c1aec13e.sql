-- Fix remaining permissive RLS policies on blog_comments and blog_votes

-- For blog_comments: Anyone can create comments is acceptable for public commenting
-- but we should validate with a non-trivial check
DROP POLICY IF EXISTS "Anyone can create comments" ON public.blog_comments;
CREATE POLICY "Anyone can create comments with valid article" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (
  article_id IS NOT NULL AND 
  content IS NOT NULL AND 
  LENGTH(content) > 0 AND
  (
    (user_id IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_name IS NOT NULL AND guest_email IS NOT NULL)
  )
);

-- For blog_votes: Anyone can create votes is acceptable for public voting
-- but we should validate with a non-trivial check  
DROP POLICY IF EXISTS "Anyone can create votes" ON public.blog_votes;
CREATE POLICY "Anyone can create votes with valid article" 
ON public.blog_votes 
FOR INSERT 
WITH CHECK (
  article_id IS NOT NULL AND 
  vote_type IS NOT NULL AND
  (
    (user_id IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_identifier IS NOT NULL)
  )
);