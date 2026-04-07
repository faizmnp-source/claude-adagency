import express from 'express';
import { getTrendingTopics, analyzeViralOpportunity, buildViralFusedPrompt } from '../../services/ai/viralBrain.js';
import { devAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(devAuth);

// GET /api/viral/trends?region=india&industry=fashion&count=10
router.get('/trends', async (req, res) => {
  try {
    const { region = 'india', industry, count = 10 } = req.query;
    const trends = await getTrendingTopics({ region, industry, count: Number(count) });
    res.json({ success: true, ...trends });
  } catch (err) {
    console.error('[viral/trends]', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/viral/analyze — analyze opportunities for a product
router.post('/analyze', async (req, res) => {
  try {
    const { productDescription, brandName, region, industry, trends } = req.body;
    if (!productDescription) return res.status(400).json({ error: 'productDescription required' });

    // Fetch trends if not provided
    let trendData = trends;
    if (!trendData) {
      const fetched = await getTrendingTopics({ region, industry });
      trendData = fetched.trends;
    }

    const analysis = await analyzeViralOpportunity({ productDescription, brandName, region, industry, trends: trendData });
    res.json({ success: true, ...analysis });
  } catch (err) {
    console.error('[viral/analyze]', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/viral/fuse — build a viral-fused prompt for content generation
router.post('/fuse', async (req, res) => {
  try {
    const { productDescription, brandName, trendTopic, trendAngle, duration, region, industry, language } = req.body;
    if (!productDescription || !trendTopic) return res.status(400).json({ error: 'productDescription and trendTopic required' });

    const fused = await buildViralFusedPrompt({ productDescription, brandName, trendTopic, trendAngle, duration, region, industry, language });
    res.json({ success: true, ...fused });
  } catch (err) {
    console.error('[viral/fuse]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
