
import React, { useState } from 'react';
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
import StructuredData from '../components/StructuredData';
import GoogleAnalytics from '../components/GoogleAnalytics';
import LeadCapture from '../components/LeadCapture';
import PerformanceOptimizer from '../components/PerformanceOptimizer';

const Index = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const organizationData = {
    name: "WebDevPro.io - Reggie Cosens",
    description: "Expert web developer specializing in custom website design, full-stack development, and AI-powered solutions.",
    url: "https://webdevpro.io",
    logo: "https://webdevpro.io/logo.png",
    contactPoint: {
      telephone: "+1-555-0123",
      email: "hello@webdevpro.io",
      contactType: "customer service"
    },
    sameAs: [
      "https://www.linkedin.com/in/reggiecosens",
      "https://github.com/reggiecosens",
      "https://twitter.com/WebDevProIO"
    ]
  };

  // Service structured data
  const serviceData = {
    name: "Custom Web Development Services",
    description: "Professional web development services including custom website design, full-stack development, and AI integration.",
    provider: {
      name: "WebDevPro.io - Reggie Cosens",
      url: "https://webdevpro.io"
    },
    areaServed: "Worldwide",
    serviceType: "Web Development"
  };

  // FAQ structured data
  const faqData = {
    questions: [
      {
        question: "How long does it take to build a custom website?",
        answer: "Most custom websites take 4-8 weeks depending on complexity, features, and content requirements. I'll provide a detailed timeline during our initial consultation."
      },
      {
        question: "Do you provide ongoing maintenance and support?",
        answer: "Yes, I offer comprehensive maintenance packages including security updates, performance optimization, content updates, and technical support."
      },
      {
        question: "Can you help improve my existing website's SEO?",
        answer: "Absolutely! I specialize in SEO optimization including technical SEO, content optimization, site speed improvements, and search engine visibility enhancement."
      },
      {
        question: "What technologies do you use for web development?",
        answer: "I use modern technologies including React, TypeScript, Node.js, Next.js, and various CMS platforms. The technology stack is chosen based on your specific project requirements."
      }
    ]
  };

  return (
    <PerformanceOptimizer>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      <SEOHead 
        title="WebDevPro.io | Professional Web Developer - Custom Websites & Full-Stack Development"
        description="Expert freelance web developer specializing in custom website design, full-stack development, and AI-powered solutions. Transform your business with responsive, high-performance websites that drive results."
        keywords="web developer, freelance web developer, custom website design, full-stack development, responsive web design, SEO optimization, website redesign, web applications, AI integration, React developer, small business websites, modern website design"
        canonicalUrl="https://webdevpro.io/"
        ogImage="https://webdevpro.io/og-home.jpg"
        twitterImage="https://webdevpro.io/twitter-home.jpg"
      />
      <StructuredData type="organization" data={organizationData} />
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
      
      <div className="min-h-screen bg-webdev-black relative overflow-hidden">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-webdev-gradient-blue text-white px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        
        {/* Animated smoke background */}
        <SmokeBackground />
        
        {/* Glassmorphic header with semantic nav */}
        <Header />
        
        {/* Video Intro Section - Collapses after video ends */}
        <VideoIntro onVideoEnd={() => setVideoEnded(true)} />
        
        {/* Scroll Indicator - hide after video ends */}
        {!videoEnded && <ScrollIndicator />}
        
        {/* Main content with semantic structure */}
        <main id="main-content" className="relative z-10" role="main">
          <HeroSection isVisible={videoEnded} />
          <div className="space-y-12">
            <section id="featured-work" aria-labelledby="featured-work-heading">
              <FeaturedWork />
            </section>
            <section id="services" aria-labelledby="services-heading">
              <Services />
            </section>
            <section id="process" aria-labelledby="process-heading">
              <ProcessSection />
            </section>
            <section id="testimonials" aria-labelledby="testimonials-heading">
              <TestimonialsSection />
            </section>
            <section id="project-brief" aria-labelledby="project-brief-heading">
              <ProjectBriefHighlight />
            </section>
            <section id="cta" aria-labelledby="cta-heading">
              <CallToAction />
            </section>
          </div>
        </main>
        
        {/* Glassmorphic footer with semantic footer */}
        <Footer />
        
        {/* AI Chatbot with proper accessibility */}
        <aside role="complementary" aria-label="AI Assistant">
          <ChatBot />
        </aside>
        
        {/* Lead Capture - multiple triggers on homepage */}
        <LeadCapture type="multiple" />
      </div>
    </PerformanceOptimizer>
  );
};

export default Index;
