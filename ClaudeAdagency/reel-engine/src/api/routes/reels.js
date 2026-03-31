/**
 * Reels API Routes
 * POST /api/reels/generate       — Start reel generation
 * GET  /api/reels/:id/status     — Poll job progress
 * GET  /api/reels/:id            — Get completed reel result
 * POST /api/reels/:id/regenerate — Regenerate (uses free regen allowance)
 * POST /api/reels/:id/post       — Auto-post to Instagram
 * GET  /api/reels/upload-url     — Get presigned S3 upload URL
 */
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import { requireCredits } from '../middleware/credits.js';
import {
  addReelJob,
  addInstagramPostJob,
  getJobProgress,
} from '../../queue/index.js';
import {
  deductCreditsForReel,
  checkRegenAllowance,
  getUserCredits,
} from '../../services/credits/creditService.js';
import {
  getPresignedUploadUrl,
  getPresignedUrl,
  s3Keys,
} from '../../services/storage/s3.js';
import { redis } from '../../queue/index.js';
import { logger } from '../../utils/logger.js';
import { CREDIT_PACKS } from '../../services/payments/stripe.js';

const router = Router();

// Multer for direct image uploads (max 10MB per file, max 10 files)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  },
});

// ── GET /api/reels/upload-url ─────────────────────────────────────────────
router.get('/upload-url', authMiddleware, async (req, res) => {
  try {
    const { filename, contentType } = req.query;
    if (!filename || !contentType) {
      return res.status(400).json({ error: 'filename and contentType required' });
    }

    const reelId = uuid();
    const s3Key = s3Keys.reelInput(reelId, filename);
    const uploadUrl = await getPresignedUploadUrl(s3Key, contentType);

    res.json({ uploadUrl, s3Key, reelId });
  } catch (err) {
    logger.error('Upload URL error', { err: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/reels/generate ─────────────────────────────────────────────
router.post('/generate', authMiddleware, requireCredits, async (req, res) => {
  try {
    const {
      imageS3Keys = [],    // Array of already-uploaded S3 keys
      imageUrls = [],      // Or direct URLs
      productDescription,
      brandName,
      duration = 30,
      voice = false,
      music = true,
      tone = 'energetic',
      targetAudience,
    } = req.body;

    const userId = req.user.id;
    const reelId = uuid();

    // Validate duration
    if (![15, 30, 50].includes(parseInt(duration))) {
      return res.status(400).json({ error: 'Duration must be 15, 30, or 50 seconds' });
    }

    // Deduct credits
    const creditResult = await deductCreditsForReel(userId, duration);
    if (!creditResult.success) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: creditResult.required,
        balance: creditResult.balance,
      });
    }

    // Convert S3 keys to public URLs for Claude image analysis
    const resolvedImageUrls = imageUrls.length
      ? imageUrls
      : await Promise.all(imageS3Keys.map((k) => getPresignedUrl(k, 86400)));

    // Queue the job
    const job = await addReelJob(userId, reelId, {
      imageS3Keys,
      imageUrls: resolvedImageUrls,
      productDescription,
      brandName,
      duration: parseInt(duration),
      voice,
      music,
      tone,
      targetAudience,
    });

    logger.info('Reel job queued', { reelId, userId, duration, jobId: job.id });

    res.status(202).json({
      message: 'Reel generation started',
      reelId,
      jobId: job.id,
      estimatedTime: `${duration * 2}–${duration * 4} seconds`,
      creditsUsed: creditResult.required,
      creditsRemaining: creditResult.balance,
    });
  } catch (err) {
    logger.error('Generate reel error', { err: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/reels/:id/status ─────────────────────────────────────────────
router.get('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id: reelId } = req.params;
    const progress = await getJobProgress(reelId);

    if (!progress) {
      // Check if completed and stored in Redis
      const stored = await redis.get(`reel:result:${reelId}`);
      if (stored) {
        return res.json({ status: 'completed', ...JSON.parse(stored) });
      }
      return res.status(404).json({ error: 'Reel not found' });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/reels/:id ────────────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id: reelId } = req.params;
    const stored = await redis.get(`reel:result:${reelId}`);

    if (!stored) return res.status(404).json({ error: 'Reel not found or still processing' });

    const result = JSON.parse(stored);

    // Generate a fresh presigned download URL (1hr)
    if (result.finalS3Key) {
      result.downloadUrl = await getPresignedUrl(result.finalS3Key, 3600);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/reels/:id/regenerate ────────────────────────────────────────
router.post('/:id/regenerate', authMiddleware, async (req, res) => {
  try {
    const { id: reelId } = req.params;
    const userId = req.user.id;
    const { scenes, reason, duration = 30 } = req.body;

    const allowance = await checkRegenAllowance(userId, reelId, duration);

    if (!allowance.allowed) {
      return res.status(402).json({
        error: 'Insufficient credits for regeneration',
        ...allowance,
      });
    }

    // Get existing content
    const stored = await redis.get(`reel:result:${reelId}`);
    if (!stored) return res.status(404).json({ error: 'Original reel not found' });
    const original = JSON.parse(stored);

    // Queue a new reel job with existing content + regeneration flag
    const newReelId = uuid();
    const job = await addReelJob(userId, newReelId, {
      ...original,
      regenFrom: reelId,
      regenScenes: scenes,
      regenReason: reason,
    });

    res.status(202).json({
      message: allowance.free
        ? `Free regeneration ${allowance.regenUsed}/${allowance.regenLimit}`
        : 'Paid regeneration queued',
      reelId: newReelId,
      jobId: job.id,
      ...allowance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/reels/:id/post ──────────────────────────────────────────────
router.post('/:id/post', authMiddleware, async (req, res) => {
  try {
    const { id: reelId } = req.params;
    const { scheduleAt, customCaption, customHashtags } = req.body;

    const stored = await redis.get(`reel:result:${reelId}`);
    if (!stored) return res.status(404).json({ error: 'Reel not found' });

    const reel = JSON.parse(stored);
    if (!reel.finalS3Key) return res.status(400).json({ error: 'Reel not yet completed' });

    const caption = customCaption || reel.content?.caption || '';
    const hashtags = customHashtags || reel.content?.hashtags || [];

    // Schedule (delay) if scheduleAt provided
    const delay = scheduleAt ? Math.max(0, new Date(scheduleAt) - Date.now()) : 0;

    const job = await addInstagramPostJob(
      reelId,
      {
        s3Key: reel.finalS3Key,
        caption,
        hashtags,
        userId: req.user.id,
      },
      delay
    );

    res.status(202).json({
      message: delay > 0 ? 'Post scheduled' : 'Posting to Instagram...',
      jobId: job.id,
      scheduledFor: scheduleAt || 'immediately',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/reels/credits ────────────────────────────────────────────────
router.get('/me/credits', authMiddleware, async (req, res) => {
  try {
    const balance = await getUserCredits(req.user.id);
    res.json({
      balance,
      packs: Object.entries(CREDIT_PACKS).map(([id, pack]) => ({
        id,
        ...pack,
        priceId: undefined,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
