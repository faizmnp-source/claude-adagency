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
    features: ['Wan 2.1 480p video', 'Fast generation (~3 min)', 'No AI voice/music', 'Great for testing'],
    pricing: {
      duration15: { credits: 60 + 60,   inr: 240  },
      duration30: { credits: 60 + 120,  inr: 360  },
      duration50: { credits: 100 + 200, inr: 600  },
    },
    usdPerClip: 0.22,
    creditsPerSec: 4,
  },
  {
    id: 'creator',
    name: '⚡ Creator',
    tagline: 'Professional Quality',
    modelName: 'Wan 2.1 720p',
    resolution: '720p',
    voice: true,
    music: false,
    color: '#4A6CF7',
    bg: 'rgba(74,108,247,0.08)',
    border: 'rgba(74,108,247,0.35)',
    features: ['Wan 2.1 720p HD video', 'ElevenLabs AI voice', 'Cinematic motion prompts', '~5 min generation'],
    pricing: {
      duration15: { credits: 30 + 120,  inr: 300  },
      duration30: { credits: 60 + 240,  inr: 600  },
      duration50: { credits: 100 + 400, inr: 1000 },
    },
    usdPerClip: 0.45,
    creditsPerSec: 8,
    popular: true,
  },
  {
    id: 'viral',
    name: '🚀 Viral',
    tagline: 'Maximum Impact',
    modelName: 'Luma Dream Machine',
    resolution: '1080p',
    voice: true,
    music: true,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    features: ['Luma Dream Machine 1080p', 'ElevenLabs AI voice', 'MusicGen background music', 'Premium cinematic motion'],
    pricing: {
      duration15: { credits: 30 + 150,  inr: 360  },
      duration30: { credits: 60 + 300,  inr: 720  },
      duration50: { credits: 100 + 500, inr: 1200 },
    },
    usdPerClip: 0.19,
    creditsPerSec: 10,
  },
];

const MANUAL_MODELS = [
  { key: 'wan480p', label: '💰 Wan 2.1 480p',       res: '480p',  usdPerClip: 0.22, inrPer5s: '~₹19' },
  { key: 'wan720p', label: '⚡ Wan 2.1 720p',       res: '720p',  usdPerClip: 0.45, inrPer5s: '~₹38' },
  { key: 'luma',    label: '🚀 Luma Dream Machine', res: '1080p', usdPerClip: 0.19, inrPer5s: '~₹16' },
  { key: 'kling',   label: '🎬 Kling v2.5 Pro',     res: '1080p', usdPerClip: 0.35, inrPer5s: '~₹30' },
  { key: 'minimax', label: '✨ Minimax Hailuo',      res: '720p',  usdPerClip: 0.28, inrPer5s: '~₹24/6s' },
];

