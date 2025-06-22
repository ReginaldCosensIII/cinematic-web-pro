
import React from 'react';

const CallToAction = () => {
  return (
    <section className="relative py-16 px-6">
      <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
        <div className="glass-effect rounded-xl overflow-hidden">
          {/* Image at the top spanning full width */}
          <div className="w-full">
            <img 
              src="/lovable-uploads/ba50c50c-474d-42c1-983c-b5244966e5ec.png" 
              alt="Get Your Project Started" 
              className="w-full h-32 object-cover"
            />
          </div>
          
          {/* Content below the image */}
          <div className="p-8">
            <h2 className="text-3xl font-light text-webdev-silver tracking-wide mb-4">
              Get Your Project Started
            </h2>
            <p className="text-webdev-soft-gray text-lg tracking-wide mb-8 leading-relaxed">
              Ready to bring your vision to life? Let's discuss your project and create something extraordinary together.
            </p>
            <button className="glass-effect hover:glass-border px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
