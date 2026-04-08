/**
 * AutoScheduler — AI-Powered Monthly Content Engine
 * Generates a full month's 16-piece content plan for a brand using Claude.
 * Produces a coherent narrative arc across 4 weeks with optimal IST scheduling.
 */
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

// ── Content mix: 16 posts per month ──────────────────────────────────────────
const CONTENT_MIX = {
  viral_reel:        { count: 2, description: 'Trend-jacked reel for maximum reach — platform-native, high-velocity, algorithm-surfed' },
  top_reel:          { count: 4, description: 'High-production brand storytelling reel — cinematic quality, brand identity, emotional depth' },
  educational_reel:  { count: 2, description: 'Value-first educational reel — authority building, save-worthy, positions brand as expert' },
  product_photo:     { count: 4, description: 'Feature showcase + lifestyle product photography — strong visual identity, conversion-focused' },
  educational_image: { count: 4, description: 'Brand/industry educational carousel or infographic — authority + awareness, high-save content' },
};

// ── 4-Week Narrative Framework ────────────────────────────────────────────────
const MONTHLY_NARRATIVE = {
  week1: {
    theme: 'AWARENESS — Brand Introduction + Viral Hook',
    goal: 'Introduce the brand story, create first impressions, and launch one viral-reach play',
    contentPillars: ['brand', 'viral'],
    emotionalArc: 'Curiosity → Intrigue',
    cta: 'Follow for more / Save this',
  },
  week2: {
    theme: 'CONSIDERATION — Product Deep-Dive + Educational Value',
    goal: 'Demonstrate product value, educate the audience on the problem being solved, build trust',
    contentPillars: ['product', 'educational'],
    emotionalArc: 'Trust → Desire',
    cta: 'Save this / Tag someone who needs this',
  },
  week3: {
    theme: 'DESIRE — Social Proof + Viral Amplification',
    goal: 'Showcase results/testimonials, launch second viral piece, deepen emotional connection',
    contentPillars: ['viral', 'brand', 'product'],
    emotionalArc: 'Desire → FOMO → Validation',
    cta: 'Comment your experience / Share this',
  },
  week4: {
    theme: 'ACTION — Offer + Educational Wrap-Up',
    goal: 'Convert interested audience, provide final value-add education, close the monthly arc with a CTA',
    contentPillars: ['product', 'educational', 'brand'],
    emotionalArc: 'Urgency → Decision → Community',
    cta: 'Link in bio / DM us / Limited time',
  },
};

// ── Optimal IST Posting Windows ───────────────────────────────────────────────
const POSTING_WINDOWS = {
  viral_reel:        { weekday: { hour: 19, minute: 0 },  weekend: { hour: 11, minute: 0 } },
  top_reel:          { weekday: { hour: 20, minute: 0 },  weekend: { hour: 12, minute: 0 } },
  educational_reel:  { weekday: { hour: 18, minute: 0 },  weekend: { hour: 10, minute: 0 } },
  product_photo:     { weekday: { hour: 9,  minute: 0 },  weekend: { hour: 11, minute: 30 } },
  educational_image: { weekday: { hour: 19, minute: 30 }, weekend: { hour: 10, minute: 30 } },
};

// Days of week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const REEL_BEST_DAYS    = [2, 4, 6]; // Tue, Thu, Sat
const IMAGE_BEST_DAYS   = [1, 3, 5, 2, 4]; // Mon, Wed, Fri (primary), Tue, Thu (secondary)

/**
 * Build a schedule of 16 dates/times across the current month (IST, UTC+5:30)
 * @param {Date} startDate - Month start (defaults to today)
 * @returns {Array<{type, scheduledAt}>} ordered scheduling slots
 */
