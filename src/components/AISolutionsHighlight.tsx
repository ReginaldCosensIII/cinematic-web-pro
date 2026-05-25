import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aiSolutions, featuredAISolutions } from '@/data/aiSolutions';

const AISolutionsHighlight = () => {
  const featured = featuredAISolutions
    .map((slug) => aiSolutions.find((s) => s.slug === slug))
    .filter(Boolean) as typeof aiSolutions;

  return (
    <section className="py-20 relative" aria-labelledby="ai-solutions-heading">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect badge-hover">
              <Sparkles className="w-4 h-4 text-webdev-gradient-blue" />
              <span className="text-wdp-text text-sm">AI Solutions & Integrations</span>
            </div>

            <h2 id="ai-solutions-heading" className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-wdp-text">Put </span>
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                AI
              </span>
              <span className="text-wdp-text"> To Work In Your Business</span>
            </h2>

            <p className="text-xl text-wdp-text-secondary leading-relaxed max-w-3xl mx-auto">
              From AI phone answering and customer service chatbots to bespoke executive assistants and
              full workflow automation — practical AI built around your business, not a generic tool you
              have to bend yourself around.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {featured.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <Link
                  key={solution.slug}
                  to={`/services/ai-solutions#${solution.slug}`}
                  className="group card-unified card-feature rounded-xl p-8 animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="icon-gradient-container relative w-14 h-14 rounded-xl mb-6">
                    <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-wdp-text mb-3 group-hover:opacity-80 transition-opacity">
                    {solution.title}
                  </h3>
                  <p className="text-wdp-text-secondary leading-relaxed mb-6 flex-1">
                    {solution.description}
                  </p>
                  <span className="inline-flex items-center text-base text-webdev-gradient-blue hover:text-webdev-gradient-purple transition-colors duration-300 cursor-pointer group/link">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Link to="/services/ai-solutions">
              <Button variant="glass" size="lg" className="inline-flex items-center gap-2">
                Explore All AI Solutions
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISolutionsHighlight;
