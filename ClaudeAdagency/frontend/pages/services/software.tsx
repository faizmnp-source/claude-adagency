'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const RED = '#E50914';
const RED_DIM = 'rgba(229,9,20,0.15)';

const SoftwarePage = () => {
  return (
    <>
      <Head>
        <title>AI Automations &amp; SaaS — TheCraftStudios</title>
        <meta name="description" content="Custom AI automations for finance, sales &amp; CRM. We build SaaS products, intelligent software, and web apps that scale with your business." />
        <meta property="og:title" content="AI Automations & SaaS — TheCraftStudios" />
        <meta property="og:description" content="Custom AI automations for finance, sales & CRM. Intelligent software and web apps that scale." />
        <meta property="og:url" content="https://www.thecraftstudios.in/services/software" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services/software" />
      </Head>

      <NavBar />

      <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

        {/* Hero */}
        <section style={{ paddingTop: '120px', paddingBottom: '80px', padding: '120px 16px 80px', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '24px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: RED, display: 'inline-block' }}></span>
              AI Automations &amp; SaaS Products
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 96px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.02em' }}>
              AI That Runs<br /><span style={{ color: RED }}>Your Business</span>
            </h1>
            <p style={{ color: '#888888', fontSize: '20px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Custom AI automations for finance, sales &amp; CRM. We build SaaS products, intelligent software,
              and web apps that scale with your business.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 40px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
                Discuss Your Project →
              </Link>
              <Link href="/services/development" style={{ border: `1px solid rgba(229,9,20,0.4)`, color: '#E8E8E8', padding: '16px 40px', borderRadius: '8px', fontWeight: 600, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
                ← Web &amp; App Dev
              </Link>
            </div>
          </div>
        </section>

        {/* AI Automations */}
        <section style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                AI Automations
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>
                Automate Everything
              </h2>
              <p style={{ color: '#888888', fontSize: '18px' }}>Let AI handle the repetitive work so your team focuses on growth</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px' }}>
              {[
                {
                  icon: '💰', title: 'Finance Automation',
                  desc: 'Automate invoicing, expense tracking, financial reporting, GST filing, and cash flow analysis with AI.',
                  items: ['Auto invoice generation', 'Expense categorization', 'Financial dashboards', 'GST/tax automation', 'Cash flow forecasting'],
                },
                {
                  icon: '📊', title: 'Sales & CRM Automation',
                  desc: 'AI-powered lead scoring, follow-up automation, pipeline management, and sales forecasting.',
                  items: ['Lead scoring & routing', 'Auto follow-up emails', 'Pipeline management', 'Sales forecasting', 'WhatsApp CRM integration'],
                },
                {
                  icon: '🤖', title: 'Custom AI Workflows',
                  desc: 'Build any automation — document processing, customer support bots, data extraction, report generation.',
                  items: ['AI chatbots & support', 'Document processing', 'Data extraction & ETL', 'Report auto-generation', 'API integrations'],
                },
              ].map((s, i) => (
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '24px', background: 'rgba(229,9,20,0.08)', border: `1px solid rgba(229,9,20,0.2)` }}>{s.icon}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{s.title}</h3>
                  <p style={{ color: '#888888', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>{s.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {s.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888888' }}>
                        <span style={{ color: RED, fontWeight: 700 }}>✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SaaS Products */}
        <section style={{ padding: '96px 16px', background: '#0A0A0A', position: 'relative' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                SaaS Products
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 7vw, 64px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '16px' }}>
                We Build SaaS
              </h2>
              <p style={{ color: '#888888', fontSize: '18px' }}>From idea to launched product — end-to-end SaaS development</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
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
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '32px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '20px' }}>{s.icon}</div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{s.title}</h3>
                  <p style={{ color: '#888888', marginBottom: '24px', lineHeight: 1.7 }}>{s.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {s.tags.map((tag, j) => (
                      <span key={j} style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, color: RED, background: 'rgba(229,9,20,0.08)', border: `1px solid rgba(229,9,20,0.2)` }}>
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
        <section style={{ padding: '96px 16px', background: '#111111' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                Our AI Stack
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 56px)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Powered By Top AI
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
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
                <div key={i} style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '30px', marginBottom: '12px' }}>{tool.icon}</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{tool.name}</div>
                  <div style={{ color: '#888888', fontSize: '12px' }}>{tool.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 16px', background: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 80px)', color: '#fff', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Let's Build Your<br /><span style={{ color: RED }}>AI-Powered Future</span>
            </h2>
            <p style={{ color: '#888888', fontSize: '20px', marginBottom: '40px' }}>Tell us your business problem — we'll build the AI solution that solves it.</p>
            <Link href="/contact" style={{ background: RED, color: '#fff', padding: '16px 48px', borderRadius: '8px', fontWeight: 700, fontSize: '18px', textDecoration: 'none', display: 'inline-block' }}>
              Start the Conversation →
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SoftwarePage;
