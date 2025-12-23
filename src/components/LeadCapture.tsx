import React, { useState, useEffect } from 'react';
import { X, Download, BookOpen, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface LeadCaptureProps {
  type: 'exit-intent' | 'scroll' | 'time-based' | 'bottom-of-page' | 'multiple';
  triggerDelay?: number;
  scrollPercentage?: number;
}

const LeadCapture: React.FC<LeadCaptureProps> = ({ 
  type, 
  triggerDelay = 30000, 
  scrollPercentage = 70 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Don't show if user is signed in
    if (user) return;
    
    // Check if already shown in this session
    const sessionKey = `leadCapture_shown`;
    if (sessionStorage.getItem(sessionKey)) {
      setHasShown(true);
      return;
    }

    // Only show on home and blog pages
    const allowedPaths = ['/', '/blog'];
    const isAllowedPage = allowedPaths.includes(location.pathname) || 
                          location.pathname.startsWith('/blog/');
    if (!isAllowedPage) return;

    if (hasShown) return;

    let timeoutId: NodeJS.Timeout;
    let mouseMoveHandler: (e: MouseEvent) => void;
    let scrollHandler: () => void;

    const showPopup = () => {
      if (!hasShown && !sessionStorage.getItem(sessionKey)) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
    };

    // For 'multiple' type, set up both scroll and exit intent
    if (type === 'multiple') {
      // Exit intent
      mouseMoveHandler = (e: MouseEvent) => {
        if (e.clientY <= 5) {
          showPopup();
        }
      };
      document.addEventListener('mouseleave', mouseMoveHandler);

      // Scroll trigger
      scrollHandler = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= 85) {
          showPopup();
        }
      };
      window.addEventListener('scroll', scrollHandler);
    } else {
      switch (type) {
        case 'exit-intent':
          mouseMoveHandler = (e: MouseEvent) => {
            if (e.clientY <= 0) {
              showPopup();
            }
          };
          document.addEventListener('mouseleave', mouseMoveHandler);
          break;

        case 'scroll':
          scrollHandler = () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrolled >= scrollPercentage) {
              showPopup();
            }
          };
          window.addEventListener('scroll', scrollHandler);
          break;

        case 'bottom-of-page':
          scrollHandler = () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrolled >= 90) {
              showPopup();
            }
          };
          window.addEventListener('scroll', scrollHandler);
          break;

        case 'time-based':
          timeoutId = setTimeout(() => {
            showPopup();
          }, triggerDelay);
          break;
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mouseMoveHandler) document.removeEventListener('mouseleave', mouseMoveHandler);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    };
  }, [type, triggerDelay, scrollPercentage, hasShown, user, location]);

  const triggerDownload = () => {
    // Create download link for the guide
    const link = document.createElement('a');
    link.href = '/downloads/web-development-guide.txt';
    link.download = '10-Essential-Steps-Website-Guide.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email || !name) return;

    setIsSubmitting(true);
    try {
      // Insert without requiring auth - this table has public insert policy
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name,
          email,
          phone: phone || null,
          project_type: 'Lead Magnet Download',
          message: `Downloaded "10 Essential Steps to Launch Your Perfect Website" guide via ${type} popup on ${location.pathname}`,
          user_id: null // Explicitly set to null for anonymous submissions
        });

      if (error) throw error;

      // Trigger the download
      triggerDownload();

      toast({
        title: "Download Started!",
        description: "Your free guide is downloading. Check your downloads folder.",
      });

      setIsVisible(false);
      setEmail('');
      setName('');
      setPhone('');
      
    } catch (error) {
      console.error('Error submitting lead capture:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full border border-webdev-glass-border relative animate-fade-in-up">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-webdev-soft-gray hover:text-webdev-silver transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-webdev-silver mb-2">
            Free Web Development Guide
          </h3>
          <p className="text-webdev-soft-gray text-sm">
            Get our comprehensive guide <strong>"10 Essential Steps to Launch Your Perfect Website"</strong> 
            and join 500+ entrepreneurs who've transformed their online presence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-webdev-soft-gray" />
            <Input
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue pl-10"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="glass"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Processing...' : 'Download Free Guide'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-webdev-soft-gray">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadCapture;