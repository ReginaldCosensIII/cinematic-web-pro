import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      setIsMenuOpen(false);
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'LaunchPad', path: '/project-brief' }
  ];

  const isActive = (path: string) => location.pathname === path;
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-wdp-text hover:opacity-80 transition-colors duration-300 tracking-wide"
          >
            &lt;/WebDev<span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">Pro</span>&gt;
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-webdev-gradient-blue ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                    : 'text-wdp-text-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-effect transition-all duration-300 hover:scale-105"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-wdp-text-secondary hover:text-yellow-400 transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-wdp-text-secondary hover:text-webdev-gradient-purple transition-colors" />
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={dashboardPath}
                  className={`text-sm font-medium transition-all duration-300 hover:text-webdev-gradient-blue ${
                    isActive('/dashboard') || isActive('/admin')
                      ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                      : 'text-wdp-text-secondary'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="glass-effect px-4 py-2 rounded-xl text-wdp-text hover:opacity-80 transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-wdp-bg-tertiary after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm"
                >
                  <span className="relative z-10">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="glass-effect px-4 py-2 rounded-xl text-wdp-text hover:opacity-80 transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-wdp-bg-tertiary after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm"
              >
                <span className="relative z-10">Sign In</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg glass-effect transition-all duration-300"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-wdp-text-secondary" />
              ) : (
                <Moon className="w-4 h-4 text-wdp-text-secondary" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="text-wdp-text hover:opacity-80 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-effect rounded-lg backdrop-blur-xl">
            <nav className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                      : 'text-wdp-text-secondary hover:text-wdp-text'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-sm font-medium py-2 transition-colors duration-300 ${
                      isActive('/dashboard') || isActive('/admin')
                        ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                        : 'text-wdp-text-secondary hover:text-wdp-text'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="glass-effect px-4 py-2 rounded-xl text-wdp-text hover:opacity-80 transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-wdp-bg-tertiary after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] inline-block text-center mt-2 text-sm"
                  >
                    <span className="relative z-10">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="glass-effect px-4 py-2 rounded-xl text-wdp-text hover:opacity-80 transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-wdp-bg-tertiary after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] inline-block text-center mt-2 text-sm"
                >
                  <span className="relative z-10">Sign In</span>
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
