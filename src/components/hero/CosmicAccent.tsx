import React, { useEffect, useMemo, useRef } from 'react';

/**
 * CosmicAccent
 * ------------
 * Renders a phrase as the brand-gradient accent with two layered effects:
 *
 *  1. Animated gradient shimmer — a brand-gradient sweeps slowly across the
 *     text. Speeds up on hover.
 *  2. Per-letter teeter-totter wobble — each letter rotates + bobs with phase
 *     offsets and slight per-letter randomness so it reads as an organic
 *     wobble rather than a metronome.
 *
 * All per-frame work is done with requestAnimationFrame and direct transform
 * writes — no React re-renders during animation.
 */
type Props = {
  text: string;
  className?: string;
};

const CosmicAccent: React.FC<Props> = ({ text, className = '' }) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const anchorRefs = useRef<Array<{ x: number; y: number } | null>>([]);
  const magneticRefs = useRef<Array<{ x: number; y: number }>>([]);
  const pointerRef = useRef({ active: false, x: 0, y: 0, strength: 0 });

  // Stable per-letter random seeds — phase offset + small amplitude jitter
  // so the wobble feels organic instead of uniform.
  const seeds = useMemo(() => {
    return text.split('').map((_, i) => {
      return {
        phase: Math.random() * Math.PI * 2 + i * 0.35,
        ampJitter: 0.85 + Math.random() * 0.3,
        rotJitter: 0.85 + Math.random() * 0.3,
        freqJitter: 0.9 + Math.random() * 0.25,
      };
    });
  }, [text]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    const start = performance.now();
    let hoverIntensity = 0;

    const measureAnchors = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      anchorRefs.current = letterRefs.current.map((el) => {
        if (!el) return null;
        return {
          x: el.offsetLeft + el.offsetWidth / 2,
          y: el.offsetTop + el.offsetHeight / 2,
        };
      });

      magneticRefs.current = text.split('').map((_, index) => magneticRefs.current[index] ?? { x: 0, y: 0 });
    };

    const syncPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        pointerRef.current.active = false;
        pointerRef.current.strength = 0;
        return;
      }

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const scaleX = wrapper.offsetWidth / Math.max(rect.width, 1);
      const scaleY = wrapper.offsetHeight / Math.max(rect.height, 1);

      pointerRef.current.active = true;
      pointerRef.current.strength = 1;
      pointerRef.current.x = (event.clientX - rect.left) * scaleX;
      pointerRef.current.y = (event.clientY - rect.top) * scaleY;
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
      pointerRef.current.strength = 0;
    };

    measureAnchors();
    document.fonts?.ready.then(measureAnchors).catch(() => undefined);
    const wrapper = wrapperRef.current;
    window.addEventListener('resize', measureAnchors);
    wrapper?.addEventListener('pointerenter', syncPointer, { passive: true });
    wrapper?.addEventListener('pointermove', syncPointer, { passive: true });
    wrapper?.addEventListener('pointerleave', clearPointer);
    wrapper?.addEventListener('pointercancel', clearPointer);
    window.addEventListener('pointerleave', clearPointer);
    window.addEventListener('blur', clearPointer);

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const pointer = pointerRef.current;
      hoverIntensity += (pointer.strength - hoverIntensity) * 0.12;
      wrapperRef.current?.style.setProperty('--cosmic-hover', hoverIntensity.toFixed(3));
      wrapperRef.current?.classList.toggle('cosmic-accent--active', hoverIntensity > 0.08);

      const wrapperWidth = wrapperRef.current?.offsetWidth ?? 240;
      const influenceRadius = Math.max(132, wrapperWidth * 0.4);
      const rotAmp = 1.45 + hoverIntensity * 1.1; // deg
      const yAmp = 1.9 + hoverIntensity * 1.15; // px
      const baseFreq = reduceMotion ? 0 : 1.05 + hoverIntensity * 0.38; // rad/s baseline

      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const seed = seeds[i];
        const anchor = anchorRefs.current[i];
        const magnetic = magneticRefs.current[i] ?? { x: 0, y: 0 };
        const wobblePhase = baseFreq * seed.freqJitter * t + seed.phase;
        // Teeter-totter: alternate sign per letter index, then add a sine
        // wobble layered on top so it's not a clean metronome.
        const sign = i % 2 === 0 ? 1 : -1;
        const wobbleSine = Math.sin(wobblePhase);
        // Add a secondary slower wave for the "unsure" feel
        const wobbleSecondary = Math.sin(wobblePhase * 0.43 + seed.phase * 1.7) * 0.45;

        let targetX = 0;
        let targetY = 0;
        let magneticForce = 0;

        if (pointer.active && anchor) {
          const dx = pointer.x - anchor.x;
          const dy = pointer.y - anchor.y;
          const distance = Math.hypot(dx, dy) || 1;
          const falloff = Math.max(0, 1 - distance / influenceRadius);
          magneticForce = falloff * falloff;
          const pull = 19 * magneticForce * hoverIntensity;
          const ripple = Math.sin(falloff * Math.PI) * 3.2 * hoverIntensity;
          targetX = (dx / distance) * pull - (dx / distance) * ripple;
          targetY = (dy / distance) * pull * 0.72 - (dy / distance) * ripple * 0.55;
        }

        magnetic.x += (targetX - magnetic.x) * 0.18;
        magnetic.y += (targetY - magnetic.y) * 0.18;
        magneticRefs.current[i] = magnetic;

        const rot =
          sign * (wobbleSine * rotAmp * seed.rotJitter + wobbleSecondary * rotAmp * seed.rotJitter * 0.4) +
          magnetic.x * 0.08;
        const ty =
          sign * (wobbleSine * yAmp * seed.ampJitter + wobbleSecondary * yAmp * seed.ampJitter * 0.5) +
          magnetic.y;

        const scale = 1 + hoverIntensity * 0.014 + magneticForce * 0.018;
        el.style.transform = `translate3d(${magnetic.x.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });

      raf = requestAnimationFrame(tick);
    };

    if (!reduceMotion) {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measureAnchors);
      wrapper?.removeEventListener('pointerenter', syncPointer);
      wrapper?.removeEventListener('pointermove', syncPointer);
      wrapper?.removeEventListener('pointerleave', clearPointer);
      wrapper?.removeEventListener('pointercancel', clearPointer);
      window.removeEventListener('pointerleave', clearPointer);
      window.removeEventListener('blur', clearPointer);
    };
  }, [seeds, text]);

  return (
    <span
      ref={wrapperRef}
      className={`cosmic-accent inline-block ${className}`}
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          className="cosmic-accent__letter inline-block will-change-transform"
          aria-hidden="true"
          style={{ transformOrigin: '50% 75%' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default CosmicAccent;
