
import React from 'react';
import { ArrowRight, Code2, Palette, Rocket } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Feature cards floating around */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Code Icon */}
        <div className="absolute top-1/4 left-10 animate-float-slow">
          <div className="glass-effect p-4 rounded-xl border border-webdev-glass-border">
            <Code2 className="w-8 h-8 text-webdev-gradient-blue" />
          </div>
        </div>
        
        {/* Floating Design Icon */}
        <div className="absolute top-1/3 right-16 animate-float-delayed">
          <div className="glass-effect p-4 rounded-xl border border-webdev-glass-border">
            <Palette className="w-8 h-8 text-webdev-gradient-purple" />
          </div>
        </div>
        
        {/* Floating Rocket Icon */}
        <div className="absolute bottom-1/3 left-20 animate-float-reverse">
          <div className="glass-effect p-4 rounded-xl border border-webdev-glass-border">
            <Rocket className="w-8 h-8 text-webdev-silver" />
          </div>
        </div>
      </div>

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

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-webdev-gradient-blue/25">
            <span className="relative z-10 flex items-center space-x-2">
              <span>Start Your Project</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </button>
          
          <button className="px-8 py-4 glass-effect border border-webdev-glass-border rounded-full text-webdev-silver font-medium transition-all duration-300 hover:bg-webdev-glass hover:scale-105">
            View My Work
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
