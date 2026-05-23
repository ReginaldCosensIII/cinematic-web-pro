import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Initial reveal delay in ms */
  delay?: number;
  /** When true, immediate children are revealed in sequence with `stagger` ms between each */
  stagger?: number;
}

/**
 * Premium scroll reveal — fades, lifts, scales (subtle) and unblurs into place
 * using a 1.1s cubic-bezier(0.22, 1, 0.36, 1) ease. Respects prefers-reduced-motion.
 *
 * Pass `stagger={120}` to cascade immediate children. Otherwise the whole block
 * reveals as one unit.
 */
const ScrollReveal = ({ children, className = '', delay = 0, stagger }: ScrollRevealProps) => {
  const { ref, isRevealed } = useScrollReveal(0.12);

  if (stagger) {
    const items = React.Children.toArray(children);
    return (
      <div ref={ref} className={className}>
        {items.map((child, i) => (
          <div
            key={i}
            className={`reveal-base ${isRevealed ? 'reveal-in' : ''}`}
            style={{ ['--reveal-delay' as string]: `${delay + i * stagger}ms` }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`reveal-base ${isRevealed ? 'reveal-in' : ''} ${className}`}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
