/**
 * Replicate API — AI video clip generation per scene
 *
 * CONFIRMED WORKING MODELS (verified slugs):
 *   wan480p    wavespeedai/wan-2.1-i2v-480p      ~$0.22/5s   480p
 *   wan720p    wavespeedai/wan-2.1-i2v-720p      ~$0.45/5s   720p
 *   luma       luma/dream-machine                 ~$0.19/5s  1080p
 *   luma_flash luma/ray-flash-2                   ~$0.10/5s  1080p  (Luma fast)
 *   minimax    minimax/hailuo-video-02-i2v        ~$0.28/6s   720p
 *   kling      klingai/kling-v2.5-i2v             ~$0.35/5s  1080p
 *   veo2_flash google/veo-2-flash                 ~$0.25/5s   720p
 *   veo2       google/veo-2                       ~$0.50/5s  1080p
 *
 * PACKAGES (auto mode):
 *   starter → wan480p
 *   creator → wan720p + voice
 *   viral   → luma + voice + music
 *   ultra   → veo2 + voice + music
 */
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const REPLICATE_API = 'https://api.replicate.com/v1';

const MODELS = {
  wan480p: {
    owner: 'wavespeedai', name: 'wan-2.1-i2v-480p',
    label: '💰 Wan 480p', resolution: '480p', clipDuration: 5, estimatedUsdPerClip: 0.22,
    input: (imageUrl, prompt) => ({
      image: imageUrl,
      prompt: prompt || 'product showcase, smooth motion, professional',
      duration: 5, guidance_scale: 7, num_inference_steps: 30,
    }),
  },
  wan720p: {
    owner: 'wavespeedai', name: 'wan-2.1-i2v-720p',
    label: '⚡ Wan 720p', resolution: '720p', clipDuration: 5, estimatedUsdPerClip: 0.45,
    input: (imageUrl, prompt) => ({
      image: imageUrl,
      prompt: prompt || 'product showcase, cinematic camera motion, professional studio lighting',
      duration: 5, guidance_scale: 7, num_inference_steps: 40,
    }),
  },
  luma_flash: {
    owner: 'luma', name: 'ray-flash-2',
    label: '⚡ Luma Ray Flash', resolution: '1080p', clipDuration: 5, estimatedUsdPerClip: 0.10,
    input: (imageUrl, prompt) => ({
      prompt: prompt || 'product showcase, smooth camera motion, professional marketing video',
      image_url: imageUrl,
      aspect_ratio: '9:16',
    }),
  },
  luma: {
    owner: 'luma', name: 'dream-machine',
    label: '🚀 Luma Dream Machine', resolution: '1080p', clipDuration: 5, estimatedUsdPerClip: 0.19,
    input: (imageUrl, prompt) => ({
      prompt: prompt || 'cinematic product showcase, smooth camera motion, studio lighting, commercial quality',
      image_url: imageUrl,
      aspect_ratio: '9:16',
    }),
  },
  kling: {
    owner: 'klingai', name: 'kling-v2.5-i2v',
    label: '🎬 Kling v2.5', resolution: '1080p', clipDuration: 5, estimatedUsdPerClip: 0.35,
    input: (imageUrl, prompt) => ({
      image: imageUrl,
      prompt: prompt || 'cinematic product commercial, smooth motion, high quality, professional lighting',
      duration: 5, aspect_ratio: '9:16',
    }),
  },
  minimax: {
    owner: 'minimax', name: 'hailuo-video-02-i2v',
    label: '✨ Minimax Hailuo', resolution: '720p', clipDuration: 6, estimatedUsdPerClip: 0.28,
    input: (imageUrl, prompt, duration) => ({
      prompt: prompt || 'product showcase, cinematic motion, ultra high quality commercial video',
      image_url: imageUrl,
      duration: duration <= 6 ? 6 : 10,
    }),
  },
  veo2_flash: {
    owner: 'google', name: 'veo-2-flash',
    label: '🌐 Veo 2 Flash', resolution: '720p', clipDuration: 5, estimatedUsdPerClip: 0.25,
    input: (imageUrl, prompt) => ({
      prompt: prompt || 'product showcase, smooth camera motion, professional commercial',
      image: imageUrl,
      aspect_ratio: '9:16',
      duration: 5,
    }),
  },
  veo2: {
    owner: 'google', name: 'veo-2',
    label: '🌟 Google Veo 2', resolution: '1080p', clipDuration: 5, estimatedUsdPerClip: 0.50,
    input: (imageUrl, prompt) => ({
      prompt: prompt || 'cinematic product commercial, ultra high quality, professional cinematography, smooth motion',
      image: imageUrl,
      aspect_ratio: '9:16',
      duration: 5,
    }),
  },
};

