import React from 'react';
import { Link } from 'react-router-dom';
import { MonitorSmartphone, Workflow, Network, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Card = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const cards: Card[] = [
  {
    icon: MonitorSmartphone,
    title: 'Outdated Websites',
    description:
      'Turn dated, slow, or unclear websites into modern digital experiences that look professional, load efficiently, and make it easier for visitors to understand what your business offers.',
  },
  {
    icon: Workflow,
    title: 'Manual Workflows',
    description:
      'Identify repetitive tasks, repeated customer questions, disconnected forms, and internal processes that could be improved with better web tools or practical AI support.',
  },
  {
    icon: Network,
    title: 'Disconnected Technology',
    description:
      'Bring structure to scattered digital systems by improving content flow, lead capture, customer communication, and the way information moves through the business.',
  },
];

const ModernizeSection: React.FC = () => {
  return (
    <section
      className="relative py-16 px-6"
      id="modernize"
      aria-labelledby="modernize-heading"
    >
      <div className="max-w-6xl mx-auto">
        <header className="text-center space-y-6 max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect badge-hover">
            <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" />
            <span className="text-wdp-text text-sm">Built for what's next</span>
          </div>

          <h2
            id="modernize-heading"
            className="text-4xl md:text-5xl font-light tracking-tight"
          >
            <span className="text-wdp-text">Built for Businesses Ready to </span>
            <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
              Modernize
            </span>
          </h2>

          <p className="text-lg md:text-xl text-wdp-text-secondary max-w-3xl mx-auto leading-relaxed">
            Many businesses are operating with outdated websites, disconnected tools, and manual
            workflows that slow them down. Version III Web Services helps identify what needs to
            improve and builds practical digital solutions that support how the business actually works.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="group card-unified card-feature rounded-xl p-8 flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="icon-gradient-container relative w-14 h-14 rounded-xl mb-6">
                  <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-wdp-text mb-3 group-hover:opacity-80 transition-opacity">
                  {card.title}
                </h3>
                <p className="text-wdp-text-secondary leading-relaxed">{card.description}</p>
              </article>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
            <Button variant="glass" size="lg" className="inline-flex items-center gap-2">
              Talk Through Your Project
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ModernizeSection;
