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
  uploadToS3,
  getPresignedUploadUrl,
  getPresignedUrl,
  s3Keys,
} from '../../services/storage/s3.js';
import { redis } from '../../queue/index.js';
import { logger } from '../../utils/logger.js';
import { CREDIT_PACKS } from '../../services/payments/creditPacks.js';

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
      customPrompt = '',
      brandName,
      duration = 30,
      voice = false,
      music = true,
      tone = 'energetic',
      targetAudience,
      region = 'india',    // Region code for regional customization (india|america|pakistan|bangladesh|middle_east|british)
      language = 'hinglish', // Language code for script generation (english|hindi|urdu|hinglish, default: hinglish for India)
      industryCode = 'ecommerce', // Industry code for industry-specific content (ecommerce|fashion|beauty|food|technology|fitness|health|education|realestate|etc)
      customCta = '',        // Override auto-generated CTA with exact text
      seasonalEvent = '',    // e.g. "diwali", "blackfriday", "eid", "holi", "valentines", "productlaunch", "newyear", "christmas"
      brandVoice = '',       // Brand personality doc
      hashtagWhitelist = '', // Comma-separated hashtags to ALWAYS include
      hashtagBlacklist = '', // Comma-separated hashtags to NEVER use
      videoStyle = '',       // "cinematic" | "fast-cut" | "documentary" | "minimalist" | "ugc" | "talking-head"
      seriesContext = '',    // Campaign series info
    } = req.body;

    const userId = req.user.id;
    const reelId = uuid();

    if (![5, 15, 30, 50].includes(parseInt(duration))) {
      return res.status(400).json({ error: 'Duration must be 5, 15, 30, or 50 seconds. Got: ' + duration });
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
      customPrompt,
      brandName,
      duration: parseInt(duration),
      tone,
      targetAudience,
      region,
      language,
      industryCode,
      customCta,
      seasonalEvent,
      brandVoice,
      hashtagWhitelist,
      hashtagBlacklist,
      videoStyle,
      seriesContext,
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
      duration: parseInt(duration), // store chosen duration for clip planning
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
      customPrompt,
      brandName,
      duration: parseInt(duration),
      voice,
      music,
      tone,
      targetAudience,
      region, // pass region to worker for consistency
      language, // pass language to worker for consistency
      industryCode, // pass industry to worker for consistency
      customCta,
      seasonalEvent,
      brandVoice,
      hashtagWhitelist,
      hashtagBlacklist,
      videoStyle,
      seriesContext,
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

// ── GET /api/reels/packages — Video package info + pricing ───────────────
// NOTE: Must be declared BEFORE /:id wildcard routes
router.get('/packages', async (req, res) => {
  try {
    const { VIDEO_PACKAGES, MANUAL_MODELS, calcVideoCost } = await import('../../services/video/replicateGenerator.js');
    const { duration = 30 } = req.query;
    const dur = parseInt(duration) || 30;

    const packages = Object.values(VIDEO_PACKAGES).map(pkg => ({
      ...pkg,
      pricing: calcVideoCost(pkg.id, null, dur),
    }));

    const manualModels = Object.entries(MANUAL_MODELS).map(([key, m]) => ({
      key,
      ...m,
      pricing: calcVideoCost(null, key, dur),
    }));

    res.json({ packages, manualModels, duration: dur });
  } catch (err) {
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
// Posts the final reel to the user's connected Instagram account
router.post('/:id/post', authMiddleware, async (req, res) => {
  try {
    const { id: reelId } = req.params;
    const userId = req.user.id;
    const { customCaption, customHashtags } = req.body;

    // Check final video exists on disk
    const finalPath = await redis.get(`reel:final:${reelId}`);
    if (!finalPath || !existsSync(finalPath)) {
      return res.status(400).json({ error: 'Final video not ready. Please generate and stitch first.' });
    }

    // Check user has Instagram connected
    const igToken = await redis.get(`instagram:token:${userId}`);
    const igAccountId = await redis.get(`instagram:account:${userId}`);
    if (!igToken || !igAccountId) {
      return res.status(400).json({
        error: 'Instagram not connected. Connect your Instagram account first.',
        code: 'IG_NOT_CONNECTED',
      });
    }

    const stored = await redis.get(`reel:result:${reelId}`);
    const reel = stored ? JSON.parse(stored) : {};

    const captionText = customCaption || reel.content?.caption || '';
    const hashtags = customHashtags || reel.content?.hashtags || [];
    const fullCaption = hashtags.length
      ? `${captionText}\n\n${hashtags.join(' ')}`
      : captionText;

    // Build public video URL for Meta (uses the serve endpoint)
    const host = process.env.REEL_ENGINE_URL || `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
    const videoUrl = `${host}/api/reels/${reelId}/video`;

    logger.info('Posting reel to Instagram', { reelId, userId, igAccountId });

    const { postReelToInstagram } = await import('../../services/instagram/metaApi.js');
    const result = await postReelToInstagram({
      videoUrl,
      caption: fullCaption,
      accessToken: igToken,
      instagramAccountId: igAccountId,
    });

    // Mark reel as posted
    await redis.set(`reel:posted:${reelId}`, JSON.stringify({
      mediaId: result.mediaId,
      permalink: result.permalink,
      postedAt: Date.now(),
    }), 'EX', 86400 * 7);

    res.json({
      message: 'Posted to Instagram!',
      mediaId: result.mediaId,
      permalink: result.permalink,
    });
  } catch (err) {
    logger.error('Post to Instagram error', { err: err.message });
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
  let creditsCharged = false;
  let videoCost = null;
  let userId = null;
  let reelId = req.params.id;

  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(503).json({ error: 'REPLICATE_API_TOKEN not configured' });
    }

    reelId = req.params.id;
    // package: 'starter' | 'creator' | 'viral'
    // modelKey: manual model selection ('wan480p' | 'wan720p' | 'luma' | 'kling' | 'minimax')
    // quality: legacy alias for modelKey
    const { packageId, modelKey, quality } = req.body;

    const { generateSceneClip, VIDEO_PACKAGES, calcVideoCost, buildSceneVideoPrompt } = await import('../../services/video/replicateGenerator.js');

    // Build public URLs for saved temp images so Replicate can fetch them
    const savedPaths = await redis.get(`reel:images:${reelId}`);
    if (!savedPaths) {
      return res.status(400).json({ error: 'No images found for this reel. Images expire after 1 hour — regenerate the reel.' });
    }
    const paths = JSON.parse(savedPaths);
    // IMPORTANT: Must use the public REEL_ENGINE_URL so Replicate can actually fetch these images.
    // Never use req.headers.host — that can be internal/proxy hostname that Replicate can't reach.
    const publicBase = (process.env.REEL_ENGINE_URL || '').replace(/['"]/g, '').replace(/\/+$/, '')
      || `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
    const imageUrls = paths.map((_, i) => `${publicBase}/api/reels/${reelId}/images/${i}`);
    logger.info('Image URLs for Replicate', { publicBase, imageUrls });

    logger.info('Building image URLs for Replicate', { reelId, imageUrls });

    // Load stored reel content
    const stored = await redis.get(`reel:result:${reelId}`);
    if (!stored) return res.status(404).json({ error: 'Reel not found — call /generate first' });

    const reel = JSON.parse(stored);
    const totalDuration = reel.duration || 15;
    userId = req.user.id;

    // Resolve clip duration based on model (Minimax uses 6s, others 5s)
    const pkg = packageId ? VIDEO_PACKAGES[packageId] : null;
    const clipSec = pkg?.clipDurationSec || (modelKey === 'minimax' ? 6 : 5);
    const clipCount = Math.ceil(totalDuration / clipSec);
    const clipPlan = Array(clipCount).fill(clipSec);

    // Calculate video generation credit cost and check balance
    videoCost = calcVideoCost(packageId || null, modelKey || quality || 'wan720p', totalDuration);

    const { getUserCredits, deductCredits } = await import('../../services/credits/creditService.js');
    const balance = await getUserCredits(userId);
    if (balance < videoCost.credits) {
      return res.status(402).json({
        error: 'Insufficient credits for video generation',
        required: videoCost.credits,
        balance,
        hint: `You need ${videoCost.credits} more credits. Buy more at /studio/credits`,
      });
    }

    // Deduct video generation credits
    await deductCredits(userId, videoCost.credits, `video-gen-${reelId}-${packageId || modelKey || 'default'}`);
    creditsCharged = true;

    logger.info('Clip plan', { reelId, totalDuration, clipPlan, packageId, modelKey, videoCost });

    const scenes = reel.content?.scenes || [];

    // Generate clips sequentially to respect Replicate rate limits
    const clips = [];
    for (let i = 0; i < clipPlan.length; i++) {
      const imageUrl = imageUrls[i % imageUrls.length];
      const scene = scenes[i] || scenes[scenes.length - 1];
      const prompt = buildSceneVideoPrompt(scene, reel.content?.script) || reel.content?.script || 'product showcase, cinematic motion';

      logger.info(`Generating clip ${i + 1}/${clipPlan.length} (${clipPlan[i]}s)`, { reelId, packageId, modelKey });
      const clip = await generateSceneClip({
        imageUrl,
        prompt,
        durationSeconds: clipPlan[i],
        sceneNumber: i,
        reelId,
        packageId,
        modelKey,
        quality,
      });
      clips.push(clip);
    }

    const updated = {
      ...reel,
      videoClips: clips,
      videoStatus: 'clips_ready',
      totalDuration,
      package: packageId,
      modelKey: modelKey || quality,
      videoCost,
    };
    await redis.set(`reel:result:${reelId}`, JSON.stringify(updated), 'EX', 86400);

    logger.info('All video clips generated', { reelId, count: clips.length, totalDuration, packageId });
    res.json({
      reelId,
      videoClips: clips,
      totalDuration,
      package: packageId,
      videoCost,
      message: `${clips.length} clips generated (${clipPlan.join('+')}s = ${totalDuration}s total)`,
    });
  } catch (err) {
    if (creditsCharged && userId && videoCost?.credits) {
      try {
        const { refundCredits } = await import('../../services/credits/creditService.js');
        await refundCredits(userId, videoCost.credits, reelId);
      } catch (refundErr) {
        logger.error('Video generation refund failed', { reelId, err: refundErr.message });
      }
    }
    logger.error('Video generation error', { err: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/reels/:id/stitch ────────────────────────────────────────────
// Downloads Replicate clips + stitches with FFmpeg into one final MP4
// Auto-adds ElevenLabs voice + MusicGen music based on package selection
router.post('/:id/stitch', authMiddleware, async (req, res) => {
  const { id: reelId } = req.params;
  const tempFiles = [];

  try {
    const stored = await redis.get(`reel:result:${reelId}`);
    if (!stored) return res.status(404).json({ error: 'Reel not found' });

    const reel = JSON.parse(stored);
    const clips = reel.videoClips || [];

    if (!clips.length) {
      return res.status(400).json({ error: 'No video clips found. Run generate-video first.' });
    }

    // Determine audio features from package selection
    const { VIDEO_PACKAGES } = await import('../../services/video/replicateGenerator.js');
    const pkg = reel.package ? VIDEO_PACKAGES[reel.package] : null;
    const wantVoice = pkg?.voice ?? false;
    const wantMusic = pkg?.music ?? false;

    logger.info('Stitching clips', { reelId, clipCount: clips.length, package: reel.package, wantVoice, wantMusic });

    const { downloadFile, tmpFile } = await import('../../utils/helpers.js');
    const { mergeSceneClips, addVoiceover, addBackgroundMusic, finalExport } = await import('../../services/video/ffmpegProcessor.js');

    const totalDuration = reel.totalDuration || reel.duration || null;
    const audioMessages = [];

    // Download all clips to temp files
    const sceneClips = [];
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const localPath = tmpFile(`clip-${reelId}-${i}.mp4`);
      logger.info(`Downloading clip ${i + 1}/${clips.length}`, { url: clip.videoUrl });
      await downloadFile(clip.videoUrl, localPath);
      tempFiles.push(localPath);
      sceneClips.push({ localPath, duration: clip.duration || 5 });
    }

    // Stitch clips together (silent video)
    const mergedPath = await mergeSceneClips(sceneClips, reelId);
    tempFiles.push(mergedPath);
    tempFiles.push(tmpFile(`${reelId}-concat-list.txt`));

    let currentVideoPath = mergedPath;

    // ── Auto ElevenLabs Voiceover via Replicate (Creator + Viral packages) ─
    if (wantVoice && process.env.REPLICATE_API_TOKEN) {
      try {
        logger.info('Auto-generating ElevenLabs voiceover', { reelId });
        const script = reel.content?.script || reel.content?.voiceover || '';
        if (script) {
          const { generateVoiceover } = await import('../../services/audio/elevenlabs.js');
          const voicePath = await generateVoiceover(script, reelId, {
            stability: 0.45,
            similarityBoost: 0.8,
            style: 0.4,
          });
          tempFiles.push(voicePath);

          const withVoicePath = await addVoiceover(currentVideoPath, voicePath, reelId);
          tempFiles.push(withVoicePath);
          currentVideoPath = withVoicePath;
          audioMessages.push('✅ ElevenLabs AI voice added');
          logger.info('Voiceover added to video', { reelId });
        } else {
          audioMessages.push('⚠️ Voice skipped — no script text found');
        }
      } catch (voiceErr) {
        // Non-fatal — continue without voice
        logger.warn('ElevenLabs voiceover failed (non-fatal)', { reelId, err: voiceErr.message });
        audioMessages.push(`⚠️ Voice skipped: ${voiceErr.message}`);
      }
    } else if (wantVoice && !process.env.REPLICATE_API_TOKEN) {
      audioMessages.push('⚠️ Voice skipped — REPLICATE_API_TOKEN not set');
    }

    // ── Auto Background Music (Viral package — MusicGen via Replicate) ───
    if (wantMusic && process.env.REPLICATE_API_TOKEN) {
      try {
        logger.info('Auto-generating background music via MusicGen', { reelId });
        const { generateBackgroundMusic, buildMusicPrompt } = await import('../../services/audio/musicGenerator.js');

        const musicPrompt = buildMusicPrompt(reel.content, {
          tone: reel.tone || 'energetic',
          industry: reel.industryCode || 'ecommerce',
        });

        const musicDuration = Math.min(totalDuration || 30, 30); // MusicGen max 30s
        const musicPath = await generateBackgroundMusic({
          prompt: musicPrompt,
          duration: musicDuration,
          reelId,
        });
        tempFiles.push(musicPath);

        // Duck music under voice (15% volume if voice present, 30% if music only)
        const musicVolume = wantVoice ? 0.15 : 0.30;
        const withMusicPath = await addBackgroundMusic(currentVideoPath, musicPath, musicVolume, reelId);
        tempFiles.push(withMusicPath);
        currentVideoPath = withMusicPath;
        audioMessages.push('✅ AI background music added (MusicGen)');
        logger.info('Background music added to video', { reelId });
      } catch (musicErr) {
        // Non-fatal — continue without music
        logger.warn('MusicGen failed (non-fatal)', { reelId, err: musicErr.message });
        audioMessages.push(`⚠️ Music skipped: ${musicErr.message}`);
      }
    } else if (wantMusic && !process.env.REPLICATE_API_TOKEN) {
      audioMessages.push('⚠️ Music skipped — REPLICATE_API_TOKEN not set');
    }

    // Final export — trim to exact reel duration + watermark + Instagram encoding
    const finalPath = await finalExport(
      currentVideoPath,
      reelId,
      { watermarkText: 'thecraftstudios.in', trimTo: totalDuration }
    );

    const finalS3Key = s3Keys.reelFinal(reelId);
    const finalUrl = await uploadToS3(finalPath, finalS3Key, 'video/mp4');

    logger.info('Stitch complete', { reelId, finalPath, audioMessages });

    // Store final video path in Redis (48h TTL)
    await redis.set(`reel:final:${reelId}`, finalPath, 'EX', 172800);

    // Update reel result with final ready flag
    const updated = {
      ...reel,
      finalVideoReady: true,
      videoStatus: 'final_ready',
      audioMessages,
      finalS3Key,
      finalUrl,
    };
    await redis.set(`reel:result:${reelId}`, JSON.stringify(updated), 'EX', 86400);

    // Clean up intermediate temp files (not the final MP4)
    for (const f of tempFiles) {
      await import('fs/promises').then(m => m.unlink(f).catch(() => {}));
    }

    const host = process.env.REEL_ENGINE_URL || `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
    const videoUrl = `${host}/api/reels/${reelId}/video`;

    res.json({
      reelId,
      videoUrl,
      totalDuration,
      audioMessages,
      message: 'Reel ready for review!',
    });

  } catch (err) {
    // Clean up on error
    for (const f of tempFiles) {
      await import('fs/promises').then(m => m.unlink(f).catch(() => {}));
    }
    logger.error('Stitch error', { err: err.message });
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

// ── GET /api/reels/:id/video ──────────────────────────────────────────────
// Stream final stitched MP4 — supports Range requests for seek in <video>
router.get('/:id/video', async (req, res) => {
  try {
    const { id: reelId } = req.params;
    const finalPath = await redis.get(`reel:final:${reelId}`);

    if (!finalPath || !existsSync(finalPath)) {
      const stored = await redis.get(`reel:result:${reelId}`);
      const reel = stored ? JSON.parse(stored) : null;
      if (reel?.finalS3Key) {
        const fallbackUrl = await getPresignedUrl(reel.finalS3Key, 3600);
        return res.redirect(fallbackUrl);
      }
      return res.status(404).json({ error: 'Final video not found. Please stitch first.' });
    }

    const { stat } = await import('fs/promises').then(m => ({ stat: m.stat }));
    const fileStat = await import('fs/promises').then(m => m.stat(finalPath));
    const fileSize = fileStat.size;

    const range = req.headers.range;
    if (range) {
      // Partial content — supports seeking in browser video player
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunkSize);
      res.setHeader('Content-Type', 'video/mp4');
      res.status(206);

      const { createReadStream } = await import('fs');
      createReadStream(finalPath, { start, end }).pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Disposition', `inline; filename="reel-${reelId}.mp4"`);

      const { createReadStream } = await import('fs');
      createReadStream(finalPath).pipe(res);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/reels/:id/download ───────────────────────────────────────────
// Force-download the final MP4 (same as /video but with attachment header)
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const { id: reelId } = req.params;
    const finalPath = await redis.get(`reel:final:${reelId}`);

    if (!finalPath || !existsSync(finalPath)) {
      const stored = await redis.get(`reel:result:${reelId}`);
      const reel = stored ? JSON.parse(stored) : null;
      if (reel?.finalS3Key) {
        const fallbackUrl = await getPresignedUrl(reel.finalS3Key, 3600);
        return res.redirect(fallbackUrl);
      }
      return res.status(404).json({ error: 'Final video not found. Please stitch first.' });
    }

    const fileStat = await import('fs/promises').then(m => m.stat(finalPath));
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', fileStat.size);
    res.setHeader('Content-Disposition', `attachment; filename="reel-${reelId}.mp4"`);

    const { createReadStream } = await import('fs');
    createReadStream(finalPath).pipe(res);
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

// ── POST /api/reels/:id/review ────────────────────────────────────────────
// AI reviews reel content and suggests improvements
router.post('/:id/review', async (req, res) => {
  try {
    const reelData = await redis.get(`reel:result:${req.params.id}`);
    if (!reelData) return res.status(404).json({ error: 'Reel not found' });

    const reel = JSON.parse(reelData);
    const { region, industry, brandName } = req.body;

    const { reviewContent } = await import('../../services/ai/contentReviewer.js');
    const review = await reviewContent({
      content: reel.content || reel,
      type: 'reel',
      brandName,
      region,
      industry,
    });

    res.json({ review });
  } catch (err) {
    console.error('[reels/review]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
