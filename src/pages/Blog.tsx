
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import { Calendar, Clock, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import StructuredData from '../components/StructuredData';
import GoogleAnalytics from '../components/GoogleAnalytics';
import LeadCapture from '../components/LeadCapture';

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

const BlogSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 md:px-6">
    <div className="text-center mb-16">
      <Skeleton className="h-12 w-80 mx-auto mb-6" />
      <Skeleton className="h-6 w-96 mx-auto" />
    </div>
    <Skeleton className="h-12 w-full max-w-md mx-auto mb-12 rounded-xl" />
    <div className="mb-16">
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-64 rounded-2xl" />
      ))}
    </div>
  </div>
);

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => { fetchArticles(); }, []);

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
      const pinned = articles.find(article => article.is_pinned);
      const featured = pinned || articles[0];
      setFeaturedArticle(featured || null);
      const regular = articles.filter(article => article.id !== featured?.id);
      setRegularArticles(regular);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({ title: "Error", description: "Failed to load blog articles", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (slug: string) => navigate(`/blog/${slug}`);
  const calculateReadTime = (excerpt: string) => {
    const words = excerpt?.split(' ').length || 0;
    return `${Math.ceil(words / 200)} min read`;
  };

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const blogData = {
    name: "Web Development Blog - WebDevPro.io",
    description: "Latest insights, tutorials, and trends in web development, design, and technology.",
    provider: { name: "WebDevPro.io - Reggie Cosens", url: "https://webdevpro.io" },
    areaServed: "Worldwide",
    serviceType: "Educational Content"
  };

  return (
    <>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      <SEOHead 
        title="Web Development Blog | Latest Insights & Tutorials - WebDevPro.io"
        description="Stay updated with the latest web development trends, tutorials, and insights."
        keywords="web development blog, React tutorials, TypeScript guides, SEO tips"
        canonicalUrl="https://webdevpro.io/blog"
      />
      <StructuredData type="service" data={blogData} />
      
      <div className="min-h-screen theme-bg relative overflow-hidden">
        <SmokeBackground /><Header />
      
        <main className="relative z-10 pt-32 pb-20">
          {loading ? (
            <BlogSkeleton />
          ) : (
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center animate-fade-in-up mb-16">
              <h1 className="text-4xl md:text-5xl font-light text-wdp-text tracking-wide mb-6">
                Web Development{' '}
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Blog</span>
              </h1>
              <p className="text-wdp-text-secondary text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
                Expert insights, tutorials, and the latest trends in web development, React, TypeScript, and modern web technologies.
              </p>
            </div>

          <div className="mb-12 animate-fade-in-up">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wdp-text-secondary w-5 h-5" />
              <input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 theme-input rounded-xl placeholder:text-wdp-text-secondary focus:ring-1 focus:ring-webdev-gradient-blue transition-all" />
            </div>
          </div>

          {!searchTerm && featuredArticle && (
            <div className="mb-16 animate-fade-in-up">
              <div className="blog-card glass-effect rounded-2xl p-6 md:p-8 cursor-pointer"
                   onClick={() => handleArticleClick(featuredArticle.slug)}>
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                     {featuredArticle.thumbnail_url && (
                       <div className="lg:w-1/2">
                         <div className="blog-card-img-wrap">
                           <img src={featuredArticle.thumbnail_url} alt={`${featuredArticle.title} - Featured article`}
                             className="blog-card-img w-full h-64 md:h-80 object-cover" />
                         </div>
                       </div>
                     )}
                  <div className={`${featuredArticle.thumbnail_url ? 'lg:w-1/2' : 'w-full'} flex flex-col justify-between`}>
                    <div>
                      {featuredArticle.is_pinned && (
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 text-webdev-gradient-blue text-sm rounded-full mb-4 border border-webdev-gradient-blue/30 font-semibold">Featured</span>
                      )}
                      <h2 className="text-2xl md:text-3xl font-semibold text-wdp-text mb-4 leading-tight hover:text-webdev-gradient-blue transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-wdp-text-secondary mb-6 leading-relaxed text-base md:text-lg">
                        {featuredArticle.excerpt || 'No excerpt available.'}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-wdp-text-secondary text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(featuredArticle.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center text-wdp-text-secondary text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          {calculateReadTime(featuredArticle.excerpt || '')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {featuredArticle.tags && featuredArticle.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="blog-tag px-2.5 py-1 text-xs rounded-full font-medium bg-gradient-to-r from-webdev-gradient-blue/10 to-webdev-gradient-purple/10 text-wdp-text-secondary border border-webdev-gradient-blue/20">{tag}</span>
                        ))}
                        <ArrowRight className="w-4 h-4 text-webdev-gradient-blue" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-wdp-text-secondary text-lg">{searchTerm ? 'No articles found matching your search.' : 'No articles available at the moment.'}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
                {currentArticles.map((article, index) => (
                  <div key={article.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="blog-card glass-effect rounded-2xl p-6 cursor-pointer h-full flex flex-col"
                         onClick={() => handleArticleClick(article.slug)}>
                       {article.thumbnail_url && (
                         <div className="mb-4">
                           <div className="blog-card-img-wrap">
                             <img src={article.thumbnail_url} alt={`${article.title} thumbnail`} className="blog-card-img w-full h-48 object-cover" />
                           </div>
                         </div>
                       )}
                      <div className="flex flex-col flex-grow">
                        <div className="flex-grow">
                          <h3 className="text-lg md:text-xl font-semibold text-wdp-text mb-3 leading-tight hover:text-webdev-gradient-blue transition-colors">{article.title}</h3>
                          <p className="text-wdp-text-secondary mb-4 leading-relaxed text-sm md:text-base">{article.excerpt || 'No excerpt available.'}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border gap-2 sm:gap-4">
                          <div className="flex items-center space-x-3 text-wdp-text-secondary text-xs md:text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              {new Date(article.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              {calculateReadTime(article.excerpt || '')}
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end space-x-2">
                            <div className="flex space-x-1">
                              {article.tags && article.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="blog-tag px-2.5 py-1 text-xs rounded-full font-medium bg-gradient-to-r from-webdev-gradient-blue/10 to-webdev-gradient-purple/10 text-wdp-text-secondary border border-webdev-gradient-blue/20">{tag}</span>
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                    className="text-wdp-text-secondary hover:text-wdp-text disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4 mr-1" />Previous
                  </Button>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button key={page} variant={currentPage === page ? "default" : "ghost"} size="sm" onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple text-white border-none" : "text-wdp-text-secondary hover:text-wdp-text"}>
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                    className="text-wdp-text-secondary hover:text-wdp-text disabled:opacity-50">
                    Next<ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              <div className="mt-16 animate-fade-in-up">
                <div className="card-unified card-cta max-w-2xl mx-auto">
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-light text-wdp-text mb-4">
                      Stay{' '}
                      <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">updated</span>
                    </h2>
                    <p className="text-wdp-text-secondary mb-6 leading-relaxed">Get the latest web development insights delivered to your inbox weekly.</p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <input type="email" placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 theme-input rounded-xl placeholder:text-wdp-text-secondary focus:ring-1 focus:ring-webdev-gradient-blue transition-all" required />
                      <Button variant="glass" className="px-6 py-3">Subscribe</Button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
          </div>
          )}
        </main>
        
        <Footer />
        <LeadCapture type="multiple" />
      </div>
    </>
  );
};

export default Blog;
