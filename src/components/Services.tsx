import React from 'react';
import { Code, Palette, Search, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      ]
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
                  <div className="relative w-12 h-12 rounded-lg mr-4 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true">
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
                  <Link 
                    to="/services"
                    className="inline-flex items-center text-base text-webdev-gradient-blue hover:text-webdev-gradient-purple transition-colors duration-300 cursor-pointer group/link focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue focus:ring-offset-2 focus:ring-offset-webdev-black rounded-md p-2"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <ArrowRight className="w-5 h-5 mr-2 group-hover/link:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                    More Details
                  </Link>
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
