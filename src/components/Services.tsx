
import React from 'react';
import { Code, Palette, Search, RefreshCw } from 'lucide-react';
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
    <section className="relative py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - matching HeroSection style */}
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
              <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
              <span className="text-webdev-silver text-sm">Professional services</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-webdev-silver">Web Development </span>
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Services
              </span>
            </h2>
            
            <p className="text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
              From concept to deployment, I deliver custom web applications and scalable digital platforms that drive results.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.title}
                className="group relative glass-effect hover:glass-border rounded-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-webdev-gradient-blue/10"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                
                <div className="flex items-center mb-6">
                  <div className="relative w-12 h-12 rounded-lg mr-4">
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
                  <h4 className="text-xl font-semibold text-webdev-silver group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h4>
                </div>

                <p className="text-webdev-soft-gray text-base leading-relaxed mb-6 group-hover:text-webdev-silver transition-colors duration-300">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-webdev-soft-gray group-hover:text-webdev-silver transition-colors duration-300">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple mr-3 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue/5 to-webdev-gradient-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Call to Action with responsive image */}
        <div className="text-center animate-fade-in-up">
          <div className="glass-effect rounded-xl overflow-hidden max-w-2xl mx-auto">
            {/* Image at the top spanning full width with shorter aspect ratio */}
            <div className="w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1]">
              <img 
                src="/lovable-uploads/36f998a7-1959-4ab7-b352-a792d2cb3812.png"
                alt="Let's Build Together" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Content below the image */}
            <div className="p-8">
              <p className="text-webdev-silver text-lg leading-relaxed mb-6 tracking-wide">
                Ready to elevate your online presence? Let's build something powerful together.
              </p>
              <Link 
                to="/contact"
                className="glass-effect px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg inline-block border border-transparent hover:border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="relative z-10">Start Your Project</span>
              </Link>
            </div>
          </div>
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
