/**
 * Payments API Routes (Razorpay)
 * GET  /api/payments/packs           — List credit packs
 * POST /api/payments/order           — Create Razorpay order
 * POST /api/payments/verify          — Verify payment + credit user
 * GET  /api/payments/balance         — User credit balance
 * POST /webhooks/razorpay            — Razorpay webhook (raw body)
 */
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createOrder,
  verifyAndCreditPayment,
  handleWebhook,
} from '../../services/payments/razorpay.js';
import { CREDIT_PACKS } from '../../services/payments/creditPacks.js';
import { getUserCredits, getTransactionHistory } from '../../services/credits/creditService.js';
import { logger } from '../../utils/logger.js';

const router = Router();

function serializeError(err) {
  if (err instanceof Error) {
    return {
      message: err.message,
      stack: err.stack,
      name: err.name,
      ...(err.statusCode ? { statusCode: err.statusCode } : {}),
      ...(err.error ? { error: err.error } : {}),
      ...(err.description ? { description: err.description } : {}),
    };
  }

  if (err && typeof err === 'object') {
    return {
      ...err,
      message: typeof err.message === 'string' ? err.message : JSON.stringify(err),
    };
  }

  return { message: String(err) };
}

// ── GET /api/payments/packs ──────────────────────────────────────────────
router.get('/packs', (req, res) => {
  const packs = Object.entries(CREDIT_PACKS).map(([id, pack]) => ({
    id,
    name: pack.name,
    description: pack.description,
    credits: pack.credits,
    price: pack.price / 100,        // paise → rupees
    currency: pack.currency,
    pricePerSecond: Math.round((pack.price / 100) / (pack.credits / 2) * 100) / 100,
  }));
  res.json({ packs });
});

// ── POST /api/payments/order ──────────────────────────────────────────────
// Creates a Razorpay order — frontend opens Razorpay checkout with this
router.post('/order', authMiddleware, async (req, res) => {
  try {
    const { packId } = req.body;
    const userId = req.user.id;

    if (!packId || !CREDIT_PACKS[packId]) {
      return res.status(400).json({ error: 'Invalid pack ID', valid: Object.keys(CREDIT_PACKS) });
    }

    const orderData = await createOrder({ userId, packId });
    res.json(orderData);
  } catch (err) {
    const error = serializeError(err);
    logger.error('Razorpay order error', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

// ── POST /api/payments/verify ─────────────────────────────────────────────
// Called from frontend after user completes payment — verifies signature + credits user
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature, packId } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !signature || !packId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await verifyAndCreditPayment({ orderId, paymentId, signature, userId, packId });
    res.json(result);
  } catch (err) {
    const error = serializeError(err);
    logger.error('Payment verification failed', error);
    res.status(400).json({ error: error.message || 'Payment verification failed' });
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

// ── POST /webhooks/razorpay ───────────────────────────────────────────────
// Raw body — registered in server.js BEFORE express.json()
router.post('/razorpay', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    await handleWebhook(req.body, signature);
    res.json({ received: true });
  } catch (err) {
    const error = serializeError(err);
    logger.error('Razorpay webhook error', error);
    res.status(400).json({ error: error.message || 'Webhook error' });
  }
});

export default router;
