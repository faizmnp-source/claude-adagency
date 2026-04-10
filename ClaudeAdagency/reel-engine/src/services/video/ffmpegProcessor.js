/**
 * FFmpeg Processor — merge clips, add voice, music, subtitles
 * Outputs production-ready 9:16 Instagram Reel MP4
 */
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { tmpFile } from '../../utils/helpers.js';

// Configure FFmpeg paths if set in env
if (config.ffmpeg.path) ffmpeg.setFfmpegPath(config.ffmpeg.path);
if (config.ffmpeg.probePath) ffmpeg.setFfprobePath(config.ffmpeg.probePath);

// Output at 720p (720×1280) — matches Wan 2.1 source resolution.
// Upscaling to 1080p doesn't add quality and kills Railway CPU.
// Upgrade to Railway Pro ($20/mo) if 1080p output is needed.
const REEL_WIDTH = 720;
const REEL_HEIGHT = 1280;

/**
 * Run an ffmpeg command as a promise
 */
function runFFmpeg(command) {
  return new Promise((resolve, reject) => {
    command
      .on('start', (cmd) => logger.debug('FFmpeg start', { cmd }))
      .on('progress', (p) => logger.debug('FFmpeg progress', { percent: p.percent }))
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

/**
 * Step 1: Merge scene video clips into a single timeline
 */
export async function mergeSceneClips(sceneClips, reelId = 'shared') {
  const outputPath = tmpFile(`${reelId}-merged-raw.mp4`);

  // Use concat demuxer — streams clips sequentially, minimal RAM usage
  // xfade was killed by Railway 512MB limit; concat is production-safe
  const concatListPath = tmpFile(`${reelId}-concat-list.txt`);
  const listContent = sceneClips.map((c) => `file '${c.localPath}'`).join('\n');
  await fs.writeFile(concatListPath, listContent, 'utf8');

  await runFFmpeg(
    ffmpeg()
      .input(concatListPath)
      .inputOptions(['-f concat', '-safe 0'])
      .videoFilter([
        `scale=${REEL_WIDTH}:${REEL_HEIGHT}:force_original_aspect_ratio=decrease`,
        `pad=${REEL_WIDTH}:${REEL_HEIGHT}:(ow-iw)/2:(oh-ih)/2:black`,
      ])
      .videoCodec('libx264')
      .outputOptions(['-crf 20', '-preset fast', '-pix_fmt yuv420p', '-movflags +faststart', '-an'])
      .output(outputPath)
  );

  await fs.unlink(concatListPath).catch(() => {});
  logger.info('Clips merged via concat', { outputPath, clips: sceneClips.length });
  return outputPath;
}

/**
 * Step 2: Add voiceover track (synced to scenes)
 */
export async function addVoiceover(videoPath, voicePath, reelId = 'shared') {
  const outputPath = tmpFile(`${reelId}-with-voice.mp4`);

  await runFFmpeg(
    ffmpeg()
      .input(videoPath)
      .input(voicePath)
      .audioCodec('aac')
      .audioChannels(2)
      .audioFrequency(44100)
      .outputOptions([
        '-map 0:v',          // Video from first input
        '-map 1:a',          // Audio from second input (voiceover)
        '-shortest',         // Cut to shorter of the two
        '-c:v copy',
        '-movflags +faststart',
      ])
      .output(outputPath)
  );

  logger.info('Voiceover added', { outputPath });
  return outputPath;
}

/**
 * Step 3: Mix background music (at lower volume) with existing audio
 */
export async function addBackgroundMusic(videoPath, musicPath, musicVolume = 0.15, reelId = 'shared') {
  const outputPath = tmpFile(`${reelId}-with-music.mp4`);
  const hasAudio = videoPath.includes('with-voice');

  if (!hasAudio) {
    // No voiceover — music is the primary audio at fuller volume
    await runFFmpeg(
      ffmpeg()
        .input(videoPath)
        .input(musicPath)
        .complexFilter([
          `[1:a]volume=${musicVolume * 3},aloop=loop=-1:size=2e+09[music]`,
          `[music]atrim=0:${9999}[musiclooped]`,
        ])
        .outputOptions([
          '-map 0:v',
          '-map [musiclooped]',
          '-c:v copy',
          '-c:a aac',
          '-shortest',
          '-movflags +faststart',
        ])
        .output(outputPath)
    );
  } else {
    // Has voiceover — duck the music under voice
    await runFFmpeg(
      ffmpeg()
        .input(videoPath)
        .input(musicPath)
        .complexFilter([
          // Loop music to video length, apply volume
          `[1:a]aloop=loop=-1:size=2e+09,volume=${musicVolume}[music]`,
          // Mix voice + music
          `[0:a][music]amix=inputs=2:duration=first:dropout_transition=3[mixed]`,
        ])
        .outputOptions([
          '-map 0:v',
          '-map [mixed]',
          '-c:v copy',
          '-c:a aac',
          '-movflags +faststart',
        ])
        .output(outputPath)
    );
  }

  logger.info('Background music mixed', { outputPath, musicVolume });
  return outputPath;
}

/**
 * Step 4: Burn subtitles / text overlays from scene data
 */
export async function addSubtitles(videoPath, scenes, reelId) {
  const outputPath = tmpFile(`${reelId}-with-subs.mp4`);
  const srtPath = tmpFile(`${reelId}.srt`);

  // Generate SRT file from scene dialogue
  let srtContent = '';
  let idx = 1;
  for (const scene of scenes) {
    if (!scene.dialogue) continue;
    const start = formatSrtTime(scene.startTime);
    const end = formatSrtTime(scene.startTime + scene.duration);
    srtContent += `${idx}\n${start} --> ${end}\n${scene.dialogue}\n\n`;
    idx++;
  }
  await fs.writeFile(srtPath, srtContent, 'utf8');

  await runFFmpeg(
    ffmpeg()
      .input(videoPath)
      .videoFilter(
        // Styled subtitles: white bold text, bottom-center
        `subtitles=${srtPath}:force_style='Fontname=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Bold=1,Alignment=2,MarginV=80'`
      )
      .outputOptions(['-c:a copy', '-movflags +faststart'])
      .output(outputPath)
  );

  await fs.unlink(srtPath).catch(() => {});
  logger.info('Subtitles added', { outputPath });
  return outputPath;
}

/**
 * Step 5: Final export — add watermark/intro, optimize for Instagram
 * Instagram Reel specs: 1080x1920, H.264, AAC, max 90s, max 250MB
 */
export async function finalExport(videoPath, reelId, options = {}) {
  const outputPath = tmpFile(`${reelId}-final.mp4`);
  const { watermarkText = 'thecraftstudios.in', trimTo = null } = options;

  const cmd = ffmpeg().input(videoPath);

  // Trim to exact duration if specified (e.g. 15s, 30s, 50s)
  if (trimTo) cmd.duration(trimTo);

  await runFFmpeg(
    cmd
      .videoFilter([
        `scale=${REEL_WIDTH}:${REEL_HEIGHT}:force_original_aspect_ratio=decrease`,
        `pad=${REEL_WIDTH}:${REEL_HEIGHT}:(ow-iw)/2:(oh-ih)/2:black`,
        `drawtext=text='${watermarkText}':fontsize=24:fontcolor=white@0.4:x=w-tw-20:y=h-th-20`,
      ])
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-crf 18',           // Near-lossless quality
        '-preset medium',    // Good quality/speed balance at 720p
        '-pix_fmt yuv420p',
        '-movflags +faststart',
        '-max_muxing_queue_size 1024',
        '-b:a 192k',
      ])
      .output(outputPath)
  );

  logger.info('Final export complete', { outputPath, reelId });
  return outputPath;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatSrtTime(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
  return `${h}:${m}:${s},${ms}`;
}

/**
 * Get video duration in seconds
 */
export function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, meta) => {
      if (err) reject(err);
      else resolve(meta.format.duration);
    });
  });
}
