/**
 * Meta Graph API — Instagram Reel auto-posting
 * Handles upload → publish flow for Instagram Reels
 */
import fetch from 'node-fetch';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { sleep } from '../../utils/helpers.js';

const GRAPH_API = 'https://graph.facebook.com/v21.0';

/**
 * Post a reel to Instagram via Meta Graph API
 * Two-step: (1) Create media container → (2) Publish container
 *
 * @param {Object} params
 * @param {string} params.videoUrl - Public S3 URL of the MP4
 * @param {string} params.caption - Instagram caption
 * @param {string} params.coverUrl - Thumbnail URL (optional)
 * @param {string} params.accessToken - User access token (override per-user)
 * @param {string} params.instagramAccountId - IG Business Account ID
 * @returns {Promise<{mediaId, permalink}>}
 */
export async function postReelToInstagram({
  videoUrl,
  caption,
  coverUrl = null,
  accessToken = config.meta.accessToken,
  instagramAccountId = config.meta.instagramAccountId,
}) {
  logger.info('Starting Instagram Reel upload', { instagramAccountId });

  // Step 1: Create media object container
  const containerBody = new URLSearchParams({
    media_type: 'REELS',
    video_url: videoUrl,
    caption,
    share_to_feed: 'true',
    access_token: accessToken,
  });
  if (coverUrl) containerBody.append('cover_url', coverUrl);

  const containerRes = await fetch(
    `${GRAPH_API}/${instagramAccountId}/media`,
    { method: 'POST', body: containerBody }
  );

  if (!containerRes.ok) {
    const err = await containerRes.json();
    throw new Error(`Meta API container create error: ${JSON.stringify(err)}`);
  }

  const { id: creationId } = await containerRes.json();
  logger.info('Media container created', { creationId });

  // Step 2: Poll until container status = FINISHED
  let status = 'IN_PROGRESS';
  const deadline = Date.now() + 300_000; // 5 min max

  while (status !== 'FINISHED' && Date.now() < deadline) {
    await sleep(10_000);
    const statusRes = await fetch(
      `${GRAPH_API}/${creationId}?fields=status_code&access_token=${accessToken}`
    );
    const statusData = await statusRes.json();
    status = statusData.status_code;

    if (status === 'ERROR') {
      throw new Error(`Media container processing failed: ${JSON.stringify(statusData)}`);
    }
    logger.debug('Container status', { creationId, status });
  }

  if (status !== 'FINISHED') throw new Error('Media container processing timeout');

  // Step 3: Publish the container
  const publishRes = await fetch(
    `${GRAPH_API}/${instagramAccountId}/media_publish`,
    {
      method: 'POST',
      body: new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken,
      }),
    }
  );

  if (!publishRes.ok) {
    const err = await publishRes.json();
    throw new Error(`Meta API publish error: ${JSON.stringify(err)}`);
  }

  const { id: mediaId } = await publishRes.json();

  // Get permalink
  const mediaRes = await fetch(
    `${GRAPH_API}/${mediaId}?fields=permalink&access_token=${accessToken}`
  );
  const mediaData = await mediaRes.json();

  logger.info('Instagram Reel published', { mediaId, permalink: mediaData.permalink });

  return {
    mediaId,
    permalink: mediaData.permalink,
    creationId,
  };
}

/**
 * Schedule a post (using delay via BullMQ instead of Meta's scheduling)
 * Meta doesn't allow scheduling via Graph API for reels — we handle it in our queue
 */
export async function getAccountInsights(accessToken, instagramAccountId) {
  const res = await fetch(
    `${GRAPH_API}/${instagramAccountId}?fields=followers_count,media_count,name&access_token=${accessToken}`
  );
  return res.json();
}

/**
 * Refresh a long-lived access token (valid 60 days, refresh every 30)
 */
export async function refreshAccessToken(longLivedToken) {
  const res = await fetch(
    `${GRAPH_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.meta.appId}&client_secret=${config.meta.appSecret}&fb_exchange_token=${longLivedToken}`
  );
  const data = await res.json();
  if (data.error) throw new Error(`Token refresh failed: ${JSON.stringify(data.error)}`);
  return { accessToken: data.access_token, expiresIn: data.expires_in };
}
