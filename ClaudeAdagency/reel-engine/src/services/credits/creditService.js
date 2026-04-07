/**
 * Credit System
 * - 1 second of reel = 2 credits
 * - 3 free regenerations per reel
 * - New users get bonus credits
 * Storage: Redis (fast) + a persistent store (you can swap for Postgres/Supabase)
 */
import { redis } from '../../queue/index.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

// Redis key patterns
const keys = {
  userCredits: (uid) => `credits:${uid}`,
  regenCount: (reelId) => `regen:${reelId}`,
  txHistory: (uid) => `tx:${uid}`,
};

const TTL_TX = 60 * 60 * 24 * 90; // 90 days for transaction log

/**
 * Get a user's current credit balance
 */
export async function getUserCredits(userId) {
  const val = await redis.get(keys.userCredits(userId));
  return parseInt(val || '0');
}

/**
 * Add credits to a user (purchase, bonus, refund)
 */
export async function addCreditsToUser(userId, amount, meta = {}) {
  const newBalance = await redis.incrby(keys.userCredits(userId), amount);
  await logTransaction(userId, 'credit', amount, meta);
  logger.info('Credits added', { userId, amount, newBalance });
  return newBalance;
}

/**
 * Deduct credits for reel generation
 * @param {string} userId
 * @param {number} durationSeconds - Reel duration
 * @returns {Promise<{success: boolean, balance: number, required: number}>}
 */
export async function deductCreditsForReel(userId, durationSeconds) {
  const required = durationSeconds * config.credits.perSecond;
  const balance = await getUserCredits(userId);

  if (balance < required) {
    return { success: false, balance, required };
  }

  const newBalance = await redis.decrby(keys.userCredits(userId), required);
  await logTransaction(userId, 'debit', required, { reason: `Reel generation (${durationSeconds}s)` });
  logger.info('Credits deducted', { userId, required, newBalance });
  return { success: true, balance: newBalance, required };
}

/**
 * Check if a reel can be regenerated for free
 * Each reel gets FREE_REGENERATIONS free regens
 * @returns {Promise<{allowed: boolean, regenUsed: number, regenLimit: number, creditCost: number}>}
 */
export async function checkRegenAllowance(userId, reelId, durationSeconds) {
  const regenKey = keys.regenCount(reelId);
  const regenUsed = parseInt((await redis.get(regenKey)) || '0');
  const limit = config.credits.freeRegenerations;

  if (regenUsed < limit) {
    // Free regen — just increment counter
    await redis.incr(regenKey);
    await redis.expire(regenKey, 60 * 60 * 24 * 30); // 30 day TTL
    logger.info('Free regen used', { userId, reelId, regenUsed: regenUsed + 1, limit });
    return { allowed: true, free: true, regenUsed: regenUsed + 1, regenLimit: limit, creditCost: 0 };
  }

  // Paid regen — deduct half credits
  const creditCost = Math.ceil((durationSeconds * config.credits.perSecond) / 2);
  const balance = await getUserCredits(userId);

  if (balance < creditCost) {
    return { allowed: false, free: false, regenUsed, regenLimit: limit, creditCost, balance };
  }

  await redis.decrby(keys.userCredits(userId), creditCost);
  await redis.incr(regenKey);
  await logTransaction(userId, 'debit', creditCost, { reason: `Paid regen for reel ${reelId}` });

  return { allowed: true, free: false, regenUsed: regenUsed + 1, regenLimit: limit, creditCost };
}

/**
 * Initialize new user credits (bonus on signup)
 */
export async function initializeUserCredits(userId) {
  const existing = await redis.get(keys.userCredits(userId));
  if (existing !== null) return parseInt(existing); // Already initialized

  const bonus = config.credits.newUserBonus;
  await redis.set(keys.userCredits(userId), bonus);
  await logTransaction(userId, 'credit', bonus, { reason: 'Welcome bonus' });
  logger.info('New user credits initialized', { userId, bonus });
  return bonus;
}

/**
 * Deduct a specific number of credits (for video generation, etc.)
 * @param {string} userId
 * @param {number} amount
 * @param {string} reason
 * @returns {Promise<number>} new balance
 */
export async function deductCredits(userId, amount, reason = 'debit') {
  const newBalance = await redis.decrby(keys.userCredits(userId), amount);
  await logTransaction(userId, 'debit', amount, { reason });
  logger.info('Credits deducted', { userId, amount, newBalance, reason });
  return newBalance;
}

/**
 * Refund credits (e.g., if generation failed)
 */
export async function refundCredits(userId, amount, reelId) {
  const newBalance = await redis.incrby(keys.userCredits(userId), amount);
  await logTransaction(userId, 'refund', amount, { reason: `Failed generation refund for reel ${reelId}` });
  logger.info('Credits refunded', { userId, amount, reelId, newBalance });
  return newBalance;
}

/**
 * Get credit cost for a reel duration
 */
export function getCreditCost(durationSeconds) {
  return durationSeconds * config.credits.perSecond;
}

/**
 * Get transaction history for a user
 */
export async function getTransactionHistory(userId, limit = 20) {
  const raw = await redis.lrange(keys.txHistory(userId), 0, limit - 1);
  return raw.map((r) => JSON.parse(r));
}

// ── Private helpers ─────────────────────────────────────────────────────────

async function logTransaction(userId, type, amount, meta = {}) {
  const tx = JSON.stringify({
    type,
    amount,
    timestamp: new Date().toISOString(),
    ...meta,
  });
  await redis.lpush(keys.txHistory(userId), tx);
  await redis.ltrim(keys.txHistory(userId), 0, 99); // Keep last 100
  await redis.expire(keys.txHistory(userId), TTL_TX);
}