function buildMonthlyScheduleSlots(startDate) {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const now = startDate || new Date();

  // Get first day of next month's plan (start of month or today, whichever is later)
  const planStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Content order following the 4-week narrative arc
  // Week 1: brand intro + viral hook
  // Week 2: product + educational
  // Week 3: viral + brand/social proof
  // Week 4: product/offer + educational wrap
  const contentOrder = [
    // Week 1 (days 1-7)
    { type: 'top_reel',          week: 1 },
    { type: 'educational_image', week: 1 },
    { type: 'viral_reel',        week: 1 },
    { type: 'product_photo',     week: 1 },
    // Week 2 (days 8-14)
    { type: 'educational_reel',  week: 2 },
    { type: 'product_photo',     week: 2 },
    { type: 'educational_image', week: 2 },
    { type: 'top_reel',          week: 2 },
    // Week 3 (days 15-21)
    { type: 'top_reel',          week: 3 },
    { type: 'educational_image', week: 3 },
    { type: 'viral_reel',        week: 3 },
    { type: 'product_photo',     week: 3 },
    // Week 4 (days 22-28+)
    { type: 'top_reel',          week: 4 },
    { type: 'educational_reel',  week: 4 },
    { type: 'educational_image', week: 4 },
    { type: 'product_photo',     week: 4 },
  ];

  const slots = [];
  let weekOffset = 0;
  let weekPostCount = [0, 0, 0, 0];

  contentOrder.forEach((item, idx) => {
    const weekNum = item.week - 1; // 0-indexed
    const weekStart = weekNum * 7;
    const postNumInWeek = weekPostCount[weekNum];
    weekPostCount[weekNum]++;

    // Spread within week — use days 1, 3, 5, 7 of each week (Mon, Wed, Fri, Sun pattern)
    const weekDayOffsets = [1, 3, 5, 7];
    const dayOffset = weekStart + (weekDayOffsets[postNumInWeek] || (postNumInWeek * 2 + 1));

    const postDate = new Date(planStart);
    postDate.setDate(planStart.getDate() + dayOffset);

    // Determine posting window based on content type
    const isWeekend = [0, 6].includes(postDate.getDay());
    const window = POSTING_WINDOWS[item.type];
    const timeSlot = isWeekend ? window.weekend : window.weekday;

    postDate.setHours(timeSlot.hour - 5, timeSlot.minute - 30, 0, 0); // Convert IST to UTC
    // Adjust for the IST offset (we want to store as IST string)
    const istDate = new Date(postDate.getTime() + IST_OFFSET_MS);

    // Format as IST ISO string
    const scheduledAt = istDate.toISOString().replace('Z', '+05:30');

    slots.push({
      id: `post_${String(idx + 1).padStart(2, '0')}`,
      type: item.type,
      week: item.week,
      scheduledAt,
      weekTheme: MONTHLY_NARRATIVE[`week${item.week}`].theme,
    });
  });

  return slots;
}

/**
 * Parse Claude's JSON response defensively
 */
function parseClaudeJson(text) {
  const raw = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error('JSON parse failed — Claude returned non-JSON content');
  }
}

/**
 * Generate the full content strategy for all 16 posts using Claude
 * This is the master planning call — Claude decides WHAT to post for each slot
 */
