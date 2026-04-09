import React, { useCallback, useEffect, useState } from 'react';
import { Target, Users, Zap, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from '@/components/ui/carousel';

const proTips = [
  { icon: Target, title: "What Makes a Great Homepage?", content: "Clear value proposition, compelling hero section, social proof, and obvious next steps for visitors." },
  { icon: Users, title: "Defining Your Audience", content: "Identify demographics, pain points, goals, and preferred communication styles of your ideal customers." },
  { icon: Zap, title: "Choosing the Right Features", content: "Focus on features that directly support your business goals and provide real value to users." },
  { icon: BarChart3, title: "What is a Call-to-Action?", content: "A clear, compelling button or link that guides users to take your desired next step." }
];

const ProTipsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => { setCurrent(api.selectedScrollSnap()); });
  }, [api]);

  useEffect(() => {
    if (!api || isHovered) return;
    const interval = setInterval(() => { api.scrollNext(); }, 4000);
    return () => clearInterval(interval);
  }, [api, isHovered]);

  const scrollPrev = useCallback(() => { api?.scrollPrev(); }, [api]);
  const scrollNext = useCallback(() => { api?.scrollNext(); }, [api]);

  return (
    <div className="w-full max-w-4xl mx-auto" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <h3 className="text-center text-xl font-semibold text-wdp-text mb-6">
        <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">Pro Tips</span>
      </h3>
      
      <Carousel setApi={setApi} opts={{ align: "center", loop: true, duration: 20 }} className="w-full">
        <CarouselContent className="-ml-4">
          {proTips.map((tip, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="glass-effect h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="icon-gradient-container relative w-12 h-12 rounded-xl mb-4">
                      <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                        <tip.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-wdp-text text-sm mb-2">{tip.title}</h4>
                    <p className="text-wdp-text-secondary text-xs leading-relaxed">{tip.content}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Unified carousel controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={scrollPrev} className="carousel-chevron" aria-label="Previous tip">
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === current ? 'active' : ''}`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>
        
        <button onClick={scrollNext} className="carousel-chevron" aria-label="Next tip">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProTipsCarousel;
