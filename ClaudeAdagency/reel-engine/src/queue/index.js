import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

// Shared Redis connection for BullMQ
// BullMQ requires a separate connection with maxRetriesPerRequest: null
// We use a dedicated bullmq connection for queues, and a separate one for direct commands
export const redis = new IORedis(config.redis.url, {
  maxRetriesPerRequest: null,  // Required by BullMQ — keeps queue workers alive
  enableReadyCheck: false,
  lazyConnect: true,
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 500, 5000), // max 5s between retries
});

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error('Redis error', { err: err.message }));

// ── Queue names ──────────────────────────────────────
export const QUEUES = {
  REEL_GENERATION: 'reel-generation',
  VIDEO_PROCESSING: 'video-processing',
  INSTAGRAM_POST: 'instagram-post',
};

// ── Queue instances (used by API to add jobs) ────────
export const reelQueue = new Queue(QUEUES.REEL_GENERATION, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});

export const videoProcessingQueue = new Queue(QUEUES.VIDEO_PROCESSING, {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 10000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 100 },
  },
});

export const instagramPostQueue = new Queue(QUEUES.INSTAGRAM_POST, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 30000 },
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 100 },
  },
});

// ── Queue events (for real-time progress) ───────────
export const reelQueueEvents = new QueueEvents(QUEUES.REEL_GENERATION, { connection: redis });

// Helper: add a reel generation job
export async function addReelJob(userId, reelId, jobData) {
  return reelQueue.add(
    `reel:${reelId}`,
    { userId, reelId, ...jobData },
    { jobId: reelId, priority: 1 }
  );
}

// Helper: add instagram post job (can be scheduled)
export async function addInstagramPostJob(reelId, postData, delay = 0) {
  return instagramPostQueue.add(
    `post:${reelId}`,
    { reelId, ...postData },
    { delay }
  );
}

// Helper: get job progress
export async function getJobProgress(reelId) {
  const job = await reelQueue.getJob(reelId);
  if (!job) return null;
  return {
    id: job.id,
    name: job.name,
    progress: job.progress,
    state: await job.getState(),
    data: job.data,
    returnvalue: job.returnvalue,
    failedReason: job.failedReason,
    timestamp: job.timestamp,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
  };
}
