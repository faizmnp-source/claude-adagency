import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';

const SERVICES = [
  { href: '/services/instagram-reels', icon: '📸', label: 'Instagram Reels', desc: 'AI-generated reels & auto-posting' },
  { href: '/services/branding', icon: '🎨', label: 'Brand Identity', desc: 'Logo, colours & visual guidelines' },
  { href: '/services/development', icon: '💻', label: 'Web & App Development', desc: 'Custom websites, Android & iOS apps' },
  { href: '/services/software', icon: '🤖', label: 'AI Automations & SaaS', desc: 'CRM, finance & intelligent workflows' },
];

export const NavBar: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (href: string) =>
    router.pathname === href || (href !== '/' && router.pathname.startsWith(href));

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      style={{
        color: isActive(href) ? 'var(--accent)' : 'var(--ink-soft)',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 800,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--ink)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = isActive(href) ? 'var(--accent)' : 'var(--ink-soft)';
      }}
    >
      {label}
    </Link>
  );

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.25s ease',
        padding: scrolled ? '12px 0' : '18px 0',
      }}
    >
      <div className="editorial-grid">
        <div
          style={{
            background: scrolled ? 'rgba(253,251,250,0.94)' : 'rgba(253,251,250,0.82)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(17,17,17,0.06)',
            borderRadius: '999px',
            boxShadow: scrolled ? '0 20px 42px rgba(35,25,17,0.10)' : '0 16px 32px rgba(35,25,17,0.06)',
            minHeight: '76px',
            padding: '0 18px 0 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <Logo size="small" />
          </Link>

          <nav className="cs-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setServicesOpen((value) => !value)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: isActive('/services') ? 'var(--accent)' : 'var(--ink-soft)',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Services
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  style={{ transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {servicesOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 18px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '340px',
                    padding: '10px',
                    borderRadius: '26px',
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(17,17,17,0.08)',
                    boxShadow: '0 24px 60px rgba(35,25,17,0.14)',
                  }}
                >
                  {SERVICES.map((service) => (
                    <Link key={service.href} href={service.href} style={{ textDecoration: 'none' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '14px',
                          padding: '14px 16px',
                          borderRadius: '20px',
                          transition: 'background 0.18s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(11,43,38,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span style={{ fontSize: '22px', lineHeight: 1 }}>{service.icon}</span>
                        <span style={{ display: 'block' }}>
                          <span style={{ display: 'block', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>{service.label}</span>
                          <span style={{ display: 'block', color: 'var(--muted)', fontSize: '12px', marginTop: '3px', lineHeight: 1.5 }}>{service.desc}</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLink('/pricing', 'Pricing')}
            {navLink('/studio', 'AI Studio')}
            {navLink('/designs', 'Designs')}
            {navLink('/contact', 'Contact')}

            <Link href="/studio" className="cta-primary" style={{ minHeight: '48px', padding: '0 26px' }}>
              Try For Free
            </Link>
          </nav>

          <button
            className="cs-nav-burger"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '999px',
              border: '1px solid rgba(17,17,17,0.08)',
              background: '#fff',
              color: 'var(--forest)',
              cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div
            style={{
              marginTop: '12px',
              padding: '20px',
              borderRadius: '28px',
              background: 'rgba(255,255,255,0.96)',
              border: '1px solid rgba(17,17,17,0.08)',
              boxShadow: '0 20px 46px rgba(35,25,17,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div className="eyebrow" style={{ marginBottom: '4px' }}>Services</div>
            {SERVICES.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                style={{
                  padding: '12px 4px',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                {service.icon} {service.label}
              </Link>
            ))}
            <div className="eyebrow" style={{ marginTop: '12px', marginBottom: '4px' }}>Pages</div>
            <Link href="/pricing" style={{ padding: '12px 4px', textDecoration: 'none', color: 'var(--ink)', fontSize: '15px', fontWeight: 700 }}>Pricing</Link>
            <Link href="/studio" style={{ padding: '12px 4px', textDecoration: 'none', color: 'var(--ink)', fontSize: '15px', fontWeight: 700 }}>AI Studio</Link>
            <Link href="/designs" style={{ padding: '12px 4px', textDecoration: 'none', color: 'var(--ink)', fontSize: '15px', fontWeight: 700 }}>Designs</Link>
            <Link href="/contact" style={{ padding: '12px 4px', textDecoration: 'none', color: 'var(--ink)', fontSize: '15px', fontWeight: 700 }}>Contact</Link>

            <Link href="/studio" className="cta-primary" style={{ marginTop: '10px', width: '100%' }}>
              Try For Free
            </Link>
          </div>
        )}
      </div>

      <style suppressHydrationWarning>{`
        @media (max-width: 960px) {
          .cs-nav-desktop { display: none !important; }
        }

        @media (min-width: 961px) {
          .cs-nav-burger { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default NavBar;
