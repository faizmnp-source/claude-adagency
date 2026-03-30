'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CSLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="38" rx="8" stroke="#4A6CF7" strokeWidth="1.5" fill="rgba(74,108,247,0.08)" />
    <text x="5" y="27" fontFamily="Bebas Neue, sans-serif" fontSize="22" fill="#4A6CF7" letterSpacing="1">CS</text>
    <polygon points="30,20 37,14 37,26" fill="#F59E0B" />
    <circle cx="30" cy="20" r="1.5" fill="#F59E0B" />
  </svg>
);

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#050B18', color: '#fff' }}>

      {/* ── NAV ── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#050B18]/95 backdrop-blur-md border-b border-[rgba(74,108,247,0.2)] shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <CSLogo size={40} />
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-white">thecraft</span>
                <span className="font-bold text-lg" style={{ color: '#F59E0B' }}>studios</span>
                <span className="font-bold text-lg text-white">.in</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {[
                { href: '/services/instagram-reels', label: 'Reels' },
                { href: '/services/development', label: 'Development' },
                { href: '/services/branding', label: 'Branding' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm tracking-wide">
                  {label}
                </Link>
              ))}
              <Link href="/contact"
                className="gold-btn px-5 py-2 text-sm font-bold">
                Get Started
              </Link>
            </nav>

            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[rgba(74,108,247,0.2)]" style={{ background: '#0D1628' }}>
            <div className="px-4 py-4 flex flex-col gap-4">
              {[
                { href: '/services/instagram-reels', label: 'Reels' },
                { href: '/services/development', label: 'Development' },
                { href: '/services/branding', label: 'Branding' },
                { href: '/contact', label: 'Get Started' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-[#94A3B8] hover:text-white transition-colors font-medium"
                  onClick={() => setMobileOpen(false)}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden space-bg circuit-bg">
        {/* Glow orbs */}
        <div className="blue-orb w-[600px] h-[600px] -top-32 -left-32 opacity-60"></div>
        <div className="gold-orb w-[400px] h-[400px] top-1/4 right-0 opacity-50"></div>
        <div className="blue-orb w-[300px] h-[300px] bottom-0 left-1/2 opacity-40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="slide-up">
              <div className="badge mb-6">
                <span className="w-2 h-2 rounded-full bg-[#4A6CF7] animate-pulse"></span>
                #1 Reels Agency in India
              </div>

              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-none mb-6 uppercase">
                <span className="text-white">We Create</span><br />
                <span className="gradient-text">Content That</span><br />
                <span className="text-white">Goes Viral</span>
              </h1>

              <p className="text-[#94A3B8] text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
                Professional Instagram Reels, auto-posting, web design & app development —
                everything your brand needs to dominate social media.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services/instagram-reels" className="gold-btn px-8 py-4 text-base font-bold">
                  Start Creating Reels →
                </Link>
                <Link href="/contact" className="ghost-btn px-8 py-4 text-base font-semibold">
                  Book a Free Call
                </Link>
              </div>
            </div>

            {/* Hero visual — CS logo + floating stats */}
            <div className="hidden lg:flex flex-col items-center justify-center relative">
              <div className="float">
                <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="276" height="276" rx="40" stroke="#4A6CF7" strokeWidth="2"
                    fill="rgba(74,108,247,0.06)" strokeDasharray="8 4" />
                  {/* Circuit lines */}
                  <line x1="40" y1="140" x2="100" y2="140" stroke="#4A6CF7" strokeWidth="1" opacity="0.4" />
                  <line x1="100" y1="140" x2="100" y2="80" stroke="#4A6CF7" strokeWidth="1" opacity="0.4" />
                  <circle cx="40" cy="140" r="3" fill="#4A6CF7" opacity="0.6" />
                  <circle cx="100" cy="80" r="3" fill="#F59E0B" opacity="0.8" />
                  <line x1="240" y1="140" x2="180" y2="140" stroke="#4A6CF7" strokeWidth="1" opacity="0.4" />
                  <line x1="180" y1="140" x2="180" y2="200" stroke="#4A6CF7" strokeWidth="1" opacity="0.4" />
                  <circle cx="240" cy="140" r="3" fill="#4A6CF7" opacity="0.6" />
                  <circle cx="180" cy="200" r="3" fill="#F59E0B" opacity="0.8" />
                  {/* CS Text */}
                  <text x="52" y="168" fontFamily="Bebas Neue, sans-serif" fontSize="100" fill="#4A6CF7" opacity="0.9"
                    letterSpacing="4">CS</text>
                  {/* Play arrow */}
                  <polygon points="210,140 255,112 255,168" fill="#F59E0B" opacity="0.9" />
                  <polygon points="210,140 255,112 255,168" fill="url(#goldGrad)" opacity="0.9" />
                  <defs>
                    <linearGradient id="goldGrad" x1="210" y1="112" x2="255" y2="168" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating stat badges */}
              <div className="absolute top-4 -left-4 glass px-4 py-3 rounded-xl text-center pulse-blue">
                <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>500+</div>
                <div className="text-xs text-[#94A3B8]">Reels Made</div>
              </div>
              <div className="absolute bottom-8 -right-4 glass px-4 py-3 rounded-xl text-center">
                <div className="text-2xl font-bold" style={{ color: '#4A6CF7' }}>10M+</div>
                <div className="text-xs text-[#94A3B8]">Views Generated</div>
              </div>
              <div className="absolute bottom-24 -left-8 glass px-4 py-3 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-xs text-[#94A3B8]">Client Retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94A3B8] text-xs z-10">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#4A6CF7] to-transparent"></div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-12 border-y border-[rgba(74,108,247,0.15)]" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Reels Created' },
              { value: '10M+', label: 'Views Generated' },
              { value: '98%', label: 'Client Retention' },
              { value: '24h', label: 'Avg Turnaround' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-[#94A3B8]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg">
        <div className="blue-orb w-[400px] h-[400px] right-0 top-0 opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">What We Do</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Our Services</h2>
            <div className="blue-line mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured — Reels */}
            <div className="lg:col-span-2 glass glass-hover p-8 md:p-10 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,108,247,0.08)] to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.3)] rounded-full px-4 py-1.5 text-sm font-semibold text-[#7C9DFF] mb-6">
                  ⭐ Most Popular
                </div>
                <h3 className="font-display text-4xl md:text-5xl text-white mb-4 uppercase">
                  Instagram Reels &<br />
                  <span className="gradient-text">Auto Posting</span>
                </h3>
                <p className="text-[#94A3B8] text-lg mb-8 leading-relaxed">
                  From viral concept to auto-posting on Instagram — we handle everything.
                  Professional scripts, cinematic editing, trending audio, hashtag strategy.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {['Professional scripts', 'High-quality filming', 'Trending music & effects', 'Auto-posting to Instagram', 'Hashtag strategy', 'Performance analytics'].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span className="text-[#4A6CF7] font-bold">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/services/instagram-reels" className="gold-btn px-6 py-3 font-bold">
                  Explore Service →
                </Link>
              </div>
              <div className="absolute bottom-4 right-4 text-[120px] opacity-5 font-display leading-none">▶</div>
            </div>

            {/* Sidebar services */}
            <div className="flex flex-col gap-6">
              <div className="glass glass-hover p-8 rounded-2xl flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(74,108,247,0.05)] rounded-full blur-2xl"></div>
                <div className="w-12 h-12 rounded-xl bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-2xl mb-5">
                  💻
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Web & App Design</h3>
                <p className="text-[#94A3B8] text-sm mb-5 leading-relaxed">
                  Custom websites and mobile apps built to convert visitors into customers.
                </p>
                <Link href="/services/development" className="text-[#4A6CF7] text-sm font-semibold hover:text-[#7C9DFF] transition-colors">
                  Learn more →
                </Link>
              </div>
              <div className="glass glass-hover p-8 rounded-2xl flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(245,158,11,0.05)] rounded-full blur-2xl"></div>
                <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center text-2xl mb-5">
                  🎨
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Branding & Growth</h3>
                <p className="text-[#94A3B8] text-sm mb-5 leading-relaxed">
                  Build a brand identity that gets remembered and a strategy that drives growth.
                </p>
                <Link href="/services/branding" className="text-[#F59E0B] text-sm font-semibold hover:text-[#FCD34D] transition-colors">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">The Process</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">How It Works</h2>
            <p className="text-[#94A3B8] text-lg">From idea to viral — four simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[rgba(74,108,247,0.4)] to-transparent"></div>

            {[
              { step: '01', icon: '💡', title: 'Concept', desc: 'We brainstorm viral ideas tailored to your brand and audience.' },
              { step: '02', icon: '📝', title: 'Script', desc: 'Professional scripts optimized for maximum engagement and hooks.' },
              { step: '03', icon: '🎬', title: 'Film & Edit', desc: 'High-quality production with trending effects, music & captions.' },
              { step: '04', icon: '🚀', title: 'Auto-Post', desc: 'Scheduled posting at peak times with optimized hashtags.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="w-20 h-20 rounded-2xl glass border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-3xl mx-auto mb-5 relative z-10 group-hover:border-[#4A6CF7] transition-colors">
                  {item.icon}
                </div>
                <div className="text-[#F59E0B] font-bold text-sm tracking-widest mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO SHOWCASE ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="gold-orb w-[500px] h-[500px] left-0 top-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Portfolio</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Our Work</h2>
            <p className="text-[#94A3B8] text-lg">Reels that actually went viral</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-[9/16] glass rounded-2xl overflow-hidden group cursor-pointer border border-[rgba(74,108,247,0.2)] hover:border-[rgba(74,108,247,0.5)] transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(74,108,247,0.1)] to-[rgba(5,11,24,0.8)] flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[rgba(245,158,11,0.9)] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    ▶
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-[#94A3B8] mb-1">Coming soon</div>
                  <div className="text-sm font-semibold text-white">Reel #{i}</div>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-[rgba(245,158,11,0.9)] text-[#050B18] text-xs font-bold px-2 py-1 rounded-full">
                    1M+ views
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-[#94A3B8] text-sm mb-6">
              📹 Upload your video links here — we support YouTube embeds, MP4, or Cloudinary URLs.
            </p>
            <Link href="/contact" className="ghost-btn px-8 py-3 font-semibold">
              See Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0A1020' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Social Proof</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">What Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Aryan Singh',
                role: 'Fashion Brand Owner',
                quote: 'TheCraftStudios took us from 5K to 50K followers in 3 months. The reels they create are absolutely fire.',
                growth: '+900%',
              },
              {
                name: 'Priya Sharma',
                role: 'Beauty Influencer',
                quote: 'I went from 10K to 100K followers. Their auto-posting feature is a game changer — I never miss peak hours.',
                growth: '+900%',
              },
              {
                name: 'Rahul Mehta',
                role: 'E-commerce Store',
                quote: 'Not only did our followers grow, our sales went up 3x. The content strategy they built for us is next level.',
                growth: '+1150%',
              },
            ].map((t, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl relative">
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: '#F59E0B' }}>★</span>
                  ))}
                </div>
                <p className="text-[#94A3B8] text-base mb-6 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-[#94A3B8]">{t.role}</div>
                  </div>
                  <div className="text-xl font-bold" style={{ color: '#F59E0B' }}>{t.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="blue-orb w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-6 uppercase leading-none">
            Ready to<br />
            <span className="gradient-text">Go Viral?</span>
          </h2>
          <p className="text-[#94A3B8] text-xl mb-10 max-w-2xl mx-auto">
            Join 100+ brands already creating viral content with TheCraftStudios.
            Let's build your presence today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="gold-btn px-10 py-4 text-lg font-bold">
              Start Your Journey →
            </Link>
            <Link href="/services/instagram-reels" className="ghost-btn px-10 py-4 text-lg font-semibold">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(74,108,247,0.15)]" style={{ background: '#050B18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <CSLogo size={36} />
                <div>
                  <span className="font-bold text-white">thecraft</span>
                  <span className="font-bold" style={{ color: '#F59E0B' }}>studios</span>
                  <span className="font-bold text-white">.in</span>
                </div>
              </Link>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Creating viral content and digital solutions for brands that want to dominate social media.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Services</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/services/instagram-reels', label: 'Instagram Reels' },
                  { href: '/services/development', label: 'Web Development' },
                  { href: '/services/branding', label: 'Branding' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-[#94A3B8] hover:text-[#4A6CF7] transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Company</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/contact', label: 'Contact' },
                  { href: '#', label: 'About' },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="text-[#94A3B8] hover:text-[#4A6CF7] transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:hello@thecraftstudios.in" className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors">
                    hello@thecraftstudios.in
                  </a>
                </li>
                <li>
                  <a href="tel:+919999999999" className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors">
                    +91 99999 99999
                  </a>
                </li>
              </ul>
              <div className="flex gap-3 mt-6">
                {['f', '@', 'in'].map((icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 rounded-lg border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-sm text-[#4A6CF7] hover:bg-[rgba(74,108,247,0.15)] hover:border-[#4A6CF7] transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[rgba(74,108,247,0.1)] pt-8 text-center">
            <p className="text-[#94A3B8] text-sm">
              &copy; 2024 TheCraftStudios. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
