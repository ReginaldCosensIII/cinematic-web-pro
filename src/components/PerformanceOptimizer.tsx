import React, { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // Defer non-critical JavaScript
    const deferredScripts = () => {
      // Add any deferred script loading logic here
      console.log('Performance optimization loaded');
    };

    // Use requestIdleCallback for non-critical work
    if ('requestIdleCallback' in window) {
      requestIdleCallback(deferredScripts);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(deferredScripts, 1);
    }

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Critical CSS is already inlined, so we can preload other resources
      const linkElements = [
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' },
      ];

      linkElements.forEach(({ href, as }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();

    // Performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart) {
            console.log('FID:', entry.processingStart - entry.startTime);
          }
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Fallback for browsers that don't support first-input
        console.log('First Input Delay monitoring not supported');
      }

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.hadRecentInput !== undefined && !entry.hadRecentInput && entry.value) {
            clsValue += entry.value;
          }
        });
        if (clsValue > 0) {
          console.log('CLS:', clsValue);
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Fallback for browsers that don't support layout-shift
        console.log('Cumulative Layout Shift monitoring not supported');
      }
    }

    // Resource hints for future navigations
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      ];

      hints.forEach(({ rel, href, crossOrigin }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossOrigin) link.crossOrigin = crossOrigin;
        document.head.appendChild(link);
      });
    };

    addResourceHints();

    return () => {
      // Cleanup performance observers
      if ('PerformanceObserver' in window) {
        // Performance observers will be garbage collected
      }
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;