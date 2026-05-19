import { useEffect, useState } from 'react';

/**
 * useDevicePerformance
 * --------------------
 * Returns 'full' or 'reduced' based on user-level constraints:
 *  - prefers-reduced-motion → always 'reduced'
 *  - Save-Data header hint → 'reduced'
 *
 * 'full' devices get the cinematic scroll-driven hero.
 * 'reduced' devices get the simple on-load cascade fallback.
 *
 * SSR-safe: returns 'full' on the server, then re-evaluates on mount.
 */
export type DevicePerformance = 'full' | 'reduced';

export const useDevicePerformance = (): DevicePerformance => {
  const [perf, setPerf] = useState<DevicePerformance>('full');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const evaluate = (): DevicePerformance => {
      // Reduced motion always wins.
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return 'reduced';
      }

      const nav = navigator as Navigator & { connection?: { saveData?: boolean } };

      if (nav.connection?.saveData) return 'reduced';

      // Mobile and tablet (≤1023px) skip the scroll-lock cinematic hero and
      // use the simpler on-load cascade fallback instead.
      if (window.matchMedia?.('(max-width: 1023px)').matches) {
        return 'reduced';
      }

      // Touch-primary devices (no fine pointer) also use the fallback to
      // avoid trapping touch scroll.
      if (window.matchMedia?.('(hover: none) and (pointer: coarse)').matches) {
        return 'reduced';
      }

      return 'full';
    };

    setPerf(evaluate());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const widthMq = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setPerf(evaluate());
    mq.addEventListener?.('change', onChange);
    widthMq.addEventListener?.('change', onChange);
    return () => {
      mq.removeEventListener?.('change', onChange);
      widthMq.removeEventListener?.('change', onChange);
    };
  }, []);

  return perf;
};
