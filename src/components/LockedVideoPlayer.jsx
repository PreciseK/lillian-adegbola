import React, { useRef, useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiPause, FiSquare } = FiIcons;

const postToYoutube = (iframe, func, args = []) => {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args }),
    'https://www.youtube.com'
  );
};

const postToVimeo = (iframe, method, value) => {
  iframe?.contentWindow?.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    'https://player.vimeo.com'
  );
};

/**
 * Renders a video (file/YouTube/Vimeo) with no native player chrome.
 * Playback is only ever triggered by our own play/pause/stop buttons,
 * so visitors never see - or can click into - the source platform's UI.
 */
const LockedVideoPlayer = ({ video, title = 'Video player' }) => {
  const mediaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video) return null;

  const hasCustomControls = video.type === 'file' || video.provider === 'youtube' || video.provider === 'vimeo';

  const handlePlay = () => {
    if (video.type === 'file') {
      mediaRef.current?.play();
    } else if (video.provider === 'youtube') {
      postToYoutube(mediaRef.current, 'playVideo');
    } else if (video.provider === 'vimeo') {
      postToVimeo(mediaRef.current, 'play');
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (video.type === 'file') {
      mediaRef.current?.pause();
    } else if (video.provider === 'youtube') {
      postToYoutube(mediaRef.current, 'pauseVideo');
    } else if (video.provider === 'vimeo') {
      postToVimeo(mediaRef.current, 'pause');
    }
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (video.type === 'file' && mediaRef.current) {
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
    } else if (video.provider === 'youtube') {
      postToYoutube(mediaRef.current, 'seekTo', [0, true]);
      postToYoutube(mediaRef.current, 'pauseVideo');
    } else if (video.provider === 'vimeo') {
      postToVimeo(mediaRef.current, 'setCurrentTime', 0);
      postToVimeo(mediaRef.current, 'pause');
    }
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {video.type === 'file' ? (
        <video
          ref={mediaRef}
          src={video.src}
          className="w-full h-full object-cover"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      ) : (
        <iframe
          ref={mediaRef}
          src={video.src}
          title={title}
          className={`w-full h-full ${video.provider === 'generic' ? '' : 'pointer-events-none'}`}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          sandbox="allow-scripts allow-same-origin"
        />
      )}

      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
        >
          <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-gradient flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
            <SafeIcon icon={FiPlay} className="w-7 h-7 sm:w-8 sm:h-8 text-navy-900 ml-1" />
          </span>
        </button>
      )}

      {hasCustomControls && isPlaying && (
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePause}
            aria-label="Pause video"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <SafeIcon icon={FiPause} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={handleStop}
            aria-label="Stop video"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <SafeIcon icon={FiSquare} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default LockedVideoPlayer;
