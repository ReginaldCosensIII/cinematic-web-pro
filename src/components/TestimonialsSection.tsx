import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
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

  const testimonials = [
    {
      quote: "Working with this developer was an exceptional experience. The attention to detail and quality of work exceeded our expectations. Our project was delivered on time and within budget.",
      author: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      company: "TechStart",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop&crop=face"
    },
    {
      quote: "The level of professionalism and technical expertise demonstrated throughout our collaboration was outstanding. I highly recommend this developer for any web development project.",
      author: "Michael Chen",
      role: "Product Manager",
      company: "Digital Solutions",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=face"
    },
    {
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

    // Auto-advance carousel every 6 seconds
    const interval = setInterval(() => {
      if (api) {
        const nextIndex = (api.selectedScrollSnap() + 1) % testimonials.length;
        api.scrollTo(nextIndex);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [api, testimonials.length]);

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <section className="relative py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10 mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
              <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse"></div>
              <span className="text-webdev-silver text-sm">Client Testimonials</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light tracking-tight">
              <span className="text-webdev-silver">What Clients </span>
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Say
              </span>
            </h2>
            
            <p className="text-xl text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
              Discover how our collaborative approach and technical expertise have helped businesses achieve their digital goals.
            </p>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="p-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Supporting Text - Left Side */}
                      <div className="space-y-6 order-2 lg:order-1 hidden lg:block">
                        <div className="space-y-4">
                          <h3 className="text-3xl md:text-4xl font-light text-webdev-silver">
                            Trusted by businesses
                            <span className="block bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                              worldwide
                            </span>
                          </h3>
                          <p className="text-lg text-webdev-soft-gray leading-relaxed">
                            Our commitment to excellence and client satisfaction has built lasting partnerships with innovative companies across various industries.
                          </p>
                        </div>
                        
                        {/* Testimonial Navigation Indicators */}
                        <div className="flex space-x-2">
                          {testimonials.map((_, index) => (
                            <div
                              key={index}
                              className="relative h-1 w-16 bg-webdev-darker-gray rounded-full overflow-hidden"
                            >
                              <div
                                className={`absolute top-0 left-0 h-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full transition-all duration-500 ease-out ${
                                  index === current ? 'w-full' : 'w-0'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quote Card - Right Side */}
                      <div className="order-1 lg:order-2">
                        <div className="relative group glass-effect hover:glass-border rounded-xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                          {/* Quote Icon */}
                          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                            <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                              <Quote className="w-4 h-4 text-webdev-silver" />
                            </div>
                          </div>

                          {/* Author Avatar */}
                          <div className="flex items-center mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                              <img 
                                src={testimonial.avatar} 
                                alt={testimonial.author}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-webdev-silver font-semibold group-hover:text-white transition-colors duration-300">
                                {testimonial.author}
                              </div>
                              <div className="text-webdev-soft-gray text-sm group-hover:text-webdev-silver transition-colors duration-300">
                                {testimonial.role}
                              </div>
                              <div className="text-webdev-gradient-blue text-sm font-medium">
                                {testimonial.company}
                              </div>
                            </div>
                          </div>

                          {/* Quote Text */}
                          <blockquote className="text-lg md:text-xl text-webdev-silver leading-relaxed group-hover:text-white transition-colors duration-300">
                            "{testimonial.quote}"
                          </blockquote>

                          {/* Gradient Border Effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom Navigation Buttons */}
            <CarouselPrevious className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white -left-16 hidden lg:flex" />
            <CarouselNext className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white -right-16 hidden lg:flex" />
          </Carousel>

          {/* Mobile Navigation */}
          <div className="flex justify-center mt-8 lg:hidden">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className="relative h-1 w-16 bg-webdev-darker-gray rounded-full overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full transition-all duration-500 ease-out ${
                      index === current ? 'w-full' : 'w-0'
                    }`}
                  />
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