async function generateContentStrategy({
  brandName,
  productDescription,
  industry,
  region,
  language,
  brandVoice,
  targetAudience,
  brandColors,
  competitors,
  scheduleSlots,
}) {
  logger.info('AutoScheduler: Generating monthly content strategy', { brandName, industry });

  const competitorList = competitors?.length
    ? `Competitors to DIFFERENTIATE from: ${competitors.join(', ')}`
    : 'No competitor data provided — infer from industry norms';

  const slotsForClaude = scheduleSlots.map(s => ({
    id: s.id,
    type: s.type,
    week: s.week,
    weekTheme: s.weekTheme,
    scheduledAt: s.scheduledAt,
    contentMixDescription: CONTENT_MIX[s.type].description,
  }));

  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `You are the world's most sought-after Social Media Content Strategist, hired by the best DTC brands in India and globally. You build monthly content plans that create compounding brand awareness, not random posts.

Your content calendars have a NARRATIVE ARC — each post advances a story. Audiences feel like they're watching a brand grow in real time.

## CLIENT BRIEF

Brand: ${brandName}
Product/Service: ${productDescription}
Industry: ${industry}
Region: ${region}
Language: ${language || 'hinglish'}
Target Audience: ${targetAudience}
Brand Voice: ${brandVoice || 'Not specified — infer from industry and product'}
Brand Colors: ${brandColors || 'Not specified — recommend appropriate palette'}
${competitorList}

## MONTHLY NARRATIVE FRAMEWORK (4-Week Arc)

${JSON.stringify(MONTHLY_NARRATIVE, null, 2)}

## YOUR 16 SCHEDULED CONTENT SLOTS

${JSON.stringify(slotsForClaude, null, 2)}

## CONTENT MIX DEFINITIONS

${JSON.stringify(CONTENT_MIX, null, 2)}

## YOUR TASK

For EACH of the 16 posts, generate:
1. What to post (topic, angle, hook — specific to THIS brand and THIS week's theme)
2. Full script/voiceover (for reels)
3. Instagram caption with CTA
4. Hashtags (mix of niche + medium + large — 15 total)
5. Image prompt (for image posts — detailed, specific, brand-aligned)
6. Reel video prompt (for reels — scene-by-scene, director-level detail)
7. How this post fits into the monthly narrative arc

CRITICAL RULES:
- Week 1 posts = AWARENESS: introduce brand story, light on selling, heavy on brand personality
- Week 2 posts = CONSIDERATION: educate, demonstrate value, show the product solving a real problem
- Week 3 posts = DESIRE: social proof, viral reach, community building, deeper product desire
- Week 4 posts = ACTION: clear offers, urgency, conversion-focused CTAs, wrap up the monthly story
- No two posts should feel like they came from different brands
- Viral reels must be trend-jacked — they should feel like organic trending content that happens to feature the brand
- Educational content must give REAL value — not surface-level tips
- Product photos must tell a story — not just product on white background
- The narrative arc must feel like a brand UNFOLDING, not random posts

Return ONLY valid JSON — an array of 16 content objects:
{
  "contentPlan": [
    {
      "id": "post_01",
      "type": "viral_reel",
      "scheduledAt": "ISO datetime string",
      "week": 1,
      "title": "Clear, specific title of what this post is about",
      "angle": "The unique narrative angle or hook concept",
      "contentPillar": "viral|brand|educational|product|awareness",
      "urgency": "evergreen|seasonal|trending",
      "brandNarrative": "How this post advances the monthly brand story arc (1-2 sentences)",
      "script": "Full voiceover/dialogue script for this reel — natural, conversational, in ${language || 'hinglish'} tone",
      "caption": "Instagram caption (150-200 words) — hook first line, story body, CTA. Emojis used strategically.",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12", "#tag13", "#tag14", "#tag15"],
      "imagePrompt": "Detailed AI image generation prompt for image posts — lighting, composition, mood, brand alignment. Use null for reels.",
      "reelPrompt": "Detailed AI video generation prompt for reel scenes — cinematic direction, shot types, pacing, atmosphere. Use null for image posts.",
      "sceneBreakdown": [
        {
          "sceneNumber": 1,
          "timeCode": "0:00-0:03",
          "visual": "What the camera sees",
          "dialogue": "What is said",
          "textOverlay": "On-screen text or null",
          "emotion": "Emotional register of this scene",
          "replicatePrompt": "Scene-specific video gen prompt"
        }
      ],
      "platformNotes": {
        "bestPostTime": "Confirmation of optimal time",
        "retentionStrategy": "How this post keeps viewers watching to the end",
        "algorithmSignal": "Primary algorithm signal this post is engineered to trigger (saves|shares|comments|completion)"
      }
    }
  ],
  "monthlyNarrativeSummary": "2-3 sentence summary of the overall monthly brand story this content plan tells",
  "brandVoiceDirection": "Extracted or inferred brand voice guide for content consistency",
  "recommendedHashtagSets": {
    "branded": ["#BrandName specific tags"],
    "industry": ["#industry tags"],
    "campaign": ["#campaign or month-specific tags"]
  }
}`,
    }],
  });

  return parseClaudeJson(response.content[0].text);
}

