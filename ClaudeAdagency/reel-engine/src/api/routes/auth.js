/**
 * Auth Routes — Google OAuth
 * GET /api/auth/google           → redirect to Google login
 * GET /api/auth/callback/google  → handle Google callback, issue JWT
 * GET /api/auth/me               → get current user info
 * POST /api/auth/logout          → clear session hint (JWT is stateless)
 */
import { Router } from 'express';
import { signToken, requireAuth } from '../middleware/auth.js';
import { logger } from '../../utils/logger.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://thecraftstudios.in';

// Railway reel-engine public URL — used as OAuth redirect base
const API_URL = process.env.REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app';
const REDIRECT_URI = `${API_URL}/api/auth/callback/google`;

// ── GET /api/auth/google ──────────────────────────────────────────────────
// Redirects browser to Google OAuth consent screen
router.get('/google', (req, res) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// ── GET /api/auth/callback/google ─────────────────────────────────────────
// Google redirects here with ?code=... after user approves
router.get('/callback/google', async (req, res) => {
  const { code, error } = req.query;

  if (error || !code) {
    logger.error('Google OAuth error', { error });
    return res.redirect(`${FRONTEND_URL}/login?error=google_denied`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      logger.error('Google token exchange failed', { err });
      return res.redirect(`${FRONTEND_URL}/login?error=token_failed`);
    }

    const tokens = await tokenRes.json();

    // Get user profile from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profile.email) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_email`);
    }

    // Create a stable userId from Google sub (permanent Google user ID)
    const userId = `google-${profile.sub}`;

    // Seed credits for new users
    const { redis } = await import('../../queue/index.js');
    await redis.set(`credits:${userId}`, 30, 'NX'); // 30 free credits for new users

    // Store user profile in Redis for /me endpoint
    await redis.set(`user:${userId}`, JSON.stringify({
      id: userId,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      createdAt: Date.now(),
    }), 'EX', 30 * 24 * 3600); // 30 days

    // Issue our own JWT
    const jwt = signToken({
      sub: userId,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    });

    logger.info('User logged in via Google', { userId, email: profile.email });

    // Redirect to frontend with token — frontend stores it in localStorage
    res.redirect(`${FRONTEND_URL}/studio?token=${jwt}`);

  } catch (err) {
    logger.error('Google OAuth callback error', { err: err.message });
    res.redirect(`${FRONTEND_URL}/login?error=server_error`);
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { redis } = await import('../../queue/index.js');
    const stored = await redis.get(`user:${req.user.id}`);
    const profile = stored ? JSON.parse(stored) : null;

    const { getUserCredits } = await import('../../services/credits/creditService.js');
    const credits = await getUserCredits(req.user.id);

    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name || profile?.name,
      picture: req.user.picture || profile?.picture,
      credits,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
