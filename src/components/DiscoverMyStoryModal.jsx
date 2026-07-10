import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSettings } from '../hooks/useSettings';
import { sanitizeHtml } from '../lib/sanitizeHtml';

const { FiX, FiBookOpen } = FiIcons;

const DiscoverMyStoryModal = ({ isOpen, onClose }) => {
  const { settings } = useSettings(['discover_story_content', 'discover_story_images']);

  const storyContent = settings.discover_story_content || '';
  const storyImages = Array.isArray(settings.discover_story_images)
    ? settings.discover_story_images.filter(Boolean).slice(0, 3)
    : [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <SafeIcon icon={FiX} className="text-white text-xl" />
          </button>

          <div className="bg-navy-800 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <SafeIcon icon={FiBookOpen} className="text-navy-900 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-playfair font-bold">My Story</h2>
                <p className="text-gray-300 font-montserrat text-sm sm:text-base">The journey behind the mission</p>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${storyImages.length > 0 ? 'md:grid-cols-5' : ''} gap-0`}>
            {storyImages.length > 0 && (
              <div className="md:col-span-2 p-6 sm:p-8 space-y-3">
                <img
                  src={storyImages[0]}
                  alt="My story"
                  className="w-full h-48 sm:h-64 md:h-56 lg:h-64 object-cover rounded-2xl shadow-lg"
                />
                {(storyImages[1] || storyImages[2]) && (
                  <div className="grid grid-cols-2 gap-3">
                    {storyImages[1] && (
                      <img
                        src={storyImages[1]}
                        alt="My story"
                        className="w-full h-24 sm:h-32 object-cover rounded-xl shadow-md"
                      />
                    )}
                    {storyImages[2] && (
                      <img
                        src={storyImages[2]}
                        alt="My story"
                        className="w-full h-24 sm:h-32 object-cover rounded-xl shadow-md"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            <div className={`${storyImages.length > 0 ? 'md:col-span-3' : ''} p-6 sm:p-8`}>
              {storyContent ? (
                <div
                  className="space-y-4 text-gray-700 font-montserrat leading-relaxed rich-text-container"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(storyContent) }}
                />
              ) : (
                <p className="text-gray-500 font-montserrat italic">
                  This story is being written. Please check back soon.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DiscoverMyStoryModal;
