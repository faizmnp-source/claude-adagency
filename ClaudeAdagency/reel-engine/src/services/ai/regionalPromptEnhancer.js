/**
 * Regional Prompt Enhancer
 * Adapts Claude prompts based on regional characteristics, cultural nuances, and market insights
 * Integrates language-specific instructions for English, Hindi, Urdu, and Hinglish
 * Produces region-aware, culturally sensitive, top-quality content
 */

import { getRegionConfig } from '../../config/regions.js';
import { getLanguageConfig, getLanguagePromptEnhancement, SUPPORTED_LANGUAGES } from '../../config/languages.js';

/**
 * Build a region-aware system prompt for Claude
 * Enhanced from the base viral-reel-director prompt
 * @param {string} region - Region code (e.g., 'india', 'america')
 * @returns {string} Enhanced system prompt
 */
export function buildRegionalSystemPrompt(region = 'india') {
  const config = getRegionConfig(region);

  const basePrompt = `You are a creative director at TheCraftStudios — a world-class AI reel agency.
Your role is to generate precise, actionable, viral marketing content for Instagram Reels.

**REGIONAL CONTEXT: ${config.name}**
You are creating content specifically for the ${config.name} market.
- Primary languages: ${config.languages.join(', ')}
- Target timezone: ${config.timezone}

**CULTURAL & MARKET INSIGHTS:**
${config.cultural.values.map(v => `- ${v}`).join('\n')}

**TONE GUIDANCE FOR ${config.name.toUpperCase()}:**
${config.cultural.toneModifiers.map(t => `- ${t}`).join('\n')}

**CONTENT THEMES THAT RESONATE IN ${config.name.toUpperCase()}:**
${config.cultural.contentThemes.map(t => `- ${t}`).join('\n')}

**MARKET BEHAVIOR:**
- Target demographic: ${config.market.demographics}
- Buying psychology: ${config.market.buyingPower}
- Peak engagement times: ${config.market.peakPostingTimes.join(', ')}
- Average watch duration: ${config.market.averageWatchDuration}
- What drives engagement: ${config.market.engagementDrivers.join(', ')}

**PROVEN VIRAL FRAMEWORKS FOR THIS MARKET:**
- Pattern Interrupt: Unexpected first frame using ${config.name} cultural hooks
- Curiosity Gap: Questions that resonate with local concerns and aspirations
- Emotional Trigger: Relatable ${config.name} problems → solutions
- Social Proof: Results, testimonials, success stories from the same region
- Educational Value: Teach something valuable and culturally relevant

**CRITICAL HOOK RULES (first 3 seconds MUST):**
- Open with a shocking stat, result, or bold claim relevant to ${config.name}
- Ask a curiosity-gap question that speaks to local pain points
- Show a dramatic before/after moment that resonates culturally
- Use language/phrasing natural to ${config.name} audiences

**VOICE & LANGUAGE EXPECTATIONS:**
${config.voicePreferences.examples.map(e => `- ${e}`).join('\n')}
AVOID: ${config.voicePreferences.avoidance.join(', ')}

**SCRIPT CUSTOMIZATION FOR ${config.name.toUpperCase()}:**
${config.cultural.scriptCustomization.openingHooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}

**HASHTAG STRATEGY FOR ${config.name.toUpperCase()}:**
Always include these regional hashtags:
${config.cultural.hashtags.map(h => `- ${h}`).join('\n')}
Then add 5-10 niche hashtags specific to the product category, trending in ${config.name}.

**CLOSING CTA TYPES THAT WORK IN ${config.name.toUpperCase()}:**
${config.cultural.scriptCustomization.closingCtaTypes.map(cta => `- "${cta}"`).join('\n')}

**OUTPUT REQUIREMENTS:**
You ALWAYS return valid JSON. Never return markdown or prose — ONLY the JSON object.
The script, hooks, and captions must be written in ${config.primaryLanguage}.
For ${config.name}, prioritize: ${config.market.engagementDrivers.join(', ')}`;

  return basePrompt;
}

