const DIRECT_FILE_PATTERN = /\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i;
const YOUTUBE_PATTERN = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/i;
const VIMEO_PATTERN = /vimeo\.com\/(?:video\/)?(\d+)/i;

/**
 * Normalizes a user-supplied video URL into a renderable form:
 * - Direct video files (mp4/webm/ogg/mov) render via a native <video> tag
 * - YouTube/Vimeo share links are converted to a locked-down embed (no
 *   native chrome, no related-video links out) driven entirely by our
 *   own play/pause/stop controls
 * - Anything else is assumed to already be an embeddable iframe URL
 */
export const resolveVideoEmbed = (url) => {
  if (!url) return null;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null;
  }

  if (DIRECT_FILE_PATTERN.test(parsed.pathname)) {
    return { type: 'file', provider: 'file', src: parsed.href };
  }

  const youtubeMatch = url.match(YOUTUBE_PATTERN);
  if (youtubeMatch) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      controls: '0',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      disablekb: '1',
      fs: '0',
      playsinline: '1',
      enablejsapi: '1',
      origin
    });
    return {
      type: 'iframe',
      provider: 'youtube',
      src: `https://www.youtube.com/embed/${youtubeMatch[1]}?${params.toString()}`
    };
  }

  const vimeoMatch = url.match(VIMEO_PATTERN);
  if (vimeoMatch) {
    const params = new URLSearchParams({
      controls: '0',
      title: '0',
      byline: '0',
      portrait: '0',
      dnt: '1'
    });
    return {
      type: 'iframe',
      provider: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?${params.toString()}`
    };
  }

  return { type: 'iframe', provider: 'generic', src: parsed.href };
};
