/**
 * NavBar.tsx — Shared navigation bar (matches homepage design)
 * Dark glass nav: transparent → #0A0A0A/97 on scroll
 * Logo: /download.png | Links: Home, Services, AI Studio, Contact
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';

const R     = '#E50914';
const TEXT  = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.65)';

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/studio',  label: 'AI Studio' },
  { href: '/contact', label: 'Contact' },
];

export const NavBar: React.FC = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(10,10,10,0.5)',
      borderBottom: scrolled
        ? `1px solid rgba(229,9,20,0.2)`
        : '1px solid rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s',
    }}>
      <div style={{
        maxWidth: '1240px', margin: '0 auto', padding: '0 24px',
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo size="medium" />
        </Link>

        {/* Desktop nav */}
        <nav className="cs-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = router.pathname === href || (href !== '/' && router.pathname.startsWith(href));
            return (
              <Link
                key={href} href={href}
                style={{
                  fontSize: '14px', fontWeight: 500,
                  color: active ? R : MUTED,
                  textDecoration: 'none', transition: 'color 0.2s',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = R)}
                onMouseLeave={e => (e.currentTarget.style.color = active ? R : MUTED)}
              >{label}</Link>
            );
          })}
          <Link
            href="/services"
            style={{
              padding: '10px 24px', background: R, color: TEXT,
              fontSize: '13px', fontWeight: 700, textDecoration: 'none',
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >GET STARTED</Link>
        </nav>

        {/* Burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cs-nav-burger"
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', color: TEXT, cursor: 'pointer', padding: '4px' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(10,10,10,0.99)',
          borderTop: `1px solid rgba(229,9,20,0.15)`,
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              style={{ fontSize: '16px', fontWeight: 500, color: TEXT, textDecoration: 'none' }}
            >{label}</Link>
          ))}
          <Link href="/services"
            style={{
              marginTop: '8px', padding: '14px 24px',
              background: R, color: TEXT,
              fontSize: '15px', fontWeight: 700,
              textDecoration: 'none', textAlign: 'center',
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em',
            }}
          >GET STARTED</Link>
        </div>
      )}

      {/* Responsive CSS */}
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) { .cs-nav-desktop { display: none !important; } }
        @media (min-width: 769px) { .cs-nav-burger  { display: none !important; } }
      `}</style>
    </header>
  );
};

export default NavBar;
