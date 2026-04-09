'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const PACKS = [
  { id: 'starter', credits: 100, price: '₹499', reels: '2–6', icon: '🚀', tag: null },
  { id: 'growth', credits: 500, price: '₹1,999', reels: '10–33', icon: '⚡', tag: 'Best Value' },
  { id: 'viral', credits: 1000, price: '₹3,499', reels: '20–66', icon: '🔥', tag: 'Most Popular' },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

function isLikelyJwt(token: string | null): token is string {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(Boolean);
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('cs_token');
  return isLikelyJwt(token) ? token : null;
}

export default function CreditsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const REEL_ENGINE =
    process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

  const loadRazorpay = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
      document.body.appendChild(script);
    });

  const handlePurchase = async (packId: string) => {
    setLoading(packId);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        if (typeof window !== 'undefined') localStorage.removeItem('cs_token');
        setError('Your session has expired. Please sign in again to continue.');
        router.push('/login');
        return;
      }

      await loadRazorpay();

      const res = await fetch(`${REEL_ENGINE}/api/payments/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packId }),
      });
      const order = await res.json();
      if (res.status === 401) {
        localStorage.removeItem('cs_token');
        router.push('/login');
        throw new Error('Your session has expired. Please sign in again.');
      }
      if (!res.ok || !order.orderId) throw new Error(order.error || 'Failed to create order');

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'TheCraftStudios',
        description: order.pack.name,
        order_id: order.orderId,
        theme: { color: '#E36414' },
        prefill: { name: '', email: '', contact: '' },
        modal: {
          ondismiss: () => setLoading(null),
        },
        handler: async (response: any) => {
          try {
            const verify = await fetch(`${REEL_ENGINE}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                packId,
              }),
            });
            const result = await verify.json();
            if (verify.status === 401) {
              localStorage.removeItem('cs_token');
              router.push('/login');
              throw new Error('Your session expired before payment verification. Please sign in again.');
            }
            if (result.success) {
              setSuccess(true);
            } else {
              throw new Error(result.error || 'Payment verification failed');
            }
          } catch (e: any) {
            setError(e.message || 'Payment verified but credit failed. Contact support.');
          }
        },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Head>
        <title>Buy Credits — TheCraftStudios Studio</title>
        <meta name="description" content="Purchase credit packs to generate AI-powered Instagram reels. Pay via UPI, Cards, NetBanking, and Wallets." />
        <meta property="og:title" content="Buy Credits — TheCraftStudios" />
        <meta property="og:description" content="Purchase credit packs to generate AI-powered Instagram reels. Pay via UPI, Cards, NetBanking, and Wallets." />
        <meta property="og:url" content="https://www.thecraftstudios.in/studio/credits" />
        <link rel="canonical" href="https://www.thecraftstudios.in/studio/credits" />
      </Head>

      <div className="page-shell">
        <NavBar />

        <main className="editorial-grid page-hero">
          {success ? (
            <section className="editorial-card-dark" style={{ borderRadius: '40px', padding: '70px 30px', textAlign: 'center', background: 'linear-gradient(135deg, #0b2b26 0%, #123732 100%)', marginBottom: '30px' }}>
              <div style={{ fontSize: '62px', marginBottom: '16px' }}>✓</div>
              <h2 className="display" style={{ fontSize: '58px', marginBottom: '10px' }}>Credits Added</h2>
              <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: '16px', marginBottom: '22px' }}>
                Your credits have been added to your account successfully.
              </p>
              <Link href="/studio" className="cta-primary">
                Go To Studio
              </Link>
            </section>
          ) : (
            <>
              {error && (
                <div style={{ borderRadius: '26px', padding: '16px 20px', marginBottom: '22px', background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.16)', color: '#b91c1c', fontSize: '14px', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <span>⚠ {error}</span>
                  <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px' }}>
                    ×
                  </button>
                </div>
              )}

              <section style={{ textAlign: 'center', marginBottom: '50px' }}>
                <span className="section-chip">Credit Packs</span>
                <h1 className="section-title" style={{ marginTop: '20px', marginBottom: '14px' }}>
                  Buy <span className="text-accent">Credits</span>
                </h1>
                <p className="section-copy" style={{ maxWidth: '760px', margin: '0 auto' }}>
                  1 second of reel = 2 credits. Every reel includes 3 free regenerations, and checkout works with UPI, cards, NetBanking, and wallets.
                </p>
              </section>

              <section className="credit-grid" style={{ display: 'grid', gap: '22px', marginBottom: '50px' }}>
                {PACKS.map((pack) => {
                  const featured = pack.id === 'growth';
                  return (
                    <div key={pack.id} className={featured ? 'editorial-card-dark' : 'editorial-card'} style={{ borderRadius: '32px', padding: '30px', position: 'relative', overflow: 'hidden', background: featured ? 'linear-gradient(135deg, #e36414 0%, #c84e05 100%)' : '#fff' }}>
                      {pack.tag && (
                        <span style={{ position: 'absolute', top: '18px', right: '18px', padding: '8px 14px', borderRadius: '999px', background: featured ? 'rgba(255,255,255,0.22)' : 'rgba(17,17,17,0.05)', color: featured ? '#fff' : 'var(--ink)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                          {pack.tag}
                        </span>
                      )}

                      <div style={{ fontSize: '34px', marginBottom: '12px' }}>{pack.icon}</div>
                      <div className="metric-value" style={{ color: featured ? '#fff' : 'var(--ink)' }}>{pack.credits}</div>
                      <div style={{ color: featured ? 'rgba(255,255,255,0.76)' : 'var(--muted)', fontSize: '15px', marginBottom: '12px' }}>Credits</div>
                      <div className="display" style={{ fontSize: '52px', marginBottom: '14px', color: featured ? '#fff' : 'var(--accent)' }}>{pack.price}</div>

                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                        {[`${pack.reels} reels (15–50s)`, '3 free regens per reel', 'All features included', 'No expiry'].map((item) => (
                          <li key={item} style={{ display: 'flex', gap: '10px', color: featured ? 'rgba(255,255,255,0.84)' : 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.6 }}>
                            <span style={{ color: featured ? '#fff' : 'var(--accent)', fontWeight: 700 }}>✦</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handlePurchase(pack.id)}
                        disabled={loading === pack.id}
                        className={featured ? 'cta-secondary' : 'cta-primary'}
                        style={
                          featured
                            ? { width: '100%', background: '#fff', color: 'var(--accent)', border: 'none', opacity: loading === pack.id ? 0.6 : 1, cursor: loading === pack.id ? 'not-allowed' : 'pointer' }
                            : { width: '100%', opacity: loading === pack.id ? 0.6 : 1, cursor: loading === pack.id ? 'not-allowed' : 'pointer' }
                        }
                      >
                        {loading === pack.id ? 'Opening...' : 'Buy Now'}
                      </button>
                    </div>
                  );
                })}
              </section>

              <section className="editorial-card" style={{ borderRadius: '36px', padding: '34px 28px', textAlign: 'center', marginBottom: '28px' }}>
                <h3 className="display" style={{ fontSize: '42px', marginBottom: '10px' }}>Need More?</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginBottom: '18px' }}>
                  Contact us for agency pricing, custom credit bundles, white-label options, or API access.
                </p>
                <Link href="/contact" className="cta-primary">
                  Contact Sales
                </Link>
              </section>
            </>
          )}
        </main>

        <Footer />
      </div>

      <style jsx>{`
        .credit-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 980px) {
          .credit-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
