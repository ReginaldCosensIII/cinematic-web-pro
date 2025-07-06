
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from './RichTextEditor';
import { useToast } from '@/hooks/use-toast';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author_id: string;
  thumbnail_url: string | null;
  main_image_url: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

interface EditBlogModalProps {
  article: BlogArticle;
  isOpen: boolean;
  onClose: () => void;
}

const EditBlogModal = ({ article, isOpen, onClose }: EditBlogModalProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    thumbnail_url: '',
    main_image_url: '',
    is_published: true,
    published_date: '',
  });

  useEffect(() => {
    if (article) {
      const publishedDate = article.published_at 
        ? new Date(article.published_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content,
        tags: article.tags ? article.tags.join(', ') : '',
        thumbnail_url: article.thumbnail_url || '',
        main_image_url: article.main_image_url || '',
        is_published: article.is_published,
        published_date: publishedDate,
      });
    }
  }, [article]);

  const updateArticleMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      const { error } = await supabase
        .from('blog_articles')
        .update({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || null,
          content: data.content,
          tags: tagsArray.length > 0 ? tagsArray : null,
          thumbnail_url: data.thumbnail_url || null,
          main_image_url: data.main_image_url || null,
          is_published: data.is_published,
          published_at: data.is_published ? new Date(data.published_date).toISOString() : null,
        })
        .eq('id', article.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-articles'] });
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update article: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    updateArticleMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-webdev-darker-gray border border-webdev-glass-border">
        <DialogHeader>
          <DialogTitle className="text-webdev-silver">Edit Article</DialogTitle>
          <DialogDescription className="text-webdev-soft-gray">
            Update your blog article
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-title" className="text-webdev-silver">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
                placeholder="Enter article title"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-slug" className="text-webdev-silver">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-webdev-black border-webdev-glass-border text-webdev-silver font-mono"
                placeholder="article-slug"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-excerpt" className="text-webdev-silver">Excerpt</Label>
            <Input
              id="edit-excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
              placeholder="Brief description of the article"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-thumbnail_url" className="text-webdev-silver">Thumbnail URL</Label>
              <Input
                id="edit-thumbnail_url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
                placeholder="https://example.com/thumbnail.jpg"
                type="url"
              />
            </div>
            <div>
              <Label htmlFor="edit-main_image_url" className="text-webdev-silver">Main Article Image URL</Label>
              <Input
                id="edit-main_image_url"
                value={formData.main_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, main_image_url: e.target.value }))}
                className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
                placeholder="https://example.com/main-image.jpg"
                type="url"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-tags" className="text-webdev-silver">Tags</Label>
            <Input
              id="edit-tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
              placeholder="web development, react, javascript (comma separated)"
            />
          </div>

          <div>
            <Label className="text-webdev-silver">Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="edit-published_date" className="text-webdev-silver">Published Date</Label>
              <Input
                id="edit-published_date"
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value }))}
                className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="edit-is_published" className="text-webdev-silver">
                Published
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-webdev-glass-border text-webdev-silver hover:bg-webdev-darker-gray"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateArticleMutation.isPending}
              className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90 text-white border-0"
            >
              {updateArticleMutation.isPending ? 'Updating...' : 'Update Article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogModal;
