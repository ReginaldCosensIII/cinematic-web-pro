
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-50 p-6 mt-20">
      <div className="glass-effect rounded-2xl px-8 py-4 mx-auto max-w-7xl">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center">
          {/* Social Icons - Left */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-webdev-soft-gray hover:text-webdev-gradient-blue transition-colors duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-webdev-soft-gray hover:text-webdev-gradient-blue transition-colors duration-300">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-webdev-soft-gray hover:text-webdev-gradient-blue transition-colors duration-300">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-webdev-soft-gray hover:text-webdev-gradient-blue transition-colors duration-300">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
          
          {/* Copyright - Center */}
          <p className="text-webdev-soft-gray text-sm tracking-wide">
            © 2025 WebDevPro
          </p>
          
          {/* Legal Links - Right */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/privacy-policy" 
              className="text-webdev-soft-gray hover:text-webdev-gradient-blue transition-colors duration-300 text-sm"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              className="text-webdev-soft-gray hover:text-webdev-gradient-blue transition-colors duration-300 text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden flex justify-center">
          <p className="text-webdev-soft-gray text-sm tracking-wide">
            © 2025 WebDevPro
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
