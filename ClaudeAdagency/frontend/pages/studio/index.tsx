'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

/* ── CS Logo (image) ── */
const CSLogoSmall = ({ size = 32 }: { size?: number }) => (
  <img src="/image.png" alt="CS" width={size} height={size} style={{ objectFit: 'contain' }} />
);

/* ── Bell Icon ── */
const BellIcon = () => (
  <div className="notify-bell">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
);

type Step = 'upload' | 'settings' | 'generating' | 'done';
type Duration = 15 | 30 | 50;
type PipelineStage = 'script' | 'clips' | 'stitching' | 'ready';
type Mode = 'express' | 'auto' | 'manual';

interface ReelResult {
  reelId: string;
  videoUrl?: string;
  downloadUrl?: string;
  content?: {
    script: string;
    hooks: string[];
    caption: string;
    hashtags: string[];
    scenes: any[];
  };
}

interface InstagramProfile {
  connected: boolean;
  accountId?: string;
  username?: string;
  name?: string;
}

const REEL_ENGINE_URL = process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

const PIPELINE_STAGES: { key: PipelineStage; icon: string; label: string }[] = [
  { key: 'script',    icon: '🧠', label: 'Script'  },
  { key: 'clips',     icon: '🎥', label: 'Video'   },
  { key: 'stitching', icon: '⚙️', label: 'Merging' },
  { key: 'ready',     icon: '✅', label: 'Ready'   },
];

const STAGE_PERCENT: Record<PipelineStage, number> = { script: 15, clips: 60, stitching: 85, ready: 100 };

function getAuthToken(): string {
  if (typeof window === 'undefined') return 'dev-token';
  return localStorage.getItem('cs_token') || 'dev-token';
}

