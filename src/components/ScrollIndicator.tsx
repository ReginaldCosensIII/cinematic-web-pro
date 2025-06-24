
import React from 'react';

const ScrollIndicator = () => {
  return (
    <div className="relative py-4 flex justify-center -mt-12">
      <div className="flex flex-col items-center space-y-2 animate-bounce-slow group cursor-pointer">
        <span className="text-white text-sm tracking-widest uppercase group-hover:bg-gradient-to-r group-hover:from-webdev-gradient-blue group-hover:to-webdev-gradient-purple group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          Scroll Down
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
          stroke="url(#scroll-gradient)" 
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
  );
};

export default ScrollIndicator;
