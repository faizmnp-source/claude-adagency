/**
 * AI Content Generator — powered by Claude + viral-reel-director skill
 * Generates: script, hooks, caption, hashtags, scene breakdown
 * NOW WITH REGIONAL CUSTOMIZATION
 */
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { enhancePromptsForRegion } from './regionalPromptEnhancer.js';
import { combineRegionalAndIndustryGuidance } from './industryPromptEnhancer.js';

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

// ── System prompt derived from viral-reel-director skill ────────────────────
const VIRAL_REEL_DIRECTOR_SYSTEM = `You are a creative director at TheCraftStudios — India's #1 AI reel agency.
Your role is to generate precise, actionable, viral marketing content for Instagram Reels.

You use these proven viral frameworks:
- Pattern Interrupt: Unexpected first frame to stop the scroll
- Curiosity Gap: Open a question, deliver payoff
- Emotional Trigger: Relatable problem → solution
- Social Proof: Results, before/after, testimonials
- Educational Value: Teach something useful in seconds

HOOK RULES (first 3 seconds MUST):
- State a shocking stat, result, or bold claim
- Ask a curiosity-gap question
- Show a dramatic before/after moment

You ALWAYS return valid JSON. Never return markdown or prose — ONLY the JSON object.`;

// ── JSON output schema ───────────────────────────────────────────────────────
const OUTPUT_SCHEMA = `Return ONLY this JSON structure (no markdown, no backticks):
{
  "script": "Full voiceover/dialogue script as a single string",
  "hooks": [
    "Hook 1: Pattern interrupt style",
    "Hook 2: Curiosity gap style",
    "Hook 3: Social proof / result style"
  ],
  "caption": "SEO-optimised Instagram caption (150-200 words, includes CTA)",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10","#tag11","#tag12","#tag13","#tag14","#tag15"],
  "scenes": [
    {
      "sceneNumber": 1,
      "startTime": 0,
      "duration": 3,
      "description": "Visual description for AI video generation",
      "dialogue": "What is said aloud in this scene",
      "textOverlay": "On-screen text (null if none)",
      "visualDirection": "Camera movement, aesthetic, lighting notes",
      "replicatePrompt": "Detailed Stable Diffusion / video-gen prompt for this scene"
    }
  ],
  "visualDirection": {
    "aesthetic": "Color palette and overall vibe",
    "cameraMovement": "Shot types and movement style",
    "musicMood": "Type of background music (upbeat, emotional, cinematic, etc.)",
    "colorGrading": "Warm / cool / neutral, contrast level"
  },
  "platformNotes": {
    "bestPostTime": "e.g. 7pm IST weekdays",
    "retentionHook": "Why viewers will watch till the end",
    "ctaType": "swipe-up / link-in-bio / comment / save"
  }
}`;

/**
 * Generate viral reel content using Claude with regional, language, & industry customization
 * @param {Object} params
 * @param {string[]} params.imageUrls - S3 URLs of uploaded product images
 * @param {string} params.productDescription - Optional product description
 * @param {string} params.brandName - Brand name
 * @param {number} params.duration - Reel duration in seconds (15, 30, 50)
 * @param {string} params.tone - 'energetic' | 'professional' | 'emotional' | 'comedic'
 * @param {string} params.targetAudience - e.g. "Indian women 18-35, beauty conscious"
 * @param {string} params.region - Region code: 'india' | 'america' | 'pakistan' | 'bangladesh' | 'middle_east' | 'british' (default: 'india')
 * @param {string} params.language - Language: 'english' | 'hindi' | 'urdu' | 'hinglish' (default: 'hinglish' for india)
 * @param {string} params.industryCode - Industry: 'ecommerce' | 'fashion' | 'beauty' | 'food' | 'technology' | 'fitness' | 'health' | 'education' | 'realestate' | etc. (default: 'ecommerce')
 * @param {string} params.customCta - Override the auto-generated CTA with this exact text
 * @param {string} params.seasonalEvent - e.g. "diwali", "blackfriday", "eid", "holi", "valentines", "productlaunch", "newyear", "christmas"
 * @param {string} params.brandVoice - Brand personality doc, e.g. "Bold, youthful, anti-corporate. Think Zomato's Twitter voice."
 * @param {string} params.hashtagWhitelist - Comma-separated branded hashtags to ALWAYS include
 * @param {string} params.hashtagBlacklist - Comma-separated hashtags to NEVER use
 * @param {string} params.videoStyle - One of: "cinematic", "fast-cut", "documentary", "minimalist", "ugc", "talking-head"
 * @param {string} params.seriesContext - Campaign series info, e.g. "Post 3 of 5 in our Diwali sale campaign."
 * @returns {Promise<Object>} Structured JSON content with region, language, & industry optimization
 */
