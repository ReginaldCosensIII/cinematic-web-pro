
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-webdev-glass-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-webdev-silver hover:text-white transition-colors">
            &lt;/WebDev<span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Pro</span>&gt;
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                    : 'text-webdev-soft-gray hover:bg-gradient-to-r hover:from-webdev-gradient-blue hover:to-webdev-gradient-purple hover:bg-clip-text hover:text-transparent'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-webdev-silver">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-webdev-soft-gray hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="glass-effect px-4 py-2 rounded-lg text-webdev-silver hover:text-white transition-all duration-300 text-sm font-medium hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group border border-transparent hover:border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="relative z-10">Sign In</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-webdev-silver hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-webdev-black/95 backdrop-blur-lg border-b border-webdev-glass-border">
            <div className="px-6 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                      : 'text-webdev-soft-gray hover:bg-gradient-to-r hover:from-webdev-gradient-blue hover:to-webdev-gradient-purple hover:bg-clip-text hover:text-transparent'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              {user ? (
                <div className="border-t border-webdev-glass-border pt-4">
                  <div className="flex items-center gap-2 text-webdev-silver mb-3">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-webdev-soft-gray hover:text-white transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-webdev-glass-border pt-4">
                  <Link
                    to="/auth"
                    className="block text-center glass-effect px-4 py-2 rounded-lg text-webdev-silver hover:text-white transition-all duration-300 text-sm font-medium hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group border border-transparent hover:border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <span className="relative z-10">Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
