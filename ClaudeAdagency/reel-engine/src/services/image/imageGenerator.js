import { config } from '../../config/index.js';

const REPLICATE_API = 'https://api.replicate.com/v1';

export const IMAGE_POST_TYPES = {
  educational: { label: 'Educational Post',  prompt: 'Create an informative Instagram square post (1:1) that educates the audience about', style: 'clean infographic style, bold typography, high contrast' },
  offer:       { label: 'Offer / Promo',      prompt: 'Create a bold promotional Instagram post with sale/offer details for', style: 'vibrant, energetic, urgency-driven design, sale banner style' },
  highlight:   { label: 'Product Highlight',  prompt: 'Create a premium product showcase Instagram post for', style: 'clean product photography style, minimal background, luxury feel' },
  awareness:   { label: 'Awareness Post',     prompt: 'Create a brand awareness Instagram post for', style: 'storytelling visual, emotional, aspirational lifestyle imagery' },
  testimonial: { label: 'Testimonial',        prompt: 'Create a customer testimonial/review Instagram post for', style: 'trust-building design, quote card style, professional' },
  tips:        { label: 'Tips & Tricks',      prompt: 'Create a tips and tricks Instagram post about', style: 'numbered list design, clean icons, modern flat design' },
};

export const VIDEO_STYLES_IMAGE = {
  minimal:   'minimal white background, clean typography, modern',
  bold:      'bold colors, high contrast, eye-catching',
  cinematic: 'cinematic dark background, dramatic lighting, premium',
  playful:   'colorful, fun, energetic, Gen Z aesthetic',
  corporate: 'professional, corporate clean design, trust-building',
};

/**
 * Image generation models on Replicate
 * Listed best-to-fastest
 */
export const IMAGE_MODELS = {
  'flux-pro':    { owner: 'black-forest-labs', name: 'flux-1.1-pro',      label: '🌟 FLUX 1.1 Pro',     usdPerImage: 0.04,  quality: 'premium' },
  'flux-dev':    { owner: 'black-forest-labs', name: 'flux-dev',           label: '⚡ FLUX Dev',         usdPerImage: 0.025, quality: 'standard' },
  'flux-schnell':{ owner: 'black-forest-labs', name: 'flux-schnell',       label: '💰 FLUX Schnell',     usdPerImage: 0.003, quality: 'fast' },
  'sd35':        { owner: 'stability-ai',      name: 'stable-diffusion-3.5-large', label: '🎨 SD 3.5 Large', usdPerImage: 0.065, quality: 'premium' },
  'ideogram':    { owner: 'ideogram-ai',       name: 'ideogram-v2-turbo',  label: '✍️ Ideogram v2',      usdPerImage: 0.05,  quality: 'premium' },
};

const DEFAULT_IMAGE_MODEL = 'flux-dev'; // Good balance of quality and cost

/**
 * Build image prompt from product + post type + brand context
 */
export function buildImagePrompt({ postType, productDescription, brandName, brandVoice, features, offer, region, industry, designStyle }) {
  const type  = IMAGE_POST_TYPES[postType] || IMAGE_POST_TYPES.educational;
  const style = designStyle ? VIDEO_STYLES_IMAGE[designStyle] || designStyle : type.style;

  let prompt = `${type.prompt} "${brandName || 'the brand'}" — ${productDescription}. `;
  if (features?.length) prompt += `Key features: ${features.join(', ')}. `;
  if (offer)            prompt += `Offer: ${offer}. `;
  if (brandVoice)       prompt += `Brand voice: ${brandVoice}. `;
  prompt += `Style: ${style}. `;
  prompt += `Instagram post, square format 1:1, high quality, professional marketing material, `;
  prompt += `suitable for ${industry || 'ecommerce'} brand in ${region || 'India'} market. `;
  prompt += `No watermarks, no text overlays unless part of the design, photorealistic or high-quality illustration.`;

  return prompt;
}

/**
 * Run a Replicate prediction and poll until complete
 */
async function runImagePrediction(model, input, timeoutMs = 120_000) {
  const headers = {
    Authorization: `Bearer ${config.replicate.apiToken}`,
    'Content-Type': 'application/json',
    Prefer: 'wait=30',
  };

  const url = `${REPLICATE_API}/models/${model.owner}/${model.name}/predictions`;

  const createRes = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ input }) });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate image create failed (${createRes.status}): ${err}`);
  }

  let prediction = await createRes.json();
  const deadline = Date.now() + timeoutMs;

  while (!['succeeded', 'failed', 'canceled'].includes(prediction.status)) {
    if (Date.now() > deadline) throw new Error('Image generation timeout');
    await new Promise(r => setTimeout(r, 2000));
    const pollRes = await fetch(`${REPLICATE_API}/predictions/${prediction.id}`, { headers });
    prediction = await pollRes.json();
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Image generation failed: ${prediction.error || prediction.status}`);
  }

  return prediction;
}

