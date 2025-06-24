
import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-16">
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
          <button className="glass-effect hover:glass-border px-8 py-4 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group flex items-center gap-2">
            <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative z-10">Start Your Project</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
          </button>
        </div>

        {/* View My Work Animation - positioned between button and next section */}
        <div className="pt-8 pb-12">
          <div className="group flex flex-col items-center space-y-3 cursor-pointer transition-all duration-300 hover:scale-105">
            <span className="text-webdev-silver/80 text-sm tracking-widest uppercase group-hover:text-white transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-webdev-gradient-blue group-hover:to-webdev-gradient-purple group-hover:bg-clip-text group-hover:text-transparent">
              View My Work
            </span>
            <div className="relative">
              <ArrowDown className="w-6 h-6 text-webdev-silver/60 animate-bounce group-hover:text-transparent transition-colors duration-300" />
              <div className="absolute inset-0 w-6 h-6 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm"></div>
              <ArrowDown className="absolute inset-0 w-6 h-6 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'linear-gradient(to right, #4285f4, #8a2be2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
            </div>
            <div className="w-8 h-0.5 bg-webdev-silver/30 rounded-full group-hover:bg-gradient-to-r group-hover:from-webdev-gradient-blue group-hover:to-webdev-gradient-purple transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
