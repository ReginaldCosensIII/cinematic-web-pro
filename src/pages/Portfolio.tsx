
import React, { useState } from 'react';
import { ExternalLink, Github, Lock, ArrowRight, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SmokeBackground from '@/components/SmokeBackground';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';

import placeholderCes from '@/assets/placeholder-ces.jpg';
import placeholderRsi from '@/assets/placeholder-rsi.jpg';
import placeholderPortal from '@/assets/placeholder-portal.jpg';
import placeholderBooknook from '@/assets/placeholder-booknook.jpg';
import placeholderPortfolio from '@/assets/placeholder-portfolio.jpg';

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  longDescription: string;
  technologies: string[];
  type: 'professional' | 'personal';
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  status: string;
  category: string;
  highlights: string[];
}

const projects: Project[] = [
  {
    id: 'ces-it',
    title: "CES IT Services",
    client: "Computer Enhancement Systems, Inc.",
    description: "Full redesign and development of a corporate IT services website with modern UI, service catalog, and client portal integration.",
    longDescription: "A comprehensive digital transformation for CES IT Services. The project involved a complete redesign from legacy systems to a modern, responsive React application. Key deliverables included a dynamic service catalog, integrated client portal, and a streamlined quote request system — all built for performance and scalability.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    type: "professional",
    image: placeholderCes,
    liveUrl: "https://cesitservice.com",
    status: "Live",
    category: "Corporate",
    highlights: ["Full-stack redesign", "Client portal integration", "Service catalog system", "Performance optimized"]
  },
  {
    id: 'rsi-xray',
    title: "RSI X-Ray Services",
    client: "Computer Enhancement Systems, Inc.",
    description: "Corporate website for industrial x-ray and inspection services featuring equipment showcase, service areas, and quote request system.",
    longDescription: "Built a professional web presence for RSI X-Ray Services, a specialized industrial inspection company. The site showcases their equipment capabilities, service coverage areas, and provides a streamlined quote request pipeline — turning a static brochure site into a lead generation engine.",
    technologies: ["React", "Tailwind CSS", "Supabase", "Vite"],
    type: "professional",
    image: placeholderRsi,
    liveUrl: "https://rsi-xray.com",
    status: "Live",
    category: "Corporate",
    highlights: ["Equipment showcase", "Quote request system", "Service area mapping", "SEO optimized"]
  },
  {
    id: 'hr-portal',
    title: "HR Certifications Portal",
    client: "Specialized Engineering",
    description: "Internal web portal for tracking employee certifications, compliance deadlines, and automated renewal notifications.",
    longDescription: "Developed an internal-facing certification management system for a specialized engineering firm. The portal handles employee credential tracking, automated compliance deadline notifications, and generates management reports — replacing a manual spreadsheet process with an efficient, searchable platform.",
    technologies: ["React", "PostgreSQL", "Node.js", "Express"],
    type: "professional",
    image: placeholderPortal,
    status: "Internal LAN",
    category: "Enterprise",
    highlights: ["Certification tracking", "Automated notifications", "Compliance reporting", "Role-based access"]
  },
  {
    id: 'booknook',
    title: "Atomic's BookNook",
    client: "Personal Project",
    description: "Feature-rich online bookstore with role-based authentication, dynamic product displays, shopping cart, and full checkout system.",
    longDescription: "A full-featured e-commerce bookstore built as a capstone project. Features include role-based user authentication (admin, customer), dynamic product catalog with search and filters, persistent shopping cart, and a complete checkout flow — demonstrating end-to-end full-stack capabilities.",
    technologies: ["Flask", "PostgreSQL", "Jinja2", "JavaScript"],
    type: "personal",
    image: placeholderBooknook,
    liveUrl: "https://cs492-bookstore-project.onrender.com/",
    githubUrl: "https://github.com/ReginaldCosensIII/cs492_bookstore_project",
    status: "Live",
    category: "E-Commerce",
    highlights: ["Role-based auth", "Shopping cart system", "Product catalog", "Full checkout flow"]
  },
  {
    id: 'webdevpro',
    title: "WebDevPro.io",
    client: "Personal Project",
    description: "Modern developer portfolio and business site with AI chatbot, project brief generator, blog, and client dashboard.",
    longDescription: "My personal brand and portfolio site — the one you're looking at right now. Built with React and TypeScript, it features an AI-powered chatbot, an interactive project brief generator, a blog platform with CMS, client dashboard with project tracking, and a fully responsive design system with custom animations.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    type: "personal",
    image: placeholderPortfolio,
    liveUrl: "https://webdevpro.io",
    githubUrl: "https://github.com/reggiecosens/webdevpro",
    status: "Live",
    category: "Portfolio",
    highlights: ["AI chatbot", "Project brief generator", "Blog CMS", "Client dashboard"]
  }
];

