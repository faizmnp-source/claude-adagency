/**
 * TheCraftStudios Reel Engine — Express API Server
 * PORT is bound immediately so Railway healthcheck passes.
 * Heavy imports (BullMQ, Redis) are loaded lazily inside routes.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = parseInt(process.env.PORT || '4000');

// ── Start listening IMMEDIATELY (Railway healthcheck needs this) ───────────
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Reel Engine API running on port ${PORT}`);
});

// ── Security & CORS ───────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [
    'https://thecraftstudios.in',
    'https://www.thecraftstudios.in',
    process.env.FRONTEND_URL,
    'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
}));

const generationLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 10,
  message: { error: 'Generation rate limit exceeded.' },
});

// ── Razorpay webhook (raw body BEFORE json middleware) ────────────────────
app.post('/webhooks/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const { handleWebhook } = await import('../services/payments/razorpay.js');
    const sig = req.headers['x-razorpay-signature'];
    const result = await handleWebhook(req.body.toString(), sig);
    res.json(result);
  } catch (err) {
    console.error('Razorpay webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check — purely synchronous, no Redis, always instant 200 ────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'thecraftstudios-reel-engine', port: PORT, timestamp: new Date().toISOString() });
});

// ── Routes (lazy-loaded so startup errors don't block HTTP) ───────────────
app.use('/api/reels', generationLimiter, async (req, res, next) => {
  try {
    const { default: reelsRouter } = await import('./routes/reels.js');
    reelsRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use('/api/payments', async (req, res, next) => {
  try {
    const { default: paymentsRouter } = await import('./routes/payments.js');
    paymentsRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', async (req, res, next) => {
  try {
    const { default: authRouter } = await import('./routes/auth.js');
    authRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use('/api/instagram', async (req, res, next) => {
  try {
    const { default: instagramRouter } = await import('./routes/instagram.js');
    instagramRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use('/api/audio', async (req, res, next) => {
  try {
    const { default: audioRouter } = await import('./routes/audio.js');
    audioRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use('/api/images', async (req, res, next) => {
  try {
    const { default: imagesRouter } = await import('./routes/images.js');
    imagesRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use('/api/products', async (req, res, next) => {
  try {
    const { default: productsRouter } = await import('./routes/products.js');
    productsRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use('/api/viral', async (req, res, next) => {
  try {
    const { default: viralRouter } = await import('./routes/viral.js');
    viralRouter(req, res, next);
  } catch (err) {
    next(err);
  }
});

// ── SSE: Real-time job progress ────────────────────────────────────────────
app.get('/api/reels/:id/progress', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const { id: reelId } = req.params;
  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  send({ event: 'connected', reelId });

  const interval = setInterval(async () => {
    try {
      const { getJobProgress, redis } = await import('../queue/index.js');
      const progress = await getJobProgress(reelId);
      if (!progress) {
        const stored = await redis.get(`reel:result:${reelId}`);
        if (stored) {
          send({ event: 'completed', ...JSON.parse(stored) });
          clearInterval(interval);
          res.end();
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
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

export default app;
