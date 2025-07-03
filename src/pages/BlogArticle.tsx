
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import { Calendar, ArrowLeft, ThumbsUp, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published_at: string;
  tags: string[] | null;
  thumbnail_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  guest_name: string | null;
  user_id: string | null;
  created_at: string;
}

interface Vote {
  helpful_count: number;
  user_voted: boolean;
}

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState<Vote>({ helpful_count: 0, user_voted: false });
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  
  // Comment form state
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      // Fetch article
      const { data: articleData, error: articleError } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (articleError) {
        if (articleError.code === 'PGRST116') {
          navigate('/blog');
          return;
        }
        throw articleError;
      }

      setArticle(articleData);

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select('id, content, guest_name, user_id, created_at')
        .eq('article_id', articleData.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

      // Fetch votes
      const { data: votesData, error: votesError } = await supabase
        .from('blog_votes')
        .select('vote_type, user_id')
        .eq('article_id', articleData.id);

      if (votesError) throw votesError;

      const helpfulVotes = votesData?.filter(v => v.vote_type === 'helpful') || [];
      const userVoted = user ? helpfulVotes.some(v => v.user_id === user.id) : false;

      setVotes({
        helpful_count: helpfulVotes.length,
        user_voted: userVoted
      });

    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: "Error",
        description: "Failed to load article",
        variant: "destructive"
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!article) return;
    
    setVoteLoading(true);
    try {
      const guestIdentifier = user ? null : sessionStorage.getItem('guest_id') || 
        (() => {
          const id = Math.random().toString(36).substring(7);
          sessionStorage.setItem('guest_id', id);
          return id;
        })();

      if (votes.user_voted) {
        // Remove vote
        const { error } = await supabase
          .from('blog_votes')
          .delete()
          .eq('article_id', article.id)
          .eq(user ? 'user_id' : 'guest_identifier', user?.id || guestIdentifier);

        if (error) throw error;
        
        setVotes(prev => ({
          helpful_count: prev.helpful_count - 1,
          user_voted: false
        }));
      } else {
        // Add vote
        const { error } = await supabase
          .from('blog_votes')
          .insert({
            article_id: article.id,
            user_id: user?.id || null,
            guest_identifier: user ? null : guestIdentifier,
            vote_type: 'helpful'
          });

        if (error) throw error;
        
        setVotes(prev => ({
          helpful_count: prev.helpful_count + 1,
          user_voted: true
        }));
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive"
      });
    } finally {
      setVoteLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !newComment.trim()) return;
    
    if (!user && (!guestName.trim() || !guestEmail.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setCommentLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          article_id: article.id,
          user_id: user?.id || null,
          guest_name: user ? null : guestName,
          guest_email: user ? null : guestEmail,
          content: newComment
        })
        .select('id, content, guest_name, user_id, created_at')
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      setNewComment('');
      if (!user) {
        setGuestName('');
        setGuestEmail('');
      }

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-webdev-black relative overflow-hidden">
        <SmokeBackground />
        <Header />
        <main className="relative z-10 pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-webdev-black relative overflow-hidden">
        <SmokeBackground />
        <Header />
        <main className="relative z-10 pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-2xl text-webdev-silver mb-4">Article not found</h1>
              <Button onClick={() => navigate('/blog')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8 animate-fade-in-up">
            <Button 
              onClick={() => navigate('/blog')} 
              variant="ghost" 
              className="text-webdev-soft-gray hover:text-webdev-silver"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>

          {/* Article Header */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-light text-webdev-silver tracking-wide mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center space-x-6 text-webdev-soft-gray">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(article.published_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-webdev-darker-gray text-webdev-soft-gray text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border mb-12 animate-fade-in-up">
            {article.thumbnail_url && (
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-webdev-soft-gray leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </div>

          {/* Vote Section */}
          <div className="glass-effect rounded-2xl p-6 border border-webdev-glass-border mb-12 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-webdev-silver">Was this helpful?</h3>
              <div className="flex items-center space-x-4">
                <span className="text-webdev-soft-gray text-sm">
                  {votes.helpful_count} {votes.helpful_count === 1 ? 'person' : 'people'} found this helpful
                </span>
                <Button
                  onClick={handleVote}
                  disabled={voteLoading}
                  variant={votes.user_voted ? "default" : "outline"}
                  className={`${votes.user_voted ? 'bg-webdev-gradient-blue' : ''}`}
                >
                  <ThumbsUp className={`w-4 h-4 mr-2 ${votes.user_voted ? 'fill-current' : ''}`} />
                  {votes.user_voted ? 'Helpful' : 'Mark as Helpful'}
                </Button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-8">
              <MessageCircle className="w-5 h-5 text-webdev-gradient-blue" />
              <h3 className="text-xl font-semibold text-webdev-silver">
                Comments ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
              {!user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName" className="text-webdev-silver">Name *</Label>
                    <Input
                      id="guestName"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail" className="text-webdev-silver">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                      className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver"
                    />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="comment" className="text-webdev-silver">Comment *</Label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-webdev-darker-gray/50 border border-webdev-glass-border rounded-md text-webdev-silver placeholder-webdev-soft-gray focus:outline-none focus:border-webdev-gradient-blue focus:ring-1 focus:ring-webdev-gradient-blue transition-all resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
              <Button type="submit" disabled={commentLoading} className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple">
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-webdev-soft-gray text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-webdev-glass-border pb-6 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-webdev-silver">
                        {comment.guest_name || 'Registered User'}
                      </span>
                      <span className="text-webdev-soft-gray text-sm">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-webdev-soft-gray leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogArticle;
