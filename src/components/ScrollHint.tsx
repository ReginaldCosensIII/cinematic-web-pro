import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { heroProgress } from './hero/heroProgress';

/**
 * ScrollHint
 * ----------
 * Appears centered at the bottom of the viewport after `delayMs` of inactivity.
 * Fades out the moment the user provides any scroll input (wheel, touch, key,
 * or hero progress > threshold).
 */
const ScrollHint: React.FC<{ delayMs?: number }> = ({ delayMs = 2000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setShow(false);
    };

    const onScroll = () => dismiss();
    const onWheel = () => dismiss();
    const onKey = (e: KeyboardEvent) => {
      if (
        ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Spacebar'].includes(
          e.key
        )
      ) {
        dismiss();
      }
    };
    const onTouch = () => dismiss();

    const t = setTimeout(() => {
      if (!dismissed && window.scrollY < 10) setShow(true);
    }, delayMs);

    const unsub = heroProgress.on('change', (v) => {
      if (v > 0.005) dismiss();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      clearTimeout(t);
      unsub();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [delayMs]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed bottom-6 left-0 right-0 z-30 flex justify-center"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-effect">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.7, 1, 0.7],
                boxShadow: [
                  '0 0 0 0 rgba(66,133,244,0.6)',
                  '0 0 0 6px rgba(138,43,226,0)',
                  '0 0 0 0 rgba(66,133,244,0)',
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-[11px] tracking-[0.2em] uppercase text-wdp-text-secondary">
              Scroll to begin
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollHint;
