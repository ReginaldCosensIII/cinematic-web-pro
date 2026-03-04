import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

import placeholderCes from '@/assets/placeholder-ces.jpg';
import placeholderRsi from '@/assets/placeholder-rsi.jpg';
import placeholderPortal from '@/assets/placeholder-portal.jpg';
import placeholderBooknook from '@/assets/placeholder-booknook.jpg';
import placeholderPortfolio from '@/assets/placeholder-portfolio.jpg';

interface Project {
  title: string;
  client: string;
  description: string;
  technologies: string[];
  type: 'professional' | 'personal';
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  status: string;
}

const projects: Project[] = [
  {
    title: "CES IT Services Website",
    client: "Computer Enhancement Systems, Inc.",
    description: "Full redesign and development of a corporate IT services website with modern UI, service catalog, and client portal integration.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    type: "professional",
    image: placeholderCes,
    liveUrl: "https://cesitservice.com",
    status: "Live"
  },
  {
    title: "RSI X-Ray Services Website",
    client: "Computer Enhancement Systems, Inc.",
    description: "Corporate website for industrial x-ray and inspection services featuring equipment showcase, service areas, and quote request system.",
    technologies: ["React", "Tailwind CSS", "Supabase", "Vite"],
    type: "professional",
    image: placeholderRsi,
    liveUrl: "https://rsi-xray.com",
    status: "Live"
  },
  {
    title: "HR Certifications Portal",
    client: "Specialized Engineering",
    description: "Internal web portal for tracking employee certifications, compliance deadlines, and automated renewal notifications across the organization.",
    technologies: ["React", "PostgreSQL", "Node.js", "Express"],
    type: "professional",
    image: placeholderPortal,
    status: "Internal LAN"
  },
  {
    title: "Atomic's BookNook",
    client: "Personal Project",
    description: "Feature-rich online bookstore with role-based authentication, dynamic product displays, shopping cart, and full checkout system.",
    technologies: ["Flask", "PostgreSQL", "Jinja2", "JavaScript"],
    type: "personal",
    image: placeholderBooknook,
    liveUrl: "https://cs492-bookstore-project.onrender.com/",
    githubUrl: "https://github.com/ReginaldCosensIII/cs492_bookstore_project",
    status: "Live"
  },
  {
    title: "WebDevPro.io Portfolio",
    client: "Personal Project",
    description: "Modern developer portfolio and business site with AI chatbot, project brief generator, blog, and client dashboard.",
    technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    type: "personal",
    image: placeholderPortfolio,
    liveUrl: "https://webdevpro.io",
    githubUrl: "https://github.com/reggiecosens/webdevpro",
    status: "Live"
  }
];

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
    status === 'Internal LAN'
      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
  }`}>
    {status === 'Internal LAN' && <Lock className="w-3 h-3" />}
    {status}
  </span>
);

const TypeBadge = ({ type }: { type: 'professional' | 'personal' }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-webdev-gradient-blue/20 text-blue-300 border border-blue-500/30">
    {type === 'professional' ? 'Professional' : 'Personal'}
  </span>
);

const ProjectActions = ({ project }: { project: Project }) => (
  <div className="flex gap-3 flex-wrap">
    {project.liveUrl && (
      <Button variant="glass" size="sm" asChild>
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4" />
          View Live
        </a>
      </Button>
    )}
    {project.githubUrl && (
      <Button variant="glass" size="sm" asChild>
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          <Github className="w-4 h-4" />
          Source Code
        </a>
      </Button>
    )}
    {!project.liveUrl && !project.githubUrl && (
      <span className="inline-flex items-center gap-1.5 text-sm text-webdev-soft-gray">
        <Lock className="w-4 h-4" />
        Internal deployment only
      </span>
    )}
  </div>
);

/* ─── Desktop Card: overlay text on image ─── */
const DesktopCard = ({ project }: { project: Project }) => (
  <div className="group relative glass-effect rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-webdev-gradient-blue/10">
    <div className="relative w-full aspect-video overflow-hidden">
      <img
        src={project.image}
        alt={`${project.title} preview screenshot`}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      <div className="absolute top-4 right-4 z-10"><StatusBadge status={project.status} /></div>
      <div className="absolute top-4 left-4 z-10"><TypeBadge type={project.type} /></div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
        <p className="text-webdev-soft-gray text-xs uppercase tracking-wider mb-1">{project.client}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-webdev-silver/80 text-sm md:text-base leading-relaxed max-w-xl mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.technologies.map((tech) => (
            <span key={tech} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-webdev-silver backdrop-blur-sm border border-white/10">
              {tech}
            </span>
          ))}
        </div>
        <ProjectActions project={project} />
      </div>
    </div>
  </div>
);

/* ─── Mobile Card: stacked layout, image on top, content below ─── */
const MobileCard = ({ project }: { project: Project }) => (
  <div className="glass-effect rounded-xl overflow-hidden">
    {/* Image with badges */}
    <div className="relative w-full aspect-[16/10] overflow-hidden">
      <img
        src={project.image}
        alt={`${project.title} preview screenshot`}
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute top-3 right-3"><StatusBadge status={project.status} /></div>
      <div className="absolute top-3 left-3"><TypeBadge type={project.type} /></div>
    </div>

    {/* Content below the image */}
    <div className="p-5 space-y-3">
      <p className="text-webdev-soft-gray text-xs uppercase tracking-wider">{project.client}</p>
      <h3 className="text-xl font-bold text-white">{project.title}</h3>
      <p className="text-webdev-silver/80 text-sm leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <span key={tech} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/10 text-webdev-silver border border-white/10">
            {tech}
          </span>
        ))}
      </div>
      <ProjectActions project={project} />
    </div>
  </div>
);

const FeaturedWork = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();

  const next = useCallback(() => setCurrentIndex((prev) => (prev + 1) % projects.length), []);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

  // Auto-rotation: 5s interval, pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const project = projects[currentIndex];

  return (
    <section id="featuredwork" className="relative py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10 mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-effect border border-webdev-glass-border">
            <div className="w-2 h-2 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full animate-pulse" />
            <span className="text-webdev-silver text-sm">Featured Projects</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-light tracking-tight">
            <span className="text-webdev-silver">Recent </span>
            <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
              Work
            </span>
          </h2>

          <p className="text-lg text-webdev-soft-gray max-w-2xl mx-auto leading-relaxed">
            A curated selection of professional and personal projects showcasing full-stack web development.
          </p>
        </div>

        {/* Project Card */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {isMobile ? (
            <MobileCard project={project} />
          ) : (
            <DesktopCard project={project} />
          )}

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 md:-left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-webdev-darker-gray/80 border border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 md:-right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-webdev-darker-gray/80 border border-webdev-glass-border text-webdev-silver hover:bg-webdev-glass hover:text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator with auto-rotation visual */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="relative h-1.5 w-12 bg-webdev-darker-gray rounded-full overflow-hidden"
                aria-label={`Go to project ${index + 1}`}
              >
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple rounded-full transition-all duration-500 ease-out ${
                    index === currentIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-3">
          <span className="text-webdev-soft-gray text-sm">
            {currentIndex + 1} of {projects.length}
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
