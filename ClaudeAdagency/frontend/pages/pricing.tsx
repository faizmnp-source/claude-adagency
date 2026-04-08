'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

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
    features: ['480p AI video quality', 'Fast generation (~3 min)', 'No AI voice/music', 'Great for testing ideas'],
    pricing: {
      duration15: { credits: 75,  inr: 150  },
      duration30: { credits: 150, inr: 300  },
      duration50: { credits: 250, inr: 500  },
    },
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
    features: ['720p HD video quality', 'ElevenLabs AI voice', 'Cinematic motion', '~5 min generation'],
    pricing: {
      duration15: { credits: 135, inr: 270  },
      duration30: { credits: 270, inr: 540  },
      duration50: { credits: 450, inr: 900  },
    },
    creditsPerSec: 7,
    popular: true,
  },
  {
    id: 'viral',
    name: '🚀 Viral',
    tagline: '1080p + Voice + Music',
    modelName: 'Luma Dream Machine',
    resolution: '1080p',
    voice: true,
    music: true,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    features: ['1080p cinematic quality', 'ElevenLabs AI voice', 'AI background music', 'Premium motion output'],
    pricing: {
      duration15: { credits: 90,  inr: 180  },
      duration30: { credits: 180, inr: 360  },
      duration50: { credits: 300, inr: 600  },
    },
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
    features: ['Google Veo 2 quality', 'ElevenLabs AI voice', 'AI background music', 'Highest fidelity output'],
    pricing: {
      duration15: { credits: 150, inr: 300  },
      duration30: { credits: 300, inr: 600  },
      duration50: { credits: 500, inr: 1000 },
    },
    creditsPerSec: 8,
  },
];

const MANUAL_MODELS = [
  { key: 'wan480p',    label: '💰 Wan 2.1 480p',       res: '480p',  inrPerClip: '₹28',  inrPer30s: '₹168'  },
  { key: 'wan720p',    label: '⚡ Wan 2.1 720p',       res: '720p',  inrPerClip: '₹57',  inrPer30s: '₹344'  },
  { key: 'luma_flash', label: '⚡ Luma Ray Flash',     res: '1080p', inrPerClip: '₹13',  inrPer30s: '₹77'   },
  { key: 'luma',       label: '🚀 Luma Dream Machine', res: '1080p', inrPerClip: '₹24',  inrPer30s: '₹146'  },
  { key: 'kling',      label: '🎬 Kling v2.5',         res: '1080p', inrPerClip: '₹45',  inrPer30s: '₹268'  },
  { key: 'minimax',    label: '✨ Minimax Hailuo',      res: '720p',  inrPerClip: '₹36',  inrPer30s: '₹179'  },
  { key: 'veo2_flash', label: '🌐 Veo 2 Flash',        res: '720p',  inrPerClip: '₹32',  inrPer30s: '₹191'  },
  { key: 'veo2',       label: '🌟 Google Veo 2',       res: '1080p', inrPerClip: '₹64',  inrPer30s: '₹383'  },
];

