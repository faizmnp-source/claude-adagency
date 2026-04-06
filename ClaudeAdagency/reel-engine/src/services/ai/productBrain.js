import { redis } from '../../queue/index.js';

/**
 * Product Sub-brain: persistent product knowledge stored in Redis
 * Key: product_brain:{userId}:{brandSlug}
 */

function brandSlug(brandName) {
  return brandName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

export async function saveProductBrain(userId, brain) {
  const slug = brandSlug(brain.brandName);
  const key  = `product_brain:${userId}:${slug}`;
  await redis.set(key, JSON.stringify({ ...brain, updatedAt: new Date().toISOString() }));

  // Add to user's product list
  const listKey = `product_brains_list:${userId}`;
  const list = JSON.parse(await redis.get(listKey) || '[]');
  if (!list.includes(slug)) {
    list.push(slug);
    await redis.set(listKey, JSON.stringify(list));
  }

  return { slug, key };
}

export async function getProductBrain(userId, brandName) {
  const slug = brandSlug(brandName);
  const key  = `product_brain:${userId}:${slug}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function listProductBrains(userId) {
  const listKey = `product_brains_list:${userId}`;
  const slugs   = JSON.parse(await redis.get(listKey) || '[]');

  const brains = await Promise.all(
    slugs.map(async (slug) => {
      const data = await redis.get(`product_brain:${userId}:${slug}`);
      return data ? JSON.parse(data) : null;
    })
  );

  return brains.filter(Boolean);
}

export async function deleteProductBrain(userId, brandName) {
  const slug    = brandSlug(brandName);
  const key     = `product_brain:${userId}:${slug}`;
  const listKey = `product_brains_list:${userId}`;

  await redis.del(key);
  const list = JSON.parse(await redis.get(listKey) || '[]');
  await redis.set(listKey, JSON.stringify(list.filter(s => s !== slug)));
}

/**
 * Merge product brain context into a content generation request
 * Returns enriched params ready to pass to contentGenerator
 */
export function mergeWithProductBrain(params, brain) {
  if (!brain) return params;

  return {
    ...params,
    brandName:    brain.brandName    || params.brandName,
    brandVoice:   brain.brandVoice   || params.brandVoice,
    targetAudience: brain.targetAudience || params.targetAudience,
    industryCode: brain.industry     || params.industryCode,
    region:       brain.region       || params.region,
    language:     brain.language     || params.language,
    // Append product-specific context to the product description
    productDescription: params.productDescription
      ? `${params.productDescription}\n\nBrand Context: ${brain.description || ''}\nKey Features: ${(brain.features || []).join(', ')}\nUSP: ${brain.usp || ''}`
      : brain.description,
    // Merge hashtags
    hashtagWhitelist: [
      ...(brain.brandedHashtags || []),
      ...(params.hashtagWhitelist ? params.hashtagWhitelist.split(',') : [])
    ].join(','),
  };
}
