
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="relative py-16 px-6">
      <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
        <div className="glass-effect rounded-xl overflow-hidden">
          <div className="w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1]">
            <img 
              src="/lovable-uploads/36f998a7-1959-4ab7-b352-a792d2cb3812.png" 
              alt="Let's Build Together" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="p-8">
            <h2 className="text-3xl font-light text-wdp-text tracking-wide mb-4">
              Get Your Project Started
            </h2>
            <p className="text-wdp-text-secondary text-lg tracking-wide mb-8 leading-relaxed">
              Ready to bring your vision to life? Let&apos;s discuss your project and create something extraordinary together.
            </p>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="glass" size="lg" className="inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Contact Me
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