const CREDIT_PACKS = [
  { credits: 100,  price: '₹499',   priceNum: 499,  reels: '~1–3 reels',   popular: false },
  { credits: 500,  price: '₹1,999', priceNum: 1999, reels: '~5–15 reels',  popular: true  },
  { credits: 1000, price: '₹3,499', priceNum: 3499, reels: '~10–30 reels', popular: false },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#fff' }}>
      <Head>
        <title>Pricing — TheCraftStudios</title>
        <meta name="description" content="Simple pay-per-use pricing for AI reel generation. Buy credits once, use anytime. No subscriptions." />
        <meta property="og:title" content="Pricing — TheCraftStudios" />
        <meta property="og:description" content="Pay only for what you generate. Credits never expire. No subscriptions." />
        <meta property="og:url" content="https://www.thecraftstudios.in/pricing" />
        <link rel="canonical" href="https://www.thecraftstudios.in/pricing" />
      </Head>

      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent <span style={{ color: '#E50914' }}>Pricing</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Pay only for what you generate. No subscriptions, no monthly fees.
            Credits <strong className="text-white">never expire.</strong>
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-[#94A3B8]">
            <span>Script: <strong className="text-white">2 cr/sec</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Video: billed by package below</span>
            <span className="hidden sm:inline">•</span>
            <span><strong className="text-white">1 credit = ₹2</strong></span>
          </div>
        </div>

        {/* ── Video Packages ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">🎬 Video Generation Packages</h2>
          <p className="text-[#94A3B8] text-sm mb-8">
            Prices below include both script generation and video. Choose based on your quality needs.
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
                  <p className="text-xs text-[#94A3B8] mb-2 font-medium uppercase tracking-wide">Total cost per reel</p>
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
                  Try {pkg.name.split(' ').slice(1).join(' ')} →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl text-xs text-[#94A3B8]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <strong className="text-white">How it works:</strong> Script credits are charged when you generate your script. Video credits are charged separately when you generate the video — so you can review the script first before committing to video.
          </div>
        </section>

        {/* ── Manual Model Pricing ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">🎮 Manual Mode — Pick Any Model</h2>
          <p className="text-[#94A3B8] text-sm mb-6">
            In Manual mode you choose the exact AI model. Script cost (2 cr/sec) is charged separately.
          </p>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-4 px-5 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wide" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="col-span-2">Model</span>
              <span>Resolution</span>
              <span>30s reel</span>
            </div>
            {MANUAL_MODELS.map((m, i) => (
              <div key={m.key} className="grid grid-cols-4 px-5 py-3.5 items-center"
                style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="col-span-2 font-semibold text-white text-sm">{m.label}</span>
                <span className="text-[#94A3B8] text-xs">{m.res}</span>
                <span className="text-white font-semibold text-sm">{m.inrPer30s}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] mt-3">
            * Manual mode does not include AI voice or music. 30s reel = 6 clips (5s each).
          </p>
        </section>

        {/* ── Credit Packs ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">💳 Buy Credits</h2>
          <p className="text-[#94A3B8] text-sm mb-8">Credits work across all features — reels, images, voiceovers. <strong className="text-white">Never expire.</strong></p>

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
                <div className="text-2xl font-bold mb-2" style={{ color: '#E50914' }}>{pack.price}</div>
                <div className="text-xs text-[#94A3B8] mb-6">= ₹{(pack.priceNum / pack.credits).toFixed(1)} per credit</div>
                <Link href="/studio/credits" className="block text-center py-3 rounded-xl font-bold text-sm"
                  style={{ background: pack.popular ? '#E50914' : 'rgba(255,255,255,0.06)', color: '#fff', border: pack.popular ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                  Buy {pack.credits} Credits
                </Link>
              </div>
            ))}
          </div>

          {/* Quick reference */}
          <div className="mt-6 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-5 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wide" style={{ background: 'rgba(255,255,255,0.03)' }}>
              What can I make with 500 credits?
            </div>
            <div className="divide-y divide-white/5">
              {[
                { pkg: '💰 Starter 30s',  credits: 150, count: '3 reels' },
                { pkg: '⚡ Creator 30s',  credits: 270, count: '1 reel + leftover credits' },
                { pkg: '🚀 Viral 30s',    credits: 180, count: '2 reels' },
                { pkg: '🌟 Ultra 30s',    credits: 300, count: '1 reel' },
              ].map(row => (
                <div key={row.pkg} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-white font-semibold">{row.pkg}</span>
                  <span className="text-[#94A3B8]">{row.credits} cr → <strong className="text-white">{row.count}</strong></span>
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
                q: 'How does the credit system work?',
                a: '1 credit = ₹2. Script generation costs 2 credits per second of reel. Video generation is billed separately per package after you approve the script — so you only pay for video quality when you\'re ready.',
              },
              {
                q: 'Why are credits charged separately for script and video?',
                a: 'Script and video are two separate AI steps. Charging them separately lets you review and approve the script before committing to the more intensive video generation step.',
              },
              {
                q: 'Why is Viral (Luma) cheaper than Creator (Wan 720p)?',
                a: 'Different AI models have different efficiency profiles. Luma Dream Machine delivers 1080p cinematic quality at a lower cost than Wan 720p, so we pass that saving on to you. Better quality, better price.',
              },
              {
                q: 'Do credits expire?',
                a: 'No. Credits stay in your account indefinitely. Buy once, use anytime — no pressure.',
              },
              {
                q: 'Does the Viral/Ultra package include real music?',
                a: 'Yes — background music is AI-generated and royalty-free, created from a text prompt that matches your reel\'s tone (e.g. "upbeat commercial energy"). It\'s unique to each reel.',
              },
              {
                q: 'What payment methods are supported?',
                a: 'UPI, Net Banking, Debit Card, Credit Card, and wallets — all via Razorpay, India\'s most trusted payment gateway.',
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
