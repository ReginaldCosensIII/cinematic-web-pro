import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import ProjectBriefChat from '@/components/ProjectBriefChat';

const ProjectBriefGenerator = () => {
  const [showChat, setShowChat] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<string>('');

  const handleStartBrief = () => {
    setShowChat(true);
  };

  const handleBriefGenerated = (brief: string) => {
    setGeneratedBrief(brief);
  };

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
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center">
                  <Lightbulb className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-webdev-silver mb-6 text-glow">
                Let's Plan Your Website{" "}
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                  the Smart Way
                </span>
              </h1>
              
              <p className="text-xl text-webdev-soft-gray mb-8 leading-relaxed">
                Use our guided AI tool to generate a professional project brief that you can 
                submit to us or download for your records. Get clarity on your vision and 
                requirements in minutes.
              </p>
              
              <Button
                onClick={handleStartBrief}
                className="glass-effect border-2 border-transparent bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple text-white font-semibold px-8 py-4 text-lg rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(66,133,244,0.4)]"
              >
                Start Your Brief
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="glass-effect border border-webdev-glass-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-webdev-silver mb-2">Guided Questions</h3>
                <p className="text-webdev-soft-gray">
                  Our AI walks you through essential questions about your project goals, features, and requirements.
                </p>
              </div>
              
              <div className="glass-effect border border-webdev-glass-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-webdev-silver mb-2">Professional Brief</h3>
                <p className="text-webdev-soft-gray">
                  Get a comprehensive, well-structured document that clearly outlines your project needs.
                </p>
              </div>
              
              <div className="glass-effect border border-webdev-glass-border rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-webdev-silver mb-2">Download & Submit</h3>
                <p className="text-webdev-soft-gray">
                  Download your brief or submit it directly to our team to get started on your project.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-webdev-silver mb-4">
                Project Brief Generator
              </h1>
              <p className="text-webdev-soft-gray">
                Let's create your professional project brief together
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <ProjectBriefChat onBriefGenerated={handleBriefGenerated} />
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