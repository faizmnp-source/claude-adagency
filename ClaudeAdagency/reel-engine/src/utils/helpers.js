import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch';

const TMP_DIR = path.join(os.tmpdir(), 'craftstudios-reels');

// Ensure temp dir exists on import
await fs.mkdir(TMP_DIR, { recursive: true }).catch(() => {});

export const tmpFile = (name) => path.join(TMP_DIR, name);

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Download a remote file to a local path
 */
export async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const stream = createWriteStream(destPath);
  await new Promise((resolve, reject) => {
    res.body.pipe(stream);
    res.body.on('error', reject);
    stream.on('finish', resolve);
  });
  return destPath;
}

/**
 * Clean up temp files for a reel after processing
 */
export async function cleanupTempFiles(reelId) {
  try {
    const files = await fs.readdir(TMP_DIR);
    await Promise.all(
      files
        .filter((f) => f.includes(reelId))
        .map((f) => fs.unlink(path.join(TMP_DIR, f)).catch(() => {}))
    );
  } catch (e) {
    // Non-fatal
  }
}

/**
 * Format credit cost for display
 */
export function formatCredits(seconds, creditsPerSecond = 2) {
  return seconds * creditsPerSecond;
}

/**
 * Validate Instagram-compatible video specs
 */
export function validateReelSpecs(durationSecs) {
  if (durationSecs < 3) throw new Error('Reel must be at least 3 seconds');
  if (durationSecs > 90) throw new Error('Instagram Reels max 90 seconds');
  return true;
}
