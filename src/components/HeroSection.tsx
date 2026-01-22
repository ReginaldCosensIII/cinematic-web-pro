
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  isVisible?: boolean;
}

const HeroSection = ({ isVisible = true }: HeroSectionProps) => {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen flex items-center justify-center px-6 py-16" 
      role="banner" 
      aria-labelledby="hero-heading"
    >
      <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
        {/* Main CTA with Blur Reveal Animation */}
        <div className="space-y-6">
          {/* Badge - Stagger 1 */}
          <div 
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border transition-all duration-700 ease-out ${
              isVisible 
                ? 'opacity-100 blur-0 translate-y-0' 
                : 'opacity-0 blur-md translate-y-4'
            }`}
            style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
            role="status" 
            aria-live="polite"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" aria-hidden="true"></div>
            <span className="text-webdev-silver text-sm">Available for new projects</span>
          </div>
          
          {/* Headline - Stagger 2 */}
          <h1 
            id="hero-heading" 
            className={`text-5xl md:text-7xl font-light tracking-tight transition-all duration-700 ease-out ${
              isVisible 
                ? 'opacity-100 blur-0 translate-y-0' 
                : 'opacity-0 blur-md translate-y-4'
            }`}
            style={{ transitionDelay: isVisible ? '250ms' : '0ms' }}
          >
            <span className="text-webdev-silver">Ready to </span>
            <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
              Transform
            </span>
            <br />
            <span className="text-webdev-silver">Your Vision?</span>
          </h1>
          
          {/* Subtext - Stagger 3 */}
          <p 
            className={`text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
              isVisible 
                ? 'opacity-100 blur-0 translate-y-0' 
                : 'opacity-0 blur-md translate-y-4'
            }`}
            style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}
          >
            Let's collaborate to create exceptional web experiences that captivate your audience and drive results.
          </p>
        </div>

        {/* CTA Button - Stagger 4 */}
        <div 
          className={`flex justify-center transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: isVisible ? '550ms' : '0ms' }}
        >
          <Link 
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="glass-effect px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden flex items-center gap-2 border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-webdev-darker-gray after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue focus:ring-offset-2 focus:ring-offset-webdev-black"
            aria-label="Start your web development project"
          >
            <span className="relative z-10">Start Your Project</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" aria-hidden="true" />
          </Link>
        </div>

        {/* View My Work Animation - Stagger 5 */}
        <div 
          className={`relative py-4 flex justify-center transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: isVisible ? '700ms' : '0ms' }}
        >
          <button 
            className="flex flex-col items-center space-y-2 animate-bounce-slow group cursor-pointer focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue focus:ring-offset-2 focus:ring-offset-webdev-black rounded-lg p-2"
            onClick={() => {
              const featuredWorkSection = document.getElementById('featuredwork');
              featuredWorkSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Scroll to view my recent work"
          >
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
