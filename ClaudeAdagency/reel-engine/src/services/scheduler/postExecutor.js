/**
 * Post Executor — Auto-Pilot Execution Engine
 *
 * Runs every 15 minutes via setInterval (started from server.js).
 * Scans ALL user auto-plans in Redis, finds posts that are due,
 * generates content (script → image/video via Replicate) and posts to Instagram.
 *
 * Flow for each due post:
 *   1. Mark as 'executing' (prevents double-trigger)
 *   2. Detect type: reel or image post
 *   3. Generate content via Claude (script/caption/hashtags)
 *   4. For reels: generate video via Replicate → stitch → upload
 *      For images: generate image via Replicate → upload
 *   5. Post to Instagram via Meta Graph API
 *   6. Mark as 'posted' with permalink + timestamp
 *   7. On any failure: mark as 'failed' with error message for UI display
 */

import fetch from 'node-fetch';
import { redis } from '../../queue/index.js';
import { logger } from '../../utils/logger.js';

const GRAPH_API   = 'https://graph.facebook.com/v21.0';
const PLAN_KEY    = (userId) => `auto:plan:${userId}`;
const PAUSED_KEY  = (userId) => `auto:paused:${userId}`;
const PLAN_TTL    = 60 * 60 * 24 * 45; // 45 days
const REEL_ENGINE_URL = (process.env.REEL_ENGINE_URL || 'https://zoological-enthusiasm-production-1bc2.up.railway.app').replace(/\/$/, '');

// ── Replicate image generation (FLUX Schnell — fast, high quality) ──────────
const IMAGE_MODEL = 'black-forest-labs/flux-schnell';

async function generateImageViaReplicate(prompt) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error('REPLICATE_API_TOKEN not set');

  // Start prediction
  const startRes = await fetch(`https://api.replicate.com/v1/models/${IMAGE_MODEL}/predictions`, {
    method: 'POST',
    headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { prompt, aspect_ratio: '1:1', output_format: 'webp', num_outputs: 1 } }),
  });
  const prediction = await startRes.json();
  if (!startRes.ok) throw new Error(`Replicate start failed: ${JSON.stringify(prediction)}`);

  // Poll until done (max 90s)
  let result = prediction;
  const deadline = Date.now() + 90_000;
  while (!['succeeded', 'failed', 'canceled'].includes(result.status) && Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 3000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { Authorization: `Token ${token}` },
    });
    result = await pollRes.json();
  }

  if (result.status !== 'succeeded' || !result.output?.[0]) {
    throw new Error(`Image generation failed: ${result.error || result.status}`);
  }
  return result.output[0]; // URL of the generated image
}

// ── Post image to Instagram ─────────────────────────────────────────────────
async function postImageToInstagram({ igAccountId, accessToken, imageUrl, caption }) {
  // Step 1: Create media container
  const containerRes = await fetch(`${GRAPH_API}/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
  });
  const container = await containerRes.json();
  if (!containerRes.ok || container.error) throw new Error(`IG container failed: ${JSON.stringify(container)}`);

  // Step 2: Publish
  const publishRes = await fetch(`${GRAPH_API}/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: accessToken }),
  });
  const publish = await publishRes.json();
  if (!publishRes.ok || publish.error) throw new Error(`IG publish failed: ${JSON.stringify(publish)}`);

  // Step 3: Get permalink
  const infoRes = await fetch(`${GRAPH_API}/${publish.id}?fields=permalink&access_token=${accessToken}`);
  const info = await infoRes.json();
  return { mediaId: publish.id, permalink: info.permalink };
}

