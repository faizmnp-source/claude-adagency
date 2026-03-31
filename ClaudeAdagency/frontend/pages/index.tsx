'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CSLogo = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGrad-h" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B8DEF"/><stop offset="60%" stopColor="#4A6CF7"/><stop offset="100%" stopColor="#7B5EA7"/>
      </linearGradient>
      <linearGradient id="goldGrad-h" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#D97706"/>
      </linearGradient>
      <linearGradient id="sGrad-h" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B8DEF"/><stop offset="50%" stopColor="#7B5EA7"/><stop offset="100%" stopColor="#F59E0B"/>
      </linearGradient>
    </defs>
    <path d="M28 10 C14 10 6 18 6 30 C6 42 14 50 28 50" stroke="url(#blueGrad-h)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    <circle cx="28" cy="10" r="2.5" fill="#5B8DEF"/><circle cx="15" cy="14" r="2" fill="#4A6CF7"/>
    <circle cx="6" cy="30" r="2.5" fill="#5B8DEF"/><circle cx="28" cy="50" r="2.5" fill="#5B8DEF"/>
    <path d="M38 14 C48 14 52 18 52 24 C52 30 44 30 38 30 C32 30 28 34 28 38 C28 44 32 46 42 46" stroke="url(#sGrad-h)" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <circle cx="38" cy="14" r="2" fill="#5B8DEF"/><circle cx="52" cy="24" r="2" fill="#7B5EA7"/>
    <circle cx="28" cy="38" r="2" fill="#E59830"/><circle cx="42" cy="46" r="2.5" fill="#F59E0B"/>
    <polygon points="53,22 62,30 53,38" fill="url(#goldGrad-h)"/>
  </svg>
);

