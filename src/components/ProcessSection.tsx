
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Palette, Code, ShieldCheck, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

const ProcessSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const processSteps = [
    { number: "1", title: "Discovery", description: "Understanding your business goals and target audience.", details: ["Business analysis", "Competitor research", "Goal definition"], icon: Search, image: "/lovable-uploads/71b95a9c-eb0e-46ba-a82e-e946c84a5d50.png" },
    { number: "2", title: "Design", description: "Creating wireframes and visual designs that align with your brand.", details: ["Wireframing", "Visual design", "User experience"], icon: Palette, image: "/lovable-uploads/e5aa85ee-0948-48da-9260-74a62953c120.png" },
    { number: "3", title: "Build", description: "Developing your website with clean, modern code.", details: ["Frontend development", "Backend integration", "Responsive design"], icon: Code, image: "/lovable-uploads/bc4782ae-06ce-4d94-9a5e-1defbd96627d.png" },
    { number: "4", title: "Test", description: "Ensuring everything works perfectly across all devices.", details: ["Cross-browser testing", "Mobile optimization", "Performance testing"], icon: ShieldCheck, image: "/lovable-uploads/ab14eb1e-52ba-449c-88ca-fdc83ffd9fb6.png" },
    { number: "5", title: "Launch", description: "Going live with ongoing support and monitoring.", details: ["Domain setup", "Launch monitoring", "Ongoing support"], icon: Rocket, image: "/lovable-uploads/ca774afa-4747-44e2-b7a2-7b339070cf34.png" }
  ];

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => { setCurrent(api.selectedScrollSnap()); });
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => { api.scrollNext(); }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  const scrollPrev = useCallback(() => { api?.scrollPrev(); }, [api]);
  const scrollNext = useCallback(() => { api?.scrollNext(); }, [api]);

  return (
    <section className="relative py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect badge-hover">
              <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
              <span className="text-wdp-text text-sm">Strategic approach</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-wdp-text">Design </span>
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Process</span>
            </h2>
            
            <p className="text-xl text-wdp-text-secondary max-w-2xl mx-auto leading-relaxed">
              Every project follows a proven methodology combining discovery, design, development, and optimization to ensure exceptional results.
            </p>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <Carousel setApi={setApi} opts={{ align: "center", loop: true }} className="w-full">
            <CarouselContent>
              {processSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <CarouselItem key={step.number} className="basis-full">
                    <div className="p-4">
                      <div className="group blog-card glass-effect rounded-xl p-6 text-center max-w-sm mx-auto">
                        
                        <div className="mb-6 w-full aspect-[4/3]">
                          <img 
                            src={step.image} 
                            alt={`${step.title} phase visualization`}
                            className="w-full h-full object-cover object-center rounded-lg glass-border"
                          />
                        </div>
                        
                        <div className="flex flex-col items-center mb-4">
                          <div className="icon-gradient-container relative w-12 h-12 rounded-full mb-3">
                            <div className="icon-inner w-full h-full rounded-full flex items-center justify-center">
                              <IconComponent className="w-6 h-6" />
                            </div>
                          </div>
                          <h4 className="text-lg font-semibold text-wdp-text group-hover:opacity-80 transition-colors duration-300">{step.title}</h4>
                        </div>
                        
                        <p className="text-wdp-text-secondary text-sm mb-4 leading-relaxed group-hover:text-wdp-text transition-colors duration-300">{step.description}</p>
                        
                        <ul className="space-y-1">
                          {step.details.map((detail, index) => (
                            <li key={index} className="text-wdp-text-secondary text-xs flex items-center justify-center group-hover:text-wdp-text transition-colors duration-300">
                              <div className="w-1 h-1 rounded-full bg-webdev-gradient-blue mr-2"></div>
                              {detail}
                            </li>
                          ))}
                        </ul>

                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Unified carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={scrollPrev} className="carousel-chevron" aria-label="Previous step">
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === current ? 'active' : ''}`}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
            
            <button onClick={scrollNext} className="carousel-chevron" aria-label="Next step">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="text-center mt-3">
            <span className="text-wdp-text-secondary text-sm">{current + 1} of {count}</span>
          </div>
        </div>

        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="process-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default ProcessSection;
