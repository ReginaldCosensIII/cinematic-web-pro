
import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight } from 'lucide-react';
const highlightImage = '/lovable-uploads/50a159ac-3cf8-460a-9638-0be1d14908a6.png';

const ProjectBriefHighlight = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section - matching other sections style */}
          <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
                <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
                <span className="text-webdev-silver text-sm">AI Integrated</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-light tracking-tight">
                <span className="text-webdev-silver">Ready to </span>
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                  Launch?
                </span>
              </h2>
              
              <p className="text-xl text-webdev-soft-gray leading-relaxed max-w-3xl mx-auto">
                Save time, stay focused, and set your project up for success. The LaunchPad takes the guesswork out of getting started by helping you define exactly what you need.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div className="animate-fade-in-up">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <span className="text-webdev-gradient-blue font-semibold tracking-wide">PLANNING TOOL</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-webdev-silver mb-6">
                The AI{" "}
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                  LaunchPad
                </span>
              </h3>
              
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
                  className="inline-flex items-center glass-effect px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-webdev-darker-gray after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Brief
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Image - Hidden on mobile and tablet */}
            <div className="animate-fade-in-up hidden lg:block" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <img 
                  src={highlightImage} 
                  alt="AI-powered project planning assistant"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectBriefHighlight;
