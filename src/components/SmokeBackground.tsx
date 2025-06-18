
import React, { useEffect, useState } from 'react';

const SmokeBackground = () => {
  const [smokeElements, setSmokeElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Generate random smoke elements
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 100,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 15,
    }));
    
    setSmokeElements(elements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-webdev-black via-webdev-dark-gray to-webdev-black opacity-80" />
      
      {/* Animated smoke elements */}
      {smokeElements.map((element) => (
        <div
          key={element.id}
          className="smoke-element absolute animate-smoke-float"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
          }}
        />
      ))}
      
      {/* Additional drifting elements */}
      {smokeElements.slice(0, 4).map((element) => (
        <div
          key={`drift-${element.id}`}
          className="smoke-element absolute animate-smoke-drift"
          style={{
            left: `${element.x + 20}%`,
            top: `${element.y + 10}%`,
            width: `${element.size * 0.6}px`,
            height: `${element.size * 0.6}px`,
            animationDelay: `${element.delay + 5}s`,
            animationDuration: `${element.duration + 5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SmokeBackground;
