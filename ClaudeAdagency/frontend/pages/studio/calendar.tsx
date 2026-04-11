'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

/* ── Palette ── */
const BG     = '#050B18';
const BG2    = '#0A0F1E';
const BG3    = '#0D1628';
const R      = '#E50914';
const R_DIM  = 'rgba(229,9,20,0.15)';
const R_SOFT = 'rgba(229,9,20,0.08)';
const TEXT   = '#FFFFFF';
const MUTED  = '#94A3B8';
const BORDER = 'rgba(255,255,255,0.07)';

/* ── Content type config ── */
const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  viral_reel:        { label: 'Viral Reel',        color: '#E50914', bg: 'rgba(229,9,20,0.12)',   icon: '🔥' },
  top_reel:          { label: 'Top Reel',           color: '#A855F7', bg: 'rgba(168,85,247,0.12)', icon: '⭐' },
  educational_reel:  { label: 'Educational Reel',   color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: '📚' },
  product_photo:     { label: 'Product Photo',      color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: '📸' },
  educational_image: { label: 'Educational Image',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: '💡' },
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: '#3B82F6' },
  posted:    { label: 'Posted',    color: '#10B981' },
  failed:    { label: 'Failed',    color: '#EF4444' },
  pending:   { label: 'Draft',     color: '#94A3B8' },
};

/* ── Month view helpers ── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/* ── Types ── */
interface ContentPost {
  id: string;
  type: string;
  scheduledAt: string;
  title: string;
  angle: string;
  caption: string;
  hashtags: string[];
  contentPillar: string;
  status?: string;
  script?: string;
  imagePrompt?: string;
}

interface ContentPlan {
  planId: string;
  generatedAt: string;
  monthLabel: string;
  contentPlan: ContentPost[];
  brandName?: string;
}

function getAuthToken() {
  if (typeof window === 'undefined') return 'dev-token';
  return localStorage.getItem('cs_token') || 'dev-token';
}

const REEL_ENGINE = process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

