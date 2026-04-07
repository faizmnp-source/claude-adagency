/**
 * Industry-Specific Configuration Library
 * Data-driven by top content creators and ad makers
 * Tailored for 15+ major industries with proven conversion hooks
 */

export const INDUSTRIES = {
  ECOMMERCE: 'ecommerce',
  FASHION: 'fashion',
  BEAUTY: 'beauty',
  FOOD: 'food',
  TECHNOLOGY: 'technology',
  REALESTATE: 'realestate',
  FITNESS: 'fitness',
  HEALTH: 'health',
  EDUCATION: 'education',
  SERVICES: 'services',
  FINANCE: 'finance',
  TRAVEL: 'travel',
  ENTERTAINMENT: 'entertainment',
  AUTOMOTIVE: 'automotive',
  HOMEGOODS: 'homegoods',
};

export const INDUSTRY_CONFIG = {
  [INDUSTRIES.ECOMMERCE]: {
    name: 'E-Commerce / Products',
    category: 'Retail',
    description: 'General product selling, marketplaces, online stores',

    // Proven hooks for ecommerce — based on top performing ads
    hooks: [
      'Price comparison shock - "This costs ₹X, competitors charge ₹Y"',
      'Before/after product transformation - "See what changed in 30 days"',
      'Scarcity/urgency - "Only X units left in stock"',
      'Social proof - "10K+ customers happy (show reviews)"',
      'Problem/solution - "Tired of low quality? We solved it"',
      'Trend riding - "Everyone is switching to this"',
    ],

    // Content themes that convert
    contentThemes: [
      'Unboxing and first impressions',
      'Product quality vs competitors',
      'Customer testimonials and reviews',
      'How-to guides and tutorials',
      'Limited offers and flash sales',
      'Seasonal recommendations',
      'Bundle deals',
    ],

    // Tone and language patterns
    tonePatterns: [
      'Enthusiastic about value proposition',
      'Authentic customer-focused',
      'FOMO-inducing for limited stock',
      'Educational about product benefits',
      'Trust-building with guarantees',
    ],

    // Call-to-action strategies
    ctaStrategies: [
      'Shop now (direct link)',
      'Limited time offer (urgency)',
      'Check link in bio',
      'Swipe up to buy',
      'See all colors available',
      'Claim your discount',
    ],

    // Hashtag strategy
    hashtagStrategy: {
      trending: ['#ShoppingHaul', '#OnlineShopping', '#DealsOfTheDay', '#LimitedOffer'],
      niche: ['#[ProductType]Shopping', '#BestPrice', '#AuthenticProducts'],
      reach: ['#Shopping', '#MustHave', '#NewArrival'],
    },

    // Visual aesthetic guidance
    visualGuidance: {
      colors: 'Vibrant, contrasting, make products pop',
      pacing: 'Quick cuts showing product details (2-3 seconds per angle)',
      music: 'Upbeat, energetic, trending sounds',
      cameras: 'Close-ups of details, 360 spins, lifestyle shots',
    },

    // Platform-specific insights
    platformInsights: {
      bestTime: '2pm-4pm, 8pm-10pm',
      contentLength: '15-30 seconds optimal',
      retentionMetric: 'Show product at 2-3 second mark',
    },
  },

  [INDUSTRIES.FASHION]: {
    name: 'Fashion & Apparel',
    category: 'Lifestyle',
    description: 'Clothing, accessories, designer wear, streetwear',

    hooks: [
      'Style transformation - "I looked frumpy until I tried this outfit"',
      'Trend alert - "This trend is blowing up right now"',
      'Affordable luxury - "This looks ₹10K but costs ₹1K"',
      'Fit guarantee - "Works on ALL body types (show diversity)"',
      'Celebrity inspired - "Get [celebrity] look for less"',
      'Comfort reveal - "Looks formal, feels like pajamas"',
    ],

    contentThemes: [
      'OOTD (outfit of the day) inspiration',
      'Style hacks and tricks',
      'Fabric and material showcase',
      'Size inclusivity messaging',
      'Seasonal collection launches',
      'Styling different body types',
      'Occasion-specific looks',
    ],

    tonePatterns: [
      'Fashion-forward and trendy',
      'Inclusive and body-positive',
      'Aspirational yet accessible',
      'Confident style advice',
      'Personality-driven branding',
    ],

    ctaStrategies: [
      'Shop the look (link to complete outfit)',
      'Get this style before it sells out',
      'Save for your next event',
      'Comment your size (engagement)',
      'Swipe for outfit breakdown',
    ],

    hashtagStrategy: {
      trending: ['#OOTD', '#FashionTrend', '#StyleInspo', '#FashionHaul'],
      niche: ['#[StyleType]Fashion', '#BodyPositive', '#SizeInclusive'],
      reach: ['#Fashion', '#Style', '#Outfit'],
    },

    visualGuidance: {
      colors: 'Match brand color palette, filter for cohesive aesthetic',
      pacing: 'Slow spins showing fit (3-4 sec per angle), quick transitions',
      music: 'Trendy, upbeat, music to match outfit vibe',
      cameras: 'Full body shots, detail close-ups, mirror reflections',
    },

    platformInsights: {
      bestTime: '9am-11am, 6pm-8pm',
      contentLength: '20-30 seconds',
      retentionMetric: 'Full-body reveal at 3-second mark',
    },
  },

  [INDUSTRIES.BEAUTY]: {
    name: 'Beauty & Cosmetics',
    category: 'Lifestyle',
    description: 'Makeup, skincare, haircare, grooming products',

    hooks: [
      'Transformation magic - "10-minute makeup that looks airbrushed"',
      'Skin problem solver - "This cleared my acne in 2 weeks"',
      'Budget beauty - "Looks like ₹5K makeup, costs ₹500"',
      'Trend breaking - "Controversial makeup trend that WORKS"',
      'Before/after skin - "See the glow difference"',
      'Technique reveal - "Hairdressers hate this one trick"',
    ],

    contentThemes: [
      'Tutorial and application guides',
      'Skin condition testimonials',
      'Trend recreations',
      'Product ingredient breakdowns',
      'Skin type matching',
      'Long-lasting tests',
      'Quick beauty hacks',
    ],

    tonePatterns: [
      'Expert beauty advice',
      'Empowering beauty standards',
      'Educational and informative',
      'Trend-aware but authentic',
      'Problem-solving focused',
    ],

    ctaStrategies: [
      'Shop this product (link)',
      'Try this trend (tutorial)',
      'Get the glow (aspirational)',
      'Before you buy, watch this',
      'Comment your skin type',
    ],

    hashtagStrategy: {
      trending: ['#MakeupTutorial', '#Skincare', '#BeautyHaul', '#MakeupTrend'],
      niche: ['#[SkinType]Skincare', '#MakeupFor[Feature]', '#ProductReview'],
      reach: ['#Beauty', '#Makeup', '#Skincare'],
    },

    visualGuidance: {
      colors: 'Bright lighting, true color representation, warm tones',
      pacing: 'Slow application showing technique, quick transitions between steps',
      music: 'Calming, aspirational, or upbeat trending sounds',
      cameras: 'Close-ups of face, product application details, before/after comparisons',
    },

    platformInsights: {
      bestTime: '7am-9am, 7pm-9pm',
      contentLength: '15-45 seconds',
      retentionMetric: 'Show before state at start, after state at 5 seconds',
    },
  },

  [INDUSTRIES.FOOD]: {
    name: 'Food & Beverages',
    category: 'F&B',
    description: 'Restaurants, food delivery, recipes, food products',

    hooks: [
      'Food porn - "This looks THAT good? Really?"',
      'Recipe reveal - "My grandma\'s secret recipe"',
      'Budget meal - "5-star taste, 1-star price"',
      'Mukbang appeal - "ASMR eating (satisfying sounds)"',
      'Health angle - "Tastes like junk, nutrition of health food"',
      'Local gem - "Nobody knows about this place, but it\'s ₹X"',
    ],

    contentThemes: [
      'Food preparation and cooking',
      'Restaurant reviews and tours',
      'Recipe quick-starts',
      'Food challenges',
      'Cultural food stories',
      'Healthy eating tips',
      'Limited menu items',
    ],

    tonePatterns: [
      'Food enthusiasm and excitement',
      'Storytelling about food origins',
      'Value proposition (taste vs price)',
      'FOMO for limited items',
      'Community and sharing focus',
    ],

    ctaStrategies: [
      'Reserve your spot (booking link)',
      'Order now (delivery)',
      'Try this recipe',
      'Comment your favorite',
      'Tag someone you\'d eat this with',
    ],

    hashtagStrategy: {
      trending: ['#FoodPorn', '#RecipeIdea', '#FoodReview', '#RestaurantFind'],
      niche: ['#[CuisineType]Food', '#[DietType]Recipe', '#[CityName]FoodScene'],
      reach: ['#Food', '#Foodie', '#Cooking'],
    },

    visualGuidance: {
      colors: 'Natural, appetizing colors, good lighting to show texture',
      pacing: 'Show sizzle and action, close-ups of texture, eating satisfaction',
      music: 'ASMR-friendly or upbeat, trending audio',
      cameras: 'Overhead shots, slow-mo cooking, food close-ups, happy eating faces',
    },

    platformInsights: {
      bestTime: '11am-1pm, 6pm-8pm',
      contentLength: '15-30 seconds',
      retentionMetric: 'Show finished dish/first bite at 3-second mark',
    },
  },

  [INDUSTRIES.TECHNOLOGY]: {
    name: 'Technology & Software',
    category: 'Tech',
    description: 'Apps, software, gadgets, tech products, SaaS',

    hooks: [
      'Problem solver - "This app saves 10 hours a week"',
      'Comparison battle - "Why [competitor] is losing to us"',
      'Feature wow - "You can DO THIS? I had no idea"',
      'Productivity hack - "Automating work nobody thought possible"',
      'User growth story - "Started with 0, now 1M users"',
      'Integration showcase - "Works with everything you already use"',
    ],

    contentThemes: [
      'Product feature breakdown',
      'Use case demonstrations',
      'Competitor comparisons',
      'User testimonials and ROI',
      'Integration tutorials',
      'Productivity hacks',
      'Team collaboration benefits',
    ],

    tonePatterns: [
      'Expert and authoritative',
      'Innovation-focused',
      'Solution-oriented',
      'Tech-savvy but accessible',
      'Results-driven messaging',
    ],

    ctaStrategies: [
      'Start free trial (no credit card)',
      'See the demo',
      'Join early access',
      'Learn more (whitepaper)',
      'Book a demo call',
    ],

    hashtagStrategy: {
      trending: ['#SaaS', '#TechTrend', '#Productivity', '#StartupLife'],
      niche: ['#[InddustryType]Software', '#[Feature]Solution', '#[Problem]Hack'],
      reach: ['#Technology', '#Innovation', '#Automation'],
    },

    visualGuidance: {
      colors: 'Professional, clean, brand-aligned colors',
      pacing: 'Screen recording with clear demos, highlight key features',
      music: 'Professional, upbeat, modern background music',
      cameras: 'Screen shares, talking head with product, UI walk-throughs',
    },

    platformInsights: {
      bestTime: '9am-11am, 3pm-5pm',
      contentLength: '20-45 seconds',
      retentionMetric: 'Show problem at 1 sec, solution at 3 seconds',
    },
  },

  [INDUSTRIES.FITNESS]: {
    name: 'Fitness & Wellness',
    category: 'Health',
    description: 'Gym, personal training, fitness products, wellness',

    hooks: [
      'Transformation show - "3-month body transformation"',
      'Myth buster - "Everything you know about [exercise] is wrong"',
      'Quick routine - "15-minute workout beats the gym"',
      'Nutrition secret - "The one thing trainers don\'t tell you"',
      'Motivation moment - "From couch to 10K run"',
      'Product benefit - "This equipment changed my workout"',
    ],

    contentThemes: [
      'Workout tutorials and form tips',
      'Transformation stories',
      'Nutrition and meal prep',
      'Fitness myths debunked',
      'Progress tracking',
      'Motivation and mindset',
      'Equipment reviews',
    ],

    tonePatterns: [
      'Motivational and inspiring',
      'Expert fitness knowledge',
      'Relatability and struggle acknowledgment',
      'Achievement celebration',
      'Supportive community feel',
    ],

    ctaStrategies: [
      'Join my program (membership)',
      'Download free workout plan',
      'Buy this equipment',
      'Try this routine (7 days)',
      'Comment your fitness goal',
    ],

    hashtagStrategy: {
      trending: ['#FitnessTransformation', '#WorkoutMotivation', '#FitnessTips', '#GymLife'],
      niche: ['#[GoalType]Training', '#[ExerciseType]Tutorial', '#[DietType]Meal'],
      reach: ['#Fitness', '#Health', '#Workout'],
    },

    visualGuidance: {
      colors: 'Energetic, bright, motivational color palette',
      pacing: 'Dynamic movement shots, quick transitions between exercises',
      music: 'High-energy, pumped-up, trending sounds',
      cameras: 'Full body workout footage, form detail close-ups, before/after comparisons',
    },

    platformInsights: {
      bestTime: '5am-7am, 5pm-7pm',
      contentLength: '15-30 seconds',
      retentionMetric: 'Show transformation at 2-3 second mark',
    },
  },

  [INDUSTRIES.EDUCATION]: {
    name: 'Education & Online Courses',
    category: 'Edtech',
    description: 'Online courses, tutoring, skill development, certifications',

    hooks: [
      'Career change promise - "Learn [skill], get a ₹X job"',
      'Student success story - "She went from [situation] to [achievement]"',
      'Quick learning - "Master [skill] in 7 days"',
      'Affordable education - "College costs ₹X, our course costs ₹Y"',
      'Trending skill - "Everyone needs this skill in 2026"',
      'Expert credential - "Learn from [famous person]"',
    ],

    contentThemes: [
      'Student success stories',
      'Curriculum previews',
      'Skill value proposition',
      'Career outcome data',
      'Instructor introductions',
      'Learning methodology',
      'Certification benefits',
    ],

    tonePatterns: [
      'Empowering and supportive',
      'Expert and credible',
      'Outcome-focused',
      'Community and mentorship emphasis',
      'Accessible and inclusive',
    ],

    ctaStrategies: [
      'Enroll now (limited spots)',
      'Get free first lesson',
      'Download curriculum',
      'Join our community',
      'Apply for scholarship',
    ],

    hashtagStrategy: {
      trending: ['#OnlineCourse', '#SkillDevelopment', '#CareerChange', '#Learning'],
      niche: ['#Learn[Skill]', '#[Course]Online', '#[Career]Path'],
      reach: ['#Education', '#Development', '#Upskilling'],
    },

    visualGuidance: {
      colors: 'Professional, trustworthy, clean design',
      pacing: 'Slow and informative, student testimonials interspersed',
      music: 'Inspiring, professional, motivational background',
      cameras: 'Instructor teaching, student working, success celebrations',
    },

    platformInsights: {
      bestTime: '7pm-9pm (evening learners)',
      contentLength: '20-45 seconds',
      retentionMetric: 'Show outcome/success at 5-second mark',
    },
  },

  [INDUSTRIES.REALESTATE]: {
    name: 'Real Estate',
    category: 'Property',
    description: 'Property sales, rentals, real estate services',

    hooks: [
      'Home tour wow - "₹X property walkthrough"',
      'Investment opportunity - "Property that makes ₹X monthly"',
      'Location highlight - "Best ₹X-2X neighborhood revealed"',
      'Before/after reno - "Complete home transformation"',
      'Price shock - "This mansion costs less than you think"',
      'Lifestyle promise - "Your dream home waiting for you"',
    ],

    contentThemes: [
      'Property virtual tours',
      'Neighborhood guides',
      'Investment property analysis',
      'Home renovation showcases',
      'Buyer testimonials',
      'Location comparison',
      'Amenities highlight',
    ],

    tonePatterns: [
      'Professional and trustworthy',
      'Aspirational lifestyle',
      'Investment-minded',
      'Customer success stories',
      'Community and belonging',
    ],

    ctaStrategies: [
      'Schedule site visit',
      'Download property details',
      'Book virtual tour',
      'Call us for investment advice',
      'Apply for home loan',
    ],

    hashtagStrategy: {
      trending: ['#RealEstateFind', '#PropertyTour', '#HomesForSale', '#InvestmentProperty'],
      niche: ['#[LocationName]Property', '#[PropertyType]', '#[Budget]Homes'],
      reach: ['#RealEstate', '#Property', '#Homes'],
    },

    visualGuidance: {
      colors: 'Warm, welcoming, professional color palette',
      pacing: 'Slow, immersive property tours, highlight key features',
      music: 'Sophisticated, uplifting, luxury-feeling audio',
      cameras: 'Wide property shots, detailed room tours, aerial drone footage',
    },

    platformInsights: {
      bestTime: '10am-12pm, 6pm-8pm',
      contentLength: '30-60 seconds (more time for real estate)',
      retentionMetric: 'Show property exterior at 1 sec, interior at 5 secs',
    },
  },

  [INDUSTRIES.HEALTH]: {
    name: 'Health & Medical',
    category: 'Healthcare',
    description: 'Medical services, health products, wellness clinics',

    hooks: [
      'Pain solution - "This solved my chronic [pain] problem"',
      'Doctor reveal - "Why your doctor didn\'t tell you this"',
      'Health myth - "Everything about [condition] is wrong"',
      'Prevention message - "How to avoid [common health issue]"',
      'Patient success - "Her health journey from [to] in 3 months"',
      'Treatment comparison - "This method vs traditional way"',
    ],

    contentThemes: [
      'Health education and awareness',
      'Patient testimonials',
      'Doctor/expert advice',
      'Prevention and wellness tips',
      'Treatment process explanation',
      'Health myth debunking',
      'Success stories',
    ],

    tonePatterns: [
      'Trustworthy and professional',
      'Compassionate and supportive',
      'Medically accurate',
      'Patient-empowering',
      'Hopeful and solution-focused',
    ],

    ctaStrategies: [
      'Book consultation',
      'Free health assessment',
      'Download health guide',
      'Ask doctor online',
      'Schedule appointment',
    ],

    hashtagStrategy: {
      trending: ['#HealthTips', '#WellnessJourney', '#HealthAwareness', '#MedicalAdvice'],
      niche: ['#[ConditionType]Solution', '#[Treatment]Method', '#HealthFor[Group]'],
      reach: ['#Health', '#Wellness', '#Medical'],
    },

    visualGuidance: {
      colors: 'Calming, professional, healthcare-appropriate colors',
      pacing: 'Informative and clear, patient comfort-focused',
      music: 'Calming, trustworthy, medical professional tone',
      cameras: 'Doctor/expert talking, patient testimonials, procedure explanation',
    },

    platformInsights: {
      bestTime: '9am-11am, 6pm-8pm',
      contentLength: '20-45 seconds',
      retentionMetric: 'Show patient/doctor at 1 sec, result at 10 secs',
    },
  },
};

