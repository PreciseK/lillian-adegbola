import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import GalleryDialog from './GalleryDialog';

const { FiImage, FiPlay, FiChevronLeft, FiChevronRight, FiGrid } = FiIcons;

const FEATURED_FALLBACK_LIMIT = 8;

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items_la2024')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const published = data || [];
      setItems(published);

      const featured = published.filter((item) => item.is_featured);
      setCarouselItems(featured.length > 0 ? featured : published.slice(0, FEATURED_FALLBACK_LIMIT));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setItems([]);
      setCarouselItems([]);
      setLoading(false);
    }
  };

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-gallery-card]');
    const cardWidth = card ? card.offsetWidth + 16 : 320;
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-luxury-pearl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center bg-gold-400/10 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
              <SafeIcon icon={FiImage} className="text-navy-800 mr-2" />
              <span className="text-navy-800 font-montserrat font-medium text-sm sm:text-base">
                Gallery
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-navy-800 mb-4 sm:mb-6 leading-tight">
              Moments Worth Sharing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 font-montserrat max-w-3xl mx-auto leading-relaxed">
              A look inside the workshops, sessions, and milestones behind the transformations.
            </p>
          </motion.div>

          <div className="relative">
            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {carouselItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-gallery-card
                  onClick={() => setShowDialog(true)}
                  className="relative flex-shrink-0 w-64 sm:w-80 aspect-[4/5] rounded-2xl overflow-hidden snap-center shadow-lg group focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <img
                    src={item.type === 'image' ? item.image_url : (item.thumbnail_url || item.image_url)}
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <SafeIcon icon={FiPlay} className="w-6 h-6 text-navy-900 ml-0.5" />
                      </span>
                    </div>
                  )}
                  {item.title && (
                    <div className="absolute inset-x-0 bottom-0 px-4 py-3">
                      <p className="text-white font-montserrat font-medium text-sm sm:text-base truncate">
                        {item.title}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {carouselItems.length > 1 && (
              <>
                <button
                  onClick={() => scrollByCard(-1)}
                  className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous"
                >
                  <SafeIcon icon={FiChevronLeft} className="text-navy-800 text-lg" />
                </button>
                <button
                  onClick={() => scrollByCard(1)}
                  className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Next"
                >
                  <SafeIcon icon={FiChevronRight} className="text-navy-800 text-lg" />
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-8 sm:mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDialog(true)}
              className="inline-flex items-center gap-2 bg-navy-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-navy-900 transition-all duration-300"
            >
              <SafeIcon icon={FiGrid} />
              <span>View All</span>
            </motion.button>
          </div>
        </div>
      </section>

      <GalleryDialog isOpen={showDialog} onClose={() => setShowDialog(false)} items={items} />
    </>
  );
};

export default Gallery;
