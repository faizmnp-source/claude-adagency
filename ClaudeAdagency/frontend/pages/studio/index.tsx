'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Logo from '../../components/Logo';

/* ── Bell Icon ── */
const BellIcon = () => (
  <div className="notify-bell">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </div>
);

type Step = 'upload' | 'settings' | 'generating' | 'done';
type Duration = 5 | 15 | 30 | 50;
type PipelineStage = 'script' | 'clips' | 'stitching' | 'ready';
type Mode = 'express' | 'auto' | 'manual' | 'notebook';
type ContentType = 'video' | 'image';

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
  const [contentType, setContentType] = useState<ContentType>('video');

  // ── Advanced Settings ──
  const [customCta, setCustomCta]               = useState('');
  const [seasonalEvent, setSeasonalEvent]       = useState('');
  const [brandVoice, setBrandVoice]             = useState('');
  const [hashtagWhitelist, setHashtagWhitelist] = useState('');
  const [hashtagBlacklist, setHashtagBlacklist] = useState('');
  const [videoStyle, setVideoStyle]             = useState('');
  const [seriesContext, setSeriesContext]        = useState('');
  const [showAdvanced, setShowAdvanced]         = useState(false);

  // ── Manual mode ──
  const [manualPrompt, setManualPrompt] = useState('');
  const [manualCaption, setManualCaption] = useState('');
  const [manualHashtags, setManualHashtags] = useState<string[]>([]);
  const [manualHashtagInput, setManualHashtagInput] = useState('');
  const [hashtagGenLoading, setHashtagGenLoading] = useState(false);

  // ── Notebook mode ──
  const [notebookTopic, setNotebookTopic] = useState('');
  const [notebookAudience, setNotebookAudience] = useState('');
  const [notebookFormat, setNotebookFormat] = useState('Key Concepts');

  // ── Video quality / package selection ──
  const [videoPackage, setVideoPackage]     = useState<string>('creator'); // starter|creator|viral
  const [manualModelKey, setManualModelKey] = useState<string>('wan720p'); // manual model override
  const [videoCostPreview, setVideoCostPreview] = useState<any>(null);

  // ── Viral trend panel (auto mode) ──
  const [viralTrends, setViralTrends]       = useState<any[]>([]);
  const [viralLoading, setViralLoading]     = useState(false);
  const [viralFused, setViralFused]         = useState<any>(null);
  const [showViralPanel, setShowViralPanel] = useState(false);

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

  // ── Image posting state ──
  const [imgPosting, setImgPosting]           = useState(false);
  const [imgPostResult, setImgPostResult]     = useState<{ permalink?: string } | null>(null);
  const [imgPostError, setImgPostError]       = useState('');

  // ── Image state (shared) ──
  const [imgPostType, setImgPostType]         = useState('educational');
  const [imgMode, setImgMode]                 = useState<'express' | 'manual' | 'auto'>('express');
  const [imgFeatures, setImgFeatures]         = useState('');
  const [imgOffer, setImgOffer]               = useState('');
  const [imgDesignStyle, setImgDesignStyle]   = useState('bold');
  const [imgScheduleDay, setImgScheduleDay]   = useState('');
  const [imgScheduleTime, setImgScheduleTime] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imgLoading, setImgLoading]           = useState(false);
  const [imgError, setImgError]               = useState('');
  const [aiReview, setAiReview]               = useState<any>(null);
  const [reviewLoading, setReviewLoading]     = useState(false);
  const [imgCount, setImgCount]               = useState(1);
  const [autoSchedule, setAutoSchedule]       = useState<any[]>([]);
  const [brandName, setBrandName]             = useState('');
  const [region, setRegion]                   = useState('india');
  const [industryCode, setIndustryCode]       = useState('ecommerce');

  const dropRef = useRef<HTMLDivElement>(null);
  const creditCost = duration * 2;

  // ── Video package definitions (mirrors backend VIDEO_PACKAGES) ──────────
  const VIDEO_PACKAGES_FRONTEND = {
    starter: {
      id: 'starter', name: '💰 Starter', tagline: 'Fast & Budget-Friendly',
      resolution: '480p', voice: false, music: false,
      color: '#10B981',
      features: ['Wan 2.1 480p', 'Fast (~3 min)', 'No voice/music'],
      creditsPerSecond: 3,  // 1.5× Replicate: $0.22×1.5×₹85/5s÷₹2 ≈ 3 cr/s
    },
    creator: {
      id: 'creator', name: '⚡ Creator', tagline: 'Professional + AI Voice',
      resolution: '720p', voice: true, music: false,
      color: '#4A6CF7',
      features: ['Wan 2.1 720p', 'ElevenLabs Voice', '~5 min'],
      creditsPerSecond: 7,  // 1.5× Replicate: $0.45×1.5×₹85/5s÷₹2 ≈ 6 + 1 voice = 7 cr/s
    },
    viral: {
      id: 'viral', name: '🚀 Viral', tagline: 'Luma 1080p + Voice + Music',
      resolution: '1080p', voice: true, music: true,
      color: '#F59E0B',
      features: ['Luma Dream Machine', 'Voice + Music', '~7 min'],
      creditsPerSecond: 4,  // 1.5× Replicate: $0.19×1.5×₹85/5s÷₹2 ≈ 2 + 2 audio = 4 cr/s
    },
    ultra: {
      id: 'ultra', name: '🌟 Ultra', tagline: 'Google Veo 2 + Full Audio',
      resolution: '1080p', voice: true, music: true,
      color: '#8B5CF6',
      features: ['Google Veo 2', 'Voice + Music', '~10 min'],
      creditsPerSecond: 8,  // 1.5× Replicate: $0.50×1.5×₹85/5s÷₹2 ≈ 6 + 2 audio = 8 cr/s
    },
  } as const;

  const MANUAL_MODELS_FRONTEND = [
    { key: 'wan480p',    label: '💰 Wan 2.1 480p',       usdPerClip: 0.22, res: '480p',  clipSec: 5 },
    { key: 'wan720p',    label: '⚡ Wan 2.1 720p',       usdPerClip: 0.45, res: '720p',  clipSec: 5 },
    { key: 'luma_flash', label: '⚡ Luma Ray Flash',     usdPerClip: 0.10, res: '1080p', clipSec: 5 },
    { key: 'luma',       label: '🚀 Luma Dream Machine', usdPerClip: 0.19, res: '1080p', clipSec: 5 },
    { key: 'kling',      label: '🎬 Kling v2.5',         usdPerClip: 0.35, res: '1080p', clipSec: 5 },
    { key: 'minimax',    label: '✨ Minimax Hailuo',      usdPerClip: 0.28, res: '720p',  clipSec: 6 },
    { key: 'veo2_flash', label: '🌐 Veo 2 Flash',        usdPerClip: 0.25, res: '720p',  clipSec: 5 },
    { key: 'veo2',       label: '🌟 Google Veo 2',       usdPerClip: 0.50, res: '1080p', clipSec: 5 },
  ];

  /** Calculate video credit cost for selected package / model */
  const calcVideoCredits = (pkgId: string | null, mKey: string | null, dur: number) => {
    const USD_TO_INR = 85;
    const CREDIT_TO_INR = 2;
    const REPLICATE_MARKUP = 1.5;
    if (pkgId && VIDEO_PACKAGES_FRONTEND[pkgId as keyof typeof VIDEO_PACKAGES_FRONTEND]) {
      const pkg = VIDEO_PACKAGES_FRONTEND[pkgId as keyof typeof VIDEO_PACKAGES_FRONTEND];
      return {
        credits: pkg.creditsPerSecond * dur,
        inr: pkg.creditsPerSecond * dur * CREDIT_TO_INR,
      };
    }
    const model = MANUAL_MODELS_FRONTEND.find(m => m.key === mKey) || MANUAL_MODELS_FRONTEND[1];
    const clips = Math.ceil(dur / model.clipSec);
    const inr = Math.round(clips * model.usdPerClip * USD_TO_INR * REPLICATE_MARKUP);
    return { credits: Math.ceil(inr / CREDIT_TO_INR), inr };
  };

  // ── On load ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const igStatus = params.get('instagram');
    const urlError = params.get('error');

    if (urlToken) { localStorage.setItem('cs_token', urlToken); window.history.replaceState({}, '', '/studio'); }
    if (igStatus === 'connected') {
      window.history.replaceState({}, '', '/studio');
      // Re-fetch Instagram status so header shows connected immediately
      const t = localStorage.getItem('cs_token');
      if (t) fetch(`${REEL_ENGINE_URL}/api/auth/instagram/status`, { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.json()).then(d => { if (d.connected) setInstagram(d); }).catch(() => {});
    }
    if (urlError) {
      const msgs: Record<string, string> = {
        instagram_denied: 'Instagram connection was cancelled.',
        instagram_token_failed: 'Instagram auth failed. Try again.',
        no_ig_business_account: 'No Instagram Business account found. Link your IG to a Facebook Page first.',
        meta_not_configured: 'Instagram posting not yet configured.',
        instagram_server_error: 'Server error connecting Instagram.',
      };
      const reason = params.get('reason');
      const msg = msgs[urlError] || `Auth error: ${urlError}`;
      setError(reason ? `${msg} (Reason: ${reason})` : msg);
      window.history.replaceState({}, '', '/studio');
    }

    const token = localStorage.getItem('cs_token');

    // Auth gate — no token means not logged in; redirect to login
    if (!token) {
      router.replace('/login');
      return;
    }

    fetch(`${REEL_ENGINE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.id) {
          setUser({ name: d.name, email: d.email, picture: d.picture });
          if (d.credits !== undefined) setCredits(d.credits);
          if (d.instagram) setInstagram(d.instagram);
        } else {
          // Token is invalid/expired — send to login
          localStorage.removeItem('cs_token');
          router.replace('/login');
        }
      })
      .catch(() => {
        // Network error — still try credits endpoint as fallback
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
        body: JSON.stringify({
          images: imageData,
          productDescription: productDescription || vision,
          duration,
          voice,
          music,
          tone,
          customCta: customCta || undefined,
          seasonalEvent: seasonalEvent || undefined,
          brandVoice: brandVoice || undefined,
          hashtagWhitelist: hashtagWhitelist || undefined,
          hashtagBlacklist: hashtagBlacklist || undefined,
          videoStyle: videoStyle || undefined,
          seriesContext: seriesContext || undefined,
        }),
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
        body: JSON.stringify(
          mode === 'manual'
            ? { modelKey: manualModelKey }
            : { packageId: videoPackage }
        ),
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

  // ── Image Studio: generate images ──
  const handleGenerateImages = async () => {
    setImgLoading(true);
    setImgError('');
    setGeneratedImages([]);
    setAiReview(null);
    try {
      const token = getAuthToken();
      const payload = {
        postType: imgPostType,
        productDescription,
        brandName,
        features: imgFeatures.split(',').map((f: string) => f.trim()).filter(Boolean),
        offer: imgOffer,
        region,
        industry: industryCode,
        designStyle: imgDesignStyle,
        mode: imgMode,
        count: imgCount,
        ...(imgMode === 'manual' && { scheduleDay: imgScheduleDay, scheduleTime: imgScheduleTime }),
      };
      const res = await fetch(`${REEL_ENGINE_URL}/api/images/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image generation failed');
      setGeneratedImages(data.images.map((img: any) => img.imageUrl));
      if (data.schedule) setAutoSchedule(data.schedule);
    } catch (err: any) {
      setImgError(err.message);
    } finally {
      setImgLoading(false);
    }
  };

  // ── Manual mode: generate images — AI enhances prompt first, then Replicate generates ──
  const handleManualImageGenerate = async () => {
    setImgLoading(true);
    setImgError('');
    setGeneratedImages([]);
    try {
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      // Step 1: AI enhances the raw prompt into a high-quality image generation prompt
      const enhanceRes = await fetch(`${REEL_ENGINE_URL}/api/images/enhance-prompt`, {
        method: 'POST', headers,
        body: JSON.stringify({ rawPrompt: manualPrompt, region, industry: industryCode }),
      });
      const enhanceData = await enhanceRes.json();
      const finalPrompt = enhanceData.enhancedPrompt || manualPrompt;

      // Step 2: Generate image with the enhanced prompt
      const res = await fetch(`${REEL_ENGINE_URL}/api/images/generate`, {
        method: 'POST', headers,
        body: JSON.stringify({ customPrompt: finalPrompt, mode: 'manual', count: imgCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image generation failed');
      setGeneratedImages(data.images.map((img: any) => img.imageUrl));
    } catch (err: any) {
      setImgError(err.message);
    } finally {
      setImgLoading(false);
    }
  };

  // ── Manual mode: AI hashtag assistant ──
  const generateHashtags = async () => {
    setHashtagGenLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${REEL_ENGINE_URL}/api/images/hashtags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          topic: manualPrompt || productDescription,
          region,
          industry: industryCode,
          brandName,
          count: 30,
        }),
      });
      const data = await res.json();
      if (data.hashtags && Array.isArray(data.hashtags)) {
        setManualHashtags(prev => {
          const existing = new Set(prev);
          return [...prev, ...(data.hashtags as string[]).filter(t => !existing.has(t))];
        });
      } else {
        throw new Error(data.error || 'No hashtags returned');
      }
    } catch (err: any) {
      setImgError('Hashtag generation failed: ' + err.message);
    } finally {
      setHashtagGenLoading(false);
    }
  };

  const addManualHashtag = () => {
    const tag = manualHashtagInput.trim().replace(/^#*/, '#');
    if (tag.length > 1 && !manualHashtags.includes(tag)) {
      setManualHashtags(prev => [...prev, tag]);
    }
    setManualHashtagInput('');
  };

  const removeManualHashtag = (tag: string) => {
    setManualHashtags(prev => prev.filter(t => t !== tag));
  };

  // ── Viral trend panel ──
  const fetchViralTrends = async () => {
    setViralLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${REEL_ENGINE_URL}/api/viral/trends?region=${region}&industry=${industryCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setViralTrends(data.trends?.slice(0, 3) || []);
    } catch { /* silent */ } finally { setViralLoading(false); }
  };

  const applyViralTrend = async (trend: any) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${REEL_ENGINE_URL}/api/viral/fuse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productDescription,
          brandName,
          trendTopic: trend.topic,
          trendAngle: trend.exampleHook,
          duration,
          region,
          industryCode,
        }),
      });
      const data = await res.json();
      setViralFused(data);
    } catch { /* silent */ }
  };

  // ── Post image to Instagram ──
  const handlePostImage = async (imageUrl: string) => {
    setImgPosting(true);
    setError(null);
    setImgPostResult(null);
    try {
      const token = getAuthToken();
      const res = await fetch(`${REEL_ENGINE_URL}/api/images/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          imageUrl,
          caption: manualCaption || productDescription || '',
          hashtags: manualHashtags,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Post failed');
      setImgPostResult(data);
      // Show success in the main error banner (reusing it as notification)
      setError(null);
      alert(`✅ Posted to Instagram! View at: ${data.permalink || 'your Instagram feed'}`);
    } catch (e: any) {
      setError(`Instagram post failed: ${e.message}`);
    } finally {
      setImgPosting(false);
    }
  };

  // ── Image Studio: AI review ──
  const handleImageReview = async () => {
    if (!generatedImages.length) return;
    setReviewLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${REEL_ENGINE_URL}/api/images/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          content: { imageUrls: generatedImages, postType: imgPostType, designStyle: imgDesignStyle },
          postType: imgPostType,
          brandName,
          region,
          industry: industryCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Review failed');
      setAiReview(data.review);
    } catch (err: any) {
      setImgError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="studio-app-shell">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(17,17,17,0.08)', boxShadow: '0 14px 36px rgba(35,25,17,0.06)' }}>
        <div className="studio-topbar max-w-7xl mx-auto px-4" style={{ minHeight: '88px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div className="studio-header-links flex items-center gap-3">
            <Link href="/" className="flex items-center" style={{ textDecoration: 'none' }}>
              <Logo variant="horizontal" size="small" color="color" />
            </Link>
            <Link href="/services/instagram-reels"
              style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >Services →</Link>
            <Link href="/pricing"
              style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >Pricing →</Link>
            <Link href="/studio/calendar"
              style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >📅 Calendar →</Link>
          </div>

          <div className="studio-header-meta flex items-center gap-3">
            {/* Instagram badge */}
            {instagram.connected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(227,100,20,0.08)', border: '1px solid rgba(227,100,20,0.22)' }}>
                <span className="text-[var(--accent)]">📸</span>
                <span className="text-[var(--forest)] hidden sm:block">@{instagram.username || 'IG'}</span>
                <button onClick={disconnectInstagram} className="text-[#94A3B8] hover:text-red-400 ml-1">✕</button>
              </div>
            ) : (
              <button onClick={connectInstagram}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(17,17,17,0.08)', color: 'var(--muted)' }}>
                📸 Connect IG
              </button>
            )}

            {/* Credits */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(17,17,17,0.08)' }}>
              <span className="text-[#94A3B8] text-xs">Credits:</span>
              <span className="font-bold purple-gradient-text text-sm">{credits}</span>
            </div>

            {/* User avatar */}
            {user && user.picture ? (
              <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-[rgba(227,100,20,0.26)]" />
            ) : user ? (
              <div className="w-8 h-8 rounded-full bg-[rgba(227,100,20,0.14)] flex items-center justify-center text-[var(--forest)] text-sm font-bold">{user.name?.[0] || 'U'}</div>
            ) : null}

            <BellIcon />
          </div>
        </div>
      </header>

      <div className="studio-content-frame max-w-7xl mx-auto px-4 py-6 relative z-10">

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl p-4 flex items-start gap-3 max-w-lg mx-auto" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
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
            ═══════════════════════════════════ */}
        {(step === 'upload' || step === 'settings') && (
          <div className="studio-phone-shell">

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="display" style={{ fontSize: 'clamp(48px, 8vw, 84px)', color: 'var(--ink)', marginBottom: '12px' }}>AI Studio</h1>
              <p className="text-[#94A3B8] text-sm" style={{ maxWidth: '420px', margin: '0 auto' }}>
                Create scroll-stopping reels and image posts inside a tighter studio canvas built for content review.
              </p>
            </div>

            {/* ── Content Type Selector (Video / Image) ── */}
            <div className="flex justify-center mb-6">
              <div className="studio-segmented-toggle">
                <button
                  onClick={() => setContentType('video')}
                  className={contentType === 'video' ? 'is-active' : ''}
                >
                  🎬 Video Reel
                </button>
                <button
                  onClick={() => setContentType('image')}
                  className={contentType === 'image' ? 'is-active' : ''}
                >
                  🖼️ Image Post
                </button>
              </div>
            </div>

            <div className="studio-phone-stage">
              {contentType === 'video' && (
                <div className="mb-6">
                  <div className="studio-preview-placeholder">
                    <div
                      style={{
                        position: 'absolute',
                        inset: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '36px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '24px',
                          display: 'grid',
                          placeItems: 'center',
                          background: 'rgba(11,43,38,0.92)',
                          color: '#fff',
                          boxShadow: '0 18px 42px rgba(11,43,38,0.16)',
                          fontSize: '28px',
                        }}
                      >
                        ▶
                      </div>
                      <div className="eyebrow" style={{ color: 'var(--accent)' }}>Reel Preview Placeholder</div>
                      <p style={{ color: 'var(--ink)', fontSize: '18px', fontWeight: 700 }}>
                        Your uploaded video reel will sit here
                      </p>
                      <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px' }}>
                        We are keeping space for your own built video content so you can preview it in a portrait mobile frame.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Mode selector ── */}
              <div className="mb-6">
                <label className="text-sm text-[#94A3B8] mb-3 block">Mode</label>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { key: 'express'  as Mode, icon: '⚡',  label: 'Express'  },
                    { key: 'manual'   as Mode, icon: '✏️',  label: 'Manual'   },
                    { key: 'auto'     as Mode, icon: '🎬',  label: 'Auto'     },
                    { key: 'notebook' as Mode, icon: '📚',  label: 'Notebook' },
                  ]).map(m => (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`mode-pill flex-1 justify-center ${mode === m.key ? 'mode-pill-active' : ''}`}
                      style={{ minWidth: '70px' }}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

            {/* ═══════════════
                MANUAL MODE
                ═══════════════ */}
            {mode === 'manual' && (
              <div className="space-y-5">

                {/* Free-form prompt */}
                {contentType === 'video' ? (
                  <div>
                    <label className="dark-input-label">Describe your video...</label>
                    <textarea
                      value={manualPrompt}
                      onChange={e => setManualPrompt(e.target.value)}
                      placeholder="Describe exactly what you want — scene by scene, mood, style, dialogue. The AI will generate it exactly as you envision."
                      className="dark-input"
                      rows={6}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="dark-input-label">Describe your image...</label>
                    <textarea
                      value={manualPrompt}
                      onChange={e => setManualPrompt(e.target.value)}
                      placeholder="Describe the image you want — subject, style, mood, colors, composition. Complete creative control."
                      className="dark-input"
                      rows={6}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                )}

                {/* Duration (video) or image count (image) */}
                {contentType === 'video' ? (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Duration</label>
                    <div className="flex gap-3">
                      {([5, 15, 30, 50] as Duration[]).map((d) => (
                        <button key={d} onClick={() => setDuration(d)}
                          className={`mode-pill flex-1 justify-center ${duration === d ? 'mode-pill-active' : ''}`}>
                          {d === 5 ? '5s ⚡' : `${d}s`} <span className="text-xs text-[#94A3B8] ml-1">({d * 2}cr)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Number of Images</label>
                    <div className="flex gap-3">
                      {([1, 2, 4] as number[]).map(n => (
                        <button key={n} onClick={() => setImgCount(n)}
                          className={`mode-pill flex-1 justify-center ${imgCount === n ? 'mode-pill-active' : ''}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Video Model Selector */}
                {contentType === 'video' && (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-2 block">🎬 Video Model</label>
                    <select
                      value={manualModelKey}
                      onChange={e => setManualModelKey(e.target.value)}
                      className="dark-input"
                    >
                      {MANUAL_MODELS_FRONTEND.map(m => {
                        const cost = calcVideoCredits(null, m.key, duration);
                        return (
                          <option key={m.key} value={m.key}>
                            {m.label} · {m.res} · +{cost.credits}cr (≈₹{cost.inr})
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-xs text-[#94A3B8] mt-2">
                      Script: {creditCost} cr + Video: {calcVideoCredits(null, manualModelKey, duration).credits} cr = <strong className="text-white">{creditCost + calcVideoCredits(null, manualModelKey, duration).credits} total</strong>
                    </p>
                  </div>
                )}

                {/* AI Hashtag Assistant */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(229,9,20,0.04)', border: '1px solid rgba(229,9,20,0.15)' }}>
                  <p className="text-sm font-bold text-white mb-3">✨ AI Hashtag Assistant</p>
                  <button
                    onClick={generateHashtags}
                    disabled={hashtagGenLoading || !manualPrompt.trim()}
                    className="w-full py-2 rounded-lg text-sm font-bold mb-3 transition-all disabled:opacity-50"
                    style={{ background: 'rgba(229,9,20,0.12)', border: '1px solid rgba(229,9,20,0.3)', color: '#E50914' }}
                  >
                    {hashtagGenLoading ? '⏳ Generating...' : '✨ Generate Hashtags'}
                  </button>

                  {/* Generated hashtags as chips */}
                  {manualHashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {manualHashtags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(123,46,255,0.1)', border: '1px solid rgba(123,46,255,0.25)', color: '#C084FC' }}>
                          {tag}
                          <button onClick={() => removeManualHashtag(tag)} className="ml-1 text-[#94A3B8] hover:text-red-400">✕</button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Custom hashtag input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualHashtagInput}
                      onChange={e => setManualHashtagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addManualHashtag()}
                      placeholder="Add your own hashtag"
                      className="dark-input flex-1"
                      style={{ marginBottom: 0 }}
                    />
                    <button
                      onClick={addManualHashtag}
                      className="px-4 py-2 rounded-lg text-sm font-bold"
                      style={{ background: '#E50914', color: '#fff', whiteSpace: 'nowrap' }}
                    >+</button>
                  </div>
                </div>

                {/* Optional caption */}
                <div>
                  <label className="dark-input-label">Caption (optional)</label>
                  <textarea
                    value={manualCaption}
                    onChange={e => setManualCaption(e.target.value)}
                    placeholder="Write your caption, or leave blank for AI-generated"
                    className="dark-input"
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Generate & Preview button */}
                <button
                  onClick={contentType === 'image' ? handleManualImageGenerate : startGeneration}
                  disabled={!manualPrompt.trim() || (contentType === 'video' && images.length === 0) || imgLoading}
                  className="neon-btn w-full disabled:opacity-50"
                >
                  {imgLoading ? '⏳ Generating...' : 'Generate & Preview'}
                </button>

                {/* Video needs images */}
                {contentType === 'video' && (
                  <div className="mb-2">
                    <label className="dark-input-label">Product Images</label>
                    <div
                      ref={dropRef}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="studio-dropzone rounded-xl p-5 text-center cursor-pointer"
                      onClick={() => document.getElementById('file-input-manual')?.click()}
                    >
                      {images.length === 0 ? (
                        <>
                          <div className="text-2xl mb-2">🖼️</div>
                          <p className="text-[var(--forest)] text-sm font-semibold">Upload product images</p>
                          <p className="text-[#94A3B8] text-xs">Up to 10 images (JPG, PNG, WEBP)</p>
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {images.map((img, idx) => (
                            <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden group" style={{ border: '1px solid rgba(17,17,17,0.08)' }}>
                              <img src={img.preview} alt="" className="w-full h-full object-cover" />
                              <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                            </div>
                          ))}
                          <div className="w-14 h-14 rounded-lg flex items-center justify-center text-[#94A3B8] text-xl" style={{ border: '1px dashed rgba(17,17,17,0.12)' }}>+</div>
                        </div>
                      )}
                      <input id="file-input-manual" type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => addImages(Array.from(e.target.files || []))} />
                    </div>
                  </div>
                )}

                {/* Generated image results */}
                {contentType === 'image' && generatedImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Generated Images</h3>
                    <div className={`grid gap-3 ${generatedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {generatedImages.map((url, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden group"
                          style={{ aspectRatio: '1/1', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={url} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <a href={url} download={`image-${i + 1}.webp`} target="_blank" rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg text-xs font-bold text-white"
                              style={{ background: '#E50914' }}>
                              ⬇️ Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => generatedImages[0] && handlePostImage(generatedImages[0])}
                      disabled={imgPosting || !generatedImages.length}
                      className="neon-btn w-full mt-4 disabled:opacity-50"
                    >
                      {imgPosting ? '⏳ Posting...' : '📸 Post to Instagram'}
                    </button>
                  </div>
                )}

                {imgError && (
                  <div className="rounded-xl p-3 text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {imgError}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════
                EXPRESS MODE
                ═══════════════ */}
            {mode === 'express' && (
              <div className="space-y-5">
                {/* Product input */}
                <div>
                  <label className="dark-input-label">Product</label>
                  <input
                    type="text"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Enter the product details..."
                    className="dark-input"
                  />
                </div>

                {/* Brand Name */}
                <div>
                  <label className="dark-input-label">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. MyBrand"
                    className="dark-input"
                  />
                </div>

                {/* Image upload */}
                {contentType === 'video' && (
                  <div>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="studio-dropzone rounded-xl p-5 text-center cursor-pointer"
                      onClick={() => document.getElementById('file-input-express')?.click()}
                    >
                      {images.length === 0 ? (
                        <>
                          <div className="text-2xl mb-2">🖼️</div>
                          <p className="text-[var(--forest)] text-sm font-semibold">Upload product images</p>
                          <p className="text-[#94A3B8] text-xs">Up to 10 images (JPG, PNG, WEBP)</p>
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {images.map((img, idx) => (
                            <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden group" style={{ border: '1px solid rgba(17,17,17,0.08)' }}>
                              <img src={img.preview} alt="" className="w-full h-full object-cover" />
                              <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                            </div>
                          ))}
                          <div className="w-14 h-14 rounded-lg flex items-center justify-center text-[#94A3B8] text-xl" style={{ border: '1px dashed rgba(17,17,17,0.12)' }}>+</div>
                        </div>
                      )}
                      <input id="file-input-express" type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => addImages(Array.from(e.target.files || []))} />
                    </div>
                  </div>
                )}

                {/* Duration (video) or image count (image) */}
                {contentType === 'video' ? (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Duration</label>
                    <div className="flex gap-3">
                      {([5, 15, 30, 50] as Duration[]).map((d) => (
                        <button key={d} onClick={() => setDuration(d)}
                          className={`mode-pill flex-1 justify-center ${duration === d ? 'mode-pill-active' : ''}`}>
                          {d === 5 ? '5s ⚡' : `${d}s`} <span className="text-xs text-[#94A3B8] ml-1">({d * 2}cr)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Number of Images</label>
                    <div className="flex gap-3">
                      {([1, 2, 4] as number[]).map(n => (
                        <button key={n} onClick={() => setImgCount(n)}
                          className={`mode-pill flex-1 justify-center ${imgCount === n ? 'mode-pill-active' : ''}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Video Package Selector (express video mode) ── */}
                {contentType === 'video' && (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-2 block">🎬 Video Package</label>
                    <select
                      value={videoPackage}
                      onChange={e => setVideoPackage(e.target.value)}
                      className="dark-input"
                    >
                      {Object.values(VIDEO_PACKAGES_FRONTEND).map(pkg => {
                        const cost = calcVideoCredits(pkg.id, null, duration);
                        return (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} · {pkg.resolution} · +{cost.credits}cr (≈₹{cost.inr})
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-xs text-[#94A3B8] mt-2">
                      Script: {creditCost} cr + Video: {calcVideoCredits(videoPackage, null, duration).credits} cr = <strong className="text-white">{creditCost + calcVideoCredits(videoPackage, null, duration).credits} total credits</strong>
                    </p>
                  </div>
                )}

                {/* Generate button */}
                {contentType === 'video' ? (
                  credits < creditCost ? (
                    <div className="space-y-3">
                      <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                        Need {creditCost - credits} more credits
                      </div>
                      <Link href="/studio/credits" className="neon-btn w-full">Buy Credits</Link>
                    </div>
                  ) : (
                    <button onClick={startGeneration} disabled={images.length === 0} className="neon-btn w-full disabled:opacity-50">
                      Start Creating
                    </button>
                  )
                ) : (
                  <button onClick={handleGenerateImages} disabled={imgLoading || !productDescription} className="neon-btn w-full disabled:opacity-50">
                    {imgLoading ? '⏳ Generating...' : 'Generate Images ✨'}
                  </button>
                )}

                {imgError && (
                  <div className="rounded-xl p-3 text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {imgError}
                  </div>
                )}

                {/* Generated images (express image mode) */}
                {contentType === 'image' && generatedImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Generated Images</h3>
                    <div className={`grid gap-3 ${generatedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {generatedImages.map((url, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden group"
                          style={{ aspectRatio: '1/1', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={url} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={url} download={`image-${i + 1}.webp`} target="_blank" rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#E50914' }}>
                              ⬇️ Download
                            </a>
                            <button
                              onClick={() => handlePostImage(url)}
                              disabled={imgPosting}
                              className="px-3 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
                              {imgPosting ? '⏳' : '📲 Post to IG'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════
                AUTO MODE
                ═══════════════ */}
            {mode === 'auto' && (
              <AutoCalendarMode
                REEL_ENGINE_URL={REEL_ENGINE_URL}
                onSelectPost={(post: any) => {
                  // Pre-fill studio fields from calendar post and switch to express mode
                  setProductDescription(post.script || post.angle || '');
                  setBrandName(post.brandName || brandName);
                  setVision(post.angle || '');
                  setMode('express');
                }}
              />
            )}

            {/* ── Hidden: auto mode used to have these fields, now replaced by calendar ── */}
            {false && (
              <div className="space-y-5">
                {/* Product input */}
                <div>
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
                <div>
                  <label className="dark-input-label">Vision</label>
                  <input
                    type="text"
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Describe the vision for your reel..."
                    className="dark-input"
                  />
                </div>

                {/* Brand Name */}
                <div>
                  <label className="dark-input-label">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. MyBrand"
                    className="dark-input"
                  />
                </div>

                {/* Image upload (video) */}
                {contentType === 'video' && (
                  <div>
                    <div
                      ref={dropRef}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="rounded-xl p-5 text-center cursor-pointer transition-all hover:border-[rgba(123,46,255,0.4)]"
                      style={{ border: '1px dashed rgba(255,255,255,0.15)', background: 'rgba(13,22,40,0.4)' }}
                      onClick={() => document.getElementById('file-input-auto')?.click()}
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
                      <input id="file-input-auto" type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => addImages(Array.from(e.target.files || []))} />
                    </div>
                  </div>
                )}

                {/* Duration (video) or image count (image) */}
                {contentType === 'video' ? (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Duration</label>
                    <div className="flex gap-3">
                      {([5, 15, 30, 50] as Duration[]).map((d) => (
                        <button key={d} onClick={() => setDuration(d)}
                          className={`mode-pill flex-1 justify-center ${duration === d ? 'mode-pill-active' : ''}`}>
                          {d === 5 ? '5s ⚡' : `${d}s`} <span className="text-xs text-[#94A3B8] ml-1">({d * 2}cr)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Number of Images</label>
                    <div className="flex gap-3">
                      {([1, 2, 4] as number[]).map(n => (
                        <button key={n} onClick={() => setImgCount(n)}
                          className={`mode-pill flex-1 justify-center ${imgCount === n ? 'mode-pill-active' : ''}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tone */}
                <div>
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

                {/* Region */}
                <div>
                  <label className="dark-input-label">Region</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} className="dark-input">
                    <option value="india">India</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="global">Global</option>
                  </select>
                </div>

                {/* Industry */}
                <div>
                  <label className="dark-input-label">Industry</label>
                  <select value={industryCode} onChange={e => setIndustryCode(e.target.value)} className="dark-input">
                    <option value="ecommerce">E-Commerce</option>
                    <option value="food">Food &amp; Beverage</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty &amp; Wellness</option>
                    <option value="tech">Technology</option>
                    <option value="education">Education</option>
                    <option value="fitness">Fitness</option>
                    <option value="realestate">Real Estate</option>
                    <option value="finance">Finance</option>
                    <option value="travel">Travel</option>
                  </select>
                </div>

                {/* ── Advanced Settings ── */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(v => !v)}
                    className="flex items-center gap-2 text-sm font-semibold w-full mb-3"
                    style={{ color: showAdvanced ? '#E50914' : 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#E50914' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    Advanced Settings
                  </button>

                  {showAdvanced && (
                    <div className="space-y-5" style={{ animation: 'fadeIn 0.2s ease' }}>

                      {/* Video Style */}
                      <div>
                        <label className="text-xs text-[#94A3B8] mb-2 block font-medium uppercase tracking-wide">Video Style</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'cinematic',     label: 'Cinematic'    },
                            { value: 'fast-cut',      label: 'Fast-Cut'     },
                            { value: 'documentary',   label: 'Documentary'  },
                            { value: 'minimalist',    label: 'Minimalist'   },
                            { value: 'ugc',           label: 'UGC'          },
                            { value: 'talking-head',  label: 'Talking Head' },
                          ].map(s => (
                            <button
                              key={s.value}
                              onClick={() => setVideoStyle(videoStyle === s.value ? '' : s.value)}
                              className={`mode-pill ${videoStyle === s.value ? 'mode-pill-active' : ''}`}
                            >{s.label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Seasonal Event */}
                      <div>
                        <label className="text-xs text-[#94A3B8] mb-2 block font-medium uppercase tracking-wide">Seasonal Event</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: 'diwali',        label: '🪔 Diwali'         },
                            { value: 'holi',          label: '🎨 Holi'           },
                            { value: 'eid',           label: '🌙 Eid'            },
                            { value: 'christmas',     label: '🎄 Christmas'      },
                            { value: 'newyear',       label: '🎆 New Year'       },
                            { value: 'blackfriday',   label: '🛍️ Black Friday'   },
                            { value: 'valentines',    label: '💝 Valentine\'s'   },
                            { value: 'productlaunch', label: '🚀 Product Launch' },
                            { value: 'sale',          label: '💸 Sale'           },
                          ].map(e => (
                            <button
                              key={e.value}
                              onClick={() => setSeasonalEvent(seasonalEvent === e.value ? '' : e.value)}
                              className={`mode-pill ${seasonalEvent === e.value ? 'mode-pill-active' : ''}`}
                            >{e.label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Custom CTA */}
                      <div>
                        <label className="dark-input-label">Custom CTA</label>
                        <input
                          type="text"
                          value={customCta}
                          onChange={e => setCustomCta(e.target.value)}
                          placeholder="e.g. Shop now at link in bio →"
                          className="dark-input"
                        />
                      </div>

                      {/* Brand Voice */}
                      <div>
                        <label className="dark-input-label">Brand Voice</label>
                        <textarea
                          value={brandVoice}
                          onChange={e => setBrandVoice(e.target.value)}
                          placeholder="Describe your brand personality... e.g. Bold, youthful, anti-corporate. Think Zomato's Twitter tone."
                          className="dark-input"
                          rows={3}
                          style={{ resize: 'vertical' }}
                        />
                      </div>

                      {/* Hashtag Whitelist */}
                      <div>
                        <label className="dark-input-label">Hashtag Whitelist</label>
                        <input
                          type="text"
                          value={hashtagWhitelist}
                          onChange={e => setHashtagWhitelist(e.target.value)}
                          placeholder="#YourBrand, #YourCampaign (always included)"
                          className="dark-input"
                        />
                      </div>

                      {/* Hashtag Blacklist */}
                      <div>
                        <label className="dark-input-label">Hashtag Blacklist</label>
                        <input
                          type="text"
                          value={hashtagBlacklist}
                          onChange={e => setHashtagBlacklist(e.target.value)}
                          placeholder="#competitors, #avoid (never used)"
                          className="dark-input"
                        />
                      </div>

                      {/* Series / Campaign Context */}
                      <div>
                        <label className="dark-input-label">Series / Campaign Context</label>
                        <textarea
                          value={seriesContext}
                          onChange={e => setSeriesContext(e.target.value)}
                          placeholder="e.g. Post 3 of 5 in Diwali sale series. Previous posts covered discounts and new arrivals."
                          className="dark-input"
                          rows={3}
                          style={{ resize: 'vertical' }}
                        />
                      </div>

                    </div>
                  )}
                </div>

                {/* ── Viral Trend Panel (Auto mode only) ── */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(229,9,20,0.2)' }}>
                  <button
                    onClick={() => setShowViralPanel(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold"
                    style={{ background: 'rgba(229,9,20,0.06)', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    <span>🔥 Ride the Wave — Viral Trend Suggestions</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: showViralPanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {showViralPanel && (
                    <div className="p-4 space-y-3" style={{ background: 'rgba(13,22,40,0.4)' }}>
                      {viralFused && (
                        <div className="rounded-lg p-3 text-xs text-green-400 font-semibold"
                          style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                          ✓ Viral angle applied — enriched prompt ready
                        </div>
                      )}

                      <button
                        onClick={fetchViralTrends}
                        disabled={viralLoading}
                        className="w-full py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                        style={{ background: 'rgba(229,9,20,0.12)', border: '1px solid rgba(229,9,20,0.3)', color: '#E50914' }}
                      >
                        {viralLoading ? '⏳ Fetching...' : '🔥 Fetch Trends'}
                      </button>

                      {viralTrends.map((trend, i) => (
                        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(13,22,40,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-white text-sm font-bold">{trend.topic}</p>
                              {trend.category && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                  style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.25)', color: '#E50914' }}>
                                  {trend.category}
                                </span>
                              )}
                            </div>
                            {trend.fitScore !== undefined && (
                              <div className="text-right shrink-0">
                                <p className="text-xs text-[#94A3B8]">Fit</p>
                                <p className="font-bold text-sm" style={{ color: trend.fitScore >= 70 ? '#22c55e' : trend.fitScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                                  {trend.fitScore}%
                                </p>
                              </div>
                            )}
                          </div>
                          {trend.exampleHook && (
                            <p className="text-xs text-[#94A3B8] mb-3 italic">"{trend.exampleHook}"</p>
                          )}
                          <button
                            onClick={() => applyViralTrend(trend)}
                            className="w-full py-2 rounded-lg text-xs font-bold transition-all"
                            style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.25)', color: '#E50914' }}
                          >
                            Use This Trend →
                          </button>
                        </div>
                      ))}

                      {viralTrends.length === 0 && !viralLoading && (
                        <p className="text-xs text-[#94A3B8] text-center py-2">Click "Fetch Trends" to load viral content angles for your region and industry.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Video Package Selector (auto video mode) ── */}
                {contentType === 'video' && (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-2 block">🎬 Video Package</label>
                    <select
                      value={videoPackage}
                      onChange={e => setVideoPackage(e.target.value)}
                      className="dark-input"
                    >
                      {Object.values(VIDEO_PACKAGES_FRONTEND).map(pkg => {
                        const cost = calcVideoCredits(pkg.id, null, duration);
                        return (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} · {pkg.resolution} · +{cost.credits}cr (≈₹{cost.inr})
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-xs text-[#94A3B8] mt-2">
                      Script: {creditCost} cr + Video: {calcVideoCredits(videoPackage, null, duration).credits} cr = <strong className="text-white">{creditCost + calcVideoCredits(videoPackage, null, duration).credits} total credits</strong>
                    </p>
                  </div>
                )}

                {/* Generate button */}
                {contentType === 'video' ? (
                  credits < creditCost ? (
                    <div className="space-y-3">
                      <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                        Need {creditCost - credits} more credits
                      </div>
                      <Link href="/studio/credits" className="neon-btn w-full">Buy Credits</Link>
                    </div>
                  ) : (
                    <button onClick={startGeneration} disabled={images.length === 0} className="neon-btn w-full disabled:opacity-50">
                      Start Creating
                    </button>
                  )
                ) : (
                  <button onClick={handleGenerateImages} disabled={imgLoading || !productDescription} className="neon-btn w-full disabled:opacity-50">
                    {imgLoading ? '⏳ Generating...' : 'Generate Images ✨'}
                  </button>
                )}

                {imgError && (
                  <div className="rounded-xl p-3 text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {imgError}
                  </div>
                )}

                {/* Generated images (auto image mode) */}
                {contentType === 'image' && generatedImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Generated Images</h3>
                    <div className={`grid gap-3 ${generatedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {generatedImages.map((url, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden group"
                          style={{ aspectRatio: '1/1', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={url} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={url} download={`image-${i + 1}.webp`} target="_blank" rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#E50914' }}>
                              ⬇️ Download
                            </a>
                            <button
                              onClick={() => handlePostImage(url)}
                              disabled={imgPosting}
                              className="px-3 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
                              {imgPosting ? '⏳' : '📲 Post to IG'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Review */}
                    <button
                      onClick={handleImageReview}
                      disabled={reviewLoading}
                      className="w-full mt-4 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}
                    >
                      {reviewLoading ? '⏳ Reviewing...' : '🔍 AI Review'}
                    </button>

                    {/* Auto Schedule */}
                    {autoSchedule.length > 0 && (
                      <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(229,9,20,0.2)' }}>
                        <div className="px-4 py-3" style={{ background: 'rgba(229,9,20,0.08)', borderBottom: '1px solid rgba(229,9,20,0.2)' }}>
                          <h3 className="text-sm font-bold text-white">🗓️ Recommended Posting Schedule</h3>
                        </div>
                        {autoSchedule.map((slot, i) => (
                          <div key={i} className="px-4 py-3 flex items-start gap-3" style={{ background: 'rgba(13,22,40,0.4)' }}>
                            <div className="text-[#E50914] font-bold text-xs w-24 shrink-0">{slot.day} {slot.time}</div>
                            <div className="text-[#94A3B8] text-xs">{slot.rationale}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Review Results */}
                    {aiReview && (
                      <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(229,9,20,0.2)', background: 'rgba(13,22,40,0.5)' }}>
                        <div className="px-4 py-3" style={{ background: 'rgba(229,9,20,0.08)', borderBottom: '1px solid rgba(229,9,20,0.2)' }}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white">🔍 AI Content Review</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#94A3B8]">Score:</span>
                              <span className="font-bold text-sm" style={{ color: aiReview.overallScore >= 80 ? '#22c55e' : aiReview.overallScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                                {aiReview.overallScore}/100
                              </span>
                              {aiReview.viralPotential && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                                  style={{
                                    background: aiReview.viralPotential === 'high' ? 'rgba(34,197,94,0.1)' : aiReview.viralPotential === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                                    color: aiReview.viralPotential === 'high' ? '#22c55e' : aiReview.viralPotential === 'medium' ? '#f59e0b' : '#ef4444',
                                    border: `1px solid ${aiReview.viralPotential === 'high' ? 'rgba(34,197,94,0.3)' : aiReview.viralPotential === 'medium' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                  }}>
                                  {aiReview.viralPotential} viral
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          {aiReview.strengths?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-green-400 mb-2">✅ Strengths</p>
                              <ul className="space-y-1">
                                {aiReview.strengths.map((s: string, i: number) => (
                                  <li key={i} className="text-xs text-[#94A3B8]">• {s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {aiReview.improvements?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-[#E50914] mb-2">💡 Improvements</p>
                              <div className="space-y-2">
                                {aiReview.improvements.map((imp: any, i: number) => (
                                  <div key={i} className="rounded-lg p-3" style={{ background: 'rgba(229,9,20,0.04)', border: '1px solid rgba(229,9,20,0.12)' }}>
                                    <p className="text-xs font-semibold text-white mb-1 capitalize">{imp.field}</p>
                                    <p className="text-xs text-[#94A3B8] mb-1">{imp.issue}</p>
                                    <p className="text-xs text-[#C084FC]">→ {imp.suggestion}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {aiReview.engagementPrediction && (
                            <div>
                              <p className="text-xs font-bold text-[#94A3B8] mb-1">📊 Engagement Prediction</p>
                              <p className="text-xs text-[#94A3B8]">{aiReview.engagementPrediction}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* end DISABLED_auto_old */}

            {/* ═══════════════
                NOTEBOOK MODE
                ═══════════════ */}
            {mode === 'notebook' && (
              <div className="space-y-5">
                {/* Topic */}
                <div>
                  <label className="dark-input-label">What do you want to teach?</label>
                  <textarea
                    value={notebookTopic}
                    onChange={e => setNotebookTopic(e.target.value)}
                    placeholder="e.g. How to save tax as a freelancer, 5 yoga poses for back pain, How to start investing in stocks"
                    className="dark-input"
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Target audience */}
                <div>
                  <label className="dark-input-label">Who is your audience?</label>
                  <input
                    type="text"
                    value={notebookAudience}
                    onChange={e => setNotebookAudience(e.target.value)}
                    placeholder="e.g. Coaching center students, Working professionals, Fitness beginners"
                    className="dark-input"
                  />
                </div>

                {/* Content format pills */}
                <div>
                  <label className="text-sm text-[#94A3B8] mb-3 block">Content Format</label>
                  <div className="flex flex-wrap gap-2">
                    {['Key Concepts', 'Step by Step', 'Did You Know', 'Myth vs Fact', 'Quick Tips'].map(f => (
                      <button key={f} onClick={() => setNotebookFormat(f)}
                        className={`mode-pill ${notebookFormat === f ? 'mode-pill-active' : ''}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration (video) or image count (image) */}
                {contentType === 'video' ? (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Duration</label>
                    <div className="flex gap-3">
                      {([5, 15, 30, 50] as Duration[]).map((d) => (
                        <button key={d} onClick={() => setDuration(d)}
                          className={`mode-pill flex-1 justify-center ${duration === d ? 'mode-pill-active' : ''}`}>
                          {d === 5 ? '5s ⚡' : `${d}s`} <span className="text-xs text-[#94A3B8] ml-1">({d * 2}cr)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm text-[#94A3B8] mb-3 block">Number of Images</label>
                    <div className="flex gap-3">
                      {([1, 2, 4] as number[]).map(n => (
                        <button key={n} onClick={() => setImgCount(n)}
                          className={`mode-pill flex-1 justify-center ${imgCount === n ? 'mode-pill-active' : ''}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={() => {
                    setManualPrompt(`${notebookFormat}: ${notebookTopic}. Target audience: ${notebookAudience}.`);
                    if (contentType === 'image') {
                      handleManualImageGenerate();
                    } else {
                      startGeneration();
                    }
                  }}
                  disabled={!notebookTopic.trim() || imgLoading}
                  className="neon-btn w-full disabled:opacity-50"
                >
                  {imgLoading ? '⏳ Generating...' : 'Generate Educational Content'}
                </button>

                {/* Video needs images */}
                {contentType === 'video' && (
                  <div>
                    <label className="dark-input-label">Supporting Images (optional)</label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="studio-dropzone rounded-xl p-5 text-center cursor-pointer"
                      onClick={() => document.getElementById('file-input-notebook')?.click()}
                    >
                      {images.length === 0 ? (
                        <p className="text-[#94A3B8] text-xs">Drop images here or click to upload</p>
                      ) : (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {images.map((img, idx) => (
                            <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden group" style={{ border: '1px solid rgba(17,17,17,0.08)' }}>
                              <img src={img.preview} alt="" className="w-full h-full object-cover" />
                              <button onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input id="file-input-notebook" type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => addImages(Array.from(e.target.files || []))} />
                    </div>
                  </div>
                )}

                {/* Generated images (notebook image mode) */}
                {contentType === 'image' && generatedImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3">Generated Images</h3>
                    <div className={`grid gap-3 ${generatedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {generatedImages.map((url, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden group"
                          style={{ aspectRatio: '1/1', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={url} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={url} download={`image-${i + 1}.webp`} target="_blank" rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg text-xs font-bold text-white" style={{ background: '#E50914' }}>
                              ⬇️ Download
                            </a>
                            <button
                              onClick={() => handlePostImage(url)}
                              disabled={imgPosting}
                              className="px-3 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
                              {imgPosting ? '⏳' : '📲 Post to IG'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={connectInstagram} className="neon-btn w-full mt-4">
                      📸 Post to Instagram
                    </button>
                  </div>
                )}

                {imgError && (
                  <div className="rounded-xl p-3 text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {imgError}
                  </div>
                )}
              </div>
            )}

            {/* Login link */}
            {!user && (
              <div className="text-center mt-6">
                <Link href="/login" className="text-[#94A3B8] text-sm hover:text-white transition-colors">Login</Link>
              </div>
            )}

            {/* Sign out */}
            {user && (
              <div className="text-center mt-4">
                <button
                  onClick={() => { localStorage.removeItem('cs_token'); window.location.href = '/login'; }}
                  className="text-[#94A3B8] text-xs hover:text-white transition-colors"
                >Sign out ({user.email})</button>
              </div>
            )}
          </div>
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
                    style={{ width: `${STAGE_PERCENT[pipelineStage]}%`, background: 'linear-gradient(90deg, #E50914, #B0060F)' }}></div>
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
                          border: `1px solid ${done ? 'rgba(229,9,20,0.3)' : active ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
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
                  <div className="feature-badge mb-4" style={{ color: '#E040FB', borderColor: 'rgba(229,9,20,0.3)', background: 'rgba(229,9,20,0.06)' }}>🎉 Reel Ready</div>
                )}

                <h2 className="text-xl font-bold text-white mb-4">Your Reel is Ready</h2>

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
                      style={activeTab === tab ? { borderBottom: '2px solid #E50914' } : {}}>
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
                        <h4 className="text-xs font-bold text-[#E50914] uppercase tracking-wider mb-3">📜 Full Script</h4>
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
                        <h4 className="text-xs font-bold text-[#E50914] uppercase tracking-wider mb-3"># Hashtags</h4>
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
                              style={{ background: 'rgba(123,46,255,0.1)', border: '1px solid rgba(229,9,20,0.15)' }}>
                              {scene.sceneNumber}
                            </div>
                            <div>
                              <span className="text-white font-semibold text-sm">{scene.title || `Scene ${scene.sceneNumber}`}</span>
                              <span className="text-[#E50914] text-xs ml-2">{scene.startTime}s – {scene.startTime + scene.duration}s</span>
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
                <div className="rounded-2xl p-5" style={{ background: 'rgba(224,64,251,0.03)', border: '1px solid rgba(229,9,20,0.1)' }}>
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

/* ═══════════════════════════════════════════════════════════
   AUTO CALENDAR MODE COMPONENT
   Shows the monthly content plan inside the studio.
   User can browse posts, edit script/caption, then hit Generate.
═══════════════════════════════════════════════════════════ */
const TYPE_COLORS: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  viral_reel:        { color: '#E50914', bg: 'rgba(229,9,20,0.12)',   icon: '🔥', label: 'Viral Reel'        },
  top_reel:          { color: '#A855F7', bg: 'rgba(168,85,247,0.12)', icon: '⭐', label: 'Top Reel'          },
  educational_reel:  { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: '📚', label: 'Educational Reel'  },
  product_photo:     { color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: '📸', label: 'Product Photo'     },
  educational_image: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: '💡', label: 'Educational Image' },
};

function AutoCalendarMode({ REEL_ENGINE_URL, onSelectPost }: {
  REEL_ENGINE_URL: string;
  onSelectPost: (post: any) => void;
}) {
  const [plan, setPlan]             = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [editScript, setEditScript] = useState<Record<string, string>>({});
  const [editCaption, setEditCaption] = useState<Record<string, string>>({});
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm]             = useState({ brandName: '', productDescription: '', industry: 'ecommerce', region: 'india', language: 'hinglish', targetAudience: '' });
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState('');

  function getToken() {
    if (typeof window === 'undefined') return 'dev-token';
    return localStorage.getItem('cs_token') || 'dev-token';
  }

  useEffect(() => {
    fetch(`${REEL_ENGINE_URL}/api/auto/plan`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.contentPlan) setPlan(d); else setShowForm(true); })
      .catch(() => setShowForm(true))
      .finally(() => setLoading(false));
  }, []);

  async function generatePlan() {
    if (!form.brandName || !form.productDescription) { setError('Brand name and product description required'); return; }
    setGenLoading(true); setError('');
    try {
      const r = await fetch(`${REEL_ENGINE_URL}/api/auto/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      setPlan(d); setShowForm(false);
    } catch (e: any) { setError(e.message); }
    finally { setGenLoading(false); }
  }

  const sorted = plan?.contentPlan?.slice().sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()) || [];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
      <p style={{ fontSize: '14px' }}>Loading your content plan...</p>
    </div>
  );

  if (showForm) return (
    <div style={{ background: 'rgba(13,22,40,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>🤖 Generate Monthly Content Plan</h3>
      <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '20px' }}>AI will plan 16 posts across the month — scripts, captions & scheduling included.</p>

      {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>⚠️ {error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { key: 'brandName',          label: 'Brand Name *',    placeholder: 'e.g. My Startup', type: 'input' },
          { key: 'productDescription', label: 'Product / Service *', placeholder: 'What you sell — be specific', type: 'textarea' },
          { key: 'targetAudience',     label: 'Target Audience', placeholder: 'e.g. Indian women 25-35', type: 'input' },
        ].map(f => (
          <div key={f.key}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} rows={3} className="dark-input" style={{ resize: 'vertical' }} />
            ) : (
              <input type="text" value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} className="dark-input" />
            )}
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { key: 'industry', opts: ['ecommerce','fashion','beauty','food','technology','fitness','health','education','realestate','finance'] },
            { key: 'language', opts: ['hinglish','english','hindi'] },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{f.key}</label>
              <select value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="dark-input">
                {f.opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Breakdown preview */}
        <div style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)', borderRadius: '10px', padding: '12px' }}>
          <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>📦 Monthly breakdown</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
            {Object.entries(TYPE_COLORS).map(([type, m]) => (
              <div key={type} style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', gap: '6px' }}>
                <span>{m.icon}</span>
                <span style={{ color: m.color, fontWeight: 700 }}>
                  {type === 'viral_reel' ? '2' : type === 'top_reel' ? '4' : type === 'educational_reel' ? '2' : '4'}×
                </span>
                {m.label}
              </div>
            ))}
          </div>
        </div>

        <button onClick={generatePlan} disabled={genLoading}
          style={{ padding: '13px', background: '#E50914', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: genLoading ? 'not-allowed' : 'pointer', opacity: genLoading ? 0.7 : 1 }}>
          {genLoading ? '🤖 AI is planning your month (~30s)...' : '✨ Generate Content Plan'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>📅 {plan?.monthLabel || 'This Month'}</p>
          <p style={{ fontSize: '11px', color: '#94A3B8' }}>{sorted.length} posts planned · Click a post to edit &amp; generate</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ fontSize: '11px', padding: '5px 12px', background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.25)', borderRadius: '6px', color: '#E50914', cursor: 'pointer', fontWeight: 600 }}>
          ↺ Regenerate
        </button>
      </div>

      {/* Post list */}
      {sorted.map((post: any) => {
        const meta = TYPE_COLORS[post.type] || TYPE_COLORS.product_photo;
        const d = new Date(post.scheduledAt);
        const isOpen = expanded === post.id;
        const script = editScript[post.id] ?? (post.script || post.angle || '');
        const caption = editCaption[post.id] ?? (post.caption || '');
        return (
          <div key={post.id} style={{ borderRadius: '10px', marginBottom: '8px', border: `1px solid ${isOpen ? meta.color + '44' : 'rgba(255,255,255,0.07)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
            {/* Row */}
            <button onClick={() => setExpanded(isOpen ? null : post.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: isOpen ? meta.bg : 'rgba(13,22,40,0.7)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              {/* Date */}
              <div style={{ minWidth: '36px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '4px' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                  {d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' })}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {d.toLocaleDateString('en-IN', { day: 'numeric', timeZone: 'Asia/Kolkata' })}
                </div>
              </div>
              {/* Type badge */}
              <div style={{ padding: '3px 8px', borderRadius: '5px', background: meta.bg, fontSize: '11px', fontWeight: 700, color: meta.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {meta.icon} {meta.label}
              </div>
              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</p>
                <p style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })} IST
                </p>
              </div>
              <span style={{ color: '#94A3B8', fontSize: '14px', flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
            </button>

            {/* Expanded edit panel */}
            {isOpen && (
              <div style={{ padding: '14px', background: 'rgba(5,11,24,0.9)', borderTop: `1px solid rgba(255,255,255,0.06)` }}>
                {/* Hook */}
                <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Hook / Angle</p>
                <div style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.15)', borderRadius: '7px', padding: '10px 12px', marginBottom: '12px', fontSize: '12px', color: '#E50914', lineHeight: 1.5 }}>
                  {post.angle}
                </div>

                {/* Script/Prompt editable */}
                <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  {post.type?.includes('reel') ? 'Script / Voiceover' : 'Image Prompt'}
                </p>
                <textarea
                  value={script}
                  onChange={e => setEditScript(prev => ({ ...prev, [post.id]: e.target.value }))}
                  rows={4}
                  className="dark-input"
                  style={{ marginBottom: '10px', resize: 'vertical', fontSize: '12px' }}
                />

                {/* Caption editable */}
                <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Caption</p>
                <textarea
                  value={caption}
                  onChange={e => setEditCaption(prev => ({ ...prev, [post.id]: e.target.value }))}
                  rows={3}
                  className="dark-input"
                  style={{ marginBottom: '12px', resize: 'vertical', fontSize: '12px' }}
                />

                {/* Hashtags */}
                {post.hashtags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                    {post.hashtags.slice(0, 10).map((h: string) => (
                      <span key={h} style={{ padding: '2px 7px', background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.2)', borderRadius: '4px', fontSize: '11px', color: '#E50914' }}>{h}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onSelectPost({ ...post, script, caption })}
                    style={{ flex: 2, padding: '10px', background: '#E50914', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    🚀 Generate This Post
                  </button>
                  <button
                    onClick={() => setExpanded(null)}
                    style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#94A3B8', fontSize: '13px', cursor: 'pointer' }}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {sorted.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: '#94A3B8', fontSize: '13px' }}>
          No posts planned for this period.
          <button onClick={() => setShowForm(true)} style={{ display: 'block', margin: '12px auto 0', padding: '8px 20px', background: '#E50914', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            Generate Plan
          </button>
        </div>
      )}

      <a href="/studio/calendar" style={{ display: 'block', textAlign: 'center', fontSize: '12px', color: '#94A3B8', padding: '10px', textDecoration: 'none', marginTop: '4px' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#E50914')}
        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
        📅 Open full Calendar view →
      </a>
    </div>
  );
}
