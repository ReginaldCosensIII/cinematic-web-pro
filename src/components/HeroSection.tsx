
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const ROTATING_WORDS = ['Envision', 'Design', 'Develop', 'Launch'];
const TYPING_SPEED = 100;
const DELETE_SPEED = 60;
const PAUSE_DURATION = 2000;

// Sparkle/star particle component
const HeroParticles = ({ mousePosition, parallaxOffset }: { mousePosition: { x: number; y: number }; parallaxOffset: number }) => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${5 + Math.random() * 90}%`,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      parallaxFactor: 0.02 + Math.random() * 0.08,
    }))
  , []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0
              ? 'rgba(66, 133, 244, 0.6)'
              : p.id % 3 === 1
              ? 'rgba(138, 43, 226, 0.5)'
              : 'rgba(192, 192, 192, 0.4)',
            boxShadow: p.id % 3 === 0
              ? '0 0 6px rgba(66, 133, 244, 0.4)'
              : p.id % 3 === 1
              ? '0 0 6px rgba(138, 43, 226, 0.3)'
              : '0 0 4px rgba(192, 192, 192, 0.3)',
            animation: `sparkle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            transform: `translateY(${-parallaxOffset * p.parallaxFactor}px)`,
          }}
        />
      ))}
    </>
  );
};

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Typing animation
  useEffect(() => {
    const currentWord = ROTATING_WORDS[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        }
      }
    }, isDeleting ? DELETE_SPEED : TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

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

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxOffset = scrollY * 0.3;
  const glowX = mousePosition.x * 100;
  const glowY = mousePosition.y * 100;

  // Symmetrical orb positions: one mirrors the other based on mouse
  const orbOffset = {
    x: (mousePosition.x - 0.5) * 40,
    y: (mousePosition.y - 0.5) * 30,
  };

  return (
    <section 
      ref={heroRef}
      id="hero-section" 
      className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden" 
      role="banner" 
      aria-labelledby="hero-heading"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mouse-following gradient glow */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(66, 133, 244, 0.4) 0%, rgba(138, 43, 226, 0.2) 50%, transparent 70%)',
            left: `calc(${glowX}% - 300px)`,
            top: `calc(${glowY}% - 300px)`,
          }}
        />
        
        {/* Symmetrical orb LEFT - follows mouse */}
        <div 
          className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-webdev-gradient-blue/10 to-webdev-gradient-purple/5 blur-2xl"
          style={{ 
            top: `calc(30% - ${parallaxOffset * 0.3}px)`, 
            left: '12%',
            transform: `translate(${-orbOffset.x}px, ${orbOffset.y}px)`,
            transition: 'transform 0.6s ease-out',
          }}
        />
        {/* Symmetrical orb RIGHT - mirrors mouse */}
        <div 
          className="absolute w-72 h-72 rounded-full bg-gradient-to-bl from-webdev-gradient-purple/10 to-webdev-gradient-blue/5 blur-2xl"
          style={{ 
            top: `calc(30% - ${parallaxOffset * 0.3}px)`, 
            right: '12%',
            transform: `translate(${orbOffset.x}px, ${orbOffset.y * 0.85}px)`,
            transition: 'transform 0.6s ease-out',
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
        
        {/* Sparkle particles */}
        <HeroParticles mousePosition={mousePosition} parallaxOffset={parallaxOffset} />
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
        {/* Badge */}
        <div 
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
          role="status" 
          aria-live="polite"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" aria-hidden="true" />
          <span className="text-webdev-silver text-sm tracking-wide">Available for new projects</span>
        </div>
        
        {/* Headline with typewriter - always centered, fixed width for rotating word */}
        <h1 
          id="hero-heading" 
          className={`text-5xl md:text-7xl font-light tracking-tight transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '250ms' }}
        >
          <span className="text-webdev-silver">Ready to </span>
          <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold inline-flex justify-center" style={{ minWidth: '280px', width: '280px' }}>
            <span className="text-left w-full">
              {displayText}
              <span className="inline-block w-[3px] h-[0.9em] bg-gradient-to-b from-webdev-gradient-blue to-webdev-gradient-purple ml-1 animate-pulse align-middle" />
            </span>
          </span>
          <br />
          <span className="text-webdev-silver">Your Vision?</span>
        </h1>
        
        {/* Subtext */}
        <p 
          className={`text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          Let's collaborate to create exceptional web experiences that captivate your audience and drive results.
        </p>

        {/* Single centered CTA button */}
        <div 
          className={`flex justify-center transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-4'
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
        </div>

        {/* Scroll Indicator with "View My Work" - clickable */}
        <div 
          className={`pt-8 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-4'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <button 
            onClick={() => {
              const el = document.getElementById('featured-work');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center space-y-3 animate-bounce-slow group cursor-pointer focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue/50 focus:ring-offset-2 focus:ring-offset-webdev-black rounded-lg p-2"
            aria-label="View my recent work"
          >
            <span className="text-webdev-soft-gray text-xs tracking-[0.2em] uppercase group-hover:text-webdev-silver transition-colors duration-300">
              View My Work
            </span>
            <div className="w-6 h-10 border-2 border-webdev-glass-border/60 group-hover:border-webdev-gradient-blue/40 rounded-full flex justify-center relative transition-colors duration-300">
              <div className="w-1 h-3 bg-gradient-to-b from-webdev-gradient-blue to-webdev-gradient-purple rounded-full mt-2 animate-scroll-indicator" />
            </div>
            <svg className="w-4 h-4 text-webdev-soft-gray group-hover:text-webdev-gradient-blue transition-colors duration-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-webdev-black to-transparent pointer-events-none" />

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
