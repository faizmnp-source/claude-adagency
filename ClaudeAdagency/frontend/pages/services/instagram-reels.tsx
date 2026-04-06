'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const RED = '#E50914';
const RED_DIM = 'rgba(229,9,20,0.15)';

const InstagramReelsPage = () => {
  return (
    <>
      <Head>
        <title>Instagram Reels &amp; Branding — TheCraftStudios</title>
        <meta name="description" content="Professional Instagram reels, brand identity &amp; auto-posting. From concept to your feed — we handle everything so your brand dominates social media." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <NavBar />

      <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

        {/* Hero */}
        <section style={{ paddingTop: '120px', paddingBottom: '80px', padding: '120px 16px 80px', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '24px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: RED, display: 'inline-block' }}></span>
              Instagram Reels &amp; Branding
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 96px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.02em' }}>
              Reels That<br /><span style={{ color: RED }}>Actually Go Viral</span>
            </h1>
            <p style={{ color: '#888888', fontSize: '20px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Professional Instagram reels, brand identity &amp; auto-posting. From concept to your feed —
              we handle everything so your brand dominates social media.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}>
              <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
                Book Your Reels
              </Link>
              <a href="#pricing" style={{ border: `1px solid rgba(229,9,20,0.4)`, color: '#E8E8E8', padding: '16px 40px', borderRadius: '8px', fontWeight: 600, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
                View Pricing
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '600px', margin: '0 auto' }}>
              {[{ value: '500+', label: 'Reels Created' }, { value: '10M+', label: 'Views Generated' }, { value: '3x', label: 'Avg Engagement Boost' }].map((s, i) => (
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: RED, marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#888888' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Deliver */}
        <section style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '24px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                  What You Get
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 56px)', color: '#fff', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  What We Deliver
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    'Professional scriptwriting tailored to your brand',
                    'High-quality video production and filming',
                    'Expert editing with trending music & effects',
                    'Hashtag strategy and growth optimization',
                    'Auto-posting to Instagram at peak times',
                    'Performance analytics and monthly insights',
                    'Brand identity design & visual guidelines',
                    'Community management & DM handling',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(229,9,20,0.1)', border: `1px solid rgba(229,9,20,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <span style={{ color: RED, fontSize: '11px', fontWeight: 700 }}>✓</span>
                      </div>
                      <span style={{ color: '#888888', fontSize: '18px' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎬</div>
                  <p style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Professional Content Creation</p>
                  <p style={{ color: '#888888' }}>From concept to viral in 48 hours</p>
                </div>
                <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', background: '#1A1A1A', border: `1px solid rgba(229,9,20,0.3)`, borderRadius: '12px', padding: '12px 20px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: RED }}>48hrs</div>
                  <div style={{ fontSize: '12px', color: '#888888' }}>Turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ padding: '96px 16px', background: '#0A0A0A', position: 'relative' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                The Process
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>
                Our Process
              </h2>
              <p style={{ color: '#888888', fontSize: '18px' }}>Four steps from concept to viral content</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { step: '01', icon: '💡', title: 'Concept', desc: 'We brainstorm viral-worthy ideas tailored to your brand and niche.' },
                { step: '02', icon: '📝', title: 'Script', desc: 'Professional scripts with strong hooks optimized for engagement.' },
                { step: '03', icon: '🎬', title: 'Film & Edit', desc: 'High-quality production with trending effects and music.' },
                { step: '04', icon: '🚀', title: 'Auto-Post', desc: 'Scheduled at peak times with optimized hashtags.' },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#1A1A1A', border: `1px solid ${RED_DIM}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' }}>{item.icon}</div>
                  <div style={{ color: RED, fontWeight: 700, fontSize: '13px', letterSpacing: '0.15em', marginBottom: '8px' }}>{item.step}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ color: '#888888', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                Pricing
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>
                Simple Pricing
              </h2>
              <p style={{ color: '#888888', fontSize: '18px' }}>Choose the plan that fits your growth goals</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
              {[
                { name: 'Starter', price: '$999', period: '/month', features: ['3 reels per month', 'Basic editing', 'Trending music', 'Standard hashtags', 'Monthly analytics'], highlighted: false },
                { name: 'Growth', price: '$1,999', period: '/month', features: ['8 reels per month', 'Professional editing', 'Trending audio optimization', 'Hashtag strategy', 'Weekly analytics', 'Community engagement'], highlighted: true },
                { name: 'Viral', price: '$2,999', period: '/month', features: ['15 reels per month', 'Custom scripts', 'Premium editing & effects', 'Advanced hashtag strategy', 'Daily analytics', 'Full growth management', 'Priority support'], highlighted: false },
              ].map((plan, i) => (
                <div key={i} style={{
                  borderRadius: '16px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: plan.highlighted ? RED : '#1A1A1A',
                  border: plan.highlighted ? `1px solid ${RED}` : `1px solid ${RED_DIM}`,
                }}>
                  {plan.highlighted && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{plan.name}</h3>
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px', fontWeight: 700, color: '#fff' }}>{plan.price}</span>
                    <span style={{ color: plan.highlighted ? 'rgba(255,255,255,0.7)' : '#888888' }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ flexShrink: 0, fontWeight: 700, color: plan.highlighted ? '#fff' : RED }}>✓</span>
                        <span style={{ color: plan.highlighted ? 'rgba(255,255,255,0.9)' : '#888888' }}>{f}</span>
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
                    background: plan.highlighted ? '#fff' : RED,
                    color: plan.highlighted ? RED : '#fff',
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
        <section style={{ padding: '96px 16px', background: '#0A0A0A', position: 'relative' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                Results
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Success Stories
              </h2>
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
        <section style={{ padding: '80px 16px', background: '#111111', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Ready to Create<br /><span style={{ color: RED }}>Viral Content?</span>
            </h2>
            <p style={{ color: '#888888', fontSize: '20px', marginBottom: '40px' }}>Let's turn your brand story into engaging, viral-worthy Instagram reels.</p>
            <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 48px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
              Book Your Reels Today →
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default InstagramReelsPage;
