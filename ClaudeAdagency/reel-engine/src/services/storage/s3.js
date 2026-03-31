/**
 * AWS S3 Storage Service
 * Handles uploads, downloads, and presigned URLs for reel assets
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { downloadFile, tmpFile } from '../../utils/helpers.js';
import mime from 'mime-types';

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

const BUCKET = config.aws.bucket;

/**
 * Upload a local file to S3
 * @returns {string} Public HTTPS URL
 */
export async function uploadToS3(localPath, s3Key, contentType = null) {
  const fileBuffer = await fs.readFile(localPath);
  const type = contentType || mime.lookup(localPath) || 'application/octet-stream';

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: type,
      // Set cache control for final reel files
      ...(s3Key.endsWith('-final.mp4') && {
        CacheControl: 'public, max-age=31536000',
        ContentDisposition: `attachment; filename="${s3Key.split('/').pop()}"`,
      }),
    })
  );

  const url = `https://${BUCKET}.s3.${config.aws.region}.amazonaws.com/${s3Key}`;
  logger.debug('S3 upload complete', { s3Key, url });
  return url;
}

/**
 * Upload from a Buffer directly
 */
export async function uploadBufferToS3(buffer, s3Key, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `https://${BUCKET}.s3.${config.aws.region}.amazonaws.com/${s3Key}`;
}

/**
 * Download an S3 object to a local temp file
 */
export async function downloadFromS3(s3Key, localPath) {
  const response = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: s3Key })
  );
  const writeStream = createWriteStream(localPath);
  await new Promise((resolve, reject) => {
    response.Body.pipe(writeStream);
    response.Body.on('error', reject);
    writeStream.on('finish', resolve);
  });
  return localPath;
}

/**
 * Download a remote URL to a local temp file (for Replicate outputs)
 */
export async function downloadToTemp(remoteUrl, localPath) {
  return downloadFile(remoteUrl, localPath);
}

/**
 * Generate a presigned URL for secure client-side download
 * @param {string} s3Key
 * @param {number} expiresIn - Seconds until expiry (default: 1 hour)
 */
export async function getPresignedUrl(s3Key, expiresIn = 3600) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: s3Key }),
    { expiresIn }
  );
}

/**
 * Generate a presigned PUT URL for direct browser uploads
 */
export async function getPresignedUploadUrl(s3Key, contentType, expiresIn = 900) {
  return getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: BUCKET, Key: s3Key, ContentType: contentType }),
    { expiresIn }
  );
}

/**
 * Delete an S3 object
 */
export async function deleteFromS3(s3Key) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key }));
  logger.debug('S3 object deleted', { s3Key });
}

/**
 * Check if an object exists in S3
 */
export async function existsInS3(s3Key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: s3Key }));
    return true;
  } catch {
    return false;
  }
}

// S3 key helpers
export const s3Keys = {
  reelInput: (reelId, filename) => `reels/${reelId}/inputs/${filename}`,
  reelScene: (reelId, sceneNum) => `reels/${reelId}/scenes/scene-${sceneNum}.mp4`,
  reelVoice: (reelId) => `reels/${reelId}/voice/voiceover.mp3`,
  reelMusic: (reelId) => `reels/${reelId}/music/background.mp3`,
  reelFinal: (reelId) => `reels/${reelId}/final/${reelId}.mp4`,
  reelThumbnail: (reelId) => `reels/${reelId}/thumbnail.jpg`,
};
