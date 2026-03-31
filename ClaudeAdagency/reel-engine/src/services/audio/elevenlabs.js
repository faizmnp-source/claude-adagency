/**
 * ElevenLabs Voice Generation
 * Converts reel script to natural-sounding voiceover MP3
 */
import fetch from 'node-fetch';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { tmpFile } from '../../utils/helpers.js';

const ELEVENLABS_API = 'https://api.elevenlabs.io/v1';

/**
 * Generate voiceover from script text
 * @param {string} script - Full reel voiceover script
 * @param {string} reelId - For temp file naming
 * @param {Object} options
 * @returns {Promise<string>} Local temp file path of the MP3
 */
export async function generateVoiceover(script, reelId, options = {}) {
  const {
    voiceId = config.elevenlabs.voiceId,
    stability = 0.5,          // 0-1: Lower = more expressive variation
    similarityBoost = 0.8,    // 0-1: Higher = closer to original voice
    style = 0.4,              // 0-1: Style exaggeration
    speakerBoost = true,      // Enhance speaker clarity
  } = options;

  logger.info('Generating ElevenLabs voiceover', { reelId, scriptLength: script.length });

  const response = await fetch(
    `${ELEVENLABS_API}/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': config.elevenlabs.apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: script,
        model_id: config.elevenlabs.model,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: speakerBoost,
        },
        // Optimize for social media energy
        output_format: 'mp3_44100_128',
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${err}`);
  }

  const outputPath = tmpFile(`voice-${reelId}.mp3`);
  const fileStream = createWriteStream(outputPath);

  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });

  logger.info('Voiceover generated', { outputPath });
  return outputPath;
}

/**
 * List available ElevenLabs voices
 */
export async function listVoices() {
  const res = await fetch(`${ELEVENLABS_API}/voices`, {
    headers: { 'xi-api-key': config.elevenlabs.apiKey },
  });
  const data = await res.json();
  return data.voices.map((v) => ({
    id: v.voice_id,
    name: v.name,
    category: v.category,
    description: v.description,
  }));
}

/**
 * Check remaining character quota
 */
export async function getUsageQuota() {
  const res = await fetch(`${ELEVENLABS_API}/user/subscription`, {
    headers: { 'xi-api-key': config.elevenlabs.apiKey },
  });
  const data = await res.json();
  return {
    charactersUsed: data.character_count,
    charactersLimit: data.character_limit,
    remaining: data.character_limit - data.character_count,
  };
}
