
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BlogTable from '@/components/admin/blog/BlogTable';
import CreateBlogModal from '@/components/admin/blog/CreateBlogModal';
import EditBlogModal from '@/components/admin/blog/EditBlogModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminBlog = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading || adminLoading) return;
    if (!user || !isAdmin) {
      navigate(user ? '/dashboard' : '/');
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-blog-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', articleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-articles'] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete article: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const togglePinMutation = useMutation({
    mutationFn: async ({ articleId, currentPinned }: { articleId: string, currentPinned: boolean }) => {
      const { error } = await supabase
        .from('blog_articles')
        .update({ is_pinned: !currentPinned })
        .eq('id', articleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-articles'] });
      toast({
        title: "Success",
        description: "Article pin status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update pin status: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleTogglePin = (articleId: string, currentPinned: boolean) => {
    togglePinMutation.mutate({ articleId, currentPinned });
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue mx-auto mb-4"></div>
          Verifying permissions...
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Sidebar (mobile/tablet nav lives in the header menu) */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <AdminSidebar />
            </div>

            <div className="flex-1 space-y-6 md:space-y-8 min-w-0">
              {/* Header */}
              <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-light text-webdev-silver mb-2">
                      Blog <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">Management</span>
                    </h1>
                    <p className="text-webdev-soft-gray text-base md:text-lg">
                      Create and manage blog articles
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="glass"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Article
                  </Button>
                </div>
              </div>

              {/* Articles Table */}
              <div className="glass-effect rounded-2xl border border-webdev-glass-border overflow-hidden">
                <BlogTable 
                  articles={articles}
                  isLoading={isLoading}
                  onEdit={setEditingArticle}
                  onDelete={(articleId) => deleteArticleMutation.mutate(articleId)}
                  onTogglePin={handleTogglePin}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Modals */}
      <CreateBlogModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      {editingArticle && (
        <EditBlogModal 
          article={editingArticle}
          isOpen={!!editingArticle}
          onClose={() => setEditingArticle(null)}
        />
      )}
    </div>
  );
};

export default AdminBlog;
