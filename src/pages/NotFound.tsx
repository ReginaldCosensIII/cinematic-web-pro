import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEOHead 
        title="404 - Page Not Found | WebDevPro.io"
        description="The page you're looking for doesn't exist. Return to our homepage or contact us for assistance with your web development needs."
        noIndex={true}
      />
      <div className="min-h-screen bg-webdev-black relative">
        <Header />
        
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-webdev-gradient-blue mb-4">404</h1>
              <h2 className="text-3xl md:text-4xl font-bold text-webdev-silver mb-6">
                Page Not Found
              </h2>
              <p className="text-xl text-webdev-soft-gray mb-12 leading-relaxed">
                Oops! The page you're looking for seems to have vanished into the digital void. 
                Let's get you back on track.
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <Link
                to="/"
                className="w-full flex items-center justify-center glass-effect px-6 py-4 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] border border-webdev-glass-border hover:shadow-[0_0_20px_rgba(66,133,244,0.3)]"
              >
                <Home className="w-5 h-5 mr-3" />
                Return Home
              </Link>
              
              <Link
                to="/contact"
                className="w-full flex items-center justify-center glass-effect px-6 py-4 rounded-xl text-webdev-soft-gray hover:text-webdev-silver transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] border border-webdev-glass-border/50"
              >
                <Search className="w-5 h-5 mr-3" />
                Get Help
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="w-full flex items-center justify-center glass-effect px-6 py-4 rounded-xl text-webdev-soft-gray hover:text-webdev-silver transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] border border-webdev-glass-border/50"
              >
                <ArrowLeft className="w-5 h-5 mr-3" />
                Go Back
              </button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