/**
 * generateMonthlyContentPlan — Main Export
 * Generates a full month's 16-piece content plan for a brand
 *
 * @param {Object} params
 * @param {string} params.userId - User ID for plan storage
 * @param {string} params.brandName - Brand name
 * @param {string} params.productDescription - Product/service description
 * @param {string} params.industry - Industry category
 * @param {string} params.region - Target region (india|global|america|middle_east)
 * @param {string} params.language - Content language (hinglish|hindi|english|urdu)
 * @param {string} params.brandVoice - Brand personality/voice description
 * @param {string} params.targetAudience - Target audience description
 * @param {string} params.brandColors - Brand color palette description
 * @param {string[]} params.competitors - Competitor brand names to differentiate from
 * @returns {Promise<{planId, contentPlan, metadata}>}
 */
export async function generateMonthlyContentPlan({
  userId,
  brandName,
  productDescription,
  industry,
  region = 'india',
  language = 'hinglish',
  brandVoice,
  targetAudience,
  brandColors,
  competitors = [],
}) {
  logger.info('AutoScheduler: Starting monthly content plan generation', {
    userId,
    brandName,
    industry,
    region,
  });

  // 1. Build the 16-slot schedule with optimal IST timing
  const scheduleSlots = buildMonthlyScheduleSlots(new Date());

  // 2. Generate all content via Claude (single optimized call)
  const strategyResult = await generateContentStrategy({
    brandName,
    productDescription,
    industry,
    region,
    language,
    brandVoice,
    targetAudience,
    brandColors,
    competitors,
    scheduleSlots,
  });

  // 3. Merge schedule slots with generated content
  const contentPlan = (strategyResult.contentPlan || []).map((post, idx) => {
    const slot = scheduleSlots[idx] || {};
    return {
      id: slot.id || post.id || `post_${String(idx + 1).padStart(2, '0')}`,
      type: slot.type || post.type,
      scheduledAt: slot.scheduledAt || post.scheduledAt,
      week: slot.week || post.week || Math.ceil((idx + 1) / 4),
      status: 'scheduled',
      title: post.title || '',
      angle: post.angle || '',
      contentPillar: post.contentPillar || 'brand',
      urgency: post.urgency || 'evergreen',
      brandNarrative: post.brandNarrative || '',
      script: post.script || null,
      caption: post.caption || '',
      hashtags: post.hashtags || [],
      imagePrompt: post.imagePrompt || null,
      reelPrompt: post.reelPrompt || null,
      sceneBreakdown: post.sceneBreakdown || [],
      platformNotes: post.platformNotes || {},
    };
  });

  // 4. Ensure we have exactly 16 items (pad with nulls if Claude returned fewer)
  while (contentPlan.length < 16 && contentPlan.length < scheduleSlots.length) {
    const slot = scheduleSlots[contentPlan.length];
    contentPlan.push({
      id: slot.id,
      type: slot.type,
      scheduledAt: slot.scheduledAt,
      week: slot.week,
      status: 'pending',
      title: 'Content pending generation',
      angle: '',
      contentPillar: 'brand',
      urgency: 'evergreen',
      brandNarrative: '',
      script: null,
      caption: '',
      hashtags: [],
      imagePrompt: null,
      reelPrompt: null,
      sceneBreakdown: [],
      platformNotes: {},
    });
  }

  const planId = `plan_${userId}_${Date.now()}`;

  logger.info('AutoScheduler: Monthly content plan generated', {
    userId,
    planId,
    postCount: contentPlan.length,
    brandName,
  });

  return {
    planId,
    contentPlan,
    metadata: {
      generatedAt: new Date().toISOString(),
      brandName,
      industry,
      region,
      language,
      targetAudience,
      monthlyNarrativeSummary: strategyResult.monthlyNarrativeSummary || '',
      brandVoiceDirection: strategyResult.brandVoiceDirection || '',
      recommendedHashtagSets: strategyResult.recommendedHashtagSets || {},
      contentMix: Object.entries(CONTENT_MIX).map(([type, info]) => ({
        type,
        count: info.count,
        description: info.description,
      })),
      weeklyThemes: Object.entries(MONTHLY_NARRATIVE).map(([week, data]) => ({
        week,
        theme: data.theme,
        goal: data.goal,
      })),
    },
  };
}
