
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import VideoHero from '../components/VideoHero';

const Index = () => {
  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      {/* Animated smoke background */}
      <SmokeBackground />
      
      {/* Glassmorphic header */}
      <Header />
      
      {/* Main content */}
      <main className="relative z-10">
        <VideoHero />
      </main>
      
      {/* Glassmorphic footer */}
      <Footer />
    </div>
  );
};

export default Index;
