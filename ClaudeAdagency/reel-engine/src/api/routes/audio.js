/**
 * Audio Routes
 * POST /api/audio/voiceover   — Generate ElevenLabs voiceover for a reel script
 * GET  /api/audio/voices      — List available ElevenLabs voices
 * GET  /api/audio/quota       — Check remaining character quota
 */
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { redis } from '../../queue/index.js';
import { logger } from '../../utils/logger.js';
import fs from 'fs/promises';
import { createReadStream } from 'fs';

const router = Router();

// ── POST /api/audio/voiceover ─────────────────────────────────────────────
// Generates a voiceover MP3 from the reel script and streams it back
router.post('/voiceover', authMiddleware, async (req, res) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(503).json({ error: 'REPLICATE_API_TOKEN not configured (ElevenLabs runs via Replicate)' });
    }

    const { reelId, script, voiceId, stability, similarityBoost } = req.body;

    // If reelId provided, pull script from stored reel content
    let finalScript = script;
    if (!finalScript && reelId) {
      const stored = await redis.get(`reel:result:${reelId}`);
      if (!stored) return res.status(404).json({ error: 'Reel not found' });
      const reel = JSON.parse(stored);
      finalScript = reel.content?.script;
    }

    if (!finalScript) {
      return res.status(400).json({ error: 'script or reelId required' });
    }

    const { generateVoiceover } = await import('../../services/audio/elevenlabs.js');
    const tempPath = await generateVoiceover(finalScript, reelId || 'manual', {
      voiceId,
      stability: stability ?? 0.5,
      similarityBoost: similarityBoost ?? 0.8,
    });

    // If reelId provided, store voiceover path reference in reel result
    if (reelId) {
      const stored = await redis.get(`reel:result:${reelId}`);
      if (stored) {
        const reel = JSON.parse(stored);
        reel.voiceover = { status: 'ready', tempPath };
        await redis.set(`reel:result:${reelId}`, JSON.stringify(reel), 'EX', 86400);
      }
    }

    // Stream MP3 back to client
    const stat = await fs.stat(tempPath);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="voiceover-${reelId || 'reel'}.mp3"`);

    const stream = createReadStream(tempPath);
    stream.pipe(res);
    stream.on('end', () => {
      // Clean up temp file after sending
      fs.unlink(tempPath).catch(() => {});
    });

    logger.info('Voiceover streamed to client', { reelId, size: stat.size });
  } catch (err) {
    logger.error('Voiceover error', { err: err.message });
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/audio/voices ─────────────────────────────────────────────────
router.get('/voices', authMiddleware, async (req, res) => {
  try {
    const { listVoices } = await import('../../services/audio/elevenlabs.js');
    res.json({ voices: listVoices(), provider: 'ElevenLabs via Replicate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/audio/quota ──────────────────────────────────────────────────
router.get('/quota', authMiddleware, async (req, res) => {
  try {
    const { getUsageQuota } = await import('../../services/audio/elevenlabs.js');
    res.json(getUsageQuota());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/audio/music ─────────────────────────────────────────────────
// Generate background music using Meta MusicGen on Replicate
// This is the engine behind the Viral package's music feature
// (Suno AI has no public API — MusicGen is used instead)
router.post('/music', authMiddleware, async (req, res) => {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(503).json({ error: 'REPLICATE_API_TOKEN not configured' });
    }

    const { prompt, duration = 20, tone = 'energetic', industry = 'ecommerce', reelId } = req.body;

    const { generateBackgroundMusic, buildMusicPrompt } = await import('../../services/audio/musicGenerator.js');

    const finalPrompt = prompt || buildMusicPrompt(null, { tone, industry });

    logger.info('Generating background music on-demand', { prompt: finalPrompt.substring(0, 80), duration });

    const tempPath = await generateBackgroundMusic({
      prompt: finalPrompt,
      duration: Math.min(parseInt(duration) || 20, 30),
      reelId: reelId || `manual-${Date.now()}`,
    });

    // Stream MP3 back
    const stat = await import('fs/promises').then(m => m.stat(tempPath));
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="music-${reelId || 'bg'}.mp3"`);

    const { createReadStream } = await import('fs');
    const stream = createReadStream(tempPath);
    stream.pipe(res);
    stream.on('end', () => {
      import('fs/promises').then(m => m.unlink(tempPath).catch(() => {}));
    });

    logger.info('Background music streamed to client', { size: stat.size });
  } catch (err) {
    logger.error('Music generation error', { err: err.message });
    res.status(500).json({ error: err.message });
  }
});

export default router;
