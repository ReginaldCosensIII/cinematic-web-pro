import React from 'react';
import { Code, Palette, Search, RefreshCw, Check, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import StructuredData from '@/components/StructuredData';

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
  ];

  return (
    <>
      <SEOHead 
        title="Web Development Services | WebDevPro"
        description="Professional web development services including custom website design, full-stack development, SEO optimization, and website redesign. Transform your digital presence."
        keywords="web development services, custom website design, full-stack development, SEO optimization, website redesign"
        canonicalUrl="https://webdevpro.io/services"
      />
      <StructuredData 
        type="service"
        data={{
          name: "Web Development Services",
          description: "Professional web development services including custom website design, full-stack development, SEO optimization, and website redesign.",
          provider: {
            name: "WebDevPro",
            url: "https://webdevpro.io"
          },
          areaServed: "Worldwide",
          serviceType: "Web Development"
        }}
      />
      
      <div className="min-h-screen bg-webdev-black">
        <Header />
        
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <header className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
                  <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
                  <span className="text-webdev-silver text-sm">Professional services</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-light tracking-tight">
                  <span className="text-webdev-silver">Web Development </span>
                  <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                    Services
                  </span>
                </h1>
                
                <p className="text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
                  From concept to deployment, I deliver custom web applications and scalable digital platforms that drive results.
                </p>
              </div>
            </header>

            {/* Services Grid */}
            <div className="space-y-16">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <article
                    key={service.title}
                    id={service.title.toLowerCase().replace(/\s+/g, '-')}
                    className="group glass-effect hover:glass-border rounded-xl p-8 md:p-12 border border-webdev-glass-border transition-all duration-500 hover:shadow-2xl hover:shadow-webdev-gradient-blue/10"
                  >
                    
                    {/* Service Header */}
                    <header className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                      <div className="relative w-16 h-16 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:rotate-12">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                          <div className="w-full h-full rounded-xl bg-webdev-dark-gray flex items-center justify-center">
                            <IconComponent 
                              className="w-8 h-8" 
                              stroke="url(#services-icon-gradient)" 
                              fill="none"
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-semibold text-webdev-silver group-hover:text-white transition-colors duration-300 mb-2">
                          {service.title}
                        </h2>
                        <p className="text-lg text-webdev-soft-gray group-hover:text-webdev-silver transition-colors duration-300">
                          {service.description}
                        </p>
                      </div>
                    </header>

                    {/* Detailed Description */}
                    <p className="text-webdev-soft-gray group-hover:text-webdev-silver transition-colors duration-300 text-lg leading-relaxed mb-10">
                      {service.detailedDescription}
                    </p>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Key Benefits */}
                      <div className="glass-effect rounded-lg p-6 border border-webdev-glass-border/50 transition-all duration-500 hover:bg-gradient-to-r hover:from-webdev-gradient-blue/20 hover:to-webdev-gradient-purple/20 hover:scale-[1.02]">
                        <h3 className="text-lg font-semibold text-webdev-silver mb-4 flex items-center gap-2">
                          <Check className="w-5 h-5 text-webdev-gradient-blue" />
                          Key Benefits
                        </h3>
                        <ul className="space-y-3">
                          {service.keyBenefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-webdev-soft-gray group-hover:text-webdev-silver transition-colors duration-300">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple mt-2 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div className="glass-effect rounded-lg p-6 border border-webdev-glass-border/50 transition-all duration-500 hover:bg-gradient-to-r hover:from-webdev-gradient-blue/20 hover:to-webdev-gradient-purple/20 hover:scale-[1.02]">
                        <h3 className="text-lg font-semibold text-webdev-silver mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-webdev-gradient-purple" />
                          Technologies & Tools
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, idx) => (
                            <span key={idx} className="px-3 py-1 text-sm glass-effect border border-webdev-glass-border rounded-full text-webdev-silver">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      <div className="glass-effect rounded-lg p-6 border border-webdev-glass-border/50 transition-all duration-500 hover:bg-gradient-to-r hover:from-webdev-gradient-blue/20 hover:to-webdev-gradient-purple/20 hover:scale-[1.02]">
                        <h3 className="text-lg font-semibold text-webdev-silver mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-webdev-gradient-blue" />
                          What You'll Receive
                        </h3>
                        <ul className="space-y-3">
                          {service.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-webdev-soft-gray group-hover:text-webdev-silver transition-colors duration-300">
                              <Check className="w-4 h-4 text-webdev-gradient-blue mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                  </article>
                );
              })}
            </div>

            {/* CTA Section */}
            <section className="mt-20 text-center">
              <div className="glass-effect rounded-xl p-8 md:p-12 border border-webdev-glass-border">
                <h2 className="text-3xl md:text-4xl font-light text-webdev-silver mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-webdev-soft-gray text-lg mb-8 max-w-2xl mx-auto">
                  Let's discuss your needs and create something exceptional together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="glass-effect px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-webdev-darker-gray after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] inline-flex items-center justify-center"
                  >
                    <span className="relative z-10">Get in Touch</span>
                  </Link>
                  <Link
                    to="/project-brief"
                    className="glass-effect px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden border-0 before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-webdev-gradient-blue before:to-webdev-gradient-purple before:-z-10 after:absolute after:inset-[1px] after:rounded-[11px] after:bg-webdev-darker-gray after:-z-10 hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] inline-flex items-center justify-center"
                  >
                    <span className="relative z-10">Start a Project Brief</span>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* SVG Gradient Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="services-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>

        <Footer />
      </div>
    </>
  );
};

export default Services;