import { config } from '../../config/index.js';

const REPLICATE_API = 'https://api.replicate.com/v1';

export const IMAGE_POST_TYPES = {
  educational:  { label: 'Educational Post', prompt: 'Create an informative Instagram square post (1:1) that educates the audience about', style: 'clean infographic style, bold typography, high contrast' },
  offer:        { label: 'Offer / Promo',    prompt: 'Create a bold promotional Instagram post with sale/offer details for', style: 'vibrant, energetic, urgency-driven design, sale banner style' },
  highlight:    { label: 'Product Highlight',prompt: 'Create a premium product showcase Instagram post for', style: 'clean product photography style, minimal background, luxury feel' },
  awareness:    { label: 'Awareness Post',   prompt: 'Create a brand awareness Instagram post for', style: 'storytelling visual, emotional, aspirational lifestyle imagery' },
  testimonial:  { label: 'Testimonial',      prompt: 'Create a customer testimonial/review Instagram post for', style: 'trust-building design, quote card style, professional' },
  tips:         { label: 'Tips & Tricks',    prompt: 'Create a tips and tricks carousel-style Instagram post about', style: 'numbered list design, clean icons, modern flat design' },
};

export const VIDEO_STYLES_IMAGE = {
  minimal:    'minimal white background, clean typography, modern',
  bold:       'bold colors, high contrast, eye-catching',
  cinematic:  'cinematic dark background, dramatic lighting, premium',
  playful:    'colorful, fun, energetic, Gen Z aesthetic',
  corporate:  'professional, corporate clean design, trust-building',
};

/**
 * Build an image generation prompt from product + post type + brand context
 */
export function buildImagePrompt({ postType, productDescription, brandName, brandVoice, features, offer, region, industry, designStyle }) {
  const type = IMAGE_POST_TYPES[postType] || IMAGE_POST_TYPES.educational;
  const style = designStyle ? VIDEO_STYLES_IMAGE[designStyle] || designStyle : type.style;

  let prompt = `${type.prompt} "${brandName || 'the brand'}" — ${productDescription}. `;

  if (features?.length)  prompt += `Key features: ${features.join(', ')}. `;
  if (offer)             prompt += `Offer: ${offer}. `;
  if (brandVoice)        prompt += `Brand voice: ${brandVoice}. `;

  prompt += `Style: ${style}. `;
  prompt += `Instagram post, square format 1:1, high quality, professional marketing material, `;
  prompt += `suitable for ${industry || 'ecommerce'} brand in ${region || 'India'} market. `;
  prompt += `No watermarks, no text overlays unless part of the design, photorealistic or high-quality illustration.`;

  return prompt;
}

/**
 * Generate a single marketing image via Replicate flux-schnell
 */
export async function generateMarketingImage({ postType, productDescription, brandName, brandVoice, features, offer, region, industry, designStyle, customPrompt }) {
  const prompt = customPrompt || buildImagePrompt({ postType, productDescription, brandName, brandVoice, features, offer, region, industry, designStyle });

  const headers = {
    Authorization: `Bearer ${config.replicate.apiToken}`,
    'Content-Type': 'application/json',
  };

  // Create prediction using flux-schnell (no version hash needed for official models)
  const createRes = await fetch(`${REPLICATE_API}/models/black-forest-labs/flux-schnell/predictions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '1:1',
        output_format: 'webp',
        output_quality: 90,
        num_outputs: 1,
        go_fast: true,
      }
    })
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate create failed (${createRes.status}): ${err}`);
  }

  let prediction = await createRes.json();

  // Poll until complete (max 60s)
  let attempts = 0;
  while (!['succeeded', 'failed', 'canceled'].includes(prediction.status) && attempts < 30) {
    await new Promise(r => setTimeout(r, 2000));
    const pollRes = await fetch(`${REPLICATE_API}/predictions/${prediction.id}`, { headers });
    prediction = await pollRes.json();
    attempts++;
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Image generation failed: ${prediction.error || prediction.status}`);
  }

  const output = prediction.output;
  const imageUrl = Array.isArray(output) ? output[0] : output;

  if (!imageUrl) throw new Error('No image URL in Replicate response');

  return { imageUrl: String(imageUrl), prompt };
}

/**
 * Determine best posting schedule using AI logic
 * Returns array of { day, time, rationale } recommendations
 */
export function getAutoSchedule({ industry, region, postType, count = 7 }) {
  // Best posting times research data
  const schedules = {
    india: {
      educational: [
        { day: 'Monday',    time: '08:00', rationale: 'Start of week, high motivation for learning' },
        { day: 'Wednesday', time: '12:30', rationale: 'Mid-week lunch break browsing peak' },
        { day: 'Saturday',  time: '10:00', rationale: 'Weekend morning, relaxed content consumption' },
      ],
      offer: [
        { day: 'Friday',   time: '18:00', rationale: 'Pre-weekend shopping mindset' },
        { day: 'Sunday',   time: '11:00', rationale: 'Sunday browsing + planning purchases' },
        { day: 'Tuesday',  time: '20:00', rationale: 'Tuesday evening deal-hunting spike in India' },
      ],
      highlight: [
        { day: 'Thursday', time: '19:00', rationale: 'Pre-weekend discovery browsing' },
        { day: 'Monday',   time: '09:00', rationale: 'Monday motivation, product discovery' },
      ],
      awareness: [
        { day: 'Wednesday', time: '20:00', rationale: 'Mid-week peak engagement for story-driven content' },
        { day: 'Sunday',    time: '19:00', rationale: 'Sunday evening peak Instagram time in India' },
      ],
    },
    america: {
      educational: [
        { day: 'Tuesday',  time: '10:00', rationale: 'US Tuesday morning content consumption peak' },
        { day: 'Thursday', time: '14:00', rationale: 'Afternoon slump = high scroll time' },
      ],
      offer: [
        { day: 'Friday',   time: '12:00', rationale: 'TGIF mood, open to spending' },
        { day: 'Sunday',   time: '20:00', rationale: 'Sunday night deal prep for the week' },
      ],
    },
  };

  const regionSchedule = schedules[region] || schedules.india;
  const typeSchedule = regionSchedule[postType] || regionSchedule.educational || [];

  // Fill up to count with defaults if needed
  const defaults = [
    { day: 'Monday',    time: '09:00', rationale: 'Monday morning reach' },
    { day: 'Wednesday', time: '18:00', rationale: 'Mid-week evening peak' },
    { day: 'Friday',    time: '20:00', rationale: 'TGIF high engagement' },
    { day: 'Saturday',  time: '11:00', rationale: 'Weekend morning' },
    { day: 'Sunday',    time: '19:00', rationale: 'Sunday prime time' },
    { day: 'Tuesday',   time: '12:00', rationale: 'Lunch break scroll' },
    { day: 'Thursday',  time: '20:00', rationale: 'Pre-weekend discovery' },
  ];

  const combined = [...typeSchedule, ...defaults].slice(0, count);
  return combined;
}