const NAV_LINKS = [
  { href: '/studio', label: '🎬 AI Studio' },
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
              <CSLogo size={44} />
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-white">thecraft</span>
                <span className="font-bold text-lg" style={{ color: '#F59E0B' }}>studios</span>
                <span className="font-bold text-lg text-white">.in</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm tracking-wide">
                  {label}
                </Link>
              ))}
              <Link href="/contact" className="gold-btn px-5 py-2 text-sm font-bold">Get Started</Link>
            </nav>

            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-[rgba(74,108,247,0.2)]" style={{ background: '#0D1628' }}>
            <div className="px-4 py-4 flex flex-col gap-4">
              {[...NAV_LINKS, { href: '/contact', label: 'Get Started' }].map(({ href, label }) => (
                <Link key={href} href={href} className="text-[#94A3B8] hover:text-white transition-colors font-medium" onClick={() => setMobileOpen(false)}>{label}</Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden space-bg circuit-bg">
        <div className="blue-orb w-[600px] h-[600px] -top-32 -left-32 opacity-60"></div>
        <div className="gold-orb w-[400px] h-[400px] top-1/4 right-0 opacity-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="slide-up">
              <div className="badge mb-6">
                <span className="w-2 h-2 rounded-full bg-[#4A6CF7] animate-pulse"></span>
                Digital Agency — India
              </div>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-none mb-6 uppercase">
                <span className="text-white">We Create</span><br />
                <span className="gradient-text">Content That</span><br />
                <span className="text-white">Goes Viral</span>
              </h1>
              <p className="text-[#94A3B8] text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
                Instagram Reels, auto-posting, web & app development, AI automations —
                everything your brand needs to dominate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services/instagram-reels" className="gold-btn px-8 py-4 text-base font-bold">Start Creating Reels →</Link>
                <Link href="/contact" className="ghost-btn px-8 py-4 text-base font-semibold">Book a Free Call</Link>
              </div>
            </div>

            {/* Hero logo visual */}
            <div className="hidden lg:flex flex-col items-center justify-center relative">
              <div className="float">
                <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="heroBlue" x1="0" y1="0" x2="320" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#5B8DEF"/><stop offset="100%" stopColor="#4A6CF7"/>
                    </linearGradient>
                    <linearGradient id="heroGold" x1="0" y1="0" x2="320" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#D97706"/>
                    </linearGradient>
                    <linearGradient id="heroS" x1="0" y1="0" x2="320" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#5B8DEF"/><stop offset="50%" stopColor="#9B6EE7"/><stop offset="100%" stopColor="#F59E0B"/>
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="316" height="316" rx="40" stroke="#4A6CF7" strokeWidth="1.5" fill="rgba(74,108,247,0.05)" strokeDasharray="8 4" opacity="0.5"/>
                  {/* Hex decorations */}
                  <polygon points="270,50 280,56 280,70 270,76 260,70 260,56" stroke="#4A6CF7" strokeWidth="1" fill="none" opacity="0.3"/>
                  <polygon points="50,240 58,245 58,256 50,261 42,256 42,245" stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.3"/>
                  {/* C letter */}
                  <path d="M105 85 C62 85 38 107 38 160 C38 213 62 235 105 235" stroke="url(#heroBlue)" strokeWidth="14" fill="none" strokeLinecap="round"/>
                  <circle cx="105" cy="85" r="7" fill="#5B8DEF"/>
                  <circle cx="60" cy="102" r="5" fill="#4A6CF7"/>
                  <circle cx="40" cy="130" r="5" fill="#4A6CF7"/>
                  <circle cx="38" cy="160" r="7" fill="#5B8DEF"/>
                  <circle cx="40" cy="190" r="5" fill="#4A6CF7"/>
                  <circle cx="60" cy="218" r="5" fill="#4A6CF7"/>
                  <circle cx="105" cy="235" r="7" fill="#5B8DEF"/>
                  {/* S letter */}
                  <path d="M175 95 C215 95 235 110 235 135 C235 160 210 160 185 160 C160 160 140 175 140 195 C140 220 158 230 200 230" stroke="url(#heroS)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                  <circle cx="175" cy="95" r="6" fill="#5B8DEF"/>
                  <circle cx="215" cy="100" r="5" fill="#7B5EA7"/>
                  <circle cx="235" cy="135" r="6" fill="#9B6EE7"/>
                  <circle cx="210" cy="160" r="5" fill="#C88040"/>
                  <circle cx="185" cy="160" r="5" fill="#D99030"/>
                  <circle cx="160" cy="170" r="5" fill="#E59820"/>
                  <circle cx="140" cy="195" r="6" fill="#F59E0B"/>
                  <circle cx="145" cy="218" r="5" fill="#F59E0B"/>
                  <circle cx="200" cy="230" r="7" fill="#F59E0B"/>
                  {/* Play arrow > */}
                  <polygon points="248,128 285,160 248,192" fill="url(#heroGold)"/>
                  <circle cx="248" cy="128" r="4" fill="#FCD34D"/>
                  <circle cx="248" cy="192" r="4" fill="#D97706"/>
                </svg>
              </div>
              {/* Floating stats */}
              <div className="absolute top-4 -left-4 glass px-4 py-3 rounded-xl text-center pulse-blue">
                <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>500+</div>
                <div className="text-xs text-[#94A3B8]">Reels Made</div>
              </div>
              <div className="absolute bottom-8 -right-4 glass px-4 py-3 rounded-xl text-center">
                <div className="text-2xl font-bold" style={{ color: '#4A6CF7' }}>10M+</div>
                <div className="text-xs text-[#94A3B8]">Views</div>
              </div>
              <div className="absolute bottom-24 -left-8 glass px-4 py-3 rounded-xl text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-xs text-[#94A3B8]">Retention</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94A3B8] text-xs z-10">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#4A6CF7] to-transparent"></div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-[rgba(74,108,247,0.15)]" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Reels Created' },
              { value: '10M+', label: 'Views Generated' },
              { value: '98%', label: 'Client Retention' },
              { value: '24h', label: 'Avg Turnaround' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-sm text-[#94A3B8]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 SERVICE CARDS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg">
        <div className="blue-orb w-[400px] h-[400px] right-0 top-0 opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">What We Do</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Our Services</h2>
            <div className="blue-line mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="glass glass-hover p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,108,247,0.08)] to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-3xl mb-6">🎬</div>
                <div className="inline-flex items-center gap-2 bg-[rgba(74,108,247,0.1)] border border-[rgba(74,108,247,0.3)] rounded-full px-3 py-1 text-xs font-semibold text-[#7C9DFF] mb-4">⭐ Core Service</div>
                <h3 className="font-display text-3xl text-white mb-4 uppercase">Reels &<br /><span className="gradient-text">Branding</span></h3>
                <p className="text-[#94A3B8] text-sm mb-6 leading-relaxed">Viral Instagram reels, auto-posting, brand strategy, visual identity & community management.</p>
                <ul className="space-y-2 mb-8">
                  {['Viral reel creation', 'Auto-posting to Instagram', 'Brand identity & logo', 'Content calendar'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span className="text-[#4A6CF7] font-bold">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/services/instagram-reels" className="gold-btn px-6 py-3 font-bold text-sm">Explore →</Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="glass glass-hover p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(74,108,247,0.06)] to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-3xl mb-6">💻</div>
                <h3 className="font-display text-3xl text-white mb-4 uppercase">Web & App<br /><span className="gradient-text">Development</span></h3>
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
                <div className="w-14 h-14 rounded-2xl bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center text-3xl mb-6">🤖</div>
                <h3 className="font-display text-3xl text-white mb-4 uppercase">AI & SaaS<br /><span style={{ color: '#F59E0B' }}>Automations</span></h3>
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
            <div className="badge mb-4 mx-auto inline-flex">The Process</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">How It Works</h2>
            <p className="text-[#94A3B8] text-lg">From idea to viral — four simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[rgba(74,108,247,0.4)] to-transparent"></div>
            {[
              { step: '01', icon: '💡', title: 'Concept', desc: 'We brainstorm viral ideas tailored to your brand.' },
              { step: '02', icon: '📝', title: 'Script', desc: 'Professional scripts with strong hooks.' },
              { step: '03', icon: '🎬', title: 'Build', desc: 'High-quality production or development.' },
              { step: '04', icon: '🚀', title: 'Launch', desc: 'Auto-posting or deployment at peak performance.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 rounded-2xl glass border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-3xl mx-auto mb-5 relative z-10 group-hover:border-[#4A6CF7] transition-colors">{item.icon}</div>
                <div className="text-[#F59E0B] font-bold text-sm tracking-widest mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="gold-orb w-[500px] h-[500px] left-0 top-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Social Proof</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">What Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Aryan Singh', role: 'Fashion Brand Owner', quote: 'TheCraftStudios took us from 5K to 50K followers in 3 months. The reels they create are absolutely fire.', growth: '+900%' },
              { name: 'Priya Sharma', role: 'Beauty Influencer', quote: 'I went from 10K to 100K followers. Their auto-posting feature is a game changer — I never miss peak hours.', growth: '+900%' },
              { name: 'Rahul Mehta', role: 'E-commerce Store', quote: 'Not only did our followers grow, our sales went up 3x. The content strategy they built for us is next level.', growth: '+1150%' },
            ].map((t, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl">
                <div className="flex gap-1 mb-5">{[1,2,3,4,5].map(s => <span key={s} style={{ color: '#F59E0B' }}>★</span>)}</div>
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

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="blue-orb w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-6 uppercase leading-none">
            Ready to<br /><span className="gradient-text">Go Viral?</span>
          </h2>
          <p className="text-[#94A3B8] text-xl mb-10 max-w-2xl mx-auto">
            Join 100+ brands already winning with TheCraftStudios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="gold-btn px-10 py-4 text-lg font-bold">Start Your Journey →</Link>
            <Link href="/services/instagram-reels" className="ghost-btn px-10 py-4 text-lg font-semibold">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(74,108,247,0.15)]" style={{ background: '#050B18' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <CSLogo size={40} />
                <div>
                  <span className="font-bold text-white">thecraft</span>
                  <span className="font-bold" style={{ color: '#F59E0B' }}>studios</span>
                  <span className="font-bold text-white">.in</span>
                </div>
              </Link>
              <p className="text-[#94A3B8] text-sm leading-relaxed">Creating viral content and digital solutions for brands that want to dominate.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/instagram-reels" className="text-[#94A3B8] hover:text-[#4A6CF7] transition-colors">Reels & Branding</Link></li>
                <li><Link href="/services/development" className="text-[#94A3B8] hover:text-[#4A6CF7] transition-colors">Web & App Dev</Link></li>
                <li><Link href="/services/software" className="text-[#94A3B8] hover:text-[#4A6CF7] transition-colors">AI & SaaS</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="text-[#94A3B8] hover:text-[#4A6CF7] transition-colors">Home</Link></li>
                <li><Link href="/contact" className="text-[#94A3B8] hover:text-[#4A6CF7] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-widest uppercase">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="mailto:info@thecraftstudios.in" className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors">info@thecraftstudios.in</a></li>
                <li><a href="tel:+917760501116" className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors">+91 77605 01116</a></li>
              </ul>
              <div className="flex gap-3 mt-6">
                {['f', '@', 'in'].map((icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-sm text-[#4A6CF7] hover:bg-[rgba(74,108,247,0.15)] hover:border-[#4A6CF7] transition-all">{icon}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-[rgba(74,108,247,0.1)] pt-8 text-center">
            <p className="text-[#94A3B8] text-sm">&copy; 2024 TheCraftStudios. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
