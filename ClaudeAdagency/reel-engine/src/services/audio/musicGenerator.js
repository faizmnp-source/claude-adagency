/**
 * AI Music Generation — Meta MusicGen via Replicate
 *
 * Model: meta/musicgen on Replicate
 * Generates background music from a text prompt.
 *
 * NOTE: Suno AI does NOT have a public API as of 2025.
 * MusicGen produces excellent background music at no extra infra cost
 * (same Replicate billing as video models, ~$0.002–0.006 per second of audio).
 */
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { downloadFile, tmpFile } from '../../utils/helpers.js';

const REPLICATE_API = 'https://api.replicate.com/v1';

/**
 * Build a music prompt from reel content
 */
export function buildMusicPrompt(reelContent, options = {}) {
  const { tone = 'energetic', industry = 'ecommerce', region = 'india' } = options;

  const toneMap = {
    energetic:     'upbeat energetic electronic music, punchy beat, fast tempo, commercial product feel',
    professional:  'clean corporate background music, subtle beat, professional atmosphere, motivational',
    emotional:     'emotional cinematic music, strings and piano, heartfelt, warm atmosphere',
    comedic:       'fun quirky background music, light-hearted, playful beat',
    luxury:        'sophisticated ambient music, elegant, subtle bass, premium feel',
    bold:          'powerful bold music, strong bass, impactful beat, action energy',
  };

  const base = toneMap[tone] || toneMap.energetic;
  const qualifiers = 'no vocals, loop-friendly, background music, social media reel';

  return `${base}, ${qualifiers}`;
}

/**
 * Generate background music using Meta MusicGen on Replicate
 *
 * @param {Object} options
 * @param {string} options.prompt    - Text description of the music
 * @param {number} options.duration  - Duration in seconds (max 30 recommended)
 * @param {string} options.reelId   - For temp file naming
 * @returns {Promise<string>} Local temp file path of the MP3
 */
export async function generateBackgroundMusic({ prompt, duration = 30, reelId }) {
  const apiToken = config.replicate.apiToken;
  if (!apiToken) throw new Error('REPLICATE_API_TOKEN not configured');

  // Clamp duration — MusicGen is billed per second, 30s is enough for a reel
  const audioDuration = Math.min(Math.max(duration, 10), 30);

  logger.info('Generating background music via MusicGen', { reelId, duration: audioDuration, prompt: prompt.substring(0, 80) });

  const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
    Prefer: 'wait=60',
  };

  const createRes = await fetch(`${REPLICATE_API}/models/meta/musicgen/predictions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      input: {
        prompt,
        duration: audioDuration,
        model_version: 'stereo-large',  // Best quality stereo model
        output_format: 'mp3',
        temperature: 1,
        top_k: 250,
        top_p: 0,
        classifier_free_guidance: 3,
        continuation: false,
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`MusicGen create failed (${createRes.status}): ${err}`);
  }

  let prediction = await createRes.json();
  logger.info('MusicGen prediction created', { id: prediction.id, status: prediction.status });

  const deadline = Date.now() + 180_000; // 3 min timeout

  while (['starting', 'processing'].includes(prediction.status)) {
    if (Date.now() > deadline) throw new Error('MusicGen timeout after 3 minutes');
    await new Promise(r => setTimeout(r, 3000));
    const pollRes = await fetch(`${REPLICATE_API}/predictions/${prediction.id}`, { headers });
    prediction = await pollRes.json();
    logger.debug('MusicGen poll', { id: prediction.id, status: prediction.status });
  }

  if (prediction.status === 'failed') {
    throw new Error(`MusicGen failed: ${prediction.error}`);
  }

  // Output is a direct audio URL
  const audioUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  if (!audioUrl) throw new Error('MusicGen returned no audio URL');

  logger.info('MusicGen audio generated', { audioUrl: audioUrl.substring(0, 60) + '...' });

  // Download to temp file
  const outputPath = tmpFile(`music-${reelId}.mp3`);
  await downloadFile(audioUrl, outputPath);

  logger.info('Background music downloaded', { outputPath });
  return outputPath;
}
