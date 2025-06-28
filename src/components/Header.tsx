
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-effect backdrop-blur-xl border-b border-webdev-glass-border' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-light text-webdev-silver hover:text-white transition-colors duration-300 tracking-wide"
          >
            &lt;/WebDevPro&gt;
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm font-medium transition-all duration-300 hover:text-white ${
                  isActive(item.path) 
                    ? 'text-webdev-silver' 
                    : 'text-webdev-soft-gray'
                } group`}
              >
                {item.name}
                <span 
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple transition-all duration-300 group-hover:w-full ${
                    isActive(item.path) ? 'w-full' : ''
                  }`}
                />
              </Link>
            ))}
            
            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`relative text-sm font-medium transition-all duration-300 hover:text-white ${
                    isActive('/dashboard') 
                      ? 'text-webdev-silver' 
                      : 'text-webdev-soft-gray'
                  } group`}
                >
                  Dashboard
                  <span 
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple transition-all duration-300 group-hover:w-full ${
                      isActive('/dashboard') ? 'w-full' : ''
                    }`}
                  />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-webdev-soft-gray hover:text-webdev-silver transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`relative text-sm font-medium transition-all duration-300 hover:text-white ${
                  isActive('/auth') 
                    ? 'text-webdev-silver' 
                    : 'text-webdev-soft-gray'
                } group`}
              >
                Sign In
                <span 
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple transition-all duration-300 group-hover:w-full ${
                    isActive('/auth') ? 'w-full' : ''
                  }`}
                />
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-webdev-silver hover:text-white transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect rounded-lg border border-webdev-glass-border backdrop-blur-xl">
            <nav className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors duration-300 ${
                    isActive(item.path) 
                      ? 'text-webdev-silver' 
                      : 'text-webdev-soft-gray hover:text-webdev-silver'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium py-2 transition-colors duration-300 ${
                      isActive('/dashboard') 
                        ? 'text-webdev-silver' 
                        : 'text-webdev-soft-gray hover:text-webdev-silver'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium py-2 text-webdev-soft-gray hover:text-webdev-silver transition-colors duration-300 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors duration-300 ${
                    isActive('/auth') 
                      ? 'text-webdev-silver' 
                      : 'text-webdev-soft-gray hover:text-webdev-silver'
                  }`}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
