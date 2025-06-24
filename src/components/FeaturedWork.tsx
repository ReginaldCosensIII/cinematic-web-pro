import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [screenshotIndex, setScreenshotIndex] = useState(0);

  // BookNook project screenshots
  const booknookScreenshots = [
    '/lovable-uploads/6bb88bea-0fe1-493e-bba6-79f91be5c82e.png',
    '/lovable-uploads/14e57b76-6e9a-437c-beb2-6c7cd7aa45ef.png',
    '/lovable-uploads/ad13920d-ee62-453e-b69e-67570b06f3dd.png',
    '/lovable-uploads/2c679128-e7f5-448f-aa45-3b0dcbcb05ae.png',
    '/lovable-uploads/98391c75-0df0-4353-a43c-f7c6ecd15efe.png',
    '/lovable-uploads/b1e9fdf3-bc1a-4d0b-a843-b5f8463bfa18.png'
  ];

  // Auto-rotation for BookNook screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setScreenshotIndex((prev) => (prev + 1) % booknookScreenshots.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [booknookScreenshots.length]);

  const nextScreenshot = () => {
    setScreenshotIndex((prev) => (prev + 1) % booknookScreenshots.length);
  };

  const prevScreenshot = () => {
    setScreenshotIndex((prev) => (prev - 1 + booknookScreenshots.length) % booknookScreenshots.length);
  };

  // Custom BookNook SVG Icon Component
  const BookNookIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="booknook-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285f4" />
          <stop offset="100%" stopColor="#8a2be2" />
        </linearGradient>
      </defs>
      {/* Book spine */}
      <rect x="8" y="12" width="32" height="24" rx="2" stroke="url(#booknook-gradient)" strokeWidth="2" fill="none"/>
      {/* Book pages */}
      <path d="M12 16h24M12 20h24M12 24h20M12 28h22" stroke="url(#booknook-gradient)" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Digital screen overlay */}
      <rect x="18" y="18" width="12" height="8" rx="1" stroke="url(#booknook-gradient)" strokeWidth="1.5" fill="none"/>
      {/* Screen pixels/dots */}
      <circle cx="21" cy="21" r="0.5" fill="url(#booknook-gradient)"/>
      <circle cx="24" cy="21" r="0.5" fill="url(#booknook-gradient)"/>
      <circle cx="27" cy="21" r="0.5" fill="url(#booknook-gradient)"/>
      <circle cx="21" cy="23" r="0.5" fill="url(#booknook-gradient)"/>
      <circle cx="24" cy="23" r="0.5" fill="url(#booknook-gradient)"/>
      <circle cx="27" cy="23" r="0.5" fill="url(#booknook-gradient)"/>
    </svg>
  );

  const featuredProjects = [
    {
      title: "Atomic's BookNook",
      description: "A feature rich online bookstore. Features role-based login, dynamic product displays, and a fully functional shopping cart and checkout system and more.",
      details: ["Role-Based User Auth", "Modular Flask Blueprints", "Dynamic Reviews System", "Cart & Order Management", "Mobile Responsive Design"],
      icon: BookNookIcon,
      technologies: "Flask, PostgreSQL, Jinja2, HTML/CSS/JavaScript",
      status: "Live Project",
      hasCarousel: true
    },
    {
      title: "Portfolio Website",
      description: "Clean, minimalist portfolio showcasing creative work with smooth animations and interactive elements.",
      details: ["Custom Animations", "Interactive UI", "Performance Optimized", "Modern Design"],
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#featured-icon-gradient)" strokeWidth={2}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
      ),
      technologies: "Next.js, Tailwind CSS, Framer Motion",
      status: "Recently Completed"
    },
    {
      title: "Mobile App Landing", 
      description: "Converting landing page for a mobile application with compelling CTAs and feature highlights.",
      details: ["High Conversion Rate", "A/B Tested", "Analytics Integration", "Cross-platform"],
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#featured-icon-gradient)" strokeWidth={2}>
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
        </svg>
      ),
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
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
              <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
              <span className="text-webdev-silver text-sm">Featured Projects</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-webdev-silver">Recent </span>
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Work
              </span>
            </h2>
            
            <p className="text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
              Explore a curated selection of my most impactful projects, showcasing innovative web solutions and digital experiences.
            </p>
          </div>
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
              {featuredProjects.map((project, index) => {
                const IconComponent = project.icon;
                return (
                  <CarouselItem key={index} className="basis-full">
                    <div className="p-6">
                      <div className="group relative glass-effect hover:glass-border rounded-xl p-12 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-webdev-gradient-blue/10">
                        {/* Gradient border effect on hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                        
                        <div className="flex flex-col items-center mb-8">
                          <div className="relative w-20 h-20 rounded-full mb-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                              <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                                <IconComponent 
                                  className="w-10 h-10" 
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

                        {/* Screenshot carousel for BookNook, placeholder for others */}
                        {project.hasCarousel ? (
                          <div className="relative w-full h-96 bg-webdev-dark-gray/30 border border-webdev-glass-border rounded-lg mb-6 overflow-hidden">
                            <img 
                              src={booknookScreenshots[screenshotIndex]} 
                              alt={`${project.title} Screenshot ${screenshotIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Carousel navigation */}
                            <button 
                              onClick={prevScreenshot}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-webdev-dark-gray/80 hover:bg-webdev-dark-gray rounded-full flex items-center justify-center transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4 text-webdev-silver" />
                            </button>
                            <button 
                              onClick={nextScreenshot}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-webdev-dark-gray/80 hover:bg-webdev-dark-gray rounded-full flex items-center justify-center transition-colors"
                            >
                              <ChevronRight className="w-4 h-4 text-webdev-silver" />
                            </button>
                            {/* Carousel indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                              {booknookScreenshots.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setScreenshotIndex(index)}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    index === screenshotIndex 
                                      ? 'bg-webdev-gradient-blue' 
                                      : 'bg-webdev-soft-gray/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-96 bg-webdev-dark-gray/30 border border-webdev-glass-border rounded-lg mb-6 flex items-center justify-center">
                            <span className="text-webdev-soft-gray text-sm group-hover:text-webdev-silver transition-colors duration-300">Project Screenshot</span>
                          </div>
                        )}
                        
                        {/* Project description moved below screenshots */}
                        <p className="text-webdev-soft-gray text-lg mb-6 leading-relaxed max-w-md mx-auto group-hover:text-webdev-silver transition-colors duration-300">
                          {project.description}
                        </p>
                        
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
                          <button className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg flex items-center gap-2 relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <ExternalLink className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">View Live</span>
                          </button>
                          <button className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg flex items-center gap-2 relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <Github className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Source Code</span>
                          </button>
                        </div>

                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue/5 to-webdev-gradient-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
