import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CosmicAccent from './CosmicAccent';

const HeroChoreography: React.FC<{
  progress: MotionValue<number>;
  isMobile: boolean;
  frozen: boolean;
}> = ({ progress, isMobile, frozen }) => {
  const distance = isMobile ? 0.6 : 1;

  const badgeOpacity = useTransform(progress, [0.06, 0.12], [0, 1]);
  const badgeY = useTransform(progress, [0.06, 0.12], [-34 * distance, 0]);
  const badgeBlur = useTransform(progress, [0.06, 0.12], [10, 0]);

  const leftX = useTransform(progress, [0.1, 0.24], [-120 * distance, 0]);
  const leftOpacity = useTransform(progress, [0.1, 0.24], [0, 1]);

  const gradScale = useTransform(progress, [0.18, 0.34], [0.72, 1]);
  const gradOpacity = useTransform(progress, [0.18, 0.34], [0, 1]);

  const rightX = useTransform(progress, [0.24, 0.4], [120 * distance, 0]);
  const rightOpacity = useTransform(progress, [0.24, 0.4], [0, 1]);

  const subY = useTransform(progress, [0.36, 0.54], [32 * distance, 0]);
  const subOpacity = useTransform(progress, [0.36, 0.54], [0, 1]);
  const subBlur = useTransform(progress, [0.36, 0.54], [10, 0]);

  const ctaY = useTransform(progress, [0.52, 0.7], [38 * distance, 0]);
  const ctaOpacity = useTransform(progress, [0.52, 0.7], [0, 1]);
  const ctaScale = useTransform(progress, [0.52, 0.7], [0.92, 1]);

  const indOpacity = useTransform(progress, [0.7, 0.86], [0, 1]);
  const indY = useTransform(progress, [0.7, 0.86], [16, 0]);

  const badgeBlurStr = useTransform(badgeBlur, (value) => `blur(${value}px)`);
  const subBlurStr = useTransform(subBlur, (value) => `blur(${value}px)`);

  const selectValue = <T,>(motionValue: MotionValue<T>, finalValue: T): MotionValue<T> | T =>
    frozen ? finalValue : motionValue;

  return (
    <div className="text-center space-y-8 sm:space-y-10 lg:space-y-11 xl:space-y-12 max-w-6xl mx-auto relative z-10 px-6 pt-28 sm:pt-32 lg:pt-28 xl:pt-24">
      <motion.div
        style={{
          opacity: selectValue(badgeOpacity, 1),
          y: selectValue(badgeY, 0),
          filter: frozen ? 'blur(0px)' : badgeBlurStr,
        }}
        className="inline-block"
      >
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
          <motion.span
            style={{ x: selectValue(leftX, 0), opacity: selectValue(leftOpacity, 1) }}
            className="block text-wdp-text"
          >
            Let&apos;s launch your business into the
          </motion.span>
          <motion.span
            style={{ scale: selectValue(gradScale, 1), opacity: selectValue(gradOpacity, 1) }}
            className="inline-block origin-center whitespace-nowrap"
          >
            <CosmicAccent text="Next Dimension" />
            <span className="text-wdp-text font-light">.</span>
          </motion.span>
        </span>

        {/* Mobile: three stacked lines for breathing room */}
        <span className="sm:hidden flex flex-col items-center gap-2">
          <motion.span
            style={{ x: selectValue(leftX, 0), opacity: selectValue(leftOpacity, 1) }}
            className="block text-wdp-text leading-tight"
          >
            Let&apos;s launch your
          </motion.span>
          <motion.span
            style={{ x: selectValue(leftX, 0), opacity: selectValue(leftOpacity, 1) }}
            className="block text-wdp-text leading-tight"
          >
            business into the
          </motion.span>
          <motion.span
            style={{ scale: selectValue(gradScale, 1), opacity: selectValue(gradOpacity, 1) }}
            className="block leading-tight origin-center whitespace-nowrap"
          >
            <CosmicAccent text="Next Dimension" />
            <span className="text-wdp-text font-light">.</span>
          </motion.span>
        </span>
      </h1>

      <motion.p
        style={{
          opacity: selectValue(subOpacity, 1),
          y: selectValue(subY, 0),
          filter: frozen ? 'blur(0px)' : subBlurStr,
        }}
        className="text-lg sm:text-xl xl:text-2xl text-wdp-text-secondary max-w-2xl xl:max-w-3xl mx-auto leading-relaxed text-balance"
      >
        Crafting exceptional web experiences that captivate your audience and drive real results.
      </motion.p>

      <motion.div
        style={{
          opacity: selectValue(ctaOpacity, 1),
          y: selectValue(ctaY, 0),
          scale: selectValue(ctaScale, 1),
        }}
        className="flex justify-center"
      >
        <Link to="/contact" onClick={() => window.scrollTo(0, 0)} aria-label="Start your web development project">
          <Button variant="glass" size="lg" className="group inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Start Your Project
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Button>
        </Link>
      </motion.div>

      <motion.div style={{ opacity: selectValue(indOpacity, 1), y: selectValue(indY, 0) }} className="pt-8 flex justify-center">
        <button
          onClick={() => document.getElementById('featured-work')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center space-y-3 animate-bounce-slow group cursor-pointer focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue/50 focus:ring-offset-2 focus:ring-offset-wdp-bg rounded-lg p-2"
          aria-label="View my recent work"
        >
          <span className="text-wdp-text-secondary text-xs tracking-[0.2em] uppercase group-hover:text-wdp-text transition-colors duration-300">
            View My Work
          </span>
          <div className="w-6 h-10 border-2 border-wdp-text-secondary/30 group-hover:border-webdev-gradient-blue/40 rounded-full flex justify-center relative transition-colors duration-300">
            <div className="w-1 h-3 bg-gradient-to-b from-webdev-gradient-blue to-webdev-gradient-purple rounded-full mt-2 animate-scroll-indicator" />
          </div>
          <svg
            className="w-4 h-4 text-wdp-text-secondary group-hover:text-webdev-gradient-blue transition-colors duration-300 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default HeroChoreography;