
import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight } from 'lucide-react';
import highlightImage from '@/assets/launchpad-homepage.png';

const ProjectBriefHighlight = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect">
                <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
                <span className="text-wdp-text text-sm">AI Integrated</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-light tracking-tight">
                <span className="text-wdp-text">Ready to </span>
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Launch?</span>
              </h2>
              
              <p className="text-xl text-wdp-text-secondary leading-relaxed max-w-3xl mx-auto">
                Save time, stay focused, and set your project up for success. The LaunchPad takes the guesswork out of getting started by helping you define exactly what you need.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up text-center lg:text-left">
              <div className="flex flex-col items-center lg:flex-row lg:items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center mb-3 lg:mb-0 lg:mr-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <span className="text-webdev-gradient-blue font-semibold tracking-wide">PLANNING TOOL</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-wdp-text mb-6">
                The AI{" "}
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">LaunchPad</span>
              </h3>

              <div className="lg:hidden mb-8">
                <div className="relative max-w-md mx-auto">
                  <img src={highlightImage} alt="AI-powered project planning assistant" className="w-full rounded-2xl shadow-2xl" />
                </div>
              </div>
              
              <p className="text-xl text-wdp-text-secondary mb-8 leading-relaxed">
                Use our AI-powered LaunchPad to transform your ideas into action. Get a comprehensive project brief that clarifies your vision and helps us understand exactly what you need to succeed.
              </p>
              
              <div className="space-y-4 mb-8 inline-block text-left">
                {["Guided questions to clarify your project goals", "Professional brief generation in minutes", "Download or submit directly to our team"].map((item) => (
                  <div key={item} className="flex items-center text-wdp-text-secondary">
                    <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
                    {item}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Link
                  to="/project-brief"
                  className="inline-flex items-center glass-effect px-8 py-3 rounded-xl text-wdp-text hover:opacity-90 transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-wdp-bg-tertiary after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Brief
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="animate-fade-in-up hidden lg:block" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <img src={highlightImage} alt="AI-powered project planning assistant" className="w-full rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectBriefHighlight;
