'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const RED = '#E50914';
const RED_DIM = 'rgba(229,9,20,0.15)';

const PACKS = [
  { id: 'starter', credits: 100, price: '₹499', reels: '2–6', icon: '🚀', tag: null },
  { id: 'growth',  credits: 500, price: '₹1,999', reels: '10–33', icon: '⚡', tag: 'Best Value' },
  { id: 'viral',   credits: 1000, price: '₹3,499', reels: '20–66', icon: '🔥', tag: 'Most Popular' },
];

declare global {
  interface Window { Razorpay: any; }
}

function getAuthToken(): string {
  if (typeof window === 'undefined') return 'dev-token';
  return localStorage.getItem('cs_token') || 'dev-token';
}

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const REEL_ENGINE = process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

  // Dynamically load Razorpay script if not already loaded
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
      // Ensure Razorpay SDK is loaded
      await loadRazorpay();

      const token = getAuthToken();

      // Step 1: Create Razorpay order on backend
      const res = await fetch(`${REEL_ENGINE}/api/payments/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ packId }),
      });
      const order = await res.json();
      if (!res.ok || !order.orderId) throw new Error(order.error || 'Failed to create order');

      // Step 2: Open Razorpay checkout modal
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'TheCraftStudios',
        description: order.pack.name,
        order_id: order.orderId,
        theme: { color: RED },
        prefill: { name: '', email: '', contact: '' },
        modal: {
          ondismiss: () => setLoading(null),
        },
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment on backend + credit user
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

      <NavBar />

      <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '100px 16px 64px' }}>
          {success ? (
            <div style={{ textAlign: 'center', paddingTop: '96px', paddingBottom: '96px' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px', color: RED }}>✓</div>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Credits Added!</h2>
              <p style={{ color: '#888888', marginBottom: '32px' }}>Your credits have been added to your account.</p>
              <Link href="/studio" style={{ background: RED, color: '#fff', padding: '12px 32px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                Go to Studio →
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', color: '#f87171', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>⚠️ {error}</span>
                  <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                </div>
              )}
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1px solid ${RED_DIM}`, borderRadius: '999px', padding: '6px 16px', marginBottom: '16px', color: RED, fontSize: '13px', fontWeight: 600, background: 'rgba(229,9,20,0.05)' }}>
                  Credit Packs
                </div>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 8vw, 64px)', color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  Buy Credits
                </h1>
                <p style={{ color: '#888888', fontSize: '18px' }}>1 second of reel = 2 credits · 3 free regenerations per reel</p>
                <p style={{ color: RED, fontSize: '14px', marginTop: '8px' }}>Pay via UPI · Cards · NetBanking · Wallets</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', marginBottom: '64px' }}>
                {PACKS.map((pack) => (
                  <div key={pack.id} style={{
                    borderRadius: '16px',
                    padding: '32px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: pack.id === 'growth' ? RED : '#1A1A1A',
                    border: pack.id === 'growth' ? `1px solid ${RED}` : `1px solid ${RED_DIM}`,
                  }}>
                    {pack.tag && (
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                        {pack.tag}
                      </div>
                    )}
                    <div style={{ fontSize: '36px', marginBottom: '16px' }}>{pack.icon}</div>
                    <div style={{ fontSize: '40px', fontWeight: 700, marginBottom: '4px', color: '#fff' }}>
                      {pack.credits}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '20px', color: pack.id === 'growth' ? 'rgba(255,255,255,0.7)' : '#888888' }}>Credits</div>
                    <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '24px', color: '#fff' }}>{pack.price}</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        `${pack.reels} reels (15–50s)`,
                        '3 free regens per reel',
                        'All features included',
                        'No expiry',
                      ].map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: pack.id === 'growth' ? 'rgba(255,255,255,0.9)' : '#888888' }}>
                          <span style={{ color: pack.id === 'growth' ? '#fff' : RED }}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePurchase(pack.id)}
                      disabled={loading === pack.id}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '15px',
                        cursor: loading === pack.id ? 'not-allowed' : 'pointer',
                        opacity: loading === pack.id ? 0.6 : 1,
                        border: 'none',
                        background: pack.id === 'growth' ? '#fff' : RED,
                        color: pack.id === 'growth' ? RED : '#fff',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {loading === pack.id ? 'Opening...' : 'Buy Now'}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ background: '#1A1A1A', border: `1px solid ${RED_DIM}`, borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Need more? Contact us for agency pricing</h3>
                <p style={{ color: '#888888', marginBottom: '16px' }}>Custom credit bundles, white-label options, API access</p>
                <Link href="/contact" style={{ background: RED, color: '#fff', padding: '12px 32px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                  Contact Sales →
                </Link>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
