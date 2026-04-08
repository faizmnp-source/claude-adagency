'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const RED = '#E50914';
const RED_DIM = 'rgba(229,9,20,0.15)';

const BrandingPage = () => {
  return (
    <>
      <Head>
        <title>Branding &amp; Social Media Growth — TheCraftStudios</title>
        <meta name="description" content="Grow your Instagram channel with strategic planning, visual branding, and community management that turns followers into loyal customers." />
        <meta property="og:title" content="Branding & Social Media Growth — TheCraftStudios" />
        <meta property="og:description" content="Strategic Instagram growth, visual branding, and community management that turns followers into loyal customers." />
        <meta property="og:url" content="https://www.thecraftstudios.in/services/branding" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services/branding" />
      </Head>

      <NavBar />

      <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

        {/* Hero */}
        <section style={{ paddingTop: '120px', paddingBottom: '80px', padding: '120px 16px 80px', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '24px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: RED, display: 'inline-block' }}></span>
              Branding &amp; Social Media Growth
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 96px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.02em' }}>
              Build a Brand<br />
              <span style={{ color: RED }}>People Remember</span>
            </h1>
            <p style={{ color: '#888888', fontSize: '20px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Grow your Instagram channel with strategic planning, visual branding, and community management
              that turns followers into loyal customers.
            </p>
            <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
              Start Growing Today →
            </Link>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                Services
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>
                Our Branding Services
              </h2>
              <p style={{ color: '#888888', fontSize: '18px' }}>Complete solutions for brand growth and management</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {[
                { icon: '📊', title: 'Instagram Channel Strategy', items: ['Content planning', 'Audience analysis', 'Growth roadmap'] },
                { icon: '🎨', title: 'Visual Branding Design', items: ['Logo design', 'Brand guidelines', 'Visual assets'] },
                { icon: '📅', title: 'Content Calendar Planning', items: ['Monthly planning', 'Consistency strategy', 'Theme development'] },
                { icon: '💬', title: 'Community Management', items: ['Response management', 'Engagement tracking', 'DM handling'] },
                { icon: '🤝', title: 'Influencer Collaboration', items: ['Outreach strategy', 'Partnership management', 'Campaign tracking'] },
                { icon: '📈', title: 'Analytics & Growth Tracking', items: ['Performance reports', 'Growth metrics', 'ROI analysis'] },
              ].map((service, i) => (
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px', background: 'rgba(229,9,20,0.08)', border: `1px solid rgba(229,9,20,0.2)` }}>
                    {service.icon}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{service.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {service.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888888', fontSize: '14px' }}>
                        <span style={{ fontWeight: 700, color: RED }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section style={{ padding: '96px 16px', background: '#0A0A0A', position: 'relative' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                Pricing
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>
                Growth Packages
              </h2>
              <p style={{ color: '#888888', fontSize: '18px' }}>Flexible plans for growing your Instagram presence</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
              {[
                {
                  name: 'Basic',
                  price: '$499',
                  period: '/month',
                  features: ['Strategy session', '30-day plan', 'Monthly check-in', 'Growth recommendations'],
                  highlighted: false,
                },
                {
                  name: 'Pro',
                  price: '$999',
                  period: '/month',
                  features: ['Full month management', 'Custom graphics', 'Weekly check-ins', 'Content calendar', 'Analytics reports'],
                  highlighted: true,
                },
                {
                  name: 'Premium',
                  price: '$1,499',
                  period: '/month',
                  features: ['Daily posting', 'Engagement management', 'Custom graphics suite', 'Analytics & tracking', 'Community management', 'Priority support'],
                  highlighted: false,
                },
              ].map((pkg, i) => (
                <div key={i} style={{
                  borderRadius: '16px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: pkg.highlighted ? RED : '#1A1A1A',
                  border: pkg.highlighted ? `1px solid ${RED}` : `1px solid ${RED_DIM}`,
                }}>
                  {pkg.highlighted && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{pkg.name}</h3>
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px', fontWeight: 700, color: '#fff' }}>{pkg.price}</span>
                    <span style={{ color: pkg.highlighted ? 'rgba(255,255,255,0.7)' : '#888888' }}>{pkg.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pkg.features.map((feature, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ flexShrink: 0, fontWeight: 700, color: pkg.highlighted ? '#fff' : RED }}>✓</span>
                        <span style={{ color: pkg.highlighted ? 'rgba(255,255,255,0.9)' : '#888888' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: pkg.highlighted ? '#fff' : RED,
                    color: pkg.highlighted ? RED : '#fff',
                    boxSizing: 'border-box',
                  }}>
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                Results
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>
                Success Stories
              </h2>
              <p style={{ color: '#888888', fontSize: '18px' }}>Real results from brands we've helped grow</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
              {[
                { brand: 'Fashion Brand X', before: '5K followers', after: '50K followers', growth: '+900%', time: '3 months' },
                { brand: 'Beauty Influencer', before: '10K followers', after: '100K followers', growth: '+900%', time: '4 months' },
                { brand: 'E-commerce Store', before: '2K followers', after: '25K followers', growth: '+1,150%', time: '2 months' },
              ].map((study, i) => (
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>{study.brand}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <p style={{ color: '#888888', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Before</p>
                      <p style={{ fontSize: '24px', fontWeight: 700, color: '#888888' }}>{study.before}</p>
                    </div>
                    <div style={{ height: '1px', background: `linear-gradient(to right, ${RED}, transparent)` }}></div>
                    <div>
                      <p style={{ color: '#888888', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>After {study.time}</p>
                      <p style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>{study.after}</p>
                    </div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(229,9,20,0.1)', border: `1px solid rgba(229,9,20,0.3)`, borderRadius: '999px', padding: '8px 16px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: RED }}>{study.growth}</span>
                    <span style={{ color: '#888888', fontSize: '14px' }}>growth</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 16px', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Ready to Grow<br /><span style={{ color: RED }}>Your Instagram?</span>
            </h2>
            <p style={{ color: '#888888', fontSize: '20px', marginBottom: '40px' }}>
              Let's create a strategy that turns followers into real business results.
            </p>
            <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 48px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
              Start Your Growth Today →
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default BrandingPage;
