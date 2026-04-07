import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

/**
 * AI Content Review — scores and improves generated content
 * Works for both reels (script/caption) and image posts
 */
export async function reviewContent({ content, postType, brandName, region, industry, type = 'reel' }) {
  const prompt = type === 'reel'
    ? `You are a viral content strategist. Review this Instagram Reel content and provide improvements.

Brand: ${brandName || 'Unknown'}
Region: ${region || 'India'}
Industry: ${industry || 'ecommerce'}

CONTENT TO REVIEW:
Script: ${content.script || ''}
Caption: ${content.caption || ''}
Hooks: ${(content.hooks || []).join(' | ')}
Hashtags: ${(content.hashtags || []).join(' ')}

Return ONLY valid JSON:
{
  "overallScore": 85,
  "scores": {
    "hookStrength": 80,
    "scriptFlow": 85,
    "captionQuality": 90,
    "ctaClarity": 75,
    "hashtagRelevance": 88
  },
  "strengths": ["strength1", "strength2"],
  "improvements": [
    { "field": "hook", "issue": "what's wrong", "suggestion": "improved version" },
    { "field": "caption", "issue": "what's wrong", "suggestion": "improved version" }
  ],
  "improvedScript": "Fully rewritten improved script if score < 80",
  "improvedCaption": "Improved caption",
  "improvedHook": "Best hook rewritten",
  "viralPotential": "high|medium|low",
  "viralReason": "Why this will or won't go viral"
}`
    : `You are a social media content strategist. Review this Instagram image post concept.

Brand: ${brandName || 'Unknown'}
Post Type: ${postType || 'educational'}
Region: ${region || 'India'}
Industry: ${industry || 'ecommerce'}

CONTENT: ${typeof content === 'string' ? content : JSON.stringify(content)}

Return ONLY valid JSON:
{
  "overallScore": 85,
  "scores": {
    "visualConcept": 85,
    "messagingClarity": 80,
    "audienceRelevance": 88,
    "ctaStrength": 75
  },
  "strengths": ["strength1", "strength2"],
  "improvements": [
    { "field": "visual", "issue": "what's wrong", "suggestion": "how to fix" }
  ],
  "improvedPrompt": "Better image generation prompt",
  "engagementPrediction": "How this post will perform",
  "viralPotential": "high|medium|low"
}`;

  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim());
}