export default function CalendarPage() {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [plan,      setPlan]      = useState<ContentPlan | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [selected,  setSelected]  = useState<ContentPost | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [view,      setView]      = useState<'calendar' | 'list'>('calendar');
  const [autoPilotEnabled, setAutoPilotEnabled] = useState<boolean | null>(null); // null = loading
  const [pauseLoading, setPauseLoading] = useState(false);

  /* ── Brand setup form ── */
  const [form, setForm] = useState({
    brandName: '', productDescription: '', industry: 'ecommerce',
    region: 'india', language: 'hinglish', targetAudience: 'Indian businesses 25-45',
    brandVoice: '',
  });
  const [showForm, setShowForm] = useState(false);

  /* ── Load existing plan + auto-pilot settings on mount ── */
  useEffect(() => {
    loadPlan();
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch(`${REEL_ENGINE}/api/auto/settings`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAutoPilotEnabled(data.autoPilotEnabled);
      }
    } catch {
      setAutoPilotEnabled(true); // default assume enabled
    }
  }

  async function toggleAutoPilot() {
    setPauseLoading(true);
    try {
      const endpoint = autoPilotEnabled ? '/api/auto/pause' : '/api/auto/resume';
      const res = await fetch(`${REEL_ENGINE}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (!res.ok) throw new Error('Failed to update auto-pilot');
      setAutoPilotEnabled(!autoPilotEnabled);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPauseLoading(false);
    }
  }

  async function loadPlan() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${REEL_ENGINE}/api/auto/plan`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.contentPlan) {
          setPlan(data);
          // Jump calendar to plan's month
          if (data.contentPlan.length > 0) {
            const d = new Date(data.contentPlan[0].scheduledAt);
            setViewYear(d.getFullYear());
            setViewMonth(d.getMonth());
          }
        } else {
          setShowForm(true);
        }
      } else {
        setShowForm(true);
      }
    } catch {
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  }

  async function generatePlan() {
    if (!form.brandName || !form.productDescription) {
      setError('Brand name and product description are required.');
      return;
    }
    setGenLoading(true);
    setError(null);
    try {
      const res = await fetch(`${REEL_ENGINE}/api/auto/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate plan');
      setPlan(data);
      setShowForm(false);
      if (data.contentPlan?.length > 0) {
        const d = new Date(data.contentPlan[0].scheduledAt);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenLoading(false);
    }
  }

  async function executePost(postId: string) {
    try {
      const res = await fetch(`${REEL_ENGINE}/api/auto/execute/${postId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (!res.ok) throw new Error('Failed to execute post');
      alert('Post queued for execution! Check back in a few minutes.');
      setSelected(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  /* ── Posts for current month view ── */
  const monthPosts = plan?.contentPlan?.filter(p => {
    const d = new Date(p.scheduledAt);
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  }) || [];

  /* ── Build calendar grid ── */
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWk = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: Array<{ day: number | null; posts: ContentPost[] }> = [];
  for (let i = 0; i < firstDayOfWk; i++) cells.push({ day: null, posts: [] });
  for (let d = 1; d <= daysInMonth; d++) {
    const posts = monthPosts.filter(p => new Date(p.scheduledAt).getDate() === d);
    cells.push({ day: d, posts });
  }

  /* ── Counts ── */
  const totalPosts = plan?.contentPlan?.length || 0;
  const postedCount = plan?.contentPlan?.filter(p => p.status === 'posted').length || 0;
  const thisMonthCount = monthPosts.length;

  return (
    <>
      <Head>
        <title>Content Calendar — TheCraftStudios</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="page-shell">
        <NavBar />

        <div className="editorial-grid" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <section className="editorial-card" style={{ padding: '28px', marginBottom: '28px' }}>
            <span className="section-chip">Studio Calendar</span>
            <h1 className="section-title" style={{ fontSize: '48px', marginTop: '16px', marginBottom: '12px' }}>
              Plan The Month, Review The Queue, <span className="text-accent">Post With Confidence</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '760px', marginBottom: '18px' }}>
              Calendar mode keeps your content pipeline visible in one place so approvals, timing, and auto-pilot
              decisions feel connected to the rest of the studio experience.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/studio" className="cta-secondary">Back To Studio</Link>
              <Link href="/studio/credits" className="cta-secondary">Manage Credits</Link>
            </div>
          </section>

          <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: "'Space Grotesk', sans-serif", borderRadius: '28px', overflow: 'hidden', border: `1px solid ${BORDER}` }}>

        {/* ── Header ── */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, background: BG2 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <Link href="/studio" style={{ color: MUTED, textDecoration: 'none', fontSize: '13px' }}>← Studio</Link>
                <span style={{ color: MUTED }}>·</span>
                <span style={{ fontSize: '13px', color: MUTED }}>Auto-Pilot Calendar</span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: TEXT }}>
                📅 Content Calendar
                {plan?.brandName && <span style={{ fontSize: '14px', fontWeight: 400, color: MUTED, marginLeft: '10px' }}>— {plan.brandName}</span>}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* View toggle */}
              <div style={{ display: 'flex', background: BG3, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
                {(['calendar', 'list'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: '8px 16px', background: view === v ? R : 'transparent', color: view === v ? '#fff' : MUTED, border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s' }}>
                    {v === 'calendar' ? '📅 Calendar' : '📋 List'}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: R_SOFT, border: `1px solid ${R_DIM}`, borderRadius: '8px', color: R, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                ✨ {plan ? 'Regenerate Plan' : 'Generate Plan'}
              </button>

              {/* ── Auto-Pilot Toggle ── */}
              {autoPilotEnabled !== null && (
                <button
                  onClick={toggleAutoPilot}
                  disabled={pauseLoading}
                  style={{
                    padding: '8px 16px',
                    background: autoPilotEnabled
                      ? 'rgba(16,185,129,0.12)'
                      : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${autoPilotEnabled ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.3)'}`,
                    borderRadius: '8px',
                    color: autoPilotEnabled ? '#10B981' : '#f87171',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: pauseLoading ? 'not-allowed' : 'pointer',
                    opacity: pauseLoading ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: autoPilotEnabled ? '#10B981' : '#f87171',
                    boxShadow: autoPilotEnabled ? '0 0 6px #10B981' : 'none',
                    animation: autoPilotEnabled ? 'pulse-dot 2s infinite' : 'none',
                  }} />
                  {pauseLoading ? 'Updating…' : autoPilotEnabled ? 'Auto-Pilot: ON' : 'Auto-Pilot: PAUSED'}
                </button>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.6; transform: scale(1.4); }
          }
        `}</style>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px' }}>

          {/* ── Error ── */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#f87171', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer' }}>✕</button>
            </div>
          )}

          {/* ── Generate Plan Form Modal ── */}
          {showForm && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>🤖 Generate Monthly Content Plan</h2>
                <p style={{ color: MUTED, fontSize: '13px', marginBottom: '24px' }}>AI will plan 16 posts — 8 reels + 8 image posts — scheduled across the month automatically.</p>

                {[
                  { key: 'brandName',           label: 'Brand Name *',              placeholder: 'e.g. Zomato, Nykaa, My Startup' },
                  { key: 'productDescription',  label: 'Product / Service *',       placeholder: 'What you sell — be specific, include price range' },
                  { key: 'targetAudience',      label: 'Target Audience',           placeholder: 'e.g. Indian women 25-35, health conscious' },
                  { key: 'brandVoice',          label: 'Brand Voice (optional)',    placeholder: 'e.g. Bold, witty, anti-corporate like Zomato Twitter' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: TEXT, marginBottom: '6px' }}>{f.label}</label>
                    {f.key === 'productDescription' || f.key === 'brandVoice' ? (
                      <textarea
                        value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        rows={3}
                        style={{ width: '100%', padding: '10px 14px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', color: TEXT, fontSize: '14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        style={{ width: '100%', padding: '10px 14px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', color: TEXT, fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                      />
                    )}
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { key: 'industry', label: 'Industry', opts: ['ecommerce','fashion','beauty','food','technology','fitness','health','education','realestate','finance','restaurant','retail'] },
                    { key: 'region',   label: 'Region',   opts: ['india','global','middle_east'] },
                    { key: 'language', label: 'Language', opts: ['hinglish','english','hindi'] },
                  ].map(f => (
                    <div key={f.key} style={{ gridColumn: f.key === 'industry' ? '1 / -1' : 'auto' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: TEXT, marginBottom: '6px', textTransform: 'capitalize' }}>{f.label}</label>
                      <select value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', color: TEXT, fontSize: '14px', outline: 'none' }}>
                        {f.opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Content breakdown preview */}
                <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '14px', marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>📦 What AI will generate this month</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {Object.entries(TYPE_META).map(([type, meta]) => (
                      <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <span>{meta.icon}</span>
                        <span style={{ color: meta.color, fontWeight: 600 }}>
                          {type === 'viral_reel' ? '2' : type === 'top_reel' ? '4' : type === 'educational_reel' ? '2' : '4'}×
                        </span>
                        <span style={{ color: MUTED }}>{meta.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</p>}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setShowForm(false); setError(null); }} style={{ flex: 1, padding: '12px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', color: MUTED, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={generatePlan} disabled={genLoading} style={{ flex: 2, padding: '12px', background: R, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: genLoading ? 'not-allowed' : 'pointer', opacity: genLoading ? 0.7 : 1 }}>
                    {genLoading ? '🤖 AI is planning your month...' : '✨ Generate Content Plan'}
                  </button>
                </div>
                {genLoading && <p style={{ fontSize: '12px', color: MUTED, textAlign: 'center', marginTop: '10px' }}>This takes ~30 seconds — AI is writing scripts, hooks & captions for all 16 posts</p>}
              </div>
            </div>
          )}

          {/* ── Post Detail Drawer ── */}
          {selected && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelected(null)}>
              <div style={{ width: '480px', maxWidth: '95vw', background: BG3, borderLeft: `1px solid ${BORDER}`, padding: '28px 24px', overflowY: 'auto', height: '100%' }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: TYPE_META[selected.type]?.bg || R_SOFT, marginBottom: '8px' }}>
                      <span>{TYPE_META[selected.type]?.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: TYPE_META[selected.type]?.color || R }}>{TYPE_META[selected.type]?.label}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: TEXT }}>{selected.title}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>✕</button>
                </div>

                {/* Schedule */}
                <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: MUTED, marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scheduled For</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: TEXT }}>
                    {new Date(selected.scheduledAt).toLocaleString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST
                  </div>
                </div>

                {/* Angle */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Hook / Angle</div>
                  <p style={{ fontSize: '14px', color: TEXT, lineHeight: 1.6, background: R_SOFT, border: `1px solid ${R_DIM}`, borderRadius: '8px', padding: '10px 12px' }}>{selected.angle}</p>
                </div>

                {/* Script (for reels) */}
                {selected.script && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Script / Voiceover</div>
                    <p style={{ fontSize: '13px', color: TEXT, lineHeight: 1.7, background: BG2, borderRadius: '8px', padding: '12px', whiteSpace: 'pre-wrap', border: `1px solid ${BORDER}` }}>{selected.script}</p>
                  </div>
                )}

                {/* Image prompt (for image posts) */}
                {selected.imagePrompt && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Image Prompt</div>
                    <p style={{ fontSize: '13px', color: TEXT, lineHeight: 1.7, background: BG2, borderRadius: '8px', padding: '12px', border: `1px solid ${BORDER}` }}>{selected.imagePrompt}</p>
                  </div>
                )}

                {/* Caption */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Caption</div>
                  <p style={{ fontSize: '13px', color: TEXT, lineHeight: 1.7, background: BG2, borderRadius: '8px', padding: '12px', whiteSpace: 'pre-wrap', border: `1px solid ${BORDER}` }}>{selected.caption}</p>
                </div>

                {/* Hashtags */}
                {selected.hashtags?.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '12px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Hashtags</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.hashtags.map(h => (
                        <span key={h} style={{ padding: '3px 8px', background: R_SOFT, border: `1px solid ${R_DIM}`, borderRadius: '4px', fontSize: '12px', color: R }}>{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execute button */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => executePost(selected.id)} style={{ flex: 1, padding: '12px', background: R, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                    🚀 Post Now
                  </button>
                  <Link href={`/studio?script=${encodeURIComponent(selected.script || selected.angle)}`} style={{ flex: 1, padding: '12px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', color: TEXT, fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✏️ Edit in Studio
                  </Link>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: MUTED }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📅</div>
              <p>Loading your content plan...</p>
            </div>
          ) : !plan ? (
            /* ── Empty state ── */
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🗓️</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No Content Plan Yet</h2>
              <p style={{ color: MUTED, marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>Generate your first AI content plan. 16 posts scheduled across the month — zero manual work.</p>
              <button onClick={() => setShowForm(true)} style={{ padding: '14px 40px', background: R, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
                ✨ Generate This Month&apos;s Plan
              </button>
            </div>
          ) : (
            <>
              {/* ── Auto-Pilot Status Banner ── */}
              {autoPilotEnabled === false && (
                <div style={{
                  background: 'rgba(239,68,68,0.07)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>⏸️</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f87171', fontSize: '14px' }}>Auto-Pilot is Paused</div>
                      <div style={{ color: MUTED, fontSize: '13px' }}>Your scheduled posts will NOT be auto-published until you resume.</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleAutoPilot}
                    disabled={pauseLoading}
                    style={{ padding: '9px 20px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '8px', color: '#10B981', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    ▶️ Resume Auto-Pilot
                  </button>
                </div>
              )}

              {/* ── Stats bar ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Posts',    value: totalPosts,          icon: '📦', color: TEXT },
                  { label: 'This Month',     value: thisMonthCount,      icon: '📅', color: '#3B82F6' },
                  { label: 'Posted',         value: postedCount,         icon: '✅', color: '#10B981' },
                  { label: 'Remaining',      value: totalPosts - postedCount, icon: '⏳', color: '#F59E0B' },
                ].map(s => (
                  <div key={s.label} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: MUTED, marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ── Content type legend ── */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {Object.entries(TYPE_META).map(([type, meta]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: meta.bg, borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: meta.color }}>
                    {meta.icon} {meta.label}
                  </div>
                ))}
              </div>

              {view === 'calendar' ? (
                /* ══════════════ CALENDAR VIEW ══════════════ */
                <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden' }}>
                  {/* Month nav */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
                    <button onClick={() => { const d = new Date(viewYear, viewMonth - 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
                      style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '6px', color: TEXT, padding: '6px 12px', cursor: 'pointer', fontSize: '14px' }}>← Prev</button>
                    <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{MONTHS[viewMonth]} {viewYear}</h2>
                    <button onClick={() => { const d = new Date(viewYear, viewMonth + 1, 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
                      style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '6px', color: TEXT, padding: '6px 12px', cursor: 'pointer', fontSize: '14px' }}>Next →</button>
                  </div>

                  {/* Day headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${BORDER}` }}>
                    {DAYS.map(d => (
                      <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
                    ))}
                  </div>

                  {/* Calendar cells */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {cells.map((cell, i) => {
                      const isToday = cell.day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
                      return (
                        <div key={i} style={{
                          minHeight: '100px', padding: '8px', border: `1px solid ${BORDER}`,
                          background: cell.day ? BG3 : BG2,
                          opacity: cell.day ? 1 : 0.3,
                        }}>
                          {cell.day && (
                            <>
                              <div style={{ fontSize: '13px', fontWeight: isToday ? 700 : 400, color: isToday ? R : MUTED, marginBottom: '6px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isToday ? R_SOFT : 'transparent', borderRadius: '50%', border: isToday ? `1px solid ${R_DIM}` : 'none' }}>
                                {cell.day}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                {cell.posts.map(post => {
                                  const meta = TYPE_META[post.type] || TYPE_META.product_photo;
                                  const time = new Date(post.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
                                  return (
                                    <button key={post.id} onClick={() => setSelected(post)} style={{
                                      background: meta.bg, border: `1px solid ${meta.color}22`,
                                      borderRadius: '4px', padding: '3px 6px', cursor: 'pointer',
                                      textAlign: 'left', display: 'flex', alignItems: 'center', gap: '4px',
                                      transition: 'opacity 0.15s',
                                    }}
                                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
                                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                                    >
                                      <span style={{ fontSize: '10px' }}>{meta.icon}</span>
                                      <span style={{ fontSize: '10px', fontWeight: 600, color: meta.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>{time}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ══════════════ LIST VIEW ══════════════ */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.contentPlan.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()).map(post => {
                    const meta = TYPE_META[post.type] || TYPE_META.product_photo;
                    const status = STATUS_META[post.status || 'pending'];
                    const d = new Date(post.scheduledAt);
                    return (
                      <div key={post.id} onClick={() => setSelected(post)} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = meta.color + '44'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = BORDER}>
                        {/* Date block */}
                        <div style={{ textAlign: 'center', minWidth: '52px', background: BG2, borderRadius: '8px', padding: '8px 6px', border: `1px solid ${BORDER}` }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: MUTED, textTransform: 'uppercase' }}>{MONTHS[d.getMonth()]}</div>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: TEXT, lineHeight: 1 }}>{d.getDate()}</div>
                          <div style={{ fontSize: '10px', color: MUTED }}>{DAYS[d.getDay()]}</div>
                        </div>
                        {/* Type badge */}
                        <div style={{ flexShrink: 0 }}>
                          <div style={{ padding: '4px 10px', borderRadius: '6px', background: meta.bg, fontSize: '12px', fontWeight: 700, color: meta.color, whiteSpace: 'nowrap' }}>
                            {meta.icon} {meta.label}
                          </div>
                          <div style={{ fontSize: '11px', color: MUTED, marginTop: '4px', paddingLeft: '2px' }}>
                            {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })} IST
                          </div>
                        </div>
                        {/* Title + angle */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: TEXT, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</div>
                          <div style={{ fontSize: '12px', color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.angle}</div>
                        </div>
                        {/* Status */}
                        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status.color, display: 'inline-block' }} />
                          <span style={{ fontSize: '12px', color: status.color, fontWeight: 600 }}>{status.label}</span>
                        </div>
                        <span style={{ color: MUTED, fontSize: '16px', flexShrink: 0 }}>›</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
