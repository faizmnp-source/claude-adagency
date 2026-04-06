'use client';

import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Logo from '../components/Logo';

const R    = '#E50914';
const BG   = '#0A0A0A';
const TEXT = '#FFFFFF';
const MUTED = 'rgba(255,255,255,0.55)';

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
    <>
      <Head>
        <title>Sign In — The Craft Studio</title>
        <meta name="description" content="Sign in to The Craft Studio AI platform." />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh', background: BG, color: TEXT,
        fontFamily: "'Inter', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Subtle red radial glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(229,9,20,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '440px', padding: '0 24px', position: 'relative', zIndex: 1 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link href="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', marginBottom: '14px' }}>
              <Logo size="large" />
            </Link>
            <p style={{ color: MUTED, fontSize: '14px', letterSpacing: '0.04em' }}>
              AI-Powered Ads & Automation Platform
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#111111',
            border: `1px solid rgba(229,9,20,0.2)`,
            padding: '44px 36px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top red accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${R}, transparent)` }} />

            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '0.06em', color: TEXT, textAlign: 'center', marginBottom: '6px' }}>
              SIGN IN TO STUDIO
            </h2>
            <p style={{ color: MUTED, textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>
              Create your workspace and start scaling revenue
            </p>

            {/* Error state */}
            {error && (
              <div style={{ marginBottom: '24px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171', fontSize: '14px', textAlign: 'center' }}>
                {error === 'google_denied' && 'Google sign-in was cancelled.'}
                {error === 'token_failed' && 'Authentication failed. Please try again.'}
                {error === 'server_error' && 'Server error. Please try again.'}
                {!['google_denied', 'token_failed', 'server_error'].includes(error as string) && 'Something went wrong. Please try again.'}
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                width: '100%', padding: '15px 24px',
                background: TEXT, color: '#0A0A0A',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 700,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#E8E8E8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = TEXT; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '28px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(229,9,20,0.15)' }} />
              <span style={{ fontSize: '11px', color: MUTED, fontWeight: 600, letterSpacing: '0.12em' }}>WHAT YOU GET</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(229,9,20,0.15)' }} />
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {[
                { icon: '🎯', text: 'AI-generated ad creatives & scripts' },
                { icon: '📣', text: 'Social media automation & auto-posting' },
                { icon: '📈', text: 'Real-time ROAS & performance tracking' },
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#1A1A1A', border: `1px solid rgba(229,9,20,0.12)` }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{feat.icon}</span>
                  <span style={{ fontSize: '14px', color: '#E8E8E8', flex: 1 }}>{feat.text}</span>
                  <span style={{ color: R, fontWeight: 700, fontSize: '13px' }}>✓</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
              {[
                { value: '30', label: 'Free Credits', icon: '⚡' },
                { value: '150+', label: 'Brands Trust Us', icon: '🚀' },
                { value: '10M+', label: 'Views Generated', icon: '👁' },
              ].map((stat, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: 'center', padding: '14px 8px',
                  background: '#1A1A1A', border: `1px solid rgba(229,9,20,0.15)`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                }}>
                  <span style={{ fontSize: '14px' }}>{stat.icon}</span>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: R, lineHeight: 1 }}>{stat.value}</span>
                  <span style={{ fontSize: '10px', color: MUTED, lineHeight: 1.3, textAlign: 'center' }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Terms */}
            <p style={{ color: MUTED, fontSize: '12px', textAlign: 'center', lineHeight: 1.6 }}>
              By signing in, you agree to our terms of service.<br />
              New users get <span style={{ color: R, fontWeight: 700 }}>30 free credits</span> to start.
            </p>
          </div>

          {/* Back link */}
          <p style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/" style={{ color: MUTED, fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = R)}
              onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
            >← Back to Homepage</Link>
          </p>
        </div>
      </div>
    </>
  );
}
