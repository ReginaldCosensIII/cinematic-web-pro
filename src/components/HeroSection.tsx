
import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
        {/* Main CTA */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
            <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
            <span className="text-webdev-silver text-sm">Available for new projects</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-light tracking-tight">
            <span className="text-webdev-silver">Ready to </span>
            <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
              Transform
            </span>
            <br />
            <span className="text-webdev-silver">Your Vision?</span>
          </h2>
          
          <p className="text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
            Let's collaborate to create exceptional web experiences that captivate your audience and drive results.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button className="glass-effect hover:glass-border px-8 py-4 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-webdev-gradient-blue/20 flex items-center gap-2">
            <span>Start Your Project</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Additional Scroll Indicator pointing to Featured Work */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2 animate-bounce-slow">
            <span className="text-webdev-silver/80 text-sm tracking-widest uppercase">
              View My Work
            </span>
            <ArrowDown className="w-6 h-6 text-webdev-silver/60 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
