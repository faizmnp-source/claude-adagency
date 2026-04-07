import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { saveProductBrain, getProductBrain, listProductBrains, deleteProductBrain } from '../../services/ai/productBrain.js';
import { devAuth } from '../middleware/auth.js';
import { config } from '../../config/index.js';

const router = express.Router();
router.use(devAuth);

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

// GET /api/products — list all product brains for user
router.get('/', async (req, res) => {
  const userId = req.user?.id || 'dev-user-001';
  const brains = await listProductBrains(userId);
  res.json({ products: brains });
});

// GET /api/products/:brandSlug
router.get('/:brandSlug', async (req, res) => {
  const userId = req.user?.id || 'dev-user-001';
  const brain  = await getProductBrain(userId, req.params.brandSlug.replace(/_/g, ' '));
  if (!brain) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: brain });
});

// POST /api/products — create/update product sub-brain
// AI analyzes product info and builds rich context
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id || 'dev-user-001';
    const {
      brandName, description, features = [], usp, targetAudience,
      industry, region, language, brandVoice, brandedHashtags = [],
      priceRange, competitors = [], website,
    } = req.body;

    if (!brandName || !description) {
      return res.status(400).json({ error: 'brandName and description are required' });
    }

    // AI enrichment — Claude analyzes the product and generates sub-brain context
    const aiResponse = await anthropic.messages.create({
      model: config.anthropic.model || 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a brand strategist. Analyze this product and generate a rich brand context object.

Brand: ${brandName}
Description: ${description}
Features: ${features.join(', ')}
USP: ${usp || 'Not specified'}
Target Audience: ${targetAudience || 'Not specified'}
Industry: ${industry || 'Not specified'}
Price Range: ${priceRange || 'Not specified'}
${competitors.length ? `Competitors: ${competitors.join(', ')}` : ''}

Return ONLY valid JSON (no markdown) with this structure:
{
  "enrichedDescription": "2-3 sentence compelling product description",
  "coreUSP": "Single most powerful USP in one sentence",
  "contentPillars": ["pillar1", "pillar2", "pillar3", "pillar4"],
  "audienceInsights": "Who buys this and why — detailed",
  "emotionalTriggers": ["trigger1", "trigger2", "trigger3"],
  "contentAngles": ["angle1", "angle2", "angle3", "angle4", "angle5"],
  "suggestedBrandVoice": "Tone and personality description if not provided",
  "captionTemplate": "Reusable caption template with {offer} placeholder",
  "topHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "competitiveEdge": "What makes this brand win vs competitors"
}`
      }]
    });

    const aiInsights = JSON.parse(aiResponse.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());

    const brain = {
      brandName,
      description: aiInsights.enrichedDescription || description,
      features,
      usp: aiInsights.coreUSP || usp,
      targetAudience: aiInsights.audienceInsights || targetAudience,
      industry: industry || 'ecommerce',
      region:   region   || 'india',
      language: language || 'hinglish',
      brandVoice: brandVoice || aiInsights.suggestedBrandVoice,
      brandedHashtags: [...new Set([...brandedHashtags, ...(aiInsights.topHashtags || [])])],
      contentPillars:  aiInsights.contentPillars  || [],
      contentAngles:   aiInsights.contentAngles   || [],
      emotionalTriggers: aiInsights.emotionalTriggers || [],
      captionTemplate:   aiInsights.captionTemplate  || '',
      competitiveEdge:   aiInsights.competitiveEdge  || '',
      priceRange, competitors, website,
      aiEnriched: true,
      createdAt: new Date().toISOString(),
    };

    const { slug } = await saveProductBrain(userId, brain);
    res.json({ success: true, product: brain, slug });

  } catch (err) {
    console.error('[products/create]', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:brandSlug
router.delete('/:brandSlug', async (req, res) => {
  const userId = req.user?.id || 'dev-user-001';
  await deleteProductBrain(userId, req.params.brandSlug.replace(/_/g, ' '));
  res.json({ success: true });
});

export default router;