export async function generateReelContent({
  imageUrls = [],
  productDescription = '',
  brandName = 'TheCraftStudios',
  duration = 30,
  tone = 'energetic',
  targetAudience = 'Indian social media users 18-35',
  region = 'india',
  language = 'hinglish', // English, Hindi, Urdu, Hinglish
  industryCode = 'ecommerce',
  customCta = '',
  seasonalEvent = '',
  brandVoice = '',
  hashtagWhitelist = '',
  hashtagBlacklist = '',
  videoStyle = '',
  seriesContext = '',
}) {
  logger.info('Generating reel content with Claude', { duration, tone, brandName, region, language, industryCode });

  // Get region-aware + language-aware prompts
  const {
    systemPrompt: regionalSystemPrompt,
    userPrompt: regionalUserPrompt,
    outputSchema: regionalOutputSchema,
    languageConfig,
  } = enhancePromptsForRegion({
    productDescription,
    brandName,
    duration,
    tone,
    targetAudience,
    region,
    language,
  });

  // Get industry-specific guidance to enhance prompts
  const industryGuidance = combineRegionalAndIndustryGuidance({
    region,
    industryCode,
    productDescription,
  });

  // Combine regional + industry prompts for maximum targeting
  const enhancedSystemPrompt = `${regionalSystemPrompt}

${industryGuidance.systemAddition}`;

  // Build advanced customization additions
  const advancedAdditions = [
    customCta ? `\nCUSTOM CTA: Use this exact call-to-action: "${customCta}"` : '',
    seasonalEvent ? `\nSEASONAL EVENT: This reel is for "${seasonalEvent}". Incorporate relevant cultural references, urgency, and event-specific hooks.` : '',
    brandVoice ? `\nBRAND VOICE & PERSONALITY:\n${brandVoice}` : '',
    hashtagWhitelist ? `\nHASHTAGS TO ALWAYS INCLUDE: ${hashtagWhitelist}` : '',
    hashtagBlacklist ? `\nHASHTAGS TO NEVER USE: ${hashtagBlacklist}` : '',
    videoStyle ? `\nVIDEO STYLE: "${videoStyle}" — apply this visual pacing and style throughout all scenes.` : '',
    seriesContext ? `\nSERIES/CAMPAIGN CONTEXT:\n${seriesContext}` : '',
  ].join('');

  const enhancedUserPrompt = `${regionalUserPrompt}

${industryGuidance.userAddition}${advancedAdditions}`;

  // Build the user message — include images if provided
  const userContent = [];

  // Add product images for visual analysis
  for (const url of imageUrls.slice(0, 4)) {
    if (url.startsWith('data:')) {
      // Base64 data URI — Claude requires type: 'base64', not type: 'url'
      const commaIdx = url.indexOf(',');
      const meta = url.slice(5, commaIdx);               // e.g. "image/jpeg;base64"
      const mediaType = meta.split(';')[0];              // e.g. "image/jpeg"
      const data = url.slice(commaIdx + 1);              // raw base64 string
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data },
      });
    } else {
      userContent.push({
        type: 'image',
        source: { type: 'url', url },
      });
    }
  }

  // Add enhanced user prompt with output schema (regional + industry)
  userContent.push({
    type: 'text',
    text: `${enhancedUserPrompt}

${regionalOutputSchema}`,
  });

  const response = await client.messages.create({
    model: config.anthropic.model,
    max_tokens: 4096,
    system: enhancedSystemPrompt,
    messages: [{ role: 'user', content: userContent }],
  });

  const rawText = response.content[0].text.trim();

  // Parse JSON — strip any accidental markdown fences
  const jsonText = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    logger.error('Claude returned invalid JSON, attempting repair', { rawText });
    // Attempt to extract JSON object
    const match = jsonText.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
    else throw new Error(`Claude returned non-JSON response: ${rawText.slice(0, 200)}`);
  }

  // Validate required fields
  if (!parsed.script || !parsed.scenes || !Array.isArray(parsed.scenes)) {
    throw new Error('Claude response missing required fields: script, scenes');
  }

  logger.info('Claude content generation complete', {
    scenes: parsed.scenes.length,
    hashtagCount: parsed.hashtags?.length,
    language: language,
    elevenLabsLanguageCode: languageConfig.elevenLabsLanguageCode,
  });

  // Return with language metadata for downstream processing
  return {
    ...parsed,
    _metadata: {
      language,
      elevenLabsLanguageCode: languageConfig.elevenLabsLanguageCode,
      languageName: languageConfig.name,
      voicePreferences: languageConfig.voicePreferences,
    },
  };
}

/**
 * Regenerate only specific scenes (for free regen feature)
 */
export async function regenerateScenes({ existingContent, scenesToRegenerate, reason }) {
  logger.info('Regenerating specific scenes', { scenes: scenesToRegenerate });

  const response = await client.messages.create({
    model: config.anthropic.model,
    max_tokens: 2048,
    system: VIRAL_REEL_DIRECTOR_SYSTEM,
    messages: [
      {
        role: 'user',
        content: `Here is an existing reel script: ${JSON.stringify(existingContent, null, 2)}

Please regenerate ONLY scenes ${scenesToRegenerate.join(', ')} because: ${reason}

Keep everything else identical. Return the FULL content JSON with the regenerated scenes replaced.

${OUTPUT_SCHEMA}`,
      },
    ],
  });

  const rawText = response.content[0].text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  return JSON.parse(rawText);
}
