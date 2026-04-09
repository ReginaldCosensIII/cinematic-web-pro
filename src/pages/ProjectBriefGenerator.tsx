import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight, Target, Users, Zap, CheckCircle, Lightbulb, Code, Palette, BarChart3 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import ProjectBriefChat from '@/components/ProjectBriefChat';
import ProTipsCarousel from '@/components/ProTipsCarousel';
import ScrollReveal from '@/components/ScrollReveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import heroImage from '@/assets/project-brief-hero.jpg';

const ProjectBriefGenerator = () => {
  const [showChat, setShowChat] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<string>('');
  const [showTips, setShowTips] = useState(false);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleStartBrief = () => {
    setShowChat(true);
  };

  const handleBriefGenerated = (brief: string) => {
    setGeneratedBrief(brief);
  };

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

  return (
    <>
      <SEOHead 
        title="AI LaunchPad | Project Brief Generator - WebDevPro.io"
        description="Create a professional project brief in minutes with our AI-powered LaunchPad. Get clarity on your vision, requirements, and goals for your next web development project."
        keywords="project brief generator, AI project planning, web development planning, project requirements, technical specifications, project scope, free project brief"
        canonicalUrl="https://webdevpro.io/project-brief"
      />
      <div className="min-h-screen theme-bg relative overflow-hidden">
        <SmokeBackground />
        <Header />
      
        <main className="relative z-10 pt-24">
          {!showChat ? (
            <div className="container mx-auto px-6 py-16">
              {/* Hero Section */}
              <div className="text-center max-w-5xl mx-auto mb-16">
                <div className="flex justify-center items-center mb-8">
                  <div className="icon-gradient-container relative w-12 h-12 rounded-xl mr-4">
                    <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                      <Rocket className="w-6 h-6" />
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-wdp-text">
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                      LaunchPad
                    </span>
                  </h1>
                </div>
                
                <p className="text-2xl text-wdp-text-secondary mb-8 font-medium">
                  From Idea to Action — Start Strong with LaunchPad.
                </p>
                
                {/* Hero Image */}
                <div className="mb-10 relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={isMobile ? "/lovable-uploads/50a159ac-3cf8-460a-9638-0be1d14908a6.png" : "/lovable-uploads/d8463260-7630-4879-8871-71075ff0c11d.png"}
                    alt={isMobile ? "AI-powered project planning assistant" : "LaunchPad AI project brief generator with checklist and flowchart visualization"}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
                
                <p className="text-xl text-wdp-text-secondary mb-10 leading-relaxed max-w-3xl mx-auto">
                  Our AI-powered LaunchPad guides you through a personalized conversation to create a 
                  comprehensive project brief. Get clarity on your vision, requirements, and goals in minutes.
                </p>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleStartBrief}
                    className="group relative px-14 py-5 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #4285f4, #7c3aed, #8a2be2)',
                      backgroundSize: '200% 200%',
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(66,133,244,0.3), 0 2px 10px rgba(138,43,226,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundPosition = '100% 50%';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(66,133,244,0.4), 0 4px 15px rgba(138,43,226,0.3), 0 0 25px rgba(66,133,244,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundPosition = '0% 50%';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(66,133,244,0.3), 0 2px 10px rgba(138,43,226,0.2)';
                    }}
                  >
                    <span className="flex items-center text-white">
                      <Rocket className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Start My Brief
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>

              <ScrollReveal>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                {[
                  { icon: Target, title: "Define Your Vision", desc: "Share your ideas, goals, and requirements through our guided conversation with AI." },
                  { icon: Code, title: "Generate Brief", desc: "AI creates a comprehensive, professional project brief based on your conversation." },
                  { icon: CheckCircle, title: "Launch Ready", desc: "Download your brief or submit it directly to our team to get started immediately." }
                ].map((card) => (
                  <div key={card.title} className="glass-effect rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-webdev-gradient-blue/10 relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                    <div className="relative z-10">
                      <div className="icon-gradient-container relative w-16 h-16 rounded-2xl mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
                        <div className="icon-inner w-full h-full rounded-2xl flex items-center justify-center">
                          <card.icon className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-wdp-text group-hover:opacity-80 transition-colors duration-300 mb-3">{card.title}</h3>
                      <p className="text-wdp-text-secondary group-hover:text-wdp-text transition-colors duration-300 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              </ScrollReveal>
            </div>
          ) : (
            <div className="container mx-auto px-6 py-8">
              {/* Chat Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center mb-4">
                  <div className="icon-gradient-container relative w-12 h-12 rounded-xl mr-4">
                    <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                      <Rocket className="w-6 h-6" />
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-wdp-text">
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                      LaunchPad
                    </span>
                  </h1>
                </div>
                <p className="text-wdp-text-secondary text-lg">
                  Let's create your professional project brief together
                </p>
              </div>

              {/* Mobile/Tablet Pro Tips Toggle */}
              <div className="lg:hidden mb-6 max-w-4xl mx-auto">
                <Button
                  onClick={() => setShowTips(!showTips)}
                  variant="glass"
                  className="w-full"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showTips ? 'Hide Pro Tips' : 'Show Pro Tips'}
                </Button>
                
                {showTips && (
                  <div className="mt-4 space-y-4">
                    <Card className="glass-effect">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-wdp-text flex items-center">
                          <Palette className="w-5 h-5 mr-2 text-webdev-gradient-blue" />
                          Pro Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {proTips.map((tip, index) => (
                          <div key={index} className="p-4 rounded-lg glass-effect">
                            <div className="flex items-start space-x-3">
                              <div className="icon-gradient-container relative w-8 h-8 rounded-lg flex-shrink-0 mt-1">
                                <div className="icon-inner w-full h-full rounded-lg flex items-center justify-center">
                                  <tip.icon className="w-4 h-4" />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-wdp-text text-sm mb-2">{tip.title}</h4>
                                <p className="text-wdp-text-secondary text-xs leading-relaxed">{tip.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              
              {/* Chat Area */}
              <div className="max-w-4xl mx-auto">
                <ProjectBriefChat onBriefGenerated={handleBriefGenerated} />
              </div>

              {/* Desktop Pro Tips Carousel */}
              <div className="hidden lg:block mt-8">
                <ProTipsCarousel />
              </div>
            </div>
          )}
        </main>
        
        <Footer />
        
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default ProjectBriefGenerator;
