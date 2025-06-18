
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProcessSection = () => {
  const processSteps = [
    {
      number: "1",
      title: "Discovery",
      description: "Understanding your business goals and target audience.",
      details: ["Business analysis", "Competitor research", "Goal definition"]
    },
    {
      number: "2", 
      title: "Design",
      description: "Creating wireframes and visual designs that align with your brand.",
      details: ["Wireframing", "Visual design", "User experience"]
    },
    {
      number: "3",
      title: "Build", 
      description: "Developing your website with clean, modern code.",
      details: ["Frontend development", "Backend integration", "Responsive design"]
    },
    {
      number: "4",
      title: "Test",
      description: "Ensuring everything works perfectly across all devices.",
      details: ["Cross-browser testing", "Mobile optimization", "Performance testing"]
    },
    {
      number: "5",
      title: "Launch",
      description: "Going live with ongoing support and monitoring.",
      details: ["Domain setup", "Launch monitoring", "Ongoing support"]
    }
  ];

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

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {processSteps.map((step) => (
                <CarouselItem key={step.number} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-6 h-full">
                    <div className="bg-webdev-darker-gray/50 border border-webdev-glass-border rounded-lg p-8 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center text-white font-bold text-lg mr-4">
                          {step.number}
                        </div>
                        <h4 className="text-xl font-semibold text-webdev-silver">
                          {step.title}
                        </h4>
                      </div>
                      
                      <p className="text-webdev-soft-gray mb-6 leading-relaxed flex-grow">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, index) => (
                          <li key={index} className="text-webdev-soft-gray text-sm flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-webdev-gradient-blue mr-3"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white" />
            <CarouselNext className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
