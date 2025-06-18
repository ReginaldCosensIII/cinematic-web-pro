
import React from 'react';

const VideoHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Video Container */}
      <div className="relative w-full max-w-5xl mx-auto px-6">
        <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
          {/* Video Player Placeholder */}
          <div className="relative aspect-video bg-webdev-darker-gray flex items-center justify-center">
            {/* Placeholder for video content */}
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full glass-effect flex items-center justify-center">
                <svg 
                  width="32" 
                  height="32" 
                  fill="currentColor" 
                  className="text-webdev-silver"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-light text-webdev-silver tracking-wide">
                  Your Story Begins Here
                </h2>
                <p className="text-webdev-soft-gray text-sm tracking-wide max-w-md mx-auto">
                  A cinematic journey through innovative web development
                </p>
              </div>
            </div>
            
            {/* Video overlay controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass-effect rounded-xl px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="text-webdev-silver hover:text-white transition-colors">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-1 bg-webdev-dark-gray rounded-full">
                      <div className="w-8 h-1 bg-webdev-silver rounded-full"></div>
                    </div>
                    <span className="text-xs text-webdev-soft-gray">0:00 / 2:30</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-webdev-soft-gray hover:text-webdev-silver transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 8.5a3.5 3.5 0 01-7 0M8.5 12V8.5" />
                    </svg>
                  </button>
                  <button className="text-webdev-soft-gray hover:text-webdev-silver transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle accent indicators for future gradient integration */}
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-20 blur-sm"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-webdev-gradient-purple to-webdev-gradient-blue opacity-15 blur-sm"></div>
      </div>
    </section>
  );
};

export default VideoHero;
