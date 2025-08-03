
import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const VideoIntro = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Delay video loading to improve initial page load performance
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center px-6 py-8" aria-label="Introduction video showcase">
      {/* Video Container with Glass Frame */}
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up border border-webdev-glass-border">
          {/* Video Player */}
          <div className="relative aspect-video bg-webdev-darker-gray">
            {/* Poster/Preview Image - Replace with actual poster */}
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-webdev-dark-gray to-webdev-darker-gray rounded-3xl">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-webdev-silver">Professional Web Development</h3>
                    <p className="text-webdev-soft-gray">Watch our introduction video</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Lazy-loaded YouTube iframe */}
            {shouldLoadVideo && (
              <iframe
                src="https://www.youtube.com/embed/XMKIu8eKOmI?autoplay=1&mute=1&loop=1&playlist=XMKIu8eKOmI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
                className="w-full h-full rounded-3xl"
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
                loading="lazy"
                onLoad={handleVideoLoad}
                title="Professional Web Development Introduction Video"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
            
            {/* Future HTML5 Video Placeholder - Ready for replacement */}
            {/* 
            <video 
              className="w-full h-full rounded-3xl object-cover"
              autoPlay 
              muted 
              loop 
              playsInline
              preload="metadata"
              poster="/video-poster.jpg"
            >
              <source src="/intro-video.webm" type="video/webm" />
              <source src="/intro-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            */}
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
