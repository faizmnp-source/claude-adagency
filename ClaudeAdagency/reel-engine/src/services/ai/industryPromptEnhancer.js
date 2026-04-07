/**
 * Industry-Aware Prompt Enhancer
 * Adapts Claude prompts based on industry-specific best practices
 * Data-driven by top content creators, ad makers, and conversion metrics
 */

import { getIndustryConfig, getIndustryHashtags } from '../../config/industries.js';

/**
 * Build an industry-aware system prompt enhancement
 * Supplements the regional system prompt with industry-specific guidelines
 * @param {string} industryCode - Industry code
 * @returns {string} Industry-specific guidance
 */
export function buildIndustrySystemPromptAddition(industryCode = 'ecommerce') {
  const config = getIndustryConfig(industryCode);

  return `
**INDUSTRY CONTEXT: ${config.name.toUpperCase()}**
You are creating content for the ${config.name} industry.

**TOP CONVERTING HOOKS FOR THIS INDUSTRY:**
${config.hooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}

**PROVEN CONTENT THEMES IN ${config.name.toUpperCase()}:**
${config.contentThemes.map(t => `- ${t}`).join('\n')}

**TONE PATTERNS THAT CONVERT IN THIS INDUSTRY:**
${config.tonePatterns.map(t => `- ${t}`).join('\n')}

**HIGH-CONVERTING CTA STRATEGIES FOR ${config.name.toUpperCase()}:**
${config.ctaStrategies.map(cta => `- "${cta}"`).join('\n')}

**VISUAL GUIDANCE FOR ${config.name.toUpperCase()}:**
- Colors: ${config.visualGuidance.colors}
- Pacing: ${config.visualGuidance.pacing}
- Music: ${config.visualGuidance.music}
- Camera work: ${config.visualGuidance.cameras}

**PLATFORM INSIGHTS FOR ${config.name.toUpperCase()}:**
- Best posting time: ${config.platformInsights.bestTime}
- Optimal content length: ${config.platformInsights.contentLength}
- Key retention metric: ${config.platformInsights.retentionMetric}
`;
}

/**
 * Enhance user prompt with industry-specific instructions
 * @param {Object} params - Generation parameters
 * @param {string} params.industryCode - Industry code
 * @param {string} params.productDescription - Product/service description
 * @returns {string} Industry-specific user prompt additions
 */
export function buildIndustryUserPromptAddition({
  industryCode = 'ecommerce',
  productDescription = '',
}) {
  const config = getIndustryConfig(industryCode);

  return `
**INDUSTRY-SPECIFIC REQUIREMENTS FOR ${config.name.toUpperCase()}:**

1. **HOOK SELECTION:**
   Choose ONE of these proven hooks for ${config.name}:
   ${config.hooks.slice(0, 3).map(h => `   - ${h}`).join('\n')}

   The first 2-3 seconds MUST follow the selected hook pattern to stop scroll.

2. **CONTENT THEME:**
   Build the reel around ONE of these themes that resonate in ${config.name}:
   ${config.contentThemes.map(t => `   - ${t}`).join('\n')}

3. **TONE & LANGUAGE:**
   Adopt this communication style for ${config.name}:
   ${config.tonePatterns.map(t => `   - ${t}`).join('\n')}

4. **CTA OPTIMIZATION:**
   Use one of these CTAs that convert best in ${config.name}:
   ${config.ctaStrategies.map((cta, i) => `   ${i + 1}. ${cta}`).join('\n')}

5. **VISUAL DIRECTION FOR EDITOR:**
   - Apply ${config.visualGuidance.colors}
   - Use pacing: ${config.visualGuidance.pacing}
   - Sound: ${config.visualGuidance.music}
   - Camera style: ${config.visualGuidance.cameras}

6. **PLATFORM OPTIMIZATION:**
   - Target upload time: ${config.platformInsights.bestTime}
   - Script timing should fit: ${config.platformInsights.contentLength}
   - Design for this metric: ${config.platformInsights.retentionMetric}
`;
}

/**
 * Get recommended hashtags for the industry
 * @param {string} industryCode
 * @param {string} productType - Optional product-specific keyword
 * @returns {string[]} Recommended hashtags
 */
export function getIndustryRecommendedHashtags(industryCode = 'ecommerce', productType = '') {
  return getIndustryHashtags(industryCode, productType);
}

/**
 * Combine regional and industry prompts for maximum targeting
 * @param {Object} params - All parameters
 * @param {string} params.region - Region code
 * @param {string} params.industryCode - Industry code
 * @param {string} params.productDescription - Product description
 * @returns {Object} Combined enhancement suggestions
 */
export function combineRegionalAndIndustryGuidance({
  region = 'india',
  industryCode = 'ecommerce',
  productDescription = '',
}) {
  const industryConfig = getIndustryConfig(industryCode);

  return {
    industryName: industryConfig.name,
    industryCategory: industryConfig.category,
    systemAddition: buildIndustrySystemPromptAddition(industryCode),
    userAddition: buildIndustryUserPromptAddition({
      industryCode,
      productDescription,
    }),
    recommendedHashtags: getIndustryRecommendedHashtags(industryCode),
    platformBestTime: industryConfig.platformInsights.bestTime,
    optimalLength: industryConfig.platformInsights.contentLength,
    retentionFocus: industryConfig.platformInsights.retentionMetric,
  };
}
