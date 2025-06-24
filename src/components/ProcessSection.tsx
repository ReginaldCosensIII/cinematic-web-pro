
import React, { useState, useEffect } from 'react';
import { Search, Palette, Code, TestTube, Rocket } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

const ProcessSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const processSteps = [
    {
      number: "1",
      title: "Discovery",
      description: "Understanding your business goals and target audience.",
      details: ["Business analysis", "Competitor research", "Goal definition"],
      icon: Search,
      image: "/lovable-uploads/71b95a9c-eb0e-46ba-a82e-e946c84a5d50.png"
    },
    {
      number: "2", 
      title: "Design",
      description: "Creating wireframes and visual designs that align with your brand.",
      details: ["Wireframing", "Visual design", "User experience"],
      icon: Palette,
      image: "/lovable-uploads/e5aa85ee-0948-48da-9260-74a62953c120.png"
    },
    {
      number: "3",
      title: "Build", 
      description: "Developing your website with clean, modern code.",
      details: ["Frontend development", "Backend integration", "Responsive design"],
      icon: Code,
      image: "/lovable-uploads/bc4782ae-06ce-4d94-9a5e-1defbd96627d.png"
    },
    {
      number: "4",
      title: "Test",
      description: "Ensuring everything works perfectly across all devices.",
      details: ["Cross-browser testing", "Mobile optimization", "Performance testing"],
      icon: TestTube,
      image: "/lovable-uploads/ab14eb1e-52ba-449c-88ca-fdc83ffd9fb6.png"
    },
    {
      number: "5",
      title: "Launch",
      description: "Going live with ongoing support and monitoring.",
      details: ["Domain setup", "Launch monitoring", "Ongoing support"],
      icon: Rocket,
      image: "/lovable-uploads/ca774afa-4747-44e2-b7a2-7b339070cf34.png"
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
    <section className="relative py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
              <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
              <span className="text-webdev-silver text-sm">Strategic approach</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-webdev-silver">Design </span>
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Process
              </span>
            </h2>
            
            <p className="text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
              Every project follows a proven methodology combining discovery, design, development, and optimization to ensure exceptional results.
            </p>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {processSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <CarouselItem key={step.number} className="basis-full">
                    <div className="p-4">
                      <div className="group relative glass-effect hover:glass-border rounded-xl p-6 text-center max-w-sm mx-auto transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-webdev-gradient-blue/10">
                        {/* Gradient border effect on hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                        
                        {/* Image section with responsive aspect ratio */}
                        <div className="mb-6 w-full aspect-[4/3]">
                          <img 
                            src={step.image} 
                            alt={`${step.title} phase visualization`}
                            className="w-full h-full object-cover object-center rounded-lg border border-webdev-glass-border"
                          />
                        </div>
                        
                        <div className="flex flex-col items-center mb-4">
                          <div className="relative w-12 h-12 rounded-full mb-3">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                              <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                                <IconComponent 
                                  className="w-6 h-6" 
                                  stroke="url(#process-icon-gradient)" 
                                  fill="none"
                                  strokeWidth={2}
                                />
                              </div>
                            </div>
                          </div>
                          <h4 className="text-lg font-semibold text-webdev-silver group-hover:text-white transition-colors duration-300">
                            {step.title}
                          </h4>
                        </div>
                        
                        <p className="text-webdev-soft-gray text-sm mb-4 leading-relaxed group-hover:text-webdev-silver transition-colors duration-300">
                          {step.description}
                        </p>
                        
                        <ul className="space-y-1">
                          {step.details.map((detail, index) => (
                            <li key={index} className="text-webdev-soft-gray text-xs flex items-center justify-center group-hover:text-webdev-silver transition-colors duration-300">
                              <div className="w-1 h-1 rounded-full bg-webdev-gradient-blue mr-2"></div>
                              {detail}
                            </li>
                          ))}
                        </ul>

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

          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              {processSteps.map((_, index) => (
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

          {/* Step counter */}
          <div className="text-center mt-4">
            <span className="text-webdev-soft-gray text-sm">
              {current} of {count}
            </span>
          </div>
        </div>

        {/* SVG Gradient Definition */}
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
