/**
 * ElevenLabs Voice Generation — via Replicate
 *
 * Uses the ElevenLabs eleven-multilingual-v2 model hosted on Replicate.
 * Single billing account (Replicate), no separate ElevenLabs API key needed.
 *
 * Model: elevenlabs/eleven-multilingual-v2
 * Replicate page: https://replicate.com/elevenlabs/eleven-multilingual-v2
 * Cost: ~$0.003 per 1000 characters (~₹0.25/1k chars)
 */
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { downloadFile, tmpFile } from '../../utils/helpers.js';

const REPLICATE_API = 'https://api.replicate.com/v1';

// Default ElevenLabs voice IDs available on Replicate
// These are the standard pre-built voices
export const VOICES = {
  rachel:  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel',  desc: 'Calm, professional female (English)' },
  charlie: { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', desc: 'Natural male (English)' },
  bella:   { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella',   desc: 'Warm female (English)' },
  adam:    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam',    desc: 'Deep male (English)' },
  domi:    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi',    desc: 'Strong female (English)' },
  elli:    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli',    desc: 'Emotional female (English)' },
  josh:    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh',    desc: 'Young male (English)' },
  arnold:  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold',  desc: 'Crisp male (English)' },
};

/**
 * Run a Replicate prediction and wait for completion
 */
async function runReplicatePrediction(owner, name, input, timeoutMs = 180_000) {
  const apiToken = config.replicate.apiToken;
  if (!apiToken) throw new Error('REPLICATE_API_TOKEN not configured');

  const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
    Prefer: 'wait=60',
  };

  const url = `${REPLICATE_API}/models/${owner}/${name}/predictions`;

  const createRes = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate ElevenLabs create failed (${createRes.status}): ${err}`);
  }

  let prediction = await createRes.json();
  logger.info('ElevenLabs/Replicate prediction created', { id: prediction.id, status: prediction.status });

  const deadline = Date.now() + timeoutMs;

  while (['starting', 'processing'].includes(prediction.status)) {
    if (Date.now() > deadline) throw new Error('ElevenLabs/Replicate timeout');
    await new Promise(r => setTimeout(r, 3000));
    const pollRes = await fetch(`${REPLICATE_API}/predictions/${prediction.id}`, { headers });
    prediction = await pollRes.json();
    logger.debug('ElevenLabs poll', { id: prediction.id, status: prediction.status });
  }

  if (prediction.status === 'failed') {
    throw new Error(`ElevenLabs/Replicate prediction failed: ${prediction.error}`);
  }

  return prediction;
}

/**
 * Generate voiceover from script text using ElevenLabs on Replicate
 *
 * @param {string} script   - Full reel voiceover script
 * @param {string} reelId   - For temp file naming
 * @param {Object} options
 * @returns {Promise<string>} Local temp file path of the MP3
 */
export async function generateVoiceover(script, reelId, options = {}) {
  const {
    voiceId = VOICES.rachel.id,
    stability = 0.5,
    similarityBoost = 0.8,
    style = 0.4,
  } = options;

  logger.info('Generating ElevenLabs voiceover via Replicate', {
    reelId,
    scriptLength: script.length,
    voiceId,
  });

  // ElevenLabs eleven-multilingual-v2 on Replicate
  const prediction = await runReplicatePrediction(
    'elevenlabs',
    'eleven-multilingual-v2',
    {
      text: script,
      voice_id: voiceId,
      stability,
      similarity_boost: similarityBoost,
      style,
      use_speaker_boost: true,
      output_format: 'mp3_44100_128',
    }
  );

  // Output is an audio URL
  const audioUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
  if (!audioUrl) throw new Error('ElevenLabs/Replicate returned no audio URL');

  logger.info('ElevenLabs audio generated', { audioUrl: audioUrl.substring(0, 60) + '...' });

  const outputPath = tmpFile(`voice-${reelId}.mp3`);
  await downloadFile(audioUrl, outputPath);

  logger.info('Voiceover downloaded', { outputPath });
  return outputPath;
}

/**
 * List available voices
 */
export function listVoices() {
  return Object.values(VOICES);
}

/**
 * Usage quota is N/A when using Replicate — billing is handled by Replicate
 */
export function getUsageQuota() {
  return {
    provider: 'Replicate',
    note: 'ElevenLabs is billed via Replicate. Check https://replicate.com/account/billing',
    charactersUsed: null,
    charactersLimit: null,
    remaining: null,
  };
}
