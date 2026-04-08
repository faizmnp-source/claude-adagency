/**
 * TheCraftStudios — Homepage (Dark Space Theme)
 * Pages Router → pages/index.tsx
 * Colors: bg #050B18 (deep space) | accent #E50914 (brand red) | text #FFFFFF
 */

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';

/* ─── Palette ────────────────────────────────── */
const R      = '#E50914';                      // brand red
const R_DIM  = 'rgba(229,9,20,0.15)';
const R_SOFT = 'rgba(229,9,20,0.08)';
const BG     = '#050B18';                      // deep space
const BG2    = '#0A0F1E';                      // slightly lighter dark
const BG3    = '#0D1628';                      // card bg
const TEXT   = '#FFFFFF';
const TEXT2  = '#E2E8F0';
const MUTED  = '#94A3B8';

/* ─── Inline SVG icons ───────────────────────── */
const Ic = {
  code: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  trending: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  zap: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
    </svg>
  ),
  palette: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.47-1.125"/>
      <path d="M12 2a7 7 0 0 1 7 7c0 3.5-2.5 6-6 6H9a3 3 0 0 0-3 3c0 .828.672 1.5 1.5 1.5"/>
    </svg>
  ),
  sparkles: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
    </svg>
  ),
  dashboard: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
      <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  ),
  briefcase: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  linkedin:  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  twitter:   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
};

/* ─── Nav links ──────────────────────────────── */
const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/studio', label: 'AI Studio' },
  { href: '/contact', label: 'Contact' },
];