export default function StudioPage() {
  const router = useRouter();

  // ── Auth & profile ──
  const [user, setUser] = useState<{ name?: string; email?: string; picture?: string } | null>(null);
  const [credits, setCredits] = useState(30);
  const [instagram, setInstagram] = useState<InstagramProfile>({ connected: false });

  // ── Form ──
  const [step, setStep] = useState<Step>('upload');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [duration, setDuration] = useState<Duration>(30);
  const [voice, setVoice] = useState(true);
  const [music, setMusic] = useState(true);
  const [tone, setTone] = useState('energetic');
  const [productDescription, setProductDescription] = useState('');
  const [vision, setVision] = useState('');
  const [mode, setMode] = useState<Mode>('express');

  // ── Pipeline ──
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('script');
  const [pipelineMessage, setPipelineMessage] = useState('');

  // ── Result ──
  const [result, setResult] = useState<ReelResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'caption' | 'scenes'>('script');

  // ── Actions ──
  const [approving, setApproving] = useState(false);
  const [approveSuccess, setApproveSuccess] = useState<{ permalink?: string } | null>(null);
  const [showIGPrompt, setShowIGPrompt] = useState(false);
  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [voiceoverLoading, setVoiceoverLoading] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null);
  const creditCost = duration * 2;

  // ── On load ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const igStatus = params.get('instagram');
    const urlError = params.get('error');

    if (urlToken) { localStorage.setItem('cs_token', urlToken); window.history.replaceState({}, '', '/studio'); }
    if (igStatus === 'connected') window.history.replaceState({}, '', '/studio');
    if (urlError) {
      const msgs: Record<string, string> = {
        instagram_denied: 'Instagram connection was cancelled.',
        instagram_token_failed: 'Instagram auth failed. Try again.',
        no_ig_business_account: 'No Instagram Business account found. Link your IG to a Facebook Page first.',
        meta_not_configured: 'Instagram posting not yet configured.',
        instagram_server_error: 'Server error connecting Instagram.',
      };
      if (msgs[urlError]) setError(msgs[urlError]);
      window.history.replaceState({}, '', '/studio');
    }

    const token = localStorage.getItem('cs_token') || 'dev-token';
    fetch(`${REEL_ENGINE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.id) {
          setUser({ name: d.name, email: d.email, picture: d.picture });
          if (d.credits !== undefined) setCredits(d.credits);
          if (d.instagram) setInstagram(d.instagram);
        }
      })
      .catch(() => {
        fetch(`${REEL_ENGINE_URL}/api/reels/me/credits`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json()).then(d => { if (d.balance !== undefined) setCredits(d.balance); }).catch(() => {});
      });
  }, []);

  // ── Image handling ──
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addImages(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  }, []);

  const addImages = (files: File[]) => {
    const n = files.slice(0, 10 - images.length).map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...n]);
  };

  const removeImage = (idx: number) => {
    setImages(prev => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx); });
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve((r.result as string).split(',')[1]);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  // ── Automated pipeline ──
  const startGeneration = async () => {
    if (images.length === 0) { setError('Please upload at least one product image'); return; }
    if (credits < creditCost) { setError(`Insufficient credits. Need ${creditCost}, you have ${credits}.`); return; }

    setStep('generating');
    setError(null);
    setResult(null);
    setVoiceoverUrl(null);
    setApproveSuccess(null);

    try {
      // Stage 1: Script
      setPipelineStage('script');
      setPipelineMessage('AI writing your viral script...');

      const imageData = [];
      for (const img of images) {
        const base64 = await fileToBase64(img.file);
        imageData.push({ base64, contentType: img.file.type, filename: img.file.name });
      }

      const genRes = await fetch(`${REEL_ENGINE_URL}/api/reels/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ images: imageData, productDescription: productDescription || vision, duration, voice, music, tone }),
      });

      if (!genRes.ok) {
        const err = await genRes.json().catch(() => ({ error: `Server error ${genRes.status}` }));
        throw new Error(err.error || 'Script generation failed');
      }

      const genData = await genRes.json();
      if (genData.creditsRemaining !== undefined) setCredits(genData.creditsRemaining);

      const reelId = genData.reelId;
      const content = genData.content;
      setResult({ reelId, content });

      // Stage 2: Video Clips
      setPipelineStage('clips');
      setPipelineMessage(`Generating ${Math.ceil(duration / 5)} video clips with AI...`);

      const videoRes = await fetch(`${REEL_ENGINE_URL}/api/reels/${reelId}/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ quality: 'default' }),
      });

      if (!videoRes.ok) {
        const err = await videoRes.json().catch(() => ({}));
        throw new Error(err.error || 'Video generation failed');
      }

      // Stage 3: Stitching
      setPipelineStage('stitching');
      setPipelineMessage('Merging clips into final reel...');

      const stitchRes = await fetch(`${REEL_ENGINE_URL}/api/reels/${reelId}/stitch`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (!stitchRes.ok) {
        const err = await stitchRes.json().catch(() => ({}));
        throw new Error(err.error || 'Video stitching failed');
      }

      const stitchData = await stitchRes.json();

      setPipelineStage('ready');
      setPipelineMessage('Your reel is ready!');

      setResult({
        reelId,
        content,
        videoUrl: stitchData.videoUrl,
        downloadUrl: `${REEL_ENGINE_URL}/api/reels/${reelId}/download`,
      });

      await new Promise(r => setTimeout(r, 800));
      setStep('done');

    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
      setStep('settings');
    }
  };

  // ── Approve → Instagram ──
  const handleApprove = async () => {
    if (!result?.reelId) return;
    if (!instagram.connected) { setShowIGPrompt(true); return; }

    setApproving(true);
    setError(null);
    try {
      const res = await fetch(`${REEL_ENGINE_URL}/api/reels/${result.reelId}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.code === 'IG_NOT_CONNECTED') { setShowIGPrompt(true); return; }
        throw new Error(err.error || 'Failed to post to Instagram');
      }
      const data = await res.json();
      setApproveSuccess({ permalink: data.permalink });
    } catch (err: any) {
      setError(err.message || 'Failed to post to Instagram');
    } finally {
      setApproving(false);
    }
  };

  const handleDownload = () => {
    if (!result?.reelId) return;
    fetch(`${REEL_ENGINE_URL}/api/reels/${result.reelId}/download`, { headers: { Authorization: `Bearer ${getAuthToken()}` } })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `reel-${result.reelId}.mp4`; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      })
      .catch(() => setError('Download failed.'));
  };

  const connectInstagram = () => {
    window.location.href = `${REEL_ENGINE_URL}/api/auth/instagram?token=${encodeURIComponent(getAuthToken())}`;
  };

  const disconnectInstagram = async () => {
    await fetch(`${REEL_ENGINE_URL}/api/auth/instagram`, { method: 'DELETE', headers: { Authorization: `Bearer ${getAuthToken()}` } }).catch(() => {});
    setInstagram({ connected: false });
  };

  const generateVoiceover = async () => {
    if (!result?.reelId) return;
    setVoiceoverLoading(true);
    try {
      const res = await fetch(`${REEL_ENGINE_URL}/api/audio/voiceover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ reelId: result.reelId }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Error ${res.status}`);
      setVoiceoverUrl(URL.createObjectURL(await res.blob()));
    } catch (err: any) { setError(err.message); } finally { setVoiceoverLoading(false); }
  };

  const currentStageIdx = PIPELINE_STAGES.findIndex(s => s.key === pipelineStage);

  return (
    <div className="min-h-screen nebula-bg" style={{ background: '#050B18', color: '#fff' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(5,11,24,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CSLogoSmall size={30} />
          </Link>

          <div className="flex items-center gap-3">
            {/* Instagram badge */}
            {instagram.connected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(224,64,251,0.08)', border: '1px solid rgba(224,64,251,0.25)' }}>
                <span className="text-[#E040FB]">📸</span>
                <span className="text-white hidden sm:block">@{instagram.username || 'IG'}</span>
                <button onClick={disconnectInstagram} className="text-[#94A3B8] hover:text-red-400 ml-1">✕</button>
              </div>
            ) : (
              <button onClick={connectInstagram}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}>
                📸 Connect IG
              </button>
            )}

            {/* Credits */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-[#94A3B8] text-xs">Credits:</span>
              <span className="font-bold purple-gradient-text text-sm">{credits}</span>
            </div>

            {/* User avatar */}
            {user && user.picture ? (
              <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-[rgba(123,46,255,0.3)]" />
            ) : user ? (
              <div className="w-8 h-8 rounded-full bg-[rgba(123,46,255,0.2)] flex items-center justify-center text-white text-sm font-bold">{user.name?.[0] || 'U'}</div>
            ) : null}

            <BellIcon />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <span className="text-red-400 text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-red-400 font-semibold text-sm">Error</p>
              <p className="text-[#94A3B8] text-xs">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-[#94A3B8] hover:text-white">✕</button>
          </div>
        )}

        {/* ═══════════════════════════════════
            STEP: UPLOAD / SETTINGS
            Matches Figma "Create Viral Reel"
            ═══════════════════════════════════ */}
        {(step === 'upload' || step === 'settings') && (
          <div className="max-w-lg mx-auto">

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Viral Reel</h1>
              <p className="text-[#94A3B8] text-sm">Turn your product into high-converting content</p>
            </div>

            {/* Product input */}
            <div className="mb-4">
              <label className="dark-input-label">Product</label>
              <input
                type="text"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Enter the product details..."
                className="dark-input"
              />
            </div>

            {/* Vision input */}
            <div className="mb-6">
              <label className="dark-input-label">Vision</label>
              <input
                type="text"
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Describe the vision for your reel..."
                className="dark-input"
              />
            </div>

            {/* Image upload — compact */}
            <div className="mb-6">
              <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="rounded-xl p-5 text-center cursor-pointer transition-all hover:border-[rgba(123,46,255,0.4)]"
                style={{ border: '1px dashed rgba(255,255,255,0.15)', background: 'rgba(13,22,40,0.4)' }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {images.length === 0 ? (
                  <>
                    <div className="text-2xl mb-2">🖼️</div>
                    <p className="text-white text-sm font-semibold">Upload product images</p>
                    <p className="text-[#94A3B8] text-xs">Up to 10 images (JPG, PNG, WEBP)</p>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden group" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                        <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center text-[#94A3B8] text-xl" style={{ border: '1px dashed rgba(255,255,255,0.15)' }}>+</div>
                  </div>
                )}
                <input id="file-input" type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => addImages(Array.from(e.target.files || []))} />
              </div>
            </div>

            {/* Mode selector — matches Figma */}
            <div className="mb-6">
              <label className="text-sm text-[#94A3B8] mb-3 block">Mode</label>
              <div className="flex gap-3">
                {([
                  { key: 'express' as Mode, icon: '⚡', label: 'Express', emoji2: '🖊️' },
                  { key: 'auto' as Mode,    icon: '🎬', label: 'Auto Reels', emoji2: '' },
                  { key: 'manual' as Mode,  icon: '🚀', label: 'Manual', emoji2: '✏️' },
                ]).map(m => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={`mode-pill flex-1 justify-center ${mode === m.key ? 'mode-pill-active' : ''}`}
                  >
                    {m.icon} {m.label} {m.emoji2}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration — compact chips */}
            <div className="mb-6">
              <label className="text-sm text-[#94A3B8] mb-3 block">Duration</label>
              <div className="flex gap-3">
                {([15, 30, 50] as Duration[]).map((d) => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`mode-pill flex-1 justify-center ${duration === d ? 'mode-pill-active' : ''}`}>
                    {d}s <span className="text-xs text-[#94A3B8] ml-1">({d * 2}cr)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone — compact */}
            <div className="mb-8">
              <label className="text-sm text-[#94A3B8] mb-3 block">Tone</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'energetic', label: '⚡' },
                  { value: 'professional', label: '💼' },
                  { value: 'emotional', label: '❤️' },
                  { value: 'comedic', label: '😄' },
                ].map((t) => (
                  <button key={t.value} onClick={() => setTone(t.value)}
                    className={`mode-pill justify-center text-lg py-3 ${tone === t.value ? 'mode-pill-active' : ''}`}
                    title={t.value}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Creating — neon button */}
            {credits < creditCost ? (
              <div className="text-center space-y-3 mb-6">
                <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                  Need {creditCost - credits} more credits
                </div>
                <Link href="/studio/credits" className="neon-btn w-full">Buy Credits</Link>
              </div>
            ) : (
              <button
                onClick={startGeneration}
                disabled={images.length === 0}
                className="neon-btn w-full mb-5"
              >
                Start Creating
              </button>
            )}

            {/* Login link */}
            {!user && (
              <div className="text-center">
                <Link href="/login" className="text-[#94A3B8] text-sm hover:text-white transition-colors">Login</Link>
              </div>
            )}

            {/* Sign out */}
            {user && (
              <div className="text-center mt-2">
                <button
                  onClick={() => { localStorage.removeItem('cs_token'); window.location.href = '/login'; }}
                  className="text-[#94A3B8] text-xs hover:text-white transition-colors"
                >Sign out ({user.email})</button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════
            STEP: GENERATING (pipeline)
            ═══════════════════════════════════ */}
        {step === 'generating' && (
          <div className="max-w-lg mx-auto mt-8">
            <div className="rounded-2xl p-10 text-center relative overflow-hidden" style={{ background: 'rgba(13,22,40,0.5)', border: '1px solid rgba(123,46,255,0.15)' }}>
              <div className="purple-orb w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" style={{ position: 'absolute' }}></div>
              <div className="relative z-10">
                <div className="text-5xl mb-5 float">
                  {PIPELINE_STAGES.find(s => s.key === pipelineStage)?.icon || '🎬'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {pipelineStage === 'script' && 'Writing Script'}
                  {pipelineStage === 'clips' && 'Generating Video'}
                  {pipelineStage === 'stitching' && 'Merging Reel'}
                  {pipelineStage === 'ready' && 'Almost Done!'}
                </h2>
                <p className="text-[#94A3B8] text-sm mb-8">{pipelineMessage}</p>

                {/* Progress bar */}
                <div className="w-full rounded-full h-2 mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${STAGE_PERCENT[pipelineStage]}%`, background: 'linear-gradient(90deg, #00E5FF, #7B2FFF, #E040FB)' }}></div>
                </div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-8">
                  <span>{pipelineMessage}</span>
                  <span className="font-bold purple-gradient-text">{STAGE_PERCENT[pipelineStage]}%</span>
                </div>

                {/* Stage dots */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {PIPELINE_STAGES.map((s, i) => {
                    const done = i < currentStageIdx;
                    const active = i === currentStageIdx;
                    return (
                      <div key={s.key} className="rounded-lg p-3 text-center transition-all"
                        style={{
                          background: done ? 'rgba(123,46,255,0.12)' : active ? 'rgba(0,229,255,0.06)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${done ? 'rgba(123,46,255,0.3)' : active ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        }}>
                        <div className="text-lg mb-1">{done ? '✅' : s.icon}</div>
                        <div className={done ? 'text-[#C084FC]' : active ? 'text-[#67E8F9]' : 'text-[#94A3B8]'}>{s.label}</div>
                      </div>
                    );
                  })}
                </div>

                {pipelineStage === 'clips' && (
                  <p className="text-[#94A3B8] text-xs mt-6 rounded-lg p-3" style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.12)' }}>
                    ⏱️ Est. {Math.ceil(duration / 5) * 2}–{Math.ceil(duration / 5) * 4} min. Keep this tab open.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
            STEP: DONE — Approve / Reject / Download
            ═══════════════════════════════════ */}
        {step === 'done' && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Video + Actions */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(13,22,40,0.5)', border: '1px solid rgba(123,46,255,0.15)' }}>

                {approveSuccess ? (
                  <div className="feature-badge mb-4" style={{ color: '#22c55e', borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.06)' }}>✅ Posted to Instagram!</div>
                ) : (
                  <div className="feature-badge mb-4" style={{ color: '#E040FB', borderColor: 'rgba(224,64,251,0.3)', background: 'rgba(224,64,251,0.06)' }}>🎉 Reel Ready</div>
                )}

                <h2 className="text-xl font-bold text-white mb-4">Your Viral Reel</h2>

                {/* Video player */}
                <div className="aspect-[9/16] rounded-xl overflow-hidden mb-5" style={{ background: 'rgba(5,11,24,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {result.videoUrl ? (
                    <video src={result.videoUrl} controls playsInline className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center px-4">
                      <div><div className="text-4xl mb-2">🎬</div><p className="text-[#94A3B8] text-sm">Video ready on server</p></div>
                    </div>
                  )}
                </div>

                {approveSuccess && (
                  <div className="mb-4 p-4 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <p className="text-green-400 font-semibold text-sm mb-1">🎉 Posted Successfully!</p>
                    {approveSuccess.permalink && (
                      <a href={approveSuccess.permalink} target="_blank" rel="noopener noreferrer" className="text-[#C084FC] text-xs hover:underline">View on Instagram →</a>
                    )}
                  </div>
                )}

                {/* 3 Action Buttons */}
                <div className="space-y-3">
                  {!approveSuccess && (
                    <>
                      {/* Approve */}
                      <button onClick={handleApprove} disabled={approving}
                        className="neon-btn w-full gap-2" style={{ padding: '14px 24px', fontSize: '15px' }}>
                        {approving ? '⚙️ Posting...' : instagram.connected ? '✅ Approve & Post' : '✅ Approve (Connect IG)'}
                      </button>

                      {/* Download */}
                      <button onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
                        style={{ background: 'rgba(74,108,247,0.1)', border: '1px solid rgba(74,108,247,0.3)' }}>
                        ⬇️ Download MP4
                      </button>

                      {/* Reject */}
                      <button onClick={() => { setStep('settings'); setResult(null); setImages([]); setVoiceoverUrl(null); setApproveSuccess(null); }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                        ❌ Reject — New Reel
                      </button>
                    </>
                  )}

                  {approveSuccess && (
                    <button onClick={() => { setStep('settings'); setResult(null); setImages([]); setVoiceoverUrl(null); setApproveSuccess(null); }}
                      className="neon-btn w-full" style={{ padding: '14px 24px', fontSize: '15px' }}>
                      + Create Another Reel
                    </button>
                  )}
                </div>

                {showIGPrompt && !instagram.connected && (
                  <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(224,64,251,0.04)', border: '1px solid rgba(224,64,251,0.15)' }}>
                    <p className="text-white font-semibold text-sm mb-2">📸 Connect Instagram</p>
                    <p className="text-[#94A3B8] text-xs mb-3">Link your Instagram Business account to auto-post.</p>
                    <button onClick={connectInstagram} className="neon-btn neon-btn-sm w-full">Connect Instagram →</button>
                    <button onClick={() => setShowIGPrompt(false)} className="w-full text-xs text-[#94A3B8] hover:text-white mt-2 text-center">Maybe later</button>
                  </div>
                )}

                {/* Voiceover */}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {!voiceoverUrl ? (
                    <button onClick={generateVoiceover} disabled={voiceoverLoading}
                      className="w-full text-xs text-[#94A3B8] hover:text-white transition-colors flex items-center justify-center gap-2 py-2 disabled:opacity-50">
                      {voiceoverLoading ? '🎙️ Generating...' : '🎙️ Generate AI Voiceover'}
                    </button>
                  ) : (
                    <div className="rounded-xl p-3" style={{ background: 'rgba(13,22,40,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-xs text-[#94A3B8] mb-2 font-semibold">🎙️ AI Voiceover</p>
                      <audio controls src={voiceoverUrl} className="w-full" style={{ height: '36px' }} />
                      <a href={voiceoverUrl} download={`voiceover-${result.reelId}.mp3`} className="text-xs text-[#C084FC] hover:underline mt-1 block text-center">⬇️ Download MP3</a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: AI Content Tabs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(13,22,40,0.5)', border: '1px solid rgba(123,46,255,0.12)' }}>
                <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {(['script', 'caption', 'scenes'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                        activeTab === tab ? 'text-white bg-[rgba(123,46,255,0.08)]' : 'text-[#94A3B8] hover:text-white'
                      }`}
                      style={activeTab === tab ? { borderBottom: '2px solid #7B2FFF' } : {}}>
                      {tab === 'script' ? '📝 Script' : tab === 'caption' ? '💬 Caption' : '🎥 Scenes'}
                    </button>
                  ))}
                </div>
                <div className="p-6">
                  {activeTab === 'script' && result.content && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-[#C084FC] uppercase tracking-wider mb-3">🪝 Hook Variations</h4>
                        {result.content.hooks?.map((hook, i) => (
                          <div key={i} className="rounded-lg p-3 mb-2 text-sm text-[#94A3B8]"
                            style={{ background: 'rgba(123,46,255,0.06)', border: '1px solid rgba(123,46,255,0.12)' }}>
                            <span className="text-[#C084FC] font-bold mr-2">#{i + 1}</span>{hook}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#E040FB] uppercase tracking-wider mb-3">📜 Full Script</h4>
                        <div className="rounded-xl p-4 text-[#94A3B8] text-sm leading-relaxed whitespace-pre-wrap"
                          style={{ background: 'rgba(5,11,24,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {result.content.script}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'caption' && result.content && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#C084FC] uppercase tracking-wider mb-3">📱 Instagram Caption</h4>
                        <div className="rounded-xl p-4 text-[#94A3B8] text-sm leading-relaxed"
                          style={{ background: 'rgba(5,11,24,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {result.content.caption}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#E040FB] uppercase tracking-wider mb-3"># Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.content.hashtags?.map((tag, i) => (
                            <span key={i} className="px-2 py-1 rounded-full text-xs font-semibold text-[#C084FC]"
                              style={{ background: 'rgba(123,46,255,0.08)', border: '1px solid rgba(123,46,255,0.15)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'scenes' && result.content && (
                    <div className="space-y-3">
                      {result.content.scenes?.map((scene: any, i: number) => (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(13,22,40,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C084FC] font-bold text-sm"
                              style={{ background: 'rgba(123,46,255,0.1)', border: '1px solid rgba(123,46,255,0.2)' }}>
                              {scene.sceneNumber}
                            </div>
                            <div>
                              <span className="text-white font-semibold text-sm">{scene.title || `Scene ${scene.sceneNumber}`}</span>
                              <span className="text-[#E040FB] text-xs ml-2">{scene.startTime}s – {scene.startTime + scene.duration}s</span>
                            </div>
                          </div>
                          <p className="text-[#94A3B8] text-sm">{scene.description}</p>
                          {scene.dialogue && <p className="text-[#C084FC] text-xs mt-2 italic">"{scene.dialogue}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {!instagram.connected && !approveSuccess && (
                <div className="rounded-2xl p-5" style={{ background: 'rgba(224,64,251,0.03)', border: '1px solid rgba(224,64,251,0.1)' }}>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">📸</div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm mb-0.5">Connect Instagram</p>
                      <p className="text-[#94A3B8] text-xs">Auto-post approved reels directly to your Instagram.</p>
                    </div>
                    <button onClick={connectInstagram} className="neon-btn neon-btn-sm whitespace-nowrap">Connect →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
