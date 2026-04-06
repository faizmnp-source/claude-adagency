'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CSLogo } from '../components/CSLogo';

/* ── Logo wordmark for nav / footer ── */
const NavLogo = () => (
  <Link href="/" className="flex items-center gap-3">
    <CSLogo size={38} />
    <div className="hidden sm:flex flex-col leading-none">
      <span className="font-bold text-sm text-white tracking-wide">thecraft</span>
      <span className="font-bold text-sm tracking-wide" style={{ color: '#F59E0B' }}>studios.in</span>
    </div>
  </Link>
);

const NAV_LINKS = [
  { href: '/studio', label: 'AI Studio' },
  { href: '/services/instagram-reels', label: 'Social Ads' },
  { href: '/services/development', label: 'Web & App' },
  { href: '/services/software', label: 'AI & SaaS' },
  { href: '/contact', label: 'Contact' },
];

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#080808', color: '#fff' }}>

      {/* ── GLOBAL STYLES injected once ── */}
      <style suppressHydrationWarning>{`
        :root {
          --fire: #FF6B00;
          --gold: #F59E0B;
          --gold-light: #FCD34D;
          --blue: #4A6CF7;
          --deep: #080808;
          --card-bg: rgba(15,12,8,0.85);
        }

        /* Gold fire glow button */
        .fire-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FF6B00, #F59E0B);
          color: #080808;
          font-size: 16px;
          font-weight: 800;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.04em;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 30px rgba(255,107,0,0.5), 0 0 60px rgba(255,107,0,0.2);
        }
        .fire-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(255,107,0,0.7), 0 0 80px rgba(245,158,11,0.3);
        }
        .fire-btn:active { transform: scale(0.97); }

        /* Outline ghost button */
        .outline-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 40px;
          border-radius: 12px;
          background: transparent;
          color: rgba(255,255,255,0.85);
          font-size: 16px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.04em;
          border: 1px solid rgba(245,158,11,0.4);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .outline-btn:hover {
          border-color: #F59E0B;
          color: #F59E0B;
          box-shadow: 0 0 20px rgba(245,158,11,0.2);
        }

        /* Fire glass card */
        .fire-card {
          background: rgba(20,14,8,0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(245,158,11,0.15);
          border-radius: 20px;
          transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
        }
        .fire-card:hover {
          border-color: rgba(245,158,11,0.4);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(255,107,0,0.12);
        }

        /* Featured center card */
        .fire-card-featured {
          background: rgba(30,18,5,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(245,158,11,0.5);
          border-radius: 20px;
          box-shadow: 0 0 0 1px rgba(245,158,11,0.1), 0 20px 60px rgba(255,107,0,0.2), inset 0 1px 0 rgba(245,158,11,0.15);
          transform: translateY(-16px);
        }

        /* Fire orb glow */
        .fire-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }

        /* Stat counter item */
        .stat-item {
          text-align: center;
          padding: 24px 20px;
          border-right: 1px solid rgba(245,158,11,0.1);
        }
        .stat-item:last-child { border-right: none; }

        /* Step card */
        .step-card {
          background: rgba(15,12,8,0.8);
          border: 1px solid rgba(245,158,11,0.12);
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .step-card:hover {
          border-color: rgba(245,158,11,0.35);
          box-shadow: 0 8px 30px rgba(255,107,0,0.1);
        }

        /* Testimonial card */
        .testi-card {
          background: rgba(15,12,8,0.9);
          border: 1px solid rgba(245,158,11,0.12);
          border-radius: 16px;
          padding: 32px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .testi-card:hover {
          border-color: rgba(245,158,11,0.35);
          transform: translateY(-3px);
        }

        /* Fire badge */
        .fire-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid rgba(245,158,11,0.35);
          background: rgba(245,158,11,0.06);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #F59E0B;
        }

        /* Floating hero image */
        .hero-mockup {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(245,158,11,0.2),
            0 40px 100px rgba(0,0,0,0.8),
            0 0 80px rgba(255,107,0,0.15);
        }
        .hero-mockup::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 60%,
            rgba(8,8,8,0.3) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        /* Gradient headline text */
        .fire-gradient-text {
          background: linear-gradient(135deg, #FF6B00 0%, #F59E0B 40%, #FCD34D 70%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .white-text { color: #fff; }

        /* Feature tag pill */
        .feat-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
        }

        /* Nav link hover */
        .nav-link {
          color: rgba(148,163,184,0.9);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-link:hover { color: #F59E0B; }

        /* Section separator */
        .gold-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent);
        }

        /* Slide up animation */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-up-2 { animation: slideUp 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
        .slide-up-3 { animation: slideUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both; }

        /* Float animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        .float-anim { animation: float 5s ease-in-out infinite; }

        /* Pulse ring */
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════ */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[rgba(245,158,11,0.12)]'
          : 'bg-transparent'
      }`} style={scrolled ? { background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(20px)' } : {}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <NavLogo />

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="nav-link">{label}</Link>
              ))}
              <Link href="/studio" className="fire-btn" style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '10px' }}>
                Start Free →
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div style={{ background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(245,158,11,0.1)' }}>
            <div className="px-4 py-5 flex flex-col gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="nav-link text-base" onClick={() => setMobileOpen(false)}>{label}</Link>
              ))}
              <Link href="/studio" className="fire-btn mt-2 text-center" onClick={() => setMobileOpen(false)}>Start Free →</Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════
          HERO — Split layout
          ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background fire orbs */}
        <div className="fire-orb w-[600px] h-[600px]" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)', top: '-10%', right: '-5%' }}></div>
        <div className="fire-orb w-[400px] h-[400px]" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', bottom: '10%', left: '-5%' }}></div>
        {/* Star field */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 85% 35%, rgba(255,255,255,0.35) 0%, transparent 100%), radial-gradient(1px 1px at 20% 85%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 65% 55%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 92% 70%, rgba(255,255,255,0.4) 0%, transparent 100%)', pointerEvents: 'none' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── LEFT — Copy ── */}
            <div className="slide-up">
              {/* Top badge */}
              <div className="fire-badge mb-6">
                🔥 India's #1 AI-Powered Ad Agency
              </div>

              {/* Main headline */}
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px, 6vw, 76px)', lineHeight: '0.95', letterSpacing: '0.01em', marginBottom: '24px' }}>
                <span className="white-text">We Build </span>
                <span className="fire-gradient-text">Ads, Websites</span>
                <br />
                <span className="white-text">& AI Systems That </span>
                <br />
                <span className="fire-gradient-text">Scale Revenue 🚀</span>
              </h1>

              {/* Subheadline */}
              <p style={{ color: 'rgba(148,163,184,0.95)', fontSize: '18px', lineHeight: '1.65', marginBottom: '36px', maxWidth: '520px' }}>
                Performance marketing + AI automation + tech SEO —{' '}
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>built for India & global brands</span>
              </p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-3 mb-10">
                <span className="feat-tag">⚡ AI-Powered Ads</span>
                <span className="feat-tag">📈 Performance SEO</span>
                <span className="feat-tag">🤖 CRM Automation</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/studio" className="fire-btn">
                  Get Free Audit →
                </Link>
                <Link href="/services/instagram-reels" className="outline-btn">
                  View Case Studies
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="flex items-center gap-5 flex-wrap">
                <div style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', fontWeight: 500 }}>
                  ₹2Cr+ Ad Spend
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(245,158,11,0.5)' }}></div>
                <div style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', fontWeight: 500 }}>
                  10M+ Views
                </div>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(245,158,11,0.5)' }}></div>
                <div style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', fontWeight: 500 }}>
                  AI-Powered Systems
                </div>
              </div>
            </div>

            {/* ── RIGHT — Hero Mockup ── */}
            <div className="hidden lg:block slide-up-2">
              <div className="float-anim">
                <div className="hero-mockup">
                  <img
                    src="/homepage.png"
                    alt="TheCraftStudios Platform — AI Ad Dashboard"
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }}
                  />
                </div>
                {/* Floating metric chips */}
                <div style={{
                  position: 'absolute', top: '8%', right: '-5%',
                  background: 'rgba(15,12,8,0.95)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  borderRadius: '12px', padding: '10px 16px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 30px rgba(255,107,0,0.2)',
                }}>
                  <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700, marginBottom: '2px' }}>ROAS</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>5.2×</div>
                </div>
                <div style={{
                  position: 'absolute', bottom: '12%', left: '-6%',
                  background: 'rgba(15,12,8,0.95)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  borderRadius: '12px', padding: '10px 16px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 30px rgba(255,107,0,0.2)',
                }}>
                  <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 700, marginBottom: '2px' }}>LEADS</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>2,460</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
          ══════════════════════════════════════ */}
      <section style={{ background: 'rgba(15,12,8,0.9)', borderTop: '1px solid rgba(245,158,11,0.1)', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '₹2Cr+', label: 'Ad Spend Managed' },
              { value: '10M+', label: 'Views Generated' },
              { value: '98%', label: 'Client Retention' },
              { value: '150+', label: 'Brands Served' },
            ].map((s, i) => (
              <div key={i} className="stat-item py-8">
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', color: '#F59E0B', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(148,163,184,0.8)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3 SERVICE CARDS — Center is FEATURED
          ══════════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="fire-orb w-[500px] h-[500px]" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)', top: '20%', left: '50%', transform: 'translateX(-50%)' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="fire-badge mb-4">What We Do</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 64px)', color: '#fff', marginBottom: '16px', letterSpacing: '0.02em' }}>
              Our Services
            </h2>
            <div className="gold-line w-20 mx-auto"></div>
          </div>

          {/* Cards grid — center card elevated */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* ── Card 1: Website & Mobile App ── */}
            <div className="fire-card p-8 relative overflow-hidden">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, rgba(74,108,247,0.5), transparent)' }}></div>
              {/* Icon */}
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(74,108,247,0.1)', border: '1px solid rgba(74,108,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '24px' }}>💻</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#fff', marginBottom: '12px', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                Website & Mobile<br />
                <span style={{ background: 'linear-gradient(135deg, #7C9DFF, #4A6CF7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>App Development</span>
              </h3>
              <p style={{ color: 'rgba(148,163,184,0.85)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                High-performance digital products built for speed, UX, and conversions.
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Responsive web design', 'Android & iOS apps', 'E-commerce solutions', 'Full-stack development'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(148,163,184,0.8)' }}>
                    <span style={{ color: '#4A6CF7', fontWeight: 700, fontSize: '15px' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/services/development" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '10px', background: 'rgba(74,108,247,0.12)', border: '1px solid rgba(74,108,247,0.3)', color: '#7C9DFF', fontSize: '14px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                Explore →
              </Link>
            </div>

            {/* ── Card 2: SOCIAL MEDIA ADS (FEATURED CENTER) ── */}
            <div className="fire-card-featured p-8 relative overflow-hidden">
              {/* Orange glow top bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #FF6B00, #F59E0B, #FF6B00)' }}></div>
              {/* Inner glow */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.08) 0%, transparent 60%)', pointerEvents: 'none', borderRadius: '20px' }}></div>

              {/* MAIN SERVICE badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.08)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '20px' }}>
                ⭐ Core Service
              </div>

              {/* Icon */}
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(245,158,11,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '24px', boxShadow: '0 0 30px rgba(255,107,0,0.2)' }}>📣</div>

              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#fff', marginBottom: '12px', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                Social Media Ads<br />
                <span className="fire-gradient-text">& Automation</span>
              </h3>
              <p style={{ color: 'rgba(148,163,184,0.9)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                We create, run, and automate ads that bring consistent leads & sales.
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Meta & Google Ads', 'AI-automated campaigns', 'Lead gen funnels', 'Real-time ROAS tracking', 'Auto-posting & scheduling'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(148,163,184,0.8)' }}>
                    <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '15px' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              {/* Fire CTA */}
              <Link href="/services/instagram-reels" className="fire-btn" style={{ width: '100%', padding: '14px 28px', fontSize: '15px', borderRadius: '12px', justifyContent: 'center' }}>
                Start Scaling Ads →
              </Link>
            </div>

            {/* ── Card 3: AI, SaaS & CRM ── */}
            <div className="fire-card p-8 relative overflow-hidden">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)' }}></div>
              {/* Icon */}
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '24px' }}>🤖</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#fff', marginBottom: '12px', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                AI, SaaS &<br />
                <span style={{ background: 'linear-gradient(135deg, #4ADE80, #22C55E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CRM Automation</span>
              </h3>
              <p style={{ color: 'rgba(148,163,184,0.85)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                Smart systems that automate your business, leads, and operations.
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['CRM setup & automation', 'Lead nurturing flows', 'Custom SaaS products', 'AI workflow builders'].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(148,163,184,0.8)' }}>
                    <span style={{ color: '#22C55E', fontWeight: 700, fontSize: '15px' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/services/software" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ADE80', fontSize: '14px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                Explore →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(12,9,5,0.95)', borderTop: '1px solid rgba(245,158,11,0.08)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="fire-badge mb-4">The Process</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff', marginBottom: '12px' }}>How It Works</h2>
            <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '16px' }}>From brief to revenue — four decisive steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), rgba(255,107,0,0.4), rgba(245,158,11,0.3), transparent)' }}></div>
            {[
              { step: '01', icon: '💡', title: 'Strategy', desc: 'We audit your brand and build a data-driven growth strategy.' },
              { step: '02', icon: '🎯', title: 'Creative', desc: 'High-converting ad creatives, scripts and landing pages.' },
              { step: '03', icon: '🚀', title: 'Launch', desc: 'We deploy your campaigns with AI-optimized targeting.' },
              { step: '04', icon: '📈', title: 'Scale', desc: 'Continuous optimization and automation for compounding ROI.' },
            ].map((item, i) => (
              <div key={i} className="step-card group">
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', position: 'relative', zIndex: 10 }}>{item.icon}</div>
                <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', marginBottom: '8px' }}>{item.step}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '13px', lineHeight: '1.65' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="fire-orb w-[400px] h-[400px]" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)', bottom: '-10%', right: '10%' }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="fire-badge mb-4">Client Wins</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 60px)', color: '#fff' }}>What Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Aryan Singh', role: 'Fashion Brand Owner', quote: 'TheCraftStudios took our ROAS from 1.2x to 5.8x in 60 days. Their Meta Ads automation is unreal.', growth: '+5.8× ROAS' },
              { name: 'Priya Sharma', role: 'Beauty Influencer', quote: 'I went from 10K to 100K followers and my DMs are full of buyers. Their content + ad combo is lethal.', growth: '+900%' },
              { name: 'Rahul Mehta', role: 'E-commerce Store', quote: 'Their CRM automation saved us 40 hours per week and tripled our lead conversion rate.', growth: '+3× Leads' },
            ].map((t, i) => (
              <div key={i} className="testi-card">
                <div className="flex gap-1 mb-5">{[1,2,3,4,5].map(s => <span key={s} style={{ color: '#F59E0B', fontSize: '14px' }}>★</span>)}</div>
                <p style={{ color: 'rgba(148,163,184,0.9)', fontSize: '14px', lineHeight: '1.75', marginBottom: '24px', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.7)', marginTop: '2px' }}>{t.role}</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B' }}>{t.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: 'rgba(12,9,5,0.98)', borderTop: '1px solid rgba(245,158,11,0.1)' }}>
        <div className="fire-orb w-[600px] h-[600px]" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="fire-badge mb-6">Ready to scale?</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 7vw, 84px)', lineHeight: '0.95', marginBottom: '24px' }}>
            <span className="white-text">Turn Your Brand Into A</span>
            <br />
            <span className="fire-gradient-text">Revenue Machine</span>
          </h2>
          <p style={{ color: 'rgba(148,163,184,0.85)', fontSize: '18px', marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px' }}>
            Join 150+ brands already winning with TheCraftStudios. Get your free audit today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio" className="fire-btn" style={{ padding: '18px 48px', fontSize: '17px' }}>
              Start Your Journey →
            </Link>
            <Link href="/contact" className="outline-btn" style={{ padding: '18px 48px', fontSize: '17px' }}>
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer style={{ background: '#050505', borderTop: '1px solid rgba(245,158,11,0.08)', padding: '60px 0 32px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <CSLogo size={40} />
                <div className="flex flex-col leading-none">
                  <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>thecraft</span>
                  <span style={{ fontWeight: 700, fontSize: '15px', color: '#F59E0B' }}>studios.in</span>
                </div>
              </div>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', lineHeight: '1.7' }}>
                AI-powered ads, websites & automation for brands that want to scale revenue fast.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Services</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { href: '/services/instagram-reels', label: 'Social Media Ads & Automation' },
                  { href: '/services/development', label: 'Web & App Development' },
                  { href: '/services/software', label: 'AI & CRM Automation' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F59E0B')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.7)')}
                  >{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Company</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { href: '/', label: 'Home' },
                  { href: '/studio', label: 'AI Studio' },
                  { href: '/contact', label: 'Contact' },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F59E0B')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.7)')}
                  >{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>Contact</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><a href="mailto:info@thecraftstudios.in" style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', textDecoration: 'none' }}>info@thecraftstudios.in</a></li>
                <li><a href="tel:+917760501116" style={{ color: 'rgba(148,163,184,0.7)', fontSize: '13px', textDecoration: 'none' }}>+91 77605 01116</a></li>
              </ul>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {['Instagram', 'Facebook', 'LinkedIn'].map((social, i) => (
                  <a key={i} href="#" style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'rgba(148,163,184,0.6)', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.5)'; (e.currentTarget as HTMLElement).style.color = '#F59E0B'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.6)'; }}
                  >
                    {['📸', 'f', 'in'][i]}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(245,158,11,0.08)', paddingTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: '13px' }}>
              © 2025 TheCraftStudios. All rights reserved. | Built with ❤️ in India
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
