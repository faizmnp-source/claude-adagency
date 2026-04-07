/**
 * Replicate API — AI video clip generation per scene
 *
 * Models:
 *   starter:  wavespeedai/wan-2.1-i2v-480p  ~$0.22/5s clip  480p
 *   creator:  wavespeedai/wan-2.1-i2v-720p  ~$0.45/5s clip  720p
 *   viral:    luma/dream-machine             ~$0.19/5s clip  1080p
 *   kling:    klingai/kling-v2.5-pro         ~$0.35/5s clip  1080p (manual)
 *   minimax:  minimax/hailuo-video-02-i2v    ~$0.28/6s clip  720p  (manual)
 *
 * VIDEO PACKAGES (auto mode):
 *   starter → wan480p, no voice, no music
 *   creator → wan720p + ElevenLabs voice
 *   viral   → luma + voice + music
 */
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const REPLICATE_API = 'https://api.replicate.com/v1';

/** Replicate model definitions */
const MODELS = {
  // ── Budget: Wan 2.1 480p — ~$0.22 per 5s clip ─────────────────────────
  wan480p: {
    owner: 'wavespeedai',
    name: 'wan-2.1-i2v-480p',
    resolution: '480p',
    clipDuration: 5,
    estimatedUsdPerClip: 0.22,
    input: (imageUrl, prompt) => ({
      image: imageUrl,
      prompt: prompt || 'product showcase, smooth motion, professional',
      duration: 5,
      guidance_scale: 7,
      num_inference_steps: 30,
    }),
  },
  // ── Standard: Wan 2.1 720p — ~$0.45 per 5s clip ──────────────────────
  wan720p: {
    owner: 'wavespeedai',
    name: 'wan-2.1-i2v-720p',
    resolution: '720p',
    clipDuration: 5,
    estimatedUsdPerClip: 0.45,
    input: (imageUrl, prompt) => ({
      image: imageUrl,
      prompt: prompt || 'product showcase, smooth cinematic camera motion, professional studio lighting',
      duration: 5,
      guidance_scale: 7,
      num_inference_steps: 40,
    }),
  },
  // ── Premium: Luma Dream Machine — ~$0.19 per 5s clip 1080p ───────────
  luma: {
    owner: 'luma',
    name: 'dream-machine',
    resolution: '1080p',
    clipDuration: 5,
    estimatedUsdPerClip: 0.19,
    input: (imageUrl, prompt, _duration, extendFromUrl = null) => ({
      prompt: prompt || 'cinematic product showcase, smooth camera motion, studio lighting, high quality commercial video',
      image_url: imageUrl,
      ...(extendFromUrl ? { end_image_url: extendFromUrl } : {}),
      aspect_ratio: '9:16',
      loop: false,
    }),
  },
  // ── Professional: Kling v2.5 Pro — ~$0.35 per 5s clip 1080p ─────────
  kling: {
    owner: 'klingai',
    name: 'kling-v2.5-pro',
    resolution: '1080p',
    clipDuration: 5,
    estimatedUsdPerClip: 0.35,
    input: (imageUrl, prompt) => ({
      image: imageUrl,
      prompt: prompt || 'cinematic product commercial, smooth motion, high quality, professional lighting',
      duration: 5,
      aspect_ratio: '9:16',
      cfg_scale: 0.5,
      mode: 'pro',
    }),
  },
  // ── Legacy Minimax — $0.28 per 6s clip ───────────────────────────────
  minimax: {
    owner: 'minimax',
    name: 'hailuo-video-02-i2v',
    resolution: '720p',
    clipDuration: 6,
    estimatedUsdPerClip: 0.28,
    input: (imageUrl, prompt, duration) => ({
      prompt: prompt || 'product showcase, smooth cinematic camera motion, professional lighting, ultra high quality commercial video',
      image_url: imageUrl,
      duration: duration <= 6 ? 6 : 10,
    }),
  },
};

// Aliases for backward compatibility
MODELS.default  = MODELS.wan720p;
MODELS.budget   = MODELS.wan480p;
MODELS.premium  = MODELS.minimax;

/**
 * VIDEO PACKAGES — auto mode bundles
 * Each package defines which model + audio options + pricing.
 *
 * Replicate cost: estimatedUsdPerClip × clipsNeeded
 * INR at ~₹85/$
 * Credits: floor(replicateInr) rounded up to nearest 10 — user can change markup later
 */
export const VIDEO_PACKAGES = {
  starter: {
    id: 'starter',
    name: '💰 Starter',
    tagline: 'Fast & Budget-Friendly',
    description: 'Quick generation for testing and social drafts',
    modelKey: 'wan480p',
    resolution: '480p',
    voice: false,
    music: false,
    features: ['Wan 2.1 480p video', 'Fast generation (~3 min)', 'Basic motion quality'],
    estimatedUsdPerClip: 0.22,
    clipDurationSec: 5,
    creditsPerSecond: 4,   // ~₹8/sec at ₹2/credit, Replicate costs ~₹3.7/sec (close to cost)
    color: '#10B981',
  },
  creator: {
    id: 'creator',
    name: '⚡ Creator',
    tagline: 'Professional Quality',
    description: 'Studio-quality video with AI voiceover for creators',
    modelKey: 'wan720p',
    resolution: '720p',
    voice: true,
    music: false,
    features: ['Wan 2.1 720p video', 'ElevenLabs AI voice', 'Cinematic motion prompts', '~5 min generation'],
    estimatedUsdPerClip: 0.45,
    clipDurationSec: 5,
    creditsPerSecond: 8,   // ~₹16/sec, Replicate costs ~₹7.65/sec + voice overhead
    color: '#4A6CF7',
  },
  viral: {
    id: 'viral',
    name: '🚀 Viral',
    tagline: 'Maximum Impact',
    description: 'Luma Dream Machine 1080p with AI voice + background music',
    modelKey: 'luma',
    resolution: '1080p',
    voice: true,
    music: true,
    features: ['Luma Dream Machine 1080p', 'ElevenLabs AI voice', 'Background music', 'Premium motion quality', '~7 min generation'],
    estimatedUsdPerClip: 0.19,
    clipDurationSec: 5,
    creditsPerSecond: 10,  // premium price, better quality
    color: '#F59E0B',
  },
};

