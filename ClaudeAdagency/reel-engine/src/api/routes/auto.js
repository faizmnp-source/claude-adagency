/**
 * Auto-Pilot Content Routes — Monthly Content Plan Engine
 *
 * POST /api/auto/plan         → Generate monthly content plan (calls autoScheduler)
 * GET  /api/auto/plan         → Get current month's plan for this user
 * PUT  /api/auto/plan/:postId → Update a specific post in the plan (manual edits)
 * POST /api/auto/execute/:postId → Manually trigger execution of a specific post NOW
 * GET  /api/auto/status       → Get execution status of all posts
 */
import { Router } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { redis } from '../../queue/index.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const router = Router();

// ── Auth helper — same pattern as instagram.js ────────────────────────────────
function verifyJwt(token) {
  const [header, payload, sig] = token.split('.');
  const expectedSig = createHmac('sha256', config.auth.jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64url');
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    throw new Error('Invalid token');
  }
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }
  return decoded;
}

function getUserId(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = verifyJwt(token);
      if (decoded?.sub) return decoded.sub;
    } catch {
      // fall through to dev mode
    }
  }
  // Dev mode fallback
  return 'dev-user-001';
}

const PLAN_KEY  = (userId) => `auto:plan:${userId}`;
const PLAN_TTL  = 60 * 60 * 24 * 45; // 45 days

// ── POST /api/auto/plan — Generate a full monthly content plan ────────────────
router.post('/plan', async (req, res) => {
  const userId = getUserId(req);

  const {
    brandName,
    productDescription,
    industry,
    region,
    language,
    brandVoice,
    targetAudience,
    brandColors,
    competitors,
  } = req.body;

  // Validate required fields
  if (!brandName || !productDescription || !industry) {
    return res.status(400).json({
      error: 'Missing required fields: brandName, productDescription, industry',
    });
  }

  logger.info('Auto plan generation requested', { userId, brandName, industry });

  try {
    const { generateMonthlyContentPlan } = await import('../../services/scheduler/autoScheduler.js');

    const result = await generateMonthlyContentPlan({
      userId,
      brandName,
      productDescription,
      industry,
      region: region || 'india',
      language: language || 'hinglish',
      brandVoice: brandVoice || '',
      targetAudience: targetAudience || '',
      brandColors: brandColors || '',
      competitors: Array.isArray(competitors) ? competitors : [],
    });

    // Persist plan in Redis
    const planRecord = {
      planId:      result.planId,
      userId,
      createdAt:   new Date().toISOString(),
      contentPlan: result.contentPlan,
      metadata:    result.metadata,
    };

    await redis.set(PLAN_KEY(userId), JSON.stringify(planRecord), 'EX', PLAN_TTL);

    logger.info('Auto plan stored in Redis', { userId, planId: result.planId, posts: result.contentPlan.length });

    return res.status(201).json({
      planId:      result.planId,
      contentPlan: result.contentPlan,
      metadata:    result.metadata,
    });
  } catch (err) {
    logger.error('Auto plan generation failed', { userId, error: err.message });
    return res.status(500).json({ error: 'Content plan generation failed', detail: err.message });
  }
});

// ── GET /api/auto/plan — Retrieve current month's plan ───────────────────────
router.get('/plan', async (req, res) => {
  const userId = getUserId(req);

  try {
    const raw = await redis.get(PLAN_KEY(userId));
    if (!raw) {
      return res.status(404).json({
        error: 'No content plan found for this user. Generate one with POST /api/auto/plan',
      });
    }

    const plan = JSON.parse(raw);
    return res.json({
      planId:      plan.planId,
      createdAt:   plan.createdAt,
      contentPlan: plan.contentPlan,
      metadata:    plan.metadata,
    });
  } catch (err) {
    logger.error('Failed to retrieve auto plan', { userId, error: err.message });
    return res.status(500).json({ error: 'Failed to retrieve content plan', detail: err.message });
  }
});

// ── PUT /api/auto/plan/:postId — Update a specific post ─────────────────────
router.put('/plan/:postId', async (req, res) => {
  const userId = getUserId(req);
  const { postId } = req.params;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No update fields provided in request body' });
  }

  // Fields that cannot be manually overridden
  const immutableFields = ['id', 'type', 'week'];

  try {
    const raw = await redis.get(PLAN_KEY(userId));
    if (!raw) {
      return res.status(404).json({ error: 'No content plan found. Generate one first.' });
    }

    const plan = JSON.parse(raw);
    const postIndex = plan.contentPlan.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: `Post ${postId} not found in your content plan` });
    }

    // Apply updates (excluding immutable fields)
    const existingPost = plan.contentPlan[postIndex];
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => !immutableFields.includes(key))
    );

    plan.contentPlan[postIndex] = {
      ...existingPost,
      ...safeUpdates,
      id:   existingPost.id,   // re-assert immutable fields
      type: existingPost.type,
      week: existingPost.week,
      lastEdited: new Date().toISOString(),
      editedBy: 'user',
    };

    await redis.set(PLAN_KEY(userId), JSON.stringify(plan), 'EX', PLAN_TTL);

    logger.info('Auto plan post updated', { userId, postId });

    return res.json({
      message: `Post ${postId} updated successfully`,
      post: plan.contentPlan[postIndex],
    });
  } catch (err) {
    logger.error('Failed to update auto plan post', { userId, postId, error: err.message });
    return res.status(500).json({ error: 'Failed to update post', detail: err.message });
  }
});

