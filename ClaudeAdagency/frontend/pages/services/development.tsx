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

const DevelopmentPage = () => {
  const [formData, setFormData] = useState({
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    name: '',
    email: '',
    phone: '',
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
              <Link href="/services/branding" className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm">Branding</Link>
              <Link href="/contact" className="gold-btn px-5 py-2 text-sm font-bold">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden space-bg circuit-bg">
        <div className="blue-orb w-[500px] h-[500px] -top-32 right-0 opacity-40"></div>
        <div className="gold-orb w-[300px] h-[300px] bottom-0 left-0 opacity-30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="badge mb-6 mx-auto inline-flex">Web & App Development</div>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-6 uppercase leading-none">
            Web & App Design<br />
            <span className="gradient-text">That Converts</span>
          </h1>
          <p className="text-[#94A3B8] text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Custom web and mobile app solutions built to complement your content strategy
            and turn visitors into paying customers.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge mb-4 mx-auto inline-flex">Project Intake</div>
            <h2 className="font-display text-5xl text-white mb-4 uppercase">Tell Us About Your Project</h2>
            <p className="text-[#94A3B8] text-lg">Fill out the form and we'll create a custom development plan for you.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 md:p-12 border border-[rgba(74,108,247,0.2)]">

              {/* Project Type */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl text-white outline-none transition-all"
                  style={{
                    background: 'rgba(13,22,40,0.9)',
                    border: '1px solid rgba(74,108,247,0.3)',
                    color: '#fff',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4A6CF7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(74,108,247,0.3)'}
                >
                  <option value="" style={{ background: '#0D1628' }}>Select a project type</option>
                  <option value="web-design" style={{ background: '#0D1628' }}>Web Design</option>
                  <option value="mobile-app" style={{ background: '#0D1628' }}>Mobile App</option>
                  <option value="ecommerce" style={{ background: '#0D1628' }}>E-commerce</option>
                  <option value="custom" style={{ background: '#0D1628' }}>Custom Solution</option>
                </select>
              </div>

              {/* Budget */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white mb-4 uppercase tracking-wider">Budget Range</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'under-5k', label: 'Under $5,000' },
                    { value: '5k-15k', label: '$5,000 – $15,000' },
                    { value: '15k-50k', label: '$15,000 – $50,000' },
                    { value: 'over-50k', label: '$50,000+' },
                  ].map(option => (
                    <label key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${
                        formData.budget === option.value
                          ? 'border-[#4A6CF7] bg-[rgba(74,108,247,0.1)]'
                          : 'border-[rgba(74,108,247,0.2)] hover:border-[rgba(74,108,247,0.4)]'
                      }`}>
                      <input
                        type="radio"
                        name="budget"
                        value={option.value}
                        checked={formData.budget === option.value}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 accent-[#4A6CF7]"
                      />
                      <span className="text-[#94A3B8] text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'rgba(13,22,40,0.9)', border: '1px solid rgba(74,108,247,0.3)', color: '#fff' }}
                >
                  <option value="" style={{ background: '#0D1628' }}>Select timeline</option>
                  <option value="1-month" style={{ background: '#0D1628' }}>1 Month</option>
                  <option value="2-months" style={{ background: '#0D1628' }}>2 Months</option>
                  <option value="3-months" style={{ background: '#0D1628' }}>3 Months</option>
                  <option value="6-months" style={{ background: '#0D1628' }}>6 Months</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">Project Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project goals, requirements, and vision..."
                  className="w-full px-4 py-3 rounded-xl resize-none outline-none"
                  style={{ background: 'rgba(13,22,40,0.9)', border: '1px solid rgba(74,108,247,0.3)', color: '#fff' }}
                />
              </div>

              {/* Contact */}
              <div className="border-t border-[rgba(74,108,247,0.2)] pt-8 mb-8">
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ background: 'rgba(13,22,40,0.9)', border: '1px solid rgba(74,108,247,0.3)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{ background: 'rgba(13,22,40,0.9)', border: '1px solid rgba(74,108,247,0.3)', color: '#fff' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 99999 99999"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{ background: 'rgba(13,22,40,0.9)', border: '1px solid rgba(74,108,247,0.3)', color: '#fff' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="gold-btn w-full justify-center px-8 py-4 text-lg font-bold"
              >
                Submit Requirements →
              </button>
            </form>
          ) : (
            <div className="glass rounded-2xl p-12 text-center border border-[rgba(74,108,247,0.3)]">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.4)] flex items-center justify-center text-4xl mx-auto mb-6">
                ✓
              </div>
              <h3 className="font-display text-4xl text-white mb-3 uppercase">Requirements Received!</h3>
              <p className="text-[#94A3B8] text-lg mb-8">
                Our team will review your project details and contact you within 24 hours.
              </p>
              <Link href="/" className="gold-btn px-8 py-3 font-bold">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* What We Build */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="blue-orb w-[400px] h-[400px] right-0 bottom-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Capabilities</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">What We Build</h2>
            <p className="text-[#94A3B8] text-lg">Full-stack development solutions for modern brands</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🖥️', title: 'Responsive Web Design', description: 'Beautiful, fast websites that work on all devices and convert visitors.' },
              { icon: '⚙️', title: 'Full-Stack Development', description: 'Custom backends, APIs, and databases built for scale.' },
              { icon: '📱', title: 'Mobile App Development', description: 'Native and cross-platform mobile solutions for iOS and Android.' },
              { icon: '🛒', title: 'E-commerce Solutions', description: 'Online stores optimized for conversions and seamless checkout.' },
              { icon: '☁️', title: 'Cloud Integration', description: 'Scalable infrastructure and deployment on AWS, GCP, or Azure.' },
              { icon: '⚡', title: 'Performance Optimization', description: 'Lightning-fast load times and smooth interactions for maximum retention.' },
            ].map((service, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-2xl mb-5">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="blue-orb w-[400px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-6 uppercase">
            Need a Website<br /><span className="gradient-text">That Converts?</span>
          </h2>
          <p className="text-[#94A3B8] text-xl mb-10">
            Check out our Instagram Reels service to complement your digital presence.
          </p>
          <Link href="/services/instagram-reels" className="gold-btn px-12 py-4 text-lg font-bold">
            Explore Content Services →
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

export default DevelopmentPage;
