/**
 * Instagram Post Worker — BullMQ
 * Auto-posts completed reels to Instagram via Meta Graph API
 */
import { Worker } from 'bullmq';
import { redis, QUEUES } from '../queue/index.js';
import { logger } from '../utils/logger.js';
import { postReelToInstagram } from '../services/instagram/metaApi.js';
import { getPresignedUrl } from '../services/storage/s3.js';

const worker = new Worker(
  QUEUES.INSTAGRAM_POST,
  async (job) => {
    const {
      reelId,
      s3Key,
      caption,
      hashtags,
      coverS3Key,
      accessToken,
      instagramAccountId,
    } = job.data;

    logger.info('Starting Instagram post', { reelId });

    // Get presigned URL (public for 2 hours — enough for Meta to fetch)
    const videoUrl = await getPresignedUrl(s3Key, 7200);
    const coverUrl = coverS3Key ? await getPresignedUrl(coverS3Key, 7200) : null;

    // Format caption with hashtags
    const fullCaption = `${caption}\n\n${(hashtags || []).join(' ')}`;

    const result = await postReelToInstagram({
      videoUrl,
      caption: fullCaption,
      coverUrl,
      accessToken,
      instagramAccountId,
    });

    // Store post result
    await redis.setex(
      `post:result:${reelId}`,
      86400 * 30,
      JSON.stringify({ ...result, postedAt: new Date().toISOString() })
    );

    logger.info('Instagram post complete', { reelId, mediaId: result.mediaId, permalink: result.permalink });
    return result;
  },
  {
    connection: redis,
    concurrency: 3,
    limiter: {
      max: 10,
      duration: 60000,
    },
  }
);

worker.on('completed', (job, result) => {
  logger.info(`Post job ${job.id} completed`, { mediaId: result?.mediaId });
});

worker.on('failed', (job, err) => {
  logger.error(`Post job ${job?.id} failed`, { error: err.message });
});

logger.info('Instagram post worker started');
