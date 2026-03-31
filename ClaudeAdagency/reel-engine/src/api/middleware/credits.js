import { getUserCredits, getCreditCost } from '../../services/credits/creditService.js';

/**
 * Middleware: check user has enough credits before reel generation
 * Reads `duration` from req.body
 */
export async function requireCredits(req, res, next) {
  const duration = parseInt(req.body?.duration || req.query?.duration || '30');
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const required = getCreditCost(duration);
  const balance = await getUserCredits(userId);

  if (balance < required) {
    return res.status(402).json({
      error: 'Insufficient credits',
      required,
      balance,
      deficit: required - balance,
      upgradeUrl: '/studio/credits',
    });
  }

  req.creditInfo = { required, balance, duration };
  next();
}
