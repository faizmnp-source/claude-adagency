/**
 * Replicate API — AI video clip generation per scene
 * Uses Stable Video Diffusion with cross-scene consistency seeding
 */
import fetch from 'node-fetch';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { uploadToS3, downloadToTemp } from '../storage/s3.js';
import { tmpFile, sleep } from '../../utils/helpers.js';
import fs from 'fs/promises';

const REPLICATE_API = 'https://api.replicate.com/v1';

/**
 * Run a Replicate prediction and poll until complete
 * @param {string} modelVersion - Full model version string
 * @param {Object} input - Model input
 * @param {number} timeoutMs - Max wait time
 */
async function runPrediction(modelVersion, input, timeoutMs = 300_000) {
  const headers = {
    Authorization: `Bearer ${config.replicate.apiToken}`,
    'Content-Type': 'application/json',
    Prefer: 'wait', // Use synchronous wait if supported
  };

  const createRes = await fetch(`${REPLICATE_API}/predictions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ version: modelVersion, input }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate create failed: ${err}`);
  }

  let prediction = await createRes.json();
  const deadline = Date.now() + timeoutMs;

  while (['starting', 'processing'].includes(prediction.status)) {
    if (Date.now() > deadline) throw new Error('Replicate prediction timeout');
    await sleep(3000);
    const pollRes = await fetch(`${REPLICATE_API}/predictions/${prediction.id}`, { headers });
    prediction = await pollRes.json();
    logger.debug('Replicate poll', { id: prediction.id, status: prediction.status });
  }

  if (prediction.status === 'failed') {
    throw new Error(`Replicate prediction failed: ${prediction.error}`);
  }

  return prediction;
}

/**
 * Generate a single video clip for a scene using image-to-video
 * @param {Object} params
 * @param {string} params.imageUrl - Source product image URL
 * @param {string} params.prompt - Scene description / Stable Diffusion prompt
 * @param {number} params.durationSeconds - Scene duration
 * @param {string} params.reelId - For S3 key naming
 * @param {number} params.sceneNumber
 * @param {string|null} params.seedImageUrl - For consistency: use same seed across scenes
 */
export async function generateSceneClip({
  imageUrl,
  prompt,
  durationSeconds,
  reelId,
  sceneNumber,
  seedImageUrl = null,
}) {
  logger.info('Generating scene clip', { reelId, sceneNumber, durationSeconds });

  // Stable Video Diffusion input — image-to-video
  const svdInput = {
    input_image: imageUrl || seedImageUrl,
    frames_per_second: 24,
    // SVD generates ~4s clips; for longer scenes we generate multiple and concat
    num_frames: Math.min(25, Math.ceil(durationSeconds * 24)),
    sizing_strategy: 'crop_to_16_9', // Force 9:16 for reels
    motion_bucket_id: 127, // 0=static, 255=max motion
    cond_aug: 0.02,
    decoding_chunk_size: 8,
    // Negative: avoid blurry, watermark
    negative_prompt: 'blurry, watermark, text, nsfw, deformed',
    prompt: prompt || 'professional product showcase, cinematic lighting, high quality',
  };

  const prediction = await runPrediction(config.replicate.videoModel, svdInput, 240_000);

  const outputUrl = Array.isArray(prediction.output)
    ? prediction.output[0]
    : prediction.output;

  if (!outputUrl) throw new Error('Replicate returned no output URL');

  // Download clip to temp and re-upload to our S3
  const tempPath = tmpFile(`scene-${sceneNumber}-${reelId}.mp4`);
  await downloadToTemp(outputUrl, tempPath);

  const s3Key = `reels/${reelId}/scenes/scene-${sceneNumber}.mp4`;
  const s3Url = await uploadToS3(tempPath, s3Key, 'video/mp4');

  await fs.unlink(tempPath).catch(() => {});
  logger.info('Scene clip uploaded to S3', { sceneNumber, s3Url });

  return { sceneNumber, s3Url, s3Key, duration: durationSeconds };
}

/**
 * Generate all scene clips in parallel (with concurrency limit to avoid Replicate rate limits)
 */
export async function generateAllSceneClips({ scenes, imageUrls, reelId, onProgress }) {
  const results = [];
  const CONCURRENCY = 2; // Replicate allows ~2 concurrent predictions on hobby plan

  // Use first product image as the seed for cross-scene consistency
  const seedImageUrl = imageUrls?.[0] || null;

  for (let i = 0; i < scenes.length; i += CONCURRENCY) {
    const batch = scenes.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((scene) =>
        generateSceneClip({
          imageUrl: imageUrls?.[scene.sceneNumber % imageUrls.length] || seedImageUrl,
          prompt: scene.replicatePrompt || scene.description,
          durationSeconds: scene.duration,
          reelId,
          sceneNumber: scene.sceneNumber,
          seedImageUrl,
        })
      )
    );
    results.push(...batchResults);
    if (onProgress) onProgress(Math.round(((i + batch.length) / scenes.length) * 100));
  }

  return results.sort((a, b) => a.sceneNumber - b.sceneNumber);
}
