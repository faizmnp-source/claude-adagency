'use client';

import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const SocialGlyph = ({ icon }: { icon: 'instagram' | 'linkedin' | 'facebook' }) => {
  if (icon === 'instagram') {
    return (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.3" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (icon === 'linkedin') {
    return (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M7.2 8.6V18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M7.2 6.5C7.80751 6.5 8.3 6.00751 8.3 5.4C8.3 4.79249 7.80751 4.3 7.2 4.3C6.59249 4.3 6.1 4.79249 6.1 5.4C6.1 6.00751 6.59249 6.5 7.2 6.5Z" fill="currentColor" />
        <path d="M11.4 18V11.9C11.4 10.2 12.5 8.9 14.1 8.9C15.7 8.9 16.5 9.9 16.5 11.9V18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.4 10.3V8.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.3 20V12.7H15.8L16.2 9.8H13.3V8C13.3 7.16 13.54 6.58 14.74 6.58H16.3V4.02C15.55 3.94 14.8 3.9 14.04 3.9C11.79 3.9 10.25 5.27 10.25 7.79V9.8H7.8V12.7H10.25V20H13.3Z" />
    </svg>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    contactMethod: 'email',
    budget: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Contact — The Craft Studio</title>
        <meta name="description" content="Get in touch with The Craft Studio. We respond within 2 hours." />
        <meta property="og:title" content="Contact Us — TheCraftStudios" />
        <meta property="og:description" content="Get in touch with TheCraftStudios. We build AI-powered Instagram reels, websites and brand identities." />
        <meta property="og:url" content="https://www.thecraftstudios.in/contact" />
        <link rel="canonical" href="https://www.thecraftstudios.in/contact" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          <section style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="section-chip">Get In Touch</span>
            <h1 className="section-title" style={{ marginTop: '20px', marginBottom: '14px' }}>
              Let’s Build <span className="text-accent">Something Great</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '680px', margin: '0 auto' }}>
              Looking for a technical partner, an AI content engine, or a new digital system for your brand? We usually reply within 2 hours.
            </p>
          </section>

          <section className="contact-grid" style={{ display: 'grid', gap: '24px', marginBottom: '70px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { icon: '📧', label: 'Email', value: 'info@thecraftstudios.in', href: 'mailto:info@thecraftstudios.in' },
                { icon: '📞', label: 'Phone', value: '+91 77605 01116', href: 'tel:+917760501116' },
                { icon: '📍', label: 'Location', value: 'India · Remote & On-site', href: '#' },
              ].map((item) => (
                <div key={item.label} className="editorial-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '18px',
                        background: 'rgba(227,100,20,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="eyebrow" style={{ marginBottom: '8px' }}>{item.label}</div>
                      <a href={item.href} style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '17px', fontWeight: 700 }}>
                        {item.value}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <div className="editorial-card" style={{ padding: '24px' }}>
                <div className="eyebrow" style={{ marginBottom: '10px' }}>Follow Us</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Instagram', icon: 'instagram' as const },
                    { label: 'LinkedIn', icon: 'linkedin' as const },
                    { label: 'Facebook', icon: 'facebook' as const },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href="#"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        borderRadius: '999px',
                        border: '1px solid rgba(17,17,17,0.08)',
                        textDecoration: 'none',
                        color: 'var(--forest)',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        background: '#fff',
                      }}
                      aria-label={item.label}
                    >
                      <SocialGlyph icon={item.icon} />
                      {item.label}
                    </a>
                  ))}
                </div>

                <div
                  style={{
                    borderRadius: '22px',
                    background: 'rgba(11,43,38,0.06)',
                    padding: '18px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: 'var(--accent)', display: 'inline-block' }} />
                  <div>
                    <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '14px' }}>Fast Response Window</div>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>Mon–Sat, 9am–8pm IST</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {!submitted ? (
                <form className="editorial-card" onSubmit={handleSubmit} style={{ padding: '30px' }}>
                  <div className="eyebrow" style={{ marginBottom: '10px' }}>Inquiry Form</div>
                  <h2 className="display" style={{ fontSize: '42px', marginBottom: '26px' }}>Send A Message</h2>

                  <div className="form-grid-2" style={{ display: 'grid', gap: '18px', marginBottom: '18px' }}>
                    <div>
                      <label className="field-label">Full Name</label>
                      <input className="field-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="field-label">Email Address</label>
                      <input className="field-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ display: 'grid', gap: '18px', marginBottom: '18px' }}>
                    <div>
                      <label className="field-label">Phone Number</label>
                      <input className="field-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 77605 01116" />
                    </div>
                    <div>
                      <label className="field-label">Budget</label>
                      <input className="field-input" type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="₹50,000 – ₹1,00,000" />
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label className="field-label">Service Interest</label>
                    <select className="field-select" name="service" value={formData.service} onChange={handleChange}>
                      <option value="">Select a service</option>
                      <option value="instagram-reels">Instagram Reels & Social Media</option>
                      <option value="development">Web & App Development</option>
                      <option value="ai-saas">AI / SaaS Systems</option>
                      <option value="branding">Branding & Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label className="field-label">Message</label>
                    <textarea className="field-textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your project..." required />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label className="field-label">Preferred Contact Method</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['email', 'phone', 'both'].map((option) => (
                        <label
                          key={option}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            borderRadius: '999px',
                            border: `1px solid ${formData.contactMethod === option ? 'rgba(227,100,20,0.3)' : 'rgba(17,17,17,0.08)'}`,
                            background: formData.contactMethod === option ? 'rgba(227,100,20,0.08)' : '#fff',
                            color: formData.contactMethod === option ? 'var(--accent)' : 'var(--ink-soft)',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          <input type="radio" name="contactMethod" value={option} checked={formData.contactMethod === option} onChange={handleChange} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="cta-primary" style={{ width: '100%' }}>
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="editorial-card-dark" style={{ borderRadius: '36px', padding: '52px 30px', textAlign: 'center', background: 'linear-gradient(135deg, #0b2b26 0%, #123732 100%)' }}>
                  <div style={{ fontSize: '56px', marginBottom: '18px' }}>🚀</div>
                  <h3 className="display" style={{ fontSize: '54px', marginBottom: '10px' }}>Message Sent</h3>
                  <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: '16px', lineHeight: 1.7, marginBottom: '20px' }}>
                    Thanks for reaching out. We’ll get back to you within 2 hours.
                  </p>
                  <Link href="/" className="cta-primary">
                    Back To Home
                  </Link>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .contact-grid {
          grid-template-columns: 360px minmax(0, 1fr);
        }
        .form-grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (max-width: 980px) {
          .contact-grid,
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default ContactPage;