const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SEOHead
        title="Portfolio | WebDevPro — Recent Work & Case Studies"
        description="Explore a curated collection of professional and personal web development projects. From corporate sites to full-stack apps, see the work behind WebDevPro."
        canonicalUrl="https://webdevpro.io/portfolio"
      />
      <SmokeBackground />
      <Header />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <ScrollReveal>
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
                <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" />
                <span className="text-webdev-silver text-sm">Portfolio</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95]">
                <span className="text-webdev-silver">Crafted with</span>
                <br />
                <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                  Precision
                </span>
              </h1>
              <p className="text-lg md:text-xl text-webdev-soft-gray max-w-xl leading-relaxed">
                Each project is a study in thoughtful engineering, clean design, and purposeful user experience.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Filter */}
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <ScrollReveal>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple text-white shadow-lg shadow-webdev-gradient-blue/25'
                      : 'glass-effect border border-webdev-glass-border text-webdev-soft-gray hover:text-webdev-silver hover:border-webdev-silver/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Projects Grid */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`group cursor-pointer ${index === 0 && filtered.length > 2 ? 'md:col-span-2' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative glass-effect rounded-2xl overflow-hidden border border-webdev-glass-border hover:border-webdev-silver/20 transition-all duration-500">
                    {/* Image */}
                    <div className={`relative overflow-hidden ${index === 0 && filtered.length > 2 ? 'aspect-[21/9]' : 'aspect-video'}`}>
                      <img
                        src={project.image}
                        alt={`${project.title} — ${project.description}`}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-webdev-darker-gray/90 text-blue-200 border border-blue-500/50 shadow-lg">
                          {project.type === 'professional' ? 'Professional' : 'Personal'}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                          project.status === 'Internal LAN'
                            ? 'bg-amber-950/90 text-amber-200 border border-amber-600/50'
                            : 'bg-emerald-950/90 text-emerald-200 border border-emerald-600/50'
                        }`}>
                          {project.status === 'Internal LAN' && <Lock className="w-3 h-3" />}
                          {project.status}
                        </span>
                      </div>

                      {/* Bottom content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <p className="text-webdev-soft-gray text-xs uppercase tracking-widest mb-1">{project.client}</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-webdev-silver/70 text-sm leading-relaxed max-w-lg line-clamp-2">{project.description}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {project.technologies.map(tech => (
                            <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/10 text-webdev-silver border border-white/10">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* View details hint */}
                        <div className="mt-5 flex items-center gap-2 text-webdev-gradient-blue text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 mt-24">
          <ScrollReveal>
            <div className="glass-effect rounded-2xl p-10 md:p-16 border border-webdev-glass-border text-center relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-webdev-gradient-blue/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-webdev-gradient-purple/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-light text-webdev-silver mb-4">
                  Ready to build something <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">exceptional</span>?
                </h2>
                <p className="text-webdev-soft-gray text-lg mb-8 max-w-2xl mx-auto">
                  Let's discuss your next project and create something that stands out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="glass" size="lg" asChild>
                    <a href="/contact">
                      Start a Conversation <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                  <Button variant="glass" size="lg" asChild>
                    <a href="/project-brief">
                      Generate a Brief <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProject(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-effect rounded-2xl border border-webdev-glass-border"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-webdev-darker-gray/90 border border-webdev-glass-border text-webdev-silver hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-webdev-darker-gray/90 text-blue-200 border border-blue-500/50 shadow-lg">
                      {selectedProject.type === 'professional' ? 'Professional' : 'Personal'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                      selectedProject.status === 'Internal LAN'
                        ? 'bg-amber-950/90 text-amber-200 border border-amber-600/50'
                        : 'bg-emerald-950/90 text-emerald-200 border border-emerald-600/50'
                    }`}>
                      {selectedProject.status === 'Internal LAN' && <Lock className="w-3 h-3" />}
                      {selectedProject.status}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{selectedProject.title}</h2>
                  <p className="text-webdev-soft-gray text-sm uppercase tracking-widest mt-1">{selectedProject.client}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-10 space-y-8">
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-webdev-gradient-blue font-semibold mb-3">Overview</h3>
                  <p className="text-webdev-silver/90 text-base leading-relaxed">{selectedProject.longDescription}</p>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-widest text-webdev-gradient-blue font-semibold mb-3">Key Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProject.highlights.map(h => (
                      <div key={h} className="flex items-center gap-2 text-webdev-silver/80 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-widest text-webdev-gradient-blue font-semibold mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 text-webdev-silver border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-webdev-glass-border">
                  {selectedProject.liveUrl && (
                    <Button variant="glass" asChild>
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        View Live Site
                      </a>
                    </Button>
                  )}
                  {selectedProject.githubUrl && (
                    <Button variant="glass" asChild>
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        Source Code
                      </a>
                    </Button>
                  )}
                  {!selectedProject.liveUrl && !selectedProject.githubUrl && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-webdev-soft-gray">
                      <Lock className="w-4 h-4" />
                      Internal deployment — not publicly accessible
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Portfolio;
