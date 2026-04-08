import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { generateMarketingImage, IMAGE_POST_TYPES, getAutoSchedule } from '../../services/image/imageGenerator.js';
import { getProductBrain } from '../../services/ai/productBrain.js';
import { reviewContent } from '../../services/ai/contentReviewer.js';
import { devAuth, requireAuth } from '../middleware/auth.js';
import { config } from '../../config/index.js';

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

const router = express.Router();
// Use requireAuth so we get the real user ID (needed for per-user Instagram tokens)
// Falls back gracefully for dev tokens via devAuth on non-posting routes
router.use((req, res, next) => {
  // The /post route needs real user auth; other routes use devAuth for flexibility
  if (req.path === '/post') return requireAuth(req, res, next);
  return devAuth(req, res, next);
});

// GET /api/images/post-types
router.get('/post-types', (req, res) => {
  res.json({ postTypes: IMAGE_POST_TYPES });
});

// GET /api/images/models — list available image generation models
router.get('/models', async (req, res) => {
  try {
    const { IMAGE_MODELS } = await import('../../services/image/imageGenerator.js');
    res.json({ models: IMAGE_MODELS });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/images/schedule
router.get('/schedule', (req, res) => {
  const { industry = 'ecommerce', region = 'india', postType = 'educational', count = 7 } = req.query;
  const schedule = getAutoSchedule({ industry, region, postType, count: Number(count) });
  res.json({ schedule });
});

// POST /api/images/generate  — Express mode
router.post('/generate', async (req, res) => {
  try {
    const {
      postType = 'educational',
      productDescription,
      brandName,
      brandVoice,
      features = [],
      offer,
      region = 'india',
      industry = 'ecommerce',
      designStyle,
      customPrompt,
      mode = 'express',  // express | manual | auto
      scheduleDay,
      scheduleTime,
      count = 1,
      imageModel = 'flux-dev', // Image quality: flux-schnell | flux-dev | flux-pro | sd35 | ideogram
    } = req.body;

    if (!productDescription && !customPrompt) {
      return res.status(400).json({ error: 'productDescription or customPrompt is required' });
    }

    // Try to load product sub-brain for richer context
    const userId = req.user?.id || 'dev-user-001';
    const productBrain = brandName ? await getProductBrain(userId, brandName) : null;

    // Merge product brain context if available
    const enrichedBrandVoice = productBrain?.brandVoice || brandVoice;
    const enrichedFeatures   = productBrain?.features?.length ? productBrain.features : features;

    // Generate image(s)
    const results = [];
    const numImages = Math.min(Number(count), 4); // max 4 at once

    for (let i = 0; i < numImages; i++) {
      const result = await generateMarketingImage({
        postType,
        productDescription: productBrain?.description || productDescription,
        brandName: productBrain?.brandName || brandName,
        brandVoice: enrichedBrandVoice,
        features: enrichedFeatures,
        offer,
        region,
        industry,
        designStyle,
        customPrompt,
        imageModel,
      });
      results.push(result);
    }

    // Build caption using product brain context
    const caption = productBrain?.captionTemplate
      ? productBrain.captionTemplate.replace('{offer}', offer || '').trim()
      : null;

    // Schedule info for auto mode
    const schedule = mode === 'auto'
      ? getAutoSchedule({ industry, region, postType, count: 3 })
      : scheduleDay && scheduleTime
        ? [{ day: scheduleDay, time: scheduleTime, rationale: 'Manually scheduled' }]
        : null;

    res.json({
      success: true,
      images: results,
      postType,
      caption,
      schedule,
      productBrainUsed: !!productBrain,
      mode,
    });

  } catch (err) {
    console.error('[images/generate]', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images/hashtags — Claude generates high-quality Instagram hashtags
router.post('/hashtags', async (req, res) => {
  try {
    const { topic, region = 'india', industry = 'ecommerce', brandName, count = 30 } = req.body;
    if (!topic) return res.status(400).json({ error: 'topic is required' });

    const response = await anthropic.messages.create({
      model: config.anthropic.model || 'claude-opus-4-5',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `You are an Instagram growth expert for the ${region} market. Generate ${count} high-quality Instagram hashtags for this content.

Topic/Product: ${topic}
Brand: ${brandName || 'unspecified'}
Industry: ${industry}
Region: ${region}

Generate a strategic mix:
- 8 high-reach hashtags (1M+ posts) — broad discoverability
- 10 medium-reach hashtags (100K–1M posts) — targeted reach
- 8 niche hashtags (under 100K posts) — highly engaged audience
- 4 trending/seasonal hashtags relevant to ${region} right now

Rules:
- All lowercase with # prefix
- No spaces in hashtags
- Include relevant ${region}-specific hashtags (e.g. #india, #mumbai, #madeinIndia etc. if relevant)
- Make them genuinely relevant — not just generic #love #instagood spam
- Include industry-specific professional hashtags
- Mix English and relevant regional language hashtags if ${region} is India

Return ONLY valid JSON: { "hashtags": ["#tag1", "#tag2", ...], "categories": { "highReach": ["#..."], "mediumReach": ["#..."], "niche": ["#..."], "trending": ["#..."] } }`
      }]
    });

    const raw = response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const data = JSON.parse(raw);
    res.json({ success: true, ...data });
  } catch (err) {
    console.error('[images/hashtags]', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images/enhance-prompt — Claude enhances a raw user prompt into a high-quality image generation prompt
router.post('/enhance-prompt', async (req, res) => {
  try {
    const { rawPrompt, style, region = 'india', industry = 'ecommerce' } = req.body;
    if (!rawPrompt) return res.status(400).json({ error: 'rawPrompt is required' });

    const response = await anthropic.messages.create({
      model: config.anthropic.model || 'claude-opus-4-5',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Convert this rough image idea into a detailed, high-quality Stable Diffusion / FLUX image generation prompt for an Instagram marketing post.

Raw idea: "${rawPrompt}"
Style preference: ${style || 'professional product photography'}
Market: ${region} ${industry}

Rules:
- Be very specific about lighting, composition, background, colors, mood
- Include "Instagram post, square format, professional marketing photography"
- Add technical quality tags: sharp focus, 8K, high detail, studio lighting
- Keep it under 150 words
- Return ONLY the enhanced prompt text, nothing else`
      }]
    });

    const enhancedPrompt = response.content[0].text.trim();
    res.json({ success: true, enhancedPrompt });
  } catch (err) {
    console.error('[images/enhance-prompt]', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images/review — AI reviews image caption/concept
router.post('/review', async (req, res) => {
  try {
    const { content, postType, brandName, region, industry } = req.body;
    const review = await reviewContent({ content, postType, brandName, region, industry, type: 'image' });
    res.json({ review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/images/post — Post image to Instagram
// Uses per-user OAuth token (from Instagram Business Login) stored in Redis
router.post('/post', async (req, res) => {
  try {
    const { imageUrl, caption = '', hashtags = [] } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

    const userId = req.user?.id;
    const { redis } = await import('../../queue/index.js');

    // Get per-user Instagram credentials (set during OAuth)
    let accessToken = await redis.get(`instagram:token:${userId}`);
    let igAccountId = await redis.get(`instagram:account:${userId}`);
    // Per-user OAuth tokens use graph.instagram.com
    let GRAPH = 'https://graph.instagram.com/v21.0';

    // Fall back to env-level token (manually generated from Meta portal)
    // These use graph.facebook.com (old API) with the Facebook-side account ID
    if (!accessToken) {
      accessToken = process.env.META_ACCESS_TOKEN;
      igAccountId = process.env.META_INSTAGRAM_ACCOUNT_ID;
      GRAPH = 'https://graph.facebook.com/v21.0';
    }

    if (!accessToken || !igAccountId) {
      return res.status(400).json({ error: 'Instagram not connected. Please connect your Instagram account first.' });
    }
    const fullCaption = hashtags.length > 0
      ? `${caption}\n\n${hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')}`
      : caption;

    // Step 1: Create image media container
    const containerRes = await fetch(`${GRAPH}/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        image_url: imageUrl,
        caption: fullCaption,
        media_type: 'IMAGE',
        access_token: accessToken,
      }),
    });

    const containerData = await containerRes.json();
    if (containerData.error) {
      return res.status(400).json({ error: `Instagram container error: ${containerData.error.message}` });
    }

    const creationId = containerData.id;

    // Step 2: Wait for container to finish processing (Instagram needs time)
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    let status = 'IN_PROGRESS';
    let attempts = 0;
    while (status !== 'FINISHED' && attempts < 15) {
      await sleep(2000);
      const statusRes = await fetch(
        `${GRAPH}/${creationId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();
      status = statusData.status_code || 'IN_PROGRESS';
      attempts++;
      if (status === 'ERROR') {
        return res.status(400).json({ error: `Instagram media processing failed: ${JSON.stringify(statusData)}` });
      }
    }

    // Step 3: Publish the container
    const publishRes = await fetch(`${GRAPH}/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();
    if (publishData.error) {
      return res.status(400).json({ error: `Instagram publish error: ${publishData.error.message}` });
    }

    // Step 3: Get permalink
    const mediaRes = await fetch(
      `${GRAPH}/${publishData.id}?fields=permalink&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();

    res.json({
      success: true,
      mediaId: publishData.id,
      permalink: mediaData.permalink,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
