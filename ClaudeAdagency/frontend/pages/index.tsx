/**
 * TheCraftStudios — Homepage
 * Framework: AIDA (Attention → Interest → Desire → Action)
 * Design: dark-saas | black bg #000 | orange accent #FF8C00
 * Router: Next.js Pages Router
 */

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CSLogo } from '../components/CSLogo';

/* ─────────────────────────────────────────
   ICON COMPONENTS (inline SVG, zero deps)
───────────────────────────────────────── */
const IconPalette = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.47-1.125"/>
    <path d="M12 2a7 7 0 0 1 7 7c0 3.5-2.5 6-6 6H9a3 3 0 0 0-3 3c0 .828.672 1.5 1.5 1.5"/>
  </svg>
);

const IconSparkles = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
  </svg>
);

const IconDashboard = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1"/>
    <rect width="7" height="5" x="14" y="3" rx="1"/>
    <rect width="7" height="9" x="14" y="12" rx="1"/>
    <rect width="7" height="5" x="3" y="16" rx="1"/>
  </svg>
);

const IconZap = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

/* ─────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────── */
const NAV_LINKS = [
  { href: '/services/development', label: 'Web & App' },
  { href: '/services/instagram-reels', label: 'Social Ads' },
  { href: '/services/software', label: 'AI & SaaS' },
  { href: '/contact', label: 'Contact' },
];

/* ─────────────────────────────────────────
   FEATURES DATA
───────────────────────────────────────── */
const FEATURES = [
  {
    icon: <IconPalette />,
    title: 'Done-For-You Design',
    desc: 'Professional, conversion-optimized designs delivered ready to launch — no back-and-forth required.',
  },
  {
    icon: <IconSparkles />,
    title: 'AI-Powered Content',
    desc: 'Automated content generation and optimization that keeps your brand voice sharp and consistent.',
  },
  {
    icon: <IconDashboard />,
    title: 'All-In-One Dashboard',
    desc: 'Manage websites, apps, and campaigns from a single command center — no context switching.',
  },
  {
    icon: <IconZap />,
    title: 'Lightning Fast Deployment',
    desc: 'Go live in minutes, not months. Ship fast, iterate faster.',
  },
];

/* ─────────────────────────────────────────
   FOOTER LINKS
───────────────────────────────────────── */
const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services/development', label: 'Services' },
  { href: '/contact', label: 'Contact' },
  { href: '/studio', label: 'Studio' },
];

