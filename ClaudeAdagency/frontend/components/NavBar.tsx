/**
 * NavBar.tsx — Shared navigation bar (Dark Space Theme)
 * Dark glass nav with Services dropdown, Pricing link, and Studio CTA
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';

const R     = '#E50914';
const MUTED = 'rgba(255,255,255,0.55)';
const TEXT  = '#FFFFFF';

const SERVICES = [
  { href: '/services/instagram-reels', icon: '📸', label: 'Instagram Reels',      desc: 'AI-generated reels & auto-posting' },
  { href: '/services/branding',        icon: '🎨', label: 'Brand Identity',        desc: 'Logo, colours & visual guidelines' },
  { href: '/services/development',     icon: '💻', label: 'Web & App Development', desc: 'Custom websites, Android & iOS apps' },
  { href: '/services/software',        icon: '🤖', label: 'AI Automations & SaaS', desc: 'CRM, finance & intelligent workflows' },
];

export const NavBar: React.FC = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef                     = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (href: string) =>
    router.pathname === href || (href !== '/' && router.pathname.startsWith(href));

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(5,11,24,0.97)' : 'rgba(5,11,24,0.80)',
      borderBottom: scrolled ? '1px solid rgba(229,9,20,0.25)' : '1px solid rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.3s',
    }}>
      <div style={{
        maxWidth: '1240px', margin: '0 auto', padding: '0 24px',
        height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo size="medium" />
        </Link>

        {/* Desktop Nav */}
        <nav className="cs-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>

          {/* Services dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setServicesOpen(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: 500, letterSpacing: '0.04em',
                color: isActive('/services') ? R : MUTED,
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: 0, transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
              onMouseLeave={e => (e.currentTarget.style.color = isActive('/services') ? R : MUTED)}
            >
              Services
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {servicesOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
                background: '#0D1628',
                border: '1px solid rgba(229,9,20,0.2)',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                padding: '8px', width: '320px', zIndex: 200,
              }}>
                {SERVICES.map(s => (
                  <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 14px', borderRadius: '10px', transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(229,9,20,0.08)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <span style={{ fontSize: '22px', flexShrink: 0 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{s.label}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{s.desc}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link href="/pricing"
            style={{
              fontSize: '14px', fontWeight: 500, letterSpacing: '0.04em',
              color: isActive('/pricing') ? R : MUTED,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = isActive('/pricing') ? R : MUTED)}
          >Pricing</Link>

          {/* AI Studio */}
          <Link href="/studio"
            style={{
              fontSize: '14px', fontWeight: 500, letterSpacing: '0.04em',
              color: isActive('/studio') ? R : MUTED,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = isActive('/studio') ? R : MUTED)}
          >AI Studio</Link>

          {/* Concepts */}
          <Link href="/designs"
            style={{
              fontSize: '14px', fontWeight: 500, letterSpacing: '0.04em',
              color: isActive('/designs') ? R : MUTED,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = isActive('/designs') ? R : MUTED)}
          >Designs</Link>

          {/* Contact */}
          <Link href="/contact"
            style={{
              fontSize: '14px', fontWeight: 500, letterSpacing: '0.04em',
              color: isActive('/contact') ? R : MUTED,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = isActive('/contact') ? R : MUTED)}
          >Contact</Link>

          {/* CTA */}
          <Link href="/studio"
            style={{
              padding: '10px 24px', background: R, color: '#fff',
              fontSize: '13px', fontWeight: 700, textDecoration: 'none',
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em',
              borderRadius: '6px', transition: 'all 0.2s', display: 'inline-block',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(229,9,20,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >TRY FOR FREE</Link>
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
          background: 'rgba(5,11,24,0.98)',
          borderTop: '1px solid rgba(229,9,20,0.15)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '8px 0 4px' }}>Services</p>
          {SERVICES.map(s => (
            <Link key={s.href} href={s.href}
              style={{ fontSize: '15px', fontWeight: 500, color: TEXT, textDecoration: 'none', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{s.icon}</span>{s.label}
            </Link>
          ))}

          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '12px 0 4px' }}>Pages</p>
          {[
            { href: '/pricing', label: 'Pricing' },
            { href: '/studio',  label: 'AI Studio' },
            { href: '/designs', label: 'Designs' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              style={{ fontSize: '15px', fontWeight: 500, color: MUTED, textDecoration: 'none', padding: '8px 0' }}>
              {label}
            </Link>
          ))}

          <Link href="/studio"
            style={{
              marginTop: '12px', padding: '14px 24px',
              background: R, color: '#fff',
              fontSize: '15px', fontWeight: 700,
              textDecoration: 'none', textAlign: 'center',
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em',
              borderRadius: '8px', display: 'block',
            }}
          >TRY FOR FREE →</Link>
        </div>
      )}

      <style suppressHydrationWarning>{`
        @media (max-width: 900px) { .cs-nav-desktop { display: none !important; } }
        @media (min-width: 901px) { .cs-nav-burger  { display: none !important; } }
      `}</style>
    </header>
  );
};

export default NavBar;
