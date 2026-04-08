'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// Pricing: 1.5× Replicate cost. 1 credit = ₹2 | $1 = ₹85
// Script generation: 2 cr/s (Claude AI)
// Video creditsPerSecond = (usdPerClip × 1.5 × 85) / (2 × clipSec) + audio premium

const VIDEO_PACKAGES = [
  {
    id: 'starter',
    name: '💰 Starter',
    tagline: 'Fast & Budget-Friendly',
    modelName: 'Wan 2.1 480p',
    resolution: '480p',
    voice: false,
    music: false,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    features: ['Wan 2.1 480p video', 'Fast generation (~3 min)', 'No AI voice/music', 'Great for testing'],
    // 3 cr/s video — Replicate ₹18.70/5s × 1.5 = ₹28.05 ≈ 3 cr/s
    pricing: {
      duration15: { credits: 30 + 45,   inr: 150  },
      duration30: { credits: 60 + 90,   inr: 300  },
      duration50: { credits: 100 + 150, inr: 500  },
    },
    usdPerClip: 0.22,
    creditsPerSec: 3,
  },
  {
    id: 'creator',
    name: '⚡ Creator',
    tagline: 'Professional + AI Voice',
    modelName: 'Wan 2.1 720p',
    resolution: '720p',
    voice: true,
    music: false,
    color: '#4A6CF7',
    bg: 'rgba(74,108,247,0.08)',
    border: 'rgba(74,108,247,0.35)',
    features: ['Wan 2.1 720p HD video', 'ElevenLabs AI voice', 'Cinematic motion prompts', '~5 min generation'],
    // 7 cr/s — Replicate ₹38.25/5s × 1.5 = ₹57.38 ≈ 6 cr/s + 1 voice = 7 cr/s
    pricing: {
      duration15: { credits: 30 + 105,  inr: 270  },
      duration30: { credits: 60 + 210,  inr: 540  },
      duration50: { credits: 100 + 350, inr: 900  },
    },
    usdPerClip: 0.45,
    creditsPerSec: 7,
    popular: true,
  },
  {
    id: 'viral',
    name: '🚀 Viral',
    tagline: 'Luma 1080p + Voice + Music',
    modelName: 'Luma Dream Machine',
    resolution: '1080p',
    voice: true,
    music: true,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    features: ['Luma Dream Machine 1080p', 'ElevenLabs AI voice', 'MusicGen background music', 'Premium cinematic motion'],
    // 4 cr/s — Replicate ₹16.15/5s × 1.5 = ₹24.23 ≈ 2 cr/s + 2 audio = 4 cr/s
    pricing: {
      duration15: { credits: 30 + 60,   inr: 180  },
      duration30: { credits: 60 + 120,  inr: 360  },
      duration50: { credits: 100 + 200, inr: 600  },
    },
    usdPerClip: 0.19,
    creditsPerSec: 4,
  },
  {
    id: 'ultra',
    name: '🌟 Ultra',
    tagline: 'Google Veo 2 + Full Audio',
    modelName: 'Google Veo 2',
    resolution: '1080p',
    voice: true,
    music: true,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.35)',
    features: ['Google Veo 2 1080p', 'ElevenLabs AI voice', 'MusicGen background music', 'Highest quality output'],
    // 8 cr/s — Replicate ₹42.50/5s × 1.5 = ₹63.75 ≈ 6 cr/s + 2 audio = 8 cr/s
    pricing: {
      duration15: { credits: 30 + 120,  inr: 300  },
      duration30: { credits: 60 + 240,  inr: 600  },
      duration50: { credits: 100 + 400, inr: 1000 },
    },
    usdPerClip: 0.50,
    creditsPerSec: 8,
  },
];

// All 8 manual models — 1.5× Replicate cost per clip
const MANUAL_MODELS = [
  { key: 'wan480p',    label: '💰 Wan 2.1 480p',       res: '480p',  usdPerClip: 0.22, clipSec: 5, inrPerClip: '₹28',  inrPer30s: '₹168'  },
  { key: 'wan720p',    label: '⚡ Wan 2.1 720p',       res: '720p',  usdPerClip: 0.45, clipSec: 5, inrPerClip: '₹57',  inrPer30s: '₹344'  },
  { key: 'luma_flash', label: '⚡ Luma Ray Flash',     res: '1080p', usdPerClip: 0.10, clipSec: 5, inrPerClip: '₹13',  inrPer30s: '₹77'   },
  { key: 'luma',       label: '🚀 Luma Dream Machine', res: '1080p', usdPerClip: 0.19, clipSec: 5, inrPerClip: '₹24',  inrPer30s: '₹146'  },
  { key: 'kling',      label: '🎬 Kling v2.5',         res: '1080p', usdPerClip: 0.35, clipSec: 5, inrPerClip: '₹45',  inrPer30s: '₹268'  },
  { key: 'minimax',    label: '✨ Minimax Hailuo',      res: '720p',  usdPerClip: 0.28, clipSec: 6, inrPerClip: '₹36/6s', inrPer30s: '₹179'  },
  { key: 'veo2_flash', label: '🌐 Veo 2 Flash',        res: '720p',  usdPerClip: 0.25, clipSec: 5, inrPerClip: '₹32',  inrPer30s: '₹191'  },
  { key: 'veo2',       label: '🌟 Google Veo 2',       res: '1080p', usdPerClip: 0.50, clipSec: 5, inrPerClip: '₹64',  inrPer30s: '₹383'  },
];

