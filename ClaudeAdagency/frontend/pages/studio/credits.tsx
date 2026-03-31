'use client';

import Link from 'next/link';
import { useState } from 'react';

const CSLogo = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bG-c" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B8DEF"/><stop offset="60%" stopColor="#4A6CF7"/><stop offset="100%" stopColor="#7B5EA7"/>
      </linearGradient>
      <linearGradient id="gG-c" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#D97706"/>
      </linearGradient>
      <linearGradient id="sG-c" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B8DEF"/><stop offset="50%" stopColor="#7B5EA7"/><stop offset="100%" stopColor="#F59E0B"/>
      </linearGradient>
    </defs>
    <path d="M28 10 C14 10 6 18 6 30 C6 42 14 50 28 50" stroke="url(#bG-c)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    <circle cx="28" cy="10" r="2.5" fill="#5B8DEF"/><circle cx="6" cy="30" r="2.5" fill="#5B8DEF"/><circle cx="28" cy="50" r="2.5" fill="#5B8DEF"/>
    <path d="M38 14 C48 14 52 18 52 24 C52 30 44 30 38 30 C32 30 28 34 28 38 C28 44 32 46 42 46" stroke="url(#sG-c)" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <circle cx="38" cy="14" r="2" fill="#5B8DEF"/><circle cx="52" cy="24" r="2" fill="#7B5EA7"/>
    <circle cx="28" cy="38" r="2" fill="#E59830"/><circle cx="42" cy="46" r="2.5" fill="#F59E0B"/>
    <polygon points="53,22 62,30 53,38" fill="url(#gG-c)"/>
  </svg>
);

const PACKS = [
  { id: 'starter', credits: 100, price: '₹499', reels: '2–6', icon: '🚀', tag: null },
  { id: 'growth',  credits: 500, price: '₹1,999', reels: '10–33', icon: '⚡', tag: 'Best Value' },
  { id: 'viral',   credits: 1000, price: '₹3,499', reels: '20–66', icon: '🔥', tag: 'Most Popular' },
];

declare global {
  interface Window { Razorpay: any; }
}

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const REEL_ENGINE = process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'http://localhost:4000';

  // Dynamically load Razorpay script if not already loaded
  const loadRazorpay = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.body.appendChild(script);
    });

  const handlePurchase = async (packId: string) => {
    setLoading(packId);
    try {
      // Ensure Razorpay SDK is loaded
      await loadRazorpay();

      // Step 1: Create Razorpay order on backend
      const res = await fetch(`${REEL_ENGINE}/api/payments/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer dev-token` },
        body: JSON.stringify({ packId }),
      });
      const order = await res.json();
      if (!order.orderId) throw new Error(order.error || 'Failed to create order');

      // Step 2: Open Razorpay checkout modal
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'TheCraftStudios',
        description: order.pack.name,
        order_id: order.orderId,
        theme: { color: '#4A6CF7' },
        prefill: { name: '', email: '', contact: '' },
        handler: async (response: any) => {
          // Step 3: Verify payment on backend + credit user
          const verify = await fetch(`${REEL_ENGINE}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer dev-token` },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              packId,
            }),
          });
          const result = await verify.json();
          if (result.success) setSuccess(true);
        },
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: '#050B18', color: '#fff' }}>
        <header className="sticky top-0 z-50 bg-[#050B18]/95 backdrop-blur-md border-b border-[rgba(74,108,247,0.2)]">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <CSLogo size={36} />
              <span className="font-bold text-white hidden sm:block">thecraft<span style={{ color: '#F59E0B' }}>studios</span>.in</span>
            </Link>
            <Link href="/studio" className="ghost-btn px-4 py-2 text-sm">← Back to Studio</Link>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-16">
          {success ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">✓</div>
              <h2 className="text-3xl font-bold text-white mb-3">Credits Added!</h2>
              <p className="text-[#94A3B8] mb-8">Your credits have been added to your account.</p>
              <Link href="/studio" className="gold-btn px-8 py-3 font-bold inline-flex">Go to Studio →</Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <div className="badge mb-4 mx-auto inline-flex" style={{ color: '#F59E0B', borderColor: 'rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.1)' }}>
                  Credit Packs
                </div>
                <h1 className="font-display text-5xl md:text-6xl text-white mb-4 uppercase">Buy Credits</h1>
                <p className="text-[#94A3B8] text-lg">1 second of reel = 2 credits · 3 free regenerations per reel</p>
                <p className="text-[#4A6CF7] text-sm mt-2">Pay via UPI · Cards · NetBanking · Wallets</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {PACKS.map((pack) => (
                  <div key={pack.id} className={`rounded-2xl p-8 relative overflow-hidden ${
                    pack.id === 'growth'
                      ? 'bg-gradient-to-b from-[#4A6CF7] to-[#3B5BDB] border-2 border-[#4A6CF7] transform scale-105 shadow-[0_0_60px_rgba(74,108,247,0.4)]'
                      : 'glass border border-[rgba(74,108,247,0.2)]'
                  }`}>
                    {pack.tag && (
                      <div className="absolute top-4 right-4 bg-[rgba(255,255,255,0.2)] rounded-full px-3 py-1 text-xs font-bold text-white">
                        {pack.tag}
                      </div>
                    )}
                    <div className="text-4xl mb-4">{pack.icon}</div>
                    <div className={`text-4xl font-bold mb-1 ${pack.id === 'growth' ? 'text-white' : 'gradient-text'}`}>
                      {pack.credits}
                    </div>
                    <div className={`text-sm mb-5 ${pack.id === 'growth' ? 'text-blue-100' : 'text-[#94A3B8]'}`}>Credits</div>
                    <div className="text-3xl font-bold mb-6 text-white">{pack.price}</div>
                    <ul className="space-y-2 mb-8">
                      {[
                        `${pack.reels} reels (15–50s)`,
                        '3 free regens per reel',
                        'All features included',
                        'No expiry',
                      ].map((f, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm ${pack.id === 'growth' ? 'text-blue-50' : 'text-[#94A3B8]'}`}>
                          <span className={pack.id === 'growth' ? 'text-[#FCD34D]' : 'text-[#4A6CF7]'}>✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePurchase(pack.id)}
                      disabled={loading === pack.id}
                      className={`w-full py-3 rounded-xl font-bold transition-all disabled:opacity-60 ${
                        pack.id === 'growth'
                          ? 'bg-white text-[#4A6CF7] hover:bg-[#FCD34D] hover:text-[#050B18]'
                          : 'gold-btn w-full justify-center'
                      }`}
                    >
                      {loading === pack.id ? 'Opening...' : 'Buy Now'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-8 border border-[rgba(74,108,247,0.2)] text-center">
                <h3 className="text-xl font-bold text-white mb-2">Need more? Contact us for agency pricing</h3>
                <p className="text-[#94A3B8] mb-4">Custom credit bundles, white-label options, API access</p>
                <Link href="/contact" className="gold-btn px-8 py-3 font-bold inline-flex">Contact Sales →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
