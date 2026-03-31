/**
 * Reel Generation Worker — BullMQ
 * Orchestrates the full pipeline:
 * 1. Generate AI content (Claude)
 * 2. Generate scene video clips (Replicate)
 * 3. Generate voiceover (ElevenLabs) [optional]
 * 4. Get background music (Suno/Pixabay) [optional]
 * 5. Process with FFmpeg (merge, mix, subtitles)
 * 6. Upload final MP4 to S3
 * 7. Notify completion
 */
import { Worker } from 'bullmq';
import fs from 'fs/promises';
import { redis, QUEUES } from '../queue/index.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { generateReelContent } from '../services/ai/contentGenerator.js';
import { generateAllSceneClips } from '../services/video/replicateGenerator.js';
import { generateVoiceover } from '../services/audio/elevenlabs.js';
import { getBackgroundMusic } from '../services/audio/musicService.js';
import {
  mergeSceneClips,
  addVoiceover,
  addBackgroundMusic,
  addSubtitles,
  finalExport,
} from '../services/video/ffmpegProcessor.js';
import {
  uploadToS3,
  downloadFromS3,
  downloadToTemp,
  s3Keys,
} from '../services/storage/s3.js';
import { refundCredits } from '../services/credits/creditService.js';
import { cleanupTempFiles, tmpFile } from '../utils/helpers.js';

const WORKER_CONCURRENCY = 2;

const worker = new Worker(
  QUEUES.REEL_GENERATION,
  async (job) => {
    const {
      userId,
      reelId,
      imageS3Keys,
      imageUrls,
      productDescription,
      brandName,
      duration,
      voice,
      music,
      tone,
      targetAudience,
    } = job.data;

    logger.info('Starting reel generation', { reelId, userId, duration });

    try {
      // ── STEP 1: AI Content Generation ──────────────────────────
      await job.updateProgress({ step: 'ai_content', percent: 5, message: 'Generating viral script...' });

      const content = await generateReelContent({
        imageUrls,
        productDescription,
        brandName: brandName || 'TheCraftStudios',
        duration,
        tone: tone || 'energetic',
        targetAudience: targetAudience || 'Indian social media users 18-35',
      });

      // Save content JSON to S3
      const contentKey = `reels/${reelId}/content.json`;
      await uploadBufferToS3(
        Buffer.from(JSON.stringify(content, null, 2)),
        contentKey,
        'application/json'
      );

      await job.updateProgress({ step: 'video_gen', percent: 15, message: 'Generating video scenes...' });

      // ── STEP 2: Generate Scene Clips (Replicate) ────────────────
      const sceneResults = await generateAllSceneClips({
        scenes: content.scenes,
        imageUrls,
        reelId,
        onProgress: (pct) => job.updateProgress({
          step: 'video_gen',
          percent: 15 + Math.round(pct * 0.45),
          message: `Generating scenes... ${pct}%`,
        }),
      });

      // Download all scene clips to temp for FFmpeg
      const sceneClipsLocal = await Promise.all(
        sceneResults.map(async (result) => {
          const localPath = tmpFile(`scene-${result.sceneNumber}-${reelId}.mp4`);
          await downloadToTemp(result.s3Url, localPath);
          return { ...result, localPath };
        })
      );

      await job.updateProgress({ step: 'merge', percent: 62, message: 'Merging scenes...' });

      // ── STEP 3: Merge scene clips ────────────────────────────────
      let videoPath = await mergeSceneClips(sceneClipsLocal);

      // ── STEP 4: Voiceover (optional) ─────────────────────────────
      if (voice && content.script) {
        await job.updateProgress({ step: 'voice', percent: 68, message: 'Generating voiceover...' });
        const voicePath = await generateVoiceover(content.script, reelId);
        videoPath = await addVoiceover(videoPath, voicePath);
        // Upload voice to S3
        await uploadToS3(voicePath, s3Keys.reelVoice(reelId), 'audio/mpeg');
        await fs.unlink(voicePath).catch(() => {});
      }

      // ── STEP 5: Background Music (optional) ──────────────────────
      if (music) {
        await job.updateProgress({ step: 'music', percent: 74, message: 'Adding background music...' });
        const musicMood = content.visualDirection?.musicMood || 'energetic';
        const musicPath = await getBackgroundMusic(musicMood, duration, reelId);
        videoPath = await addBackgroundMusic(videoPath, musicPath, voice ? 0.12 : 0.35);
        await uploadToS3(musicPath, s3Keys.reelMusic(reelId), 'audio/mpeg');
        await fs.unlink(musicPath).catch(() => {});
      }

      // ── STEP 6: Add Subtitles ────────────────────────────────────
      await job.updateProgress({ step: 'subtitles', percent: 80, message: 'Adding subtitles...' });
      videoPath = await addSubtitles(videoPath, content.scenes, reelId);

      // ── STEP 7: Final Export ─────────────────────────────────────
      await job.updateProgress({ step: 'export', percent: 88, message: 'Finalizing reel...' });
      const finalPath = await finalExport(videoPath, reelId, { watermarkText: 'thecraftstudios.in' });

      // ── STEP 8: Upload Final to S3 ───────────────────────────────
      await job.updateProgress({ step: 'upload', percent: 94, message: 'Uploading final reel...' });
      const finalS3Key = s3Keys.reelFinal(reelId);
      const finalUrl = await uploadToS3(finalPath, finalS3Key, 'video/mp4');

      // ── STEP 9: Cleanup temp files ───────────────────────────────
      await cleanupTempFiles(reelId);

      const result = {
        reelId,
        userId,
        finalUrl,
        finalS3Key,
        content,
        duration,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      // Store result in Redis for quick retrieval
      await redis.setex(`reel:result:${reelId}`, 86400 * 7, JSON.stringify(result)); // 7 day TTL

      await job.updateProgress({ step: 'done', percent: 100, message: 'Reel ready!' });
      logger.info('Reel generation complete', { reelId, finalUrl });

      return result;

    } catch (error) {
      logger.error('Reel generation failed', { reelId, userId, error: error.message, stack: error.stack });

      // Refund credits on failure
      try {
        await refundCredits(userId, duration * config.credits.perSecond, reelId);
        logger.info('Credits refunded after failure', { userId, reelId });
      } catch (refundErr) {
        logger.error('Credit refund failed', { refundErr: refundErr.message });
      }

      await cleanupTempFiles(reelId).catch(() => {});
      throw error; // Re-throw for BullMQ retry logic
    }
  },
  {
    connection: redis,
    concurrency: WORKER_CONCURRENCY,
    limiter: {
      max: 10,      // Max 10 jobs per 60s (API rate limits)
      duration: 60000,
    },
  }
);

worker.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed`, { reelId: result?.reelId });
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed`, { error: err.message });
});

worker.on('progress', (job, progress) => {
  logger.debug(`Job ${job.id} progress`, progress);
});

logger.info('Reel generation worker started', { concurrency: WORKER_CONCURRENCY });

// ── Helpers needed in worker ─────────────────────────────────────────────────
async function uploadBufferToS3(buffer, key, contentType) {
  const { uploadBufferToS3: upload } = await import('../services/storage/s3.js');
  return upload(buffer, key, contentType);
}