/* ═══════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════ */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── SEO HEAD ── */}
      <Head>
        <title>TheCraftStudios — Your Complete Digital Platform In One Place</title>
        <meta name="description" content="Build websites, apps, SaaS, CRM, and social media campaigns — all without leaving your dashboard. India's #1 AI-powered digital agency." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://thecraftstudios.in" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thecraftstudios.in" />
        <meta property="og:title" content="TheCraftStudios — Your Complete Digital Platform" />
        <meta property="og:description" content="Build websites, apps, SaaS, CRM, and social media campaigns — all from one place." />
        <meta property="og:image" content="https://thecraftstudios.in/homepage.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheCraftStudios — Complete Digital Platform" />
        <meta name="twitter:description" content="Build websites, apps, SaaS, CRM, and social media campaigns — all from one place." />
        <meta name="twitter:image" content="https://thecraftstudios.in/homepage.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TheCraftStudios',
              url: 'https://thecraftstudios.in',
              logo: 'https://thecraftstudios.in/homepage.png',
              description: 'AI-powered digital agency — websites, apps, SaaS, CRM & social media automation.',
              address: { '@type': 'PostalAddress', addressCountry: 'IN' },
              contactPoint: { '@type': 'ContactPoint', email: 'info@thecraftstudios.in', contactType: 'customer support' },
            }),
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ background: '#000', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", minHeight: '100vh' }}>

        {/* ════════════════════════════════
            NAV
        ════════════════════════════════ */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'all 0.3s',
          background: scrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,140,0,0.12)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <CSLogo size={36} />
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#fff', letterSpacing: '0.06em' }}>
                  thecraft<span style={{ color: '#FF8C00' }}>studios</span>.in
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.02em' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FF8C00')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {label}
                </Link>
              ))}
              <Link href="/studio" style={{
                padding: '10px 24px', borderRadius: '8px',
                background: '#FF8C00', color: '#000',
                fontSize: '14px', fontWeight: 800,
                textDecoration: 'none', letterSpacing: '0.04em',
                transition: 'all 0.2s',
                boxShadow: '0 0 20px rgba(255,140,0,0.35)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FF6B00'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 35px rgba(255,140,0,0.55)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FF8C00'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(255,140,0,0.35)'; }}
              >
                Start Free
              </Link>
            </nav>

            {/* Mobile burger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }} className="mobile-burger">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div style={{ background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(255,140,0,0.1)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}>{label}</Link>
              ))}
              <Link href="/studio" onClick={() => setMobileOpen(false)} style={{ marginTop: '8px', padding: '14px 24px', borderRadius: '8px', background: '#FF8C00', color: '#000', fontSize: '15px', fontWeight: 800, textDecoration: 'none', textAlign: 'center' }}>
                Start Building Now
              </Link>
            </div>
          )}
        </header>

        {/* ════════════════════════════════
            HERO — ATTENTION + INTEREST
            Centered gradient variant
        ════════════════════════════════ */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '72px' }}>

          {/* Radial orange glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(255,140,0,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
          {/* Bottom fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, transparent, #000)', pointerEvents: 'none' }} />

          {/* Star dots */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 75% 15%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 40% 60%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 85% 70%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 25% 80%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 60% 35%, rgba(255,255,255,0.25) 0%, transparent 100%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: '900px', margin: '0 auto' }}>

            {/* Eyebrow badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '100px', border: '1px solid rgba(255,140,0,0.4)', background: 'rgba(255,140,0,0.06)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF8C00', marginBottom: '32px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF8C00', boxShadow: '0 0 8px #FF8C00', display: 'inline-block' }} />
              India's Complete Digital Agency
            </div>

            {/* H1 — ATTENTION */}
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 9vw, 100px)', lineHeight: 0.92, letterSpacing: '0.01em', color: '#fff', marginBottom: '28px' }}>
              Your Complete<br />
              <span style={{ color: '#FF8C00' }}>Digital Platform</span><br />
              In One Place
            </h1>

            {/* Subheading — INTEREST */}
            <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: '660px', margin: '0 auto 44px', fontWeight: 400 }}>
              Build websites, apps, SaaS, CRM, and social media campaigns —{' '}
              <strong style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>all without leaving your dashboard</strong>
            </p>

            {/* CTA — ACTION */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/services/development" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '18px 44px', borderRadius: '10px',
                background: '#FF8C00', color: '#000',
                fontSize: '17px', fontWeight: 800,
                textDecoration: 'none', letterSpacing: '0.03em',
                boxShadow: '0 0 40px rgba(255,140,0,0.45), 0 0 80px rgba(255,140,0,0.15)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 60px rgba(255,140,0,0.65), 0 0 100px rgba(255,140,0,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(255,140,0,0.45), 0 0 80px rgba(255,140,0,0.15)'; }}
              >
                Start Building Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>

              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '18px 44px', borderRadius: '10px',
                background: 'transparent', color: 'rgba(255,255,255,0.8)',
                fontSize: '17px', fontWeight: 600,
                textDecoration: 'none', letterSpacing: '0.03em',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,140,0,0.5)'; (e.currentTarget as HTMLElement).style.color = '#FF8C00'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
              >
                Schedule a Demo
              </Link>
            </div>

            {/* Social proof strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '52px', flexWrap: 'wrap' }}>
              {[
                { val: '150+', label: 'Brands served' },
                { val: '₹2Cr+', label: 'Ad spend managed' },
                { val: '10M+', label: 'Views generated' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {i > 0 && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,140,0,0.4)' }} />}
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#FF8C00' }}>{s.val}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            FEATURES — DESIRE
            4-column grid (2×2 on mobile)
        ════════════════════════════════ */}
        <section style={{ padding: '100px 24px', background: '#000', position: 'relative' }}>
          {/* Subtle top line */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,140,0,0.3), transparent)' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Section header */}
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(255,140,0,0.3)', background: 'rgba(255,140,0,0.05)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF8C00', marginBottom: '20px' }}>
                Why TheCraftStudios
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', letterSpacing: '0.02em', marginBottom: '16px' }}>
                Everything You Need.<br />
                <span style={{ color: '#FF8C00' }}>Nothing You Don't.</span>
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                One platform. Four powerful pillars. Zero complexity.
              </p>
            </div>

            {/* 4-card feature grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {FEATURES.map((feat, i) => (
                <div key={i} style={{
                  padding: '36px 32px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.25s',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.border = '1px solid rgba(255,140,0,0.35)';
                    el.style.background = 'rgba(255,140,0,0.04)';
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = '0 12px 40px rgba(255,140,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.border = '1px solid rgba(255,255,255,0.07)';
                    el.style.background = 'rgba(255,255,255,0.03)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Top accent line on hover handled via border above */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,140,0,0.6), transparent)', opacity: 0.5 }} />

                  {/* Icon */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF8C00', marginBottom: '24px' }}>
                    {feat.icon}
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SERVICES STRIP
            Quick visual proof of services
        ════════════════════════════════ */}
        <section style={{ padding: '80px 24px', background: 'rgba(255,140,0,0.03)', borderTop: '1px solid rgba(255,140,0,0.08)', borderBottom: '1px solid rgba(255,140,0,0.08)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              { emoji: '💻', label: 'Web & App Development' },
              { emoji: '📣', label: 'Social Media Ads' },
              { emoji: '🤖', label: 'AI & CRM Automation' },
              { emoji: '📈', label: 'Performance SEO' },
              { emoji: '🎬', label: 'Video & Reels' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '24px 16px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.emoji}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.02em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════
            CTA — ACTION
        ════════════════════════════════ */}
        <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
          {/* Center orange radial */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(255,140,0,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>

            {/* PAS — Problem addressed by this CTA */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(255,140,0,0.3)', background: 'rgba(255,140,0,0.05)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF8C00', marginBottom: '24px' }}>
              Get Started Today
            </div>

            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 0.92, color: '#fff', marginBottom: '20px', letterSpacing: '0.01em' }}>
              Ready to Transform<br />
              <span style={{ color: '#FF8C00' }}>Your Digital Presence?</span>
            </h2>

            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: '44px', maxWidth: '520px', margin: '0 auto 44px' }}>
              Join 150+ brands that already use TheCraftStudios to grow faster, convert better, and automate smarter.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Primary CTA */}
              <Link href="/studio" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '18px 48px', borderRadius: '10px',
                background: '#FF8C00', color: '#000',
                fontSize: '17px', fontWeight: 800,
                textDecoration: 'none', letterSpacing: '0.03em',
                boxShadow: '0 0 40px rgba(255,140,0,0.4)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 60px rgba(255,140,0,0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(255,140,0,0.4)'; }}
              >
                Get Started Today
              </Link>

              {/* Secondary */}
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '18px 40px', borderRadius: '10px',
                background: 'transparent', color: 'rgba(255,255,255,0.75)',
                fontSize: '17px', fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.12)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,140,0,0.4)'; (e.currentTarget as HTMLElement).style.color = '#FF8C00'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            FOOTER
        ════════════════════════════════ */}
        <footer style={{ background: '#000', borderTop: '1px solid rgba(255,140,0,0.1)', padding: '64px 24px 32px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Top row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>

              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <CSLogo size={36} />
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.06em' }}>
                    thecraft<span style={{ color: '#FF8C00' }}>studios</span>.in
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '240px' }}>
                  Your complete digital platform — websites, apps, SaaS, CRM & social media automation in one place.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Navigation</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {FOOTER_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FF8C00')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                      >{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Services</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { href: '/services/development', label: 'Web & App Dev' },
                    { href: '/services/instagram-reels', label: 'Social Ads' },
                    { href: '/services/software', label: 'AI & SaaS' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#FF8C00')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                      >{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact + Socials */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <a href="mailto:info@thecraftstudios.in" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>info@thecraftstudios.in</a>
                  <a href="tel:+917760501116" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>+91 77605 01116</a>
                </div>
                {/* Social icons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { icon: <IconLinkedIn />, href: '#', label: 'LinkedIn' },
                    { icon: <IconInstagram />, href: '#', label: 'Instagram' },
                    { icon: <IconTwitter />, href: '#', label: 'Twitter' },
                  ].map(({ icon, href, label }) => (
                    <a key={label} href={href} aria-label={label} style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,140,0,0.5)'; (e.currentTarget as HTMLElement).style.color = '#FF8C00'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                © {new Date().getFullYear()} TheCraftStudios. All rights reserved.
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                Built with ❤️ in India
              </p>
            </div>
          </div>
        </footer>

      </div>

      {/* Responsive overrides */}
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-burger { display: none !important; }
        }
      `}</style>
    </>
  );
}