const CREDIT_PACKS = [
  { credits: 100,  price: '₹499',   reels: '~2–6 reels' },
  { credits: 500,  price: '₹1,999', reels: '~12–25 reels', popular: true },
  { credits: 1000, price: '₹3,499', reels: '~25–50 reels' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#fff' }}>
      <Head>
        <title>Pricing — TheCraftStudios</title>
        <meta name="description" content="Transparent pricing for AI reel generation packages. Choose Starter, Creator, or Viral." />
      </Head>

      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Transparent <span style={{ color: '#E50914' }}>Pricing</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Pay only for what you generate. Credits never expire. Prices based on actual AI model costs.
          </p>
          <div className="mt-4 text-sm text-[#94A3B8]">
            Script generation: <strong className="text-white">2 credits/sec</strong> &nbsp;•&nbsp;
            Video generation: billed per package below &nbsp;•&nbsp;
            1 credit ≈ ₹2
          </div>
        </div>

        {/* ── Video Packages ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">🎬 Video Generation Packages</h2>
          <p className="text-[#94A3B8] text-sm mb-8">Charged separately after your script is generated. Choose based on your quality needs.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {VIDEO_PACKAGES.map(pkg => (
              <div key={pkg.id}
                className="rounded-2xl p-6 flex flex-col relative"
                style={{ background: pkg.bg, border: `1px solid ${pkg.border}` }}>

                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: pkg.color, color: '#fff' }}>
                    Most Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-sm" style={{ color: pkg.color }}>{pkg.tagline}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Model: {pkg.modelName} · {pkg.resolution}</p>
                </div>

                {/* Price breakdown */}
                <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <p className="text-xs text-[#94A3B8] mb-3 font-medium uppercase tracking-wide">Cost (script + video)</p>
                  {[
                    { label: '15s reel', ...pkg.pricing.duration15 },
                    { label: '30s reel', ...pkg.pricing.duration30 },
                    { label: '50s reel', ...pkg.pricing.duration50 },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-sm text-[#94A3B8]">{row.label}</span>
                      <div className="text-right">
                        <span className="font-bold text-white text-sm">{row.credits} cr</span>
                        <span className="text-xs text-[#94A3B8] ml-2">≈₹{row.inr}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <span style={{ color: pkg.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                {/* Audio indicators */}
                <div className="flex gap-2 mb-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pkg.voice ? 'text-green-400' : 'text-[#94A3B8]'}`}
                    style={{ background: pkg.voice ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${pkg.voice ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                    {pkg.voice ? '🎙️ AI Voice' : '🔇 No Voice'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pkg.music ? 'text-green-400' : 'text-[#94A3B8]'}`}
                    style={{ background: pkg.music ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${pkg.music ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                    {pkg.music ? '🎵 MusicGen AI' : '🔕 No Music'}
                  </span>
                </div>

                <Link href="/studio" className="block text-center py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: pkg.color, color: pkg.id === 'creator' ? '#fff' : '#000' }}>
                  Create with {pkg.name.split(' ').slice(1).join(' ')} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Manual Model Reference ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">🎮 Manual Mode — Choose Any Model</h2>
          <p className="text-[#94A3B8] text-sm mb-6">In Manual mode you can select any model individually. Pricing is per 5-second clip at Replicate rates (₹85/$).</p>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-4 px-5 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wide" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span>Model</span>
              <span>Resolution</span>
              <span>Cost per 5s clip</span>
              <span>Cost for 30s reel</span>
            </div>
            {MANUAL_MODELS.map((m, i) => (
              <div key={m.key} className="grid grid-cols-4 px-5 py-4 items-center text-sm"
                style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="font-semibold text-white">{m.label}</span>
                <span className="text-[#94A3B8]">{m.res}</span>
                <span className="text-[#94A3B8]">${m.usdPerClip} · {m.inrPer5s}</span>
                <span className="text-white font-semibold">~₹{Math.round(m.usdPerClip * 6 * 85)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] mt-3">* Replicate prices may vary. Costs shown are estimates. You'll see exact credit cost before confirming generation.</p>
        </section>

        {/* ── Credit Packs ── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">💳 Buy Credits</h2>
          <p className="text-[#94A3B8] text-sm mb-8">Credits are used for both script generation and video generation. Never expire.</p>

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
                <div className="text-[#94A3B8] text-sm mb-4">credits · {pack.reels}</div>
                <div className="text-2xl font-bold mb-6" style={{ color: '#E50914' }}>{pack.price}</div>
                <Link href="/studio/credits" className="block text-center py-3 rounded-xl font-bold text-sm"
                  style={{ background: pack.popular ? '#E50914' : 'rgba(255,255,255,0.06)', color: '#fff', border: pack.popular ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                  Buy {pack.credits} Credits
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">FAQs</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Why are credits charged separately for script and video?',
                a: 'Script generation uses Claude AI (charged at 2cr/sec). Video generation uses Replicate GPU models (charged per package). This way you only pay for the video quality you need.',
              },
              {
                q: 'Do credits expire?',
                a: 'No. Your credits stay in your account indefinitely. Buy once, use anytime.',
              },
              {
                q: 'Why is Luma cheaper than Wan 720p?',
                a: 'Luma Dream Machine uses an efficient model architecture that produces 1080p output at a lower per-clip cost than Wan 720p. Quality isn\'t always correlated with price on Replicate.',
              },
              {
                q: 'Is background music from Suno AI?',
                a: 'Suno AI does not have a public API. Background music in the Viral package is generated using Meta\'s MusicGen model on Replicate — it produces high-quality, royalty-free instrumental tracks from a text prompt (e.g. "upbeat commercial product music").',
              },
              {
                q: 'Can I test before committing to a package?',
                a: 'Yes. Start with 30 free credits (new users) or buy the Starter pack (₹499) to test. You can preview the AI script before generating the video.',
              },
              {
                q: 'What payment methods are supported?',
                a: 'UPI, Net Banking, Debit Card, Credit Card, and wallets via Razorpay (India).',
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
