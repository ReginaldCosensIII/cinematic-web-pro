
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link,
  Image,
  Quote,
  Code,
  Eye,
  Edit
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    onChange(newContent);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**', 'bold text'), label: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*', 'italic text'), label: 'Italic' },
    { icon: Underline, action: () => insertMarkdown('<u>', '</u>', 'underlined text'), label: 'Underline' },
    { icon: List, action: () => insertMarkdown('- ', '', 'list item'), label: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', '', 'list item'), label: 'Numbered List' },
    { icon: Link, action: () => insertMarkdown('[', '](https://)', 'link text'), label: 'Link' },
    { icon: Image, action: () => insertMarkdown('![', '](https://)', 'alt text'), label: 'Image' },
    { icon: Quote, action: () => insertMarkdown('> ', '', 'quote'), label: 'Quote' },
    { icon: Code, action: () => insertMarkdown('`', '`', 'code'), label: 'Inline Code' },
  ];

  const renderPreview = (markdown: string) => {
    // Simple markdown to HTML conversion for preview
    let html = markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code class="bg-webdev-darker-gray px-1 rounded">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-webdev-gradient-blue pl-4 my-2 text-webdev-soft-gray">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-webdev-gradient-blue underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraphs and handle lists
    html = '<p class="mb-4">' + html + '</p>';
    html = html.replace(/<li>/g, '<ul class="list-disc list-inside mb-4"><li>').replace(/<\/li>(?![\s\S]*<li>)/g, '</li></ul>');
    
    return html;
  };

  return (
    <div className="border border-webdev-glass-border rounded-lg bg-webdev-black">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-webdev-glass-border">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            className="text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50"
            title={button.label}
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}
        <div className="ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50"
          >
            {isPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="ml-2 text-sm">{isPreview ? 'Edit' : 'Preview'}</span>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <div 
            className="p-4 text-webdev-silver prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
          />
        ) : (
          <Textarea
            id="content-editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your article content here... 

You can use Markdown formatting:
**bold**, *italic*, `code`, 
- bullet lists
1. numbered lists
> quotes
[links](https://example.com)
![images](https://example.com/image.jpg)"
            className="min-h-[300px] border-0 bg-transparent text-webdev-silver resize-none focus:ring-0 focus:border-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
