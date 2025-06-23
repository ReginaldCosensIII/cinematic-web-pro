
import React from 'react';

const ScrollIndicator = () => {
  return (
    <div className="relative py-4 flex justify-center -mt-12">
      <div className="flex flex-col items-center space-y-2 animate-bounce-slow">
        <span className="text-white text-sm tracking-widest uppercase">
          Scroll Down
        </span>
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll-indicator"></div>
        </div>
        <svg 
          className="w-6 h-6 text-white/80" 
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
      </div>
    </div>
  );
};

export default ScrollIndicator;
