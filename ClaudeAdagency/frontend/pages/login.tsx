'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Logo from '../components/Logo';

const REEL_ENGINE_URL = process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

export default function LoginPage() {
  const router = useRouter();
  const { token, error } = router.query;

  useEffect(() => {
    if (token && typeof token === 'string') {
      localStorage.setItem('cs_token', token);
      router.replace('/studio');
    }
  }, [token]);

  const handleGoogleLogin = () => {
    window.location.href = `${REEL_ENGINE_URL}/api/auth/google`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      <style suppressHydrationWarning>{`
        /* Fire background orb */
        .login-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }

        /* Fire CTA button */
        .fire-btn-login {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 17px 32px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FF6B00, #F59E0B);
          color: #080808;
          font-size: 16px;
          font-weight: 800;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.04em;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 30px rgba(255,107,0,0.45), 0 0 60px rgba(255,107,0,0.15);
        }
        .fire-btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(255,107,0,0.65), 0 0 80px rgba(245,158,11,0.25);
        }
        .fire-btn-login:active { transform: scale(0.98); }

        /* Login card */
        .login-card {
          background: rgba(20,14,8,0.92);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(30px);
          box-shadow:
            0 0 0 1px rgba(245,158,11,0.08),
            0 40px 100px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(245,158,11,0.1);
          position: relative;
          overflow: hidden;
        }

        /* Top accent line */
        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF6B00, #F59E0B, transparent);
          border-radius: 24px 24px 0 0;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(245,158,11,0.12);
        }

        /* Stat badge */
        .stat-badge {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 20px;
          border-radius: 14px;
          background: rgba(15,12,8,0.8);
          border: 1px solid rgba(245,158,11,0.15);
          flex: 1;
          text-align: center;
        }

        /* Feature tag */
        .login-feat {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(245,158,11,0.06);
          font-size: 14px;
          color: rgba(148,163,184,0.85);
          font-family: 'Space Grotesk', sans-serif;
        }
        .login-feat:last-child { border-bottom: none; }

        /* Float animation */
        @keyframes floatLogin {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-login { animation: floatLogin 4s ease-in-out infinite; }

        /* Slide in */
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-login { animation: slideInUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* Background orbs */}
      <div className="login-orb" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)', top: '-10%', right: '-5%' }}></div>
      <div className="login-orb" style={{ width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', bottom: '-5%', left: '-5%' }}></div>
      {/* Star field */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.35) 0%, transparent 100%), radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 65% 50%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 90% 80%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 25% 85%, rgba(255,255,255,0.2) 0%, transparent 100%)', pointerEvents: 'none' }}></div>

      <div className="w-full max-w-md px-4 relative z-10 slide-login">

        {/* ── Logo & brand ── */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', textDecoration: 'none' }} className="float-login">
            <Logo variant="vertical" size="large" color="color" />
          </Link>
          <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '14px', marginTop: '6px', fontFamily: "'Space Grotesk', sans-serif" }}>
            AI-Powered Ads & Automation Platform
          </p>
        </div>

        {/* ── Login Card ── */}
        <div className="login-card">
          {/* Inner glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.06) 0%, transparent 50%)', pointerEvents: 'none', borderRadius: '24px' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#fff', textAlign: 'center', marginBottom: '6px', letterSpacing: '0.04em' }}>
              Sign In to Studio
            </h2>
            <p style={{ color: 'rgba(148,163,184,0.75)', textAlign: 'center', fontSize: '14px', marginBottom: '32px', fontFamily: "'Space Grotesk', sans-serif" }}>
              Create your workspace and start scaling revenue
            </p>

            {/* Error state */}
            {error && (
              <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171', fontSize: '14px', textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>
                {error === 'google_denied' && 'Google sign-in was cancelled.'}
                {error === 'token_failed' && 'Authentication failed. Please try again.'}
                {error === 'server_error' && 'Server error. Please try again.'}
                {!['google_denied', 'token_failed', 'server_error'].includes(error as string) && 'Something went wrong. Please try again.'}
              </div>
            )}

            {/* Google Sign In */}
            <button onClick={handleGoogleLogin} className="fire-btn-login">
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="divider">
              <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, letterSpacing: '0.08em' }}>WHAT YOU GET</span>
            </div>

            {/* Features list */}
            <div style={{ marginBottom: '28px' }}>
              {[
                { icon: '🎯', text: 'AI-generated ad creatives & scripts' },
                { icon: '📣', text: 'Social media automation & auto-posting' },
                { icon: '📈', text: 'Real-time ROAS & performance tracking' },
              ].map((feat, i) => (
                <div key={i} className="login-feat">
                  <span style={{ fontSize: '18px' }}>{feat.icon}</span>
                  <span>{feat.text}</span>
                  <span style={{ marginLeft: 'auto', color: '#F59E0B', fontWeight: 700, fontSize: '13px' }}>✓</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {[
                { value: '30', label: 'Free Credits', icon: '⚡' },
                { value: '150+', label: 'Brands Trust Us', icon: '🚀' },
                { value: '10M+', label: 'Views Generated', icon: '👁' },
              ].map((stat, i) => (
                <div key={i} className="stat-badge">
                  <span style={{ fontSize: '16px', marginBottom: '4px' }}>{stat.icon}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F59E0B', lineHeight: 1 }}>{stat.value}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.65)', fontWeight: 500, marginTop: '2px', textAlign: 'center', lineHeight: 1.3 }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Terms */}
            <p style={{ color: 'rgba(148,163,184,0.55)', fontSize: '12px', textAlign: 'center', lineHeight: '1.6', fontFamily: "'Space Grotesk', sans-serif" }}>
              By signing in, you agree to our terms of service.
              <br />
              New users get{' '}
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>30 free credits</span>
              {' '}to start creating.
            </p>
          </div>
        </div>

        {/* Back link */}
        <p style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ color: 'rgba(148,163,184,0.6)', fontSize: '13px', textDecoration: 'none', fontFamily: "'Space Grotesk', sans-serif", transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F59E0B')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.6)')}
          >
            ← Back to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
