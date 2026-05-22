import React from 'react';
import { Code, Palette, Search, RefreshCw, Check, Zap, TrendingUp, Sparkles, Shield, Rocket, Compass, PenTool, Hammer, Gauge, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import StructuredData from '@/components/StructuredData';
import ScrollReveal from '@/components/ScrollReveal';
import SmokeBackground from '@/components/SmokeBackground';
import serviceCustomDesign from '@/assets/service-custom-design.jpg';
import serviceFullstackDev from '@/assets/service-fullstack-dev.jpg';
import serviceSeoOptimization from '@/assets/service-seo-optimization.jpg';
import serviceRedesignRevamp from '@/assets/service-redesign-revamp.jpg';

const services = [
  {
    slug: 'custom-website-design',
    icon: Palette,
    image: serviceCustomDesign,
    imageAlt: 'Abstract floating UI components representing custom website design services',
    title: 'Custom Website Design',
    tagline: 'Brand-true, conversion-focused design',
    description: 'Crafting responsive, on-brand websites that captivate and convert.',
    detailedDescription: 'Transform your digital presence with custom website designs that perfectly reflect your brand identity and convert visitors into customers.',
    keyBenefits: ['Custom brand-aligned design system', 'Responsive design across all devices', 'User-centered interface design', 'Conversion optimization strategies', 'Modern visual aesthetics', 'Accessibility compliance'],
    technologies: ['Figma', 'Adobe Creative Suite', 'Tailwind CSS', 'React', 'TypeScript'],
    deliverables: ['Complete design mockups', 'Interactive prototypes', 'Design system documentation', 'Responsive layouts for all screen sizes', 'Brand guidelines and style guide'],
  },
  {
    slug: 'full-stack-development',
    icon: Code,
    image: serviceFullstackDev,
    imageAlt: 'Code editor windows and server architecture representing full-stack development',
    title: 'Full-Stack Development',
    tagline: 'Modern apps, end to end',
    description: 'Complete front-end and back-end builds using modern code and frameworks.',
    detailedDescription: 'Build robust, scalable web applications with modern full-stack development — from data model to deployed product.',
    keyBenefits: ['Scalable architecture design', 'Modern framework implementation', 'Secure authentication systems', 'Real-time data processing', 'Third-party API integrations', 'Cloud deployment and hosting'],
    technologies: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Supabase', 'Vercel'],
    deliverables: ['Complete web application', 'Database design and setup', 'API documentation', 'Admin dashboard (if needed)', 'Deployment and hosting setup'],
  },
  {
    slug: 'seo-optimization',
    icon: Search,
    image: serviceSeoOptimization,
    imageAlt: 'Analytics charts and search metrics representing SEO optimization services',
    title: 'SEO & Optimization',
    tagline: 'Faster, leaner, more findable',
    description: 'Making your site fast, discoverable, and high-performing.',
    detailedDescription: 'Maximize your website&apos;s visibility and performance with comprehensive SEO and Core Web Vitals optimization.',
    keyBenefits: ['Improved search engine rankings', 'Faster page load speeds', 'Enhanced user experience', 'Mobile optimization', 'Better conversion rates', 'Increased organic traffic'],
    technologies: ['Google Analytics', 'Search Console', 'Lighthouse', 'GTMetrix', 'Schema Markup'],
    deliverables: ['Complete SEO audit report', 'Optimized meta tags and content', 'Technical SEO improvements', 'Performance optimization', 'Analytics setup and tracking'],
  },
  {
    slug: 'redesign-revamp',
    icon: RefreshCw,
    image: serviceRedesignRevamp,
    imageAlt: 'Before and after website transformation representing redesign services',
    title: 'Redesign & Revamp',
    tagline: 'From dated to standout',
    description: 'Give your outdated site a full makeover — sleek, modern, and high-converting.',
    detailedDescription: 'Breathe new life into your existing website with a complete redesign, modernization, and conversion overhaul.',
    keyBenefits: ['Modern, fresh visual design', 'Improved user experience', 'Better mobile responsiveness', 'Enhanced functionality', 'Improved conversion rates', 'Better search engine performance'],
    technologies: ['React', 'Modern CSS', 'Progressive Web Apps', 'Performance Tools', 'Analytics'],
    deliverables: ['Complete site redesign', 'Modernized codebase', 'Performance improvements', 'Mobile optimization', 'Content migration', 'Training and documentation'],
  },
];

const valueProps = [
  { icon: Sparkles, title: 'Design that signals quality', body: 'High-end visual polish that positions you above local competitors stuck in 2010.' },
  { icon: Gauge, title: 'Built for performance', body: 'Fast, accessible, SEO-ready code — not bloated page-builder output.' },
  { icon: Shield, title: 'Owned by you', body: 'Modern stack, clean code, no proprietary lock-in. Your site, your asset.' },
];

const processSteps = [
  { icon: Compass, title: 'Discover', body: 'Goals, audience, competitors, and the actual outcomes you need the site to drive.' },
  { icon: PenTool, title: 'Design', body: 'Brand-aligned design system and high-fidelity mockups before a line of code.' },
  { icon: Hammer, title: 'Build', body: 'Production-quality code, responsive on every device, optimized from the start.' },
  { icon: Rocket, title: 'Launch & iterate', body: 'Deploy, measure, refine. Your site grows with the business.' },
];

const techStack = [
  'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Python', 'PostgreSQL', 'Supabase', 'Vercel', 'Cloudflare', 'Figma', 'Framer Motion',
];

const faqs = [
  { q: 'How long does a typical website project take?', a: 'Marketing sites usually take 3–6 weeks. Full-stack web applications run 6–12+ weeks depending on scope. We scope every project upfront so you know exactly what to expect.' },
  { q: 'Do you work with local businesses in Hagerstown / Frederick, MD?', a: 'Yes. We work directly with businesses across Western Maryland and the surrounding tri-state area, plus remote clients nationally.' },
  { q: 'What does it cost?', a: 'Every project is scoped and quoted individually based on goals, complexity, and timeline. Send a brief and you&apos;ll get a clear, fixed proposal — no hourly surprises.' },
  { q: 'Will I own the code and the site?', a: '100%. Modern, clean code in your repository, deployed on platforms you own. No proprietary builders, no lock-in.' },
];

const ServicesPage = () => {
  return (
    <>
      <SEOHead
        title="Web Development Services | Custom Sites, Full-Stack, SEO | WebDevPro"
        description="Professional web development services — custom website design, full-stack development, SEO & performance optimization, and redesigns. Built for businesses in Hagerstown, Frederick MD and beyond."
        keywords="web development services, custom website design, full-stack development, SEO optimization, website redesign, Hagerstown MD web design, Frederick MD web developer"
        canonicalUrl="https://webdevpro.io/services/web-development"
      />
      <StructuredData
        type="service"
        data={{
          name: 'Web Development Services',
          description: 'Custom website design, full-stack development, SEO optimization, and website redesigns.',
          provider: { name: 'WebDevPro', url: 'https://webdevpro.io' },
          areaServed: 'Hagerstown MD, Frederick MD, and remote nationwide',
          serviceType: 'Web Development',
        }}
      />
      <StructuredData
        type="faq"
        data={{ questions: faqs.map((f) => ({ question: f.q, answer: f.a })) }}
      />

      <div className="min-h-screen theme-bg">
        <SmokeBackground />
        <Header />

        <main className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <header className="text-center space-y-8 max-w-4xl mx-auto mb-20">
              <div className="space-y-6" style={{ animation: 'fade-in 0.7s ease-out both' }}>
                <h1 className="text-4xl md:text-6xl font-light text-wdp-text tracking-wide">
                  Web Development{' '}
                  <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                    Services
                  </span>
                </h1>
                <p className="text-xl text-wdp-text-secondary max-w-3xl mx-auto leading-relaxed">
                  From a polished marketing site to a full custom web application — modern, fast,
                  conversion-focused builds that make your business look as serious as it is.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link to="/contact">
                    <Button variant="glass" size="lg">Book a Free Consult</Button>
                  </Link>
                  <Link to="/project-brief">
                    <Button variant="glass" size="lg">Start a Project Brief</Button>
                  </Link>
                </div>
              </div>
            </header>

            {/* Value props */}
            <ScrollReveal>
              <section className="grid md:grid-cols-3 gap-6 mb-24" aria-labelledby="value-heading">
                <h2 id="value-heading" className="sr-only">Why work with WebDevPro</h2>
                {valueProps.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="card-unified card-feature rounded-xl p-6">
                    <div className="icon-gradient-container relative w-12 h-12 rounded-xl mb-4">
                      <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-wdp-text mb-2">{title}</h3>
                    <p className="text-wdp-text-secondary leading-relaxed">{body}</p>
                  </div>
                ))}
              </section>
            </ScrollReveal>

            {/* Services overview grid (jump links) */}
            <ScrollReveal>
              <section className="mb-24" aria-labelledby="overview-heading">
                <div className="text-center mb-12">
                  <h2 id="overview-heading" className="text-3xl md:text-5xl font-light text-wdp-text">
                    What we{' '}
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                      build
                    </span>
                  </h2>
                  <p className="text-wdp-text-secondary mt-4 max-w-2xl mx-auto">
                    Four core services, each scoped and delivered to a professional standard.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.slug}
                        href={`#${s.slug}`}
                        className="group card-unified card-feature rounded-xl p-6 flex flex-col"
                      >
                        <div className="icon-gradient-container relative w-12 h-12 rounded-xl mb-4">
                          <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-wdp-text mb-1">{s.title}</h3>
                        <p className="text-sm text-webdev-gradient-blue mb-2">{s.tagline}</p>
                        <p className="text-sm text-wdp-text-secondary leading-relaxed flex-1">{s.description}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">
                          Details
                          <ArrowRight className="w-4 h-4 text-webdev-gradient-blue" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </section>
            </ScrollReveal>

            {/* Detailed services */}
            <section className="space-y-16 mb-24" aria-label="Service details">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <ScrollReveal key={service.slug} delay={index * 60}>
                    <article
                      id={service.slug}
                      className="group card-unified card-feature rounded-xl overflow-hidden scroll-mt-32"
                    >
                      <div className="grid lg:grid-cols-5">
                        <div className="lg:col-span-2 h-48 lg:h-auto overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.imageAlt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            width={896}
                            height={512}
                          />
                        </div>

                        <div className="lg:col-span-3 p-8 md:p-10">
                          <header className="flex items-start gap-4 mb-5">
                            <div className="icon-gradient-container relative w-14 h-14 rounded-xl flex-shrink-0">
                              <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                                <Icon className="w-7 h-7" />
                              </div>
                            </div>
                            <div>
                              <h2 className="text-2xl md:text-3xl font-semibold text-wdp-text">{service.title}</h2>
                              <p className="text-webdev-gradient-blue">{service.tagline}</p>
                            </div>
                          </header>
                          <p className="text-wdp-text-secondary leading-relaxed mb-6">{service.detailedDescription}</p>

                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h3 className="text-sm font-semibold text-wdp-text mb-3 flex items-center gap-2">
                                <Check className="w-4 h-4 text-webdev-gradient-blue" />Key Benefits
                              </h3>
                              <ul className="space-y-2">
                                {service.keyBenefits.map((b) => (
                                  <li key={b} className="flex items-start gap-2 text-sm text-wdp-text-secondary">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple mt-2 flex-shrink-0" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-wdp-text mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-webdev-gradient-blue" />What You Get
                              </h3>
                              <ul className="space-y-2">
                                {service.deliverables.map((d) => (
                                  <li key={d} className="flex items-start gap-2 text-sm text-wdp-text-secondary">
                                    <Check className="w-3.5 h-3.5 text-webdev-gradient-blue mt-1 flex-shrink-0" />
                                    <span>{d}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-wdp-text mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-webdev-gradient-purple" />Tools & Tech
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {service.technologies.map((t) => (
                                <span key={t} className="px-3 py-1 text-xs glass-effect rounded-full text-wdp-text">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </section>

            {/* Process */}
            <ScrollReveal>
              <section className="mb-24" aria-labelledby="process-heading">
                <div className="text-center mb-12">
                  <h2 id="process-heading" className="text-3xl md:text-5xl font-light text-wdp-text">
                    A clear,{' '}
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                      proven process
                    </span>
                  </h2>
                  <p className="text-wdp-text-secondary mt-4 max-w-2xl mx-auto">
                    No mystery. Every project follows the same proven path from idea to launch.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {processSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.title} className="card-unified card-feature rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 text-xs font-mono bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                          0{i + 1}
                        </div>
                        <div className="icon-gradient-container relative w-12 h-12 rounded-xl mb-4">
                          <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-wdp-text mb-2">{step.title}</h3>
                        <p className="text-sm text-wdp-text-secondary leading-relaxed">{step.body}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </ScrollReveal>

            {/* Tech stack */}
            <ScrollReveal>
              <section className="mb-24" aria-labelledby="stack-heading">
                <div className="glass-effect rounded-2xl p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 id="stack-heading" className="text-3xl md:text-4xl font-light text-wdp-text">
                      Modern{' '}
                      <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                        stack
                      </span>
                    </h2>
                    <p className="text-wdp-text-secondary mt-3 max-w-2xl mx-auto">
                      Battle-tested technologies chosen for performance, scalability, and longevity.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {techStack.map((t) => (
                      <span key={t} className="px-4 py-2 text-sm glass-effect rounded-full text-wdp-text">{t}</span>
                    ))}
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* FAQ */}
            <ScrollReveal>
              <section className="mb-24" aria-labelledby="faq-heading">
                <div className="text-center mb-12">
                  <h2 id="faq-heading" className="text-3xl md:text-5xl font-light text-wdp-text">
                    Common{' '}
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                      questions
                    </span>
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {faqs.map((f) => (
                    <div key={f.q} className="card-unified card-feature rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-wdp-text mb-2">{f.q}</h3>
                      <p className="text-wdp-text-secondary leading-relaxed text-sm">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal>
              <section className="text-center">
                <div className="card-unified card-cta">
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-light text-wdp-text mb-4">
                      Ready to start your{' '}
                      <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                        project
                      </span>
                      ?
                    </h2>
                    <p className="text-wdp-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                      Let&apos;s discuss your needs and create something exceptional together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/contact">
                        <Button variant="glass" size="lg">Get in Touch</Button>
                      </Link>
                      <Link to="/project-brief">
                        <Button variant="glass" size="lg">Start a Project Brief</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;
