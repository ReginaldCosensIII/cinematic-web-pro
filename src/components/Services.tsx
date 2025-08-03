import React, { useState } from 'react';
import { Code, Palette, Search, RefreshCw, ArrowRight, Check, Globe, Database, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: "Custom Website Design",
      description: "Crafting responsive, on-brand websites that captivate and convert.",
      features: [
        "Mobile-first design",
        "Clean, user-focused layouts",
        "High-end visual polish"
      ],
      modalContent: {
        detailedDescription: "Transform your digital presence with custom website designs that perfectly reflect your brand identity. I create stunning, responsive websites that not only look amazing but also drive real business results through strategic user experience design.",
        keyBenefits: [
          "Custom brand-aligned design system",
          "Responsive design across all devices",
          "User-centered interface design",
          "Conversion optimization strategies",
          "Modern visual aesthetics",
          "Accessibility compliance"
        ],
        technologies: ["Figma", "Adobe Creative Suite", "Tailwind CSS", "React", "TypeScript"],
        deliverables: [
          "Complete design mockups",
          "Interactive prototypes", 
          "Design system documentation",
          "Responsive layouts for all screen sizes",
          "Brand guidelines and style guide"
        ]
      }
    },
    {
      icon: Code,
      title: "Full-Stack Development",
      description: "Complete front-end and back-end builds using modern code and frameworks.",
      features: [
        "HTML, CSS, JavaScript, Python (Flask)",
        "Database and API integration",
        "Performance-optimized"
      ],
      modalContent: {
        detailedDescription: "Build robust, scalable web applications with modern full-stack development. From sleek front-end interfaces to powerful back-end systems, I deliver complete solutions that handle everything from user interactions to complex data processing.",
        keyBenefits: [
          "Scalable architecture design",
          "Modern framework implementation",
          "Secure authentication systems",
          "Real-time data processing",
          "Third-party API integrations",
          "Cloud deployment and hosting"
        ],
        technologies: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Supabase", "Vercel"],
        deliverables: [
          "Complete web application",
          "Database design and setup",
          "API documentation",
          "Admin dashboard (if needed)",
          "Deployment and hosting setup"
        ]
      }
    },
    {
      icon: Search,
      title: "SEO & Optimization",
      description: "Making your site fast, discoverable, and high-performing.",
      features: [
        "On-page SEO",
        "Load time enhancements",
        "Semantic HTML structure"
      ],
      modalContent: {
        detailedDescription: "Maximize your website's visibility and performance with comprehensive SEO optimization. I implement proven strategies to improve search rankings, increase organic traffic, and enhance user experience through technical optimizations.",
        keyBenefits: [
          "Improved search engine rankings",
          "Faster page load speeds",
          "Enhanced user experience",
          "Mobile optimization",
          "Better conversion rates",
          "Increased organic traffic"
        ],
        technologies: ["Google Analytics", "Search Console", "Lighthouse", "GTMetrix", "Schema Markup"],
        deliverables: [
          "Complete SEO audit report",
          "Optimized meta tags and content",
          "Technical SEO improvements",
          "Performance optimization",
          "Analytics setup and tracking"
        ]
      }
    },
    {
      icon: RefreshCw,
      title: "Redesign & Revamp",
      description: "Give your outdated site a full makeover — sleek, modern, and high-converting.",
      features: [
        "UI/UX refresh",
        "Code cleanup or replatforming",
        "Conversion-focused updates"
      ],
      modalContent: {
        detailedDescription: "Breathe new life into your existing website with a complete redesign and modernization. I'll transform your outdated site into a modern, high-performing platform that better serves your users and business goals.",
        keyBenefits: [
          "Modern, fresh visual design",
          "Improved user experience",
          "Better mobile responsiveness",
          "Enhanced functionality",
          "Improved conversion rates",
          "Better search engine performance"
        ],
        technologies: ["React", "Modern CSS", "Progressive Web Apps", "Performance Tools", "Analytics"],
        deliverables: [
          "Complete site redesign",
          "Modernized codebase",
          "Performance improvements",
          "Mobile optimization",
          "Content migration",
          "Training and documentation"
        ]
      }
    }
  ];

  return (
    <section className="relative py-16 px-6" id="services" aria-labelledby="services-heading">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - matching HeroSection style */}
        <header className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border" role="status" aria-live="polite">
              <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" aria-hidden="true"></div>
              <span className="text-webdev-silver text-sm">Professional services</span>
            </div>
            
            <h2 id="services-heading" className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-webdev-silver">Web Development </span> 
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Services
              </span>
            </h2>
            
            <p className="text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
              From concept to deployment, I deliver custom web applications and scalable digital platforms that drive results.
            </p>
          </div>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" role="list">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <article
                key={service.title}
                className="group relative glass-effect hover:glass-border rounded-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-webdev-gradient-blue/10 h-full flex flex-col focus-within:ring-2 focus-within:ring-webdev-gradient-blue"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
                role="listitem"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                
                <header className="flex items-center mb-6">
                  <div className="relative w-12 h-12 rounded-lg mr-4" aria-hidden="true">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                      <div className="w-full h-full rounded-lg bg-webdev-dark-gray flex items-center justify-center">
                        <IconComponent 
                          className="w-6 h-6" 
                          stroke="url(#icon-gradient)" 
                          fill="none"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-webdev-silver group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>
                </header>

                <p className="text-webdev-soft-gray text-base leading-relaxed mb-6 group-hover:text-webdev-silver transition-colors duration-300">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-6 flex-grow">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-webdev-soft-gray group-hover:text-webdev-silver transition-colors duration-300">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple mr-3 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end mt-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="inline-flex items-center text-base text-webdev-gradient-blue hover:text-webdev-gradient-purple transition-colors duration-300 cursor-pointer group/link focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue focus:ring-offset-2 focus:ring-offset-webdev-black rounded-md p-2"
                        aria-label={`Learn more about ${service.title}`}
                      >
                        <ArrowRight className="w-5 h-5 mr-2 group-hover/link:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                        More Details
                      </button>
                    </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-effect border-webdev-glass-border">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-webdev-silver flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                            <div className="w-full h-full rounded-lg bg-webdev-dark-gray flex items-center justify-center">
                              <IconComponent 
                                className="w-5 h-5" 
                                stroke="url(#icon-gradient)" 
                                fill="none"
                                strokeWidth={2}
                              />
                            </div>
                          </div>
                        </div>
                        {service.title}
                      </DialogTitle>
                      <DialogDescription className="text-webdev-soft-gray text-lg leading-relaxed">
                        {service.modalContent.detailedDescription}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-8 mt-6">
                      {/* Key Benefits */}
                      <div>
                        <h4 className="text-lg font-semibold text-webdev-silver mb-4 flex items-center gap-2">
                          <Check className="w-5 h-5 text-webdev-gradient-blue" />
                          Key Benefits
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {service.modalContent.keyBenefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-webdev-soft-gray">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple mt-2 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-lg font-semibold text-webdev-silver mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-webdev-gradient-purple" />
                          Technologies & Tools
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.modalContent.technologies.map((tech, idx) => (
                            <span key={idx} className="px-3 py-1 text-sm glass-effect border border-webdev-glass-border rounded-full text-webdev-silver">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <h4 className="text-lg font-semibold text-webdev-silver mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-webdev-gradient-blue" />
                          What You'll Receive
                        </h4>
                        <div className="space-y-3">
                          {service.modalContent.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-webdev-soft-gray">
                              <Check className="w-4 h-4 text-webdev-gradient-blue mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue/5 to-webdev-gradient-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </article>
            );
          })}
        </div>


        {/* SVG Gradient Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Services;
