import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'X / Twitter', href: '#' },
];

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
                  >
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
