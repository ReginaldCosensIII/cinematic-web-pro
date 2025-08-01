
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
import StructuredData from '../components/StructuredData';
import GoogleAnalytics from '../components/GoogleAnalytics';
import LeadCapture from '../components/LeadCapture';

const Index = () => {
  // Organization structured data
  const organizationData = {
    name: "Professional Web Developer",
    description: "Expert web developer specializing in custom website design, full-stack development, and AI-powered solutions.",
    url: "https://your-domain.com",
    logo: "https://your-domain.com/logo.png",
    contactPoint: {
      telephone: "+1-555-0123",
      email: "hello@your-domain.com",
      contactType: "customer service"
    },
    sameAs: [
      "https://www.linkedin.com/in/yourprofile",
      "https://github.com/yourprofile",
      "https://twitter.com/yourhandle"
    ]
  };

  // Service structured data
  const serviceData = {
    name: "Custom Web Development Services",
    description: "Professional web development services including custom website design, full-stack development, and AI integration.",
    provider: {
      name: "Professional Web Developer",
      url: "https://your-domain.com"
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
    <>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      <SEOHead 
        title="Professional Web Developer | Custom Website Design & Full-Stack Development"
        description="Expert web developer specializing in custom website design, full-stack development, and AI-powered solutions. Transform your business with responsive, high-performance websites that drive results."
        keywords="web developer, custom website design, full-stack development, responsive web design, SEO optimization, website redesign, web applications, AI integration, React developer, TypeScript developer"
        canonicalUrl="https://your-domain.com/"
        ogImage="https://your-domain.com/og-home.jpg"
        twitterImage="https://your-domain.com/twitter-home.jpg"
      />
      <StructuredData type="organization" data={organizationData} />
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="faq" data={faqData} />
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
          <Services />
          <ProcessSection />
          <TestimonialsSection />
          <ProjectBriefHighlight />
          <CallToAction />
        </div>
      </main>
      
      {/* Glassmorphic footer */}
      <Footer />
      
      {/* AI Chatbot */}
      <ChatBot />
      
      {/* Lead Capture - only bottom of page trigger on homepage */}
      </div>
    </>
  );
};

export default Index;
