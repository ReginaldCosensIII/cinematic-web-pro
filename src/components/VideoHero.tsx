
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const VideoHero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleExploreWork = () => {
    // Scroll to the featured work section
    const featuredWorkSection = document.querySelector('#featured-work');
    if (featuredWorkSection) {
      featuredWorkSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      {/* Main content container */}
      <div className="relative w-full max-w-6xl mx-auto text-center animate-fade-in-up">
        
        {/* Hero Text */}
        <div className="mb-8 space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-webdev-gradient-blue via-webdev-silver to-webdev-gradient-purple text-glow">
            WebDevPro
          </h1>
          <p className="text-xl md:text-2xl text-webdev-silver font-light tracking-wide">
            Custom Web Experiences • Built to Perform
          </p>
        </div>

        {/* Video Container */}
        <div className="relative mb-8">
          <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-webdev-glass-border">
            {/* YouTube Video Embed */}
            <div className="relative aspect-video bg-webdev-darker-gray">
              <iframe
                src="https://www.youtube.com/embed/XMKIu8eKOmI?autoplay=1&mute=1&loop=1&playlist=XMKIu8eKOmI&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1"
                title="WebDevPro Introduction"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsVideoLoaded(true)}
              />
              
              {/* Frosted glass overlay for loading state */}
              {!isVideoLoaded && (
                <div className="absolute inset-0 glass-effect flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full glass-effect flex items-center justify-center animate-pulse">
                      <svg 
                        width="24" 
                        height="24" 
                        fill="currentColor" 
                        className="text-webdev-silver"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-webdev-soft-gray text-sm">Loading Experience...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Subtle gradient borders for extra glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-webdev-gradient-blue via-webdev-gradient-purple to-webdev-gradient-blue opacity-20 blur-sm -z-10 rounded-3xl"></div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleExploreWork}
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple hover:from-webdev-gradient-purple hover:to-webdev-gradient-blue text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore My Work
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
          </Button>
        </div>
        
        {/* Decorative accent elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-30 blur-sm animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-r from-webdev-gradient-purple to-webdev-gradient-blue opacity-20 blur-md animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -left-8 w-6 h-6 rounded-full bg-webdev-silver opacity-10 blur-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default VideoHero;
