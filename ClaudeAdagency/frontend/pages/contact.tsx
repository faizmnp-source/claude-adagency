'use client';

import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const R    = '#E50914';
const BG   = '#0A0A0A';
const BG2  = '#111111';
const TEXT = '#FFFFFF';
const MUTED = '#888888';

const inputStyle: React.CSSProperties = {
  background: '#1A1A1A',
  border: `1px solid rgba(229,9,20,0.25)`,
  color: TEXT,
  padding: '13px 16px',
  width: '100%',
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
  fontSize: '14px',
  borderRadius: '4px',
  transition: 'border-color 0.2s',
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: '', message: '',
    contactMethod: 'email', budget: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  return (
    <>
      <Head>
        <title>Contact — The Craft Studio</title>
        <meta name="description" content="Get in touch with The Craft Studio. We respond within 2 hours." />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ background: BG, color: TEXT, fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
        <NavBar />

        {/* ── Hero ── */}
        <section style={{
          paddingTop: '140px', paddingBottom: '72px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* red radial bg */}
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(229,9,20,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', padding: '6px 18px', border: `1px solid rgba(229,9,20,0.4)`, color: R, fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', marginBottom: '24px' }}>GET IN TOUCH</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 112px)', letterSpacing: '4px', color: TEXT, lineHeight: 0.92, margin: '0 0 24px' }}>
              LET&apos;S BUILD<br /><span style={{ color: R }}>SOMETHING</span><br />GREAT
            </h1>
            <p style={{ fontSize: '18px', color: MUTED, maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
              Ready to transform your brand? Reach out — we respond within 2 hours.
            </p>
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section style={{ padding: '0 24px 100px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="contact-grid">

            {/* Info sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {[
                { icon: '📧', label: 'Email',    value: 'info@thecraftstudios.in',  href: 'mailto:info@thecraftstudios.in' },
                { icon: '📞', label: 'Phone',    value: '+91 77605 01116',           href: 'tel:+917760501116' },
                { icon: '📍', label: 'Location', value: 'India (Remote & On-site)', href: '#' },
              ].map((info, i) => (
                <div key={i} style={{ background: BG2, border: `1px solid rgba(229,9,20,0.15)`, padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px', transition: 'border-color 0.2s' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(229,9,20,0.1)', border: `1px solid rgba(229,9,20,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>{info.label}</p>
                    <a href={info.href} style={{ color: TEXT, fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>{info.value}</a>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div style={{ background: BG2, border: `1px solid rgba(229,9,20,0.15)`, padding: '20px' }}>
                <p style={{ fontSize: '11px', color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>Follow Us</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[{ l: 'f', n: 'Facebook' }, { l: '@', n: 'Instagram' }, { l: 'in', n: 'LinkedIn' }].map(s => (
                    <a key={s.n} href="#" title={s.n}
                      style={{ width: '38px', height: '38px', border: `1px solid rgba(229,9,20,0.3)`, color: R, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(229,9,20,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = R; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,9,20,0.3)'; }}
                    >{s.l}</a>
                  ))}
                </div>
              </div>

              {/* Response time */}
              <div style={{ background: BG2, border: `1px solid rgba(229,9,20,0.15)`, padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: R, flexShrink: 0, animation: 'pulse 2s infinite' }} />
                <div>
                  <p style={{ color: TEXT, fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>We respond within 2 hours</p>
                  <p style={{ color: MUTED, fontSize: '12px' }}>Mon–Sat, 9am–8pm IST</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ background: BG2, border: `1px solid rgba(229,9,20,0.15)`, padding: '40px' }}>
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', letterSpacing: '3px', color: TEXT, marginBottom: '32px' }}>SEND A MESSAGE</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="form-grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" style={inputStyle}
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = R; }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(229,9,20,0.25)'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" style={inputStyle}
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = R; }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(229,9,20,0.25)'; }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="form-grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 77605 01116" style={inputStyle}
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = R; }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(229,9,20,0.25)'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Budget</label>
                      <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. ₹50,000 – ₹1,00,000" style={inputStyle}
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = R; }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(229,9,20,0.25)'; }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Service Interest</label>
                    <select name="service" value={formData.service} onChange={handleChange}
                      style={{ ...inputStyle, appearance: 'none' as const }}>
                      <option value="" style={{ background: '#1A1A1A' }}>Select a service</option>
                      <option value="instagram-reels" style={{ background: '#1A1A1A' }}>Instagram Reels & Social Media</option>
                      <option value="development" style={{ background: '#1A1A1A' }}>Web & App Development</option>
                      <option value="ai-saas" style={{ background: '#1A1A1A' }}>AI / SaaS Systems</option>
                      <option value="branding" style={{ background: '#1A1A1A' }}>Branding & Design</option>
                      <option value="other" style={{ background: '#1A1A1A' }}>Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      required rows={5} placeholder="Tell us about your project..."
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = R; }}
                      onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(229,9,20,0.25)'; }}
                    />
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Preferred Contact Method</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {['email', 'phone', 'both'].map(opt => (
                        <label key={opt} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 18px', cursor: 'pointer',
                          border: `1px solid ${formData.contactMethod === opt ? R : 'rgba(229,9,20,0.2)'}`,
                          background: formData.contactMethod === opt ? 'rgba(229,9,20,0.08)' : 'transparent',
                          color: formData.contactMethod === opt ? TEXT : MUTED,
                          fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', textTransform: 'capitalize',
                        }}>
                          <input type="radio" name="contactMethod" value={opt} checked={formData.contactMethod === opt} onChange={handleChange}
                            style={{ accentColor: R, width: '14px', height: '14px' }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit"
                    style={{
                      width: '100%', padding: '16px', background: R, color: TEXT,
                      border: 'none', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '18px', letterSpacing: '0.1em', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  >SEND MESSAGE →</button>
                </form>
              ) : (
                <div style={{ background: BG2, border: `1px solid rgba(229,9,20,0.3)`, padding: '80px 40px', textAlign: 'center' }}>
                  <div style={{ fontSize: '56px', marginBottom: '24px' }}>🚀</div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', letterSpacing: '4px', color: TEXT, marginBottom: '16px' }}>MESSAGE SENT!</h3>
                  <p style={{ color: MUTED, fontSize: '16px', marginBottom: '32px', lineHeight: 1.65 }}>
                    Thanks for reaching out! We'll get back to you within 2 hours.
                  </p>
                  <Link href="/" style={{ display: 'inline-block', padding: '14px 40px', background: R, color: TEXT, textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '0.1em' }}>
                    BACK TO HOME
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <style suppressHydrationWarning>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media(min-width:900px){
          .contact-grid { grid-template-columns: 360px 1fr !important; }
        }
        @media(max-width:600px){
          .form-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default ContactPage;
