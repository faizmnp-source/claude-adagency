'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const RED = '#E50914';
const RED_DIM = 'rgba(229,9,20,0.15)';
const RED_MED = 'rgba(229,9,20,0.2)';

const DevelopmentPage = () => {
  return (
    <>
      <Head>
        <title>Web &amp; App Development — TheCraftStudios</title>
        <meta name="description" content="Custom websites, Android &amp; iOS apps — built to look great, load fast, and turn visitors into paying customers." />
        <meta property="og:title" content="Web & App Development — TheCraftStudios" />
        <meta property="og:description" content="Custom websites, Android & iOS apps built to look great, load fast, and convert visitors." />
        <meta property="og:url" content="https://www.thecraftstudios.in/services/development" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services/development" />
      </Head>

      <NavBar />

      <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

        {/* Hero */}
        <section style={{ paddingTop: '72px', paddingBottom: '80px', padding: '72px 16px 80px', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, paddingTop: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '24px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
              Web, Mobile &amp; App Development
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 96px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.02em' }}>
              Web &amp; App<br /><span style={{ color: RED }}>That Converts</span>
            </h1>
            <p style={{ color: '#888888', fontSize: '20px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Custom websites, Android &amp; iOS apps — built to look great, load fast, and turn
              visitors into paying customers.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
                Start Your Project →
              </Link>
              <Link href="/services/software" style={{ border: `1px solid rgba(229,9,20,0.4)`, color: '#E8E8E8', padding: '16px 40px', borderRadius: '8px', fontWeight: 600, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
                Need AI / SaaS? →
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                What We Build
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Our Development Services
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {[
                { icon: '🖥️', title: 'Website Design & Development', items: ['Landing pages', 'Corporate websites', 'Portfolio sites', 'Custom CMS'], desc: 'Responsive, fast-loading websites that look stunning on every device and are built to convert.' },
                { icon: '📱', title: 'Android & iOS App Development', items: ['Native Android apps', 'Native iOS apps', 'Cross-platform (React Native)', 'App Store submission'], desc: 'Mobile-first apps built for performance, designed for user delight and business growth.' },
                { icon: '🛒', title: 'E-commerce Solutions', items: ['Online stores', 'Payment integration', 'Inventory management', 'Order tracking'], desc: 'Complete e-commerce platforms with seamless checkout optimized for maximum conversions.' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '24px', background: 'rgba(229,9,20,0.08)', border: `1px solid rgba(229,9,20,0.2)` }}>{s.icon}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{s.title}</h3>
                  <p style={{ color: '#888888', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>{s.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {s.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888888' }}>
                        <span style={{ color: RED, fontWeight: 700 }}>✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Software/SaaS CTA card */}
            <div style={{ marginTop: '40px', background: '#1A1A1A', border: `1px solid rgba(229,9,20,0.3)`, borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid rgba(229,9,20,0.4)`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.08)' }}>
                    🤖 Also Building
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Need AI Automations or SaaS?</h3>
                  <p style={{ color: '#888888', maxWidth: '560px', lineHeight: 1.7 }}>We also build AI-powered SaaS products, finance automation tools, sales CRMs, and custom software. Click below to explore our dedicated software page.</p>
                </div>
                <Link href="/services/software" style={{ background: RED, color: '#fff', padding: '16px 32px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-block' }}>
                  Explore AI &amp; SaaS →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ padding: '96px 16px', background: '#0A0A0A', position: 'relative' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                How We Work
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Development Process
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { step: '01', icon: '📋', title: 'Discovery', desc: 'We understand your goals, users, and requirements in detail.' },
                { step: '02', icon: '🎨', title: 'Design', desc: 'UI/UX wireframes and pixel-perfect designs for approval.' },
                { step: '03', icon: '⚙️', title: 'Build', desc: 'Full development with regular progress updates.' },
                { step: '04', icon: '🚀', title: 'Launch', desc: 'Testing, deployment, and post-launch support.' },
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

        {/* Tech Stack */}
        <section style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                Tech Stack
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 56px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                What We Use
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { category: 'Frontend', items: ['React / Next.js', 'React Native', 'TypeScript', 'Tailwind CSS'] },
                { category: 'Backend', items: ['Node.js', 'Python/FastAPI', 'Django', 'REST & GraphQL'] },
                { category: 'Mobile', items: ['React Native', 'Android (Kotlin)', 'iOS (Swift)', 'Flutter'] },
                { category: 'Cloud & DB', items: ['AWS / GCP', 'PostgreSQL', 'MongoDB', 'Redis'] },
              ].map((stack, i) => (
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '24px' }}>
                  <h4 style={{ color: RED, fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>{stack.category}</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stack.items.map((item, j) => (
                      <li key={j} style={{ color: '#888888', fontSize: '14px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 16px', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Ready to Build<br /><span style={{ color: RED }}>Something Great?</span>
            </h2>
            <p style={{ color: '#888888', fontSize: '20px', marginBottom: '40px' }}>Tell us about your project and we'll get back to you within 24 hours.</p>
            <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 48px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
              Start Your Project →
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DevelopmentPage;
