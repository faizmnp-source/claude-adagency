/**
 * TheCraftStudios — Services Hub
 * Skills applied:
 *   • landing-page-generator  → Hero, Feature Grid, Footer CTA patterns
 *   • frontend-design         → Dark-SaaS aesthetic, orange accent system
 *   • page-cro               → Visual hierarchy, center-card elevation
 *   • marketing-psychology    → Loss-aversion CTA, social proof strip
 *
 * Design: dark-saas | #000 bg | #E50914 orange accent
 * Router: Next.js Pages Router → pages/services/index.tsx
 */

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '../../components/Logo';

/* ─────────────────────────────────────────
   ICONS (inline SVG — zero deps)
───────────────────────────────────────── */
const IconCode = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);

const IconTrendingUp = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const IconZap = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

/* ─────────────────────────────────────────
   SERVICE CARDS DATA
   landing-page-generator Feature Grid pattern
───────────────────────────────────────── */
const SERVICES = [
  {
    id: 'web',
    icon: <IconCode />,
    title: 'Web & App Development',
    description: 'Custom websites and mobile applications built with the latest technologies for speed, scale, and conversion.',
    features: ['Responsive Design', 'Performance Optimized', 'Scalable Architecture', 'Full-Stack Development'],
    link: '/services/development',
    featured: false,
    accent: 'rgba(255,255,255,0.12)',
    label: null,
  },
  {
    id: 'social',
    icon: <IconTrendingUp />,
    title: 'Social Media & Digital Marketing',
    description: 'Instagram Reels, paid campaigns, and content strategies that convert followers into paying customers.',
    features: ['Instagram Reels & Auto-Post', 'Paid Campaigns (Meta + Google)', 'Real-Time Analytics', 'Content Strategy'],
    link: '/services/instagram-reels',
    featured: true,
    accent: '#E50914',
    label: '⭐ Core Service',
  },
  {
    id: 'ai',
    icon: <IconZap />,
    title: 'AI, SaaS & Automations',
    description: 'Intelligent solutions that automate your workflow, scale your operations, and build compounding revenue.',
    features: ['Custom AI Integration', 'API Development', 'Workflow Automation', 'CRM & SaaS Build'],
    link: '/services/software',
    featured: false,
    accent: 'rgba(255,255,255,0.12)',
    label: null,
  },
];

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/studio', label: 'AI Studio' },
  { href: '/contact', label: 'Contact' },
];

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function ServicesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Services — TheCraftStudios | Web, Social Media & AI Automation</title>
        <meta name="description" content="Explore TheCraftStudios services: Web & App Development, Social Media Marketing, and AI & SaaS Automation. Choose what fits your vision." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://thecraftstudios.in/services" />
        <meta property="og:title" content="Services — TheCraftStudios" />
        <meta property="og:description" content="Web, Social Media, and AI Automation services built for scale." />
        <meta property="og:url" content="https://thecraftstudios.in/services" />
        <meta property="og:image" content="https://thecraftstudios.in/homepage.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ background: '#000', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", minHeight: '100vh' }}>

        {/* ════════════════════
            NAV (mobile hamburger + desktop)
        ════════════════════ */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(229,9,20,0.12)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.3s',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Logo variant="horizontal" size="small" color="color" />
            </Link>

            {/* Desktop nav */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}
                  style={{ color: href === '/services' ? '#E50914' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.02em' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E50914')}
                  onMouseLeave={e => (e.currentTarget.style.color = href === '/services' ? '#E50914' : 'rgba(255,255,255,0.6)')}
                >{label}</Link>
              ))}
              <Link href="/contact" style={{ padding: '10px 24px', borderRadius: '8px', background: '#E50914', color: '#000', fontSize: '14px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 0 20px rgba(229,9,20,0.35)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 35px rgba(229,9,20,0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(229,9,20,0.35)'; }}
              >Get a Quote</Link>
            </nav>

            {/* Mobile burger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-burger" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>}
              </svg>
            </button>
          </div>

          {mobileOpen && (
            <div style={{ background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(229,9,20,0.1)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  style={{ color: href === '/services' ? '#E50914' : 'rgba(255,255,255,0.75)', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}
                >{label}</Link>
              ))}
              <Link href="/contact" onClick={() => setMobileOpen(false)} style={{ marginTop: '8px', padding: '14px 24px', borderRadius: '8px', background: '#E50914', color: '#000', fontSize: '15px', fontWeight: 800, textDecoration: 'none', textAlign: 'center' }}>
                Get a Quote
              </Link>
            </div>
          )}
        </header>

        {/* ════════════════════
            HERO
            landing-page-generator: centered gradient variant
        ════════════════════ */}
        <section style={{ position: 'relative', paddingTop: '160px', paddingBottom: '100px', overflow: 'hidden', textAlign: 'center' }}>
          {/* Orange radial glow */}
          <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
          {/* Bottom fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(transparent, #000)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px', borderRadius: '100px', border: '1px solid rgba(229,9,20,0.4)', background: 'rgba(229,9,20,0.06)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E50914', marginBottom: '28px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E50914', boxShadow: '0 0 8px #E50914', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Our Services
            </div>

            {/* H1 */}
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 9vw, 96px)', lineHeight: 0.92, letterSpacing: '0.01em', color: '#fff', marginBottom: '20px' }}>
              Everything You Need<br />
              <span style={{ color: '#E50914' }}>to Scale</span>
            </h1>

            {/* Subheading */}
            <p style={{ fontSize: 'clamp(16px, 2.5vw, 19px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto 0' }}>
              Choose the services that fit your vision — or let us build the full stack for you.
            </p>
          </div>
        </section>

        {/* ════════════════════
            3-CARD SERVICES GRID
            landing-page-generator: Feature Grid pattern
            • 1 col mobile → 3 col desktop
            • Center card elevated + orange border
        ════════════════════ */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Grid — center card gets translateY(-20px) on desktop via class */}
            <div className="services-grid">
              {SERVICES.map((svc) => {
                const isHovered = hovered === svc.id;
                return (
                  <Link
                    key={svc.id}
                    href={svc.link}
                    className={svc.featured ? 'card-featured' : 'card-normal'}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      borderRadius: '20px',
                      padding: svc.featured ? '40px 36px' : '36px 32px',
                      background: svc.featured
                        ? 'rgba(229,9,20,0.04)'
                        : 'rgba(255,255,255,0.02)',
                      border: svc.featured
                        ? '2px solid #E50914'
                        : '1px solid rgba(255,255,255,0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, border-color 0.25s',
                      transform: isHovered ? 'scale(1.04) translateY(-4px)' : 'scale(1)',
                      boxShadow: isHovered
                        ? (svc.featured
                          ? '0 20px 60px rgba(229,9,20,0.35), 0 0 0 1px rgba(229,9,20,0.6)'
                          : '0 20px 50px rgba(229,9,20,0.12), 0 0 0 1px rgba(229,9,20,0.3)')
                        : (svc.featured
                          ? '0 8px 40px rgba(229,9,20,0.15)'
                          : 'none'),
                    }}
                    onMouseEnter={() => setHovered(svc.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Top accent gradient line */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                      background: svc.featured
                        ? 'linear-gradient(90deg, #FF6B00, #E50914, #FFA500)'
                        : isHovered
                        ? 'linear-gradient(90deg, transparent, rgba(229,9,20,0.6), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                      transition: 'all 0.3s',
                    }} />

                    {/* Inner radial glow on featured */}
                    {svc.featured && (
                      <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '200px', background: 'radial-gradient(ellipse, rgba(229,9,20,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    )}

                    {/* Core service badge */}
                    {svc.label && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(229,9,20,0.5)', background: 'rgba(229,9,20,0.08)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E50914', marginBottom: '20px' }}>
                        {svc.label}
                      </div>
                    )}

                    {/* Icon */}
                    <div style={{
                      width: svc.featured ? '68px' : '60px',
                      height: svc.featured ? '68px' : '60px',
                      borderRadius: '16px',
                      background: svc.featured ? 'rgba(229,9,20,0.1)' : 'rgba(255,255,255,0.04)',
                      border: svc.featured ? '1px solid rgba(229,9,20,0.35)' : '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: svc.featured ? '#E50914' : 'rgba(255,255,255,0.6)',
                      marginBottom: '24px',
                      boxShadow: svc.featured ? '0 0 24px rgba(229,9,20,0.2)' : 'none',
                      transition: 'all 0.2s',
                    }}>
                      {svc.icon}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: svc.featured ? '32px' : '28px',
                      letterSpacing: '0.02em',
                      lineHeight: 1.1,
                      color: svc.featured ? '#fff' : '#fff',
                      marginBottom: '14px',
                    }}>
                      {svc.featured
                        ? <>{svc.title.split(' & ')[0]} &<br /><span style={{ color: '#E50914' }}>{svc.title.split(' & ')[1]}</span></>
                        : svc.title}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: '24px' }}>
                      {svc.description}
                    </p>

                    {/* Feature checklist */}
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                      {svc.features.map((feat, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: svc.featured ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.55)' }}>
                          <span style={{ color: svc.featured ? '#E50914' : 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                            <IconCheck />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* CTA button */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: svc.featured ? '14px 28px' : '12px 24px',
                      borderRadius: '10px',
                      background: svc.featured ? '#E50914' : 'rgba(255,255,255,0.06)',
                      color: svc.featured ? '#000' : 'rgba(255,255,255,0.7)',
                      fontSize: svc.featured ? '15px' : '14px',
                      fontWeight: svc.featured ? 800 : 600,
                      border: svc.featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.2s',
                      boxShadow: svc.featured ? '0 0 24px rgba(229,9,20,0.35)' : 'none',
                    }}>
                      {svc.featured ? 'Start Scaling →' : 'Learn More'}
                      <IconArrow />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════
            SOCIAL PROOF STRIP
        ════════════════════ */}
        <section style={{ padding: '48px 24px', borderTop: '1px solid rgba(229,9,20,0.08)', borderBottom: '1px solid rgba(229,9,20,0.08)', background: 'rgba(229,9,20,0.02)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              { val: '150+', label: 'Brands Served' },
              { val: '₹2Cr+', label: 'Ad Spend Managed' },
              { val: '10M+', label: 'Views Generated' },
              { val: '98%', label: 'Client Retention' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px', color: '#E50914', lineHeight: 1, marginBottom: '6px' }}>{s.val}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════
            FOOTER CTA
            landing-page-generator: Bottom CTA pattern
        ════════════════════ */}
        <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(229,9,20,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 64px)', color: '#fff', lineHeight: 0.95, marginBottom: '16px', letterSpacing: '0.01em' }}>
              Not Sure Which Service<br />
              <span style={{ color: '#E50914' }}>You Need?</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: '36px' }}>
              Our experts will audit your current setup and recommend exactly what will move the needle for your business.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 40px', borderRadius: '10px',
                background: '#E50914', color: '#000',
                fontSize: '16px', fontWeight: 800,
                textDecoration: 'none', letterSpacing: '0.03em',
                boxShadow: '0 0 35px rgba(229,9,20,0.4)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 55px rgba(229,9,20,0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 35px rgba(229,9,20,0.4)'; }}
              >
                Schedule Free Consultation
              </Link>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 32px', borderRadius: '10px',
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                fontSize: '16px', fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,9,20,0.4)'; (e.currentTarget as HTMLElement).style.color = '#E50914'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════
            MINI FOOTER
        ════════════════════ */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} TheCraftStudios · <a href="mailto:info@thecraftstudios.in" style={{ color: 'rgba(229,9,20,0.6)', textDecoration: 'none' }}>info@thecraftstudios.in</a>
          </p>
        </div>

      </div>

      {/* ── Responsive + animation styles ── */}
      <style suppressHydrationWarning>{`
        /* Grid: 1-col mobile → 3-col desktop */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .services-grid {
            grid-template-columns: 1fr 1.08fr 1fr;
            align-items: center;
          }
          /* Center card elevated */
          .card-featured {
            transform: translateY(-20px);
          }
          .card-featured:hover {
            transform: translateY(-24px) scale(1.04) !important;
          }
        }

        /* Nav responsive */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-burger { display: none !important; }
        }

        /* Pulse dot */
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #E50914; }
          50% { opacity: 0.6; box-shadow: 0 0 16px #E50914; }
        }
      `}</style>
    </>
  );
}
