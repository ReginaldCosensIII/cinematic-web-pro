
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="relative py-16 px-6">
      <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
        <div className="glass-effect rounded-xl overflow-hidden">
          {/* Updated image source */}
          <div className="w-full aspect-[2/1] sm:aspect-[18/9] md:aspect-[20/9]">
            <img 
              src="/lovable-uploads/36f998a7-1959-4ab7-b352-a792d2cb3812.png" 
              alt="Let's Build Together" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* Content below the image */}
          <div className="p-8">
            <h2 className="text-3xl font-light text-webdev-silver tracking-wide mb-4">
              Get Your Project Started
            </h2>
            <p className="text-webdev-soft-gray text-lg tracking-wide mb-8 leading-relaxed">
              Ready to bring your vision to life? Let&apos;s discuss your project and create something extraordinary together.
            </p>
            <Link 
              to="/contact"
              className="glass-effect hover:glass-border px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-webdev-gradient-blue/20 inline-block"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
