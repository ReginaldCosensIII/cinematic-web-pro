
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBlogModal = ({ isOpen, onClose }: CreateBlogModalProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    thumbnail_url: '',
    is_published: true,
  });

  const createArticleMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error('User not authenticated');

      const slug = data.slug || (await generateSlug(data.title));
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      const { error } = await supabase
        .from('blog_articles')
        .insert([{
          title: data.title,
          slug,
          excerpt: data.excerpt || null,
          content: data.content,
          author_id: user.id,
          tags: tagsArray.length > 0 ? tagsArray : null,
          thumbnail_url: data.thumbnail_url || null,
          is_published: data.is_published,
          published_at: data.is_published ? new Date().toISOString() : null,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-articles'] });
      toast({
        title: "Success",
        description: "Article created successfully",
      });
      onClose();
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: '',
        thumbnail_url: '',
        is_published: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create article: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const generateSlug = async (title: string): Promise<string> => {
    const { data, error } = await supabase
      .rpc('generate_slug', { title });
    
    if (error) throw error;
    return data;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }));
  };

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
    createArticleMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-webdev-darker-gray border border-webdev-glass-border">
        <DialogHeader>
          <DialogTitle className="text-webdev-silver">Create New Article</DialogTitle>
          <DialogDescription className="text-webdev-soft-gray">
            Add a new blog article to your site
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-webdev-silver">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
                placeholder="Enter article title"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug" className="text-webdev-silver">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-webdev-black border-webdev-glass-border text-webdev-silver font-mono"
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt" className="text-webdev-silver">Excerpt</Label>
            <Input
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
              placeholder="Brief description of the article"
            />
          </div>

          <div>
            <Label htmlFor="thumbnail_url" className="text-webdev-silver">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
              className="bg-webdev-black border-webdev-glass-border text-webdev-silver"
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          <div>
            <Label htmlFor="tags" className="text-webdev-silver">Tags</Label>
            <Input
              id="tags"
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

          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="is_published" className="text-webdev-silver">
              Publish immediately
            </Label>
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
              disabled={createArticleMutation.isPending}
              className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:opacity-90 text-white border-0"
            >
              {createArticleMutation.isPending ? 'Creating...' : 'Create Article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogModal;