/* ═════════════════════════════════════════════════
   PAGE
═════════════════════════════════════════════════ */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>TheCraftStudios | AI Reels & Digital Platform — India</title>
        <meta name="description" content="AI-powered Instagram Reels, web development, branding & SaaS for Indian businesses. Build your entire digital presence in one place." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://thecraftstudios.in" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TheCraftStudios | AI Reels & Digital Platform" />
        <meta property="og:description" content="AI-powered Instagram Reels, web development, branding & SaaS for Indian businesses." />
        <meta property="og:image" content="https://thecraftstudios.in/homepage.png" />
        <meta property="og:url" content="https://thecraftstudios.in" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheCraftStudios | Complete Digital Platform" />
        <meta name="twitter:image" content="https://thecraftstudios.in/homepage.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Organization',
          name: 'TheCraftStudios', url: 'https://thecraftstudios.in',
          description: 'AI-powered digital agency — websites, apps, SaaS, CRM & social media.',
          address: { '@type': 'PostalAddress', addressCountry: 'IN' },
          contactPoint: { '@type': 'ContactPoint', email: 'info@thecraftstudios.in' },
        })}} />
      </Head>

      <div style={{ background: BG, color: TEXT, fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ══ NAV ══ */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(5,11,24,0.97)' : 'rgba(5,11,24,0.80)',
          borderBottom: scrolled ? '1px solid rgba(229,9,20,0.25)' : '1px solid rgba(255,255,255,0.04)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          transition: 'all 0.3s',
        }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Logo variant="horizontal" size="medium" color="color" />
            </Link>

            <nav className="cs-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} style={{ fontSize: '14px', fontWeight: 500, color: MUTED, textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.04em' }}
                  onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                >{label}</Link>
              ))}
              <Link href="/studio" style={{ padding: '10px 22px', borderRadius: '6px', background: R, color: '#fff', fontSize: '13px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.06em', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >Try for Free</Link>
            </nav>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="cs-burger" style={{ background: 'none', border: 'none', color: TEXT, cursor: 'pointer', padding: '4px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>}
              </svg>
            </button>
          </div>

          {mobileOpen && (
            <div style={{ background: 'rgba(5,11,24,0.98)', borderTop: '1px solid rgba(229,9,20,0.15)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{ fontSize: '16px', fontWeight: 500, color: TEXT2, textDecoration: 'none' }}>{label}</Link>
              ))}
              <Link href="/studio" onClick={() => setMobileOpen(false)} style={{ marginTop: '8px', padding: '14px 24px', background: R, color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', borderRadius: '6px', letterSpacing: '0.06em' }}>
                Try for Free
              </Link>
            </div>
          )}
        </header>

        {/* ══ HERO ══ */}
        <section ref={heroRef} style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', paddingTop: '80px',
          background: `radial-gradient(ellipse at 50% 40%, #0D1A3A 0%, ${BG} 70%)`,
        }}>
          {/* Red center glow */}
          <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '600px', background: `radial-gradient(ellipse, rgba(229,9,20,0.10) 0%, transparent 65%)`, pointerEvents: 'none' }} />
          {/* Top vignette */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to bottom, ${BG}, transparent)`, pointerEvents: 'none' }} />
          {/* Bottom fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(to bottom, transparent, ${BG})`, pointerEvents: 'none' }} />
          {/* Star particles */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(1.5px 1.5px at 12% 18%, rgba(229,9,20,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 88% 22%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(2px 2px at 50% 70%, rgba(229,9,20,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 25% 85%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 75% 60%, rgba(229,9,20,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 40% 40%, rgba(255,255,255,0.35) 0%, transparent 100%), radial-gradient(1px 1px at 65% 10%, rgba(229,9,20,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 20% 55%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 92% 80%, rgba(255,255,255,0.3) 0%, transparent 100%)`, pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: '960px', margin: '0 auto' }}>

            {/* Eyebrow badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', border: `1px solid rgba(229,9,20,0.45)`, background: 'rgba(229,9,20,0.08)', borderRadius: '4px', marginBottom: '36px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: R, display: 'inline-block', animation: 'redPulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: R }}>India's Premier AI Creative Studio</span>
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(64px, 10vw, 108px)',
              lineHeight: 0.9,
              letterSpacing: '6px',
              color: TEXT,
              marginBottom: '20px',
            }}>
              YOUR COMPLETE<br />
              <span style={{ color: R }}>DIGITAL PLATFORM</span>
            </h1>

            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(16px, 3vw, 24px)', letterSpacing: '4px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>
              REELS &nbsp;•&nbsp; WEBSITES &nbsp;•&nbsp; APPS &nbsp;•&nbsp; BRANDING &nbsp;•&nbsp; AI AUTOMATION
            </p>

            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: TEXT2, lineHeight: 1.65, maxWidth: '580px', margin: '0 auto 48px', fontWeight: 400, opacity: 0.85 }}>
              Stop juggling 10 different tools.{' '}
              <strong style={{ color: TEXT, fontWeight: 600 }}>Build your entire digital ecosystem in one place.</strong>
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/studio" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 44px',
                background: R, color: '#fff',
                fontSize: '15px', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em',
                textDecoration: 'none', transition: 'all 0.25s', borderRadius: '4px',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(229,9,20,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                START CREATING NOW
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>

              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 40px',
                background: 'transparent', color: R,
                fontSize: '15px', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em',
                textDecoration: 'none',
                border: `2px solid ${R}`,
                borderRadius: '4px',
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = R_SOFT; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                SCHEDULE DEMO
              </Link>
            </div>

            {/* Scroll nudge */}
            <div style={{ marginTop: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.35 }}>
              <div style={{ width: '1px', height: '40px', background: `linear-gradient(to bottom, transparent, ${R})` }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: R }}>Scroll</span>
            </div>
          </div>
        </section>

        {/* ══ TRUST SIGNALS ══ */}
        <section style={{ background: BG3, borderTop: `1px solid rgba(229,9,20,0.15)`, borderBottom: `1px solid rgba(229,9,20,0.15)`, padding: '64px 24px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', textAlign: 'center' }}>
            {[
              { icon: Ic.briefcase, target: 500, suffix: '+', label: 'Digital Platforms Built' },
              { icon: Ic.zap,       target: 10000, suffix: '+', label: 'Content Pieces Created' },
              { icon: Ic.trending,  target: 50, prefix: '₹', suffix: 'M+', label: 'Client Revenue Generated' },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 120} direction="up">
                <div style={{ color: R, display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', color: TEXT, lineHeight: 1, marginBottom: '8px' }}>
                  <AnimatedCounter target={s.target} prefix={s.prefix ?? ''} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: '13px', color: MUTED, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ══ SERVICES ══ */}
        <section style={{ padding: '100px 24px', background: BG }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

            <ScrollReveal direction="up" style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', border: `1px solid rgba(229,9,20,0.35)`, background: R_SOFT, fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: R, marginBottom: '20px', borderRadius: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: R, display: 'inline-block' }} />
                What We Build
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '4px', color: TEXT, lineHeight: 0.95 }}>
                SERVICES THAT <span style={{ color: R }}>SCALE</span>
              </h2>
            </ScrollReveal>

            <div className="cs-services-grid">
              {[
                {
                  icon: Ic.code, title: 'WEB & APP\nDEVELOPMENT',
                  desc: 'Custom websites and mobile apps that scale with your business',
                  features: ['React / Next.js', 'Mobile-First Design', 'API Integration'],
                  link: '/services/development', featured: false,
                },
                {
                  icon: Ic.trending, title: 'SOCIAL MEDIA\n& DIGITAL',
                  desc: 'Instagram Reels, campaigns, and AI-generated content that drives real engagement',
                  features: ['AI Instagram Reels & Auto-Post', 'Paid Campaign Strategy', 'Real-Time Analytics'],
                  link: '/services/instagram-reels', featured: true,
                },
                {
                  icon: Ic.zap, title: 'AI, SAAS\n& AUTOMATIONS',
                  desc: 'Intelligent solutions that automate workflows and scale operations',
                  features: ['Custom AI Integration', 'No-Code Automation', 'CRM & SaaS Build'],
                  link: '/services/software', featured: false,
                },
              ].map((svc, i) => (
                <ScrollReveal key={i} delay={i * 100} direction="up">
                  <Link href={svc.link} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
                    <div style={{
                      padding: svc.featured ? '44px 36px' : '36px 30px',
                      background: svc.featured ? 'rgba(229,9,20,0.05)' : BG3,
                      border: svc.featured ? `2px solid ${R}` : `1px solid rgba(255,255,255,0.06)`,
                      borderLeft: !svc.featured ? `4px solid ${R}` : undefined,
                      borderRadius: '4px',
                      position: 'relative', overflow: 'hidden', cursor: 'pointer',
                      transform: svc.featured ? 'translateY(-16px)' : 'none',
                      boxShadow: svc.featured ? `0 0 40px rgba(229,9,20,0.20), 0 0 80px rgba(229,9,20,0.06)` : 'none',
                      transition: 'all 0.3s ease',
                      height: '100%',
                    }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.boxShadow = svc.featured ? `0 0 60px rgba(229,9,20,0.4)` : `0 0 30px rgba(229,9,20,0.15)`;
                        el.style.transform = svc.featured ? 'translateY(-20px) scale(1.02)' : 'scale(1.03) translateY(-4px)';
                        el.style.borderColor = R;
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.boxShadow = svc.featured ? `0 0 40px rgba(229,9,20,0.20)` : 'none';
                        el.style.transform = svc.featured ? 'translateY(-16px)' : 'none';
                        el.style.borderColor = svc.featured ? R : 'rgba(255,255,255,0.06)';
                        if (!svc.featured) el.style.borderLeft = `4px solid ${R}`;
                      }}
                    >
                      {svc.featured && (
                        <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', width: '280px', height: '160px', background: `radial-gradient(ellipse, rgba(229,9,20,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />
                      )}
                      {svc.featured && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', border: `1px solid rgba(229,9,20,0.5)`, background: R_SOFT, fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: R, marginBottom: '20px', borderRadius: '4px' }}>
                          ⭐ Core Service
                        </div>
                      )}
                      <div style={{ width: svc.featured ? '64px' : '56px', height: svc.featured ? '64px' : '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: R_SOFT, border: `1px solid rgba(229,9,20,0.25)`, color: R, marginBottom: '24px', borderRadius: '4px' }}>
                        {svc.icon}
                      </div>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: svc.featured ? '30px' : '26px', letterSpacing: '3px', color: TEXT, marginBottom: '14px', lineHeight: 1.15, whiteSpace: 'pre-line' }}>
                        {svc.featured
                          ? svc.title.split('\n').map((line, li) => (
                            <span key={li} style={{ display: 'block', color: li === 1 ? R : TEXT }}>{line}</span>
                          ))
                          : svc.title.replace('\n', ' ')}
                      </h3>
                      <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, marginBottom: '20px' }}>{svc.desc}</p>
                      <ul style={{ listStyle: 'none', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {svc.features.map((f, fi) => (
                          <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: TEXT2 }}>
                            <span style={{ color: R, flexShrink: 0 }}>{Ic.check}</span>{f}
                          </li>
                        ))}
                      </ul>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: svc.featured ? '13px 28px' : '11px 22px',
                        background: svc.featured ? R : R_SOFT,
                        color: svc.featured ? '#fff' : R,
                        fontSize: '13px', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em',
                        border: svc.featured ? 'none' : `1px solid rgba(229,9,20,0.3)`,
                        borderRadius: '4px', transition: 'all 0.2s',
                      }}>
                        {svc.featured ? 'GET STARTED' : 'EXPLORE SERVICE'}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHY US ══ */}
        <section style={{ padding: '100px 24px', background: BG2 }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <ScrollReveal direction="up" style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '4px', color: TEXT, marginBottom: '16px' }}>
                WHY <span style={{ color: R }}>CRAFT STUDIO</span>
              </h2>
              <p style={{ fontSize: '17px', color: MUTED, lineHeight: 1.6 }}>
                The one platform for your entire digital presence
              </p>
            </ScrollReveal>

            <div className="cs-benefits-grid">
              {[
                { icon: Ic.palette,   title: 'DONE-FOR-YOU DESIGN',    body: 'Premium designs that convert, without the premium price tag' },
                { icon: Ic.sparkles,  title: 'AI-POWERED CREATION',    body: 'Let AI accelerate your content pipeline, stay human in your messaging' },
                { icon: Ic.dashboard, title: 'ONE DASHBOARD',          body: 'Manage websites, apps, campaigns, and analytics in one place' },
                { icon: Ic.zap,       title: 'LIGHTNING DEPLOYMENT',   body: 'From concept to live in 24 hours, not months' },
              ].map((b, i) => (
                <ScrollReveal key={i} delay={i * 80} direction="up">
                  <div style={{
                    padding: '36px 28px',
                    background: BG3,
                    borderTop: `3px solid ${R}`,
                    borderRadius: '0 0 4px 4px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    border: `1px solid rgba(255,255,255,0.05)`,
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = '0 8px 40px rgba(229,9,20,0.12)';
                      el.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = 'none';
                      el.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: R_SOFT, border: `1px solid rgba(229,9,20,0.2)`, color: R, marginBottom: '20px', borderRadius: '4px' }}>
                      {b.icon}
                    </div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '2px', color: TEXT, marginBottom: '12px' }}>
                      {b.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7 }}>{b.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER ══ */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #E50914 0%, #B0060F 60%, #7A0000 100%)` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(255,80,80,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <ScrollReveal direction="none" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px, 7vw, 84px)', letterSpacing: '5px', color: '#fff', lineHeight: 0.92, marginBottom: '20px', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
              READY TO BUILD<br />YOUR EMPIRE?
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, marginBottom: '48px' }}>
              Join 500+ brands already using The Craft Studio
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/studio" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '18px 48px', background: '#fff', color: R,
                fontSize: '17px', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em',
                textDecoration: 'none', borderRadius: '4px', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0F0F0'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                GET STARTED NOW
              </Link>
              <Link href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '18px 40px', background: 'transparent', color: '#fff',
                fontSize: '17px', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em',
                textDecoration: 'none', border: '2px solid rgba(255,255,255,0.65)', borderRadius: '4px', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.65)'; }}
              >
                SCHEDULE DEMO
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{ background: '#000', borderTop: `1px solid ${R}`, padding: '72px 24px 32px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div className="cs-footer-grid" style={{ marginBottom: '56px' }}>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px' }}>
                  <Logo variant="horizontal" size="medium" color="color" />
                </div>
                <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7, maxWidth: '220px' }}>
                  Your complete digital platform — built for brands that want to scale.
                </p>
              </div>

              <div>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.15em', color: R, marginBottom: '16px' }}>PRODUCT</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[{ href: '/', label: 'Home' }, { href: '/services', label: 'Services' }, { href: '/pricing', label: 'Pricing' }, { href: '/studio', label: 'AI Studio' }].map(({ href, label }) => (
                    <li key={href}><Link href={href} style={{ fontSize: '14px', color: MUTED, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = R)}
                      onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                    >{label}</Link></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.15em', color: R, marginBottom: '16px' }}>COMPANY</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[{ href: '/contact', label: 'Contact' }, { href: '/studio', label: 'Studio' }, { href: '/contact', label: 'Support' }].map(({ href, label }) => (
                    <li key={label}><Link href={href} style={{ fontSize: '14px', color: MUTED, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = R)}
                      onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                    >{label}</Link></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.15em', color: R, marginBottom: '16px' }}>CONNECT</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <a href="mailto:info@thecraftstudios.in" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>info@thecraftstudios.in</a>
                  <a href="tel:+917760501116" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>+91 77605 01116</a>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { icon: Ic.linkedin, label: 'LinkedIn', href: '#' },
                    { icon: Ic.instagram, label: 'Instagram', href: '#' },
                    { icon: Ic.twitter, label: 'Twitter', href: '#' },
                  ].map(({ icon, label, href }) => (
                    <a key={label} href={href} aria-label={label} style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(229,9,20,0.3)`, color: R, textDecoration: 'none', borderRadius: '4px', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = R_SOFT; (e.currentTarget as HTMLElement).style.borderColor = R; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,9,20,0.3)'; }}
                    >{icon}</a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: MUTED }}>
                © {new Date().getFullYear()} TheCraftStudios. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Link href="/privacy" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>Privacy Policy</Link>
                <Link href="/terms" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>

      {/* ── Global styles ── */}
      <style suppressHydrationWarning>{`
        .cs-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .cs-services-grid {
            grid-template-columns: 1fr 1.1fr 1fr;
            align-items: center;
          }
        }
        .cs-benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 900px) {
          .cs-benefits-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .cs-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 768px) {
          .cs-footer-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 768px) {
          .cs-desktop-nav { display: none !important; }
          .cs-burger { display: block !important; }
        }
        @media (min-width: 769px) {
          .cs-burger { display: none !important; }
        }
        @keyframes redPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>
    </>
  );
}
