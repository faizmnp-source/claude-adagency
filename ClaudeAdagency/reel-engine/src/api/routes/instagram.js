/**
 * Instagram Connect Routes — Meta OAuth
 *
 * GET  /api/instagram/connect   → redirect to Meta (Facebook) OAuth
 * GET  /api/instagram/callback  → handle OAuth callback, store token + IG account
 * GET  /api/instagram/status    → current user's connection status
 * POST /api/instagram/disconnect→ disconnect current user (delete stored creds)
 */
import { Router } from 'express';
import fetch from 'node-fetch';
import { randomBytes } from 'crypto';
import { redis } from '../../queue/index.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { createHmac, timingSafeEqual } from 'crypto';

const router = Router();

const GRAPH_API = 'https://graph.facebook.com/v21.0';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://thecraftstudios.in';
const API_URL = (process.env.REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app').replace(/\/$/, '');
const REDIRECT_URI = `${API_URL}/api/instagram/callback`;

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

function assertMetaConfig() {
  if (!config.meta.appId || !config.meta.appSecret) {
    throw new Error('META_APP_ID / META_APP_SECRET not configured');
  }
}

function verifyJwt(token) {
  const [header, payload, sig] = token.split('.');
  const expectedSig = createHmac('sha256', config.auth.jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    throw new Error('Invalid token');
  }

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }
  return decoded;
}

function getUserIdFromConnectRequest(req) {
  // Browser redirect cannot set Authorization header, so we accept token via query.
  if (process.env.GOOGLE_CLIENT_ID) {
    const token = typeof req.query.token === 'string' ? req.query.token : null;
    if (!token) throw new Error('Missing token');
    const decoded = verifyJwt(token);
    if (!decoded?.sub) throw new Error('Invalid token');
    return decoded.sub;
  }
  // Dev mode
  return 'dev-user-001';
}

async function exchangeCodeForAccessToken(code) {
  const url = new URL(`${GRAPH_API}/oauth/access_token`);
  url.searchParams.set('client_id', config.meta.appId);
  url.searchParams.set('client_secret', config.meta.appSecret);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('code', code);

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Meta code exchange failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function exchangeForLongLivedToken(shortLivedToken) {
  const url = new URL(`${GRAPH_API}/oauth/access_token`);
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', config.meta.appId);
  url.searchParams.set('client_secret', config.meta.appSecret);
  url.searchParams.set('fb_exchange_token', shortLivedToken);

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Meta long-lived token exchange failed: ${JSON.stringify(data)}`);
  }
  return { accessToken: data.access_token, expiresIn: data.expires_in };
}

async function fetchInstagramBusinessAccount(longLivedToken) {
  // Find first Facebook Page that has an attached Instagram Business account.
  const url = new URL(`${GRAPH_API}/me/accounts`);
  url.searchParams.set('fields', 'id,name,instagram_business_account');
  url.searchParams.set('access_token', longLivedToken);

  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Meta pages fetch failed: ${JSON.stringify(data)}`);
  }

  const pages = Array.isArray(data.data) ? data.data : [];
  const withIg = pages.find(p => p.instagram_business_account?.id);
  if (!withIg) {
    throw new Error('No Instagram Business account connected to any Page on this Meta user.');
  }

  return {
    pageId: withIg.id,
    pageName: withIg.name,
    instagramAccountId: withIg.instagram_business_account.id,
  };
}

// ── GET /api/instagram/connect ─────────────────────────────────────────────
router.get('/connect', async (req, res) => {
  try {
    assertMetaConfig();

    const userId = getUserIdFromConnectRequest(req);

    const state = randomBytes(16).toString('hex');
    const secure = Boolean(req.secure || req.headers['x-forwarded-proto'] === 'https');
    res.cookie('cs_ig_oauth_state', state, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60 * 1000,
    });

    // Persist mapping so callback can identify which user is connecting.
    await redis.setex(`ig:state:${state}`, 600, userId);

    // Meta login dialog (Facebook OAuth) — scopes needed for IG publishing.
    const authUrl = new URL(`https://www.facebook.com/v21.0/dialog/oauth`);
    authUrl.searchParams.set('client_id', config.meta.appId);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set(
      'scope',
      [
        'pages_show_list',
        'pages_read_engagement',
        'instagram_basic',
        'instagram_content_publish',
      ].join(',')
    );

    logger.info('Starting Instagram connect', { userId, redirect_uri: REDIRECT_URI });
    return res.redirect(authUrl.toString());
  } catch (err) {
    logger.error('Instagram connect init failed', { err: err.message });
    return res.redirect(`${FRONTEND_URL}/studio?ig=error&details=${encodeURIComponent(err.message)}`);
  }
});

