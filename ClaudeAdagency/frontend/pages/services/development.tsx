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

const DevelopmentPage = () => {
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
        <div className="blue-orb w-[500px] h-[500px] -top-32 right-0 opacity-40"></div>
        <div className="gold-orb w-[300px] h-[300px] bottom-0 left-0 opacity-30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="badge mb-6 mx-auto inline-flex">Web, Mobile & App Development</div>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-6 uppercase leading-none">
            Web & App<br /><span className="gradient-text">That Converts</span>
          </h1>
          <p className="text-[#94A3B8] text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Custom websites, Android & iOS apps — built to look great, load fast, and turn
            visitors into paying customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="gold-btn px-10 py-4 text-lg font-bold">Start Your Project →</Link>
            <Link href="/services/software" className="ghost-btn px-10 py-4 text-lg font-semibold">
              Need AI / SaaS? →
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">What We Build</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Our Development Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🖥️', color: '#4A6CF7', title: 'Website Design & Development', items: ['Landing pages', 'Corporate websites', 'Portfolio sites', 'Custom CMS'], desc: 'Responsive, fast-loading websites that look stunning on every device and are built to convert.' },
              { icon: '📱', color: '#F59E0B', title: 'Android & iOS App Development', items: ['Native Android apps', 'Native iOS apps', 'Cross-platform (React Native)', 'App Store submission'], desc: 'Mobile-first apps built for performance, designed for user delight and business growth.' },
              { icon: '🛒', color: '#4A6CF7', title: 'E-commerce Solutions', items: ['Online stores', 'Payment integration', 'Inventory management', 'Order tracking'], desc: 'Complete e-commerce platforms with seamless checkout optimized for maximum conversions.' },
            ].map((s, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)` }}></div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 relative" style={{ background: `${s.color}15`, border: `1px solid ${s.color}40` }}>{s.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-[#94A3B8] text-sm mb-5 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span className="font-bold" style={{ color: s.color }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Software/SaaS CTA card */}
          <div className="mt-10 glass rounded-2xl p-8 border border-[rgba(245,158,11,0.3)] relative overflow-hidden">
            <div className="gold-orb w-64 h-64 right-0 top-0 opacity-30"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="badge mb-4 inline-flex" style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.1)' }}>🤖 Also Building</div>
                <h3 className="font-display text-3xl text-white mb-3 uppercase">Need AI Automations or SaaS?</h3>
                <p className="text-[#94A3B8] max-w-xl">We also build AI-powered SaaS products, finance automation tools, sales CRMs, and custom software. Click below to explore our dedicated software page.</p>
              </div>
              <Link href="/services/software" className="gold-btn px-8 py-4 font-bold whitespace-nowrap flex-shrink-0">
                Explore AI & SaaS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="blue-orb w-[400px] h-[400px] right-0 top-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">How We Work</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Development Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[rgba(74,108,247,0.4)] to-transparent"></div>
            {[
              { step: '01', icon: '📋', title: 'Discovery', desc: 'We understand your goals, users, and requirements in detail.' },
              { step: '02', icon: '🎨', title: 'Design', desc: 'UI/UX wireframes and pixel-perfect designs for approval.' },
              { step: '03', icon: '⚙️', title: 'Build', desc: 'Full development with regular progress updates.' },
              { step: '04', icon: '🚀', title: 'Launch', desc: 'Testing, deployment, and post-launch support.' },
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

      {/* Tech Stack */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0A1020' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Tech Stack</div>
            <h2 className="font-display text-5xl text-white mb-4 uppercase">What We Use</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { category: 'Frontend', items: ['React / Next.js', 'React Native', 'TypeScript', 'Tailwind CSS'] },
              { category: 'Backend', items: ['Node.js', 'Python/FastAPI', 'Django', 'REST & GraphQL'] },
              { category: 'Mobile', items: ['React Native', 'Android (Kotlin)', 'iOS (Swift)', 'Flutter'] },
              { category: 'Cloud & DB', items: ['AWS / GCP', 'PostgreSQL', 'MongoDB', 'Redis'] },
            ].map((stack, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.2)]">
                <h4 className="text-[#4A6CF7] font-bold text-sm uppercase tracking-wider mb-4">{stack.category}</h4>
                <ul className="space-y-2">
                  {stack.items.map((item, j) => (
                    <li key={j} className="text-[#94A3B8] text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="blue-orb w-[400px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-6 uppercase">Ready to Build<br /><span className="gradient-text">Something Great?</span></h2>
          <p className="text-[#94A3B8] text-xl mb-10">Tell us about your project and we'll get back to you within 24 hours.</p>
          <Link href="/contact" className="gold-btn px-12 py-4 text-lg font-bold">Start Your Project →</Link>
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

export default DevelopmentPage;
