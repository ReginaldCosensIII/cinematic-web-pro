
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="relative w-full max-w-5xl mx-auto text-center animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-light text-webdev-silver tracking-wide mb-6">
          WebDevPro
        </h1>
        <h2 className="text-2xl md:text-3xl font-light text-webdev-soft-gray tracking-wide mb-8">
          Crafting Digital Experiences
        </h2>
        <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
          Innovative web development solutions that transform ideas into powerful digital realities. Let's build something extraordinary together.
        </p>
        
        {/* Subtle accent indicators for future gradient integration */}
        <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-20 blur-sm"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-webdev-gradient-purple to-webdev-gradient-blue opacity-15 blur-sm"></div>
      </div>
    </section>
  );
};

export default HeroSection;
