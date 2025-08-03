import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  srcSet?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes,
  srcSet,
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!loading || priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before image comes into view
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageClasses = `
    ${className}
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    transition-opacity duration-300 ease-in-out
  `.trim();

  return (
    <div className="relative overflow-hidden" ref={imgRef}>
      {/* Placeholder/Loading state */}
      {(!isLoaded && !hasError) && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-webdev-dark-gray to-webdev-darker-gray animate-pulse ${className}`}
          style={{ width, height }}
          aria-hidden="true"
        >
          {placeholder && (
            <div className="flex items-center justify-center h-full">
              <span className="text-webdev-soft-gray text-sm">{placeholder}</span>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div 
          className={`bg-webdev-darker-gray flex items-center justify-center ${className}`}
          style={{ width, height }}
          role="img"
          aria-label={`Failed to load image: ${alt}`}
        >
          <span className="text-webdev-soft-gray text-sm">Image unavailable</span>
        </div>
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={imageClasses}
          width={width}
          height={height}
          sizes={sizes}
          srcSet={srcSet}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;