/**
 * Generate a marketing image via Replicate
 *
 * @param {string} [imageModel] - Key from IMAGE_MODELS, defaults to 'flux-dev'
 */
export async function generateMarketingImage({
  postType, productDescription, brandName, brandVoice, features,
  offer, region, industry, designStyle, customPrompt,
  imageModel = DEFAULT_IMAGE_MODEL,
}) {
  const prompt = customPrompt || buildImagePrompt({
    postType, productDescription, brandName, brandVoice, features, offer, region, industry, designStyle,
  });

  const model = IMAGE_MODELS[imageModel] || IMAGE_MODELS[DEFAULT_IMAGE_MODEL];

  // Build input — different models have slightly different param names
  let input;
  if (model.owner === 'ideogram-ai') {
    input = { prompt, aspect_ratio: '1:1', style_type: 'REALISTIC', magic_prompt_option: 'AUTO' };
  } else if (model.owner === 'stability-ai') {
    input = { prompt, aspect_ratio: '1:1', output_format: 'webp', output_quality: 90 };
  } else {
    // All FLUX models share the same input schema
    input = {
      prompt,
      aspect_ratio: '1:1',
      output_format: 'webp',
      output_quality: 90,
      num_outputs: 1,
      ...(model.name === 'flux-schnell' ? { go_fast: true } : {}),
    };
  }

  const prediction = await runImagePrediction(model, input);

  const output = prediction.output;
  const imageUrl = Array.isArray(output) ? output[0] : output;
  if (!imageUrl) throw new Error('No image URL in Replicate response');

  return { imageUrl: String(imageUrl), prompt, model: `${model.owner}/${model.name}` };
}

/**
 * Determine best posting schedule using AI logic
 */
export function getAutoSchedule({ industry, region, postType, count = 7 }) {
  const schedules = {
    india: {
      educational: [
        { day: 'Monday',    time: '08:00', rationale: 'Start of week, high motivation for learning' },
        { day: 'Wednesday', time: '12:30', rationale: 'Mid-week lunch break browsing peak' },
        { day: 'Saturday',  time: '10:00', rationale: 'Weekend morning, relaxed content consumption' },
      ],
      offer: [
        { day: 'Friday',  time: '18:00', rationale: 'Pre-weekend shopping mindset' },
        { day: 'Sunday',  time: '11:00', rationale: 'Sunday browsing + planning purchases' },
        { day: 'Tuesday', time: '20:00', rationale: 'Tuesday evening deal-hunting spike in India' },
      ],
      highlight: [
        { day: 'Thursday', time: '19:00', rationale: 'Pre-weekend discovery browsing' },
        { day: 'Monday',   time: '09:00', rationale: 'Monday motivation, product discovery' },
      ],
      awareness: [
        { day: 'Wednesday', time: '20:00', rationale: 'Mid-week peak engagement' },
        { day: 'Sunday',    time: '19:00', rationale: 'Sunday evening peak Instagram time in India' },
      ],
    },
    america: {
      educational: [
        { day: 'Tuesday',  time: '10:00', rationale: 'US Tuesday morning content consumption peak' },
        { day: 'Thursday', time: '14:00', rationale: 'Afternoon slump = high scroll time' },
      ],
      offer: [
        { day: 'Friday', time: '12:00', rationale: 'TGIF mood, open to spending' },
        { day: 'Sunday', time: '20:00', rationale: 'Sunday night deal prep' },
      ],
    },
  };

  const regionSchedule = schedules[region] || schedules.india;
  const typeSchedule = regionSchedule[postType] || regionSchedule.educational || [];

  const defaults = [
    { day: 'Monday',    time: '09:00', rationale: 'Monday morning reach' },
    { day: 'Wednesday', time: '18:00', rationale: 'Mid-week evening peak' },
    { day: 'Friday',    time: '20:00', rationale: 'TGIF high engagement' },
    { day: 'Saturday',  time: '11:00', rationale: 'Weekend morning' },
    { day: 'Sunday',    time: '19:00', rationale: 'Sunday prime time' },
    { day: 'Tuesday',   time: '12:00', rationale: 'Lunch break scroll' },
    { day: 'Thursday',  time: '20:00', rationale: 'Pre-weekend discovery' },
  ];

  return [...typeSchedule, ...defaults].slice(0, count);
}
