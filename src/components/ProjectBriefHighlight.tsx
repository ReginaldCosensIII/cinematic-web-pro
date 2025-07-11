import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight } from 'lucide-react';
const highlightImage = '/lovable-uploads/50a159ac-3cf8-460a-9638-0be1d14908a6.png';

const ProjectBriefHighlight = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className="animate-fade-in-up">
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 rounded-full mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                    <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                      <Lightbulb className="w-6 h-6" stroke="url(#planning-icon-gradient)" fill="none" strokeWidth={2} />
                    </div>
                  </div>
                </div>
                <span className="text-webdev-gradient-blue font-semibold tracking-wide">PLANNING TOOL</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-webdev-silver mb-6">
                Ready to{" "}
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                  Launch?
                </span>
              </h2>
              
              <p className="text-xl text-webdev-soft-gray mb-8 leading-relaxed">
                Use our AI-powered LaunchPad to transform your ideas into action. 
                Get a comprehensive project brief that clarifies your vision and 
                helps us understand exactly what you need to succeed.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-webdev-soft-gray">
                  <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
                  Guided questions to clarify your project goals
                </div>
                <div className="flex items-center text-webdev-soft-gray">
                  <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
                  Professional brief generation in minutes
                </div>
                <div className="flex items-center text-webdev-soft-gray">
                  <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
                  Download or submit directly to our team
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link
                  to="/project-brief"
                  className="inline-flex items-center glass-effect px-8 py-4 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Brief
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Image */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <img 
                  src={highlightImage} 
                  alt="AI-powered project planning assistant"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
        </div>
        
        {/* SVG Gradient Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="planning-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      </div>
    </section>
  );
};

export default ProjectBriefHighlight;