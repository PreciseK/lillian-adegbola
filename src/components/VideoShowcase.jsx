import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSettings } from '../hooks/useSettings';
import { resolveVideoEmbed } from '../lib/videoEmbed';

const { FiPlayCircle } = FiIcons;

const VideoShowcase = () => {
  const { settings } = useSettings(['home_video_url']);
  const video = resolveVideoEmbed(settings.home_video_url);

  if (!video) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-navy-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-gold-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 sm:w-[28rem] h-72 sm:h-[28rem] bg-gold-400/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-gold-400/10 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6"
          >
            <SafeIcon icon={FiPlayCircle} className="text-luxury-gold mr-2" />
            <span className="text-luxury-gold font-montserrat font-medium text-sm sm:text-base">
              See It In Action
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4 sm:mb-6 leading-tight">
            Watch My Story
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-montserrat max-w-3xl mx-auto leading-relaxed px-4">
            A closer look at the journey, the mission, and the transformation waiting for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 aspect-video bg-black"
        >
          {video.type === 'file' ? (
            <video
              src={video.src}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={video.src}
              title="Homepage showcase video"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
