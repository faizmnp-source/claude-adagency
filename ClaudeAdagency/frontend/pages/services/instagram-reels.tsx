'use client';

import Link from 'next/link';

const CSLogo = ({ size = 40 }: { size?: number }) => (
  <img src="/image.png" alt="CS" width={size} height={size} style={{ objectFit: 'contain' }} />
);

const NAV_LINKS = [
  { href: '/services/instagram-reels', label: 'Reels & Branding' },
  { href: '/services/development', label: 'Web & App' },
  { href: '/services/software', label: 'AI & Software' },
];

const InstagramReelsPage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#050B18', color: '#fff' }}>
      <header className="fixed top-0 w-full z-50 bg-[#050B18]/95 backdrop-blur-md border-b border-[rgba(74,108,247,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <CSLogo size={40} />
              <div className="hidden sm:block">
                <span className="font-bold text-white">thecraft</span>
                <span className="font-bold" style={{ color: '#F59E0B' }}>studios</span>
                <span className="font-bold text-white">.in</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm">{label}</Link>
              ))}
              <Link href="/contact" className="gold-btn px-5 py-2 text-sm font-bold">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden space-bg circuit-bg">
        <div className="blue-orb w-[600px] h-[600px] -top-32 left-1/2 -translate-x-1/2 opacity-40"></div>
        <div className="gold-orb w-[300px] h-[300px] top-20 right-0 opacity-40"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="badge mb-6 mx-auto inline-flex">
            <span className="w-2 h-2 rounded-full bg-[#4A6CF7] animate-pulse"></span>
            Instagram Reels & Branding
          </div>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-6 uppercase leading-none">
            Reels That<br /><span className="gradient-text">Actually Go Viral</span>
          </h1>
          <p className="text-[#94A3B8] text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Professional Instagram reels, brand identity & auto-posting. From concept to your feed —
            we handle everything so your brand dominates social media.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="gold-btn px-10 py-4 text-lg font-bold">Book Your Reels</Link>
            <Link href="#pricing" className="ghost-btn px-10 py-4 text-lg font-semibold">View Pricing</Link>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            {[{ value: '500+', label: 'Reels Created' }, { value: '10M+', label: 'Views Generated' }, { value: '3x', label: 'Avg Engagement Boost' }].map((s, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="text-2xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-[#94A3B8]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Deliver */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge mb-6 inline-flex">What You Get</div>
              <h2 className="font-display text-5xl text-white mb-8 uppercase">What We Deliver</h2>
              <ul className="space-y-4">
                {[
                  'Professional scriptwriting tailored to your brand',
                  'High-quality video production and filming',
                  'Expert editing with trending music & effects',
                  'Hashtag strategy and growth optimization',
                  'Auto-posting to Instagram at peak times',
                  'Performance analytics and monthly insights',
                  'Brand identity design & visual guidelines',
                  'Community management & DM handling',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.4)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#4A6CF7] text-xs font-bold">✓</span>
                    </div>
                    <span className="text-[#94A3B8] text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl p-12 text-center relative overflow-hidden">
                <div className="blue-orb w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                <div className="relative z-10">
                  <div className="text-8xl mb-6">🎬</div>
                  <p className="text-white text-xl font-bold mb-2">Professional Content Creation</p>
                  <p className="text-[#94A3B8]">From concept to viral in 48 hours</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 glass px-5 py-3 rounded-xl border border-[rgba(245,158,11,0.3)]">
                <div className="text-xl font-bold" style={{ color: '#F59E0B' }}>48hrs</div>
                <div className="text-xs text-[#94A3B8]">Turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="gold-orb w-[400px] h-[400px] right-0 top-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">The Process</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Our Process</h2>
            <p className="text-[#94A3B8] text-lg">Four steps from concept to viral content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[rgba(74,108,247,0.4)] to-transparent"></div>
            {[
              { step: '01', icon: '💡', title: 'Concept', desc: 'We brainstorm viral-worthy ideas tailored to your brand and niche.' },
              { step: '02', icon: '📝', title: 'Script', desc: 'Professional scripts with strong hooks optimized for engagement.' },
              { step: '03', icon: '🎬', title: 'Film & Edit', desc: 'High-quality production with trending effects and music.' },
              { step: '04', icon: '🚀', title: 'Auto-Post', desc: 'Scheduled at peak times with optimized hashtags.' },
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

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0A1020' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Pricing</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Simple Pricing</h2>
            <p className="text-[#94A3B8] text-lg">Choose the plan that fits your growth goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: '$999', period: '/month', features: ['3 reels per month', 'Basic editing', 'Trending music', 'Standard hashtags', 'Monthly analytics'], highlighted: false },
              { name: 'Growth', price: '$1,999', period: '/month', features: ['8 reels per month', 'Professional editing', 'Trending audio optimization', 'Hashtag strategy', 'Weekly analytics', 'Community engagement'], highlighted: true },
              { name: 'Viral', price: '$2,999', period: '/month', features: ['15 reels per month', 'Custom scripts', 'Premium editing & effects', 'Advanced hashtag strategy', 'Daily analytics', 'Full growth management', 'Priority support'], highlighted: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 relative overflow-hidden ${plan.highlighted ? 'bg-gradient-to-b from-[#4A6CF7] to-[#3B5BDB] border-2 border-[#4A6CF7] transform scale-105 shadow-[0_0_60px_rgba(74,108,247,0.4)]' : 'glass border border-[rgba(74,108,247,0.2)]'}`}>
                {plan.highlighted && <div className="absolute top-4 right-4 bg-[rgba(255,255,255,0.2)] rounded-full px-3 py-1 text-xs font-bold text-white">Most Popular</div>}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'gradient-text'}`}>{plan.price}</span>
                  <span className={plan.highlighted ? 'text-blue-100' : 'text-[#94A3B8]'}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className={`flex-shrink-0 font-bold ${plan.highlighted ? 'text-[#FCD34D]' : 'text-[#4A6CF7]'}`}>✓</span>
                      <span className={plan.highlighted ? 'text-blue-50' : 'text-[#94A3B8]'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${plan.highlighted ? 'bg-white text-[#4A6CF7] hover:bg-[#FCD34D] hover:text-[#050B18]' : 'gold-btn w-full justify-center'}`}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="blue-orb w-[400px] h-[400px] left-0 top-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Results</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { brand: 'Fashion Brand X', before: '5K followers', after: '50K followers', growth: '+900%', time: '3 months' },
              { brand: 'Beauty Influencer', before: '10K followers', after: '100K followers', growth: '+900%', time: '4 months' },
              { brand: 'E-commerce Store', before: '2K followers', after: '25K followers', growth: '+1,150%', time: '2 months' },
            ].map((study, i) => (
              <div key={i} className="glass glass-hover rounded-2xl p-8 relative overflow-hidden">
                <div className="blue-orb w-48 h-48 right-0 bottom-0 opacity-30"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-6">{study.brand}</h3>
                  <div className="space-y-4 mb-6">
                    <div><p className="text-[#94A3B8] text-xs mb-1 uppercase tracking-wider">Before</p><p className="text-2xl font-bold text-[#94A3B8]">{study.before}</p></div>
                    <div className="h-px bg-gradient-to-r from-[#4A6CF7] to-transparent"></div>
                    <div><p className="text-[#94A3B8] text-xs mb-1 uppercase tracking-wider">After {study.time}</p><p className="text-2xl font-bold text-white">{study.after}</p></div>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] rounded-full px-4 py-2">
                    <span className="text-xl font-bold" style={{ color: '#F59E0B' }}>{study.growth}</span>
                    <span className="text-[#94A3B8] text-sm">growth</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="blue-orb w-[400px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-6 uppercase">Ready to Create<br /><span className="gradient-text">Viral Content?</span></h2>
          <p className="text-[#94A3B8] text-xl mb-10">Let's turn your brand story into engaging, viral-worthy Instagram reels.</p>
          <Link href="/contact" className="gold-btn px-12 py-4 text-lg font-bold">Book Your Reels Today →</Link>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-[rgba(74,108,247,0.15)]" style={{ background: '#050B18' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#94A3B8] text-sm">&copy; 2024 TheCraftStudios. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="mailto:info@thecraftstudios.in" className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors">info@thecraftstudios.in</a>
            <a href="tel:+917760501116" className="text-[#94A3B8] hover:text-[#F59E0B] transition-colors">+91 77605 01116</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InstagramReelsPage;
