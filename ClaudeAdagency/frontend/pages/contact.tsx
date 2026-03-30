'use client';

import { useState } from 'react';
import Link from 'next/link';

const CSLogo = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="38" rx="8" stroke="#4A6CF7" strokeWidth="1.5" fill="rgba(74,108,247,0.08)" />
    <text x="5" y="27" fontFamily="Bebas Neue, sans-serif" fontSize="22" fill="#4A6CF7" letterSpacing="1">CS</text>
    <polygon points="30,20 37,14 37,26" fill="#F59E0B" />
  </svg>
);

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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    background: 'rgba(13,22,40,0.9)',
    border: '1px solid rgba(74,108,247,0.3)',
    color: '#fff',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: '14px',
  };

  return (
    <div className="min-h-screen" style={{ background: '#050B18', color: '#fff' }}>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#050B18]/95 backdrop-blur-md border-b border-[rgba(74,108,247,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <CSLogo size={36} />
              <div className="hidden sm:block">
                <span className="font-bold text-white">thecraft</span>
                <span className="font-bold" style={{ color: '#F59E0B' }}>studios</span>
                <span className="font-bold text-white">.in</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm">Home</Link>
              <Link href="/services/instagram-reels" className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm">Instagram Reels</Link>
              <Link href="/services/branding" className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm">Services</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden space-bg circuit-bg">
        <div className="blue-orb w-[500px] h-[500px] -top-32 left-1/2 -translate-x-1/2 opacity-40"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="badge mb-6 mx-auto inline-flex">Let's Talk</div>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-6 uppercase leading-none">
            Get In<br /><span className="gradient-text">Touch</span>
          </h1>
          <p className="text-[#94A3B8] text-xl max-w-2xl mx-auto">
            Ready to transform your brand? Reach out and let's discuss your project.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Info column */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl text-white mb-8 uppercase">Contact Info</h2>
              </div>

              {[
                {
                  icon: '📧',
                  label: 'Email',
                  value: 'hello@thecraftstudios.in',
                  href: 'mailto:hello@thecraftstudios.in',
                },
                {
                  icon: '📞',
                  label: 'Phone',
                  value: '+91 99999 99999',
                  href: 'tel:+919999999999',
                },
                {
                  icon: '📍',
                  label: 'Location',
                  value: 'India',
                  href: '#',
                },
              ].map((info, i) => (
                <div key={i} className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.2)] hover:border-[rgba(74,108,247,0.4)] transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-lg flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-1">{info.label}</p>
                      <a href={info.href} className="text-white font-semibold hover:text-[#4A6CF7] transition-colors">
                        {info.value}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Social links */}
              <div className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.2)]">
                <p className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: 'f', label: 'Facebook' },
                    { icon: '@', label: 'Instagram' },
                    { icon: 'in', label: 'LinkedIn' },
                  ].map((social, i) => (
                    <a key={i} href="#"
                      className="w-10 h-10 rounded-xl border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-sm text-[#4A6CF7] hover:bg-[rgba(74,108,247,0.15)] hover:border-[#4A6CF7] transition-all"
                      title={social.label}>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Response time badge */}
              <div className="flex items-center gap-3 glass rounded-2xl p-5 border border-[rgba(245,158,11,0.2)]">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse flex-shrink-0"></div>
                <div>
                  <p className="text-white font-semibold text-sm">We respond within 2 hours</p>
                  <p className="text-[#94A3B8] text-xs">Mon–Sat, 9am–8pm IST</p>
                </div>
              </div>
            </div>

            {/* Form column */}
            <div className="lg:col-span-2">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 md:p-10 border border-[rgba(74,108,247,0.2)]">
                  <h2 className="font-display text-4xl text-white mb-8 uppercase">Send a Message</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                        required placeholder="Your name" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        required placeholder="your@email.com" style={inputStyle} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                        placeholder="+91 99999 99999" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Budget</label>
                      <input type="text" name="budget" value={formData.budget} onChange={handleInputChange}
                        placeholder="e.g. ₹50,000 – ₹1,00,000" style={inputStyle} />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Service Interest</label>
                    <select name="service" value={formData.service} onChange={handleInputChange}
                      style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="" style={{ background: '#0D1628' }}>Select a service</option>
                      <option value="instagram-reels" style={{ background: '#0D1628' }}>Instagram Reels</option>
                      <option value="development" style={{ background: '#0D1628' }}>Web Development</option>
                      <option value="branding" style={{ background: '#0D1628' }}>Branding</option>
                      <option value="other" style={{ background: '#0D1628' }}>Other</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange}
                      required rows={5} placeholder="Tell us about your project..."
                      style={{ ...inputStyle, resize: 'none' }} />
                  </div>

                  <div className="mb-8">
                    <label className="block text-xs font-bold text-white mb-3 uppercase tracking-wider">Preferred Contact Method</label>
                    <div className="flex gap-4">
                      {[
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone' },
                        { value: 'both', label: 'Both' },
                      ].map(option => (
                        <label key={option.value}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer border transition-all text-sm ${
                            formData.contactMethod === option.value
                              ? 'border-[#4A6CF7] bg-[rgba(74,108,247,0.1)] text-white'
                              : 'border-[rgba(74,108,247,0.2)] text-[#94A3B8] hover:border-[rgba(74,108,247,0.4)]'
                          }`}>
                          <input
                            type="radio"
                            name="contactMethod"
                            value={option.value}
                            checked={formData.contactMethod === option.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-[#4A6CF7]"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="gold-btn w-full justify-center px-8 py-4 text-lg font-bold">
                    Send Message →
                  </button>
                </form>
              ) : (
                <div className="glass rounded-2xl p-16 text-center border border-[rgba(74,108,247,0.3)]">
                  <div className="w-20 h-20 rounded-2xl bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.4)] flex items-center justify-center text-4xl mx-auto mb-6">
                    🚀
                  </div>
                  <h3 className="font-display text-5xl text-white mb-4 uppercase">Message Sent!</h3>
                  <p className="text-[#94A3B8] text-lg mb-8">
                    Thanks for reaching out! We'll get back to you within 2 hours.
                  </p>
                  <Link href="/" className="gold-btn px-8 py-3 font-bold">
                    Back to Home
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="blue-orb w-[300px] h-[300px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-5xl text-white mb-4 uppercase">
            Still Have <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-[#94A3B8] text-lg mb-6">
            Check out our services page to learn more about what we offer.
          </p>
          <Link href="/" className="blue-btn px-8 py-3 font-bold">
            View All Services
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-[rgba(74,108,247,0.15)]" style={{ background: '#050B18' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#94A3B8] text-sm">&copy; 2024 TheCraftStudios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
