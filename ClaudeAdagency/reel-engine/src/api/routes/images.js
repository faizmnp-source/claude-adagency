import express from 'express';
import { generateMarketingImage, IMAGE_POST_TYPES, getAutoSchedule } from '../../services/image/imageGenerator.js';
import { getProductBrain, saveProductBrain } from '../../services/ai/productBrain.js';
import { reviewContent } from '../../services/ai/contentReviewer.js';
import { devAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(devAuth);

// GET /api/images/post-types
router.get('/post-types', (req, res) => {
  res.json({ postTypes: IMAGE_POST_TYPES });
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

export default router;
