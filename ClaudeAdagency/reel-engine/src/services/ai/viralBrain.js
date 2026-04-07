import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

/**
 * Viral Trend Brain
 * Identifies current trending topics by region and globally,
 * then intelligently suggests how to ride them for product promotion.
 */

// Curated trend intelligence (updated knowledge base)
const TREND_INTELLIGENCE = {
  india: {
    evergreen: [
      'IPL cricket season content', 'Bollywood song trends', 'Festival season (Diwali/Holi/Eid)',
      'Startup hustle culture', 'Budget shopping hacks', 'Chai pe charcha slice-of-life',
      'Before/after transformation reels', 'POV working from home', 'Street food culture',
      'Jugaad (Indian innovation) moments', 'Regional pride content',
    ],
    formats: [
      'Trending audio/song lip sync', 'Transition reels', 'This vs That comparisons',
      'Day in my life', 'Expectation vs Reality', 'Get ready with me (GRWM)',
      'Pointing trend with text overlays', '"Tell me without telling me"',
    ],
    platforms: { instagram: { peakHours: '7pm-10pm IST', bestDays: 'Tue-Thu-Sat' } },
  },
  global: {
    evergreen: [
      'AI tools showcase', 'Productivity hacks', 'Minimalism lifestyle',
      'Mental health awareness', 'Sustainability & eco-friendly',
      'Tech unboxing/review style', 'Duet/reaction format', 'Educational "Did you know"',
      'Nostalgia content', 'Satisfying process videos', 'Behind the scenes',
    ],
    formats: [
      'Trending audio reels', 'Text-on-screen storytelling', 'Photo dump aesthetic',
      'B-roll cinematic', 'Interview-style talking head', 'Fast-cut montage',
    ],
  },
};

/**
 * Get trending topics for a region using Claude's knowledge
 */
export async function getTrendingTopics({ region = 'india', industry, count = 10 }) {
  const regionData = TREND_INTELLIGENCE[region] || TREND_INTELLIGENCE.india;
  const globalData  = TREND_INTELLIGENCE.global;

  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `You are a viral content intelligence analyst specializing in ${region} social media trends.

Based on your training data and knowledge of social media trends up to your cutoff:

REGION: ${region}
INDUSTRY CONTEXT: ${industry || 'general'}

Identify the TOP ${count} trending content formats, topics, and viral patterns currently dominating Instagram Reels in ${region}.

Include:
- Regional viral content formats and trends
- Audio/music trends popular in ${region}
- Cultural moments or seasonal trends
- Cross-platform viral formats adapted for Instagram
- ${industry ? `Trends specifically relevant to ${industry} brands` : 'Universal trending formats'}

Known regional patterns: ${JSON.stringify(regionData.evergreen.slice(0, 5))}
Global formats: ${JSON.stringify(globalData.formats.slice(0, 5))}

Return ONLY valid JSON:
{
  "trends": [
    {
      "topic": "trend name",
      "category": "audio|format|cultural|challenge|educational|lifestyle",
      "virality": "high|medium",
      "description": "what it is and why it's viral",
      "audienceAppeal": "who engages with this",
      "longevity": "evergreen|seasonal|moment",
      "exampleHook": "Example opening hook using this trend"
    }
  ],
  "hotFormats": ["format1", "format2", "format3"],
  "peakPostingTime": "${regionData.platforms?.instagram?.peakHours || '7pm-9pm'}",
  "bestDays": "${regionData.platforms?.instagram?.bestDays || 'Tue-Thu'}",
  "regionInsight": "One key insight about what makes content go viral in ${region} right now"
}`,
    }],
  });

  return JSON.parse(response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
}

/**
 * Viral Opportunity Analysis
 * Takes a product + current trends, returns smart promotional angle suggestions
 */
export async function analyzeViralOpportunity({ productDescription, brandName, region, industry, trends }) {
  const trendList = trends?.map(t => `• ${t.topic}: ${t.description}`).join('\n') || 'Current viral trends';

  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `You are a viral marketing strategist. Analyze which trending topics can smartly amplify this brand's content.

BRAND: ${brandName || 'Brand'}
PRODUCT: ${productDescription}
REGION: ${region || 'India'}
INDUSTRY: ${industry || 'ecommerce'}

CURRENT VIRAL TRENDS:
${trendList}

Your task: Identify the 3 BEST trend-product combinations that feel NATURAL (not forced) and would genuinely go viral.

Return ONLY valid JSON:
{
  "opportunities": [
    {
      "trend": "trend name",
      "fitScore": 85,
      "angle": "How to combine this trend with the product naturally",
      "hook": "Viral opening hook (first 3 seconds)",
      "concept": "Full reel concept in 2-3 sentences",
      "why": "Why this combination will go viral",
      "risk": "any risk or consideration",
      "urgency": "post now|this week|evergreen"
    }
  ],
  "topPick": 0,
  "strategicAdvice": "Overall strategic advice for riding trends without losing brand identity"
}`,
    }],
  });

  return JSON.parse(response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
}

/**
 * Build a viral-trend-fused content prompt
 * Combines current viral format + product = high-converting prompt for Claude content generator
 */
export async function buildViralFusedPrompt({ productDescription, brandName, trendTopic, trendAngle, duration, region, industry, language }) {
  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `You are a viral reel director. Build the perfect content brief that fuses a trending topic with product promotion so naturally that viewers don't feel like they're watching an ad.

BRAND: ${brandName}
PRODUCT: ${productDescription}
VIRAL TREND TO RIDE: ${trendTopic}
ANGLE: ${trendAngle}
DURATION: ${duration}s
REGION: ${region}
LANGUAGE: ${language || 'hinglish'}

Create a detailed content prompt that:
1. Opens with the viral trend format (first 3-5 seconds feel like regular trending content)
2. Naturally transitions to product benefit
3. Ends with a soft CTA that feels organic

Return ONLY valid JSON:
{
  "enrichedPrompt": "Full detailed prompt to pass to the content generator",
  "hook": "Exact first line/action",
  "trendIntegration": "How the trend is woven in (first 5 seconds)",
  "transition": "The pivot moment from trend to product",
  "cta": "Natural closing CTA",
  "visualNotes": "Visual direction notes for maximum viral impact",
  "estimatedViralScore": 82
}`,
    }],
  });

  return JSON.parse(response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
}
