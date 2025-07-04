import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center animate-fade-in-up mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-webdev-silver tracking-wide mb-6">
              Terms of{' '}
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Service
              </span>
            </h1>
            <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services.
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border animate-fade-in-up">
            <div className="prose prose-invert max-w-none">
              <div className="text-webdev-soft-gray leading-relaxed space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Acceptance of Terms</h2>
                  <p className="mb-4">
                    By accessing and using this website, you accept and agree to be bound by the terms 
                    and provision of this agreement.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Use License</h2>
                  <p className="mb-4">
                    Permission is granted to temporarily download one copy of the materials on WebDevPro's 
                    website for personal, non-commercial transitory viewing only.
                  </p>
                  <p className="mb-4">This license shall automatically terminate if you violate any of these restrictions.</p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Disclaimer</h2>
                  <p className="mb-4">
                    The materials on WebDevPro's website are provided on an 'as is' basis. WebDevPro makes 
                    no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Limitations</h2>
                  <p className="mb-4">
                    In no event shall WebDevPro or its suppliers be liable for any damages (including, 
                    without limitation, damages for loss of data or profit, or due to business interruption) 
                    arising out of the use or inability to use the materials on WebDevPro's website.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Accuracy of Materials</h2>
                  <p className="mb-4">
                    The materials appearing on WebDevPro's website could include technical, typographical, 
                    or photographic errors. WebDevPro does not warrant that any of the materials on its 
                    website are accurate, complete, or current.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Governing Law</h2>
                  <p className="mb-4">
                    These terms and conditions are governed by and construed in accordance with the laws 
                    and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at{' '}
                    <a href="mailto:contact@webdevpro.com" className="text-webdev-gradient-blue hover:underline">
                      contact@webdevpro.com
                    </a>
                  </p>
                </div>

                <div className="border-t border-webdev-glass-border pt-6 mt-8">
                  <p className="text-sm">
                    <strong>Last updated:</strong> January 1, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;