/**
 * Build a region-aware user prompt
 * Supplements the base reel request with regional customization
 * @param {Object} params - Generation parameters
 * @param {string} params.productDescription - Product details
 * @param {string} params.brandName - Brand name
 * @param {number} params.duration - Reel duration in seconds
 * @param {string} params.tone - Tone modifier
 * @param {string} params.targetAudience - Target audience description
 * @param {string} params.region - Region code
 * @param {number} params.sceneCount - Number of scenes
 * @returns {string} Enhanced user prompt
 */
export function buildRegionalUserPrompt({
  productDescription = '',
  brandName = 'TheCraftStudios',
  duration = 30,
  tone = 'energetic',
  targetAudience = '',
  region = 'india',
  sceneCount = 5,
}) {
  const config = getRegionConfig(region);

  let customAudience = targetAudience;
  if (!customAudience) {
    customAudience = `${config.market.demographics} (${config.name} market)`;
  }

  const regionalPriorities = [
    `Target demographic insights: ${config.market.buyingPower}`,
    `Content preference: ${config.market.contentPreference}`,
    `Engagement drivers: ${config.market.engagementDrivers.slice(0, 3).join(', ')}`,
  ].join('\n');

  const prompt = `Create a viral Instagram Reel specifically optimized for the ${config.name} market:

BRAND: ${brandName}
PRODUCT: ${productDescription || 'As shown in the images above'}
REEL DURATION: ${duration} seconds
TARGET AUDIENCE: ${customAudience}
TONE: ${tone}
REGION: ${config.name} (${config.primaryLanguage})
PLATFORM: Instagram Reels (9:16 vertical, mobile-first)
NUMBER OF SCENES: ${sceneCount} scenes (each ~${Math.round(duration / sceneCount)}s)

**REGION-SPECIFIC PRIORITIES FOR ${config.name.toUpperCase()}:**
${regionalPriorities}

**LANGUAGE & CULTURAL REQUIREMENTS:**
- Script must be written in ${config.primaryLanguage}
- Use phrasing and references natural to ${config.name} audiences
- Include at least 2 cultural hooks or local references that resonate in ${config.name}
- Tone modifier: ${tone} + ${config.cultural.toneModifiers.slice(0, 2).join(' + ')}

**REQUIREMENTS:**
- The hook (first 3 seconds) MUST use a ${config.name}-specific cultural trigger to stop the scroll
- Script must flow naturally in ${config.primaryLanguage} and be read naturally in ${duration} seconds
- Each scene's "replicatePrompt" must include region-appropriate visual aesthetics and cultural elements
- Caption must be SEO-optimized for ${config.name} Instagram discovery
- Hashtags must include regional hashtags: ${config.cultural.hashtags.join(', ')}
- CTA must use language that resonates in ${config.name}: ${config.cultural.scriptCustomization.closingCtaTypes[0]}
- Include 15 relevant hashtags (mix of ${config.name}-specific + product-niche + broad)`;

  return prompt;
}

/**
 * Get region-specific output schema with language customization
 * @param {string} region - Region code
 * @returns {string} JSON schema with region-specific notes
 */
