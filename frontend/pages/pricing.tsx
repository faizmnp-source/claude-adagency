'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const CREDIT_TO_INR = 2;

const VIDEO_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    emoji: '💰',
    tagline: 'Fast & Budget-Friendly',
    modelName: 'Wan 2.1 480p',
    resolution: '480p',
    voice: false,
    music: false,
    color: '#15803d',
    glow: 'rgba(21,128,61,0.12)',
    features: ['480p AI video quality', 'Fast generation (~3 min)', 'No AI voice/music', 'Great for testing ideas'],
    pricing: {
      duration15: { credits: 45, inr: 90 },
      duration30: { credits: 90, inr: 180 },
      duration50: { credits: 150, inr: 300 },
    },
  },
  {
    id: 'creator',
    name: 'Creator',
    emoji: '⚡',
    tagline: 'Professional + AI Voice',
    modelName: 'Wan 2.1 720p',
    resolution: '720p',
    voice: true,
    music: false,
    color: '#0b2b26',
    glow: 'rgba(11,43,38,0.12)',
    features: ['720p HD video quality', 'ElevenLabs AI voice', 'Cinematic motion', '~5 min generation'],
    pricing: {
      duration15: { credits: 105, inr: 210 },
      duration30: { credits: 210, inr: 420 },
      duration50: { credits: 350, inr: 700 },
    },
    popular: true,
  },
  {
    id: 'viral',
    name: 'Viral',
    emoji: '🚀',
    tagline: 'Luma 1080p + Voice + Music + Lip Sync',
    modelName: 'Luma Dream Machine',
    resolution: '1080p',
    voice: true,
    music: true,
    lipSync: true,
    color: '#e36414',
    glow: 'rgba(227,100,20,0.12)',
    features: ['1080p cinematic quality', 'ElevenLabs AI voice', 'AI background music', 'Lip Sync (Wav2Lip)', 'Premium motion output'],
    pricing: {
      duration15: { credits: 75, inr: 150 }, // 60 + 15
      duration30: { credits: 135, inr: 270 }, // 120 + 15
      duration50: { credits: 215, inr: 430 }, // 200 + 15
    },
  },
  {
    id: 'ultra',
    name: 'Ultra',
    emoji: '🌟',
    tagline: 'Google Veo 2 + Full Audio + Lip Sync',
    modelName: 'Google Veo 2',
    resolution: '1080p',
    voice: true,
    music: true,
    lipSync: true,
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.12)',
    features: ['Google Veo 2 quality', 'Extended 30s Video', 'ElevenLabs AI voice', 'AI background music', 'Lip Sync (Wav2Lip)'],
    pricing: {
      duration15: { credits: 135, inr: 270 }, // 120 + 15
      duration30: { credits: 255, inr: 510 }, // 240 + 15
      duration50: { credits: 415, inr: 830 }, // 400 + 15
    },
  },
];

const MANUAL_MODELS = [
  { key: 'wan480p', label: 'Wan 2.1 480p', res: '480p', inrPerClip: '₹28', inrPer30s: '₹168' },
  { key: 'wan720p', label: 'Wan 2.1 720p', res: '720p', inrPerClip: '₹57', inrPer30s: '₹344' },
  { key: 'luma_flash', label: 'Luma Ray Flash', res: '1080p', inrPerClip: '₹13', inrPer30s: '₹77' },
  { key: 'luma', label: 'Luma Dream Machine', res: '1080p', inrPerClip: '₹24', inrPer30s: '₹145' },
  { key: 'kling', label: 'Kling v2.5', res: '1080p', inrPerClip: '₹45', inrPer30s: '₹268' },
  { key: 'minimax', label: 'Minimax Hailuo', res: '720p', inrPerClip: '₹36', inrPer30s: '₹179' },
  { key: 'veo2_flash', label: 'Veo 2 Flash', res: '720p', inrPerClip: '₹32', inrPer30s: '₹191' },
  { key: 'veo2', label: 'Google Veo 2', res: '1080p', inrPerClip: '₹64', inrPer30s: '₹383' },
];

