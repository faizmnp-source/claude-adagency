import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const services = [
  {
    title: 'Web & App Development',
    label: 'Engineering Wing',
    copy: 'Custom websites, mobile apps, and product systems built with modern frontend and backend architecture.',
    href: '/services/development',
    accent: 'var(--forest)',
    icon: '⌘',
  },
  {
    title: 'Social Media & Promotion',
    label: 'Growth Wing',
    copy: 'Instagram reels, campaign systems, and AI-assisted ad production designed to scale your brand output fast.',
    href: '/services/instagram-reels',
    accent: 'var(--accent)',
    icon: '✦',
    featured: true,
  },
  {
    title: 'AI Automations & SaaS',
    label: 'Systems Wing',
    copy: 'Workflows, CRM integrations, internal tools, and SaaS layers that automate repetitive work for growing teams.',
    href: '/services/software',
    accent: '#7c3aed',
    icon: '◎',
  },
];

const metrics = [
  { value: '500+', label: 'Digital Platforms Built' },
  { value: '10K+', label: 'Content Pieces Created' },
  { value: '₹50M+', label: 'Client Revenue Influenced' },
];

const benefits = [
  { title: 'Done-For-You Design', copy: 'Premium-looking interfaces and campaign assets without agency sprawl.' },
  { title: 'AI-Powered Creation', copy: 'Move from idea to content to launch without rebuilding your pipeline each week.' },
  { title: 'One Dashboard', copy: 'Keep studio, content, web, and campaign operations in the same working system.' },
  { title: 'Fast Deployment', copy: 'Launch experiments quickly, then harden the winners into systems that compound.' },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>TheCraftStudios | AI Reels & Digital Platform — India</title>
        <meta
          name="description"
          content="AI-powered Instagram Reels, web development, branding and SaaS for Indian businesses. Build your complete digital presence in one place."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TheCraftStudios | AI Reels & Digital Platform" />
        <meta
          property="og:description"
          content="AI-powered Instagram Reels, web development, branding and SaaS for Indian businesses."
        />
        <meta property="og:image" content="https://thecraftstudios.in/homepage.png" />
        <meta property="og:url" content="https://thecraftstudios.in" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheCraftStudios | Complete Digital Platform" />
        <meta name="twitter:image" content="https://thecraftstudios.in/homepage.png" />
        <link rel="canonical" href="https://thecraftstudios.in" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TheCraftStudios',
              url: 'https://thecraftstudios.in',
              description: 'AI-powered digital agency — websites, apps, SaaS, CRM & social media.',
              address: { '@type': 'PostalAddress', addressCountry: 'IN' },
              contactPoint: { '@type': 'ContactPoint', email: 'info@thecraftstudios.in' },
            }),
          }}
        />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main>
          <section className="editorial-grid page-hero" style={{ position: 'relative' }}>
            <div
              className="floating-orb float-a"
              style={{ top: '110px', right: '8%', width: '260px', height: '260px', background: 'rgba(227,100,20,0.08)' }}
            />
            <div
              className="floating-orb float-b"
              style={{ top: '220px', left: '4%', width: '240px', height: '240px', background: 'rgba(11,43,38,0.07)' }}
            />

            <div style={{ maxWidth: '980px', position: 'relative', zIndex: 1 }}>
              <span className="section-chip">India’s AI Creative Studio</span>
              <h1 className="section-title" style={{ marginTop: '24px', marginBottom: '18px' }}>
                Your Complete <span className="text-accent">Digital Platform</span>
              </h1>
              <p className="section-copy" style={{ maxWidth: '700px', marginBottom: '28px' }}>
                Stop juggling ten different vendors and tools. We bring content generation, product builds, growth systems, and automation into one studio workflow designed to scale with your brand.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '30px' }}>
                <Link href="/studio" className="cta-primary">
                  Start Creating Now
                </Link>
                <Link href="/contact" className="cta-secondary">
                  Schedule Demo
                </Link>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Reels', 'Websites', 'Apps', 'Branding', 'AI Automation'].map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(17,17,17,0.06)',
                      color: 'var(--ink-soft)',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="editorial-grid" style={{ paddingBottom: '42px' }}>
            <div className="metrics-grid" style={{ display: 'grid', gap: '18px' }}>
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <div className="metric-value text-accent">{metric.value}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="editorial-grid" style={{ paddingTop: '34px', paddingBottom: '70px' }}>
            <div style={{ marginBottom: '26px', maxWidth: '760px' }}>
              <div className="eyebrow">Service Wings</div>
              <h2 className="display" style={{ fontSize: '52px', marginTop: '10px', marginBottom: '12px' }}>
                Built To Ship, Not To Stall
              </h2>
              <p className="section-copy" style={{ fontSize: '16px' }}>
                Each wing is designed to cover a critical layer of modern brand operations, while still connecting into the same studio engine.
              </p>
            </div>

            <div className="services-grid" style={{ display: 'grid', gap: '22px' }}>
              {services.map((service) => (
                <Link key={service.title} href={service.href} style={{ textDecoration: 'none' }}>
                  <div
                    className={service.featured ? 'editorial-card editorial-card-dark' : 'editorial-card'}
                    style={{
                      padding: '30px',
                      height: '100%',
                      background: service.featured ? 'linear-gradient(135deg, #0b2b26 0%, #123732 100%)' : '#fff',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '14px', color: service.featured ? '#fff' : service.accent }}>{service.icon}</div>
                    <div className="eyebrow" style={{ color: service.featured ? 'rgba(255,255,255,0.58)' : 'var(--muted)', marginBottom: '10px' }}>
                      {service.label}
                    </div>
                    <h3 className="display" style={{ fontSize: '38px', marginBottom: '12px', color: service.featured ? '#fff' : 'var(--ink)' }}>
                      {service.title}
                    </h3>
                    <p style={{ color: service.featured ? 'rgba(255,255,255,0.72)' : 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                      {service.copy}
                    </p>
                    <span className={service.featured ? 'cta-secondary' : 'cta-primary'} style={service.featured ? { background: '#fff', color: 'var(--forest)', border: 'none' } : {}}>
                      Explore Service
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="editorial-grid" style={{ paddingBottom: '70px' }}>
            <div style={{ marginBottom: '22px', maxWidth: '760px' }}>
              <div className="eyebrow">Why Craft Studio</div>
              <h2 className="display" style={{ fontSize: '52px', marginTop: '10px', marginBottom: '12px' }}>
                One Platform, Multiple Growth Levers
              </h2>
            </div>

            <div className="benefits-grid" style={{ display: 'grid', gap: '18px' }}>
              {benefits.map((benefit) => (
                <div key={benefit.title} className="editorial-card" style={{ padding: '26px' }}>
                  <div className="eyebrow" style={{ marginBottom: '10px' }}>Advantage</div>
                  <h3 style={{ color: 'var(--ink)', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>{benefit.title}</h3>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.7 }}>{benefit.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="editorial-grid" style={{ paddingBottom: '86px' }}>
            <div
              className="editorial-card-dark"
              style={{
                borderRadius: '40px',
                padding: '48px 30px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #e36414 0%, #c84e05 100%)',
              }}
            >
              <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '12px' }}>Call To Action</div>
              <h2 className="display" style={{ fontSize: '64px', marginBottom: '12px' }}>Ready To Build Your Empire?</h2>
              <p style={{ color: 'rgba(255,255,255,0.76)', fontSize: '17px', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 24px' }}>
                Join the brands using The Craft Studios to produce content, launch products, and automate growth under one roof.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/studio" className="cta-secondary" style={{ background: '#fff', color: 'var(--accent)', border: 'none' }}>
                  Get Started Now
                </Link>
                <Link href="/contact" className="cta-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                  Schedule Demo
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .metrics-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .services-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .benefits-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 1080px) {
          .benefits-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .services-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .metrics-grid,
          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
