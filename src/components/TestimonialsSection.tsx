import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

const TestimonialsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const testimonials = [
    {
      subheading: "More Than a Developer",
      supportingText: "Reggie helped us launch a polished, high-performing site that elevated our brand. He treated our project like his own, and it shows in every detail.",
      quote: "Working with this developer was an exceptional experience. The attention to detail and quality of work exceeded our expectations. Our project was delivered on time and within budget.",
      author: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      company: "TechStart",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop&crop=face"
    },
    {
      subheading: "A Trusted Partner for Our Clients",
      supportingText: "From rebuilding our entire CES website to managing SEO and development for our clients, Reggie has become an essential part of our digital strategy.",
      quote: "The level of professionalism and technical expertise demonstrated throughout our collaboration was outstanding. I highly recommend this developer for any web development project.",
      author: "Michael Chen",
      role: "Product Manager",
      company: "Digital Solutions",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=face"
    },
    {
      subheading: "A Seamless Experience",
      supportingText: "Working with Reggie felt effortless. He communicated clearly, delivered on time, and made the entire process feel smooth and stress-free.",
      quote: "From initial consultation to final delivery, the entire process was smooth and transparent. The final product not only met but exceeded our requirements. Truly exceptional work.",
      author: "Emily Rodriguez",
      role: "Marketing Director",
      company: "Creative Agency",
      avatar: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=200&h=200&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      if (api) {
        const nextIndex = (api.selectedScrollSnap() + 1) % testimonials.length;
        api.scrollTo(nextIndex);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [api, testimonials.length]);

  return (
    <section className="relative py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect">
              <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
              <span className="text-wdp-text text-sm">Client Testimonials</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-wdp-text">Why Clients </span>
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Trust</span>
              <span className="text-wdp-text"> Us</span>
            </h2>
            
            <p className="text-xl text-wdp-text-secondary max-w-3xl mx-auto leading-relaxed">
              We build more than websites — we build trust. Through transparent communication, dependable delivery, and top-tier solutions, we've earned the confidence of businesses and professionals across industries.
            </p>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{ align: "center", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="p-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6 order-2 lg:order-1 hidden lg:block">
                        <div className="space-y-4">
                          <h3 className="text-3xl md:text-4xl font-light text-wdp-text">
                            {index === 0 && (<>More Than a{" "}<span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Developer</span></>)}
                            {index === 1 && (<>A{" "}<span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Trusted Partner</span>{" "}for Our Clients</>)}
                            {index === 2 && (<>A{" "}<span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">Seamless</span>{" "}Experience</>)}
                          </h3>
                          <p className="text-lg text-wdp-text-secondary leading-relaxed">
                            {testimonial.supportingText}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {testimonials.map((_, idx) => (
                            <div key={idx} className={`relative h-1 w-16 rounded-full overflow-hidden ${isDark ? 'bg-webdev-darker-gray' : 'bg-gray-200'}`}>
                              <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full transition-all duration-500 ease-out ${idx === current ? 'w-full' : 'w-0'}`} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="order-1 lg:order-2">
                        <div className="relative group glass-effect hover:glass-border rounded-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                            <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-webdev-dark-gray' : 'bg-white'}`}>
                              <Quote className="w-4 h-4 text-wdp-text" />
                            </div>
                          </div>

                          <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                              <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-wdp-text font-semibold group-hover:opacity-80 transition-colors duration-300">{testimonial.author}</div>
                              <div className="text-wdp-text-secondary text-sm group-hover:text-wdp-text transition-colors duration-300">{testimonial.role}</div>
                              <div className="text-webdev-gradient-blue text-sm font-medium">{testimonial.company}</div>
                            </div>
                          </div>

                          <blockquote className="text-lg md:text-xl text-wdp-text leading-relaxed group-hover:opacity-80 transition-colors duration-300">
                            "{testimonial.quote}"
                          </blockquote>

                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className={`${isDark ? 'bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'} -left-16 hidden lg:flex`} />
            <CarouselNext className={`${isDark ? 'bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'} -right-16 hidden lg:flex`} />
          </Carousel>

          <div className="flex justify-center mt-8 lg:hidden">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <div key={index} className={`relative h-1 w-16 rounded-full overflow-hidden ${isDark ? 'bg-webdev-darker-gray' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full transition-all duration-500 ease-out ${index === current ? 'w-full' : 'w-0'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
