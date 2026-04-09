import 'dotenv/config';

function cleanEnv(value) {
  return typeof value === 'string' ? value.replace(/['"]/g, '').trim() : value;
}

export const config = {
  port: parseInt(process.env.PORT || '4000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-opus-4-5',
  },

  replicate: {
    apiToken: process.env.REPLICATE_API_TOKEN,
    // Quality tier: 'budget' ($0.09/sec, 480p) | 'default' ($0.28/6s, 720p) | 'premium' ($0.35/5s, 1080p)
    videoQuality: process.env.REPLICATE_VIDEO_QUALITY || 'default',
  },

  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM',
    model: 'eleven_multilingual_v2',
  },

  suno: {
    apiKey: process.env.SUNO_API_KEY,
    fallback: process.env.MUSIC_FALLBACK || 'pixabay',
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'ap-south-1',
    bucket: process.env.S3_BUCKET || 'thecraftstudios-reels',
  },

  meta: {
    appId: process.env.META_APP_ID,
    appSecret: process.env.META_APP_SECRET,
    instagramAccountId: process.env.META_INSTAGRAM_ACCOUNT_ID,
    accessToken: process.env.META_ACCESS_TOKEN,
  },

  razorpay: {
    keyId: cleanEnv(process.env.RAZORPAY_KEY_ID),
    keySecret: cleanEnv(process.env.RAZORPAY_KEY_SECRET),
    webhookSecret: cleanEnv(process.env.RAZORPAY_WEBHOOK_SECRET),
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-prod',
    jwtExpiry: process.env.JWT_EXPIRY || '7d',
  },

  credits: {
    perSecond: parseInt(process.env.CREDITS_PER_SECOND || '2'),
    freeRegenerations: parseInt(process.env.FREE_REGENERATIONS || '3'),
    newUserBonus: parseInt(process.env.NEW_USER_BONUS_CREDITS || '30'),
  },

  ffmpeg: {
    path: process.env.FFMPEG_PATH || null,
    probePath: process.env.FFPROBE_PATH || null,
  },
};

export function validateConfig() {
  const required = [
    'ANTHROPIC_API_KEY',
    'JWT_SECRET',
    'REDIS_URL',
  ];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