/** Manual mode model options (for advanced users) */
export const MANUAL_MODELS = {
  wan480p: { label: '💰 Wan 2.1 480p',          resolution: '480p',  usdPerClip: 0.22, clipSec: 5 },
  wan720p: { label: '⚡ Wan 2.1 720p',          resolution: '720p',  usdPerClip: 0.45, clipSec: 5 },
  luma:    { label: '🚀 Luma Dream Machine',    resolution: '1080p', usdPerClip: 0.19, clipSec: 5 },
  kling:   { label: '🎬 Kling v2.5 Pro',        resolution: '1080p', usdPerClip: 0.35, clipSec: 5 },
  minimax: { label: '✨ Minimax Hailuo 720p',   resolution: '720p',  usdPerClip: 0.28, clipSec: 6 },
};

/**
 * Calculate credit cost for a reel
 * @param {string} packageId  - 'starter'|'creator'|'viral'|null
 * @param {string} modelKey   - manual model key if no package
 * @param {number} durationSec - total reel duration in seconds
 */
export function calcVideoCost(packageId, modelKey, durationSec) {
  const USD_TO_INR = 85;
  const CREDIT_TO_INR = 2; // 1 credit = ₹2

  let usdPerClip, clipSec, voice, music;

  if (packageId && VIDEO_PACKAGES[packageId]) {
    const pkg = VIDEO_PACKAGES[packageId];
    usdPerClip = pkg.estimatedUsdPerClip;
    clipSec = pkg.clipDurationSec;
    voice = pkg.voice;
    music = pkg.music;
  } else {
    const m = MANUAL_MODELS[modelKey] || MANUAL_MODELS.wan720p;
    usdPerClip = m.usdPerClip;
    clipSec = m.clipSec;
    voice = false;
    music = false;
  }

  const clips = Math.ceil(durationSec / clipSec);
  const replicateUsd = clips * usdPerClip;
  const replicateInr = replicateUsd * USD_TO_INR;
  const credits = packageId ? VIDEO_PACKAGES[packageId].creditsPerSecond * durationSec : Math.ceil(replicateInr / CREDIT_TO_INR);

  return {
    clips,
    replicateUsd: Math.round(replicateUsd * 100) / 100,
    replicateInr: Math.round(replicateInr),
    credits,
    voice: voice || false,
    music: music || false,
  };
}

/**
 * Run a Replicate prediction and poll until complete
 */
async function runPrediction(model, input, timeoutMs = 360_000) {
  const headers = {
    Authorization: `Bearer ${config.replicate.apiToken}`,
    'Content-Type': 'application/json',
    Prefer: 'wait=60',
  };

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
  logger.info('Replicate prediction created', { id: prediction.id, status: prediction.status, model: `${model.owner}/${model.name}` });

  const deadline = Date.now() + timeoutMs;

  while (['starting', 'processing'].includes(prediction.status)) {
    if (Date.now() > deadline) throw new Error(`Replicate timeout after ${timeoutMs / 1000}s`);
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
 * Generate a single video clip for a scene
 *
 * @param {Object}  params
 * @param {string}  params.imageUrl       - Product image URL (must be publicly accessible)
 * @param {string}  params.prompt         - Scene description
 * @param {number}  params.durationSeconds
 * @param {number}  params.sceneNumber
 * @param {string}  params.reelId
 * @param {string}  [params.modelKey]     - Model key from MODELS
 * @param {string}  [params.packageId]    - Package id (maps to model)
 * @param {string}  [params.extendFromUrl] - Previous clip URL for video extension (Luma/Kling)
 */
export async function generateSceneClip({
  imageUrl,
  prompt,
  durationSeconds,
  sceneNumber,
  reelId,
  modelKey,
  packageId,
  quality,          // legacy alias for modelKey
  extendFromUrl,
}) {
  // Resolve model key from package, explicit key, or legacy quality param
  let resolvedKey = modelKey || quality || 'wan720p';
  if (packageId && VIDEO_PACKAGES[packageId]) {
    resolvedKey = VIDEO_PACKAGES[packageId].modelKey;
  }

  const model = MODELS[resolvedKey] || MODELS.wan720p;

  logger.info('Generating scene clip', { reelId, sceneNumber, model: `${model.owner}/${model.name}`, resolvedKey });

  const input = model.input(imageUrl, prompt, durationSeconds, extendFromUrl || null);
  const prediction = await runPrediction(model, input);

  const videoUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  if (!videoUrl) throw new Error('Replicate returned no output URL');

  logger.info('Scene clip generated', { sceneNumber, videoUrl: videoUrl.substring(0, 60) + '...' });

  return {
    sceneNumber,
    videoUrl,
    duration: model.clipDuration || 5,
    model: `${model.owner}/${model.name}`,
    resolution: model.resolution,
  };
}

/**
 * Generate all scene clips sequentially (max concurrency 2)
 */
export async function generateAllSceneClips({ scenes, imageUrls, reelId, onProgress, modelKey, packageId, quality }) {
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
          modelKey,
          packageId,
          quality,
        })
      )
    );

    results.push(...batchResults);
    if (onProgress) onProgress(Math.round(((i + batch.length) / scenes.length) * 100));
  }

  return results.sort((a, b) => a.sceneNumber - b.sceneNumber);
}
