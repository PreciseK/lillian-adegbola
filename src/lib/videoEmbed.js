const DIRECT_FILE_PATTERN = /\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i;
const YOUTUBE_PATTERN = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/i;

/**
 * Normalizes a user-supplied video URL into a renderable form:
 * - Direct video files (mp4/webm/ogg/mov) render via a native <video> tag
 * - YouTube/Vimeo share links are converted to their embeddable URL
 * - Anything else is assumed to already be an embeddable iframe URL
 */
export const resolveVideoEmbed = (url) => {
  if (!url) return null;

  if (DIRECT_FILE_PATTERN.test(url)) {
    return { type: 'file', src: url };
  }

  const youtubeMatch = url.match(YOUTUBE_PATTERN);
  if (youtubeMatch) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = url.match(VIMEO_PATTERN);
  if (vimeoMatch) {
    return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  return { type: 'iframe', src: url };
};
