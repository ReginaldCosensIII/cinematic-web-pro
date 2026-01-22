
import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import introVideo from '@/assets/webdevpro-intro.mp4';

interface VideoIntroProps {
  onVideoEnd?: () => void;
}

const VideoIntro = ({ onVideoEnd }: VideoIntroProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoEnd = () => {
    // Start the cinematic collapse
    setIsCollapsing(true);
    
    // After collapse animation, mark as fully collapsed and trigger callback
    setTimeout(() => {
      setIsCollapsed(true);
      onVideoEnd?.();
    }, 600); // Match animation duration
  };

  // Don't render if fully collapsed
  if (isCollapsed) {
    return null;
  }

  return (
    <section 
      className={`relative flex items-center justify-center px-6 py-8 transition-all duration-600 ease-out ${
        isCollapsing 
          ? 'h-0 opacity-0 py-0 overflow-hidden' 
          : 'h-[90vh]'
      }`}
      style={{
        transitionProperty: 'height, opacity, padding',
        transitionDuration: '600ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      aria-label="Introduction video showcase"
    >
      {/* Video Container with Glass Frame */}
      <div 
        className={`relative w-full max-w-6xl mx-auto transition-all duration-500 ${
          isCollapsing ? 'scale-95 blur-sm' : 'scale-100 blur-0'
        }`}
      >
        <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up border border-webdev-glass-border">
          {/* Video Player */}
          <div className="relative aspect-video bg-webdev-darker-gray">
            {/* Poster/Preview Image */}
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-webdev-dark-gray to-webdev-darker-gray rounded-3xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-webdev-silver">Professional Web Development</h3>
                    <p className="text-webdev-soft-gray">Loading video...</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Self-hosted HTML5 Video */}
            <video 
              ref={videoRef}
              className="w-full h-full rounded-3xl object-cover"
              autoPlay 
              muted 
              playsInline
              preload="auto"
              onLoadedData={handleVideoLoad}
              onEnded={handleVideoEnd}
            >
              <source src={introVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        {/* Subtle accent indicators */}
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-20 blur-sm"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-webdev-gradient-purple to-webdev-gradient-blue opacity-15 blur-sm"></div>
      </div>
    </section>
  );
};

export default VideoIntro;
