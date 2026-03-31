'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';

const CSLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueG-st" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B8DEF"/><stop offset="60%" stopColor="#4A6CF7"/><stop offset="100%" stopColor="#7B5EA7"/>
      </linearGradient>
      <linearGradient id="goldG-st" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#D97706"/>
      </linearGradient>
      <linearGradient id="sG-st" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B8DEF"/><stop offset="50%" stopColor="#7B5EA7"/><stop offset="100%" stopColor="#F59E0B"/>
      </linearGradient>
    </defs>
    <path d="M28 10 C14 10 6 18 6 30 C6 42 14 50 28 50" stroke="url(#blueG-st)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    <circle cx="28" cy="10" r="2.5" fill="#5B8DEF"/><circle cx="6" cy="30" r="2.5" fill="#5B8DEF"/><circle cx="28" cy="50" r="2.5" fill="#5B8DEF"/>
    <path d="M38 14 C48 14 52 18 52 24 C52 30 44 30 38 30 C32 30 28 34 28 38 C28 44 32 46 42 46" stroke="url(#sG-st)" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <circle cx="38" cy="14" r="2" fill="#5B8DEF"/><circle cx="52" cy="24" r="2" fill="#7B5EA7"/>
    <circle cx="28" cy="38" r="2" fill="#E59830"/><circle cx="42" cy="46" r="2.5" fill="#F59E0B"/>
    <polygon points="53,22 62,30 53,38" fill="url(#goldG-st)"/>
  </svg>
);

type Step = 'upload' | 'settings' | 'generating' | 'done';
type Duration = 15 | 30 | 50;

interface GenerationProgress {
  step: string;
  percent: number;
  message: string;
}

interface ReelResult {
  reelId: string;
  finalUrl?: string;
  downloadUrl?: string;
  content?: {
    script: string;
    hooks: string[];
    caption: string;
    hashtags: string[];
    scenes: any[];
  };
}

const REEL_ENGINE_URL = process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

const STEP_LABELS: Record<string, string> = {
  ai_content: 'Generating viral script with AI...',
  video_gen: 'Creating video scenes...',
  merge: 'Merging scenes together...',
  voice: 'Adding voiceover...',
  music: 'Mixing background music...',
  subtitles: 'Adding subtitles...',
  export: 'Finalizing your reel...',
  upload: 'Uploading to cloud...',
  done: 'Reel ready!',
};

