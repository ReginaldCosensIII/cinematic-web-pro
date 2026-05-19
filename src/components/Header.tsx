import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, Code, Sparkles,
  LayoutDashboard, FolderOpen, Target, Receipt, Clock, Settings as SettingsIcon,
  User as UserIcon, FileText, PenTool,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';

type ServiceLink = {
  name: string;
  path: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SERVICE_LINKS: ServiceLink[] = [
  {
    name: 'Web Development',
    path: '/services/web-development',
    description: 'Custom websites, full-stack builds, SEO & redesigns.',
    icon: Code,
  },
  {
    name: 'AI Solutions',
    path: '/services/ai-solutions',
    description: 'AI integrations, assistants, chatbots & automation.',
    icon: Sparkles,
  },
];

type PortalLink = { name: string; path: string; icon: React.ComponentType<{ className?: string }> };

const DASHBOARD_LINKS: PortalLink[] = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/dashboard/projects', icon: FolderOpen },
  { name: 'Milestones', path: '/dashboard/milestones', icon: Target },
  { name: 'Invoices', path: '/dashboard/invoices', icon: Receipt },
  { name: 'Time Tracking', path: '/dashboard/time-tracking', icon: Clock },
  { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon },
];

const ADMIN_LINKS: PortalLink[] = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Projects', path: '/admin/projects', icon: FolderOpen },
  { name: 'Clients', path: '/admin/users', icon: UserIcon },
  { name: 'Milestones', path: '/admin/milestones', icon: Target },
  { name: 'Hours Logged', path: '/admin/hours', icon: Clock },
  { name: 'Invoices', path: '/admin/invoices', icon: Receipt },
  { name: 'Blog', path: '/admin/blog', icon: PenTool },
  { name: 'Form Submissions', path: '/admin/submissions', icon: FileText },
  { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);          // desktop hover
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // mobile click
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mobilePortalOpen, setMobilePortalOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setMobilePortalOpen(false);
  }, [location.pathname]);

  // Auto-expand portal section when on a portal route
  useEffect(() => {
    if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) {
      setMobilePortalOpen(true);
    }
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

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
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'LaunchPad', path: '/project-brief' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServicesActive = location.pathname.startsWith('/services');
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';

  // Desktop hover: small delay before close so cursor can travel into menu
  const openServices = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setServicesOpen(false), 140);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -64, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-wdp-text hover:opacity-80 transition-colors duration-300 tracking-wide"
          >
            &lt;/WebDev<span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">Pro</span>&gt;
          </Link>

          {/* Desktop Navigation — hidden below lg breakpoint */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                  : 'text-wdp-text-secondary hover-gradient-text'
              }`}
            >
              Home
            </Link>

            {/* Services dropdown (hover) */}
            <div
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
            >
              <button
                type="button"
                onFocus={openServices}
                onBlur={scheduleCloseServices}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                className={`inline-flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                  isServicesActive
                    ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                    : 'text-wdp-text-secondary hover-gradient-text'
                }`}
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''} ${isServicesActive ? 'text-webdev-gradient-blue' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80"
                    role="menu"
                  >
                    <div className="glass-effect backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden">
                      {SERVICE_LINKS.map((s) => {
                        const Icon = s.icon;
                        const active = isActive(s.path);
                        return (
                          <Link
                            key={s.path}
                            to={s.path}
                            role="menuitem"
                            onClick={() => setServicesOpen(false)}
                            className="group flex items-start gap-3 p-4 transition-colors duration-200 hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                          >
                            <div className="icon-gradient-container relative w-10 h-10 rounded-lg flex-shrink-0">
                              <div className="icon-inner w-full h-full rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm font-semibold transition-colors ${
                                  active
                                    ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                                    : 'text-wdp-text group-hover:bg-gradient-to-r group-hover:from-webdev-gradient-blue group-hover:to-webdev-gradient-purple group-hover:bg-clip-text group-hover:text-transparent'
                                }`}
                              >
                                {s.name}
                              </div>
                              <p className="text-xs text-wdp-text-secondary leading-snug mt-0.5">
                                {s.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                    : 'text-wdp-text-secondary hover-gradient-text'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={dashboardPath}
                  className={`text-sm font-medium transition-all duration-300 ${
                    isActive('/dashboard') || isActive('/admin')
                      ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                      : 'text-wdp-text-secondary hover-gradient-text'
                  }`}
                >
                  Dashboard
                </Link>
                <Button variant="glass" size="sm" onClick={handleSignOut} className="tracking-wide">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="glass" size="sm" className="tracking-wide">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile/Tablet Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              className="text-wdp-text hover:opacity-80 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[640px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="glass-effect rounded-lg backdrop-blur-xl">
            <nav className="flex flex-col space-y-1 p-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium py-2 transition-colors duration-300 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                    : 'text-wdp-text-secondary hover:text-wdp-text'
                }`}
              >
                Home
              </Link>

              {/* Mobile Services accordion */}
              <button
                type="button"
                onClick={() => setMobileServicesOpen((o) => !o)}
                aria-expanded={mobileServicesOpen}
                className={`flex items-center justify-between w-full text-sm font-medium py-2 transition-colors duration-300 ${
                  isServicesActive
                    ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                    : 'text-wdp-text-secondary hover:text-wdp-text'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''} ${isServicesActive ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  mobileServicesOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-3 ml-1 border-l border-white/10 flex flex-col py-1">
                  {SERVICE_LINKS.map((s) => {
                    const Icon = s.icon;
                    const active = isActive(s.path);
                    return (
                      <Link
                        key={s.path}
                        to={s.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 py-2 px-2 rounded-md transition-colors ${
                          active
                            ? 'bg-white/5'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`} />
                        <span
                          className={`text-sm ${
                            active
                              ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-medium'
                              : 'text-wdp-text-secondary'
                          }`}
                        >
                          {s.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {navItems.slice(1).map((item) => (
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
                  {/* Mobile Portal accordion (Dashboard / Admin) */}
                  {(() => {
                    const portalLinks = isAdmin ? ADMIN_LINKS : DASHBOARD_LINKS;
                    const portalLabel = isAdmin ? 'Admin' : 'Dashboard';
                    const portalActive = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setMobilePortalOpen((o) => !o)}
                          aria-expanded={mobilePortalOpen}
                          className={`flex items-center justify-between w-full text-sm font-medium py-2 transition-colors duration-300 ${
                            portalActive
                              ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent'
                              : 'text-wdp-text-secondary hover:text-wdp-text'
                          }`}
                        >
                          <span>{portalLabel}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${mobilePortalOpen ? 'rotate-180' : ''} ${portalActive ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            mobilePortalOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="pl-3 ml-1 border-l border-white/10 flex flex-col py-1">
                            {portalLinks.map((p) => {
                              const Icon = p.icon;
                              const active = isActive(p.path);
                              return (
                                <Link
                                  key={p.path}
                                  to={p.path}
                                  onClick={() => setIsMenuOpen(false)}
                                  className={`flex items-center gap-3 py-2 px-2 rounded-md transition-colors ${
                                    active ? 'bg-white/5' : 'hover:bg-white/5'
                                  }`}
                                >
                                  <Icon className={`w-4 h-4 ${active ? 'text-webdev-gradient-blue' : 'text-wdp-text-secondary'}`} />
                                  <span
                                    className={`text-sm ${
                                      active
                                        ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-medium'
                                        : 'text-wdp-text-secondary'
                                    }`}
                                  >
                                    {p.name}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                  <Button variant="glass" size="sm" onClick={handleSignOut} className="w-full tracking-wide mt-2">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="glass" size="sm" className="w-full tracking-wide mt-2">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
