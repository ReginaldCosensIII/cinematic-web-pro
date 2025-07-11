import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight, Target, Users, Zap, CheckCircle, Lightbulb, Code, Palette, BarChart3 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import ProjectBriefChat from '@/components/ProjectBriefChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import heroImage from '@/assets/project-brief-hero.jpg';

const ProjectBriefGenerator = () => {
  const [showChat, setShowChat] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<string>('');
  const [showTips, setShowTips] = useState(false);

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
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      {/* Animated smoke background */}
      <SmokeBackground />
      
      {/* Glassmorphic header */}
      <Header />
      
      {/* Main content */}
      <main className="relative z-10 pt-24">
        {!showChat ? (
          <div className="container mx-auto px-6 py-16">
            {/* Hero Section */}
            <div className="text-center max-w-5xl mx-auto mb-16">
              <div className="flex justify-center mb-8">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center animate-pulse">
                  <Rocket className="w-14 h-14 text-white" />
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-webdev-silver mb-6 text-glow">
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                  LaunchPad
                </span>
              </h1>
              
              <p className="text-2xl text-webdev-soft-gray mb-8 font-medium">
                From Idea to Action — Start Strong with LaunchPad.
              </p>
              
              {/* Hero Image */}
              <div className="mb-10 relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Project planning and brainstorming workspace"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-webdev-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-medium">Transform your vision into a professional project brief</p>
                </div>
              </div>
              
              <p className="text-xl text-webdev-soft-gray mb-10 leading-relaxed max-w-3xl mx-auto">
                Our AI-powered LaunchPad guides you through a personalized conversation to create a 
                comprehensive project brief. Get clarity on your vision, requirements, and goals in minutes.
              </p>
              
              <Button
                onClick={handleStartBrief}
                className="glass-effect border-2 border-transparent bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple text-white font-bold px-10 py-5 text-xl rounded-full hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(66,133,244,0.5)] group"
              >
                <Rocket className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Start My Brief
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Launch Process Steps */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              <div className="glass-effect border border-webdev-glass-border rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-webdev-silver mb-3">Define Your Vision</h3>
                <p className="text-webdev-soft-gray leading-relaxed">
                  Share your ideas, goals, and requirements through our guided conversation with AI.
                </p>
              </div>
              
              <div className="glass-effect border border-webdev-glass-border rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-webdev-silver mb-3">Generate Brief</h3>
                <p className="text-webdev-soft-gray leading-relaxed">
                  AI creates a comprehensive, professional project brief based on your conversation.
                </p>
              </div>
              
              <div className="glass-effect border border-webdev-glass-border rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-webdev-silver mb-3">Launch Ready</h3>
                <p className="text-webdev-soft-gray leading-relaxed">
                  Download your brief or submit it directly to our team to get started immediately.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-6 py-8">
            {/* Chat Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-xl flex items-center justify-center mr-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-webdev-silver">
                  <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                    LaunchPad
                  </span>
                </h1>
              </div>
              <p className="text-webdev-soft-gray text-lg">
                Let's create your professional project brief together
              </p>
            </div>
            
            {/* 2-Column Layout for Desktop */}
            <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Main Chat Area */}
              <div className="lg:col-span-3">
                <ProjectBriefChat onBriefGenerated={handleBriefGenerated} />
              </div>
              
              {/* Pro Tips Sidebar */}
              <div className="lg:col-span-1">
                {/* Mobile Toggle Button */}
                <div className="lg:hidden mb-6">
                  <Button
                    onClick={() => setShowTips(!showTips)}
                    variant="outline"
                    className="w-full glass-effect border-webdev-glass-border text-webdev-silver"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {showTips ? 'Hide Tips' : 'Show Pro Tips'}
                  </Button>
                </div>

                {/* Tips Content */}
                <div className={`space-y-4 ${showTips ? 'block' : 'hidden lg:block'}`}>
                  <Card className="glass-effect border-webdev-glass-border bg-webdev-black/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-webdev-silver flex items-center">
                        <Palette className="w-5 h-5 mr-2 text-webdev-gradient-blue" />
                        Pro Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {proTips.map((tip, index) => (
                        <div key={index} className="p-4 rounded-lg bg-webdev-black/30 border border-webdev-glass-border/50">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                              <tip.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-webdev-silver text-sm mb-2">{tip.title}</h4>
                              <p className="text-webdev-soft-gray text-xs leading-relaxed">{tip.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Progress Inspiration */}
                  <Card className="glass-effect border-webdev-glass-border bg-webdev-black/40">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-webdev-silver mb-2">Ready to Launch?</h4>
                        <p className="text-webdev-soft-gray text-sm">
                          Take your time to think through each question. The more details you provide, the better your project brief will be.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Glassmorphic footer */}
      <Footer />
    </div>
  );
};

export default ProjectBriefGenerator;