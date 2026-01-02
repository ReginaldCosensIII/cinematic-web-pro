import React, { useCallback, useEffect, useState } from 'react';
import { Target, Users, Zap, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from '@/components/ui/carousel';

const proTips = [
  {
    icon: Target,
    title: "What Makes a Great Homepage?",
    content: "Clear value proposition, compelling hero section, social proof, and obvious next steps for visitors."
  },
  {
    icon: Users,
    title: "Defining Your Audience",
    content: "Identify demographics, pain points, goals, and preferred communication styles of your ideal customers."
  },
  {
    icon: Zap,
    title: "Choosing the Right Features",
    content: "Focus on features that directly support your business goals and provide real value to users."
  },
  {
    icon: BarChart3,
    title: "What is a Call-to-Action?",
    content: "A clear, compelling button or link that guides users to take your desired next step."
  }
];

const ProTipsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {proTips.map((tip, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="glass-effect border-webdev-glass-border bg-webdev-black/40 h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-12 h-12 rounded-xl mb-4">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                        <div className="w-full h-full rounded-xl bg-webdev-dark-gray flex items-center justify-center">
                          <tip.icon className="w-6 h-6" stroke="url(#icon-gradient)" fill="none" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-webdev-silver text-sm mb-2">{tip.title}</h4>
                    <p className="text-webdev-soft-gray text-xs leading-relaxed">{tip.content}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={scrollPrev}
          className="h-8 w-8 rounded-full bg-webdev-darker-gray border border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {/* Dots Indicator */}
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple w-6'
                  : 'bg-webdev-glass-border hover:bg-webdev-soft-gray'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
        
        <button
          onClick={scrollNext}
          className="h-8 w-8 rounded-full bg-webdev-darker-gray border border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white flex items-center justify-center transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProTipsCarousel;
