
import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Monitor, Smartphone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <section id="featuredwork" className="relative py-16 px-6">
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
                      <div className="group relative bg-webdev-darker-gray/50 border border-webdev-glass-border rounded-lg p-12 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-webdev-gradient-blue/10">
                        {/* Gradient border effect on hover */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                        
                        {/* Project number in top left corner */}
                        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center text-white font-bold text-sm">
                          {project.number}
                        </div>
                        
                        <div className="flex flex-col items-center mb-8">
                          <div className="relative w-20 h-20 rounded-full mb-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                              <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                                <IconComponent 
                                  className="w-10 h-10" 
                                  stroke="url(#featured-icon-gradient)" 
                                  fill="none"
                                  strokeWidth={2}
                                />
                              </div>
                            </div>
                          </div>
                          <h4 className="text-2xl font-semibold text-webdev-silver mb-2 group-hover:text-white transition-colors duration-300">
                            {project.title}
                          </h4>
                          <span className="text-webdev-gradient-blue text-sm font-medium">
                            {project.status}
                          </span>
                        </div>
                        
                        <p className="text-webdev-soft-gray text-lg mb-6 leading-relaxed max-w-md mx-auto group-hover:text-webdev-silver transition-colors duration-300">
                          {project.description}
                        </p>

                        {/* Placeholder for screenshot */}
                        <div className="w-full h-48 bg-webdev-dark-gray/30 border border-webdev-glass-border rounded-lg mb-6 flex items-center justify-center">
                          <span className="text-webdev-soft-gray text-sm group-hover:text-webdev-silver transition-colors duration-300">Project Screenshot</span>
                        </div>
                        
                        <div className="mb-6">
                          <span className="text-webdev-silver text-sm font-medium group-hover:text-white transition-colors duration-300">Technologies: </span>
                          <span className="text-webdev-soft-gray text-sm group-hover:text-webdev-silver transition-colors duration-300">{project.technologies}</span>
                        </div>

                        <ul className="space-y-3 max-w-sm mx-auto mb-8">
                          {project.details.map((detail, index) => (
                            <li key={index} className="text-webdev-soft-gray flex items-center justify-center group-hover:text-webdev-silver transition-colors duration-300">
                              <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
                              {detail}
                            </li>
                          ))}
                        </ul>

                        <div className="flex gap-3 justify-center">
                          <button className="glass-effect hover:glass-border px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-webdev-gradient-blue/20 flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View Live
                          </button>
                          <button className="glass-effect hover:glass-border px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-webdev-gradient-blue/20 flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            Source Code
                          </button>
                        </div>

                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-webdev-gradient-blue/5 to-webdev-gradient-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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

        {/* SVG Gradient Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="featured-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default FeaturedWork;
