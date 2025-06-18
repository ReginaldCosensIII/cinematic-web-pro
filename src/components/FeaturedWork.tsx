
import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Monitor, Smartphone, Globe } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

const FeaturedWork = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const featuredProjects = [
    {
      number: "1",
      title: "E-Commerce Platform",
      description: "A modern, responsive e-commerce solution with advanced filtering and seamless checkout experience.",
      details: ["React & TypeScript", "Stripe Integration", "Mobile Responsive", "SEO Optimized"],
      icon: Monitor,
      technologies: "React, Node.js, MongoDB",
      status: "Live Project"
    },
    {
      number: "2", 
      title: "Portfolio Website",
      description: "Clean, minimalist portfolio showcasing creative work with smooth animations and interactive elements.",
      details: ["Custom Animations", "Interactive UI", "Performance Optimized", "Modern Design"],
      icon: Globe,
      technologies: "Next.js, Tailwind CSS, Framer Motion",
      status: "Recently Completed"
    },
    {
      number: "3",
      title: "Mobile App Landing", 
      description: "Converting landing page for a mobile application with compelling CTAs and feature highlights.",
      details: ["High Conversion Rate", "A/B Tested", "Analytics Integration", "Cross-platform"],
      icon: Smartphone,
      technologies: "React, GSAP, Google Analytics",
      status: "High Converting"
    }
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center animate-fade-in-up mb-16">
          <h2 className="text-4xl font-light text-webdev-silver tracking-wide mb-6">
            Featured Work
          </h2>
          <h3 className="text-xl font-light text-webdev-soft-gray tracking-wide mb-4">
            Recent Project Highlights
          </h3>
          <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
            Explore a curated selection of my most impactful projects, showcasing innovative web solutions and digital experiences crafted for forward-thinking brands.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProjects.map((project) => {
                const IconComponent = project.icon;
                return (
                  <CarouselItem key={project.number} className="basis-full">
                    <div className="p-6">
                      <div className="relative bg-webdev-darker-gray/50 border border-webdev-glass-border rounded-lg p-12 text-center">
                        {/* Project number in top left corner */}
                        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center text-white font-bold text-sm">
                          {project.number}
                        </div>
                        
                        <div className="flex flex-col items-center mb-8">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center mb-6">
                            <IconComponent className="w-10 h-10 text-white" />
                          </div>
                          <h4 className="text-2xl font-semibold text-webdev-silver mb-2">
                            {project.title}
                          </h4>
                          <span className="text-webdev-gradient-blue text-sm font-medium">
                            {project.status}
                          </span>
                        </div>
                        
                        <p className="text-webdev-soft-gray text-lg mb-6 leading-relaxed max-w-md mx-auto">
                          {project.description}
                        </p>

                        {/* Placeholder for screenshot */}
                        <div className="w-full h-48 bg-webdev-dark-gray/30 border border-webdev-glass-border rounded-lg mb-6 flex items-center justify-center">
                          <span className="text-webdev-soft-gray text-sm">Project Screenshot</span>
                        </div>
                        
                        <div className="mb-6">
                          <span className="text-webdev-silver text-sm font-medium">Technologies: </span>
                          <span className="text-webdev-soft-gray text-sm">{project.technologies}</span>
                        </div>

                        <ul className="space-y-3 max-w-sm mx-auto mb-8">
                          {project.details.map((detail, index) => (
                            <li key={index} className="text-webdev-soft-gray flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
                              {detail}
                            </li>
                          ))}
                        </ul>

                        <div className="flex gap-3 justify-center">
                          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple text-white rounded-lg hover:opacity-90 transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                            View Live
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-webdev-glass-border text-webdev-silver rounded-lg hover:bg-webdev-glass transition-colors">
                            <Github className="w-4 h-4" />
                            Source Code
                          </button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white -left-16" />
            <CarouselNext className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white -right-16" />
          </Carousel>

          {/* Progress indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {featuredProjects.map((_, index) => (
                <div
                  key={index}
                  className="relative h-1 w-16 bg-webdev-darker-gray rounded-full overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full transition-all duration-500 ease-out ${
                      index + 1 === current ? 'w-full' : index + 1 < current ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project counter */}
          <div className="text-center mt-4">
            <span className="text-webdev-soft-gray text-sm">
              {current} of {count}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
