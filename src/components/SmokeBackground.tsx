
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
    // Generate more smoke elements for better coverage
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 400 + 150,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 12,
    }));
    
    setSmokeElements(elements);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient overlay with more opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-webdev-black via-webdev-dark-gray to-webdev-black opacity-90" />
      
      {/* Additional atmospheric layers */}
      <div className="absolute inset-0 bg-gradient-radial from-webdev-gradient-blue/10 via-transparent to-webdev-gradient-purple/10 opacity-60" />
      
      {/* Animated smoke elements with higher opacity */}
      {smokeElements.map((element) => (
        <div
          key={element.id}
          className="smoke-element-prominent absolute animate-smoke-float"
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
      
      {/* Additional drifting elements with more visibility */}
      {smokeElements.slice(0, 6).map((element) => (
        <div
          key={`drift-${element.id}`}
          className="smoke-element-prominent absolute animate-smoke-drift"
          style={{
            left: `${element.x + 20}%`,
            top: `${element.y + 10}%`,
            width: `${element.size * 0.7}px`,
            height: `${element.size * 0.7}px`,
            animationDelay: `${element.delay + 3}s`,
            animationDuration: `${element.duration + 3}s`,
          }}
        />
      ))}
      
      {/* Floating particles for extra atmosphere */}
      {smokeElements.slice(0, 8).map((element) => (
        <div
          key={`particle-${element.id}`}
          className="smoke-particle absolute animate-smoke-float"
          style={{
            left: `${element.x + 40}%`,
            top: `${element.y + 20}%`,
            width: `${element.size * 0.3}px`,
            height: `${element.size * 0.3}px`,
            animationDelay: `${element.delay + 7}s`,
            animationDuration: `${element.duration + 10}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SmokeBackground;
