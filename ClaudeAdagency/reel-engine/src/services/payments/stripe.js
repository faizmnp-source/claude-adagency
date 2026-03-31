/**
 * Stripe Payment Service
 * Credit pack purchases + webhook handling
 */
import Stripe from 'stripe';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { addCreditsToUser, getUserCredits } from '../credits/creditService.js';

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2024-06-20' });

// Credit pack definitions (must match Stripe price IDs in env)
export const CREDIT_PACKS = {
  starter: {
    credits: 100,
    priceId: config.stripe.prices.credits100,
    name: 'Starter Pack — 100 Credits',
    description: '50 seconds of AI-generated reels',
    price: 499,    // ₹499
    currency: 'inr',
  },
  growth: {
    credits: 500,
    priceId: config.stripe.prices.credits500,
    name: 'Growth Pack — 500 Credits',
    description: '250 seconds of AI-generated reels',
    price: 1999,   // ₹1,999
    currency: 'inr',
  },
  viral: {
    credits: 1000,
    priceId: config.stripe.prices.credits1000,
    name: 'Viral Pack — 1000 Credits',
    description: '500 seconds of AI-generated reels',
    price: 3499,   // ₹3,499
    currency: 'inr',
  },
};

/**
 * Create a Stripe Checkout session for credit purchase
 */
export async function createCheckoutSession({ userId, packId, email, successUrl, cancelUrl }) {
  const pack = CREDIT_PACKS[packId];
  if (!pack) throw new Error(`Invalid pack: ${packId}`);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: pack.priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      packId,
      credits: pack.credits.toString(),
    },
    payment_intent_data: {
      metadata: { userId, packId, credits: pack.credits.toString() },
    },
    // Indian payment methods
    payment_method_options: {
      card: { request_three_d_secure: 'automatic' },
    },
  });

  logger.info('Stripe checkout session created', { sessionId: session.id, userId, packId });
  return { sessionId: session.id, url: session.url };
}

/**
 * Create a one-time payment intent (for custom flows)
 */
export async function createPaymentIntent({ userId, packId }) {
  const pack = CREDIT_PACKS[packId];
  if (!pack) throw new Error(`Invalid pack: ${packId}`);

  const intent = await stripe.paymentIntents.create({
    amount: pack.price,
    currency: pack.currency,
    metadata: { userId, packId, credits: pack.credits.toString() },
    automatic_payment_methods: { enabled: true },
  });

  return { clientSecret: intent.client_secret, amount: pack.price };
}

/**
 * Handle Stripe webhook events
 * Call this from the /webhooks/stripe route with raw body
 */
export async function handleStripeWebhook(rawBody, signature) {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret
    );
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  logger.info('Stripe webhook received', { type: event.type });

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.payment_status === 'paid') {
        const { userId, packId, credits } = session.metadata;
        await addCreditsToUser(userId, parseInt(credits), {
          reason: `Purchased ${packId} pack`,
          stripeSessionId: session.id,
        });
        logger.info('Credits added after payment', { userId, credits, packId });
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const intent = event.data.object;
      if (intent.metadata.userId) {
        const { userId, credits, packId } = intent.metadata;
        await addCreditsToUser(userId, parseInt(credits), {
          reason: `Purchased ${packId} pack (PI)`,
          stripePaymentIntentId: intent.id,
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      logger.warn('Payment failed', { intentId: event.data.object.id });
      break;
    }
  }

  return { received: true };
}

/**
 * Get customer's payment history
 */
export async function getPaymentHistory(stripeCustomerId) {
  const charges = await stripe.charges.list({
    customer: stripeCustomerId,
    limit: 20,
  });
  return charges.data.map((c) => ({
    id: c.id,
    amount: c.amount / 100,
    currency: c.currency.toUpperCase(),
    status: c.status,
    description: c.description,
    date: new Date(c.created * 1000),
  }));
}
