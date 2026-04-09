'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const services = [
  {
    href: '/services/development',
    eyebrow: 'Wing 01',
    title: 'Web & App Development',
    copy: 'Custom websites, product flows, and mobile experiences engineered to load fast, scale cleanly, and convert decisively.',
    bullets: ['Responsive product design', 'Next.js and full-stack builds', 'Android and iOS delivery', 'Performance-first architecture'],
    tone: 'light',
  },
  {
    href: '/services/instagram-reels',
    eyebrow: 'Wing 02',
    title: 'Social Media Growth',
    copy: 'Campaign systems, reels, scheduling, and conversion-led brand publishing designed to turn attention into pipeline.',
    bullets: ['Instagram reel production', 'Publishing systems', 'Paid campaign support', 'Analytics and growth loops'],
    tone: 'dark',
  },
  {
    href: '/services/software',
    eyebrow: 'Wing 03',
    title: 'AI Automations & SaaS',
    copy: 'Internal tools, CRM workflows, finance automations, and custom SaaS products that remove operational drag.',
    bullets: ['AI-powered workflows', 'SaaS product builds', 'CRM and finance automation', 'Integrations and dashboards'],
    tone: 'light',
  },
];

const proof = [
  { value: '3', label: 'Core service wings' },
  { value: '1', label: 'Unified studio system' },
  { value: 'Infinite', label: 'Ways to combine them' },
];

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Services - TheCraftStudios</title>
        <meta
          name="description"
          content="Explore TheCraftStudios services across development, growth, and AI automation. Pick a single wing or combine the entire studio."
        />
        <meta property="og:title" content="Services - TheCraftStudios" />
        <meta
          property="og:description"
          content="Development, growth, and automation services designed as one integrated studio."
        />
        <meta property="og:url" content="https://www.thecraftstudios.in/services" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          <section style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-chip">Studio Services</span>
            <h1 className="section-title" style={{ marginTop: '22px', marginBottom: '16px' }}>
              Pick The Right <span className="text-accent">Growth Wing</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '760px', margin: '0 auto 28px' }}>
              We combine product engineering, visual brand systems, and AI-assisted operating layers into one
              studio. You can start with a single service or let us design the whole stack together.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="cta-primary">
                Book A Strategy Call
              </Link>
              <Link href="/studio" className="cta-secondary">
                Enter The Studio
              </Link>
            </div>
          </section>

          <section style={{ marginBottom: '64px' }}>
            <div className="services-overview-grid" style={{ display: 'grid', gap: '22px' }}>
              {services.map((service) => {
                const dark = service.tone === 'dark';

                return (
                  <article
                    key={service.href}
                    className={dark ? 'editorial-card editorial-card-dark' : 'editorial-card'}
                    style={{
                      padding: '30px',
                      background: dark
                        ? 'linear-gradient(135deg, #0b2b26 0%, #153a33 100%)'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(246,241,238,0.92) 100%)',
                    }}
                  >
                    <div className="eyebrow" style={{ color: dark ? 'rgba(255,255,255,0.55)' : 'var(--accent)' }}>
                      {service.eyebrow}
                    </div>
                    <h2
                      className="display"
                      style={{
                        fontSize: '38px',
                        marginTop: '10px',
                        marginBottom: '12px',
                        color: dark ? '#fff' : 'var(--ink)',
                      }}
                    >
                      {service.title}
                    </h2>
                    <p
                      style={{
                        color: dark ? 'rgba(255,255,255,0.76)' : 'var(--ink-soft)',
                        fontSize: '15px',
                        lineHeight: 1.8,
                        maxWidth: '560px',
                        marginBottom: '22px',
                      }}
                    >
                      {service.copy}
                    </p>

                    <div style={{ display: 'grid', gap: '10px', marginBottom: '26px' }}>
                      {service.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: dark ? 'rgba(255,255,255,0.82)' : 'var(--ink)',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ color: dark ? '#f4c7a1' : 'var(--accent)' }}>*</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={service.href} className={dark ? 'cta-primary' : 'cta-secondary'}>
                      Explore This Wing
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="editorial-card" style={{ padding: '30px', marginBottom: '72px' }}>
            <div className="eyebrow">Why The Structure Works</div>
            <div className="services-proof-grid" style={{ display: 'grid', gap: '18px', marginTop: '18px' }}>
              {proof.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: '22px',
                    borderRadius: '24px',
                    background: 'rgba(246,241,238,0.8)',
                    border: '1px solid rgba(17,17,17,0.06)',
                  }}
                >
                  <div className="display text-forest" style={{ fontSize: '42px', marginBottom: '6px' }}>
                    {item.value}
                  </div>
                  <div style={{ color: 'var(--ink-soft)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .services-overview-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .services-proof-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 960px) {
          .services-overview-grid,
          .services-proof-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
