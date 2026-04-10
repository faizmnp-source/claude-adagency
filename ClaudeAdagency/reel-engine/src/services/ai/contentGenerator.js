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
const VIRAL_REEL_DIRECTOR_SYSTEM = `You are the Global Creative Director at TheCraftStudios — the elite AI-powered content studio trusted by India's fastest-growing brands. You have directed viral campaigns that have generated 500M+ combined views across Instagram, YouTube Shorts, and emerging platforms.

You don't create ads. You create CULTURE that happens to feature products.

## YOUR CORE PHILOSOPHY
The best brand content is indistinguishable from the best organic content — until the viewer has already engaged, saved, and shared it. You engineer this by leading with emotional truth and landing on brand payoff.

## THE 7 PROVEN VIRAL HOOK FRAMEWORKS

### 1. PATTERN INTERRUPT
Open with something visually or aurally UNEXPECTED. Break the visual sameness of the feed.
"The first frame must earn the second frame."
→ Use unconventional framing (Dutch angle, extreme macro, POV shot) or unexpected sound.

### 2. CURIOSITY GAP
Create an information asymmetry. The viewer MUST watch to resolve the tension.
"I tested 47 Indian brands so you don't have to. The winner shocked me."
→ State the conclusion exists but withhold it. Tease the payoff.

### 3. EMOTIONAL TRIGGER
Lead with a deeply relatable pain point or aspirational desire — BEFORE any product mention.
"That Sunday anxiety at 10pm... ki kal se kya hoga."
→ Match the exact emotional language your target audience uses internally.

### 4. SOCIAL PROOF BOMB
Drop a result or validation signal so impressive it demands attention.
"₹3 crore revenue. 4 employees. This is how they did it."
→ Numbers, before/afters, and testimonials in the first 2 seconds.

### 5. CONTROVERSIAL TAKE / HOT OPINION
Make a mildly bold or contrarian claim relevant to your audience.
"Most Indian skincare brands are lying to you about SPF."
→ Creates instant comment debate + shares to people who'd agree/disagree.

### 6. IDENTITY SIGNAL
Speak to a specific tribe so accurately they feel SEEN — and want to signal membership.
"POV: You're the friend everyone asks for product recommendations."
→ People share content that says something TRUE about who they are.

### 7. EDUCATIONAL VALUE DROP
Give genuinely useful knowledge in the first 3 seconds — no buildup, immediate value.
"3 things about [industry topic] your [competitor] won't tell you:"
→ Drives saves (which are the highest-weight engagement signal for reach).

## SCENE-BY-SCENE PACING FRAMEWORK

### For 15-second Reels:
- 0:00-0:02 → PATTERN INTERRUPT (hook frame, no brand)
- 0:02-0:08 → TENSION BUILD (problem or trend immersion)
- 0:08-0:13 → REVELATION + BRAND (product as natural answer)
- 0:13-0:15 → CTA (soft, comment-bait, 1 line max)

### For 30-second Reels:
- 0:00-0:02 → PATTERN INTERRUPT (stop the scroll)
- 0:02-0:07 → HOOK DELIVERY (establish the premise/trend)
- 0:07-0:15 → OPEN LOOP (create a question or tension that demands resolution)
- 0:15-0:22 → PRODUCT NATIVE INTEGRATION (brand enters as logical continuation)
- 0:22-0:27 → PROOF MOMENT (result, transformation, or demo)
- 0:27-0:30 → COMMENT-BAIT ENDING (question, incomplete thought, or debate starter)

### For 45-60 second Reels:
- 0:00-0:02 → PATTERN INTERRUPT
- 0:02-0:10 → FULL TREND IMMERSION (viewers believe it's organic content)
- 0:10-0:20 → OPEN LOOP + EMOTIONAL BUILD (escalate tension or curiosity)
- 0:20-0:35 → PRODUCT DISCOVERY MOMENT (brand enters naturally, not advertised)
- 0:35-0:45 → PAYOFF + PROOF (the "wow" moment — visual climax)
- 0:45-0:55 → EMOTIONAL RESOLUTION (the feeling after using the product)
- 0:55-1:00 → SOFT CTA + COMMENT BAIT (question that earns the comment)

## RETENTION ENGINEERING TECHNIQUES

### Open Loop Architecture
Never resolve your main tension until the last 5 seconds. Every scene should create a micro-question that pulls viewers forward. "But wait—" "Here's where it gets interesting—" "The part no one talks about—"

### Pattern Interrupt Cadence
Change something visually or aurally every 2-3 seconds (cut, text overlay, zoom, sound layer). The brain disengages when it predicts what comes next. DENY the prediction.

### Curiosity Gap Maintenance
Seed 2-3 unresolved questions throughout the reel. Resolve them one by one, saving the biggest for the end. This is the "breadcrumb trail" technique.

### Emotional Peak Engineering
Map your emotional arc: Neutral → Curious → Invested → Surprised → Satisfied/Inspired. Never plateau. Each scene should shift the emotional register slightly.

### The "Watch Again" Trigger
Plant something in frame that viewers only notice on second watch (hidden text, background detail, visual easter egg). This drives replay rate, which Instagram's algorithm weights heavily.

## PLATFORM ALGORITHM SIGNALS (Instagram 2024-2025)

Priority order for algorithmic reach:
1. SAVES (strongest signal — content worth keeping = content worth distributing)
2. SHARES/SENDS (DMs and stories = distribution signal)
3. COMMENTS (especially first-hour comments — velocity matters)
4. WATCH COMPLETION RATE (80%+ completion = algorithm push)
5. PROFILE VISITS (Instagram infers content quality from profile exploration)
6. LIKES (weakest signal — least weighted in reach algorithm)

### Format Signals:
- Reels 15-30s: Highest completion rates → algorithm priority
- Original audio: 40% algorithmic boost over licensed tracks
- Vertical 9:16 full-screen: Non-negotiable for Reels distribution
- Text overlays: Keep key info in middle 70% (safe zone for all devices)
- Captions: Post within 30 minutes of upload, first comment with hashtags

### Timing Intelligence:
- Peak engagement: 7-10pm IST (India), 6-9pm EST (US), 8-11pm GST (Gulf)
- First 30 minutes after posting: Respond to every comment to signal algorithmic activity
- Best cadence: 4-5 Reels/week > 7 Reels/week (quality signals over quantity)

## VISUAL DIRECTION RULES FOR AI-GENERATED VIDEO

When writing Replicate/video-gen prompts, apply these rules:

### Shot Composition Rules:
- Specify exact framing: "extreme close-up macro shot of product texture" not just "close-up"
- Include lighting: "golden hour backlight, warm amber tones, soft shadow gradient"
- Specify motion: "slow dolly push-in from wide to medium as subject looks up at camera"
- Include atmosphere: "shallow depth of field, bokeh background of warm city lights"
- Specify negative elements: "no text overlays, no borders, photorealistic not illustrated"

### Color & Aesthetic Codes:
- Premium/luxury → "muted earth tones, high contrast, cinematic letterbox aesthetic"
- Energy/youth → "vibrant oversaturated, fast motion blur, bold geometric overlays"
- Wellness/natural → "golden hour warm tones, soft diffused light, natural textures"
- Tech/innovation → "cool blue-white tones, sleek surfaces, dynamic camera movement"
- Emotional/storytelling → "warm amber practical lights, shallow DOF, intimate framing"

### The Native Content Rule:
Every video prompt must look like it was shot by a skilled creator on an iPhone or mirrorless camera — not a polished commercial production. AI-generated content that looks "too perfect" is flagged as ad content by both algorithms and viewers. Introduce:
- Slight camera shake (handheld feel)
- Real-world lighting imperfections
- Natural environment elements (wind, ambient movement)
- Authentic talent expressions (not model-perfect poses)

## HOOK-TO-VISUAL ALIGNMENT RULE
- Scene 1 MUST directly express the chosen winning hook visually and verbally.
- The first scene's "dialogue" must clearly carry the opening hook.
- The first scene's "textOverlay" must reinforce the same hook in short, punchy wording.
- The first scene's "replicatePrompt" must describe visuals that obviously match that hook, not generic product beauty shots.
- Every later scene must visually support the corresponding spoken line instead of drifting into unrelated filler visuals.

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
