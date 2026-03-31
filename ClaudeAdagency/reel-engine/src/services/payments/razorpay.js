/**
 * Razorpay Payment Service
 * Credit pack purchases + webhook handling
 * Supports UPI, NetBanking, Cards, Wallets — perfect for India
 */
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { addCreditsToUser } from '../credits/creditService.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

export const CREDIT_PACKS = {
  starter: {
    credits: 100,
    name: 'Starter Pack — 100 Credits',
    description: '50 seconds of AI-generated reels',
    price: 49900,   // ₹499 in paise
    currency: 'INR',
  },
  growth: {
    credits: 500,
    name: 'Growth Pack — 500 Credits',
    description: '250 seconds of AI-generated reels',
    price: 199900,  // ₹1,999 in paise
    currency: 'INR',
  },
  viral: {
    credits: 1000,
    name: 'Viral Pack — 1000 Credits',
    description: '500 seconds of AI-generated reels',
    price: 349900,  // ₹3,499 in paise
    currency: 'INR',
  },
};

/**
 * Create a Razorpay order (step 1 — frontend opens checkout with this)
 */
export async function createOrder({ userId, packId }) {
  const pack = CREDIT_PACKS[packId];
  if (!pack) throw new Error(`Invalid pack: ${packId}`);

  const order = await razorpay.orders.create({
    amount: pack.price,
    currency: pack.currency,
    receipt: `reel_${userId}_${packId}_${Date.now()}`,
    notes: {
      userId,
      packId,
      credits: pack.credits.toString(),
    },
  });

  logger.info('Razorpay order created', { orderId: order.id, userId, packId });
  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: config.razorpay.keyId,
    pack: {
      name: pack.name,
      description: pack.description,
      credits: pack.credits,
    },
  };
}

/**
 * Verify Razorpay payment signature (step 2 — called after frontend payment success)
 * Razorpay sends: razorpay_order_id, razorpay_payment_id, razorpay_signature
 */
export async function verifyAndCreditPayment({ orderId, paymentId, signature, userId, packId }) {
  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid payment signature — possible tamper attempt');
  }

  const pack = CREDIT_PACKS[packId];
  if (!pack) throw new Error(`Invalid pack: ${packId}`);

  // Fetch payment details to double-check amount
  const payment = await razorpay.payments.fetch(paymentId);
  if (payment.status !== 'captured' && payment.status !== 'authorized') {
    throw new Error(`Payment not captured. Status: ${payment.status}`);
  }
  if (payment.amount !== pack.price) {
    throw new Error(`Amount mismatch: expected ${pack.price}, got ${payment.amount}`);
  }

  await addCreditsToUser(userId, pack.credits, {
    reason: `Purchased ${packId} pack`,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
  });

  logger.info('Credits added after Razorpay payment', { userId, credits: pack.credits, packId });
  return { success: true, credits: pack.credits };
}

/**
 * Handle Razorpay webhook (optional — backup to frontend verification)
 * Set webhook secret in Razorpay dashboard → Settings → Webhooks
 */
export async function handleWebhook(rawBody, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid webhook signature');
  }

  const event = JSON.parse(rawBody);
  logger.info('Razorpay webhook received', { event: event.event });

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const { userId, packId, credits } = payment.notes || {};
    if (userId && packId && credits) {
      await addCreditsToUser(userId, parseInt(credits), {
        reason: `Webhook: purchased ${packId} pack`,
        razorpayPaymentId: payment.id,
      });
      logger.info('Credits added via webhook', { userId, credits, packId });
    }
  }

  return { received: true };
}
