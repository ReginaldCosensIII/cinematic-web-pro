
import React from 'react';
import { Code, Palette, Search, RefreshCw } from 'lucide-react';

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
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center animate-fade-in-up mb-16">
          <h2 className="text-4xl font-light text-webdev-silver tracking-wide mb-6">
            Services
          </h2>
          <h3 className="text-xl font-light text-webdev-soft-gray tracking-wide mb-4">
            Comprehensive Web Development Solutions
          </h3>
          <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
            From concept to deployment, I deliver custom web applications, responsive designs, and scalable digital platforms that drive results and elevate your brand presence.
          </p>
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
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center mr-4">
                    <IconComponent className="w-6 h-6 text-white" />
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
            {/* Image at the top spanning full width with responsive aspect ratio */}
            <div className="w-full aspect-[2/1] sm:aspect-[18/9] md:aspect-[20/9]">
              <img 
                src="/lovable-uploads/ba50c50c-474d-42c1-983c-b5244966e5ec.png" 
                alt="Let's Build Together" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Content below the image */}
            <div className="p-8">
              <p className="text-webdev-silver text-lg leading-relaxed mb-6 tracking-wide">
                Ready to elevate your online presence? Let's build something powerful together.
              </p>
              <button className="glass-effect hover:glass-border px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-webdev-gradient-blue/20">
                Start Your Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
