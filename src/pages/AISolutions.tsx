import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MapPin, Sparkles, Shield, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import StructuredData from '@/components/StructuredData';
import ScrollReveal from '@/components/ScrollReveal';
import SmokeBackground from '@/components/SmokeBackground';
import { aiSolutions, localities } from '@/data/aiSolutions';
import ChatBot from '@/components/ChatBot';
import aiSolutionsHero from '@/assets/ai-solutions-hero.jpg';

interface AISolutionsPageProps {
  locality?: {
    slug: string;
    city: string;
    region: string;
    regionFull: string;
    label: string;
  };
}

const AISolutionsPage: React.FC<AISolutionsPageProps> = ({ locality }) => {
  const advanced = aiSolutions.filter((s) => s.tier === 'advanced');
  const foundational = aiSolutions.filter((s) => s.tier === 'foundational');

  const baseTitle = locality
    ? `AI Solutions & Integrations in ${locality.label} | WebDevPro`
    : 'AI Solutions & Integrations for Business | WebDevPro';
  const baseDescription = locality
    ? `Custom AI solutions for ${locality.label} businesses — AI phone answering, chatbots, bespoke executive assistants, and workflow automation built locally.`
    : 'Custom AI solutions and integrations for small to mid-sized businesses and professionals — AI phone answering, customer service chatbots, bespoke executive assistants, and full workflow automation.';
  const canonicalUrl = locality
    ? `https://webdevpro.io/services/ai-solutions/${locality.slug}`
    : 'https://webdevpro.io/services/ai-solutions';

  const localBusinessData = {
    name: 'WebDevPro.io — AI Solutions & Integrations',
    address: {
      streetAddress: '',
      addressLocality: locality?.city ?? 'Hagerstown',
      addressRegion: locality?.region ?? 'MD',
      postalCode: '',
      addressCountry: 'US',
    },
    telephone: '+1-555-0123',
    email: 'hello@webdevpro.io',
    url: canonicalUrl,
    openingHours: ['Mo-Fr 09:00-18:00'],
    priceRange: '$$',
  };

  const serviceData = {
    name: locality
      ? `AI Solutions & Integrations — ${locality.label}`
      : 'AI Solutions & Integrations',
    description: baseDescription,
    provider: { name: 'WebDevPro.io', url: 'https://webdevpro.io' },
    areaServed: locality
      ? `${locality.city}, ${locality.regionFull} and surrounding areas`
      : 'Hagerstown MD, Frederick MD, Washington County MD, Frederick County MD, and surrounding areas',
    serviceType: 'AI Integration & Automation',
  };

  const faqData = {
    questions: [
      {
        question: 'What kind of AI solutions can you build for my business?',
        answer:
          'Anything from a simple AI chatbot or phone answering service up to a fully bespoke executive AI assistant or end-to-end workflow automation across your CRM, email, billing, and operations tools.',
      },
      {
        question: 'Do you serve businesses in Hagerstown and Frederick, MD?',
        answer:
          'Yes. We are based in the Hagerstown / Frederick, MD region and have completed extensive professional work for businesses across Frederick County, Washington County, and surrounding Maryland localities.',
      },
      {
        question: 'How is this different from off-the-shelf AI tools?',
        answer:
          'Off-the-shelf tools are generic. We design AI systems around your exact workflow, knowledge, tone, and tools — so the AI fits your business instead of forcing your business to fit the AI.',
      },
      {
        question: 'How long does an AI integration take?',
        answer:
          'Foundational solutions like chatbots or AI phone answering typically launch in 2–4 weeks. Bespoke executive assistants and full workflow automations are scoped per engagement and usually run 4–10 weeks.',
      },
    ],
  };

  return (
    <>
      <SEOHead
        title={baseTitle}
        description={baseDescription}
        keywords={`AI solutions, AI integrations, AI for business, AI phone answering, AI chatbot, bespoke AI assistant, workflow automation, AI consultant${
          locality ? `, AI solutions ${locality.label}, ${locality.city} AI consultant, AI integration ${locality.regionFull}` : ', Hagerstown MD, Frederick MD, Maryland AI consultant'
        }`}
        canonicalUrl={canonicalUrl}
      />
      <StructuredData type="service" data={serviceData} />
      <StructuredData type="localBusiness" data={localBusinessData} />
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen theme-bg">
        <SmokeBackground />
        <Header />

        <main className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <header className="text-center space-y-8 max-w-4xl mx-auto mb-20">
              <div className="space-y-6" style={{ animation: 'fade-in 0.7s ease-out both' }}>
                {locality && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
                    <MapPin className="w-4 h-4 text-webdev-gradient-blue" />
                    <span className="text-wdp-text text-sm">Serving {locality.label}</span>
                  </div>
                )}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
                  <img
                    src={aiSolutionsHero}
                    alt="Friendly professional collaborating with an AI assistant through a holographic chat interface"
                    className="w-full h-64 md:h-80 object-cover"
                    width={1536}
                    height={832}
                  />
                </div>
                <h1 className="text-4xl md:text-6xl font-light text-wdp-text tracking-wide">
                  {locality ? (
                    <>
                      AI Solutions & Integrations for{' '}
                      <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                        {locality.city}
                      </span>{' '}
                      Businesses
                    </>
                  ) : (
                    <>
                      AI Solutions &{' '}
                      <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                        Integrations
                      </span>{' '}
                      for Business
                    </>
                  )}
                </h1>
                <p className="text-xl text-wdp-text-secondary max-w-3xl mx-auto leading-relaxed">
                  Practical, custom AI built around your workflow — from simple chatbots and AI phone
                  answering to bespoke executive assistants and full operational automation. Remove
                  bottlenecks, recover lost hours, and scale without adding headcount.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link to="/contact">
                    <Button variant="glass" size="lg">Book a Free AI Consult</Button>
                  </Link>
                  <Link to="/project-brief">
                    <Button variant="glass" size="lg">Start an AI Project Brief</Button>
                  </Link>
                </div>
              </div>

            </header>

            {/* Why us */}
            <ScrollReveal>
              <section className="grid md:grid-cols-3 gap-6 mb-24" aria-labelledby="why-heading">
                <h2 id="why-heading" className="sr-only">Why work with us on AI</h2>
                {[
                  { icon: Sparkles, title: 'Bespoke, not boxed', body: 'AI designed around your exact workflow, voice, and data — not a generic SaaS template.' },
                  { icon: Shield, title: 'Secure by default', body: 'Private deployments, role-based access, and guardrails built in from day one.' },
                  { icon: Zap, title: 'Real ROI, fast', body: 'We target the bottlenecks that actually cost you money and time, then automate them.' },
                ].map(({ icon: Icon, title, body }) => (
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

            {/* Advanced */}
            <ScrollReveal>
              <section className="mb-24" aria-labelledby="advanced-heading">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
                    <Layers className="w-4 h-4 text-webdev-gradient-purple" />
                    <span className="text-wdp-text text-sm">Advanced Systems</span>
                  </div>
                  <h2 id="advanced-heading" className="text-3xl md:text-5xl font-light text-wdp-text">
                    Sophisticated{' '}
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                      AI systems
                    </span>{' '}
                    for serious operators
                  </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {advanced.map((s) => {
                    const Icon = s.icon;
                    return (
                      <article
                        key={s.slug}
                        id={s.slug}
                        className="group card-unified card-feature rounded-xl p-8 scroll-mt-32"
                      >
                        <div className="flex items-start gap-5 mb-5">
                          <div className="icon-gradient-container relative w-14 h-14 rounded-xl flex-shrink-0">
                            <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                              <Icon className="w-7 h-7" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-wdp-text">{s.title}</h3>
                            <p className="text-wdp-text-secondary">{s.tagline}</p>
                          </div>
                        </div>
                        <p className="text-wdp-text-secondary leading-relaxed mb-6">{s.description}</p>
                        <ul className="space-y-2 mb-6">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-start gap-3 text-wdp-text-secondary text-sm">
                              <Check className="w-4 h-4 text-webdev-gradient-blue mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-wdp-text-secondary italic">Best for: {s.bestFor}</p>
                      </article>
                    );
                  })}
                </div>
              </section>
            </ScrollReveal>

            {/* Foundational */}
            <ScrollReveal>
              <section className="mb-24" aria-labelledby="foundational-heading">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
                    <Sparkles className="w-4 h-4 text-webdev-gradient-blue" />
                    <span className="text-wdp-text text-sm">Quick Wins</span>
                  </div>
                  <h2 id="foundational-heading" className="text-3xl md:text-5xl font-light text-wdp-text">
                    Practical{' '}
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                      AI solutions
                    </span>{' '}
                    you can deploy now
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foundational.map((s) => {
                    const Icon = s.icon;
                    return (
                      <article
                        key={s.slug}
                        id={s.slug}
                        className="group card-unified card-feature rounded-xl p-6 scroll-mt-32 flex flex-col"
                      >
                        <div className="icon-gradient-container relative w-12 h-12 rounded-xl mb-4">
                          <div className="icon-inner w-full h-full rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-wdp-text mb-2">{s.title}</h3>
                        <p className="text-sm text-webdev-gradient-blue mb-3">{s.tagline}</p>
                        <p className="text-wdp-text-secondary text-sm leading-relaxed mb-4 flex-1">{s.description}</p>
                        <ul className="space-y-1.5">
                          {s.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-wdp-text-secondary text-sm">
                              <Check className="w-3.5 h-3.5 text-webdev-gradient-blue mt-1 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </article>
                    );
                  })}
                </div>
              </section>
            </ScrollReveal>

            {/* Local SEO band */}
            <ScrollReveal>
              <section className="mb-24" aria-labelledby="local-heading">
                <div className="glass-effect rounded-2xl p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-webdev-gradient-blue" />
                    <span className="text-sm uppercase tracking-wider text-webdev-gradient-blue font-semibold">
                      Local & Regional
                    </span>
                  </div>
                  <h2 id="local-heading" className="text-3xl md:text-4xl font-light text-wdp-text mb-4">
                    AI solutions for{' '}
                    <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                      Maryland businesses
                    </span>
                  </h2>
                  <p className="text-wdp-text-secondary leading-relaxed mb-6 max-w-3xl">
                    Based in the Hagerstown / Frederick, MD region, we work directly with local
                    businesses, professional firms, and growing operations across Western Maryland and the
                    surrounding tri-state area. Local market knowledge, in-person collaboration, and the
                    technical depth most agencies can&apos;t match.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {localities.map((loc) => (
                      <Link
                        key={loc.slug}
                        to={`/services/ai-solutions/${loc.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect hover:glass-border transition-all text-sm text-wdp-text"
                      >
                        <MapPin className="w-3.5 h-3.5 text-webdev-gradient-blue" />
                        AI Solutions in {loc.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal>
              <section className="text-center">
                <div className="card-unified card-cta">
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-light text-wdp-text mb-4">
                      Let&apos;s find the{' '}
                      <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-bold">
                        AI leverage
                      </span>{' '}
                      in your business
                    </h2>
                    <p className="text-wdp-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                      A short conversation is usually enough to map two or three high-impact AI plays for
                      your business. No pressure, no jargon — just a real plan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/contact">
                        <Button variant="glass" size="lg" className="inline-flex items-center gap-2">
                          Book a Free Consult
                          <ArrowRight className="w-5 h-5" />
                        </Button>
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

        <aside role="complementary" aria-label="AI Assistant">
          <ChatBot />
        </aside>
      </div>
    </>
  );
};

export default AISolutionsPage;