const CREDIT_PACKS = [
  { credits: 100,  price: '₹499',   priceNum: 499,   reels: '~1–3 reels', popular: false },
  { credits: 500,  price: '₹1,999', priceNum: 1999,  reels: '~5–15 reels', popular: true  },
  { credits: 1000, price: '₹3,499', priceNum: 3499,  reels: '~10–30 reels', popular: false },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#fff' }}>
      <Head>
        <title>Pricing — TheCraftStudios</title>
        <meta name="description" content="Transparent pay-per-use pricing for AI reel generation. 1.5× Replicate cost, credits never expire." />
      </Head>

      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transparent <span style={{ color: '#E50914' }}>Pricing</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Pay only for what you generate. Credits never expire.
            We charge <strong className="text-white">1.5×</strong> the Replicate model cost — zero hidden fees.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-[#94A3B8]">
            <span>Script (Claude AI): <strong className="text-white">2 cr/sec</strong></span>
            <span className="hidden sm:inline text-[#94A3B8]">•</span>
            <span>Video: billed per package below</span>
            <span className="hidden sm:inline text-[#94A3B8]">•</span>
            <span><strong className="text-white">1 credit = ₹2</strong></span>
          </div>
        </div>

        {/* ── Video Packages ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">🎬 Video Generation Packages</h2>
          <p className="text-[#94A3B8] text-sm mb-8">
            Charged after script generation. All prices = script + video cost combined.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VIDEO_PACKAGES.map(pkg => (
              <div key={pkg.id}
                className="rounded-2xl p-5 flex flex-col relative"
                style={{ background: pkg.bg, border: `1px solid ${pkg.border}` }}>

                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{ background: pkg.color, color: '#fff' }}>
                    Most Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                  <p className="text-xs" style={{ color: pkg.color }}>{pkg.tagline}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">{pkg.modelName} · {pkg.resolution}</p>
                </div>

                {/* Price breakdown */}
                <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <p className="text-xs text-[#94A3B8] mb-2 font-medium uppercase tracking-wide">Script + Video cost</p>
                  {[
                    { label: '15s', ...pkg.pricing.duration15 },
                    { label: '30s', ...pkg.pricing.duration30 },
                    { label: '50s', ...pkg.pricing.duration50 },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-xs text-[#94A3B8]">{row.label}</span>
                      <div className="text-right">
                        <span className="font-bold text-white text-xs">{row.credits} cr</span>
                        <span className="text-xs text-[#94A3B8] ml-1.5">≈₹{row.inr}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-5 flex-1">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span style={{ color: pkg.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                {/* Audio indicators */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pkg.voice ? 'text-green-400' : 'text-[#94A3B8]'}`}
                    style={{ background: pkg.voice ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${pkg.voice ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                    {pkg.voice ? '🎙️ Voice' : '🔇 No Voice'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pkg.music ? 'text-green-400' : 'text-[#94A3B8]'}`}
                    style={{ background: pkg.music ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${pkg.music ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                    {pkg.music ? '🎵 Music' : '🔕 No Music'}
                  </span>
                </div>

                <Link href="/studio" className="block text-center py-2.5 rounded-xl font-bold text-xs transition-all"
                  style={{ background: pkg.color, color: '#fff' }}>
                  Create with {pkg.name.split(' ').slice(1).join(' ')} →
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <div className="mt-4 p-4 rounded-xl text-xs text-[#94A3B8]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <strong className="text-white">How it works:</strong> Script (2 cr/sec) is charged when you hit "Generate". Video credits are charged when you hit "Generate Video". You can review the script before committing to video.
          </div>
        </section>

        {/* ── Manual Model Reference ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">🎮 Manual Mode — All 8 Models</h2>
          <p className="text-[#94A3B8] text-sm mb-6">
            In Manual mode, pick any model. Pricing = 1.5× Replicate cost (₹85/$). Script cost (2 cr/sec) is separate.
          </p>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-5 px-5 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wide" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="col-span-2">Model</span>
              <span>Resolution</span>
              <span>Per clip</span>
              <span>30s reel</span>
            </div>
            {MANUAL_MODELS.map((m, i) => (
              <div key={m.key} className="grid grid-cols-5 px-5 py-3.5 items-center text-sm"
                style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="col-span-2 font-semibold text-white text-sm">{m.label}</span>
                <span className="text-[#94A3B8] text-xs">{m.res}</span>
                <span className="text-[#94A3B8] text-xs">${m.usdPerClip}×1.5 = {m.inrPerClip}</span>
                <span className="text-white font-semibold text-sm">{m.inrPer30s}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] mt-3">
            * Replicate prices shown in USD. INR calculated at ₹85/$. 30s reel = 6 clips (5s each) except Minimax (5 clips × 6s).
            Manual mode does not include AI voice or music.
          </p>
        </section>

        {/* ── Credit Packs ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">💳 Buy Credits</h2>
          <p className="text-[#94A3B8] text-sm mb-8">Credits are used for script + video generation. <strong className="text-white">Never expire.</strong></p>

          <div className="grid md:grid-cols-3 gap-6">
            {CREDIT_PACKS.map(pack => (
              <div key={pack.credits} className="rounded-2xl p-6 relative"
                style={{
                  background: pack.popular ? 'rgba(229,9,20,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${pack.popular ? 'rgba(229,9,20,0.35)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#E50914', color: '#fff' }}>
                    Best Value
                  </div>
                )}
                <div className="text-3xl font-bold text-white mb-1">{pack.credits}</div>
                <div className="text-[#94A3B8] text-sm mb-1">credits</div>
                <div className="text-xs text-[#94A3B8] mb-4">{pack.reels}</div>
                <div className="text-2xl font-bold mb-6" style={{ color: '#E50914' }}>{pack.price}</div>
                <div className="text-xs text-[#94A3B8] mb-5">= ₹{(pack.priceNum / pack.credits).toFixed(1)} per credit</div>
                <Link href="/studio/credits" className="block text-center py-3 rounded-xl font-bold text-sm"
                  style={{ background: pack.popular ? '#E50914' : 'rgba(255,255,255,0.06)', color: '#fff', border: pack.popular ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                  Buy {pack.credits} Credits
                </Link>
              </div>
            ))}
          </div>

          {/* Quick reference table */}
          <div className="mt-6 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wide" style={{ background: 'rgba(255,255,255,0.03)' }}>
              What can you make with 500 credits?
            </div>
            <div className="divide-y divide-white/5">
              {[
                { pkg: '💰 Starter 30s', credits: 150, count: '3 reels' },
                { pkg: '⚡ Creator 30s', credits: 270, count: '1 reel + script for next' },
                { pkg: '🚀 Viral 30s',   credits: 180, count: '2 reels' },
                { pkg: '🌟 Ultra 30s',   credits: 300, count: '1 reel' },
              ].map(row => (
                <div key={row.pkg} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-white font-semibold">{row.pkg}</span>
                  <span className="text-[#94A3B8]">{row.credits} cr each → <strong className="text-white">{row.count}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">FAQs</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How is pricing calculated?',
                a: 'We charge 1.5× the Replicate model cost, which covers GPU compute, API overhead, and platform maintenance. 1 credit = ₹2. Script generation uses Claude AI at 2 credits/sec. Video generation is billed separately per the package you choose.',
              },
              {
                q: 'Why is Viral (Luma) cheaper than Creator (Wan 720p)?',
                a: 'Luma Dream Machine produces 1080p output at $0.19/clip while Wan 720p costs $0.45/clip on Replicate. Quality isn\'t always correlated with price — Luma uses a more efficient architecture. So you get 1080p for less!',
              },
              {
                q: 'Why are credits charged separately for script and video?',
                a: 'Script generation uses Claude AI (2cr/sec, charged upfront). Video uses GPU models on Replicate (charged per package after you approve the script). This way you only pay for video quality after reviewing your script.',
              },
              {
                q: 'Do credits expire?',
                a: 'No. Credits stay in your account indefinitely. Buy once, use anytime.',
              },
              {
                q: 'Is background music from Suno AI?',
                a: 'Suno AI has no public API. Background music (Viral & Ultra packages) is generated by Meta\'s MusicGen on Replicate — high-quality, royalty-free instrumental tracks.',
              },
              {
                q: 'What payment methods are supported?',
                a: 'UPI, Net Banking, Debit Card, Credit Card, and wallets via Razorpay (India-first).',
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-semibold text-white mb-2">{q}</p>
                <p className="text-sm text-[#94A3B8]">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16 py-12 rounded-2xl" style={{ background: 'rgba(229,9,20,0.06)', border: '1px solid rgba(229,9,20,0.2)' }}>
          <h2 className="text-3xl font-bold text-white mb-3">Ready to go viral?</h2>
          <p className="text-[#94A3B8] mb-6">New users get 30 free credits — no credit card needed.</p>
          <Link href="/studio" className="inline-block px-10 py-4 rounded-xl font-bold text-lg"
            style={{ background: '#E50914', color: '#fff' }}>
            Start Creating Free →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