// Legacy aliases
MODELS.default  = MODELS.wan720p;
MODELS.budget   = MODELS.wan480p;
MODELS.premium  = MODELS.minimax;

// Pricing: 1.5× Replicate cost + audio premium (1 cr/s for voice, 2 cr/s for voice+music)
// 1 credit = ₹2 | $1 = ₹85
export const VIDEO_PACKAGES = {
  starter: {
    id: 'starter', name: '💰 Starter', tagline: 'Fast & Budget-Friendly',
    modelKey: 'wan480p', resolution: '480p', voice: false, music: false,
    features: ['Wan 2.1 480p', 'Fast ~3 min', 'No voice/music'],
    estimatedUsdPerClip: 0.22, clipDurationSec: 5, creditsPerSecond: 3, color: '#10B981',
    // $0.22×1.5×₹85/5s = ₹5.61/s ÷ ₹2 = 2.8 → 3 cr/s
  },
  creator: {
    id: 'creator', name: '⚡ Creator', tagline: 'Professional + AI Voice',
    modelKey: 'wan720p', resolution: '720p', voice: true, music: false,
    features: ['Wan 2.1 720p', 'ElevenLabs voice', '~5 min'],
    estimatedUsdPerClip: 0.45, clipDurationSec: 5, creditsPerSecond: 7, color: '#4A6CF7', popular: true,
    // $0.45×1.5×₹85/5s = ₹11.48/s ÷ ₹2 = 5.7 + 1 voice = 7 cr/s
  },
  viral: {
    id: 'viral', name: '🚀 Viral', tagline: 'Luma 1080p + Voice + Music',
    modelKey: 'luma', resolution: '1080p', voice: true, music: true,
    features: ['Luma Dream Machine', 'Voice + Music', '~7 min'],
    estimatedUsdPerClip: 0.19, clipDurationSec: 5, creditsPerSecond: 4, color: '#F59E0B',
    // $0.19×1.5×₹85/5s = ₹4.84/s ÷ ₹2 = 2.4 + 2 audio = 4 cr/s
  },
  ultra: {
    id: 'ultra', name: '🌟 Ultra', tagline: 'Google Veo 2 + Full Audio',
    modelKey: 'veo2', resolution: '1080p', voice: true, music: true,
    features: ['Google Veo 2', 'Voice + Music', '~10 min'],
    estimatedUsdPerClip: 0.50, clipDurationSec: 5, creditsPerSecond: 8, color: '#8B5CF6',
    // $0.50×1.5×₹85/5s = ₹12.75/s ÷ ₹2 = 6.4 + 2 audio = 8 cr/s
  },
};

export const MANUAL_MODELS = {
  wan480p:    { label: '💰 Wan 2.1 480p',       resolution: '480p',  usdPerClip: 0.22, clipSec: 5 },
  wan720p:    { label: '⚡ Wan 2.1 720p',       resolution: '720p',  usdPerClip: 0.45, clipSec: 5 },
  luma_flash: { label: '⚡ Luma Ray Flash',     resolution: '1080p', usdPerClip: 0.10, clipSec: 5 },
  luma:       { label: '🚀 Luma Dream Machine', resolution: '1080p', usdPerClip: 0.19, clipSec: 5 },
  kling:      { label: '🎬 Kling v2.5',         resolution: '1080p', usdPerClip: 0.35, clipSec: 5 },
  minimax:    { label: '✨ Minimax Hailuo',      resolution: '720p',  usdPerClip: 0.28, clipSec: 6 },
  veo2_flash: { label: '🌐 Veo 2 Flash',        resolution: '720p',  usdPerClip: 0.25, clipSec: 5 },
  veo2:       { label: '🌟 Google Veo 2',       resolution: '1080p', usdPerClip: 0.50, clipSec: 5 },
};