// ── GET /api/instagram/callback ────────────────────────────────────────────
router.get('/callback', async (req, res) => {
  try {
    assertMetaConfig();

    const { code, state, error, error_message, error_description } = req.query;

    const cookies = parseCookies(req.headers.cookie || '');
    const expectedState = cookies.cs_ig_oauth_state;

    if (error || !code) {
      const details = error_message || error_description || error || 'Meta OAuth error';
      logger.error('Instagram OAuth error', { error, details });
      return res.redirect(`${FRONTEND_URL}/studio?ig=error&details=${encodeURIComponent(details)}`);
    }

    if (!state || typeof state !== 'string' || !expectedState || state !== expectedState) {
      logger.error('Instagram OAuth state mismatch');
      return res.redirect(`${FRONTEND_URL}/studio?ig=error&details=${encodeURIComponent('state_mismatch')}`);
    }

    const userId = await redis.get(`ig:state:${state}`);
    if (!userId) {
      return res.redirect(`${FRONTEND_URL}/studio?ig=error&details=${encodeURIComponent('state_expired')}`);
    }

    const shortToken = await exchangeCodeForAccessToken(code);
    const { accessToken, expiresIn } = await exchangeForLongLivedToken(shortToken);
    const { instagramAccountId, pageId, pageName } = await fetchInstagramBusinessAccount(accessToken);

    const expiresAt = Date.now() + (expiresIn ? expiresIn * 1000 : 0);

    await redis.set(`meta:access_token:${userId}`, accessToken);
    await redis.set(`meta:expires_at:${userId}`, String(expiresAt));
    await redis.set(`meta:ig_account_id:${userId}`, instagramAccountId);
    await redis.set(`meta:page_id:${userId}`, pageId);
    await redis.set(`meta:page_name:${userId}`, pageName || '');
    await redis.del(`ig:state:${state}`).catch(() => {});

    logger.info('Instagram connected', { userId, instagramAccountId, pageId });
    return res.redirect(`${FRONTEND_URL}/studio?ig=connected`);
  } catch (err) {
    logger.error('Instagram callback failed', { err: err.message });
    return res.redirect(`${FRONTEND_URL}/studio?ig=error&details=${encodeURIComponent(err.message)}`);
  }
});

// ── GET /api/instagram/status ──────────────────────────────────────────────
router.get('/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
    const userId = process.env.GOOGLE_CLIENT_ID
      ? (token ? verifyJwt(token).sub : null)
      : 'dev-user-001';

    if (!userId) return res.status(401).json({ error: 'Missing authorization token' });

    const [igAccountId, pageName, expiresAt] = await Promise.all([
      redis.get(`meta:ig_account_id:${userId}`),
      redis.get(`meta:page_name:${userId}`),
      redis.get(`meta:expires_at:${userId}`),
    ]);

    const connected = Boolean(igAccountId);
    res.json({
      connected,
      instagramAccountId: igAccountId,
      pageName: pageName || null,
      expiresAt: expiresAt ? Number(expiresAt) : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/instagram/disconnect ─────────────────────────────────────────
router.post('/disconnect', async (req, res) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
    const userId = process.env.GOOGLE_CLIENT_ID
      ? (token ? verifyJwt(token).sub : null)
      : 'dev-user-001';

    if (!userId) return res.status(401).json({ error: 'Missing authorization token' });

    await Promise.all([
      redis.del(`meta:access_token:${userId}`),
      redis.del(`meta:expires_at:${userId}`),
      redis.del(`meta:ig_account_id:${userId}`),
      redis.del(`meta:page_id:${userId}`),
      redis.del(`meta:page_name:${userId}`),
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

