import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import { Mail, MapPin, Phone, Send, CheckCircle, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-contact', {
        body: {
          ...formData,
          userId: user?.id
        }
      });

      if (error) {
        throw error;
      }

      console.log('Contact form submitted:', data);
      setIsSubmitted(true);
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. I'll get back to you within 24 hours."
      });

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: '',
          budget: '',
          message: ''
        });
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const projectTypes = [
    'Website Development',
    'E-commerce Platform',
    'Web Application',
    'Mobile App',
    'Portfolio Website',
    'Landing Page',
    'Other'
  ];

  const budgetRanges = [
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+'
  ];

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* User Authentication Status */}
          <div className="mb-8 flex justify-between items-center">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-light text-webdev-silver tracking-wide mb-6">
                Let&apos;s Work Together
              </h1>
              <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
                Ready to bring your vision to life? Get in touch and let&apos;s discuss your next web development project.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="glass-effect rounded-xl p-4 flex items-center gap-3">
                  <User className="w-5 h-5 text-webdev-gradient-blue" />
                  <span className="text-webdev-silver">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="p-1 hover:text-webdev-gradient-blue transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="glass-effect hover:glass-border px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info Section - keep existing code */}
            <div className="animate-fade-in-up">
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                <h2 className="text-2xl font-semibold text-webdev-silver mb-6">
                  Get In Touch
                </h2>
                <p className="text-webdev-soft-gray mb-8 leading-relaxed">
                  I&apos;m always excited to work on new projects and collaborate with innovative teams. 
                  Whether you need a complete web solution or want to enhance your existing platform, 
                  I&apos;m here to help.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full mr-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                        <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                          <Mail 
                            className="w-5 h-5" 
                            stroke="url(#contact-icon-gradient)" 
                            fill="none"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-webdev-silver font-medium">Email</p>
                      <p className="text-webdev-soft-gray">contact@webdevpro.com</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full mr-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                        <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                          <Phone 
                            className="w-5 h-5" 
                            stroke="url(#contact-icon-gradient)" 
                            fill="none"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-webdev-silver font-medium">Phone</p>
                      <p className="text-webdev-soft-gray">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full mr-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple p-0.5">
                        <div className="w-full h-full rounded-full bg-webdev-dark-gray flex items-center justify-center">
                          <MapPin 
                            className="w-5 h-5" 
                            stroke="url(#contact-icon-gradient)" 
                            fill="none"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-webdev-silver font-medium">Location</p>
                      <p className="text-webdev-soft-gray">Available Worldwide</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-webdev-glass-border">
                  <h3 className="text-lg font-medium text-webdev-silver mb-4">
                    What I Can Help With
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Custom Web Development',
                      'E-commerce Solutions',
                      'Performance Optimization',
                      'UI/UX Implementation',
                      'Technical Consulting',
                      'Maintenance & Support'
                    ].map((service, index) => (
                      <li key={index} className="flex items-center text-webdev-soft-gray">
                        <div className="w-2 h-2 rounded-full bg-webdev-gradient-blue mr-3"></div>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-webdev-silver mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-webdev-soft-gray">
                      Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-webdev-silver mb-6">
                      Start Your Project
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Form fields - keep existing code structure but update form submission */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-webdev-silver">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-webdev-silver">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="company" className="text-webdev-silver">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="bg-webdev-darker-gray border-webdev-glass-border text-webdev-silver focus:border-webdev-gradient-blue"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="projectType" className="text-webdev-silver">Project Type</Label>
                          <select
                            id="projectType"
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleInputChange}
                            className="w-full h-10 rounded-md border border-webdev-glass-border bg-webdev-darker-gray px-3 py-2 text-webdev-silver focus:border-webdev-gradient-blue focus:outline-none"
                          >
                            <option value="">Select project type</option>
                            {projectTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="budget" className="text-webdev-silver">Budget Range</Label>
                          <select
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full h-10 rounded-md border border-webdev-glass-border bg-webdev-darker-gray px-3 py-2 text-webdev-silver focus:border-webdev-gradient-blue focus:outline-none"
                          >
                            <option value="">Select budget range</option>
                            {budgetRanges.map(range => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-webdev-silver">Project Details *</Label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full rounded-md border border-webdev-glass-border bg-webdev-darker-gray px-3 py-2 text-webdev-silver focus:border-webdev-gradient-blue focus:outline-none resize-none"
                          placeholder="Tell me about your project, goals, and timeline..."
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full glass-effect hover:glass-border px-8 py-3 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] hover:shadow-lg hover:shadow-webdev-gradient-blue/20 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SVG Gradient Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="contact-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
