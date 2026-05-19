
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const SmokeBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient overlay */}
      {theme === 'dark' ? (
        <div className="absolute inset-0 bg-gradient-to-b from-webdev-black via-webdev-dark-gray to-webdev-black opacity-95" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 opacity-95" />
      )}
      
      {/* Gray orb layer removed per design update — keep base gradient only.
          Hero-section colored effects live in HeroSection/VideoHero, untouched. */}
    </div>
  );
};

export default SmokeBackground;
