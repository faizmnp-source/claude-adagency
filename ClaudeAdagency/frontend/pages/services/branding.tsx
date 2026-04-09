'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const services = [
  'Instagram growth systems',
  'Brand identity direction',
  'Campaign and content calendars',
  'Community management',
  'Influencer collaboration support',
  'Analytics and reporting',
];

const packages = [
  {
    name: 'Foundation',
    price: '$499',
    detail: 'For brands that need strategic clarity and a consistent direction.',
    points: ['Strategy session', '30-day plan', 'Positioning notes', 'Monthly review'],
  },
  {
    name: 'Growth',
    price: '$999',
    detail: 'For teams that want a hands-on operating rhythm with stronger output.',
    points: ['Monthly management', 'Custom design assets', 'Weekly optimisation', 'Performance reports'],
    featured: true,
  },
  {
    name: 'Momentum',
    price: '$1,499',
    detail: 'For businesses that want a more aggressive social engine and faster iteration.',
    points: ['Daily publishing support', 'Community management', 'Expanded asset production', 'Priority strategy access'],
  },
];

const results = [
  { brand: 'Fashion Brand X', from: '5K', to: '50K', growth: '+900%' },
  { brand: 'Beauty Influencer', from: '10K', to: '100K', growth: '+900%' },
  { brand: 'E-commerce Store', from: '2K', to: '25K', growth: '+1,150%' },
];

export default function BrandingPage() {
  return (
    <>
      <Head>
        <title>Branding & Social Media Growth - TheCraftStudios</title>
        <meta
          name="description"
          content="Strategic branding and social media growth systems that help brands become memorable and commercially effective."
        />
        <meta property="og:title" content="Branding & Social Media Growth - TheCraftStudios" />
        <meta
          property="og:description"
          content="Build a stronger identity, sharper publishing rhythm, and a more valuable audience."
        />
        <meta property="og:url" content="https://www.thecraftstudios.in/services/branding" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services/branding" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          <section style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-chip">Brand Growth Wing</span>
            <h1 className="section-title" style={{ marginTop: '22px', marginBottom: '16px' }}>
              Build A Brand People <span className="text-accent">Actually Recall</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '760px', margin: '0 auto 28px' }}>
              We shape the visual language, publishing rhythm, and growth system behind stronger social presence so
              your brand stops blending in and starts compounding attention.
            </p>
            <Link href="/contact" className="cta-primary">
              Start Growing
            </Link>
          </section>

          <section className="editorial-card" style={{ padding: '30px', marginBottom: '54px' }}>
            <div className="eyebrow">What We Handle</div>
            <div className="branding-service-grid" style={{ display: 'grid', gap: '14px', marginTop: '18px' }}>
              {services.map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '22px',
                    background: 'rgba(246,241,238,0.8)',
                    border: '1px solid rgba(17,17,17,0.06)',
                    color: 'var(--ink)',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                >
                    <span className="text-accent" style={{ marginRight: '8px' }}>
                    *
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: '54px' }}>
            <div style={{ marginBottom: '18px' }}>
              <div className="eyebrow">Packages</div>
              <h2 className="display" style={{ fontSize: '42px', marginTop: '8px' }}>
                Flexible Engagement Models
              </h2>
            </div>

            <div className="branding-package-grid" style={{ display: 'grid', gap: '22px' }}>
              {packages.map((pkg) => (
                <article
                  key={pkg.name}
                  className={pkg.featured ? 'editorial-card editorial-card-dark' : 'editorial-card'}
                  style={{
                    padding: '28px',
                    background: pkg.featured
                      ? 'linear-gradient(135deg, #0b2b26 0%, #153a33 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(246,241,238,0.92) 100%)',
                  }}
                >
                  <div className="eyebrow" style={{ color: pkg.featured ? 'rgba(255,255,255,0.55)' : 'var(--accent)' }}>
                    {pkg.featured ? 'Most Popular' : 'Package'}
                  </div>
                  <h3 className="display" style={{ fontSize: '34px', marginTop: '10px', color: pkg.featured ? '#fff' : 'var(--ink)' }}>
                    {pkg.name}
                  </h3>
                  <div style={{ color: pkg.featured ? '#f4c7a1' : 'var(--forest)', fontSize: '30px', fontWeight: 800, margin: '10px 0 12px' }}>
                    {pkg.price}
                    <span style={{ fontSize: '13px', marginLeft: '6px', opacity: 0.7 }}>/month</span>
                  </div>
                  <p style={{ color: pkg.featured ? 'rgba(255,255,255,0.76)' : 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.8, marginBottom: '18px' }}>
                    {pkg.detail}
                  </p>
                  <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
                    {pkg.points.map((point) => (
                      <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: pkg.featured ? 'rgba(255,255,255,0.84)' : 'var(--ink)', fontSize: '14px', fontWeight: 600 }}>
                        <span style={{ color: pkg.featured ? '#f4c7a1' : 'var(--accent)' }}>*</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className={pkg.featured ? 'cta-primary' : 'cta-secondary'}>
                    Choose {pkg.name}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="editorial-card" style={{ padding: '30px', marginBottom: '72px' }}>
            <div className="eyebrow">Illustrative Outcomes</div>
            <div className="results-grid" style={{ display: 'grid', gap: '18px', marginTop: '18px' }}>
              {results.map((result) => (
                <div
                  key={result.brand}
                  style={{
                    padding: '22px',
                    borderRadius: '24px',
                    background: 'rgba(246,241,238,0.8)',
                    border: '1px solid rgba(17,17,17,0.06)',
                  }}
                >
                  <div style={{ color: 'var(--ink)', fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>{result.brand}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Before to After
                  </div>
                  <div className="display" style={{ fontSize: '34px', color: 'var(--forest)' }}>
                    {result.from} <span className="text-accent">to</span> {result.to}
                  </div>
                  <div style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '8px' }}>
                    {result.growth} growth
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .branding-service-grid,
        .branding-package-grid,
        .results-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (max-width: 960px) {
          .branding-service-grid,
          .branding-package-grid,
          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
