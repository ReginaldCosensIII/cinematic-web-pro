import React, { useState, useEffect } from 'react';
import { X, Download, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface LeadCaptureProps {
  type: 'exit-intent' | 'scroll' | 'time-based' | 'bottom-of-page';
  triggerDelay?: number; // milliseconds for time-based
  scrollPercentage?: number; // percentage for scroll trigger
}

const LeadCapture: React.FC<LeadCaptureProps> = ({ 
  type, 
  triggerDelay = 30000, 
  scrollPercentage = 70 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Don't show if user is signed in
    if (user) return;
    
    // Check if already shown in this session
    const sessionKey = `leadCapture_${type}_shown`;
    if (sessionStorage.getItem(sessionKey)) {
      setHasShown(true);
      return;
    }

    // Only show on blog pages for bottom-of-page type
    if (type === 'bottom-of-page') {
      const isBlogPage = location.pathname === '/blog' || location.pathname.startsWith('/blog/');
      if (!isBlogPage) return;
    }

    if (hasShown) return;

    let timeoutId: NodeJS.Timeout;
    let mouseMoveHandler: (e: MouseEvent) => void;
    let scrollHandler: () => void;

    switch (type) {
      case 'exit-intent':
        mouseMoveHandler = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            setIsVisible(true);
            setHasShown(true);
            sessionStorage.setItem(sessionKey, 'true');
          }
        };
        document.addEventListener('mouseleave', mouseMoveHandler);
        break;

      case 'scroll':
        scrollHandler = () => {
          const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (scrolled >= scrollPercentage) {
            setIsVisible(true);
            setHasShown(true);
            sessionStorage.setItem(sessionKey, 'true');
          }
        };
        window.addEventListener('scroll', scrollHandler);
        break;

      case 'bottom-of-page':
        scrollHandler = () => {
          const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (scrolled >= 90) { // Near bottom of page
            setIsVisible(true);
            setHasShown(true);
            sessionStorage.setItem(sessionKey, 'true');
          }
        };
        window.addEventListener('scroll', scrollHandler);
        break;

      case 'time-based':
        timeoutId = setTimeout(() => {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem(sessionKey, 'true');
        }, triggerDelay);
        break;
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (mouseMoveHandler) document.removeEventListener('mouseleave', mouseMoveHandler);
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
    };
  }, [type, triggerDelay, scrollPercentage, hasShown, user, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name,
          email,
          project_type: 'Lead Magnet Signup',
          message: `Signed up for lead magnet via ${type} popup`
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You'll receive your free resource shortly!",
      });

      setIsVisible(false);
      // You could trigger download or redirect here
      
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
          <p className="text-webdev-soft-gray">
            Get our comprehensive guide "10 Essential Steps to Launch Your Perfect Website" 
            and join 500+ entrepreneurs who've transformed their online presence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full glass-effect bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple text-white border-0 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Sending...' : 'Get Free Guide'}
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