
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import VideoIntro from '../components/VideoIntro';
import ScrollIndicator from '../components/ScrollIndicator';
import HeroSection from '../components/HeroSection';
import FeaturedWork from '../components/FeaturedWork';
import Services from '../components/Services';
import ProcessSection from '../components/ProcessSection';
import CallToAction from '../components/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      {/* Animated smoke background */}
      <SmokeBackground />
      
      {/* Glassmorphic header */}
      <Header />
      
      {/* Video Intro Section */}
      <VideoIntro />
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
      
      {/* Main content with reduced top margin */}
      <main className="relative z-10 mt-8">
        <HeroSection />
        <FeaturedWork />
        <Services />
        <ProcessSection />
        <CallToAction />
      </main>
      
      {/* Glassmorphic footer */}
      <Footer />
    </div>
  );
};

export default Index;
