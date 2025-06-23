
import React from 'react';

const VideoIntro = () => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center px-6 py-20">
      {/* Video Container with Glass Frame */}
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up border border-webdev-glass-border">
          {/* Video Player */}
          <div className="relative aspect-video bg-webdev-darker-gray">
            <iframe
              src="https://www.youtube.com/embed/XMKIu8eKOmI?autoplay=1&mute=1&loop=1&playlist=XMKIu8eKOmI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
              className="w-full h-full rounded-3xl"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
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
