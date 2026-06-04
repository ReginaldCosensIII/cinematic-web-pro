import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Tech = {
  name: string;
  slug: string; // simpleicons slug
  color: string; // hex without #
  description: string;
};

const techStack: Tech[] = [
  { name: 'React', slug: 'react', color: '61DAFB', description: 'Component-based UI library powering fast, interactive interfaces.' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6', description: 'Typed JavaScript that catches bugs early and scales codebases cleanly.' },
  { name: 'Next.js', slug: 'nextdotjs', color: 'FFFFFF', description: 'React framework with SSR, routing, and image optimization built in.' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4', description: 'Utility-first CSS for rapid, consistent, design-system-driven styling.' },
  { name: 'Node.js', slug: 'nodedotjs', color: '5FA04E', description: 'JavaScript runtime powering fast, scalable backend services and APIs.' },
  { name: 'Python', slug: 'python', color: '3776AB', description: 'Versatile language for backend APIs, automation, and data work.' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '4169E1', description: 'Battle-tested relational database with rock-solid reliability at scale.' },
  { name: 'Supabase', slug: 'supabase', color: '3FCF8E', description: 'Open-source backend with auth, database, storage, and edge functions.' },
  { name: 'Vercel', slug: 'vercel', color: 'FFFFFF', description: 'Edge deployment platform with global CDN and instant rollbacks.' },
  { name: 'Cloudflare', slug: 'cloudflare', color: 'F38020', description: 'Global network for DNS, CDN, security, and edge compute.' },
  { name: 'Figma', slug: 'figma', color: 'F24E1E', description: 'Collaborative design tool for high-fidelity mockups and design systems.' },
  { name: 'Framer Motion', slug: 'framer', color: '0055FF', description: 'Production-ready animation library for smooth, declarative motion in React.' },
];

const TechCard = ({ tech }: { tech: Tech }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group/tile relative flex flex-col items-center justify-center gap-3 w-40 h-32 mx-3 shrink-0 card-unified card-feature rounded-xl cursor-help transition-transform duration-300 hover:scale-105">
          <Info
            className="absolute top-2 right-2 w-3.5 h-3.5 text-wdp-text-secondary/40 group-hover/tile:text-webdev-gradient-blue transition-colors duration-300"
            aria-hidden="true"
          />
          <img
            src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
            alt={`${tech.name} logo`}
            className="w-10 h-10 object-contain"
            loading="lazy"
          />
          <span className="text-sm font-medium text-wdp-text">{tech.name}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="center"
        sideOffset={12}
        collisionPadding={16}
        avoidCollisions={false}
        className="max-w-[min(20rem,calc(100vw-2rem))] text-center"
      >
        <p className="text-xs leading-relaxed">{tech.description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TechStackMarquee = () => {
  // duplicate the list for seamless infinite scrolling
  const loop = [...techStack, ...techStack];

  return (
    <div
      className="relative overflow-x-clip overflow-y-visible py-8 -my-2 group"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
      aria-label="Modern technology stack, scrolling carousel"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] py-2">

        {loop.map((tech, i) => (
          <TechCard key={`${tech.name}-${i}`} tech={tech} />
        ))}
      </div>
      <p className="sr-only">
        Hover any technology to see how it fits the stack.
      </p>
    </div>
  );
};

export default TechStackMarquee;
