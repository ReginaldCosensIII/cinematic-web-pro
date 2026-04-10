
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
      
      {/* Additional atmospheric layers */}
      {theme === 'dark' ? (
        <div className="absolute inset-0 bg-gradient-radial from-webdev-silver/5 via-transparent to-webdev-silver/3 opacity-40" />
      ) : (
        <div className="absolute inset-0 bg-gradient-radial from-webdev-gradient-blue/5 via-transparent to-webdev-gradient-purple/3 opacity-30" />
      )}
    </div>
  );
};

export default SmokeBackground;
