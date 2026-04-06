/**
 * Footer.tsx — Shared footer (matches homepage design)
 * Black bg, red top border, 4-col grid, social icons
 */

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const R     = '#E50914';
const MUTED = '#888888';
const TEXT2 = '#E8E8E8';

const LiIcon = {
  linkedin:  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  twitter:   <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
};

export const Footer: React.FC = () => (
  <footer style={{ background: '#000', borderTop: `1px solid ${R}`, padding: '72px 24px 32px' }}>
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

      {/* 4-col grid */}
      <div className="cs-footer-grid" style={{ marginBottom: '56px' }}>

        {/* Brand */}
        <div>
          <div style={{ marginBottom: '14px' }}>
            <Logo size="small" />
          </div>
          <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7, maxWidth: '220px' }}>
            Your complete digital platform — built for brands that want to scale.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.15em', color: R, marginBottom: '16px' }}>PRODUCT</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '/',                         label: 'Home' },
              { href: '/services',                 label: 'Services' },
              { href: '/studio',                   label: 'AI Studio' },
              { href: '/services/instagram-reels', label: 'Pricing' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} style={{ fontSize: '14px', color: TEXT2, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = R)}
                  onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}
                >{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.15em', color: R, marginBottom: '16px' }}>COMPANY</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '/contact', label: 'Contact' },
              { href: '/studio',  label: 'Studio' },
              { href: '/contact', label: 'Support' },
              { href: '/contact', label: 'Careers' },
            ].map(({ href, label }, i) => (
              <li key={i}>
                <Link href={href} style={{ fontSize: '14px', color: TEXT2, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = R)}
                  onMouseLeave={e => (e.currentTarget.style.color = TEXT2)}
                >{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '0.15em', color: R, marginBottom: '16px' }}>CONNECT</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <a href="mailto:info@thecraftstudios.in" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>info@thecraftstudios.in</a>
            <a href="tel:+917760501116"              style={{ fontSize: '13px', color: MUTED, textDecoration: 'none' }}>+91 77605 01116</a>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {([
              { icon: LiIcon.linkedin,  label: 'LinkedIn',  href: '#' },
              { icon: LiIcon.instagram, label: 'Instagram', href: '#' },
              { icon: LiIcon.twitter,   label: 'Twitter',   href: '#' },
            ] as const).map(({ icon, label, href }) => (
              <a key={label} href={href} aria-label={label}
                style={{
                  width: '38px', height: '38px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid rgba(229,9,20,0.3)`,
                  color: R, textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = R; (e.currentTarget as HTMLElement).style.background = 'rgba(229,9,20,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,9,20,0.3)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >{icon}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '13px', color: MUTED, margin: 0 }}>
          © {new Date().getFullYear()} TheCraftStudios. All rights reserved.
        </p>
        <p style={{ fontSize: '13px', color: MUTED, margin: 0 }}>
          Built with ❤️ in India
        </p>
      </div>
    </div>

    {/* Footer grid CSS */}
    <style suppressHydrationWarning>{`
      .cs-footer-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
      }
      @media (min-width: 768px) {
        .cs-footer-grid { grid-template-columns: repeat(4, 1fr); }
      }
    `}</style>
  </footer>
);

export default Footer;
