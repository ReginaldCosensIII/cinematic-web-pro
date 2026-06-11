import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Sparkles, Wrench, ArrowRight } from 'lucide-react';

type Card = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  cta: string;
};

const cards: Card[] = [
  {
    icon: Code2,
    title: 'Web Development Services',
    description:
      'Modern, responsive websites built with clean structure, professional design, and long-term maintainability — from new business sites to redesigns and performance improvements.',
    href: '/services/web-development',
    cta: 'Explore Web Development',
  },
  {
    icon: Sparkles,
    title: 'AI Solutions',
    description:
      'Practical AI tools that save time, improve customer communication, and make better use of your existing information — chatbots, knowledge base assistants, and workflow support.',
    href: '/services/ai-solutions',
    cta: 'Explore AI Solutions',
  },
  {
    icon: Wrench,
    title: 'Custom Web Tools',
    description:
      'Business-specific tools for teams that need more than a basic website — dashboards, forms, CMS tools, admin portals, reporting tools, and lightweight web applications.',
    href: '/contact',
    cta: 'Discuss a Custom Tool',
  },
];

const WhatWeBuild: React.FC = () => {
  return (
    <section
      className="relative py-16 px-6"
      id="what-we-build"
      aria-labelledby="what-we-build-heading"
    >
      <div className="max-w-6xl mx-auto">
        <header className="text-center space-y-6 max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect badge-hover">
            <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" />
            <span className="text-wdp-text text-sm">What We Build</span>
          </div>

          <h2
            id="what-we-build-heading"
            className="text-4xl md:text-5xl font-light tracking-tight"
          >
            <span className="text-wdp-text">Web Development and </span>
            <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
              AI Solutions
            </span>
            <span className="text-wdp-text"> for Modern Businesses</span>
          </h2>

          <p className="text-lg md:text-xl text-wdp-text-secondary max-w-3xl mx-auto leading-relaxed">
            Version III Web Services helps small to mid-sized businesses improve their digital
            presence with modern websites, custom web tools, and practical AI-powered solutions built
            around real business needs.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                onClick={() => window.scrollTo(0, 0)}
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
                <p className="text-wdp-text-secondary leading-relaxed mb-6 flex-1">
                  {card.description}
                </p>
                <span className="inline-flex items-center text-base text-webdev-gradient-blue group-hover:text-webdev-gradient-purple transition-colors duration-300">
                  {card.cta}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWeBuild;
