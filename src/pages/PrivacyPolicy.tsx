import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center animate-fade-in-up mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-webdev-silver tracking-wide mb-6">
              Privacy{' '}
              <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                Policy
              </span>
            </h1>
            <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
          </div>

          <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border animate-fade-in-up">
            <div className="prose prose-invert max-w-none">
              <div className="text-webdev-soft-gray leading-relaxed space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Information We Collect</h2>
                  <p className="mb-4">
                    We collect information you provide directly to us, such as when you create an account, 
                    contact us, or use our services. This may include your name, email address, and any 
                    other information you choose to provide.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">How We Use Your Information</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide, maintain, and improve our services</li>
                    <li>To communicate with you about our services</li>
                    <li>To respond to your comments, questions, and requests</li>
                    <li>To monitor and analyze trends and usage</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Information Sharing</h2>
                  <p className="mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this policy or as required by law.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Data Security</h2>
                  <p className="mb-4">
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-webdev-silver mb-4">Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at{' '}
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

export default PrivacyPolicy;