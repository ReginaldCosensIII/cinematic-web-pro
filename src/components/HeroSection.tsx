
import React from 'react';
import { Link } from 'react-router-dom';
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
          <Link 
            to="/contact"
            className="glass-effect px-8 py-4 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group flex items-center gap-2 border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
          >
            <span className="relative z-10">Start Your Project</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
          </Link>
        </div>

        {/* View My Work Animation */}
        <div className="relative py-4 flex justify-center">
          <div className="flex flex-col items-center space-y-2 animate-bounce-slow group cursor-pointer">
            <span className="text-white text-sm tracking-widest uppercase group-hover:bg-gradient-to-r group-hover:from-webdev-gradient-blue group-hover:to-webdev-gradient-purple group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              View My Work
            </span>
            <div className="w-6 h-10 border-2 border-white/60 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-webdev-gradient-blue group-hover:to-webdev-gradient-purple rounded-full flex justify-center relative group-hover:p-0.5 transition-all duration-300">
              <div className="w-6 h-10 bg-webdev-black rounded-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0.5">
                <div className="w-1 h-3 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full mt-2 animate-scroll-indicator"></div>
              </div>
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll-indicator group-hover:opacity-0 transition-opacity duration-300"></div>
            </div>
            <svg 
              className="w-6 h-6 text-white/80 group-hover:text-transparent transition-colors duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
            {/* Gradient overlay for SVG on hover */}
            <svg 
              className="w-6 h-6 absolute bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              fill="none" 
              stroke="url(#view-work-gradient)" 
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient id="view-work-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285f4" />
                  <stop offset="100%" stopColor="#8a2be2" />
                </linearGradient>
              </defs>
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
