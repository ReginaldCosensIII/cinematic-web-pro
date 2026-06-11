import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import HeroBackground from '../HeroBackground';
import CosmicAccent from './CosmicAccent';

/**
 * SimpleHero
 * ----------
 * On-load cascading entrance for mobile / tablet / reduced-motion users.
 * Mirrors the cinematic hero's element order and structure but plays the
 * choreography on mount instead of locking scroll.
 *
 * Element order (matches HeroChoreography):
 *   badge → "Ready to" → typewriter (gradient) → "Your Vision?" → subtext → CTA
 */
const SimpleHero: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textRef = useRef<HTMLDivElement>(null);
  const revealProgressRef = useRef<number>(1);

  const ease = [0.22, 1, 0.36, 1] as const;
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.7, delay, ease },
  });
  const fadeX = (delay: number, from: number) => ({
    initial: { opacity: 0, x: from },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, delay, ease },
  });
  const fadeScale = (delay: number) => ({
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section
      id="hero-section"
      className="relative min-h-[100svh] flex items-center justify-center px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden"
      role="banner"
      aria-labelledby="hero-heading"
    >
      <HeroBackground spotlightRef={textRef} revealProgressRef={revealProgressRef} />
      <div
        ref={textRef}
        className="text-center space-y-7 sm:space-y-9 lg:space-y-10 max-w-6xl mx-auto relative z-10 px-2 w-full"
      >
        <motion.div {...fadeUp(0.05)} className="inline-block">
          <div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect badge-hover"
            role="status"
            aria-live="polite"
          >
            <div
              className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"
              aria-hidden="true"
            />
            <span className="text-wdp-text text-sm tracking-wide">Available for new projects</span>
          </div>
        </motion.div>

        <h1
          id="hero-heading"
          className="font-light tracking-tight leading-[1.08] text-balance text-[clamp(2.45rem,6.2vw,5.65rem)]"
        >
          {/* Desktop / tablet: keep the accent as a dedicated statement line */}
          <span className="hidden sm:flex flex-col items-center gap-2 md:gap-3">
            <motion.span {...fadeX(0.18, -60)} className="block text-wdp-text">
              Let&apos;s launch your business into the
            </motion.span>
            <motion.span {...fadeScale(0.32)} className="inline-block origin-center whitespace-nowrap">
              <CosmicAccent text="Next Dimension" />
              <span className="text-wdp-text font-light">.</span>
            </motion.span>
          </span>

          {/* Mobile: three stacked lines for breathing room */}
          <span className="sm:hidden flex flex-col items-center gap-2">
            <motion.span {...fadeX(0.18, -60)} className="block text-wdp-text leading-tight">
              Let&apos;s launch your
            </motion.span>
            <motion.span {...fadeX(0.24, -40)} className="block text-wdp-text leading-tight">
              business into the
            </motion.span>
            <motion.span {...fadeScale(0.38)} className="block leading-tight origin-center whitespace-nowrap">
              <CosmicAccent text="Next Dimension" />
              <span className="text-wdp-text font-light">.</span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          {...fadeUp(0.62)}
          className="text-lg sm:text-xl text-wdp-text-secondary max-w-2xl mx-auto leading-relaxed text-balance"
        >
          Version III Web Services builds modern websites, custom web tools, and AI-powered solutions
          for businesses ready to move beyond outdated pages, manual workflows, and disconnected technology.
        </motion.p>

        <motion.div {...fadeScale(0.78)} className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/contact" onClick={() => window.scrollTo(0, 0)} aria-label="Start your project">
            <Button variant="glass" size="lg" className="group inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Start Your Project
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
          <Link to="/services" onClick={() => window.scrollTo(0, 0)} aria-label="Explore services">
            <Button variant="glass" size="lg" className="group inline-flex items-center gap-2">
              Explore Services
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none hero-bottom-fade ${
          isDark ? 'bg-gradient-to-t from-webdev-black to-transparent' : ''
        }`}
      />
    </section>
  );
};

export default SimpleHero;
