
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax calculations
  const parallaxOffset = scrollY * 0.3;
  const glowX = mousePosition.x * 100;
  const glowY = mousePosition.y * 100;

  return (
    <section 
      ref={heroRef}
      id="hero-section" 
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden" 
      role="banner" 
      aria-labelledby="hero-heading"
    >
      {/* Interactive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mouse-following gradient glow */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(66, 133, 244, 0.4) 0%, rgba(138, 43, 226, 0.2) 50%, transparent 70%)',
            left: `calc(${glowX}% - 300px)`,
            top: `calc(${glowY}% - 300px)`,
          }}
        />
        
        {/* Floating orbs with parallax */}
        <div 
          className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-webdev-gradient-blue/10 to-webdev-gradient-purple/5 blur-2xl"
          style={{ 
            top: `calc(10% - ${parallaxOffset * 0.5}px)`, 
            right: '15%',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-webdev-gradient-purple/8 to-webdev-gradient-blue/5 blur-3xl"
          style={{ 
            bottom: `calc(20% + ${parallaxOffset * 0.3}px)`, 
            left: '10%',
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(192, 192, 192, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(192, 192, 192, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translateY(${parallaxOffset * 0.1}px)`,
          }}
        />
        
        {/* Animated gradient lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-webdev-gradient-blue/20 to-transparent animate-pulse" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-webdev-gradient-purple/15 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Corner accents */}
        <div className="absolute top-20 left-20 w-32 h-32">
          <div className="absolute inset-0 border border-webdev-glass-border/30 rounded-2xl rotate-12 opacity-50" />
          <div className="absolute inset-2 border border-webdev-gradient-blue/10 rounded-xl rotate-12" />
        </div>
        <div className="absolute bottom-32 right-20 w-40 h-40">
          <div className="absolute inset-0 border border-webdev-glass-border/30 rounded-full opacity-40" />
          <div className="absolute inset-4 border border-webdev-gradient-purple/10 rounded-full" />
        </div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-webdev-gradient-blue/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              transform: `translateY(${-parallaxOffset * (0.1 + i * 0.05)}px)`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
        {/* Badge - Stagger 1 */}
        <div 
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
          role="status" 
          aria-live="polite"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" aria-hidden="true" />
          <span className="text-webdev-silver text-sm tracking-wide">Available for new projects</span>
        </div>
        
        {/* Headline - Stagger 2 */}
        <h1 
          id="hero-heading" 
          className={`text-5xl md:text-7xl font-light tracking-tight transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '250ms' }}
        >
          <span className="text-webdev-silver">Ready to </span>
          <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
            Transform
          </span>
          <br />
          <span className="text-webdev-silver">Your Vision?</span>
        </h1>
        
        {/* Subtext - Stagger 3 */}
        <p 
          className={`text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          Let's collaborate to create exceptional web experiences that captivate your audience and drive results.
        </p>

        {/* CTA Buttons - Stagger 4 */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '550ms' }}
        >
          <Link 
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="group glass-effect px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden flex items-center gap-2 border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-webdev-darker-gray after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue focus:ring-offset-2 focus:ring-offset-webdev-black"
            aria-label="Start your web development project"
          >
            <Sparkles className="w-4 h-4 relative z-10" aria-hidden="true" />
            <span className="relative z-10">Start Your Project</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" aria-hidden="true" />
          </Link>
          
          <button 
            onClick={() => {
              const featuredWorkSection = document.getElementById('featured-work');
              featuredWorkSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 rounded-xl text-webdev-soft-gray hover:text-webdev-silver transition-all duration-300 tracking-wide font-medium flex items-center gap-2 hover:bg-webdev-glass/30 focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue/50 focus:ring-offset-2 focus:ring-offset-webdev-black"
            aria-label="View my recent work"
          >
            <span>View My Work</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator - Stagger 5 */}
        <div 
          className={`pt-8 transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <div className="flex flex-col items-center space-y-2 animate-bounce-slow">
            <div className="w-6 h-10 border-2 border-webdev-glass-border rounded-full flex justify-center relative">
              <div className="w-1 h-3 bg-gradient-to-b from-webdev-gradient-blue to-webdev-gradient-purple rounded-full mt-2 animate-scroll-indicator" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-webdev-black to-transparent pointer-events-none" />

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
