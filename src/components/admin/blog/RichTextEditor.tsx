
import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Quote,
  Code,
  Minus,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-webdev-silver',
      },
    },
  });

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const formatButtons = [
    { 
      icon: Heading1, 
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      label: 'Heading 1'
    },
    { 
      icon: Heading2, 
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      label: 'Heading 2'
    },
    { 
      icon: Heading3, 
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      label: 'Heading 3'
    },
    { 
      icon: Bold, 
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      label: 'Bold'
    },
    { 
      icon: Italic, 
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      label: 'Italic'
    },
    { 
      icon: List, 
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      label: 'Bullet List'
    },
    { 
      icon: ListOrdered, 
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      label: 'Numbered List'
    },
    { 
      icon: Quote, 
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      label: 'Quote'
    },
    { 
      icon: Code, 
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      label: 'Inline Code'
    },
    { 
      icon: LinkIcon, 
      action: addLink,
      isActive: editor.isActive('link'),
      label: 'Link'
    },
    { 
      icon: Minus, 
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      label: 'Horizontal Rule'
    },
  ];

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
            className={`text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50 ${
              button.isActive ? 'bg-webdev-gradient-blue/20 text-webdev-gradient-blue' : ''
            }`}
            title={button.label}
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px] bg-webdev-black">
        <EditorContent 
          editor={editor} 
          className="[&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:text-webdev-silver [&_.ProseMirror]:leading-relaxed [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:text-webdev-silver [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:text-webdev-silver [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-medium [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:text-webdev-silver [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:list-inside [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:list-inside [&_.ProseMirror_ol]:mb-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-webdev-gradient-blue [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:text-webdev-soft-gray [&_.ProseMirror_code]:bg-webdev-darker-gray [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-webdev-gradient-blue [&_.ProseMirror_a]:text-webdev-gradient-blue [&_.ProseMirror_a]:underline [&_.ProseMirror_hr]:border-webdev-glass-border [&_.ProseMirror_hr]:my-6"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
