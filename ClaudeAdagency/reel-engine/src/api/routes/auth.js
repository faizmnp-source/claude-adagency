/**
 * Auth Routes — Google OAuth + Instagram OAuth
 * GET /api/auth/google               → redirect to Google login
 * GET /api/auth/callback/google      → handle Google callback, issue JWT
 * GET /api/auth/me                   → get current user info
 * GET /api/auth/instagram            → redirect to Meta/Instagram OAuth
 * GET /api/auth/callback/instagram   → handle Instagram callback, store per-user token
 * GET /api/auth/instagram/status     → check if current user has Instagram connected
 * DELETE /api/auth/instagram         → disconnect Instagram
 */
import { Router } from 'express';
import { randomBytes } from 'crypto';
import { signToken, requireAuth } from '../middleware/auth.js';
import { logger } from '../../utils/logger.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://thecraftstudios.in';

// Railway reel-engine public URL — used as OAuth redirect base
// Normalize to avoid redirect_uri mismatches caused by trailing slashes.
const API_URL = (process.env.REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app').replace(/\/$/, '');
const REDIRECT_URI = `${API_URL}/api/auth/callback/google`;
const IG_REDIRECT_URI = `${API_URL}/api/auth/callback/instagram`;

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map(v => v.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const idx = part.indexOf('=');
      if (idx === -1) return acc;
      const key = part.slice(0, idx);
      const value = part.slice(idx + 1);
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

// ── GET /api/auth/google ──────────────────────────────────────────────────
// Redirects browser to Google OAuth consent screen
router.get('/google', (req, res) => {
  const state = randomBytes(16).toString('hex');
  const secure = Boolean(req.secure || req.headers['x-forwarded-proto'] === 'https');
  // Set CSRF state in a cookie so we can validate in the callback.
  res.cookie('cs_oauth_state', state, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    // Keep short-lived to reduce risk.
    maxAge: 10 * 60 * 1000,
  });

  logger.info('Starting Google OAuth', { redirect_uri: REDIRECT_URI });

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// ── GET /api/auth/callback/google ─────────────────────────────────────────
// Google redirects here with ?code=... after user approves
router.get('/callback/google', async (req, res) => {
  const { code, error, error_description, state } = req.query;

  const cookies = parseCookies(req.headers.cookie || '');
  const expectedState = cookies.cs_oauth_state;

  if (!code || error) {
    logger.error('Google OAuth error', { error, error_description });
    return res.redirect(`${FRONTEND_URL}/login?error=google_denied&details=${encodeURIComponent(error_description || error || '')}`);
  }

  if (!state || typeof state !== 'string' || !expectedState || typeof expectedState !== 'string' || state !== expectedState) {
    logger.error('Google OAuth state mismatch', { state, expectedState: expectedState ? '[present]' : '[missing]' });
    return res.redirect(`${FRONTEND_URL}/login?error=google_state_invalid`);
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

    // Check Instagram connection status
    const igAccountId = await redis.get(`instagram:account:${req.user.id}`);
    const igProfile = igAccountId ? await redis.get(`instagram:profile:${req.user.id}`) : null;

    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name || profile?.name,
      picture: req.user.picture || profile?.picture,
      credits,
      instagram: igAccountId ? {
        connected: true,
        accountId: igAccountId,
        ...(igProfile ? JSON.parse(igProfile) : {}),
      } : { connected: false },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/auth/instagram ───────────────────────────────────────────────
// Redirects user to Meta/Facebook OAuth to connect their Instagram account
// Pass ?token=JWT as query param since this is a browser redirect (no Auth header)
router.get('/instagram', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.redirect(`${FRONTEND_URL}/studio?error=missing_token`);
  }
  if (!META_APP_ID) {
    return res.redirect(`${FRONTEND_URL}/studio?error=meta_not_configured`);
  }

  // Encode the JWT as state so we can associate the Instagram token with the user
  const state = Buffer.from(token).toString('base64url');

  const params = new URLSearchParams({
    client_id: META_APP_ID,
    redirect_uri: IG_REDIRECT_URI,
    scope: 'instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments,pages_show_list,pages_read_engagement',
    response_type: 'code',
    state,
  });

  res.redirect(`https://www.facebook.com/dialog/oauth?${params}`);
});

// ── GET /api/auth/callback/instagram ─────────────────────────────────────
// Meta redirects here after user approves Instagram permissions
router.get('/callback/instagram', async (req, res) => {
  const { code, state, error } = req.query;

  if (error || !code) {
    logger.error('Instagram OAuth denied', { error });
    return res.redirect(`${FRONTEND_URL}/studio?error=instagram_denied`);
  }

  try {
    // Decode state back to JWT and verify user
    const jwt = Buffer.from(state, 'base64url').toString();
    const { requireAuth: verifyToken } = await import('../middleware/auth.js');

    // Manually verify JWT (same logic as requireAuth)
    const { createHmac, timingSafeEqual } = await import('crypto');
    const { config } = await import('../../config/index.js');
    const [header, payload, sig] = jwt.split('.');
    const expectedSig = createHmac('sha256', config.auth.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return res.redirect(`${FRONTEND_URL}/studio?error=invalid_token`);
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.redirect(`${FRONTEND_URL}/studio?error=token_expired`);
    }

    const userId = decoded.sub;

    // Exchange code for short-lived token
    const tokenRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: IG_REDIRECT_URI,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      logger.error('Meta token exchange failed', { err });
      return res.redirect(`${FRONTEND_URL}/studio?error=instagram_token_failed`);
    }

    const { access_token: shortToken } = await tokenRes.json();

    // Exchange short-lived for long-lived token (60 days)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();
    const longToken = longTokenData.access_token || shortToken;

    // Get user's Pages → find connected Instagram Business Account
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${longToken}`
    );
    const pagesData = await pagesRes.json();
    const pages = pagesData.data || [];

    let igAccountId = null;
    let igUsername = null;
    let igName = null;

    // Check each page for connected Instagram account
    for (const page of pages) {
      const igRes = await fetch(
        `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token || longToken}`
      );
      const igData = await igRes.json();
      if (igData.instagram_business_account?.id) {
        igAccountId = igData.instagram_business_account.id;
        // Get IG profile info
        const profileRes = await fetch(
          `https://graph.facebook.com/v21.0/${igAccountId}?fields=username,name&access_token=${longToken}`
        );
        const profileData = await profileRes.json();
        igUsername = profileData.username;
        igName = profileData.name;
        break;
      }
    }

    if (!igAccountId) {
      logger.warn('No Instagram Business Account found for user', { userId });
      return res.redirect(`${FRONTEND_URL}/studio?error=no_ig_business_account`);
    }

    const { redis } = await import('../../queue/index.js');

    // Store per-user Instagram credentials (60 day TTL — token expiry)
    await redis.set(`instagram:token:${userId}`, longToken, 'EX', 60 * 24 * 3600);
    await redis.set(`instagram:account:${userId}`, igAccountId, 'EX', 60 * 24 * 3600);
    await redis.set(`instagram:profile:${userId}`, JSON.stringify({
      username: igUsername,
      name: igName,
    }), 'EX', 60 * 24 * 3600);

    logger.info('Instagram connected for user', { userId, igAccountId, igUsername });

    res.redirect(`${FRONTEND_URL}/studio?instagram=connected&ig_username=${encodeURIComponent(igUsername || '')}`);

  } catch (err) {
    logger.error('Instagram OAuth callback error', { err: err.message });
    res.redirect(`${FRONTEND_URL}/studio?error=instagram_server_error`);
  }
});

// ── GET /api/auth/instagram/status ───────────────────────────────────────
// Returns whether current user has Instagram connected
router.get('/instagram/status', requireAuth, async (req, res) => {
  try {
    const { redis } = await import('../../queue/index.js');
    const igAccountId = await redis.get(`instagram:account:${req.user.id}`);
    const igProfile = igAccountId ? await redis.get(`instagram:profile:${req.user.id}`) : null;

    if (!igAccountId) {
      return res.json({ connected: false });
    }

    res.json({
      connected: true,
      accountId: igAccountId,
      ...(igProfile ? JSON.parse(igProfile) : {}),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/auth/instagram ────────────────────────────────────────────
// Disconnect Instagram account
router.delete('/instagram', requireAuth, async (req, res) => {
  try {
    const { redis } = await import('../../queue/index.js');
    const userId = req.user.id;
    await Promise.all([
      redis.del(`instagram:token:${userId}`),
      redis.del(`instagram:account:${userId}`),
      redis.del(`instagram:profile:${userId}`),
    ]);
    logger.info('Instagram disconnected', { userId });
    res.json({ message: 'Instagram disconnected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
