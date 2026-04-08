import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';

const anthropic = new Anthropic({ apiKey: config.anthropic.apiKey });

/**
 * Viral Trend Brain — Elite Intelligence Engine
 * Identifies current trending topics by region and globally,
 * then intelligently suggests how to ride them for maximum product promotion reach.
 */

// ── Deep trend intelligence database ────────────────────────────────────────
const TREND_INTELLIGENCE = {
  india: {
    evergreen: [
      'IPL cricket season content & player culture',
      'Bollywood song trends + remix culture',
      'Festival season marketing (Diwali, Holi, Eid, Navratri, Ganesh Chaturthi)',
      'Startup hustle culture & founder journeys',
      'Budget shopping hacks & value-for-money positioning',
      'Chai pe charcha slice-of-life storytelling',
      'Before/after transformation reveals (glow-ups, product demos)',
      'POV: Working from home in India realism',
      'Street food & local culture nostalgia',
      'Jugaad (Indian innovation & resourcefulness) moments',
      'Regional pride content (South India, Punjab, Maharashtra, Bengal)',
      'Middle-class India relatability (EMI culture, joint family dynamics)',
    ],
    audioTrends: [
      'Trending Bollywood item numbers repurposed for brand sync',
      'Punjabi beats for energy/lifestyle products',
      'Tamil/Telugu pop crossover viral songs',
      'Lo-fi Bollywood covers for emotional storytelling',
      'Regional folk music fusion for authenticity',
      'Original creator jingles gaining traction (desi DIY sound)',
      'Trending reels audio with 100k+ uses on Instagram',
    ],
    formats: [
      'Trending audio/song lip sync with text overlay',
      'Fast transition reels (beat-synced cuts)',
      'This vs That comparison carousels',
      'Day in my life — relatable Indian POV',
      'Expectation vs Reality comedy format',
      'Get ready with me (GRWM) — morning/event routines',
      'Pointing trend with bold text overlays',
      '"Tell me without telling me" challenge',
      'Duet/collab style reaction format',
      'Educational "Did you know?" carousel posts',
      'Skit/comedy format with product integration',
      'Satisfying unboxing + reveal moments',
    ],
    culturalCalendar: {
      Q1: ['Republic Day', 'Valentine\'s Day', 'Holi', 'Gudi Padwa', 'Ram Navami'],
      Q2: ['IPL Season', 'Mother\'s Day', 'Akshaya Tritiya', 'Eid ul-Fitr', 'Father\'s Day'],
      Q3: ['Independence Day', 'Raksha Bandhan', 'Janmashtami', 'Ganesh Chaturthi', 'Onam'],
      Q4: ['Navratri', 'Diwali', 'Bhai Dooj', 'Children\'s Day', 'New Year'],
    },
    algorithmSignals: {
      watchTimeTarget: '80%+ completion rate',
      bestFormats: 'Reels 15-30s outperform 60s by 3x',
      captionStrategy: 'First line visible without expansion — make it a hook',
      engagementPriority: 'Saves > Shares > Comments > Likes for reach multiplier',
      peakHours: '7pm-10pm IST (peak scroll), 12pm-2pm (lunch scroll)',
      bestDays: 'Tuesday, Thursday, Saturday — highest engagement rates',
    },
    genZSignals: {
      humor: 'Dry humor, self-deprecating, anti-corporate authenticity',
      aesthetics: 'Messy-aesthetic, lo-fi, candid over polished',
      values: 'Sustainability, mental health, breaking hustle culture',
      platforms: 'Instagram Reels, YouTube Shorts, Moj, Josh',
    },
    millennialSignals: {
      humor: 'Nostalgia callbacks (2000s Bollywood, Doordarshan era)',
      aesthetics: 'Premium but relatable, aspirational lifestyle',
      values: 'Family, career growth, financial security, convenience',
      platforms: 'Instagram feed + Reels, WhatsApp forward culture',
    },
  },
  global: {
    evergreen: [
      'AI tools showcase & productivity hacks',
      'Minimalism & capsule wardrobe/workspace lifestyle',
      'Mental health awareness & de-stigmatization content',
      'Sustainability & eco-conscious brand moves',
      'Tech unboxing/review style content',
      'Duet/reaction format UGC-style',
      'Educational "Did you know?" fact drops',
      'Nostalgia content (Y2K, 90s, early internet era)',
      'Satisfying process videos (ASMR adjacent)',
      'Behind the scenes raw/unfiltered content',
      'Social commentary + brand perspective takes',
    ],
    audioTrends: [
      'Phonk & drift music for energy products',
      'Trending TikTok sound migrations to Instagram',
      'Slowed + reverb aesthetic for luxury/emotional content',
      'Hyperpop bursts for Gen Z products',
      'Chill lo-fi for productivity/wellness brands',
      'Original sounds by mega-creators (use within 48h of peak)',
    ],
    formats: [
      'Trending audio reels with text overlay storytelling',
      'Text-on-screen storytelling (silent scroll-stopping)',
      'Photo dump aesthetic (curated candid)',
      'B-roll cinematic brand films (10-15 clips, no VO)',
      'Interview-style talking head with jump cuts',
      'Fast-cut montage with beat sync',
      'Greenscreen reaction/commentary format',
      'Stitch response format (community engagement driver)',
    ],
    platforms: { instagram: { peakHours: '6pm-9pm local time', bestDays: 'Mon-Wed-Fri' } },
  },
  america: {
    evergreen: ['Sports culture tie-ins', 'Seasonal holidays (Halloween, Thanksgiving, Christmas)', 'College culture', 'Road trip & outdoor lifestyle', 'Food culture & BBQ/brunch'],
    audioTrends: ['Hip-hop trending on TikTok → Instagram', 'Country pop crossover', 'Pop-punk revival', 'Indie bedroom pop'],
    platforms: { instagram: { peakHours: '6pm-9pm EST', bestDays: 'Wed-Fri-Sat' } },
  },
  middle_east: {
    evergreen: ['Ramadan & Eid content calendar', 'Luxury lifestyle aspirational', 'Arabic calligraphy + modern design', 'Family values content', 'National day patriotism'],
    audioTrends: ['Arabic pop trending sounds', 'Khaleeji music integration', 'International hits with Arabic remix'],
    platforms: { instagram: { peakHours: '8pm-11pm GST', bestDays: 'Thu-Fri-Sat' } },
  },
};

