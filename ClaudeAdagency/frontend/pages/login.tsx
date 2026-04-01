'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const REEL_ENGINE_URL = process.env.NEXT_PUBLIC_REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';

export default function LoginPage() {
  const router = useRouter();
  const { token, error } = router.query;

  // If redirected back with token — store it and go to studio
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050B18' }}>
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="font-display text-4xl text-white uppercase">
              the<span style={{ color: '#F59E0B' }}>craft</span>studios
            </h1>
          </Link>
          <p className="text-[#94A3B8] mt-2">AI-Powered Instagram Reels</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-[rgba(74,108,247,0.2)]">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Sign in to Studio</h2>
          <p className="text-[#94A3B8] text-center text-sm mb-8">
            Create your workspace and start generating viral reels
          </p>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error === 'google_denied' && 'Google sign-in was cancelled.'}
              {error === 'token_failed' && 'Authentication failed. Please try again.'}
              {error === 'server_error' && 'Server error. Please try again.'}
              {!['google_denied', 'token_failed', 'server_error'].includes(error as string) && 'Something went wrong. Please try again.'}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'rgba(74,108,247,0.15)', border: '1px solid rgba(74,108,247,0.4)' }}
          >
            {/* Google Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-[#94A3B8] text-xs">
              By signing in, you agree to our terms of service.
              <br />New users get <span className="text-[#F59E0B] font-semibold">30 free credits</span> to start.
            </p>
          </div>
        </div>

        <p className="text-center text-[#94A3B8] text-xs mt-6">
          <Link href="/" className="hover:text-white transition-colors">← Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
}
