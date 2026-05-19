import { Phone, MessageSquare, Brain, Workflow, Mail, Calendar, FileText, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AISolution {
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  tier: 'foundational' | 'advanced';
  features: string[];
  bestFor: string;
}

export const aiSolutions: AISolution[] = [
  // Foundational / lower-hanging fruit
  {
    slug: 'ai-phone-answering',
    icon: Phone,
    title: 'AI Phone Answering',
    tagline: '24/7 voice agents that never miss a call',
    description:
      'Natural-sounding AI voice agents that answer calls, qualify leads, book appointments, and route urgent issues — around the clock.',
    tier: 'foundational',
    features: ['Call answering & routing', 'Appointment booking', 'Lead qualification', 'Voicemail summaries'],
    bestFor: 'Service businesses, clinics, contractors, and offices that lose revenue from missed calls.',
  },
  {
    slug: 'ai-customer-service-chatbot',
    icon: MessageSquare,
    title: 'AI Customer Service Chatbot',
    tagline: 'Instant answers on your website and SMS',
    description:
      'Trained on your business, your FAQs, and your tone — a chatbot that resolves common questions, captures leads, and hands off to humans seamlessly.',
    tier: 'foundational',
    features: ['Website + SMS support', 'Trained on your content', 'Lead capture & CRM sync', 'Human handoff'],
    bestFor: 'Small businesses that want to deflect support volume without sounding robotic.',
  },
  {
    slug: 'ai-email-inbox-management',
    icon: Mail,
    title: 'AI Email & Inbox Management',
    tagline: 'Triage, draft, and reply at machine speed',
    description:
      'Automated inbox triage with AI-drafted replies in your voice. Free up hours every week and respond to leads faster than the competition.',
    tier: 'foundational',
    features: ['Smart triage & labels', 'AI-drafted replies', 'Lead alerts', 'Follow-up automation'],
    bestFor: 'Owners and professionals drowning in email.',
  },
  {
    slug: 'ai-scheduling-booking',
    icon: Calendar,
    title: 'AI Scheduling & Booking',
    tagline: 'Self-serve booking with conversational AI',
    description:
      'Conversational scheduling across web, SMS, and phone. Reduces back-and-forth and fills your calendar without lifting a finger.',
    tier: 'foundational',
    features: ['Conversational booking', 'Calendar sync', 'Reminders & no-show recovery', 'Multi-staff routing'],
    bestFor: 'Appointment-driven businesses.',
  },
  {
    slug: 'ai-content-seo-assist',
    icon: Search,
    title: 'AI Content & SEO Assistant',
    tagline: 'Always-on local content engine',
    description:
      'AI workflows that research, draft, and optimize blog posts, landing pages, and local SEO content tailored to your service area.',
    tier: 'foundational',
    features: ['Topic research', 'Local SEO drafts', 'On-page optimization', 'Editorial review workflow'],
    bestFor: 'Businesses that want consistent local SEO content without hiring a full team.',
  },

  // Advanced / sophisticated
  {
    slug: 'bespoke-executive-ai-assistant',
    icon: Brain,
    title: 'Bespoke Executive AI Assistant',
    tagline: 'A custom AI chief-of-staff for CEOs and professionals',
    description:
      'A private, custom-trained AI assistant built around your exact workflow, knowledge base, tone, and tools. Briefings, drafts, research, decisions — on demand.',
    tier: 'advanced',
    features: [
      'Trained on your private knowledge',
      'Multi-tool integrations (email, docs, CRM, calendar)',
      'Custom voice & writing style',
      'Secure, role-based access',
    ],
    bestFor: 'Founders, CEOs, attorneys, advisors, and professionals who need leverage, not another SaaS.',
  },
  {
    slug: 'workflow-automation-ai-integrations',
    icon: Workflow,
    title: 'Workflow Automation & AI Integrations',
    tagline: 'Connect AI to the tools you already use',
    description:
      'End-to-end automations that wire AI into your CRM, project management, billing, and ops — eliminating busywork and removing bottlenecks across your business.',
    tier: 'advanced',
    features: [
      'CRM, ERP & SaaS integrations',
      'Custom AI agents & pipelines',
      'Document & data extraction',
      'Monitoring, logs & guardrails',
    ],
    bestFor: 'Operationally complex businesses ready to scale without adding headcount.',
  },
  {
    slug: 'ai-document-intelligence',
    icon: FileText,
    title: 'AI Document Intelligence',
    tagline: 'Turn PDFs, contracts, and forms into structured data',
    description:
      'Custom AI pipelines that read, classify, summarize, and extract data from your documents — contracts, invoices, intake forms, and more.',
    tier: 'advanced',
    features: ['Extraction & classification', 'Summarization', 'Compliance review', 'Workflow handoff'],
    bestFor: 'Law firms, finance, real estate, healthcare, and document-heavy operations.',
  },
];

export const featuredAISolutions = [
  'bespoke-executive-ai-assistant',
  'workflow-automation-ai-integrations',
  'ai-phone-answering',
];

export const localities = [
  {
    slug: 'hagerstown-md',
    city: 'Hagerstown',
    region: 'MD',
    regionFull: 'Maryland',
    label: 'Hagerstown, MD',
  },
  {
    slug: 'frederick-md',
    city: 'Frederick',
    region: 'MD',
    regionFull: 'Maryland',
    label: 'Frederick, MD',
  },
];