// ── Post video/reel to Instagram (using video URL from Replicate) ────────────
async function postVideoToInstagram({ igAccountId, accessToken, videoUrl, caption }) {
  // Step 1: Create reel container
  const containerRes = await fetch(`${GRAPH_API}/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
      share_to_feed: true,
      access_token: accessToken,
    }),
  });
  const container = await containerRes.json();
  if (!containerRes.ok || container.error) throw new Error(`IG reel container failed: ${JSON.stringify(container)}`);

  // Step 2: Wait for video to process (poll status, max 5 min)
  const deadline = Date.now() + 5 * 60_000;
  let statusData = { status_code: 'IN_PROGRESS' };
  while (statusData.status_code === 'IN_PROGRESS' && Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 8000));
    const statusRes = await fetch(
      `${GRAPH_API}/${container.id}?fields=status_code&access_token=${accessToken}`
    );
    statusData = await statusRes.json();
  }
  if (statusData.status_code !== 'FINISHED') {
    throw new Error(`Video processing failed with status: ${statusData.status_code}`);
  }

  // Step 3: Publish
  const publishRes = await fetch(`${GRAPH_API}/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: container.id, access_token: accessToken }),
  });
  const publish = await publishRes.json();
  if (!publishRes.ok || publish.error) throw new Error(`IG reel publish failed: ${JSON.stringify(publish)}`);

  const infoRes = await fetch(`${GRAPH_API}/${publish.id}?fields=permalink&access_token=${accessToken}`);
  const info = await infoRes.json();
  return { mediaId: publish.id, permalink: info.permalink };
}

// ── Generate reel video using existing pipeline ──────────────────────────────
async function generateReelVideo({ post, userId }) {
  // Generate script + scenes via Claude
  const { generateReelContent } = await import('../ai/contentGenerator.js');
  const content = await generateReelContent({
    productDescription: post.script || post.angle || '',
    brandName: post.brandName || 'Brand',
    duration: 30,
    tone: post.type === 'viral_reel' ? 'energetic' : post.type === 'educational_reel' ? 'professional' : 'energetic',
    region: 'india',
    language: 'hinglish',
  });

  // Generate video clips via Replicate (budget model for auto-pilot)
  const { generateVideoClips } = await import('../video/replicateGenerator.js');
  const clips = await generateVideoClips({
    scenes: content.scenes.slice(0, 3), // max 3 clips for auto
    modelKey: 'wan480p',
    reelId: `auto_${post.id}`,
    userId,
  });

  // Return first clip URL as the video (FFmpeg stitching would be needed for multi-clip)
  return { content, videoUrl: clips[0]?.url };
}

// ── Mark a post's status in Redis ────────────────────────────────────────────
async function updatePostStatus(userId, postId, updates) {
  const raw = await redis.get(PLAN_KEY(userId));
  if (!raw) return;
  const plan = JSON.parse(raw);
  const idx = plan.contentPlan.findIndex(p => p.id === postId);
  if (idx === -1) return;
  plan.contentPlan[idx] = { ...plan.contentPlan[idx], ...updates };
  await redis.set(PLAN_KEY(userId), JSON.stringify(plan), 'EX', PLAN_TTL);
}

// ── Execute a single due post ─────────────────────────────────────────────────
async function executePost(userId, post) {
  logger.info('Auto-pilot: executing post', { userId, postId: post.id, type: post.type });

  // Mark as executing to prevent double-trigger
  await updatePostStatus(userId, post.id, { status: 'executing', executedAt: new Date().toISOString() });

  try {
    // Get user's Instagram credentials
    const [accessToken, igAccountId] = await Promise.all([
      redis.get(`meta:access_token:${userId}`),
      redis.get(`meta:ig_account_id:${userId}`),
    ]);

    if (!accessToken || !igAccountId) {
      throw new Error('Instagram not connected for this user. Connect IG first.');
    }

    const caption = `${post.caption || post.angle}\n\n${(post.hashtags || []).slice(0, 15).join(' ')}`;
    const isReel = post.type?.includes('reel');
    let result;

    if (isReel) {
      // ── REEL: generate video then post ──
      logger.info('Auto-pilot: generating reel video', { postId: post.id });
      const { videoUrl } = await generateReelVideo({ post, userId });

      if (!videoUrl) throw new Error('Video generation produced no output URL');

      result = await postVideoToInstagram({ igAccountId, accessToken, videoUrl, caption });
    } else {
      // ── IMAGE POST: generate image then post ──
      const imagePrompt = post.imagePrompt ||
        `${post.title}. ${post.angle}. Professional Instagram post style, high quality, brand photography.`;

      logger.info('Auto-pilot: generating image', { postId: post.id });
      const imageUrl = await generateImageViaReplicate(imagePrompt);

      result = await postImageToInstagram({ igAccountId, accessToken, imageUrl, caption });
    }

    await updatePostStatus(userId, post.id, {
      status: 'posted',
      postedAt: new Date().toISOString(),
      permalink: result.permalink,
      mediaId: result.mediaId,
    });

    logger.info('Auto-pilot: post published', { userId, postId: post.id, permalink: result.permalink });

  } catch (err) {
    logger.error('Auto-pilot: post execution failed', { userId, postId: post.id, error: err.message });
    await updatePostStatus(userId, post.id, {
      status: 'failed',
      failedAt: new Date().toISOString(),
      failReason: err.message,
    });
  }
}

