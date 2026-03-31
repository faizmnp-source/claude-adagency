/**
 * AI Content Generator — powered by Claude + viral-reel-director skill
 * Generates: script, hooks, caption, hashtags, scene breakdown
 */
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

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
 * Generate viral reel content using Claude
 * @param {Object} params
 * @param {string[]} params.imageUrls - S3 URLs of uploaded product images
 * @param {string} params.productDescription - Optional product description
 * @param {string} params.brandName - Brand name
 * @param {number} params.duration - Reel duration in seconds (15, 30, 50)
 * @param {string} params.tone - 'energetic' | 'professional' | 'emotional' | 'comedic'
 * @param {string} params.targetAudience - e.g. "Indian women 18-35, beauty conscious"
 * @returns {Promise<Object>} Structured JSON content
 */
export async function generateReelContent({
  imageUrls = [],
  productDescription = '',
  brandName = 'TheCraftStudios',
  duration = 30,
  tone = 'energetic',
  targetAudience = 'Indian social media users 18-35',
}) {
  logger.info('Generating reel content with Claude', { duration, tone, brandName });

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

  const sceneCount = Math.ceil(duration / (duration === 15 ? 3 : duration === 30 ? 5 : 7));

  userContent.push({
    type: 'text',
    text: `Create a viral Instagram Reel for this product:

BRAND: ${brandName}
PRODUCT: ${productDescription || 'As shown in the images above'}
REEL DURATION: ${duration} seconds
TARGET AUDIENCE: ${targetAudience}
TONE: ${tone}
PLATFORM: Instagram Reels (9:16 vertical, mobile-first)
NUMBER OF SCENES: ${sceneCount} scenes (each ~${Math.round(duration / sceneCount)}s)

REQUIREMENTS:
- The hook (first 3 seconds) MUST stop the scroll immediately
- Script must be read naturally in ${duration} seconds
- Each scene's "replicatePrompt" must be a detailed text-to-video prompt with consistent character/product appearance
- Caption must be SEO-rich for Instagram discovery in India
- Include 15 relevant hashtags (mix of niche + broad)

${OUTPUT_SCHEMA}`,
  });

  const response = await client.messages.create({
    model: config.anthropic.model,
    max_tokens: 4096,
    system: VIRAL_REEL_DIRECTOR_SYSTEM,
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
  });

  return parsed;
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
