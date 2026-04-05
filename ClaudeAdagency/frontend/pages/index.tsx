'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ── CS Logo (image) ── */
const CSLogo = ({ size = 120 }: { size?: number }) => (
  <img src="/image.png" alt="CS" width={size} height={size} style={{ objectFit: 'contain' }} />
);
const CSLogoSmall = ({ size = 36 }: { size?: number }) => (
  <img src="/image.png" alt="CS" width={size} height={size} style={{ objectFit: 'contain' }} />
);

/* ── Bell icon ── */
const BellIcon = () => (
  <div className="notify-bell">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
);

const NAV_LINKS = [
  { href: '/studio', label: 'AI Studio' },
  { href: '/services/instagram-reels', label: 'Reels & Branding' },
  { href: '/services/development', label: 'Web & App' },
  { href: '/services/software', label: 'AI & Software' },
];

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

      {/* NAV */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#050B18]/95 backdrop-blur-md border-b border-[rgba(74,108,247,0.2)] shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <CSLogoSmall size={40} />
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-white">The Craft</span>
                <span className="font-bold text-lg" style={{ color: '#E040FB' }}> Studio</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm tracking-wide">
                  {label}
                </Link>
              ))}
              <Link href="/studio" className="neon-btn neon-btn-sm">Get Started</Link>
            </nav>

            <div className="flex items-center gap-3 md:hidden">
              <BellIcon />
              <button className="text-white" onClick={() => setMobileOpen(!mobileOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-[rgba(255,255,255,0.08)]" style={{ background: 'rgba(5,11,24,0.98)', backdropFilter: 'blur(20px)' }}>
            <div className="px-4 py-4 flex flex-col gap-4">
              {[...NAV_LINKS, { href: '/contact', label: 'Contact' }].map(({ href, label }) => (
                <Link key={href} href={href} className="text-[#94A3B8] hover:text-white transition-colors font-medium" onClick={() => setMobileOpen(false)}>{label}</Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════
          HERO — Figma Landing Design
          ══════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center nebula-bg">
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-16 max-w-lg mx-auto slide-up">

          {/* CS Logo */}
          <div className="logo-glow mb-8">
            <CSLogo size={160} />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The Craft Studio
          </h1>
          <p className="text-[#94A3B8] text-lg mb-8">
            Turn Products Into Viral Reels
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="feature-badge">⚡ AI Generated</span>
            <span className="feature-badge">🎬 Auto Reels</span>
            <span className="feature-badge">🚀 Auto Post</span>
          </div>

          {/* CTA Button — neon glow */}
          <Link href="/studio" className="neon-btn w-full max-w-xs mb-5">
            Start Creating
          </Link>

          {/* Login link */}
          <Link href="/login" className="text-[#94A3B8] text-sm hover:text-white transition-colors">
            Login
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-[rgba(255,255,255,0.06)]" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Reels Created' },
              { value: '10M+', label: 'Views Generated' },
              { value: '98%', label: 'Client Retention' },
              { value: '24h', label: 'Avg Turnaround' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold purple-gradient-text mb-1">{s.value}</div>
                <div className="text-sm text-[#94A3B8]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 SERVICE CARDS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative nebula-bg">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex" style={{ borderColor: 'rgba(123,46,255,0.3)', background: 'rgba(123,46,255,0.08)', color: '#C084FC' }}>What We Do</div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>Our Services</h2>
            <div className="h-0.5 w-20 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #7B2FFF, transparent)' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="glass glass-hover p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(123,46,255,0.06)] to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(123,46,255,0.12)] border border-[rgba(123,46,255,0.25)] flex items-center justify-center text-3xl mb-6">🎬</div>
                <div className="inline-flex items-center gap-2 bg-[rgba(123,46,255,0.08)] border border-[rgba(123,46,255,0.25)] rounded-full px-3 py-1 text-xs font-semibold text-[#C084FC] mb-4">⭐ Core Service</div>
                <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Reels &<br /><span className="purple-gradient-text">Branding</span></h3>
                <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed">Viral Instagram reels, auto-posting, brand strategy, visual identity & community management.</p>
                <ul className="space-y-2 mb-8">
                  {['Viral reel creation', 'Auto-posting to Instagram', 'Brand identity & logo', 'Content calendar'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span className="text-[#C084FC] font-bold">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/services/instagram-reels" className="neon-btn neon-btn-sm">Explore →</Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="glass glass-hover p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,108,247,0.06)] to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(74,108,247,0.12)] border border-[rgba(74,108,247,0.25)] flex items-center justify-center text-3xl mb-6">💻</div>
                <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Web & App<br /><span className="blue-gradient-text">Development</span></h3>
                <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed">Custom websites, Android & iOS apps built to convert visitors into paying customers.</p>
                <ul className="space-y-2 mb-8">
                  {['Responsive web design', 'Android & iOS apps', 'E-commerce solutions', 'Full-stack development'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span className="text-[#4A6CF7] font-bold">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/services/development" className="blue-btn px-6 py-3 font-bold text-sm">Explore →</Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="glass glass-hover p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(245,158,11,0.06)] to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.25)] flex items-center justify-center text-3xl mb-6">🤖</div>
                <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>AI & SaaS<br /><span style={{ color: '#F59E0B' }}>Automations</span></h3>
                <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed">AI-powered automations for finance, sales & CRM. Custom SaaS products and software solutions.</p>
                <ul className="space-y-2 mb-8">
                  {['Finance automation', 'Sales & CRM tools', 'Custom SaaS products', 'AI workflow builders'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span style={{ color: '#F59E0B' }} className="font-bold">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/services/software" className="ghost-btn px-6 py-3 font-bold text-sm border-[rgba(245,158,11,0.4)] hover:border-[#F59E0B] hover:text-[#F59E0B]">Explore →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex" style={{ borderColor: 'rgba(0,229,255,0.25)', background: 'rgba(0,229,255,0.06)', color: '#67E8F9' }}>The Process</div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>How It Works</h2>
            <p className="text-[#94A3B8] text-lg">From idea to viral — four simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(123,46,255,0.4), rgba(0,229,255,0.4), transparent)' }}></div>
            {[
              { step: '01', icon: '💡', title: 'Concept', desc: 'We brainstorm viral ideas tailored to your brand.' },
              { step: '02', icon: '📝', title: 'Script', desc: 'Professional scripts with strong hooks.' },
              { step: '03', icon: '🎬', title: 'Build', desc: 'High-quality production or development.' },
              { step: '04', icon: '🚀', title: 'Launch', desc: 'Auto-posting or deployment at peak performance.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 rounded-2xl glass border border-[rgba(123,46,255,0.25)] flex items-center justify-center text-3xl mx-auto mb-5 relative z-10 group-hover:border-[rgba(0,229,255,0.5)] transition-colors">{item.icon}</div>
                <div className="text-[#E040FB] font-bold text-sm tracking-widest mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative nebula-bg">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex" style={{ borderColor: 'rgba(224,64,251,0.25)', background: 'rgba(224,64,251,0.06)', color: '#E879F9' }}>Social Proof</div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>What Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Aryan Singh', role: 'Fashion Brand Owner', quote: 'TheCraftStudios took us from 5K to 50K followers in 3 months. The reels they create are absolutely fire.', growth: '+900%' },
              { name: 'Priya Sharma', role: 'Beauty Influencer', quote: 'I went from 10K to 100K followers. Their auto-posting feature is a game changer.', growth: '+900%' },
              { name: 'Rahul Mehta', role: 'E-commerce Store', quote: 'Not only did our followers grow, our sales went up 3x. The content strategy is next level.', growth: '+1150%' },
            ].map((t, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl">
                <div className="flex gap-1 mb-5">{[1,2,3,4,5].map(s => <span key={s} className="text-[#E040FB]">★</span>)}</div>
                <p className="text-[#94A3B8] text-base mb-6 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-[#94A3B8]">{t.role}</div>
                  </div>
                  <div className="text-xl font-bold text-[#E040FB]">{t.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="purple-orb w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Ready to<br /><span className="purple-gradient-text">Go Viral?</span>
          </h2>
          <p className="text-[#94A3B8] text-xl mb-10 max-w-2xl mx-auto">
            Join 100+ brands already winning with TheCraftStudios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio" className="neon-btn">Start Your Journey →</Link>
            <Link href="/services/instagram-reels" className="ghost-btn px-10 py-4 text-lg font-semibold">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(255,255,255,0.06)]" style={{ background: '#050B18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <CSLogoSmall size={36} />
                <div>
                  <span className="font-bold text-white">The Craft</span>
                  <span className="font-bold" style={{ color: '#E040FB' }}> Studio</span>
                </div>
              </Link>
              <p className="text-[#94A3B8] text-sm leading-relaxed">Creating viral content and digital solutions for brands that want to dominate.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/instagram-reels" className="text-[#94A3B8] hover:text-[#C084FC] transition-colors">Reels & Branding</Link></li>
                <li><Link href="/services/development" className="text-[#94A3B8] hover:text-[#C084FC] transition-colors">Web & App Dev</Link></li>
                <li><Link href="/services/software" className="text-[#94A3B8] hover:text-[#C084FC] transition-colors">AI & SaaS</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="text-[#94A3B8] hover:text-[#C084FC] transition-colors">Home</Link></li>
                <li><Link href="/studio" className="text-[#94A3B8] hover:text-[#C084FC] transition-colors">AI Studio</Link></li>
                <li><Link href="/contact" className="text-[#94A3B8] hover:text-[#C084FC] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="mailto:info@thecraftstudios.in" className="text-[#94A3B8] hover:text-[#E040FB] transition-colors">info@thecraftstudios.in</a></li>
                <li><a href="tel:+917760501116" className="text-[#94A3B8] hover:text-[#E040FB] transition-colors">+91 77605 01116</a></li>
              </ul>
              <div className="flex gap-3 mt-6">
                {['f', '@', 'in'].map((icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg border border-[rgba(123,46,255,0.25)] flex items-center justify-center text-sm text-[#C084FC] hover:bg-[rgba(123,46,255,0.12)] hover:border-[#7B2FFF] transition-all">{icon}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-8 text-center">
            <p className="text-[#94A3B8] text-sm">&copy; 2024 TheCraftStudios. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