// ── Virality scoring dimensions ──────────────────────────────────────────────
const VIRALITY_DIMENSIONS = {
  hookPower: 'First 1.5 seconds: Does it stop the thumb? (Pattern interrupt, curiosity gap, shock value)',
  emotionalResonance: 'Does it trigger an emotion? (Laughter, awe, nostalgia, aspiration, empathy, anger)',
  shareability: 'Would someone screenshot/DM this? Does it say something about the sender?',
  trendAlignment: 'Is it riding a trend at peak velocity (0-48h window)? Or a fading trend?',
  savability: 'Does it contain useful info, inspiration, or reference material? (Saves = long-term reach)',
  commentBait: 'Does it invite debate, completion, or "tagging" someone?',
  productIntegration: 'Does the product feel NATIVE to the content? (Not an ad — a discovery)',
};

/**
 * Get trending topics for a region using Claude's deep trend intelligence
 */
export async function getTrendingTopics({ region = 'india', industry, count = 10 }) {
  const regionData = TREND_INTELLIGENCE[region] || TREND_INTELLIGENCE.india;
  const globalData  = TREND_INTELLIGENCE.global;
  const algSignals  = regionData.algorithmSignals || globalData.platforms?.instagram || {};
  const calendar    = regionData.culturalCalendar || {};
  const genZ        = regionData.genZSignals || {};
  const millennial  = regionData.millennialSignals || {};

  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 2500,
    messages: [{
      role: 'user',
      content: `You are the world's leading viral content intelligence analyst — the person global brands call to identify what's ACTUALLY trending RIGHT NOW, not what was trending last month.

You specialize in ${region} social media, with deep understanding of platform algorithms, creator economy dynamics, generational behavior, and cultural timing.

## ANALYSIS BRIEF

REGION: ${region}
INDUSTRY FOCUS: ${industry || 'general — cross-industry applicable'}
REQUIRED TRENDS: ${count} (prioritized by virality momentum)

## INTELLIGENCE INPUTS

Regional Evergreen Patterns:
${JSON.stringify(regionData.evergreen?.slice(0, 6) || [], null, 2)}

Regional Audio Trends:
${JSON.stringify(regionData.audioTrends?.slice(0, 5) || globalData.audioTrends?.slice(0, 5) || [], null, 2)}

Active Format Library:
${JSON.stringify(regionData.formats?.slice(0, 6) || globalData.formats?.slice(0, 6) || [], null, 2)}

Cultural Calendar Events (upcoming in all quarters):
${JSON.stringify(calendar, null, 2)}

Algorithm Signals for ${region}:
${JSON.stringify(algSignals, null, 2)}

Gen Z Behavior Signals:
${JSON.stringify(genZ, null, 2)}

Millennial Behavior Signals:
${JSON.stringify(millennial, null, 2)}

Global Trending Formats Crossing Into ${region}:
${JSON.stringify(globalData.formats?.slice(0, 4) || [], null, 2)}

## YOUR TASK

Identify the TOP ${count} trending content opportunities across these categories:
1. **Audio Trends** — Specific sounds/songs dominating Reels right now
2. **Content Formats** — Templates/structures getting algorithmic push
3. **Cultural Moments** — Calendar events or cultural conversations to hijack
4. **Platform Algorithm Opportunities** — Formats Instagram is currently rewarding
5. **Cross-Platform Migrations** — Trends from other platforms arriving on Instagram
6. **Gen Z vs Millennial Split** — Which trends skew younger vs older (critical for targeting)
7. **Industry-Specific Opportunities** — If ${industry || 'general'}, where is the gap in current content?

For each trend, score its VIRALITY using these dimensions: ${JSON.stringify(Object.keys(VIRALITY_DIMENSIONS))}

Return ONLY valid JSON — no markdown, no prose:
{
  "trends": [
    {
      "topic": "precise trend name",
      "category": "audio|format|cultural|algorithm|cross-platform|industry-specific",
      "virality": "explosive|high|medium",
      "viralityScore": 87,
      "peakWindow": "now (0-48h)|this week|this month|evergreen",
      "description": "What it is, why it's viral, the psychology behind it",
      "audienceAppeal": {
        "genZ": "How Gen Z (18-24) engages with this",
        "millennials": "How millennials (25-38) engage with this",
        "primaryDemo": "gen-z|millennial|both|older"
      },
      "audioDirection": "Specific audio/sound to use, or null if visual trend",
      "formatNotes": "How to execute this format technically",
      "exampleHook": "Exact first 3-second hook using this trend",
      "commentBaitAngle": "How to engineer comments/shares from this",
      "brandAdaptability": "high|medium|low — how easily any brand can use this",
      "longevity": "evergreen|seasonal|trending|moment",
      "competitorGap": "What most brands get WRONG when attempting this trend"
    }
  ],
  "hotFormats": ["format1", "format2", "format3", "format4", "format5"],
  "audioTrendsActive": ["sound1", "sound2", "sound3"],
  "peakPostingTime": "${regionData.algorithmSignals?.peakHours || regionData.platforms?.instagram?.peakHours || '7pm-9pm'}",
  "bestDays": "${regionData.algorithmSignals?.bestDays || regionData.platforms?.instagram?.bestDays || 'Tue-Thu-Sat'}",
  "algorithmPriorityFormats": "What Instagram's algorithm is currently rewarding most in ${region}",
  "culturalCalendarAlert": "Most important upcoming cultural moment to prepare for NOW",
  "genZVsMillennialSplit": {
    "genZLeading": ["trends skewing younger"],
    "millennialLeading": ["trends skewing older"],
    "universal": ["trends working across both"]
  },
  "regionInsight": "The single most powerful insight about what makes content go viral in ${region} RIGHT NOW — be specific, not generic"
}`,
    }],
  });

  const raw = response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Could not parse viral trends JSON from Claude response');
  }
}

