import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const socials = [
  { label: 'Instagram', href: '#', icon: 'instagram' as const },
  { label: 'LinkedIn', href: '#', icon: 'linkedin' as const },
  { label: 'X / Twitter', href: '#' },
];

const SocialGlyph = ({ icon }: { icon: 'instagram' | 'linkedin' }) => {
  if (icon === 'instagram') {
    return (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.3" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M7.2 8.6V18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M7.2 6.5C7.80751 6.5 8.3 6.00751 8.3 5.4C8.3 4.79249 7.80751 4.3 7.2 4.3C6.59249 4.3 6.1 4.79249 6.1 5.4C6.1 6.00751 6.59249 6.5 7.2 6.5Z" fill="currentColor" />
      <path d="M11.4 18V11.9C11.4 10.2 12.5 8.9 14.1 8.9C15.7 8.9 16.5 9.9 16.5 11.9V18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.4 10.3V8.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
};

export const Footer: React.FC = () => (
  <footer style={{ padding: '88px 0 28px' }}>
    <div className="editorial-grid">
      <div
        className="editorial-card"
        style={{
          borderRadius: '40px',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(246,241,238,0.92) 100%)',
        }}
      >
        <div style={{ padding: '42px 28px 34px', borderBottom: '1px solid rgba(17,17,17,0.06)' }}>
          <div className="cs-footer-grid" style={{ display: 'grid', gap: '28px' }}>
            <div>
              <Logo size="medium" />
              <p style={{ marginTop: '16px', maxWidth: '320px', color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.8 }}>
                Synthesizing engineering, brand systems, and AI-assisted content operations into one studio workflow.
              </p>
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: '14px' }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>Home</Link>
                <Link href="/services" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>Services</Link>
                <Link href="/pricing" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>Pricing</Link>
                <Link href="/studio" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>AI Studio</Link>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: '14px' }}>Company</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/contact" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>Contact</Link>
                <Link href="/privacy" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>Privacy Policy</Link>
                <Link href="/terms" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>Terms of Service</Link>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: '14px' }}>Connect</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                <a href="mailto:info@thecraftstudios.in" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>
                  info@thecraftstudios.in
                </a>
                <a href="tel:+917760501116" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 700 }}>
                  +91 77605 01116
                </a>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '999px',
                      textDecoration: 'none',
                      border: '1px solid rgba(17,17,17,0.08)',
                      color: 'var(--forest)',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      background: '#fff',
                    }}
                    aria-label={social.label}
                  >
                    {'icon' in social ? <SocialGlyph icon={social.icon} /> : null}
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '18px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            color: 'var(--muted)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <span>© {new Date().getFullYear()} The Craft Studios</span>
          <span>Bengaluru, India</span>
        </div>
      </div>
    </div>

    <style suppressHydrationWarning>{`
      .cs-footer-grid {
        grid-template-columns: 1.4fr 1fr 1fr 1fr;
      }

      @media (max-width: 960px) {
        .cs-footer-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 640px) {
        .cs-footer-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </footer>
);

export default Footer;