// ── Scan ALL user plans in Redis for due posts ────────────────────────────────
async function scanAndExecuteDuePosts() {
  try {
    // Find all auto plan keys in Redis
    const keys = await redis.keys('auto:plan:*');
    if (!keys.length) return;

    const now = new Date();
    // Allow 20 min window — run every 15 min, catch posts within ±20 min of now
    const windowMs = 20 * 60 * 1000;

    for (const key of keys) {
      const userId = key.replace('auto:plan:', '');
      const raw = await redis.get(key);
      if (!raw) continue;

      const plan = JSON.parse(raw);
      const duePosts = (plan.contentPlan || []).filter(post => {
        if (!['scheduled', 'pending', undefined].includes(post.status)) return false; // skip already done
        const scheduledTime = new Date(post.scheduledAt);
        const diff = now - scheduledTime; // positive = past due
        return diff >= -2 * 60 * 1000 && diff <= windowMs; // within window (2 min early to 20 min past)
      });

      // Skip this user if they have paused auto-pilot
      const paused = await redis.get(PAUSED_KEY(userId));
      if (paused) {
        logger.info('Auto-pilot: skipping paused user', { userId });
        continue;
      }

      for (const post of duePosts) {
        // Don't await — fire each post independently so one failure doesn't block others
        executePost(userId, post).catch(err =>
          logger.error('Unhandled executePost error', { userId, postId: post.id, err: err.message })
        );
      }
    }
  } catch (err) {
    logger.error('Auto-pilot scan failed', { error: err.message });
  }
}

// ── Start the scheduler (called once from server.js) ─────────────────────────
export function startAutoScheduler() {
  const INTERVAL_MS = 15 * 60 * 1000; // every 15 minutes

  logger.info('🤖 Auto-pilot scheduler started', { intervalMinutes: 15 });

  // Run immediately on startup to catch any missed posts (e.g. server restart)
  setTimeout(() => scanAndExecuteDuePosts(), 10_000); // 10s after boot

  // Then run every 15 minutes
  setInterval(() => scanAndExecuteDuePosts(), INTERVAL_MS);
}

// ── Manual trigger — used by POST /api/auto/execute/:postId ──────────────────
export async function executePostManually(userId, postId) {
  const raw = await redis.get(PLAN_KEY(userId));
  if (!raw) throw new Error('No content plan found');

  const plan = JSON.parse(raw);
  const post = plan.contentPlan.find(p => p.id === postId);
  if (!post) throw new Error(`Post ${postId} not found`);
  if (post.status === 'posted') throw new Error('Post already published');
  if (post.status === 'executing') throw new Error('Post is already being executed');

  // Fire and don't await — return immediately, execution runs in background
  executePost(userId, post).catch(err =>
    logger.error('Manual execute failed', { userId, postId, err: err.message })
  );

  return { queued: true, postId, message: 'Post queued for immediate execution' };
}
