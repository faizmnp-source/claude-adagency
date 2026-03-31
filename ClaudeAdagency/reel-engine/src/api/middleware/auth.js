import { createHmac, timingSafeEqual } from 'crypto';
import { config } from '../../config/index.js';
import { initializeUserCredits } from '../../services/credits/creditService.js';

/**
 * Lightweight JWT auth middleware
 * In production, replace with your actual auth provider (Supabase Auth, Auth0, Clerk, etc.)
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.slice(7);

  try {
    const [header, payload, sig] = token.split('.');
    const expectedSig = createHmac('sha256', config.auth.jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());

    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Token expired' });
    }

    req.user = { id: decoded.sub, email: decoded.email, ...decoded };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token format' });
  }
}

/**
 * Generate a simple JWT (use proper library in prod — jsonwebtoken)
 */
export function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
    })
  ).toString('base64url');
  const sig = createHmac('sha256', config.auth.jwtSecret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${sig}`;
}

/**
 * Dev-mode mock auth — sets user and seeds 9999 credits so generation always works
 */
export async function devAuth(req, res, next) {
  const userId = 'dev-user-001';
  req.user = { id: userId, email: 'dev@thecraftstudios.in' };
  try {
    // Give dev user plenty of credits on every request (idempotent via Redis SET NX)
    const { redis } = await import('../../queue/index.js');
    await redis.set(`credits:${userId}`, 9999, 'NX'); // only sets if not already set
  } catch { /* ignore redis errors */ }
  next();
}

// Use devAuth until a proper login system is built
// Switch to requireAuth once you add user accounts / login
export const authMiddleware = devAuth;
