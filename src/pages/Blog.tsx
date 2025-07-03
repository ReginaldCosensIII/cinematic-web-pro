
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import { Calendar, Clock, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  tags: string[] | null;
  thumbnail_url: string | null;
  is_pinned: boolean;
}

const ARTICLES_PER_PAGE = 10;

const Blog = () => {
  const [allArticles, setAllArticles] = useState<BlogArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<BlogArticle | null>(null);
  const [regularArticles, setRegularArticles] = useState<BlogArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArticles(regularArticles);
      setCurrentPage(1);
    } else {
      const filtered = allArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredArticles(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, regularArticles, allArticles]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, published_at, tags, thumbnail_url, is_pinned')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      const articles = data || [];
      setAllArticles(articles);

      // Find pinned article or use most recent
      const pinned = articles.find(article => article.is_pinned);
      const featured = pinned || articles[0];
      setFeaturedArticle(featured || null);

      // Get regular articles (exclude featured)
      const regular = articles.filter(article => article.id !== featured?.id);
      setRegularArticles(regular);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="max-w-6xl mx-auto px-4 md:px-6">
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

          {/* Featured Article (only show if not searching) */}
          {!searchTerm && featuredArticle && (
            <div className="mb-16 animate-fade-in-up">
              <div className="glass-effect rounded-2xl p-6 md:p-8 border border-webdev-glass-border hover:border-webdev-glass-border/50 transition-all duration-300 cursor-pointer"
                   onClick={() => handleArticleClick(featuredArticle.slug)}>
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                  {featuredArticle.thumbnail_url && (
                    <div className="lg:w-1/2">
                      <img
                        src={featuredArticle.thumbnail_url}
                        alt={featuredArticle.title}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className={`${featuredArticle.thumbnail_url ? 'lg:w-1/2' : 'w-full'} flex flex-col justify-between`}>
                    <div>
                      {featuredArticle.is_pinned && (
                        <span className="inline-block px-3 py-1 bg-webdev-gradient-blue/20 text-webdev-gradient-blue text-sm rounded-full mb-4">
                          Featured
                        </span>
                      )}
                      <h2 className="text-2xl md:text-3xl font-semibold text-webdev-silver mb-4 leading-tight hover:text-webdev-gradient-blue transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-webdev-soft-gray mb-6 leading-relaxed text-base md:text-lg">
                        {featuredArticle.excerpt || 'No excerpt available.'}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-webdev-glass-border gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-webdev-soft-gray text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(featuredArticle.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center text-webdev-soft-gray text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          {calculateReadTime(featuredArticle.excerpt || '')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {featuredArticle.tags && featuredArticle.tags.slice(0, 2).map(tag => (
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
          )}

          {/* Articles Grid */}
          {currentArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-webdev-soft-gray text-lg">
                {searchTerm ? 'No articles found matching your search.' : 'No articles available at the moment.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
                {currentArticles.map((article, index) => (
                  <div key={article.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="glass-effect rounded-2xl p-6 border border-webdev-glass-border hover:border-webdev-glass-border/50 transition-all duration-300 cursor-pointer h-full flex flex-col"
                         onClick={() => handleArticleClick(article.slug)}>
                      {article.thumbnail_url && (
                        <div className="mb-4">
                          <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="text-lg md:text-xl font-semibold text-webdev-silver mb-3 leading-tight hover:text-webdev-gradient-blue transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-webdev-soft-gray mb-4 leading-relaxed text-sm md:text-base">
                            {article.excerpt || 'No excerpt available.'}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-webdev-glass-border gap-2 sm:gap-4">
                          <div className="flex items-center space-x-3 text-webdev-soft-gray text-xs md:text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              {new Date(article.published_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              {calculateReadTime(article.excerpt || '')}
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end space-x-2">
                            <div className="flex space-x-1">
                              {article.tags && article.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-webdev-darker-gray text-webdev-soft-gray text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <ArrowRight className="w-4 h-4 text-webdev-gradient-blue flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`${
                          currentPage === page
                            ? "bg-webdev-gradient-blue text-white"
                            : "text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