const CREDIT_PACKS = [
  { credits: 100, price: '₹200', priceNum: 200, reels: '~1 short reel', popular: false },
  { credits: 500, price: '₹1,000', priceNum: 1000, reels: '~2-6 reels', popular: true },
  { credits: 1000, price: '₹2,000', priceNum: 2000, reels: '~4-12 reels', popular: false },
];

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing - TheCraftStudios</title>
        <meta name="description" content="Simple pay-per-use pricing for AI reel generation. Buy credits once, use anytime. No subscriptions." />
        <meta property="og:title" content="Pricing - TheCraftStudios" />
        <meta property="og:description" content="Pay only for what you generate. Credits never expire. No subscriptions." />
        <meta property="og:url" content="https://www.thecraftstudios.in/pricing" />
        <link rel="canonical" href="https://www.thecraftstudios.in/pricing" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          <section style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-chip">Investment Model</span>
            <h1 className="section-title" style={{ marginTop: '20px', marginBottom: '16px' }}>
              Simple, Transparent <span className="text-accent">Pricing</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '760px', margin: '0 auto' }}>
              Pay only for what you generate. No subscriptions, no monthly lock-in. Credits never expire, so you can scale on your own rhythm.
            </p>
          </section>

          <section style={{ marginBottom: '64px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div className="eyebrow">Video Packages</div>
              <h2 className="display" style={{ fontSize: '44px', marginTop: '8px' }}>Choose Your Output Tier</h2>
            </div>

            <div className="pricing-package-grid" style={{ display: 'grid', gap: '22px' }}>
              {VIDEO_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={pkg.popular ? 'editorial-card editorial-card-dark' : 'editorial-card'}
                  style={{
                    padding: '28px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: pkg.popular ? 'linear-gradient(135deg, #0b2b26 0%, #123732 100%)' : '#fff',
                  }}
                >
                  {pkg.popular && (
                    <span style={{ position: 'absolute', top: '18px', right: '18px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Most Popular
                    </span>
                  )}

                  <div className="floating-orb float-a" style={{ top: '-60px', right: '-30px', width: '160px', height: '160px', background: pkg.glow }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '30px', marginBottom: '14px' }}>{pkg.emoji}</div>
                    <h3 className="display" style={{ fontSize: '34px', marginBottom: '8px', color: pkg.popular ? '#fff' : 'var(--ink)' }}>{pkg.name}</h3>
                    <div style={{ color: pkg.popular ? 'rgba(255,255,255,0.76)' : pkg.color, fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{pkg.tagline}</div>
                    <div style={{ color: pkg.popular ? 'rgba(255,255,255,0.56)' : 'var(--muted)', fontSize: '13px', marginBottom: '18px' }}>{pkg.modelName} · {pkg.resolution}</div>

                    <div style={{ borderRadius: '22px', padding: '16px', background: pkg.popular ? 'rgba(255,255,255,0.08)' : 'rgba(246,241,238,0.8)', border: `1px solid ${pkg.popular ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.06)'}`, marginBottom: '18px' }}>
                      <div className="eyebrow" style={{ color: pkg.popular ? 'rgba(255,255,255,0.5)' : 'var(--muted)', marginBottom: '10px' }}>Total Cost Per Reel</div>
                      {[{ label: '15s', ...pkg.pricing.duration15 }, { label: '30s', ...pkg.pricing.duration30 }, { label: '50s', ...pkg.pricing.duration50 }].map((row) => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(17,17,17,0.06)' }}>
                          <span style={{ color: pkg.popular ? 'rgba(255,255,255,0.72)' : 'var(--ink-soft)', fontSize: '13px' }}>{row.label}</span>
                          <span style={{ color: pkg.popular ? '#fff' : 'var(--ink)', fontWeight: 700, fontSize: '13px' }}>
                            {row.credits} cr <span style={{ color: pkg.popular ? 'rgba(255,255,255,0.56)' : 'var(--muted)', fontWeight: 600 }}>≈₹{row.inr}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                      {pkg.features.map((feature) => (
                        <li key={feature} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: pkg.popular ? 'rgba(255,255,255,0.82)' : 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.6 }}>
                          <span style={{ color: pkg.popular ? '#fff' : pkg.color, fontWeight: 700 }}>✦</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      <span style={{ padding: '8px 12px', borderRadius: '999px', background: pkg.voice ? 'rgba(21,128,61,0.12)' : 'rgba(17,17,17,0.05)', color: pkg.voice ? '#15803d' : pkg.popular ? 'rgba(255,255,255,0.6)' : 'var(--muted)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {pkg.voice ? 'Voice Included' : 'No Voice'}
                      </span>
                      <span style={{ padding: '8px 12px', borderRadius: '999px', background: pkg.music ? 'rgba(21,128,61,0.12)' : 'rgba(17,17,17,0.05)', color: pkg.music ? '#15803d' : pkg.popular ? 'rgba(255,255,255,0.6)' : 'var(--muted)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {pkg.music ? 'Music Included' : 'No Music'}
                      </span>
                      {(pkg as any).lipSync && (
                        <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(124,58,237,0.12)', color: '#7c3aed', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          Lip Sync Included
                        </span>
                      )}
                    </div>

                    <Link href="/studio" className={pkg.popular ? 'cta-primary' : 'cta-secondary'} style={{ width: '100%' }}>
                      Try {pkg.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: '64px' }}>
            <div style={{ marginBottom: '18px' }}>
              <div className="eyebrow">Manual Mode</div>
              <h2 className="display" style={{ fontSize: '44px', marginTop: '8px' }}>Pick The Exact Model</h2>
            </div>

            <div className="editorial-card" style={{ overflow: 'hidden' }}>
              <div className="pricing-table-row pricing-table-head">
                <span>Model</span>
                <span>Resolution</span>
                <span>Per Clip</span>
                <span>30s Reel</span>
              </div>
              {MANUAL_MODELS.map((model, index) => (
                <div key={model.key} className="pricing-table-row" style={{ background: index % 2 === 0 ? 'rgba(246,241,238,0.55)' : 'transparent' }}>
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{model.label}</span>
                  <span className="muted">{model.res}</span>
                  <span className="text-forest" style={{ fontWeight: 700 }}>{model.inrPerClip}</span>
                  <span className="text-accent" style={{ fontWeight: 700 }}>{model.inrPer30s}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: '64px' }}>
            <div style={{ marginBottom: '22px' }}>
              <div className="eyebrow">Credit Packs</div>
              <h2 className="display" style={{ fontSize: '44px', marginTop: '8px' }}>Buy Credits Once</h2>
            </div>

            <div className="credit-pack-grid" style={{ display: 'grid', gap: '22px' }}>
              {CREDIT_PACKS.map((pack) => (
                <div key={pack.credits} className={pack.popular ? 'editorial-card editorial-card-dark' : 'editorial-card'} style={{ padding: '30px', position: 'relative', background: pack.popular ? 'linear-gradient(135deg, #e36414 0%, #c84e05 100%)' : '#fff' }}>
                  {pack.popular && (
                    <span style={{ position: 'absolute', top: '18px', right: '18px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Best Value
                    </span>
                  )}
                  <div className="metric-value" style={{ color: pack.popular ? '#fff' : 'var(--ink)' }}>{pack.credits}</div>
                  <div style={{ color: pack.popular ? 'rgba(255,255,255,0.76)' : 'var(--muted)', fontSize: '14px', marginBottom: '10px' }}>Credits</div>
                  <div className="display" style={{ fontSize: '48px', color: pack.popular ? '#fff' : 'var(--accent)', marginBottom: '8px' }}>{pack.price}</div>
                  <div style={{ color: pack.popular ? 'rgba(255,255,255,0.76)' : 'var(--ink-soft)', fontSize: '14px', marginBottom: '16px' }}>{pack.reels}</div>
                  <div style={{ color: pack.popular ? 'rgba(255,255,255,0.76)' : 'var(--muted)', fontSize: '13px', marginBottom: '18px' }}>≈₹{(pack.priceNum / pack.credits).toFixed(1)} per credit</div>
                  <Link href="/studio/credits" className={pack.popular ? 'cta-secondary' : 'cta-primary'} style={pack.popular ? { width: '100%', background: '#fff', color: 'var(--accent)', border: 'none' } : { width: '100%' }}>
                    Buy {pack.credits} Credits
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: '80px' }}>
            <div style={{ marginBottom: '18px' }}>
              <div className="eyebrow">FAQs</div>
              <h2 className="display" style={{ fontSize: '44px', marginTop: '8px' }}>Questions, Answered</h2>
            </div>
            <div style={{ display: 'grid', gap: '14px' }}>
              {[
                { q: 'How does the credit system work?', a: `1 credit = ₹${CREDIT_TO_INR}. Script generation costs 2 credits per second of reel. Video generation is billed separately by package or model after you approve the script.` },
                { q: 'Why are script and video charged separately?', a: 'They are separate AI workloads. This lets you refine the script first and only spend the heavier video credits once the narrative is approved.' },
                { q: 'Do credits expire?', a: 'No. Credits remain in your account until you use them.' },
                { q: 'Which payment methods are supported?', a: 'UPI, Net Banking, Debit Card, Credit Card, and wallets via Razorpay.' },
              ].map((item) => (
                <div key={item.q} className="editorial-card" style={{ padding: '22px 24px' }}>
                  <p style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{item.q}</p>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.7 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .pricing-package-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .credit-pack-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .pricing-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 14px;
          align-items: center;
          padding: 16px 20px;
        }
        .pricing-table-head {
          color: var(--muted);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(17, 17, 17, 0.06);
        }
        @media (max-width: 1180px) {
          .pricing-package-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 820px) {
          .credit-pack-grid,
          .pricing-package-grid {
            grid-template-columns: 1fr;
          }
          .pricing-table-row {
            grid-template-columns: 1.4fr 0.8fr 0.8fr 0.8fr;
            font-size: 12px;
          }
        }
        @media (max-width: 620px) {
          .pricing-table-row,
          .pricing-table-head {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
