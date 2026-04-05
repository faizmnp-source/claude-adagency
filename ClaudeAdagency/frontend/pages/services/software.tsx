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

const SoftwarePage = () => {
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
        <div className="blue-orb w-[500px] h-[500px] -top-32 left-0 opacity-40"></div>
        <div className="gold-orb w-[400px] h-[400px] bottom-0 right-0 opacity-30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="badge mb-6 mx-auto inline-flex" style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.1)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F59E0B' }}></span>
            AI Automations & SaaS Products
          </div>
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-white mb-6 uppercase leading-none">
            AI That Runs<br /><span style={{ color: '#F59E0B' }}>Your Business</span>
          </h1>
          <p className="text-[#94A3B8] text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Custom AI automations for finance, sales & CRM. We build SaaS products, intelligent software,
            and web apps that scale with your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="gold-btn px-10 py-4 text-lg font-bold">Discuss Your Project →</Link>
            <Link href="/services/development" className="ghost-btn px-10 py-4 text-lg font-semibold">← Web & App Dev</Link>
          </div>
        </div>
      </section>

      {/* AI Automations */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0D1628' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex" style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.1)' }}>AI Automations</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Automate Everything</h2>
            <p className="text-[#94A3B8] text-lg">Let AI handle the repetitive work so your team focuses on growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '💰', color: '#F59E0B', title: 'Finance Automation',
                desc: 'Automate invoicing, expense tracking, financial reporting, GST filing, and cash flow analysis with AI.',
                items: ['Auto invoice generation', 'Expense categorization', 'Financial dashboards', 'GST/tax automation', 'Cash flow forecasting'],
              },
              {
                icon: '📊', color: '#4A6CF7', title: 'Sales & CRM Automation',
                desc: 'AI-powered lead scoring, follow-up automation, pipeline management, and sales forecasting.',
                items: ['Lead scoring & routing', 'Auto follow-up emails', 'Pipeline management', 'Sales forecasting', 'WhatsApp CRM integration'],
              },
              {
                icon: '🤖', color: '#F59E0B', title: 'Custom AI Workflows',
                desc: 'Build any automation — document processing, customer support bots, data extraction, report generation.',
                items: ['AI chatbots & support', 'Document processing', 'Data extraction & ETL', 'Report auto-generation', 'API integrations'],
              },
            ].map((s, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)` }}></div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6" style={{ background: `${s.color}15`, border: `1px solid ${s.color}40` }}>{s.icon}</div>
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
        </div>
      </section>

      {/* SaaS Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative space-bg circuit-bg">
        <div className="blue-orb w-[500px] h-[500px] right-0 top-0 opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">SaaS Products</div>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">We Build SaaS</h2>
            <p className="text-[#94A3B8] text-lg">From idea to launched product — end-to-end SaaS development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '🏗️', title: 'Custom SaaS Development',
                desc: 'We build your SaaS from scratch — authentication, billing (Stripe/Razorpay), dashboards, multi-tenancy, and API infrastructure.',
                tags: ['Multi-tenant architecture', 'Stripe/Razorpay billing', 'User dashboards', 'Admin panels', 'REST APIs'],
              },
              {
                icon: '🌐', title: 'Web App Development',
                desc: 'Complex web applications with real-time features, role-based access, analytics, and custom workflows.',
                tags: ['Real-time features', 'Role-based access', 'Analytics dashboards', 'Custom workflows', 'Third-party integrations'],
              },
              {
                icon: '🔌', title: 'API & Integration Services',
                desc: 'Connect your tools — Zapier-style automations, WhatsApp Business API, payment gateways, ERP integrations.',
                tags: ['WhatsApp Business API', 'Payment gateways', 'ERP/CRM sync', 'Webhook automation', 'Data pipelines'],
              },
              {
                icon: '📈', title: 'Business Intelligence Tools',
                desc: 'Custom BI dashboards, KPI trackers, and automated reporting tools that give you real-time business visibility.',
                tags: ['KPI dashboards', 'Auto reports', 'Data visualization', 'Predictive analytics', 'Custom alerts'],
              },
            ].map((s, i) => (
              <div key={i} className="glass glass-hover p-8 rounded-2xl border border-[rgba(74,108,247,0.2)]">
                <div className="text-4xl mb-5">{s.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-[#94A3B8] mb-6 leading-relaxed">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag, j) => (
                    <span key={j} className="px-3 py-1 rounded-full text-xs font-semibold text-[#7C9DFF]" style={{ background: 'rgba(74,108,247,0.1)', border: '1px solid rgba(74,108,247,0.2)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools We Use */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#0A1020' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge mb-4 mx-auto inline-flex">Our AI Stack</div>
            <h2 className="font-display text-5xl text-white mb-4 uppercase">Powered By Top AI</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Claude / GPT-4', role: 'Intelligence & Reasoning', icon: '🧠' },
              { name: 'LangChain', role: 'AI Workflow Orchestration', icon: '🔗' },
              { name: 'Pinecone / Weaviate', role: 'Vector Search & RAG', icon: '🔍' },
              { name: 'n8n / Zapier', role: 'Automation Pipelines', icon: '⚡' },
              { name: 'Supabase / Firebase', role: 'Realtime Database', icon: '🗄️' },
              { name: 'Stripe / Razorpay', role: 'Payments & Billing', icon: '💳' },
              { name: 'AWS / GCP', role: 'Cloud Infrastructure', icon: '☁️' },
              { name: 'Python / FastAPI', role: 'AI Backend Services', icon: '🐍' },
            ].map((tool, i) => (
              <div key={i} className="glass rounded-2xl p-5 text-center border border-[rgba(74,108,247,0.2)] hover:border-[rgba(74,108,247,0.4)] transition-all">
                <div className="text-3xl mb-3">{tool.icon}</div>
                <div className="font-bold text-white text-sm mb-1">{tool.name}</div>
                <div className="text-[#94A3B8] text-xs">{tool.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #050B18 0%, #0D1628 50%, #050B18 100%)' }}>
        <div className="gold-orb w-[400px] h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-6 uppercase">
            Let's Build Your<br /><span style={{ color: '#F59E0B' }}>AI-Powered Future</span>
          </h2>
          <p className="text-[#94A3B8] text-xl mb-10">Tell us your business problem — we'll build the AI solution that solves it.</p>
          <Link href="/contact" className="gold-btn px-12 py-4 text-lg font-bold">Start the Conversation →</Link>
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

export default SoftwarePage;