export function getRegionalOutputSchema(region = 'india') {
  const config = getRegionConfig(region);

  return `Return ONLY this JSON structure (no markdown, no backticks):
{
  "script": "Full voiceover/dialogue script in ${config.primaryLanguage} as a single string",
  "hooks": [
    "Hook 1: ${config.cultural.toneModifiers[0]} style with ${config.name} cultural reference",
    "Hook 2: ${config.cultural.toneModifiers[1]} style with local pain point",
    "Hook 3: ${config.market.engagementDrivers[0]} style proof point"
  ],
  "caption": "SEO-optimized Instagram caption for ${config.name} (150-200 words, in ${config.primaryLanguage}, includes CTA targeting ${config.market.demographics})",
  "hashtags": ["${config.cultural.hashtags.map(h => h.slice(1)).join('","#')}","#tag13","#tag14","#tag15"],
  "scenes": [
    {
      "sceneNumber": 1,
      "startTime": 0,
      "duration": 3,
      "description": "Visual description optimized for ${config.name} market aesthetics",
      "dialogue": "Script in ${config.primaryLanguage} (${config.cultural.toneModifiers[0]})",
      "textOverlay": "On-screen text in ${config.primaryLanguage} or null if none",
      "visualDirection": "Camera movement, aesthetic, lighting optimized for ${config.name} viewing preferences",
      "replicatePrompt": "Detailed video-gen prompt featuring ${config.name}-appropriate visuals, colors, and cultural context"
    }
  ],
  "visualDirection": {
    "aesthetic": "Color palette and vibe that resonates in ${config.name} (e.g., warm/cool tones, luxury level)",
    "cameraMovement": "Shot types and movement style preferred by ${config.name} audiences",
    "musicMood": "Background music type that fits ${config.name} market (e.g., Bollywood, Western pop, etc.)",
    "colorGrading": "Warm / cool / neutral, contrast level optimized for ${config.name} market"
  },
  "platformNotes": {
    "bestPostTime": "${config.market.peakPostingTimes[0]}",
    "retentionHook": "Why viewers in ${config.name} will watch till the end (${config.market.engagementDrivers[0]})",
    "ctaType": "${config.cultural.scriptCustomization.closingCtaTypes[0].toLowerCase()}"
  }
}`;
}

/**
 * Enhance a complete content generation request with regional awareness
 * Returns enhanced system prompt, user prompt, and output schema
 * NOW WITH LANGUAGE-SPECIFIC CUSTOMIZATION
 * @param {Object} params - All generation parameters
 * @param {string} params.language - Language code: 'english' | 'hindi' | 'urdu' | 'hinglish'
 * @returns {Object} Enhanced prompts { systemPrompt, userPrompt, outputSchema, language }
 */
export function enhancePromptsForRegion({
  productDescription = '',
  brandName = 'TheCraftStudios',
  duration = 30,
  tone = 'energetic',
  targetAudience = '',
  region = 'india',
  language = 'hinglish', // Default to Hinglish for India
}) {
  const sceneCount = Math.ceil(duration / (duration === 15 ? 3 : duration === 30 ? 5 : 7));
  const regionConfig = getRegionConfig(region);
  const languageConfig = getLanguageConfig(language);
  const languagePromptEnhancement = getLanguagePromptEnhancement(language);

  // Build base prompts
  const systemPrompt = buildRegionalSystemPrompt(region);
  const userPrompt = buildRegionalUserPrompt({
    productDescription,
    brandName,
    duration,
    tone,
    targetAudience,
    region,
    sceneCount,
  });

  // Add language-specific enhancement to system prompt
  const enhancedSystemPrompt = `${systemPrompt}

${languagePromptEnhancement}`;

  return {
    systemPrompt: enhancedSystemPrompt,
    userPrompt: userPrompt,
    outputSchema: getRegionalOutputSchema(region),
    regionConfig: regionConfig,
    languageConfig: languageConfig,
    language: language,
    elevenLabsLanguageCode: languageConfig.elevenLabsLanguageCode,
  };
}

/**
 * Get voice preference for a region (for later ElevenLabs integration)
 * @param {string} region - Region code
 * @param {string} preference - Optional specific preference
 * @returns {Object} Voice preferences
 */
export function getRegionalVoicePreference(region = 'india', preference = 'default') {
  const config = getRegionConfig(region);
  return {
    types: config.voicePreferences.types,
    examples: config.voicePreferences.examples,
    avoidance: config.voicePreferences.avoidance,
    recommended: config.voicePreferences.examples[0], // First example as recommended
  };
}
