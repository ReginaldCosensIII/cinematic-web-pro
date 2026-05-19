import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 mt-24 animate-fade-in-up">
      <div className="card-unified card-cta">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-light text-wdp-text mb-4">
            Ready to build something{' '}
            <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
              exceptional
            </span>
            ?
          </h2>
          <p className="text-wdp-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your next project and create something that stands out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="glass" size="lg">
                Start a Conversation <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/project-brief" onClick={() => window.scrollTo(0, 0)}>
              <Button variant="glass" size="lg">
                Generate a Brief <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