/**
 * Get industry configuration
 * @param {string} industryCode - Industry code
 * @returns {Object} Industry configuration or ecommerce as default
 */
export function getIndustryConfig(industryCode = INDUSTRIES.ECOMMERCE) {
  const code = industryCode?.toLowerCase() || INDUSTRIES.ECOMMERCE;
  return INDUSTRY_CONFIG[code] || INDUSTRY_CONFIG[INDUSTRIES.ECOMMERCE];
}

/**
 * Get all valid industry codes
 * @returns {string[]} Array of valid industry codes
 */
export function getValidIndustries() {
  return Object.values(INDUSTRIES);
}

/**
 * Check if industry code is valid
 * @param {string} industryCode
 * @returns {boolean}
 */
export function isValidIndustry(industryCode) {
  return getValidIndustries().includes(industryCode?.toLowerCase());
}

/**
 * Get recommended hashtags for an industry
 * @param {string} industryCode
 * @param {string} niche - Optional niche keyword to customize hashtags
 * @returns {string[]} Array of recommended hashtags
 */
export function getIndustryHashtags(industryCode, niche = '') {
  const config = getIndustryConfig(industryCode);
  const hashtags = [
    ...config.hashtagStrategy.trending,
    ...config.hashtagStrategy.reach,
  ];

  if (niche) {
    hashtags.push(`#${niche}`, `#${niche}Find`, `#${niche}Tips`);
  }

  return hashtags.slice(0, 15); // Return top 15 hashtags
}
