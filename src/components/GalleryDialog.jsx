import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LockedVideoPlayer from './LockedVideoPlayer';
import { resolveVideoEmbed } from '../lib/videoEmbed';

const { FiX, FiPlay, FiChevronLeft, FiChevronRight } = FiIcons;

const GalleryDialog = ({ isOpen, onClose, items }) => {
  const [activeItem, setActiveItem] = useState(null);

  if (!isOpen) return null;

  const images = items.filter((item) => item.type === 'image');

  const openImage = (item) => setActiveItem(item);
  const closeLightbox = () => setActiveItem(null);

  const showAdjacent = (direction) => {
    if (!activeItem || activeItem.type !== 'image') return;
    const idx = images.findIndex((img) => img.id === activeItem.id);
    const nextIdx = (idx + direction + images.length) % images.length;
    setActiveItem(images[nextIdx]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full my-8 overflow-hidden relative"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-navy-800">
              Gallery
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close gallery"
            >
              <SafeIcon icon={FiX} className="text-gray-600 text-xl" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 font-montserrat py-12">
                No gallery items yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openImage(item)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    <img
                      src={item.type === 'image' ? item.image_url : (item.thumbnail_url || item.image_url)}
                      alt={item.title || 'Gallery item'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg">
                          <SafeIcon icon={FiPlay} className="w-4 h-4 text-navy-900 ml-0.5" />
                        </span>
                      </div>
                    )}
                    {item.title && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                        <p className="text-white text-xs font-montserrat truncate">{item.title}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {activeItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            aria-label="Close"
          >
            <SafeIcon icon={FiX} className="text-white text-xl" />
          </button>

          {activeItem.type === 'image' && images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); showAdjacent(-1); }}
                className="absolute left-2 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                aria-label="Previous"
              >
                <SafeIcon icon={FiChevronLeft} className="text-white text-xl" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); showAdjacent(1); }}
                className="absolute right-2 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                aria-label="Next"
              >
                <SafeIcon icon={FiChevronRight} className="text-white text-xl" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
          >
            {activeItem.type === 'image' ? (
              <img
                src={activeItem.image_url}
                alt={activeItem.title || 'Gallery item'}
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <LockedVideoPlayer
                video={resolveVideoEmbed(activeItem.video_url)}
                title={activeItem.title || 'Gallery video'}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryDialog;
