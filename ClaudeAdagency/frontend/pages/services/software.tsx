'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const automations = [
  {
    title: 'Finance Automation',
    copy: 'Reduce repetitive finance work across invoicing, categorisation, reporting, and operational visibility.',
    bullets: ['Invoice workflows', 'Expense categorisation', 'Financial reporting', 'Cash-flow views'],
  },
  {
    title: 'Sales & CRM',
    copy: 'Build cleaner lead routing, faster follow-ups, and more reliable sales operations around your actual process.',
    bullets: ['Lead scoring', 'Automated follow-up', 'Pipeline dashboards', 'CRM integrations'],
  },
  {
    title: 'Custom AI Workflows',
    copy: 'Create purpose-built systems for support, document handling, data extraction, and internal decision support.',
    bullets: ['Support copilots', 'Document processing', 'Workflow orchestration', 'API-based automation'],
  },
];

const products = [
  'Custom SaaS products',
  'Admin and customer dashboards',
  'Billing and subscription flows',
  'Operational analytics',
  'Role-based systems',
  'Integration-heavy internal tools',
];

const stack = [
  'Claude / GPT systems',
  'Workflow automation',
  'APIs & backend services',
  'Realtime data layers',
  'Payments & billing',
  'Cloud infrastructure',
];

export default function SoftwarePage() {
  return (
    <>
      <Head>
        <title>AI Automations & SaaS - TheCraftStudios</title>
        <meta
          name="description"
          content="Custom AI automations, SaaS systems, and business software built to remove operational friction and create scale."
        />
        <meta property="og:title" content="AI Automations & SaaS - TheCraftStudios" />
        <meta
          property="og:description"
          content="Intelligent workflows, custom software, and SaaS product development for modern teams."
        />
        <meta property="og:url" content="https://www.thecraftstudios.in/services/software" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services/software" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          <section style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-chip">Automation Wing</span>
            <h1 className="section-title" style={{ marginTop: '22px', marginBottom: '16px' }}>
              AI Systems For <span className="text-accent">Operational Scale</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '780px', margin: '0 auto 28px' }}>
              We build practical automation layers, SaaS products, and internal systems that save time, reduce
              coordination drag, and turn messy operations into cleaner compounding workflows.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="cta-primary">
                Discuss Your System
              </Link>
              <Link href="/services/development" className="cta-secondary">
                Need Web Or App Build?
              </Link>
            </div>
          </section>

          <section className="software-grid" style={{ display: 'grid', gap: '22px', marginBottom: '54px' }}>
            {automations.map((item) => (
              <article key={item.title} className="editorial-card" style={{ padding: '28px' }}>
                <div className="eyebrow">{item.title}</div>
                <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.8, marginTop: '14px', marginBottom: '18px' }}>
                  {item.copy}
                </p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {item.bullets.map((bullet) => (
                    <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink)', fontSize: '14px', fontWeight: 600 }}>
                      <span className="text-accent">*</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section
            className="editorial-card editorial-card-dark"
            style={{ padding: '30px', marginBottom: '54px', background: 'linear-gradient(135deg, #0b2b26 0%, #153a33 100%)' }}
          >
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>
              SaaS Product Work
            </div>
            <h2 className="display" style={{ fontSize: '42px', marginTop: '10px', marginBottom: '14px', color: '#fff' }}>
              Products Built Around Real Operations
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.76)', fontSize: '15px', lineHeight: 1.8, maxWidth: '760px', marginBottom: '20px' }}>
              We do not bolt AI onto random surfaces. We shape the operating model first, then build the software,
              data flows, and permissions around what your team actually needs.
            </p>
            <div className="product-grid" style={{ display: 'grid', gap: '14px' }}>
              {products.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '22px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ color: '#f4c7a1', marginRight: '8px' }}>*</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="editorial-card" style={{ padding: '30px', marginBottom: '72px' }}>
            <div className="eyebrow">Delivery Stack</div>
            <div className="stack-grid" style={{ display: 'grid', gap: '14px', marginTop: '18px' }}>
              {stack.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '22px',
                    background: 'rgba(246,241,238,0.8)',
                    border: '1px solid rgba(17,17,17,0.06)',
                    color: 'var(--ink)',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .software-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .product-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .stack-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 960px) {
          .software-grid,
          .product-grid,
          .stack-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
