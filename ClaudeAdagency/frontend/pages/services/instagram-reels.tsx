'use client';

import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const deliverables = [
  {
    title: 'Content Production',
    copy: 'We script, structure, and package reels that are designed to stop the scroll instead of blending into the feed.',
    items: ['Hook-first scripting', 'Short-form storyboarding', 'AI Lip Sync & Voice', 'Editing and finishing'],
  },
  {
    title: 'Publishing System',
    copy: 'We turn content into an operating rhythm with scheduling, review loops, and clear publishing accountability.',
    items: ['Posting calendar setup', 'Auto-publishing support', 'Approval workflows', 'Asset organization'],
  },
  {
    title: 'Growth Layer',
    copy: 'We connect reels to measurable business outcomes instead of chasing vanity metrics in isolation.',
    items: ['Hashtag strategy', 'Engagement optimisation', 'Performance reporting', 'Iteration planning'],
  },
];

const process = [
  ['01', 'Brief', 'We define the product angle, audience intent, and the exact behavior each reel should trigger.'],
  ['02', 'Build', 'We write hooks, shape scenes, and assemble the reel package around your offer and brand tone.'],
  ['03', 'Publish', 'We schedule or auto-post at the right moment with the supporting caption, tags, and CTA.'],
  ['04', 'Refine', 'We review performance, identify the winners, and feed the strongest patterns into the next batch.'],
];

const packages = [
  {
    name: 'Starter',
    detail: 'For teams that want a lighter reel engine and consistent publishing momentum.',
    points: ['Fast-turnaround reels', 'Core edit package', 'Scheduled delivery', 'Basic reporting'],
  },
  {
    name: 'Creator',
    detail: 'For brands that need stronger production quality, richer pacing, and a sharper conversion layer.',
    points: ['Higher quality outputs', 'Voice and audio options', 'Creative direction', 'Performance loop'],
    featured: true,
  },
  {
    name: 'Premium',
    detail: 'For brands treating short-form content as a primary acquisition and retention channel.',
    points: ['Priority production', 'Campaign support', 'Advanced iteration', 'Studio collaboration'],
  },
];

const proof = [
  { label: 'Reels created', value: '500+' },
  { label: 'Views generated', value: '10M+' },
  { label: 'Engagement lift', value: '3x' },
];

export default function InstagramReelsPage() {
  return (
    <>
      <Head>
        <title>Instagram Reels & Social Growth - TheCraftStudios</title>
        <meta
          name="description"
          content="Instagram reels, publishing systems, and growth workflows designed to turn attention into pipeline."
        />
        <meta property="og:title" content="Instagram Reels & Social Growth - TheCraftStudios" />
        <meta
          property="og:description"
          content="Short-form content systems that combine scripting, production, publishing, and iteration."
        />
        <meta property="og:url" content="https://www.thecraftstudios.in/services/instagram-reels" />
        <link rel="canonical" href="https://www.thecraftstudios.in/services/instagram-reels" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          <section style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-chip">Social Growth Wing</span>
            <h1 className="section-title" style={{ marginTop: '22px', marginBottom: '16px' }}>
              Reels That Turn <span className="text-accent">Attention Into Pipeline</span>
            </h1>
            <p className="section-copy" style={{ maxWidth: '780px', margin: '0 auto 28px' }}>
              We build short-form content systems around your offer, not random trends. That means stronger hooks,
              cleaner publishing workflows, and reels that support real brand and sales growth.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/contact" className="cta-primary">
                Book A Reels Strategy Call
              </Link>
              <Link href="/studio" className="cta-secondary">
                Try The Studio
              </Link>
            </div>
          </section>

          <section className="reels-proof-grid" style={{ display: 'grid', gap: '18px', marginBottom: '56px' }}>
            {proof.map((item) => (
              <div
                key={item.label}
                className="editorial-card"
                style={{ padding: '24px', textAlign: 'center', background: 'rgba(246,241,238,0.82)' }}
              >
                <div className="display text-forest" style={{ fontSize: '44px', marginBottom: '8px' }}>
                  {item.value}
                </div>
                <div
                  style={{
                    color: 'var(--muted)',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </section>

          <section className="reels-deliverables-grid" style={{ display: 'grid', gap: '22px', marginBottom: '64px' }}>
            {deliverables.map((block) => (
              <article key={block.title} className="editorial-card" style={{ padding: '28px' }}>
                <div className="eyebrow">{block.title}</div>
                <p
                  style={{
                    color: 'var(--ink-soft)',
                    fontSize: '15px',
                    lineHeight: 1.8,
                    marginTop: '14px',
                    marginBottom: '18px',
                  }}
                >
                  {block.copy}
                </p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {block.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'var(--ink)',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      <span className="text-accent">*</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section
            className="editorial-card editorial-card-dark"
            style={{
              padding: '30px',
              marginBottom: '64px',
              background: 'linear-gradient(135deg, #0b2b26 0%, #153a33 100%)',
            }}
          >
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Delivery Process
            </div>
            <div className="reels-process-grid" style={{ display: 'grid', gap: '18px', marginTop: '20px' }}>
              {process.map(([step, title, copy]) => (
                <div
                  key={step}
                  style={{
                    padding: '20px',
                    borderRadius: '24px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      color: '#f4c7a1',
                      fontSize: '12px',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                    }}
                  >
                    {step}
                  </div>
                  <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>{title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: '14px', lineHeight: 1.7 }}>{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: '72px' }}>
            <div style={{ marginBottom: '18px', textAlign: 'center' }}>
              <div className="eyebrow">Engagement Models</div>
              <h2 className="display" style={{ fontSize: '42px', marginTop: '8px' }}>
                Flexible Reels Packages
              </h2>
            </div>

            <div className="reels-package-grid" style={{ display: 'grid', gap: '22px' }}>
              {packages.map((pkg) => (
                <article
                  key={pkg.name}
                  className={pkg.featured ? 'editorial-card editorial-card-dark' : 'editorial-card'}
                  style={{
                    padding: '28px',
                    background: pkg.featured
                      ? 'linear-gradient(135deg, #0b2b26 0%, #153a33 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(246,241,238,0.92) 100%)',
                  }}
                >
                  <div className="eyebrow" style={{ color: pkg.featured ? 'rgba(255,255,255,0.55)' : 'var(--accent)' }}>
                    {pkg.featured ? 'Recommended' : 'Package'}
                  </div>
                  <h3
                    className="display"
                    style={{ fontSize: '36px', marginTop: '10px', color: pkg.featured ? '#fff' : 'var(--ink)' }}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    style={{
                      color: pkg.featured ? 'rgba(255,255,255,0.76)' : 'var(--ink-soft)',
                      fontSize: '15px',
                      lineHeight: 1.8,
                      margin: '14px 0 18px',
                    }}
                  >
                    {pkg.detail}
                  </p>
                  <div style={{ display: 'grid', gap: '10px', marginBottom: '22px' }}>
                    {pkg.points.map((point) => (
                      <div
                        key={point}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          color: pkg.featured ? 'rgba(255,255,255,0.84)' : 'var(--ink)',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ color: pkg.featured ? '#f4c7a1' : 'var(--accent)' }}>*</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className={pkg.featured ? 'cta-primary' : 'cta-secondary'}>
                    Choose {pkg.name}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .reels-proof-grid,
        .reels-deliverables-grid,
        .reels-package-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .reels-process-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        @media (max-width: 1100px) {
          .reels-process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 960px) {
          .reels-proof-grid,
          .reels-deliverables-grid,
          .reels-package-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .reels-process-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
