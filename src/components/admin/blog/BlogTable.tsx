
import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  author_id: string;
  thumbnail_url: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

interface BlogTableProps {
  articles: BlogArticle[];
  isLoading: boolean;
  onEdit: (article: BlogArticle) => void;
  onDelete: (articleId: string) => void;
}

const BlogTable = ({ articles, isLoading, onEdit, onDelete }: BlogTableProps) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue mx-auto mb-4"></div>
        <p className="text-webdev-soft-gray">Loading articles...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-webdev-soft-gray text-lg mb-2">No articles yet</p>
        <p className="text-webdev-soft-gray text-sm">Create your first blog article to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-webdev-glass-border">
            <TableHead className="text-webdev-silver">Title</TableHead>
            <TableHead className="text-webdev-silver">Slug</TableHead>
            <TableHead className="text-webdev-silver">Status</TableHead>
            <TableHead className="text-webdev-silver">Published</TableHead>
            <TableHead className="text-webdev-silver">Tags</TableHead>
            <TableHead className="text-webdev-silver">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} className="border-webdev-glass-border hover:bg-webdev-darker-gray/30">
              <TableCell className="text-webdev-silver font-medium max-w-xs">
                <div className="truncate" title={article.title}>
                  {article.title}
                </div>
              </TableCell>
              <TableCell className="text-webdev-soft-gray font-mono text-sm max-w-xs">
                <div className="truncate" title={article.slug}>
                  {article.slug}
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.is_published 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {article.is_published ? 'Published' : 'Draft'}
                </span>
              </TableCell>
              <TableCell className="text-webdev-soft-gray">
                {article.published_at 
                  ? format(new Date(article.published_at), 'MMM dd, yyyy')
                  : 'Not published'
                }
              </TableCell>
              <TableCell className="text-webdev-soft-gray">
                {article.tags && article.tags.length > 0 
                  ? article.tags.slice(0, 2).join(', ') + (article.tags.length > 2 ? '...' : '')
                  : 'No tags'
                }
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link 
                    to={`/blog/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(article)}
                    className="text-webdev-soft-gray hover:text-webdev-gradient-blue hover:bg-webdev-darker-gray/50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(article.id)}
                    className="text-webdev-soft-gray hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogTable;
