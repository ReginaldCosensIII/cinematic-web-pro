
import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="glass-effect rounded-2xl px-8 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-webdev-silver tracking-tight">
              WebDevPro
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="text-webdev-silver hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Home
            </a>
            <a 
              href="#featuredwork" 
              className="text-webdev-soft-gray hover:text-webdev-silver transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Portfolio
            </a>
            <a 
              href="#blog" 
              className="text-webdev-soft-gray hover:text-webdev-silver transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Blog
            </a>
            <a 
              href="#contact" 
              className="text-webdev-soft-gray hover:text-webdev-silver transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-webdev-silver hover:text-white transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
