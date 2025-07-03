
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  tags: string[] | null;
  thumbnail_url: string | null;
}

const Blog = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, published_at, tags, thumbnail_url')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to load blog articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const calculateReadTime = (excerpt: string) => {
    const words = excerpt?.split(' ').length || 0;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-webdev-black relative overflow-hidden">
        <SmokeBackground />
        <Header />
        <main className="relative z-10 pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue"></div>
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
        <div className="max-w-6xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center animate-fade-in-up mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-webdev-silver tracking-wide mb-6">
              Development{' '}
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Blog
              </span>
            </h1>
            <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest trends, techniques, and insights from the world of web development.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 animate-fade-in-up">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-webdev-soft-gray w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-webdev-darker-gray/50 border border-webdev-glass-border rounded-xl text-webdev-silver placeholder-webdev-soft-gray focus:outline-none focus:border-webdev-gradient-blue focus:ring-1 focus:ring-webdev-gradient-blue transition-all"
              />
            </div>
          </div>

          {/* Articles */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-webdev-soft-gray text-lg">
                {searchTerm ? 'No articles found matching your search.' : 'No articles available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredArticles.map((article, index) => (
                <div key={article.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="glass-effect rounded-2xl p-6 border border-webdev-glass-border hover:border-webdev-glass-border/50 transition-all duration-300 cursor-pointer"
                       onClick={() => handleArticleClick(article.slug)}>
                    <div className="flex flex-col md:flex-row gap-6">
                      {article.thumbnail_url && (
                        <div className="md:w-1/3">
                          <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className={`${article.thumbnail_url ? 'md:w-2/3' : 'w-full'} flex flex-col justify-between`}>
                        <div>
                          <h2 className="text-xl md:text-2xl font-semibold text-webdev-silver mb-3 leading-tight hover:text-webdev-gradient-blue transition-colors">
                            {article.title}
                          </h2>
                          <p className="text-webdev-soft-gray mb-4 leading-relaxed">
                            {article.excerpt || 'No excerpt available.'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-webdev-glass-border">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-webdev-soft-gray text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(article.published_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center text-webdev-soft-gray text-sm">
                              <Clock className="w-4 h-4 mr-2" />
                              {calculateReadTime(article.excerpt || '')}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {article.tags && article.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-webdev-darker-gray text-webdev-soft-gray text-xs rounded">
                                {tag}
                              </span>
                            ))}
                            <ArrowRight className="w-4 h-4 text-webdev-gradient-blue" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
