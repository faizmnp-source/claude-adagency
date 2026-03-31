/**
 * TheCraftStudios Reel Engine — Express API Server
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, validateConfig } from '../config/index.js';
import { logger } from '../utils/logger.js';
import reelsRouter from './routes/reels.js';
import paymentsRouter from './routes/payments.js';
import { handleStripeWebhook } from '../services/payments/stripe.js';
import { redis } from '../queue/index.js';

// Validate required env vars on startup
validateConfig();

const app = express();

// ── Security & CORS ───────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:3000'],
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  message: { error: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generationLimiter = rateLimit({
  windowMs: 60 * 60_000,   // 1 hour
  max: 10,                  // Max 10 generations per hour per IP
  message: { error: 'Generation rate limit exceeded. Upgrade for higher limits.' },
});

app.use(limiter);

// ── Stripe webhook (raw body BEFORE json middleware) ──────────────────────
app.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      const result = await handleStripeWebhook(req.body, sig);
      res.json(result);
    } catch (err) {
      logger.error('Stripe webhook error', { err: err.message });
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await redis.ping();
    res.json({
      status: 'ok',
      service: 'thecraftstudios-reel-engine',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      redis: 'connected',
    });
  } catch {
    res.status(503).json({ status: 'degraded', redis: 'disconnected' });
  }
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/reels', generationLimiter, reelsRouter);
app.use('/api/payments', paymentsRouter);

// ── SSE: Real-time job progress ────────────────────────────────────────────
app.get('/api/reels/:id/progress', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const { id: reelId } = req.params;
  const { getJobProgress } = await import('../queue/index.js');

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  send({ event: 'connected', reelId });

  // Poll every 2s and push progress updates
  const interval = setInterval(async () => {
    try {
      const progress = await getJobProgress(reelId);
      if (!progress) {
        // Check stored result
        const stored = await redis.get(`reel:result:${reelId}`);
        if (stored) {
          send({ event: 'completed', ...JSON.parse(stored) });
          clearInterval(interval);
          res.end();
          return;
        }
      } else {
        send({ event: 'progress', ...progress });
        if (['completed', 'failed'].includes(progress.state)) {
          clearInterval(interval);
          res.end();
        }
      }
    } catch {
      clearInterval(interval);
      res.end();
    }
  }, 2000);

  req.on('close', () => clearInterval(interval));
});

// ── 404 & Error handlers ───────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }));

app.use((err, req, res, next) => {
  logger.error('Unhandled error', { err: err.message, path: req.path });
  res.status(err.status || 500).json({
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  logger.info(`🚀 Reel Engine API running on port ${config.port}`, {
    env: config.nodeEnv,
    port: config.port,
  });
});

export default app;
