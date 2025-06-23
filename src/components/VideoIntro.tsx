
import React from 'react';

const VideoIntro = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src="https://www.youtube.com/embed/XMKIu8eKOmI?autoplay=1&mute=1&loop=1&playlist=XMKIu8eKOmI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
          className="w-full h-full object-cover"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          style={{
            minWidth: '100%',
            minHeight: '100%',
            width: '100vw',
            height: '56.25vw', // 16:9 aspect ratio
            minHeight: '100vh',
            objectFit: 'cover'
          }}
        />
      </div>
      
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 glass-effect bg-webdev-black/40"></div>
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center space-y-6 px-6">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide">
          <span className="text-webdev-silver text-glow">Brought to you by </span>
          <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
            &lt;/WebDevPro&gt;
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-webdev-silver/90 text-glow tracking-wide">
          Modern Web Solutions | WebDevPro.io
        </p>
      </div>
      
      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 animate-bounce-slow">
          <span className="text-webdev-silver/80 text-sm tracking-widest uppercase text-glow">
            Scroll Down
          </span>
          <div className="w-6 h-10 border-2 border-webdev-silver/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-webdev-gradient-blue to-webdev-gradient-purple rounded-full mt-2 animate-scroll-indicator"></div>
          </div>
          <svg 
            className="w-6 h-6 text-webdev-silver/60" 
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
    </section>
  );
};

export default VideoIntro;
