/**
 * Payments API Routes
 * POST /api/payments/checkout     — Create Stripe checkout session
 * GET  /api/payments/packs        — List credit packs
 * POST /webhooks/stripe           — Stripe webhook (raw body)
 */
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createCheckoutSession,
  handleStripeWebhook,
  CREDIT_PACKS,
} from '../../services/payments/stripe.js';
import { getUserCredits, getTransactionHistory } from '../../services/credits/creditService.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const router = Router();

// ── GET /api/payments/packs ──────────────────────────────────────────────
router.get('/packs', (req, res) => {
  const packs = Object.entries(CREDIT_PACKS).map(([id, pack]) => ({
    id,
    name: pack.name,
    description: pack.description,
    credits: pack.credits,
    price: pack.price / 100,  // Convert paisa to rupees
    currency: pack.currency.toUpperCase(),
    pricePerSecond: Math.round((pack.price / 100) / (pack.credits / 2) * 100) / 100,
  }));
  res.json({ packs });
});

// ── POST /api/payments/checkout ───────────────────────────────────────────
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { packId } = req.body;
    const userId = req.user.id;
    const email = req.user.email;

    if (!packId || !CREDIT_PACKS[packId]) {
      return res.status(400).json({ error: 'Invalid pack ID', valid: Object.keys(CREDIT_PACKS) });
    }

    const { sessionId, url } = await createCheckoutSession({
      userId,
      packId,
      email,
      successUrl: `${config.frontendUrl}/studio/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${config.frontendUrl}/studio/credits?canceled=true`,
    });

    res.json({ sessionId, url });
  } catch (err) {
    logger.error('Checkout session error', { err: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/payments/balance ─────────────────────────────────────────────
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const balance = await getUserCredits(req.user.id);
    const history = await getTransactionHistory(req.user.id, 10);
    res.json({ balance, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