export default function StudioPage() {
  const [step, setStep] = useState<Step>('upload');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [duration, setDuration] = useState<Duration>(30);
  const [voice, setVoice] = useState(true);
  const [music, setMusic] = useState(true);
  const [tone, setTone] = useState('energetic');
  const [productDescription, setProductDescription] = useState('');
  const [progress, setProgress] = useState<GenerationProgress>({ step: '', percent: 0, message: '' });
  const [result, setResult] = useState<ReelResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(30);
  const [activeTab, setActiveTab] = useState<'script' | 'caption' | 'scenes'>('script');
  const dropRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const creditCost = duration * 2;

  // Fetch real credit balance on load
  useEffect(() => {
    fetch(`${REEL_ENGINE_URL}/api/reels/me/credits`, {
      headers: { Authorization: `Bearer dev-token` },
    })
      .then(r => r.json())
      .then(d => { if (d.balance !== undefined) setCredits(d.balance); })
      .catch(() => {});
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addImages(files);
  }, []);

  const addImages = (files: File[]) => {
    const newImages = files.slice(0, 10 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const startGeneration = async () => {
    if (images.length === 0) {
      setError('Please upload at least one product image');
      return;
    }
    if (credits < creditCost) {
      setError(`Insufficient credits. Need ${creditCost}, you have ${credits}.`);
      return;
    }

    setStep('generating');
    setError(null);
    setProgress({ step: 'upload', percent: 5, message: 'Preparing images...' });

    try {
      // Convert images to base64 (bypasses S3 requirement for testing)
      const imageData: { base64: string; contentType: string; filename: string }[] = [];
      for (const img of images) {
        const base64 = await fileToBase64(img.file);
        imageData.push({ base64, contentType: img.file.type, filename: img.file.name });
      }

      setProgress({ step: 'ai_content', percent: 10, message: 'Sending to AI...' });

      // Start generation — send images as base64
      const genRes = await fetch(`${REEL_ENGINE_URL}/api/reels/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer dev-token` },
        body: JSON.stringify({
          images: imageData,
          productDescription,
          duration,
          voice,
          music,
          tone,
        }),
      });

      if (!genRes.ok) {
        const err = await genRes.json().catch(() => ({ error: `Server error ${genRes.status}` }));
        throw new Error(err.error || 'Generation failed');
      }

      const data = await genRes.json();
      if (data.creditsRemaining !== undefined) setCredits(data.creditsRemaining);

      // Content comes back inline — show result immediately
      if (data.content) {
        setResult({ reelId: data.reelId, content: data.content });
        setStep('done');
        return;
      }

      // Fallback: poll for result if content not inline
      setProgress({ step: 'ai_content', percent: 15, message: 'AI generating your viral script...' });
      pollStatus(data.reelId);

    } catch (err: any) {
      // Stay on generating step — show error with retry button
      setError(err.message || 'Generation failed. Check your API keys in Railway.');
      setStep('settings');
    }
  };

  const pollStatus = async (reelId: string) => {
    const maxAttempts = 120;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 3000));
      try {
        const res = await fetch(`${REEL_ENGINE_URL}/api/reels/${reelId}/status`, {
          headers: { Authorization: `Bearer dev-token` },
        });
        const data = await res.json();
        if (data.progress) setProgress(data.progress);
        if (data.state === 'completed' || data.status === 'completed') {
          setResult(data.returnvalue || data);
          setStep('done');
          return;
        }
        if (data.state === 'failed') {
          setError(data.failedReason || 'Generation failed');
          setStep('settings');
          return;
        }
      } catch { /* continue polling */ }
    }
    setError('Generation timed out. Please try again.');
    setStep('settings');
  };

  const [voiceoverUrl, setVoiceoverUrl] = useState<string | null>(null);
  const [voiceoverLoading, setVoiceoverLoading] = useState(false);

  const generateVoiceover = async () => {
    if (!result?.reelId) return;
    setVoiceoverLoading(true);
    try {
      const res = await fetch(`${REEL_ENGINE_URL}/api/audio/voiceover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer dev-token` },
        body: JSON.stringify({ reelId: result.reelId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVoiceoverUrl(url);
    } catch (err: any) {
      setError(err.message || 'Voiceover generation failed');
    } finally {
      setVoiceoverLoading(false);
    }
  };

  const postToInstagram = async () => {
    if (!result?.reelId) return;
    try {
      await fetch(`${REEL_ENGINE_URL}/api/reels/${result.reelId}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer dev-token` },
        body: JSON.stringify({}),
      });
      alert('✅ Reel posted to Instagram!');
    } catch {
      alert('Failed to post. Check your Instagram connection in settings.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#050B18', color: '#fff' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050B18]/95 backdrop-blur-md border-b border-[rgba(74,108,247,0.2)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <CSLogo size={36} />
            <span className="font-bold text-white hidden sm:block">thecraft<span style={{ color: '#F59E0B' }}>studios</span>.in</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl border border-[rgba(74,108,247,0.3)]">
              <span className="text-[#94A3B8] text-sm">Credits:</span>
              <span className="font-bold gradient-text text-lg">{credits}</span>
            </div>
            <Link href="/studio/credits" className="gold-btn px-4 py-2 text-sm font-bold">Buy Credits</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="badge mb-3 inline-flex">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" style={{ background: '#F59E0B' }}></span>
            AI Reel Studio
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-white uppercase">
            Create <span className="gradient-text">Viral Reels</span>
          </h1>
          <p className="text-[#94A3B8] mt-2">Upload product images → AI generates your viral reel in minutes</p>
        </div>

        {error && (
          <div className="mb-6 glass rounded-xl p-4 border border-red-500/30 flex items-start gap-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <div>
              <p className="text-red-400 font-semibold">Error</p>
              <p className="text-[#94A3B8] text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-[#94A3B8] hover:text-white">✕</button>
          </div>
        )}

        {/* ── STEP: UPLOAD ── */}
        {(step === 'upload' || step === 'settings') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Upload + Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload */}
              <div className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.2)]">
                <h2 className="text-xl font-bold text-white mb-4">📸 Upload Product Images</h2>

                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-[rgba(74,108,247,0.3)] rounded-xl p-8 text-center cursor-pointer hover:border-[#4A6CF7] transition-colors"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <div className="text-4xl mb-3">🖼️</div>
                  <p className="text-white font-semibold mb-1">Drop images here or click to browse</p>
                  <p className="text-[#94A3B8] text-sm">Up to 10 images, max 10MB each (JPG, PNG, WEBP)</p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addImages(Array.from(e.target.files || []))}
                  />
                </div>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[rgba(74,108,247,0.3)] group">
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.2)]">
                <h2 className="text-xl font-bold text-white mb-4">✍️ Product Description (optional)</h2>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe your product — key features, benefits, target audience..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl resize-none outline-none text-[#94A3B8] placeholder-[#4A6CF7]/40"
                  style={{ background: 'rgba(13,22,40,0.9)', border: '1px solid rgba(74,108,247,0.3)', color: '#fff' }}
                />
              </div>

              {/* Reel Settings */}
              <div className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.2)]">
                <h2 className="text-xl font-bold text-white mb-6">⚙️ Reel Settings</h2>

                {/* Duration */}
                <div className="mb-6">
                  <label className="text-sm font-bold text-white uppercase tracking-wider mb-3 block">Reel Duration</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([15, 30, 50] as Duration[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`p-4 rounded-xl border transition-all text-center ${
                          duration === d
                            ? 'border-[#4A6CF7] bg-[rgba(74,108,247,0.15)]'
                            : 'border-[rgba(74,108,247,0.2)] hover:border-[rgba(74,108,247,0.4)]'
                        }`}
                      >
                        <div className="text-2xl font-bold text-white">{d}s</div>
                        <div className="text-xs text-[#94A3B8] mt-1">{d * 2} credits</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div className="mb-6">
                  <label className="text-sm font-bold text-white uppercase tracking-wider mb-3 block">Content Tone</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 'energetic', label: '⚡ Energetic' },
                      { value: 'professional', label: '💼 Professional' },
                      { value: 'emotional', label: '❤️ Emotional' },
                      { value: 'comedic', label: '😄 Comedic' },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={`p-3 rounded-xl border transition-all text-sm font-semibold ${
                          tone === t.value
                            ? 'border-[#4A6CF7] bg-[rgba(74,108,247,0.15)] text-white'
                            : 'border-[rgba(74,108,247,0.2)] text-[#94A3B8] hover:border-[rgba(74,108,247,0.4)]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice & Music Toggles */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'voice' as const, label: '🎙️ AI Voiceover', desc: 'ElevenLabs voice', value: voice, set: setVoice },
                    { key: 'music' as const, label: '🎵 Background Music', desc: 'Auto-synced', value: music, set: setMusic },
                  ].map((toggle) => (
                    <div
                      key={toggle.key}
                      onClick={() => toggle.set(!toggle.value)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        toggle.value
                          ? 'border-[#4A6CF7] bg-[rgba(74,108,247,0.1)]'
                          : 'border-[rgba(74,108,247,0.2)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-sm">{toggle.label}</span>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${toggle.value ? 'bg-[#4A6CF7]' : 'bg-[rgba(74,108,247,0.2)]'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${toggle.value ? 'left-5' : 'left-0.5'}`}></div>
                        </div>
                      </div>
                      <p className="text-[#94A3B8] text-xs">{toggle.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary & Generate */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.2)] sticky top-24">
                <h3 className="text-lg font-bold text-white mb-5">📊 Reel Summary</h3>
                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Images', value: `${images.length} uploaded` },
                    { label: 'Duration', value: `${duration} seconds` },
                    { label: 'Tone', value: tone },
                    { label: 'Voiceover', value: voice ? '✅ ElevenLabs' : '❌ Off' },
                    { label: 'Music', value: music ? '✅ AI Generated' : '❌ Off' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-[#94A3B8]">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="h-px bg-[rgba(74,108,247,0.2)]"></div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8] font-semibold">Credit Cost</span>
                    <span className="font-bold gradient-text text-lg">{creditCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Your Balance</span>
                    <span className={`font-bold ${credits >= creditCost ? 'text-white' : 'text-red-400'}`}>{credits}</span>
                  </div>
                </div>

                {credits < creditCost ? (
                  <div className="space-y-3">
                    <div className="text-center text-sm text-red-400 bg-red-500/10 rounded-lg p-3">
                      Need {creditCost - credits} more credits
                    </div>
                    <Link href="/studio/credits" className="gold-btn w-full justify-center px-6 py-3 font-bold">
                      Buy Credits →
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={startGeneration}
                    disabled={images.length === 0}
                    className="gold-btn w-full justify-center px-6 py-4 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    🎬 Generate Reel
                  </button>
                )}

                <p className="text-[#94A3B8] text-xs text-center mt-3">
                  3 free regenerations per reel included
                </p>
              </div>

              {/* What AI Creates */}
              <div className="glass rounded-2xl p-5 border border-[rgba(74,108,247,0.2)]">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">✨ AI Creates For You</h4>
                <ul className="space-y-2 text-sm">
                  {[
                    'Viral marketing script',
                    '3 hook variations',
                    'Scene-by-scene breakdown',
                    'SEO-optimized caption',
                    '15 trending hashtags',
                    'Voiceover (if enabled)',
                    'Background music',
                    'Final MP4 export',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#94A3B8]">
                      <span className="text-[#4A6CF7] font-bold">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: GENERATING ── */}
        {step === 'generating' && (
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-10 border border-[rgba(74,108,247,0.2)] text-center relative overflow-hidden">
              <div className="blue-orb w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 float">🎬</div>
                <h2 className="font-display text-3xl text-white mb-2 uppercase">Creating Your Reel</h2>
                <p className="text-[#94A3B8] mb-10">{progress.message || 'AI is working its magic...'}</p>

                {/* Progress bar */}
                <div className="w-full bg-[rgba(74,108,247,0.1)] rounded-full h-3 mb-4 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${progress.percent}%`,
                      background: 'linear-gradient(90deg, #4A6CF7, #F59E0B)',
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-[#94A3B8] mb-8">
                  <span>{progress.message}</span>
                  <span className="font-bold gradient-text">{progress.percent}%</span>
                </div>

                {/* Pipeline steps */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { step: 'ai_content', icon: '🧠', label: 'Script' },
                    { step: 'video_gen', icon: '🎥', label: 'Video' },
                    { step: 'voice', icon: '🎙️', label: 'Voice' },
                    { step: 'export', icon: '📦', label: 'Export' },
                  ].map((s, i) => {
                    const stepOrder = ['ai_content', 'video_gen', 'merge', 'voice', 'music', 'subtitles', 'export', 'upload', 'done'];
                    const currentIdx = stepOrder.indexOf(progress.step);
                    const thisIdx = stepOrder.indexOf(s.step);
                    const done = currentIdx > thisIdx;
                    const active = currentIdx === thisIdx;
                    return (
                      <div key={s.step} className={`rounded-lg p-2 text-center transition-all ${done ? 'bg-[rgba(74,108,247,0.2)] border border-[rgba(74,108,247,0.4)]' : active ? 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.4)]' : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]'}`}>
                        <div className="text-lg mb-1">{done ? '✅' : s.icon}</div>
                        <div className={done ? 'text-[#4A6CF7]' : active ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}>{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: DONE ── */}
        {step === 'done' && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview + Actions */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass rounded-2xl p-6 border border-[rgba(74,108,247,0.3)]">
                <div className="badge mb-4 inline-flex" style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.1)' }}>
                  🎉 Reel Ready!
                </div>
                <h2 className="font-display text-3xl text-white mb-4 uppercase">Your Viral Reel</h2>

                {/* Video preview */}
                <div className="aspect-[9/16] bg-[rgba(13,22,40,0.9)] rounded-xl overflow-hidden mb-5 border border-[rgba(74,108,247,0.2)] flex items-center justify-center">
                  {result.downloadUrl ? (
                    <video
                      src={result.downloadUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl mb-3">🎬</div>
                      <p className="text-[#94A3B8] text-sm">Video ready on server</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {result.downloadUrl && (
                    <a href={result.downloadUrl} download className="gold-btn w-full justify-center px-6 py-3 font-bold">
                      ⬇️ Download MP4
                    </a>
                  )}

                  {/* ElevenLabs Voiceover */}
                  {!voiceoverUrl ? (
                    <button
                      onClick={generateVoiceover}
                      disabled={voiceoverLoading}
                      className="blue-btn w-full justify-center px-6 py-3 font-bold disabled:opacity-50"
                    >
                      {voiceoverLoading ? '🎙️ Generating voiceover...' : '🎙️ Generate Voiceover'}
                    </button>
                  ) : (
                    <div className="glass rounded-xl p-3 border border-[rgba(74,108,247,0.3)]">
                      <p className="text-xs text-[#94A3B8] mb-2 font-semibold">🎙️ AI Voiceover Ready</p>
                      <audio controls src={voiceoverUrl} className="w-full" style={{ height: '36px' }} />
                      <a
                        href={voiceoverUrl}
                        download={`voiceover-${result.reelId}.mp3`}
                        className="text-xs text-[#4A6CF7] hover:underline mt-1 block text-center"
                      >
                        ⬇️ Download MP3
                      </a>
                    </div>
                  )}

                  <button onClick={postToInstagram} className="blue-btn w-full justify-center px-6 py-3 font-bold">
                    📸 Post to Instagram
                  </button>
                  <button
                    onClick={() => { setStep('settings'); setResult(null); setImages([]); }}
                    className="ghost-btn w-full justify-center px-6 py-3 font-semibold"
                  >
                    + Create Another Reel
                  </button>
                </div>
              </div>
            </div>

            {/* AI Content */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl border border-[rgba(74,108,247,0.2)] overflow-hidden">
                <div className="flex border-b border-[rgba(74,108,247,0.2)]">
                  {(['script', 'caption', 'scenes'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                        activeTab === tab
                          ? 'text-white bg-[rgba(74,108,247,0.1)] border-b-2 border-[#4A6CF7]'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {tab === 'script' ? '📝 Script' : tab === 'caption' ? '💬 Caption' : '🎥 Scenes'}
                    </button>
                  ))}
                </div>
                <div className="p-6">
                  {activeTab === 'script' && result.content && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-[#4A6CF7] uppercase tracking-wider mb-3">🪝 Hook Variations</h4>
                        {result.content.hooks?.map((hook, i) => (
                          <div key={i} className="bg-[rgba(74,108,247,0.08)] rounded-lg p-3 mb-2 text-sm text-[#94A3B8] border border-[rgba(74,108,247,0.15)]">
                            <span className="text-[#4A6CF7] font-bold mr-2">#{i + 1}</span>{hook}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3">📜 Full Script</h4>
                        <div className="bg-[rgba(13,22,40,0.9)] rounded-xl p-4 text-[#94A3B8] text-sm leading-relaxed whitespace-pre-wrap border border-[rgba(74,108,247,0.15)]">
                          {result.content.script}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'caption' && result.content && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#4A6CF7] uppercase tracking-wider mb-3">📱 Instagram Caption</h4>
                        <div className="bg-[rgba(13,22,40,0.9)] rounded-xl p-4 text-[#94A3B8] text-sm leading-relaxed border border-[rgba(74,108,247,0.15)]">
                          {result.content.caption}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3"># Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.content.hashtags?.map((tag, i) => (
                            <span key={i} className="px-2 py-1 rounded-full text-xs font-semibold text-[#7C9DFF]"
                              style={{ background: 'rgba(74,108,247,0.1)', border: '1px solid rgba(74,108,247,0.2)' }}>
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
                        <div key={i} className="glass rounded-xl p-4 border border-[rgba(74,108,247,0.2)]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[rgba(74,108,247,0.15)] border border-[rgba(74,108,247,0.3)] flex items-center justify-center text-[#4A6CF7] font-bold text-sm">
                              {scene.sceneNumber}
                            </div>
                            <div>
                              <span className="text-white font-semibold text-sm">{scene.title || `Scene ${scene.sceneNumber}`}</span>
                              <span className="text-[#F59E0B] text-xs ml-2">{scene.startTime}s – {scene.startTime + scene.duration}s</span>
                            </div>
                          </div>
                          <p className="text-[#94A3B8] text-sm">{scene.description}</p>
                          {scene.dialogue && (
                            <p className="text-[#7C9DFF] text-xs mt-2 italic">"{scene.dialogue}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
