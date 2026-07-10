import supabase from './supabase';

export const GALLERY_BUCKET = 'gallery-images';
export const GALLERY_QUOTA_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

/**
 * @returns {Promise<number>} bytes currently used in the gallery-images bucket
 */
export const getGalleryStorageUsageBytes = async () => {
  const { data, error } = await supabase.rpc('gallery_storage_usage_bytes');
  if (error) throw error;
  return Number(data) || 0;
};

export const formatBytes = (bytes) => {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
};

/**
 * Uploads a file to the gallery-images bucket, first re-checking usage
 * against the 2GB quota so uploads that would exceed it are rejected
 * before any bytes are sent.
 * @param {File} file
 * @returns {Promise<{ publicUrl: string, path: string }>}
 */
export const uploadGalleryImage = async (file) => {
  const usedBytes = await getGalleryStorageUsageBytes();
  if (usedBytes + file.size > GALLERY_QUOTA_BYTES) {
    const usedStr = formatBytes(usedBytes);
    const quotaStr = formatBytes(GALLERY_QUOTA_BYTES);
    throw new Error(
      `Adding this image would exceed the gallery storage limit — used ${usedStr} of ${quotaStr}.`
    );
  }

  const fileExt = file.name.split('.').pop();
  const path = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return { publicUrl, path };
};

/**
 * Removes a gallery image file from storage given its public URL,
 * so deleting an item actually frees up quota.
 * @param {string} publicUrl
 */
export const deleteGalleryImage = async (publicUrl) => {
  if (!publicUrl) return;
  const marker = `/object/public/${GALLERY_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  if (!path) return;

  const { error } = await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  if (error) throw error;
};
