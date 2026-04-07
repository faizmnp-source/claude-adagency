/**
 * Regional Configuration System
 * Defines regional characteristics for content generation, voice selection, and market strategy
 * Regions: India, America, Pakistan, Bangladesh, Middle East, British
 */

export const REGIONS = {
  INDIA: 'india',
  AMERICA: 'america',
  PAKISTAN: 'pakistan',
  BANGLADESH: 'bangladesh',
  MIDDLE_EAST: 'middle_east',
  BRITISH: 'british',
};

export const REGION_CONFIG = {
  [REGIONS.INDIA]: {
    name: 'India',
    code: 'IN',
    languages: ['Hindi', 'English', 'Hinglish'],
    primaryLanguage: 'Hinglish',
    timezone: 'Asia/Kolkata',

    // Cultural characteristics for prompt engineering
    cultural: {
      values: [
        'Family-oriented messaging',
        'Value for money emphasis',
        'Festival and celebration themes',
        'Aspirational lifestyle content',
        'Trust and authenticity',
      ],
      toneModifiers: [
        'Warm and relatable',
        'Conversational Hindi/Hinglish mix',
        'Humor with local references',
        'Emotional connection',
      ],
      contentThemes: [
        'Diwali, Holi, local festivals',
        'Joint family stories',
        'Success stories and inspiration',
        'Affordable luxury positioning',
        'Local celebrities and influences',
      ],
      hashtags: [
        '#IndianBrand',
        '#MadeInIndia',
        '#DesiStyle',
        '#IndianEntrepreneur',
        '#DesiLife',
        '#IndiaKeBrand',
      ],
    },

    // Market insights
    market: {
      demographics: 'Urban millennials and Gen Z, ages 16-35, tier 1-2 cities',
      buyingPower: 'Price-conscious, value-seeking, influenced by peer reviews',
      contentPreference: 'Short-form reels (15-30s), trending sounds, relatable humor',
      peakPostingTimes: ['7pm-9pm IST (weekdays)', '12pm-2pm IST (weekends)'],
      averageWatchDuration: '8-12 seconds',
      engagementDrivers: [
        'Personal testimonials',
        'Friend recommendations',
        'Limited time offers',
        'Trending challenges',
        'Celebrity endorsements',
      ],
    },

    // Voice/accent preferences for ElevenLabs
    voicePreferences: {
      types: ['Indian-English', 'Hindi accent', 'Hinglish (mixed)', 'Young female', 'Young male'],
      examples: [
        'Young Indian female with warm tone',
        'Indian English speaker with clear articulation',
        'Hinglish speaker with casual, friendly vibe',
      ],
      avoidance: ['Robotic', 'Overly formal', 'British accent', 'American accent'],
    },

    // Regional script/dialogue customization
    scriptCustomization: {
      openingHooks: [
        'Start with relatable problem (family, budget, dreams)',
        'Use local slang or Hinglish phrases',
        'Reference popular Bollywood moments',
        'Ask a question that resonates locally',
      ],
      closingCtaTypes: [
        'Join thousands of happy Indians',
        'Get your piece of success',
        'Limited offer for India',
        'Comment your experience',
      ],
    },
  },

  [REGIONS.AMERICA]: {
    name: 'America',
    code: 'US',
    languages: ['English'],
    primaryLanguage: 'English',
    timezone: 'America/New_York',

    cultural: {
      values: [
        'Independence and self-reliance',
        'Innovation and disruption',
        'Personal achievement',
        'Diversity and inclusion',
        'Sustainability and ethics',
      ],
      toneModifiers: [
        'Direct and confident',
        'Casual and friendly',
        'Motivational and aspirational',
        'Trendy and pop-culture aware',
      ],
      contentThemes: [
        'Self-improvement and wellness',
        'Startup and entrepreneurship',
        'Latest tech and gadgets',
        'Fitness and lifestyle',
        'Social causes and activism',
      ],
      hashtags: [
        '#AmericanMade',
        '#SupportSmallBusiness',
        '#GameChanger',
        '#Disruptor',
        '#FitnessGoals',
      ],
    },

    market: {
      demographics: 'Diverse, ages 18-45, all income levels, coast-focused',
      buyingPower: 'Quality-conscious, willing to spend for value and brand story',
      contentPreference: 'Fast-paced, trendy sounds, authentic creator content',
      peakPostingTimes: ['6pm-9pm EST (weekdays)', '11am-2pm EST (weekends)'],
      averageWatchDuration: '10-15 seconds',
      engagementDrivers: [
        'Creator authenticity',
        'Trending audio',
        'Inspiration and motivation',
        'Humor and relatability',
        'Sustainability message',
      ],
    },

    voicePreferences: {
      types: ['American-English', 'Neutral accent', 'Gen Z voice', 'Influencer tone'],
      examples: [
        'Young American female with casual confidence',
        'American English speaker with Gen Z flair',
        'Energetic and enthusiastic voice',
      ],
      avoidance: ['Over-the-top', 'Robotic', 'Accented', 'Monotone'],
    },

    scriptCustomization: {
      openingHooks: [
        'Start with surprising stat or claim',
        'Use trending audio sync',
        'Ask relatable millennial question',
        'Show dramatic transformation',
      ],
      closingCtaTypes: [
        'Tap the link in bio',
        'Comment what you think',
        'Save this for later',
        'Subscribe for more',
      ],
    },
  },

  [REGIONS.PAKISTAN]: {
    name: 'Pakistan',
    code: 'PK',
    languages: ['Urdu', 'English', 'Punjabi'],
    primaryLanguage: 'English',
    timezone: 'Asia/Karachi',

    cultural: {
      values: [
        'Family honor and respect',
        'Community and belonging',
        'Education and improvement',
        'Loyalty and tradition',
        'Islamic values (cultural sensitivity)',
      ],
      toneModifiers: [
        'Respectful and warm',
        'Community-oriented',
        'Inspirational for family',
        'Mix of modern and traditional',
      ],
      contentThemes: [
        'Family success stories',
        'Educational progression',
        'Eid and festival moments',
        'Business and entrepreneurship',
        'Youth empowerment',
      ],
      hashtags: [
        '#ProudPakistani',
        '#MakePakistanProud',
        '#DesiPride',
        '#YouthOfPakistan',
        '#PakistanZindabad',
      ],
    },

    market: {
      demographics: 'Young population, ages 16-40, urban centers (Karachi, Lahore, Islamabad)',
      buyingPower: 'Value-conscious, influenced by family opinions, brand reputation matters',
      contentPreference: 'Short reels with positive messaging, trending sounds, family-friendly',
      peakPostingTimes: ['8pm-10pm PKT (weekdays)', '2pm-4pm PKT (weekends)'],
      averageWatchDuration: '8-12 seconds',
      engagementDrivers: [
        'Family testimonials',
        'Community trust',
        'Authentic local stories',
        'Positive social impact',
        'Celebrity endorsements',
      ],
    },

    voicePreferences: {
      types: ['Pakistani-English', 'Urdu accent', 'Respectful tone', 'Young female', 'Young male'],
      examples: [
        'Young Pakistani English speaker with clarity',
        'Urdu-influenced English, warm and inviting',
        'Community-focused voice',
      ],
      avoidance: ['Disrespectful', 'Too casual', 'Robotic', 'Inappropriate for elders'],
    },

    scriptCustomization: {
      openingHooks: [
        'Address family-oriented benefit',
        'Highlight community aspect',
        'Use respectful, warm greeting',
        'Show progression and improvement',
      ],
      closingCtaTypes: [
        'Share with your family',
        'Become part of our community',
        'Limited offer for Pakistan',
        'Take the first step today',
      ],
    },
  },

  [REGIONS.BANGLADESH]: {
    name: 'Bangladesh',
    code: 'BD',
    languages: ['Bengali', 'English'],
    primaryLanguage: 'Bengali',
    timezone: 'Asia/Dhaka',

    cultural: {
      values: [
        'Family unity and support',
        'Education and progress',
        'Hard work and perseverance',
        'Community development',
        'National pride',
      ],
      toneModifiers: [
        'Warm and encouraging',
        'Conversational Bengali-English mix',
        'Hopeful and inspiring',
        'Relatable to struggles and victories',
      ],
      contentThemes: [
        'Women empowerment stories',
        'Small business success',
        'Educational achievement',
        'Pahela Boishakh and festivals',
        'Community development projects',
      ],
      hashtags: [
        '#BanglaDeshi',
        '#BangladeshiBrand',
        '#ProudBangali',
        '#WomenOfBangladesh',
        '#BangladeshGenius',
      ],
    },

    market: {
      demographics: 'Young, tech-savvy population, ages 15-35, Dhaka and urban centers',
      buyingPower: 'Emerging middle class, quality-conscious, influenced by peer validation',
      contentPreference: 'Bengali content preferred, trending sounds, inspirational stories',
      peakPostingTimes: ['8pm-10pm BDT (weekdays)', '1pm-3pm BDT (weekends)'],
      averageWatchDuration: '8-12 seconds',
      engagementDrivers: [
        'Local success stories',
        'Women entrepreneur features',
        'Educational content',
        'Affordable options',
        'Community participation',
      ],
    },

    voicePreferences: {
      types: ['Bengali speaker', 'Dhaka accent', 'Young female', 'Young male', 'Energetic'],
      examples: [
        'Young Bengali woman with encouraging tone',
        'Clear Bengali-English speaker',
        'Inspiring and motivational voice',
      ],
      avoidance: ['Robotic', 'Overly formal', 'Too fast', 'Difficult pronunciation'],
    },

    scriptCustomization: {
      openingHooks: [
        'Start with Bengali-language hook',
        'Address local economic opportunity',
        'Reference Bengali culture or values',
        'Show real-life relevance',
      ],
      closingCtaTypes: [
        'আপনার স্বপ্ন পূরণ করুন (Fulfill your dreams)',
        'আজই যোগ দিন (Join today)',
        'সীমিত সময়ের অফার (Limited time offer)',
        'আপনার অভিজ্ঞতা শেয়ার করুন (Share your experience)',
      ],
    },
  },

  [REGIONS.MIDDLE_EAST]: {
    name: 'Middle East',
    code: 'ME',
    languages: ['Arabic', 'English'],
    primaryLanguage: 'English',
    timezone: 'Asia/Dubai',

    cultural: {
      values: [
        'Luxury and premium positioning',
        'Family-first messaging',
        'Respect for tradition',
        'Islamic principles (cultural awareness)',
        'Status and success',
      ],
      toneModifiers: [
        'Sophisticated and elegant',
        'Respectful and formal',
        'Aspirational luxury',
        'Community-focused',
      ],
      contentThemes: [
        'Luxury lifestyle',
        'Family gathering moments',
        'Business success stories',
        'Ramadan and Eid specials',
        'Premium quality assurance',
      ],
      hashtags: [
        '#LuxuryLifestyle',
        '#DubaiStyle',
        '#PremiumQuality',
        '#MiddleEastProud',
        '#IslamicValues',
      ],
    },

    market: {
      demographics: 'Affluent, ages 20-50, UAE, Saudi Arabia, Kuwait focus',
      buyingPower: 'High, luxury-conscious, value premium quality and exclusivity',
      contentPreference: 'High-production reels, aspirational content, family-friendly',
      peakPostingTimes: ['9pm-11pm GST (weekdays)', '3pm-5pm GST (weekends)'],
      averageWatchDuration: '12-18 seconds',
      engagementDrivers: [
        'Exclusivity and scarcity',
        'Premium positioning',
        'Family benefit messaging',
        'Celebrity endorsements',
        'Luxury lifestyle narrative',
      ],
    },

    voicePreferences: {
      types: ['Sophisticated accent', 'Formal English', 'Premium tone', 'Mature voices'],
      examples: [
        'Elegant female voice with Middle Eastern accent',
        'Sophisticated English speaker',
        'Premium, exclusive tone',
      ],
      avoidance: ['Too casual', 'Cheap-sounding', 'Robotic', 'Disrespectful tone'],
    },

    scriptCustomization: {
      openingHooks: [
        'Highlight exclusivity and premium nature',
        'Appeal to status and success',
        'Reference luxury lifestyle',
        'Show family benefit',
      ],
      closingCtaTypes: [
        'Exclusive offer for our community',
        'Limited luxury edition',
        'Join the elite members',
        'Experience premium living',
      ],
    },
  },

  [REGIONS.BRITISH]: {
    name: 'British',
    code: 'UK',
    languages: ['English'],
    primaryLanguage: 'English',
    timezone: 'Europe/London',

    cultural: {
      values: [
        'Quality and reliability',
        'Understated elegance',
        'Heritage and tradition',
        'Environmental consciousness',
        'Authenticity and integrity',
      ],
      toneModifiers: [
        'British wit and humor',
        'Sophisticated and measured',
        'Thoughtful and considered',
        'Self-deprecating charm',
      ],
      contentThemes: [
        'Quality British craftsmanship',
        'Heritage stories',
        'Sustainability focus',
        'Local community support',
        'Understated luxury',
      ],
      hashtags: [
        '#BritishBrand',
        '#MadeInBritain',
        '#BritishQuality',
        '#Sustainability',
        '#BritishHeritage',
      ],
    },

    market: {
      demographics: 'Educated, conscious consumers, ages 18-55, all social classes',
      buyingPower: 'Quality-focused, willing to pay for authenticity and sustainability',
      contentPreference: 'Witty, authentic content, trending sounds, clever storytelling',
      peakPostingTimes: ['7pm-9pm GMT (weekdays)', '12pm-2pm GMT (weekends)'],
      averageWatchDuration: '10-15 seconds',
      engagementDrivers: [
        'Authentic stories',
        'Sustainability message',
        'British humor',
        'Quality assurance',
        'Community impact',
      ],
    },

    voicePreferences: {
      types: ['British accent', 'RP accent', 'Young British', 'Warm but measured'],
      examples: [
        'Young British woman with natural accent',
        'Clear British English speaker',
        'Witty and charming tone',
      ],
      avoidance: ['Over-the-top', 'American accent', 'Robotic', 'Posh-only tone'],
    },

    scriptCustomization: {
      openingHooks: [
        'Start with British wit or clever observation',
        'Reference quality or heritage',
        'Use understated humor',
        'Appeal to values and conscience',
      ],
      closingCtaTypes: [
        'Join thousands of happy customers',
        'Discover British excellence',
        'Support sustainable choice',
        'Learn more about our craft',
      ],
    },
  },
};

/**
 * Get region configuration by region code
 * @param {string} regionCode - Region code (e.g., 'india', 'america')
 * @returns {Object} Region configuration or India as default
 */
export function getRegionConfig(regionCode = REGIONS.INDIA) {
  const code = regionCode?.toLowerCase() || REGIONS.INDIA;
  return REGION_CONFIG[code] || REGION_CONFIG[REGIONS.INDIA];
}

/**
 * Get all region codes for validation
 * @returns {string[]} Array of valid region codes
 */
export function getValidRegions() {
  return Object.values(REGIONS);
}

/**
 * Check if region code is valid
 * @param {string} regionCode
 * @returns {boolean}
 */
export function isValidRegion(regionCode) {
  return getValidRegions().includes(regionCode?.toLowerCase());
}
