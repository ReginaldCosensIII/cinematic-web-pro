
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FeaturedWork = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Modern React-based shopping experience with seamless checkout",
      image: "/lovable-uploads/e5aa85ee-0948-48da-9260-74a62953c120.png",
      tech: ["React", "Node.js", "Stripe"],
      screenshots: [
        "/lovable-uploads/9154fb15-329e-4f5c-bcad-940c5bd37a8f.png",
        "/lovable-uploads/5aef6e8e-f3fe-4ea2-b871-4c5bf0c2c6b8.png",
        "/lovable-uploads/8e0811d7-8dde-45bb-be7c-303e5fc041bb.png",
        "/lovable-uploads/34e6df57-67aa-4aab-9114-e87d0e70b007.png",
        "/lovable-uploads/79b73498-c4fb-4ab7-bfab-1f9f8d66273c.png",
        "/lovable-uploads/9ae8ee11-66be-47da-84b5-79732073f692.png"
      ]
    },
    {
      title: "SaaS Dashboard",
      description: "Real-time analytics and user management system",
      image: "/lovable-uploads/7d0e81ef-8dd7-40b8-b981-7dddd6bd89f4.png",
      tech: ["Vue.js", "Firebase", "Chart.js"],
      screenshots: []
    },
    {
      title: "Mobile App Landing",
      description: "Responsive landing page with app store integration",
      image: "/lovable-uploads/71b95a9c-eb0e-46ba-a82e-e946c84a5d50.png",
      tech: ["Next.js", "Tailwind", "Framer Motion"],
      screenshots: []
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

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {projects.map((project, index) => (
              <CarouselItem key={index}>
                <div className="glass-effect rounded-2xl overflow-hidden hover:border-webdev-gradient-blue/30 transition-all duration-300">
                  <div className="aspect-video bg-webdev-darker-gray overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-medium text-webdev-silver mb-4">
                      {project.title}
                    </h3>
                    <p className="text-webdev-soft-gray text-base mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Screenshots Carousel - Only show if screenshots exist */}
                    {project.screenshots.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-webdev-silver mb-4">Project Screenshots</h4>
                        <Carousel className="w-full">
                          <CarouselContent>
                            {project.screenshots.map((screenshot, screenshotIndex) => (
                              <CarouselItem key={screenshotIndex} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                  <div className="glass-effect rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                                    <img 
                                      src={screenshot} 
                                      alt={`${project.title} screenshot ${screenshotIndex + 1}`}
                                      className="w-full h-32 object-cover"
                                    />
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="glass-effect border-webdev-glass-border text-webdev-silver hover:bg-webdev-gradient-blue/20" />
                          <CarouselNext className="glass-effect border-webdev-glass-border text-webdev-silver hover:bg-webdev-gradient-blue/20" />
                        </Carousel>
                      </div>
                    )}
                    
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="glass-effect border-webdev-glass-border text-webdev-silver hover:bg-webdev-gradient-blue/20" />
          <CarouselNext className="glass-effect border-webdev-glass-border text-webdev-silver hover:bg-webdev-gradient-blue/20" />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedWork;
