'use client';

import Link from 'next/link';

const CSLogo = ({ size = 36 }: { size?: number }) => (
  <img src="/image.png" alt="CS" width={size} height={size} style={{ objectFit: 'contain' }} />
);

const BrandingPage = () => {
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
              <Link href="/services/development" className="text-[#94A3B8] hover:text-white transition-colors font-medium text-sm">Development</Link>
              <Link href="/contact" className="gold-btn px-5 py-2 text-sm font-bold">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden space-bg circuit-bg">
        <div className="gold-orb w-[500px] h-[500px] -top-32 left-1/4 opacity-30"></div>
        <div className="blue-orb w-[400px] h-[400px] top-20 right-0 opacity-30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="badge mb-6 mx-auto inline-flex">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" style={{ background: '#F59E0B' }}></span>
            Branding & Social Media Growth
          </div>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-6 uppercase leading-none">
            Build a Brand<br />
            <span className="gradient-text">People Remember</span>
          </h1>
          <p className="text-[#94A3B8] text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Grow your Instagram channel with strategic planning, visual branding, and community management
            that turns followers into loyal customers.
          </p>
          <Link href="/contact" className="gold-btn px-10 py-4 text-lg font-bold">Start Growing Today →</Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Services</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Our Branding Services</h2>
            <p className="text-[#94A3B8] text-lg">Complete solutions for brand growth and management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Instagram Channel Strategy', color: '#4A6CF7', items: ['Content planning', 'Audience analysis', 'Growth roadmap'] },
              { icon: '🎨', title: 'Visual Branding Design', color: '#F59E0B', items: ['Logo design', 'Brand guidelines', 'Visual assets'] },
              { icon: '📅', title: 'Content Calendar Planning', color: '#4A6CF7', items: ['Monthly planning', 'Consistency strategy', 'Theme development'] },
              { icon: '💬', title: 'Community Management', color: '#F59E0B', items: ['Response management', 'Engagement tracking', 'DM handling'] },
              { icon: '🤝', title: 'Influencer Collaboration', color: '#4A6CF7', items: ['Outreach strategy', 'Partnership management', 'Campaign tracking'] },
              { icon: '📈', title: 'Analytics & Growth Tracking', color: '#F59E0B', items: ['Performance reports', 'Growth metrics', 'ROI analysis'] },
            ].map((service, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl"
                  style={{ background: `radial-gradient(circle, ${service.color}15 0%, transparent 70%)` }}></div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 relative"
                  style={{ background: `${service.color}15`, border: `1px solid ${service.color}40` }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <ul className="space-y-3">
                  {service.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-[#94A3B8] text-sm">
                      <span className="font-bold" style={{ color: service.color }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="blue-orb w-[500px] h-[500px] left-0 top-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Pricing</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Growth Packages</h2>
            <p className="text-[#94A3B8] text-lg">Flexible plans for growing your Instagram presence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Basic',
                price: '$499',
                period: '/month',
                features: ['Strategy session', '30-day plan', 'Monthly check-in', 'Growth recommendations'],
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$999',
                period: '/month',
                features: ['Full month management', 'Custom graphics', 'Weekly check-ins', 'Content calendar', 'Analytics reports'],
                highlighted: true,
              },
              {
                name: 'Premium',
                price: '$1,499',
                period: '/month',
                features: ['Daily posting', 'Engagement management', 'Custom graphics suite', 'Analytics & tracking', 'Community management', 'Priority support'],
                highlighted: false,
              },
            ].map((pkg, i) => (
              <div key={i} className={`rounded-2xl p-8 relative overflow-hidden ${
                pkg.highlighted
                  ? 'bg-gradient-to-b from-[#4A6CF7] to-[#3B5BDB] border-2 border-[#4A6CF7] transform scale-105 shadow-[0_0_60px_rgba(74,108,247,0.4)]'
                  : 'glass border border-[rgba(74,108,247,0.2)]'
              }`}>
                {pkg.highlighted && (
                  <div className="absolute top-4 right-4 bg-[rgba(255,255,255,0.2)] rounded-full px-3 py-1 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className={`text-5xl font-bold ${pkg.highlighted ? 'text-white' : 'gradient-text'}`}>{pkg.price}</span>
                  <span className={pkg.highlighted ? 'text-blue-100' : 'text-[#94A3B8]'}>{pkg.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className={`flex-shrink-0 font-bold ${pkg.highlighted ? 'text-[#FCD34D]' : 'text-[#4A6CF7]'}`}>✓</span>
                      <span className={pkg.highlighted ? 'text-blue-50' : 'text-[#94A3B8]'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${
                  pkg.highlighted
                    ? 'bg-white text-[#4A6CF7] hover:bg-[#FCD34D] hover:text-[#050B18]'
                    : 'gold-btn w-full justify-center'
                }`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0A1020' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Results</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Success Stories</h2>
            <p className="text-[#94A3B8] text-lg">Real results from brands we've helped grow</p>
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
                    <div>
                      <p className="text-[#94A3B8] text-xs mb-1 uppercase tracking-wider">Before</p>
                      <p className="text-2xl font-bold text-[#94A3B8]">{study.before}</p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-[#4A6CF7] to-transparent"></div>
                    <div>
                      <p className="text-[#94A3B8] text-xs mb-1 uppercase tracking-wider">After {study.time}</p>
                      <p className="text-2xl font-bold text-white">{study.after}</p>
                    </div>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="gold-orb w-[400px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-6 uppercase">
            Ready to Grow<br /><span className="gradient-text">Your Instagram?</span>
          </h2>
          <p className="text-[#94A3B8] text-xl mb-10">
            Let's create a strategy that turns followers into real business results.
          </p>
          <Link href="/contact" className="gold-btn px-12 py-4 text-lg font-bold">
            Start Your Growth Today →
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

export default BrandingPage;
