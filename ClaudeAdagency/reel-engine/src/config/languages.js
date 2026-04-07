/**
 * Language Configuration System
 * Defines how to handle English, Hindi, Urdu, and Hinglish for:
 * - Claude prompt generation
 * - ElevenLabs voice selection
 * - Script and caption generation
 * - Hashtag generation
 */

export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'english',
  HINDI: 'hindi',
  URDU: 'urdu',
  HINGLISH: 'hinglish',
};

/**
 * Language configurations with ElevenLabs voice codes and prompt instructions
 */
export const LANGUAGE_CONFIG = {
  [SUPPORTED_LANGUAGES.ENGLISH]: {
    name: 'English',
    nativeName: 'English',
    code: 'en',
    elevenLabsLanguageCode: 'en',
    regionUsage: ['america', 'british', 'middle_east', 'bangladesh'],
    primaryRegion: 'america',

    // ElevenLabs voice recommendations
    voicePreferences: {
      maleVoices: [
        { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Gibbon (American male)', accent: 'american', age: 'young' },
        { voiceId: 'g5CIjZEefAQLP7XYrDXz', name: 'Adam (American male)', accent: 'american', age: 'middle-aged' },
        { voiceId: 'cgSgspJ2msm4ssxLmoR1', name: 'Joel (American male)', accent: 'american', age: 'young' },
      ],
      femaleVoices: [
        { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (American female)', accent: 'american', age: 'young' },
        { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (American female)', accent: 'american', age: 'young' },
        { voiceId: 'pNInz6obpgDQGcFmaJgB', name: 'Elli (American female)', accent: 'american', age: 'middle-aged' },
      ],
      availableAccents: ['american', 'british'],
    },

    // Claude prompt instructions
    promptInstructions: {
      language: 'Generate ALL script, dialogue, captions, and hashtags EXCLUSIVELY in English.',
      tone: 'Professional, clear, direct, confident.',
      scriptGuidance: 'Use conversational English with trending slang. Keep sentences short and punchy.',
      scriptExample: '"Guess what? This changes everything." or "Wait for it... you\'ll love this."',
    },

    // Output format rules
    outputRules: {
      scriptCharLimit: 500,
      captionCharLimit: 2200,
      hashtagLimit: 15,
      hashtagStyle: 'EnglishHashtagsWithCamelCase or lowercase',
      textOverlayLanguage: 'English',
      dialogueLanguage: 'English',
    },
  },

  [SUPPORTED_LANGUAGES.HINDI]: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    code: 'hi',
    elevenLabsLanguageCode: 'hi',
    regionUsage: ['india', 'bangladesh'],
    primaryRegion: 'india',

    voicePreferences: {
      maleVoices: [
        { voiceId: 'HezXeWk5HZnVWFePywVH', name: 'Hindi Male Voice 1', accent: 'north-indian', age: 'young' },
        { voiceId: 'wvlI7S1e3xY5Z7b2m9dK', name: 'Hindi Male Voice 2', accent: 'standard', age: 'middle-aged' },
      ],
      femaleVoices: [
        { voiceId: 'ftVJb1x3kVwSoJ6xE5tB', name: 'Hindi Female Voice 1', accent: 'north-indian', age: 'young' },
        { voiceId: '9rq3C8m1xZ5pL2vY7jKq', name: 'Hindi Female Voice 2', accent: 'standard', age: 'middle-aged' },
      ],
      availableAccents: ['north-indian', 'standard', 'colloquial'],
    },

    promptInstructions: {
      language: 'Generate ALL script, dialogue, captions, and hashtags in PURE HINDI (Devanagari script).',
      tone: 'Warm, relatable, family-oriented, emotional connection.',
      scriptGuidance: 'Use conversational Hindi with emotional depth. Include family values and aspirational themes. Short, impactful sentences.',
      scriptExample: '"अरे, ये तो बिल्कुल परफेक्ट है!" or "देखो क्या होता है अगर..."',
    },

    outputRules: {
      scriptCharLimit: 600,
      captionCharLimit: 2200,
      hashtagLimit: 15,
      hashtagStyle: 'HindiHashtagsDevanagari #हिंदी or #Hindi transliteration',
      textOverlayLanguage: 'Hindi (Devanagari)',
      dialogueLanguage: 'Hindi',
      scriptFormat: 'Devanagari script required',
    },
  },

  [SUPPORTED_LANGUAGES.URDU]: {
    name: 'Urdu',
    nativeName: 'اردو',
    code: 'ur',
    elevenLabsLanguageCode: 'ur',
    regionUsage: ['pakistan'],
    primaryRegion: 'pakistan',

    voicePreferences: {
      maleVoices: [
        { voiceId: 'pNInz6obpgDQGcFmaJgB', name: 'Urdu Male Voice 1', accent: 'pakistan', age: 'young' },
        { voiceId: 'cgSgspJ2msm4ssxLmoR1', name: 'Urdu Male Voice 2', accent: 'pakistan', age: 'middle-aged' },
      ],
      femaleVoices: [
        { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Urdu Female Voice 1', accent: 'pakistan', age: 'young' },
        { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Urdu Female Voice 2', accent: 'pakistan', age: 'middle-aged' },
      ],
      availableAccents: ['pakistan', 'formal', 'casual'],
    },

    promptInstructions: {
      language: 'Generate ALL script, dialogue, captions, and hashtags in URDU (Nastaliq/Naskh script).',
      tone: 'Respectful, family-focused, community-oriented, educational emphasis.',
      scriptGuidance: 'Use conversational Urdu with cultural sensitivity. Emphasize family honor, education, and community values. Clear articulation.',
      scriptExample: '"دیکھیں، یہ آپ کی زندگی بدل سکتا ہے!" or "کیا آپ جانتے ہیں کہ..."',
    },

    outputRules: {
      scriptCharLimit: 600,
      captionCharLimit: 2200,
      hashtagLimit: 15,
      hashtagStyle: 'UrduHashtagsNastaliq #اردو or #Urdu transliteration',
      textOverlayLanguage: 'Urdu (Nastaliq)',
      dialogueLanguage: 'Urdu',
      scriptFormat: 'Urdu script required (right-to-left)',
    },
  },

  [SUPPORTED_LANGUAGES.HINGLISH]: {
    name: 'Hinglish',
    nativeName: 'Hinglish',
    code: 'hi-en',
    elevenLabsLanguageCode: 'hi',
    regionUsage: ['india'],
    primaryRegion: 'india',

    voicePreferences: {
      maleVoices: [
        { voiceId: 'cgSgspJ2msm4ssxLmoR1', name: 'Indian English Male (Hinglish)', accent: 'indian-english', age: 'young' },
        { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Indian Accent Male', accent: 'north-indian', age: 'young' },
      ],
      femaleVoices: [
        { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Indian English Female (Hinglish)', accent: 'indian-english', age: 'young' },
        { voiceId: 'pNInz6obpgDQGcFmaJgB', name: 'Indian Accent Female', accent: 'north-indian', age: 'young' },
      ],
      availableAccents: ['indian-english', 'north-indian', 'casual-desi'],
    },

    promptInstructions: {
      language: 'Generate script and dialogue in HINGLISH (Hindi + English code-switching). Captions/hashtags can be mixed Hindi/English.',
      tone: 'Casual, friendly, relatable, young energy, trendy.',
      scriptGuidance: 'Mix Hindi and English words naturally. Use English for technical terms and Hindi for emotions. Popular on Indian social media. Include local slang, trending phrases, and Bollywood references.',
      scriptExample: '"Areee, bhai ye dekho! This is just next level." or "Kitna easy hai na! You can do it too."',
    },

    outputRules: {
      scriptCharLimit: 600,
      captionCharLimit: 2200,
      hashtagLimit: 15,
      hashtagStyle: 'Mixed #DesiHashtags and #EnglishHashtags, e.g. #DesiGlowUp #SkinCareIndia #BeautySecretRevealed',
      textOverlayLanguage: 'Hinglish (Roman or mixed script)',
      dialogueLanguage: 'Hinglish',
      codeSwitch: 'Required - mix Hindi words, English words, English sentences with Hindi phrases naturally',
      scriptFormat: 'Roman transliteration with Hindi/English mix',
    },
  },
};

/**
 * Get language config by code
 * @param {string} languageCode - Language code from SUPPORTED_LANGUAGES
 * @returns {Object} Language configuration
 */
export function getLanguageConfig(languageCode = SUPPORTED_LANGUAGES.ENGLISH) {
  const config = LANGUAGE_CONFIG[languageCode];
  if (!config) {
    throw new Error(`Unsupported language: ${languageCode}. Supported: ${Object.values(SUPPORTED_LANGUAGES).join(', ')}`);
  }
  return config;
}

/**
 * Get ElevenLabs language code for a given language
 * @param {string} languageCode - Language code
 * @returns {string} ElevenLabs language code (e.g., 'en', 'hi', 'ur')
 */
export function getElevenLabsLanguageCode(languageCode) {
  const config = getLanguageConfig(languageCode);
  return config.elevenLabsLanguageCode;
}

/**
 * Get recommended ElevenLabs voice for a language and gender
 * @param {string} languageCode - Language code
 * @param {string} gender - 'male' or 'female'
 * @returns {Object} Voice object with voiceId, name, accent, age
 */
export function getRecommendedVoice(languageCode, gender = 'female') {
  const config = getLanguageConfig(languageCode);
  const voices = gender === 'male' ? config.voicePreferences.maleVoices : config.voicePreferences.femaleVoices;
  return voices[0]; // Return first (recommended) voice
}

/**
 * Get all available voices for a language
 * @param {string} languageCode - Language code
 * @returns {Object} { maleVoices: [...], femaleVoices: [...] }
 */
export function getAvailableVoices(languageCode) {
  const config = getLanguageConfig(languageCode);
  return config.voicePreferences;
}

/**
 * Check if language is supported
 * @param {string} languageCode - Language code
 * @returns {boolean} True if supported
 */
export function isLanguageSupported(languageCode) {
  return languageCode in LANGUAGE_CONFIG;
}

/**
 * Get all supported language codes
 * @returns {string[]} Array of language codes
 */
export function getSupportedLanguages() {
  return Object.values(SUPPORTED_LANGUAGES);
}

/**
 * Get languages available for a specific region
 * @param {string} region - Region code
 * @returns {string[]} Array of language codes available in that region
 */
export function getLanguagesForRegion(region) {
  return Object.entries(LANGUAGE_CONFIG)
    .filter(([_, config]) => config.regionUsage.includes(region))
    .map(([code, _]) => code);
}

/**
 * Get language-specific prompt enhancement for Claude
 * @param {string} languageCode - Language code
 * @returns {string} Prompt text to add to Claude system/user prompt
 */
export function getLanguagePromptEnhancement(languageCode) {
  const config = getLanguageConfig(languageCode);

  return `
**LANGUAGE REQUIREMENTS: ${config.name.toUpperCase()}**

Language: ${config.name} (${config.nativeName})
Language Code: ${config.code}

**SCRIPT GENERATION RULES:**
${config.promptInstructions.language}

**TONE & STYLE:**
${config.promptInstructions.tone}

**SCRIPT GUIDANCE:**
${config.promptInstructions.scriptGuidance}

**EXAMPLE:**
${config.promptInstructions.scriptExample}

**OUTPUT FORMAT:**
- Script character limit: ${config.outputRules.scriptCharLimit} chars
- Caption character limit: ${config.outputRules.captionCharLimit} chars
- Hashtag format: ${config.outputRules.hashtagStyle}
- Text overlay language: ${config.outputRules.textOverlayLanguage}
- Dialogue language: ${config.outputRules.dialogueLanguage}
`;
}