export function calcVideoCost(packageId, modelKey, durationSec) {
  const USD_TO_INR = 85;
  const CREDIT_TO_INR = 2;
  const REPLICATE_MARKUP = 1.5;

  let usdPerClip, clipSec, voice, music;

  if (packageId && VIDEO_PACKAGES[packageId]) {
    const pkg = VIDEO_PACKAGES[packageId];
    usdPerClip = pkg.estimatedUsdPerClip;
    clipSec    = pkg.clipDurationSec;
    voice      = pkg.voice;
    music      = pkg.music;
  } else {
    const m = MANUAL_MODELS[modelKey] || MANUAL_MODELS.wan720p;
    usdPerClip = m.usdPerClip;
    clipSec    = m.clipSec;
    voice      = false;
    music      = false;
  }

  const clips        = Math.ceil(durationSec / clipSec);
  const replicateUsd = clips * usdPerClip;
  const replicateInr = replicateUsd * USD_TO_INR;
  const retailInr = replicateInr * REPLICATE_MARKUP;
  const credits      = packageId
    ? VIDEO_PACKAGES[packageId].creditsPerSecond * durationSec
    : Math.ceil(retailInr / CREDIT_TO_INR);

  return { clips, replicateUsd: Math.round(replicateUsd * 100) / 100, replicateInr: Math.round(replicateInr), retailInr: Math.round(retailInr), credits, voice: voice || false, music: music || false };
}

async function runPrediction(model, input, timeoutMs = 360_000) {
  const headers = {
    Authorization: `Bearer ${config.replicate.apiToken}`,
    'Content-Type': 'application/json',
    Prefer: 'wait=60',
  };

  const url = `${REPLICATE_API}/models/${model.owner}/${model.name}/predictions`;

  const createRes = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ input }) });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate [${model.owner}/${model.name}] create failed (${createRes.status}): ${err}`);
  }

  let prediction = await createRes.json();
  logger.info('Replicate prediction created', { id: prediction.id, status: prediction.status, model: `${model.owner}/${model.name}` });

  const deadline = Date.now() + timeoutMs;

  while (['starting', 'processing'].includes(prediction.status)) {
    if (Date.now() > deadline) throw new Error(`Replicate timeout after ${timeoutMs / 1000}s`);
    await new Promise(r => setTimeout(r, 4000));
    const pollRes = await fetch(`${REPLICATE_API}/predictions/${prediction.id}`, { headers });
    prediction = await pollRes.json();
    logger.debug('Replicate poll', { id: prediction.id, status: prediction.status });
  }

  if (prediction.status === 'failed') throw new Error(`Replicate prediction failed: ${prediction.error}`);

  return prediction;
}

export async function generateSceneClip({ imageUrl, prompt, durationSeconds, sceneNumber, reelId, modelKey, packageId, quality, extendFromUrl }) {
  let resolvedKey = modelKey || quality || 'wan720p';
  if (packageId && VIDEO_PACKAGES[packageId]) resolvedKey = VIDEO_PACKAGES[packageId].modelKey;

  const model = MODELS[resolvedKey];
  if (!model) throw new Error(`Unknown model key: ${resolvedKey}. Valid keys: ${Object.keys(MODELS).join(', ')}`);

  logger.info('Generating scene clip', { reelId, sceneNumber, model: `${model.owner}/${model.name}`, resolvedKey });

  const input = model.input(imageUrl, prompt, durationSeconds, extendFromUrl || null);
  const prediction = await runPrediction(model, input);

  const videoUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  if (!videoUrl) throw new Error('Replicate returned no output URL');

  logger.info('Scene clip generated', { sceneNumber, videoUrl: videoUrl.substring(0, 60) + '...' });

  return { sceneNumber, videoUrl, duration: model.clipDuration || 5, model: `${model.owner}/${model.name}`, resolution: model.resolution };
}

export async function generateAllSceneClips({ scenes, imageUrls, reelId, onProgress, modelKey, packageId, quality }) {
  const CONCURRENCY = 2;
  const results = [];

  for (let i = 0; i < scenes.length; i += CONCURRENCY) {
    const batch = scenes.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(scene => generateSceneClip({
        imageUrl: imageUrls?.[scene.sceneNumber % Math.max(imageUrls.length, 1)] || imageUrls?.[0],
        prompt: scene.replicatePrompt || scene.description,
        durationSeconds: scene.duration,
        sceneNumber: scene.sceneNumber,
        reelId, modelKey, packageId, quality,
      }))
    );
    results.push(...batchResults);
    if (onProgress) onProgress(Math.round(((i + batch.length) / scenes.length) * 100));
  }

  return results.sort((a, b) => a.sceneNumber - b.sceneNumber);
}
