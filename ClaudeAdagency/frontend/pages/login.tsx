'use client';

import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Logo from '../components/Logo';

const REEL_ENGINE_URL =
  process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

export default function LoginPage() {
  const router = useRouter();
  const { token, error } = router.query;

  useEffect(() => {
    if (token && typeof token === 'string') {
      localStorage.setItem('cs_token', token);
      router.replace('/studio');
    }
  }, [token, router]);

  const handleGoogleLogin = () => {
    window.location.href = `${REEL_ENGINE_URL}/api/auth/google`;
  };

  return (
    <>
      <Head>
        <title>Sign In — The Craft Studio</title>
        <meta name="description" content="Sign in to The Craft Studio AI platform." />
      </Head>

      <div className="page-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 18px' }}>
        <div className="floating-orb float-a" style={{ top: '18%', left: '12%', width: '220px', height: '220px', background: 'rgba(227,100,20,0.10)' }} />
        <div className="floating-orb float-b" style={{ right: '10%', bottom: '14%', width: '240px', height: '240px', background: 'rgba(11,43,38,0.08)' }} />

        <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: '10px' }}>
              <Logo size="large" />
            </Link>
            <p className="eyebrow">Client Hub Access</p>
          </div>

          <div className="glass-panel" style={{ borderRadius: '40px', padding: '34px 28px', background: 'rgba(255,255,255,0.86)' }}>
            <div style={{ textAlign: 'center', marginBottom: '26px' }}>
              <span className="section-chip">Workspace Login</span>
              <h1 className="display" style={{ fontSize: '54px', marginTop: '18px', marginBottom: '10px' }}>Sign In To Studio</h1>
              <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.7 }}>
                Access your reels, credits, calendars, and automation workspace from one place.
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: '18px', borderRadius: '22px', padding: '14px 16px', background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.16)', color: '#b91c1c', fontSize: '14px', textAlign: 'center' }}>
                {error === 'google_denied' && 'Google sign-in was cancelled.'}
                {error === 'token_failed' && 'Authentication failed. Please try again.'}
                {error === 'server_error' && 'Server error. Please try again.'}
                {!['google_denied', 'token_failed', 'server_error'].includes(error as string) && 'Something went wrong. Please try again.'}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                minHeight: '58px',
                borderRadius: '999px',
                border: '1px solid rgba(17,17,17,0.08)',
                background: '#fff',
                color: 'var(--ink)',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 10px 28px rgba(35,25,17,0.08)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(17,17,17,0.08)' }} />
              <span className="eyebrow" style={{ color: 'var(--muted)' }}>What You Get</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(17,17,17,0.08)' }} />
            </div>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
              {[
                'AI-generated ad creatives and scripts',
                'Social media automation and auto-posting',
                'Real-time performance tracking and calendar control',
              ].map((item) => (
                <div key={item} style={{ borderRadius: '22px', padding: '14px 16px', background: 'rgba(246,241,238,0.82)', border: '1px solid rgba(17,17,17,0.06)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-soft)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="login-stats" style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
              {[
                { value: '30', label: 'Free Credits' },
                { value: '150+', label: 'Brands Trust Us' },
                { value: '10M+', label: 'Views Generated' },
              ].map((stat) => (
                <div key={stat.label} className="metric-card" style={{ textAlign: 'center' }}>
                  <div className="display" style={{ fontSize: '34px', color: 'var(--accent)' }}>{stat.value}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '6px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', lineHeight: 1.7 }}>
              By signing in, you agree to our terms of service. New users get <strong style={{ color: 'var(--accent)' }}>30 free credits</strong> to start.
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '18px' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--ink-soft)', fontSize: '13px', fontWeight: 700 }}>
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-stats {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 640px) {
          .login-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
