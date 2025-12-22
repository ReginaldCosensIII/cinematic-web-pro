
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="relative py-16 px-6">
      <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
        <div className="glass-effect rounded-xl overflow-hidden">
          {/* Updated image source with shorter aspect ratio */}
          <div className="w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1]">
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
              onClick={() => window.scrollTo(0, 0)}
              className="glass-effect px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden inline-block border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-webdev-darker-gray after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
            >
              <span className="relative z-10">Contact Me</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
