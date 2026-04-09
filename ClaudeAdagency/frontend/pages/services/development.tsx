'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const capabilities = [
  {
    title: 'Web Platforms',
    copy: 'Landing pages, company websites, and custom product surfaces with thoughtful structure and clear conversion paths.',
    items: ['Marketing websites', 'Custom CMS surfaces', 'SEO-ready builds', 'Performance-focused frontends'],
  },
  {
    title: 'Mobile Products',
    copy: 'Native-feeling mobile applications designed for retention, clarity, and clean customer journeys.',
    items: ['Android delivery', 'iOS delivery', 'Cross-platform apps', 'Store submission support'],
  },
  {
    title: 'Commerce & Flows',
    copy: 'Checkout, lead capture, booking, and account experiences where every screen has a measurable job to do.',
    items: ['E-commerce journeys', 'Payments integration', 'Customer dashboards', 'Operational back-office tools'],
  },
];

const process = [
  ['01', 'Discovery', 'We map the offer, audience, and product requirements before any visual layer is committed.'],
  ['02', 'Design', 'We shape the interface system, information hierarchy, and responsive behavior around your core journey.'],
  ['03', 'Build', 'We implement the product with production-ready patterns, clean integrations, and staged QA.'],
  ['04', 'Launch', 'We ship, verify, and stay close through post-launch polish and iteration.'],
];

const stack = [
  { label: 'Frontend', value: 'Next.js, React, TypeScript, Tailwind CSS' },
  { label: 'Backend', value: 'Node.js, Python, APIs, automation services' },
  { label: 'Mobile', value: 'React Native, Android, iOS delivery' },
  { label: 'Infra', value: 'Cloud deployment, databases, integrations, analytics' },
];

export default function DevelopmentPage() {
  return (
    <>
      <Head>
        <title>Web & App Development - TheCraftStudios</title>
        <meta
          name="description"
          content="Custom websites and mobile apps built for clarity, performance, and conversion."
        />
        <meta property="og:title" content="Web & App Development - TheCraftStudios" />
        <meta
          property="og:description"
          content="Product-led websites and mobile experiences engineered for scale."
        />
        <meta property="og:url" content="https://www.thecraftstudios.in/services/development" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services/development" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          <section style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-chip">Development Wing</span>
            <h1 className="section-title" style={{ marginTop: '22px', marginBottom: '16px' }}>
              Build Products That <span className="text-accent">Move Fast</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '760px', margin: '0 auto 28px' }}>
              We design and build websites, mobile apps, and conversion-critical product flows that feel sharp,
              deliberate, and ready for growth from day one.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="cta-primary">
                Start Your Project
              </Link>
              <Link href="/services/software" className="cta-secondary">
                Need AI Or SaaS?
              </Link>
            </div>
          </section>

          <section className="development-grid" style={{ display: 'grid', gap: '22px', marginBottom: '64px' }}>
            {capabilities.map((capability) => (
              <article key={capability.title} className="editorial-card" style={{ padding: '28px' }}>
                <div className="eyebrow">{capability.title}</div>
                <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.8, marginTop: '14px', marginBottom: '18px' }}>
                  {capability.copy}
                </p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {capability.items.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink)', fontSize: '14px', fontWeight: 600 }}>
                      <span className="text-accent">*</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="editorial-card editorial-card-dark" style={{ padding: '30px', marginBottom: '64px', background: 'linear-gradient(135deg, #0b2b26 0%, #153a33 100%)' }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>Delivery Process</div>
            <div className="process-grid" style={{ display: 'grid', gap: '18px', marginTop: '20px' }}>
              {process.map(([step, title, copy]) => (
                <div key={step} style={{ padding: '20px', borderRadius: '24px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#f4c7a1', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    {step}
                  </div>
                  <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>{title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: '14px', lineHeight: 1.7 }}>{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="editorial-card" style={{ padding: '30px', marginBottom: '72px' }}>
            <div className="eyebrow">Core Stack</div>
            <div className="stack-grid" style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
              {stack.map((item) => (
                <div key={item.label} style={{ padding: '20px', borderRadius: '22px', background: 'rgba(246,241,238,0.8)', border: '1px solid rgba(17,17,17,0.06)' }}>
                  <div style={{ color: 'var(--forest)', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {item.label}
                  </div>
                  <p style={{ color: 'var(--ink)', fontSize: '15px', lineHeight: 1.7 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .development-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .process-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .stack-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 1100px) {
          .process-grid,
          .stack-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 960px) {
          .development-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .process-grid,
          .stack-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
