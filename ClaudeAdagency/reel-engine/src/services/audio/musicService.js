/**
 * Background Music Service
 * Primary: Suno API (AI-generated music)
 * Fallback: Pixabay royalty-free music API
 */
import fetch from 'node-fetch';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { tmpFile, downloadFile } from '../../utils/helpers.js';

// Mood-to-genre mapping for auto music selection
const MOOD_MAP = {
  energetic:    { suno: 'upbeat electronic pop, energetic, 128 BPM', pixabay: 'upbeat' },
  professional: { suno: 'corporate ambient, clean, modern', pixabay: 'corporate' },
  emotional:    { suno: 'emotional cinematic, piano, strings', pixabay: 'emotional' },
  comedic:      { suno: 'fun quirky pop, playful', pixabay: 'happy' },
  luxury:       { suno: 'elegant jazz, sophisticated', pixabay: 'jazz' },
  cinematic:    { suno: 'epic cinematic trailer, orchestral', pixabay: 'cinematic' },
};

/**
 * Get background music for the reel
 * @param {string} mood - Music mood (energetic, professional, etc.)
 * @param {number} durationSeconds - Target duration
 * @param {string} reelId
 * @returns {Promise<string>} Local temp file path
 */
export async function getBackgroundMusic(mood = 'energetic', durationSeconds = 30, reelId) {
  logger.info('Fetching background music', { mood, durationSeconds, reelId });

  // Try Suno first if API key available
  if (config.suno.apiKey) {
    try {
      return await generateSunoMusic(mood, durationSeconds, reelId);
    } catch (err) {
      logger.warn('Suno failed, falling back to Pixabay', { error: err.message });
    }
  }

  // Fallback: Pixabay royalty-free music
  return await getPixabayMusic(mood, durationSeconds, reelId);
}

/**
 * Generate music via Suno API
 */
async function generateSunoMusic(mood, durationSeconds, reelId) {
  const genres = MOOD_MAP[mood]?.suno || MOOD_MAP.energetic.suno;

  // Suno Chirp API (unofficial but widely used)
  const response = await fetch('https://studio-api.suno.ai/api/generate/v2/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.suno.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gpt_description_prompt: `${genres}, no lyrics, background music for social media reel, ${durationSeconds} seconds`,
      mv: 'chirp-v3-5',
      prompt: '',
      make_instrumental: true,
    }),
  });

  if (!response.ok) throw new Error(`Suno API error: ${response.status}`);

  const data = await response.json();
  const clips = data.clips;

  // Poll for completion
  let audioUrl = null;
  const deadline = Date.now() + 120_000;
  while (!audioUrl && Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 5000));
    const checkRes = await fetch(
      `https://studio-api.suno.ai/api/feed/?ids=${clips.map(c => c.id).join(',')}`,
      { headers: { Authorization: `Bearer ${config.suno.apiKey}` } }
    );
    const checkData = await checkRes.json();
    const done = checkData.find(c => c.status === 'complete' && c.audio_url);
    if (done) audioUrl = done.audio_url;
  }

  if (!audioUrl) throw new Error('Suno generation timeout');

  const outputPath = tmpFile(`music-${reelId}.mp3`);
  await downloadFile(audioUrl, outputPath);
  return outputPath;
}

/**
 * Get royalty-free music from Pixabay (fallback)
 * Pixabay offers free API for music search
 */
async function getPixabayMusic(mood, durationSeconds, reelId) {
  const genre = MOOD_MAP[mood]?.pixabay || 'upbeat';

  // Pixabay music search — filter by approximate duration
  const url = `https://pixabay.com/api/music/?key=${process.env.PIXABAY_API_KEY || 'demo'}&q=${encodeURIComponent(genre)}&per_page=10`;

  const res = await fetch(url);
  if (!res.ok) {
    // Last resort: use a static bundled royalty-free track
    return await getStaticFallbackMusic(mood, reelId);
  }

  const data = await res.json();
  if (!data.hits?.length) return getStaticFallbackMusic(mood, reelId);

  // Pick track closest to reel duration
  const track = data.hits.reduce((best, current) => {
    const bestDiff = Math.abs((best.duration || 30) - durationSeconds);
    const currDiff = Math.abs((current.duration || 30) - durationSeconds);
    return currDiff < bestDiff ? current : best;
  });

  const audioUrl = track.audio;
  const outputPath = tmpFile(`music-${reelId}.mp3`);
  await downloadFile(audioUrl, outputPath);
  logger.info('Pixabay music downloaded', { track: track.title, duration: track.duration });
  return outputPath;
}

/**
 * Static fallback: use a pre-bundled royalty-free track
 */
async function getStaticFallbackMusic(mood, reelId) {
  // Copy from static assets folder
  const assetsDir = new URL('../../../assets/music', import.meta.url).pathname;
  const moodFile = {
    energetic: 'energetic.mp3',
    professional: 'corporate.mp3',
    emotional: 'emotional.mp3',
    comedic: 'happy.mp3',
  };

  const srcFile = `${assetsDir}/${moodFile[mood] || 'energetic.mp3'}`;
  const outputPath = tmpFile(`music-${reelId}.mp3`);

  try {
    await fs.copyFile(srcFile, outputPath);
    logger.info('Using static fallback music', { mood });
    return outputPath;
  } catch {
    throw new Error(`No music available for mood: ${mood}. Add royalty-free MP3s to assets/music/`);
  }
}
