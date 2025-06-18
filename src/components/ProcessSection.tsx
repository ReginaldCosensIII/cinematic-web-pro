
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
      icon: Search
    },
    {
      number: "2", 
      title: "Design",
      description: "Creating wireframes and visual designs that align with your brand.",
      details: ["Wireframing", "Visual design", "User experience"],
      icon: Palette
    },
    {
      number: "3",
      title: "Build", 
      description: "Developing your website with clean, modern code.",
      details: ["Frontend development", "Backend integration", "Responsive design"],
      icon: Code
    },
    {
      number: "4",
      title: "Test",
      description: "Ensuring everything works perfectly across all devices.",
      details: ["Cross-browser testing", "Mobile optimization", "Performance testing"],
      icon: TestTube
    },
    {
      number: "5",
      title: "Launch",
      description: "Going live with ongoing support and monitoring.",
      details: ["Domain setup", "Launch monitoring", "Ongoing support"],
      icon: Rocket
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
            My Process
          </h2>
          <h3 className="text-xl font-light text-webdev-soft-gray tracking-wide mb-4">
            Strategic Development Approach
          </h3>
          <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
            Every project follows a proven methodology combining discovery, design, development, and optimization to ensure exceptional results that exceed expectations.
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
              {processSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <CarouselItem key={step.number} className="basis-full">
                    <div className="p-6">
                      <div className="bg-webdev-darker-gray/50 border border-webdev-glass-border rounded-lg p-12 text-center">
                        <div className="flex flex-col items-center mb-8">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center mb-6">
                            <IconComponent className="w-10 h-10 text-white" />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center text-white font-bold text-sm">
                              {step.number}
                            </div>
                            <h4 className="text-2xl font-semibold text-webdev-silver">
                              {step.title}
                            </h4>
                          </div>
                        </div>
                        
                        <p className="text-webdev-soft-gray text-lg mb-8 leading-relaxed max-w-md mx-auto">
                          {step.description}
                        </p>
                        
                        <ul className="space-y-3 max-w-sm mx-auto">
                          {step.details.map((detail, index) => (
                            <li key={index} className="text-webdev-soft-gray flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
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
            <CarouselPrevious className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white -left-16" />
            <CarouselNext className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white -right-16" />
          </Carousel>

          {/* Progress indicator */}
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
      </div>
    </section>
  );
};

export default ProcessSection;
