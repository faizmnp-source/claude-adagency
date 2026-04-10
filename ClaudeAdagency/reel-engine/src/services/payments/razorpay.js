/**
 * Razorpay Payment Service
 * Credit pack purchases + webhook handling
 * Supports UPI, NetBanking, Cards, Wallets for India
 */
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { addCreditsToUser } from '../credits/creditService.js';
import { CREDIT_PACKS } from './creditPacks.js';

let razorpay = null;

function maskSecret(secret) {
  if (!secret) return '[missing]';
  if (secret.length <= 6) return `${secret[0] || ''}***`;
  return `${secret.slice(0, 3)}***${secret.slice(-3)}`;
}

function buildReceipt(packId) {
  const ts = Date.now().toString(36);
  return `rcpt_${packId}_${ts}`.slice(0, 40);
}

logger.info('Razorpay config loaded', {
  keyId: config.razorpay.keyId || '[missing]',
  keySecretMasked: maskSecret(config.razorpay.keySecret),
  keySecretLength: config.razorpay.keySecret?.length || 0,
});

function getRazorpayClient() {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw new Error('Razorpay is not configured on the server');
  }

  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }

  return razorpay;
}

/**
 * Create a Razorpay order (step 1 - frontend opens checkout with this)
 */
export async function createOrder({ userId, packId }) {
  const pack = CREDIT_PACKS[packId];
  if (!pack) throw new Error(`Invalid pack: ${packId}`);
  const razorpay = getRazorpayClient();

  logger.info('Creating Razorpay order', {
    userId,
    packId,
    keyId: config.razorpay.keyId,
    keySecretMasked: maskSecret(config.razorpay.keySecret),
    keySecretLength: config.razorpay.keySecret.length,
  });

  const order = await razorpay.orders.create({
    amount: pack.price,
    currency: pack.currency,
    receipt: buildReceipt(packId),
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
 * Verify Razorpay payment signature (step 2 - called after frontend payment success)
 * Razorpay sends: razorpay_order_id, razorpay_payment_id, razorpay_signature
 */
export async function verifyAndCreditPayment({ orderId, paymentId, signature, userId, packId }) {
  const razorpay = getRazorpayClient();
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid payment signature - possible tamper attempt');
  }

  const pack = CREDIT_PACKS[packId];
  if (!pack) throw new Error(`Invalid pack: ${packId}`);

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
 * Handle Razorpay webhook (optional - backup to frontend verification)
 * Set webhook secret in Razorpay dashboard > Settings > Webhooks
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
      await addCreditsToUser(userId, parseInt(credits, 10), {
        reason: `Webhook: purchased ${packId} pack`,
        razorpayPaymentId: payment.id,
      });
      logger.info('Credits added via webhook', { userId, credits, packId });
    }
  }

  return { received: true };
}
