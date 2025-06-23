
import React from 'react';

const VideoIntro = () => {
  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] flex items-center justify-center overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src="https://www.youtube.com/embed/XMKIu8eKOmI?autoplay=1&mute=1&loop=1&playlist=XMKIu8eKOmI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
          className="w-full h-full object-cover"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          style={{
            minWidth: '100%',
            width: '100vw',
            height: '56.25vw', // 16:9 aspect ratio
            minHeight: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    </section>
  );
};

export default VideoIntro;
