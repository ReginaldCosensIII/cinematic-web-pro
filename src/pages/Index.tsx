
import React from 'react';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import VideoIntro from '../components/VideoIntro';
import ScrollIndicator from '../components/ScrollIndicator';
import HeroSection from '../components/HeroSection';
import FeaturedWork from '../components/FeaturedWork';
import TestimonialsSection from '../components/TestimonialsSection';
import Services from '../components/Services';
import ProcessSection from '../components/ProcessSection';
import ProjectBriefHighlight from '../components/ProjectBriefHighlight';
import CallToAction from '../components/CallToAction';
import ChatBot from '../components/ChatBot';

const Index = () => {
  return (
    <>
      <SEOHead 
        title="Professional Web Developer | Custom Website Design & Full-Stack Development"
        description="Expert web developer specializing in custom website design, full-stack development, and AI-powered solutions. Transform your business with responsive, high-performance websites that drive results."
        keywords="web developer, custom website design, full-stack development, responsive web design, SEO optimization, website redesign, web applications, AI integration"
        canonicalUrl="https://your-domain.com/"
      />
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
        <div className="space-y-8 -mt-8">
          <FeaturedWork />
          <TestimonialsSection />
          <Services />
          <ProcessSection />
          <ProjectBriefHighlight />
          <CallToAction />
        </div>
      </main>
      
      {/* Glassmorphic footer */}
      <Footer />
      
      {/* AI Chatbot */}
      <ChatBot />
      </div>
    </>
  );
};

export default Index;