/**
 * Viral Opportunity Analysis — Elite Strategy Layer
 * Takes a product + current trends, returns deep promotional angle strategies
 * with full virality scoring rubric, competitor gap analysis, and calendar placement
 */
export async function analyzeViralOpportunity({ productDescription, brandName, region, industry, trends }) {
  const trendList = trends?.map(t =>
    `• ${t.topic} [${t.category}] — Score: ${t.viralityScore || t.virality} | Peak: ${t.peakWindow || 'now'}\n  ${t.description}\n  Competitor gap: ${t.competitorGap || 'not provided'}`
  ).join('\n\n') || 'Current viral trends — use your knowledge of trending content';

  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are the Chief Viral Strategist at the world's most elite social media agency. Your job is to find the EXACT intersection where trending culture meets brand truth — creating content that feels like native viral content, not an ad.

You have made brands go from 0 to 1M followers. You understand the difference between trend-chasing and trend-owning.

## BRAND BRIEF

BRAND: ${brandName || 'Brand'}
PRODUCT/SERVICE: ${productDescription}
REGION: ${region || 'India'}
INDUSTRY: ${industry || 'ecommerce'}

## ACTIVE VIRAL TRENDS

${trendList}

## VIRALITY SCORING RUBRIC

Rate each opportunity on these dimensions (1-10 each):
- **Hook Power**: First 1.5 seconds — does it stop the scroll cold?
- **Emotional Resonance**: Does it trigger a real emotion (laugh, awe, nostalgia, aspiration)?
- **Shareability**: Would someone send this to a friend? Does it reflect their identity?
- **Trend Alignment**: Is the brand riding the trend at the RIGHT moment (not too early, not too late)?
- **Savability**: Will people save this for later reference (drives long-term algorithmic reach)?
- **Comment Engineering**: Does it create a reason to comment ("tagging someone", "debate starter", "completion prompt")?
- **Product Integration Authenticity**: Does the product appear NATURALLY — discovered, not advertised?

## YOUR ANALYSIS

Identify the 3 BEST trend-product combinations that:
1. Feel ORGANIC (not forced brand insertion)
2. Have TIMING advantage (window is open, not closed)
3. Create BRAND DIFFERENTIATION (not what competitors are doing)
4. Generate SAVES + SHARES (not just likes)

Also provide:
- Competitor gap analysis: What are competitors doing WRONG with trends that this brand can do RIGHT?
- Content calendar placement: WHEN to post this for maximum algorithmic momentum
- Risk assessment: What could go wrong + mitigation strategy

Return ONLY valid JSON:
{
  "opportunities": [
    {
      "trend": "exact trend name",
      "trendCategory": "audio|format|cultural|algorithm",
      "viralityScorecard": {
        "hookPower": 9,
        "emotionalResonance": 8,
        "shareability": 8,
        "trendAlignment": 9,
        "savability": 7,
        "commentEngineering": 8,
        "productIntegrationAuthenticity": 9,
        "totalScore": 58,
        "maxScore": 70,
        "percentile": 83
      },
      "angle": "The precise narrative angle that fuses this trend with the brand naturally",
      "hook": "Exact first 3 seconds — word for word or shot description",
      "concept": "Full reel concept — scene by scene in 3-4 sentences",
      "whyItWorks": "Deep psychological reason this specific combination will go viral",
      "productNativeIntegration": "Exactly how and when the product appears — feels discovered not advertised",
      "competitorGapExploited": "What competitors are doing wrong that this execution avoids",
      "commentBaitMechanism": "What specific thing will drive comments/shares",
      "contentCalendarPlacement": {
        "idealPostTime": "Day + time + IST/timezone",
        "windowOpen": "How many days/hours left in this trend window",
        "urgency": "post today|this week|this month|evergreen"
      },
      "risk": "Specific risk to brand reputation or execution failure",
      "mitigation": "How to mitigate that risk",
      "estimatedReach": "low (<50k)|medium (50k-500k)|high (500k-5M)|viral (5M+)"
    }
  ],
  "topPick": 0,
  "competitorLandscapeInsight": "What competitors are consistently doing wrong in ${region || 'India'} for ${industry || 'this industry'} — the gap this brand can own",
  "contentCalendarStrategy": "How to sequence all 3 opportunities across the month for compounding effect",
  "brandPositioningAdvice": "How to ride trends WITHOUT losing brand identity — the line between trend-jacking and trend-owning",
  "algorithmAdvice": "Specific Instagram algorithm behavior to exploit with these posts (timing, format, engagement mechanics)"
}`,
    }],
  });

  const raw2 = response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(raw2); } catch {
    const m = raw2.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]);
    throw new Error('Could not parse viral analysis JSON');
  }
}

/**
 * Build a viral-trend-fused content prompt — Elite Director Level
 * Combines trending format + product = world-class brief for the content generator
 * Includes scene pacing, b-roll direction, audio sync, color grading, caption psychology, comment-bait
 */
export async function buildViralFusedPrompt({ productDescription, brandName, trendTopic, trendAngle, duration, region, industry, language }) {
  const response = await anthropic.messages.create({
    model: config.anthropic.model || 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are the Creative Director of the world's most viral brand studio. You have directed campaigns for Nike, Zomato, Nykaa, and boAt. You think in frames, emotions, and psychological triggers — not in ads.

Your brief: Create an ELITE production directive that fuses a trending format with a brand so seamlessly that viewers don't realize they watched an ad until they've already saved it and tagged a friend.

## PRODUCTION BRIEF

BRAND: ${brandName}
PRODUCT: ${productDescription}
VIRAL TREND TO FUSE: ${trendTopic}
STRATEGIC ANGLE: ${trendAngle}
DURATION: ${duration}s
REGION: ${region}
LANGUAGE: ${language || 'hinglish'}
INDUSTRY: ${industry || 'ecommerce'}

## PRODUCTION FRAMEWORK

### Scene-by-Scene Pacing Architecture (for ${duration}s reel):
${duration <= 15 ? `
- 0:00-0:02: PATTERN INTERRUPT — Shock opening, no brand visible
- 0:02-0:08: TREND DELIVERY — Pure trend content, build intrigue
- 0:08-0:12: PIVOT — Natural revelation moment
- 0:12-0:15: BRAND + CTA — Product as the satisfying answer
` : duration <= 30 ? `
- 0:00-0:02: PATTERN INTERRUPT — Stop-scroll opening
- 0:02-0:07: TREND HOOK — Ride the trend format fully (don't reveal brand)
- 0:07-0:15: OPEN LOOP — Create a question or tension
- 0:15-0:22: PRODUCT REVEAL — Brand enters as the natural solution
- 0:22-0:27: PROOF/PAYOFF — Visual demonstration or result
- 0:27-0:30: SOFT CTA — Comment-bait ending, not "buy now"
` : `
- 0:00-0:02: PATTERN INTERRUPT — Frame 1 must earn the watch
- 0:02-0:10: TREND IMMERSION — Full trend format (viewers think it's organic content)
- 0:10-0:20: OPEN LOOP — Introduce curiosity gap or tension ("wait for it...")
- 0:20-0:32: BUILD — Layered information or emotional escalation
- 0:32-0:42: PRODUCT NATIVE INTEGRATION — Feels discovered, not inserted
- 0:42-0:48: CLIMAX/PAYOFF — The "wow moment" or emotional peak
- 0:48-0:50: SOFT CTA + COMMENT BAIT — End with a question or incomplete thought
`}

### B-Roll Direction Principles:
- Shot 1 must be visually UNEXPECTED (break pattern of what the algorithm has seen)
- Use Dutch angles, close macro shots, or unconventional framing for pattern interrupts
- Lifestyle B-roll should show the product IN USE, not ON DISPLAY
- Color continuity: Every shot must feel like same-day, same-world
- Motion: Camera should almost always be moving (static shots feel like ads)

### Audio Sync Architecture:
- Beat 1 of the track = Frame 1 of the best visual
- Drop/chorus = Product reveal moment (maximum energy at brand introduction)
- Use audio ducking (background track fades under VO) not audio replacement
- Silence can be a hook (2-3s of audio silence before track drops = pattern interrupt)

### Color Grading Direction:
- Warm-toned content (+10 saturation, golden hour feel) drives 23% higher save rates
- High contrast B&W for before → color reveal for after (transformation content)
- Brand color should appear naturally in at least one prop/background (not logo placement)
- For premium products: desaturate surroundings, keep product fully saturated (product POP technique)

### Caption Psychology Framework:
- Line 1: The hook (must work as standalone — this is what shows before "more")
- Line 2: The open loop (create a reason to expand caption)
- Body: Story or value — 3 max. Keep paragraphs 1-2 lines
- CTA Line: Soft, specific, curiosity-based ("Tell me in comments: have you tried this?")
- Hashtag strategy: 3 niche hashtags (10k-100k posts) + 3 medium + 3 large (don't just do large)

### Comment-Bait Engineering:
- Incomplete poll: "Which would you pick: A or B?" (forces choice comment)
- Relatability tag: "Send this to someone who needs this" (DM/share driver)
- Debate starter: Take a mild controversial stance related to the trend
- Question ending: End voiceover/caption with an unanswered question
- "Wait for it" tease: Tell them to watch till end in caption (boosts completion rate)

## YOUR DIRECTIVE

Build the complete production brief. Be SPECIFIC — not "show product" but "extreme close-up of product texture, warm golden hour light hitting the surface as hand enters frame from left at the audio beat drop."

Return ONLY valid JSON:
{
  "enrichedPrompt": "Complete production brief to pass to the AI content generator — ultra detailed, director-level specificity",
  "hook": {
    "visual": "Exact first frame description — what the camera sees in the first 1.5 seconds",
    "audio": "What the viewer hears in the first 1.5 seconds (voiceover line or sound design)",
    "psychology": "Why this specific hook works psychologically"
  },
  "trendIntegration": {
    "seconds0to5": "Exact execution of the trend format in the opening",
    "nativeFeeling": "Why this feels like organic trend content, not an ad",
    "audienceTrigger": "The specific psychological trigger this opening activates"
  },
  "scenePacingNotes": [
    {
      "timeCode": "0:00-0:03",
      "action": "What happens visually",
      "audio": "VO line or sound",
      "pacing": "fast-cut|slow-burn|freeze|zoom",
      "emotionalPeak": "low|building|climax|resolution",
      "bRollDirection": "Specific shot description for videographer/AI"
    }
  ],
  "audioSyncCues": {
    "trackMood": "Genre and mood of background track",
    "dropMoment": "At what second does the track drop — and what visual happens at that exact beat",
    "silenceUse": "Where strategic silence is used and why",
    "voiceoverPacing": "Fast/slow, cadence notes, emphasis words"
  },
  "colorGradingDirection": {
    "palette": "Specific color palette name and hex reference",
    "technique": "Specific grade technique to apply",
    "brandColorIntegration": "How brand colors appear organically in the scene"
  },
  "captionPsychology": {
    "line1Hook": "The exact first line of the caption",
    "openLoop": "The second line that forces expansion",
    "body": "3-sentence body of the caption",
    "ctaLine": "Soft, curiosity-based CTA",
    "hashtagStrategy": "3 niche | 3 medium | 3 large hashtags typed out"
  },
  "commentBaitElements": [
    "Specific element 1 that will drive comments",
    "Specific element 2 that will drive shares/DMs",
    "Specific element 3 that will drive saves"
  ],
  "transition": {
    "pivotMoment": "The exact second and visual moment where trend transitions to brand",
    "technique": "How the transition is made to feel seamless",
    "emotionalBridge": "The emotion that carries viewers from trend content into brand content"
  },
  "cta": {
    "voiceoverCta": "The spoken CTA (feels like a friend recommendation, not an ad)",
    "visualCta": "What appears on screen during CTA",
    "commentBaitCta": "The question or incomplete thought that baits comments"
  },
  "replicateVideoPrompts": [
    "Scene 1: Highly detailed Replicate/video-gen prompt",
    "Scene 2: Highly detailed Replicate/video-gen prompt",
    "Scene 3: Highly detailed Replicate/video-gen prompt"
  ],
  "estimatedViralScore": 87,
  "viralScoreBreakdown": {
    "hookPower": 9,
    "emotionalResonance": 8,
    "trendFusion": 9,
    "productAuthenticity": 8,
    "commentEngineering": 8
  }
}`,
    }],
  });

  const raw3 = response.content[0].text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(raw3); } catch {
    const m = raw3.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]);
    throw new Error('Could not parse viral fuse JSON');
  }
}
