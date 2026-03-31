/**
 * Replicate API — AI video clip generation per scene
 *
 * Models used (cheapest → best quality):
 *   budget:  wavespeedai/wan-2.1-i2v-480p  ~$0.09/sec  (480p, fast)
 *   default: minimax/hailuo-video-02-i2v   ~$0.28/6s   (720p, great product motion)
 *
 * Set REPLICATE_VIDEO_QUALITY=budget in env for cheaper test runs.
 */
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const REPLICATE_API = 'https://api.replicate.com/v1';

// Wan 2.1 supports duration: 5 only. Minimax supports 6 or 10.
const clampWan = (_d) => 5; // Wan always generates 5s clips
const clampMinimax = (d) => d <= 6 ? 6 : 10;

const MODELS = {
  // Wan 2.1 720p — confirmed working on Replicate, 720p, good motion quality
  // ~$0.45 per 5s clip. Best confirmed-working model.
  default: {
    owner: 'wavespeedai',
    name: 'wan-2.1-i2v-720p',
    input: (imageUrl, prompt, _duration) => ({
      image: imageUrl,
      prompt: prompt || 'product showcase, smooth cinematic camera motion, professional studio lighting, commercial quality video',
      duration: 5,
      guidance_scale: 7,
      num_inference_steps: 40,  // More steps = better quality (default 30)
    }),
  },
  // Wan 2.1 480p — cheapest, confirmed working, lower quality
  budget: {
    owner: 'wavespeedai',
    name: 'wan-2.1-i2v-480p',
    input: (imageUrl, prompt, _duration) => ({
      image: imageUrl,
      prompt: prompt || 'product showcase, smooth motion, professional',
      duration: 5,
      guidance_scale: 7,
      num_inference_steps: 30,
    }),
  },
  // Minimax Hailuo 720p — flat $0.28/6s, good quality if slug is correct
  premium: {
    owner: 'minimax',
    name: 'hailuo-video-02-i2v',
    input: (imageUrl, prompt, duration) => ({
      prompt: prompt || 'product showcase, smooth cinematic camera motion, professional lighting, ultra high quality commercial video',
      image_url: imageUrl,
      duration: clampMinimax(duration || 6),
    }),
  },
};

/**
 * Run a Replicate prediction and poll until complete
 */
async function runPrediction(model, input, timeoutMs = 300_000) {
  const headers = {
    Authorization: `Bearer ${config.replicate.apiToken}`,
    'Content-Type': 'application/json',
    Prefer: 'wait=60', // Wait up to 60s synchronously before falling back to polling
  };

  // New-style models use /models/{owner}/{name}/predictions
  const url = `${REPLICATE_API}/models/${model.owner}/${model.name}/predictions`;

  const createRes = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate create failed (${createRes.status}): ${err}`);
  }

  let prediction = await createRes.json();
  logger.info('Replicate prediction created', { id: prediction.id, status: prediction.status });

  const deadline = Date.now() + timeoutMs;

  // Poll until done
  while (['starting', 'processing'].includes(prediction.status)) {
    if (Date.now() > deadline) throw new Error('Replicate prediction timeout after ' + timeoutMs / 1000 + 's');

    await new Promise(r => setTimeout(r, 4000));

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
 *
 * @param {Object} params
 * @param {string} params.imageUrl  - Product image URL (must be publicly accessible)
 * @param {string} params.prompt    - Scene description
 * @param {number} params.sceneNumber
 * @param {string} params.reelId
 * @param {string} [params.quality] - 'budget' | 'default' | 'premium'
 * @returns {{ sceneNumber, videoUrl, duration }}
 */
export async function generateSceneClip({
  imageUrl,
  prompt,
  durationSeconds,
  sceneNumber,
  reelId,
  quality,
}) {
  const modelKey = quality || process.env.REPLICATE_VIDEO_QUALITY || 'default';
  const model = MODELS[modelKey] || MODELS.default;

  logger.info('Generating scene clip via Replicate', { reelId, sceneNumber, model: `${model.owner}/${model.name}` });

  const input = model.input(imageUrl, prompt, durationSeconds);
  const prediction = await runPrediction(model, input);

  const videoUrl = Array.isArray(prediction.output)
    ? prediction.output[0]
    : prediction.output;

  if (!videoUrl) throw new Error('Replicate returned no output URL');

  logger.info('Scene clip generated', { sceneNumber, videoUrl: videoUrl.substring(0, 60) + '...' });

  return {
    sceneNumber,
    videoUrl,
    duration: input.duration || 5,
    model: `${model.owner}/${model.name}`,
  };
}

/**
 * Generate all scene clips in parallel (max 2 concurrent to stay within Replicate limits)
 *
 * @param {Object[]} scenes   - Array of { sceneNumber, description, replicatePrompt }
 * @param {string[]} imageUrls - Product images (cycled across scenes)
 * @param {string}   reelId
 * @param {Function} [onProgress]
 * @param {string}   [quality]
 */
export async function generateAllSceneClips({ scenes, imageUrls, reelId, onProgress, quality }) {
  const CONCURRENCY = 2;
  const results = [];

  for (let i = 0; i < scenes.length; i += CONCURRENCY) {
    const batch = scenes.slice(i, i + CONCURRENCY);

    const batchResults = await Promise.all(
      batch.map((scene) =>
        generateSceneClip({
          imageUrl: imageUrls?.[scene.sceneNumber % Math.max(imageUrls.length, 1)] || imageUrls?.[0],
          prompt: scene.replicatePrompt || scene.description,
          durationSeconds: scene.duration,
          sceneNumber: scene.sceneNumber,
          reelId,
          quality,
        })
      )
    );

    results.push(...batchResults);
    if (onProgress) onProgress(Math.round(((i + batch.length) / scenes.length) * 100));
  }

  return results.sort((a, b) => a.sceneNumber - b.sceneNumber);
}