// ── POST /api/auto/execute/:postId — Manually execute a specific post now ────
router.post('/execute/:postId', async (req, res) => {
  const userId = getUserId(req);
  const { postId } = req.params;

  try {
    const raw = await redis.get(PLAN_KEY(userId));
    if (!raw) {
      return res.status(404).json({ error: 'No content plan found. Generate one first.' });
    }

    const plan = JSON.parse(raw);
    const postIndex = plan.contentPlan.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({ error: `Post ${postId} not found in your content plan` });
    }

    const post = plan.contentPlan[postIndex];

    if (post.status === 'posted') {
      return res.status(409).json({
        error: `Post ${postId} has already been executed`,
        executedAt: post.executedAt,
      });
    }

    // Mark as executing
    plan.contentPlan[postIndex] = {
      ...post,
      status: 'executing',
      executionStartedAt: new Date().toISOString(),
      executionTriggeredBy: 'manual',
    };
    await redis.set(PLAN_KEY(userId), JSON.stringify(plan), 'EX', PLAN_TTL);

    logger.info('Manual execution triggered for auto plan post', { userId, postId, type: post.type });

    // Execute based on content type
    let executionResult = null;

    try {
      if (post.type === 'viral_reel' || post.type === 'top_reel' || post.type === 'educational_reel') {
        // For reel posts: trigger reel generation pipeline
        const reelPayload = {
          brandName:          plan.metadata?.brandName || 'Brand',
          productDescription: plan.metadata?.productDescription || post.title,
          script:             post.script,
          reelPrompt:         post.reelPrompt,
          sceneBreakdown:     post.sceneBreakdown,
          duration:           30,
          autoPostId:         postId,
          planId:             plan.planId,
        };

        // Store execution request for reel pipeline to pick up
        const execKey = `auto:exec:${userId}:${postId}`;
        await redis.set(execKey, JSON.stringify(reelPayload), 'EX', 60 * 60 * 24);

        executionResult = {
          type: 'reel_queued',
          message: 'Reel generation queued. Check /api/auto/status for progress.',
          execKey,
        };
      } else if (post.type === 'product_photo' || post.type === 'educational_image') {
        // For image posts: store image prompt for generation
        const imgPayload = {
          imagePrompt: post.imagePrompt,
          caption:     post.caption,
          hashtags:    post.hashtags,
          autoPostId:  postId,
          planId:      plan.planId,
        };

        const execKey = `auto:exec:${userId}:${postId}`;
        await redis.set(execKey, JSON.stringify(imgPayload), 'EX', 60 * 60 * 24);

        executionResult = {
          type: 'image_queued',
          message: 'Image post queued for generation. Check /api/auto/status for progress.',
          execKey,
        };
      }

      // Update status to queued
      plan.contentPlan[postIndex] = {
        ...plan.contentPlan[postIndex],
        status: 'queued',
        executionResult,
      };
      await redis.set(PLAN_KEY(userId), JSON.stringify(plan), 'EX', PLAN_TTL);

      return res.json({
        message: `Post ${postId} execution triggered`,
        postId,
        type: post.type,
        status: 'queued',
        executionResult,
      });
    } catch (execErr) {
      // Mark as failed
      plan.contentPlan[postIndex] = {
        ...plan.contentPlan[postIndex],
        status: 'failed',
        failedAt: new Date().toISOString(),
        failReason: execErr.message,
      };
      await redis.set(PLAN_KEY(userId), JSON.stringify(plan), 'EX', PLAN_TTL);

      throw execErr;
    }
  } catch (err) {
    logger.error('Auto plan post execution failed', { userId, postId, error: err.message });
    return res.status(500).json({ error: 'Post execution failed', detail: err.message });
  }
});

// ── GET /api/auto/status — Get execution status of all posts ─────────────────
router.get('/status', async (req, res) => {
  const userId = getUserId(req);

  try {
    const raw = await redis.get(PLAN_KEY(userId));
    if (!raw) {
      return res.status(404).json({
        error: 'No content plan found. Generate one with POST /api/auto/plan',
      });
    }

    const plan = JSON.parse(raw);

    // Build status summary
    const statusSummary = {
      planId:    plan.planId,
      createdAt: plan.createdAt,
      totalPosts: plan.contentPlan.length,
      byStatus: {
        scheduled: 0,
        queued:    0,
        executing: 0,
        posted:    0,
        failed:    0,
        pending:   0,
      },
      byType: {},
      posts: [],
    };

    plan.contentPlan.forEach(post => {
      // Count by status
      const status = post.status || 'scheduled';
      if (statusSummary.byStatus[status] !== undefined) {
        statusSummary.byStatus[status]++;
      }

      // Count by type
      if (!statusSummary.byType[post.type]) {
        statusSummary.byType[post.type] = { total: 0, posted: 0, scheduled: 0, failed: 0 };
      }
      statusSummary.byType[post.type].total++;
      if (status === 'posted') statusSummary.byType[post.type].posted++;
      else if (status === 'failed') statusSummary.byType[post.type].failed++;
      else statusSummary.byType[post.type].scheduled++;

      // Lightweight post status object
      statusSummary.posts.push({
        id:          post.id,
        type:        post.type,
        week:        post.week,
        title:       post.title,
        scheduledAt: post.scheduledAt,
        status:      post.status || 'scheduled',
        executedAt:  post.executedAt || null,
        failReason:  post.failReason || null,
      });
    });

    // Add completion percentage
    statusSummary.completionRate = Math.round(
      (statusSummary.byStatus.posted / statusSummary.totalPosts) * 100
    );

    return res.json(statusSummary);
  } catch (err) {
    logger.error('Failed to get auto plan status', { userId, error: err.message });
    return res.status(500).json({ error: 'Failed to retrieve plan status', detail: err.message });
  }
});

export default router;
