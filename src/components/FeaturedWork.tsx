
import React from 'react';

const FeaturedWork = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Modern React-based shopping experience with seamless checkout",
      image: "/lovable-uploads/e5aa85ee-0948-48da-9260-74a62953c120.png",
      tech: ["React", "Node.js", "Stripe"]
    },
    {
      title: "SaaS Dashboard",
      description: "Real-time analytics and user management system",
      image: "/lovable-uploads/7d0e81ef-8dd7-40b8-b981-7dddd6bd89f4.png",
      tech: ["Vue.js", "Firebase", "Chart.js"]
    },
    {
      title: "Mobile App Landing",
      description: "Responsive landing page with app store integration",
      image: "/lovable-uploads/71b95a9c-eb0e-46ba-a82e-e946c84a5d50.png",
      tech: ["Next.js", "Tailwind", "Framer Motion"]
    }
  ];

  return (
    <section id="featured-work" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-webdev-silver mb-6 tracking-wide">
            Featured Work
          </h2>
          <p className="text-webdev-soft-gray text-lg max-w-2xl mx-auto">
            Showcasing innovative solutions that drive results and exceed expectations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group glass-effect rounded-2xl overflow-hidden hover:border-webdev-gradient-blue/30 transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-video bg-webdev-darker-gray overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-webdev-silver mb-3">
                  {project.title}
                </h3>
                <p className="text-webdev-soft-gray text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 text-xs bg-webdev-dark-gray text-webdev-soft-gray rounded-full border border-webdev-glass-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
