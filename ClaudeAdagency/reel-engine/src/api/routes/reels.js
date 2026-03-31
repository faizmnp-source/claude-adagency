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
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
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
import { CREDIT_PACKS } from '../../services/payments/razorpay.js';

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
      images = [],         // Array of { base64, contentType, filename } — direct upload (no S3 needed)
      imageS3Keys = [],    // Already-uploaded S3 keys (optional)
      imageUrls = [],      // Direct URLs (optional)
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

    // Build image URLs for Claude — prefer direct URLs, then S3 presigned, then base64 data URIs
    let resolvedImageUrls = [];
    if (imageUrls.length) {
      resolvedImageUrls = imageUrls;
    } else if (imageS3Keys.length) {
      resolvedImageUrls = await Promise.all(imageS3Keys.map((k) => getPresignedUrl(k, 86400)));
    } else if (images.length) {
      // Base64 images — convert to data URIs so Claude vision can read them
      resolvedImageUrls = images.map(img => `data:${img.contentType};base64,${img.base64}`);
    }

    if (!resolvedImageUrls.length) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // ── Run AI content generation INLINE (no worker needed) ──────────────
    const { generateReelContent } = await import('../../services/ai/contentGenerator.js');
    const content = await generateReelContent({
      imageUrls: resolvedImageUrls,
      productDescription,
      brandName,
      duration: parseInt(duration),
      tone,
      targetAudience,
    });

    // Save base64 images as temp files so Replicate can fetch them via public URL
    const savedImagePaths = [];
    for (let i = 0; i < resolvedImageUrls.length; i++) {
      const url = resolvedImageUrls[i];
      if (url.startsWith('data:')) {
        const commaIdx = url.indexOf(',');
        const meta = url.slice(5, commaIdx);
        const ext = meta.split(';')[0].split('/')[1] || 'jpg';
        const tempPath = `/tmp/reel-img-${reelId}-${i}.${ext}`;
        await fs.writeFile(tempPath, Buffer.from(url.slice(commaIdx + 1), 'base64'));
        savedImagePaths.push(tempPath);
      }
    }
    if (savedImagePaths.length) {
      await redis.set(`reel:images:${reelId}`, JSON.stringify(savedImagePaths), 'EX', 3600);
    }

    // Store result in Redis so status endpoint can return it
    const result = {
      reelId,
      status: 'completed',
      content,
      creditsUsed: creditResult.required,
      creditsRemaining: creditResult.balance,
      hasImages: savedImagePaths.length > 0,
    };
    await redis.set(`reel:result:${reelId}`, JSON.stringify(result), 'EX', 86400);

    logger.info('Reel content generated inline', { reelId, userId, duration });

    // Also queue video job in background (won't block response)
    addReelJob(userId, reelId, {
      imageS3Keys,
      imageUrls: resolvedImageUrls,
      productDescription,
      brandName,
      duration: parseInt(duration),
      voice,
      music,
      tone,
      targetAudience,
      content, // pass pre-generated content so worker skips Claude step
    }).catch(() => {}); // fire and forget

    res.status(200).json({
      message: 'Reel content generated',
      reelId,
      content,
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

// ── GET /api/reels/:id/images/:index ─────────────────────────────────────
// Serves temp product images so Replicate can fetch them via public URL
router.get('/:id/images/:index', async (req, res) => {
  try {
    const { id: reelId, index } = req.params;
    const stored = await redis.get(`reel:images:${reelId}`);
    if (!stored) return res.status(404).json({ error: 'Images not found or expired' });
    const paths = JSON.parse(stored);
    const filePath = paths[parseInt(index)];
    if (!filePath || !existsSync(filePath)) return res.status(404).json({ error: 'Image file not found' });
    res.sendFile(path.resolve(filePath));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/reels/:id/generate-video ───────────────────────────────────
// Runs Replicate image-to-video inline (no worker needed)
// Call this after /generate gives you script+content
router.post('/:id/generate-video', authMiddleware, async (req, res) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(503).json({ error: 'REPLICATE_API_TOKEN not configured' });
    }

    const { id: reelId } = req.params;
    const { quality } = req.body; // quality: 'budget' | 'default' | 'premium'

    // Build public URLs for saved temp images so Replicate can fetch them
    const savedPaths = await redis.get(`reel:images:${reelId}`);
    if (!savedPaths) {
      return res.status(400).json({ error: 'No images found for this reel. Images expire after 1 hour — regenerate the reel.' });
    }
    const paths = JSON.parse(savedPaths);
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const imageUrls = paths.map((_, i) => `https://${host}/api/reels/${reelId}/images/${i}`);

    logger.info('Building image URLs for Replicate', { reelId, imageUrls });

    // Load stored reel content (script generated in /generate step)
    const stored = await redis.get(`reel:result:${reelId}`);
    if (!stored) return res.status(404).json({ error: 'Reel not found — call /generate first' });

    const reel = JSON.parse(stored);
    const scenes = reel.content?.scenes || [];

    if (!scenes.length) {
      // No scenes — generate one clip per image
      logger.info('No scenes in content, generating one clip per image', { reelId });
      const { generateSceneClip } = await import('../../services/video/replicateGenerator.js');

      const clips = await Promise.all(
        imageUrls.slice(0, 4).map((imageUrl, i) =>
          generateSceneClip({
            imageUrl,
            prompt: reel.content?.script?.[0] || 'product showcase, smooth camera motion',
            sceneNumber: i,
            reelId,
            quality,
          })
        )
      );

      const updated = { ...reel, videoClips: clips, videoStatus: 'clips_ready' };
      await redis.set(`reel:result:${reelId}`, JSON.stringify(updated), 'EX', 86400);
      return res.json({ reelId, videoClips: clips, message: `${clips.length} clips generated` });
    }

    // Generate one clip per scene
    const { generateAllSceneClips } = await import('../../services/video/replicateGenerator.js');

    const clips = await generateAllSceneClips({
      scenes,
      imageUrls,
      reelId,
      quality,
      onProgress: (pct) => logger.info('Video generation progress', { reelId, pct }),
    });

    const updated = { ...reel, videoClips: clips, videoStatus: 'clips_ready' };
    await redis.set(`reel:result:${reelId}`, JSON.stringify(updated), 'EX', 86400);

    logger.info('All video clips generated', { reelId, count: clips.length });
    res.json({ reelId, videoClips: clips, message: `${clips.length} clips generated` });
  } catch (err) {
    logger.error('Video generation error', { err: err.message });
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
