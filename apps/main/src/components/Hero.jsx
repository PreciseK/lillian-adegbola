import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import BookingModal from './BookingModal';
import TransformationModal from './TransformationModal';
import supabase from '../lib/supabase';

const { FiArrowRight, FiStar, FiAward, FiTrendingUp } = FiIcons;

const Hero = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTransformationModal, setShowTransformationModal] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState('https://data.scriptsedgeonline.com/wp-content/uploads/2025/08/z-9c5N1_400x400.jpg');
  const [siteSettings, setSiteSettings] = useState({
    site_title: 'Lillian Adegbola',
    site_tagline: 'The Queen of Clarity & Purpose'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('🔄 Fetching hero settings...');
      const { data, error } = await supabase
        .from('site_settings_la2024')
        .select('key, value')
        .in('key', ['portrait_url', 'hero_portrait_url', 'site_title', 'site_tagline']);

      if (error) {
        console.error('❌ Supabase error:', error);
        setIsLoading(false);
        return;
      }

      console.log('✅ Fetched settings:', data);
      if (data && data.length > 0) {
        const settings = {};
        data.forEach(setting => {
          try {
            settings[setting.key] = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
          } catch {
            settings[setting.key] = setting.value;
          }
        });

        // Update portrait URL from admin settings
        if (settings.portrait_url || settings.hero_portrait_url) {
          setPortraitUrl(settings.portrait_url || settings.hero_portrait_url);
          console.log('🖼️ Updated portrait URL:', settings.portrait_url || settings.hero_portrait_url);
        }

        // Update site settings
        setSiteSettings(prev => ({ ...prev, ...settings }));
        console.log('✅ Hero settings updated successfully');
      } else {
        console.log('⚠️ No settings found, using defaults');
      }
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleTransformationClick = () => {
    setShowTransformationModal(true);
  };

  const handleBookingFromModal = () => {
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <section id="home" className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-luxury-gradient opacity-95"></div>
        <div className="relative z-10 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto"></div>
          <p className="mt-4 font-montserrat">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="home" className="min-h-screen relative overflow-hidden">
        {/* Background with luxury gradient */}
        <div className="absolute inset-0 bg-luxury-gradient opacity-95"></div>

        {/* Decorative elements - Hidden on mobile for cleaner look */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-gold-400/20 rounded-full blur-3xl hidden md:block"></div>
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold-400/10 rounded-full blur-3xl hidden md:block"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">

            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-white space-y-6 sm:space-y-8 order-2 lg:order-1"
            >
              <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center bg-gold-400/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full"
                >
                  <SafeIcon icon={FiStar} className="text-gold-400 mr-2 text-sm sm:text-base" />
                  <span className="text-gold-400 font-montserrat font-medium text-sm sm:text-base">
                    {siteSettings.site_tagline || 'The Queen of Clarity & Purpose'}
                  </span>
                </motion.div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold leading-tight">
                  Transforming{' '}
                  <span className="text-gold-400 font-dancing block font-bold mt-1 sm:mt-2">
                    Leaders
                  </span>
                  <span className="text-white">Empowering </span>
                  <span className="text-gold-400 font-dancing block font-bold mt-1 sm:mt-2">
                    Lives
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-montserrat leading-relaxed max-w-2xl"
              >
                Unlock your <span className="text-gold-400 font-semibold">fearless potential</span> and achieve{' '}
                <span className="text-gold-400 font-semibold">sustainable positive transformation</span>.
                I help ambitious leaders and visionaries become the best authentic version of themselves.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTransformationClick}
                  className="bg-gold-gradient text-navy-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-bold text-base sm:text-lg shadow-2xl hover:shadow-gold-400/25 transition-all duration-300 flex items-center justify-center group w-full sm:w-auto"
                >
                  Start Your Transformation
                  <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick('#services')}
                  className="border-2 border-gold-400 text-gold-400 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-bold text-base sm:text-lg hover:bg-gold-400 hover:text-navy-900 transition-all duration-300 w-full sm:w-auto"
                >
                  Explore Services
                </motion.button>
              </motion.div>

              {/* Stats - Responsive grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8">
                {[
                  { icon: FiAward, number: "500+", label: "Leaders Transformed" },
                  { icon: FiTrendingUp, number: "95%", label: "Success Rate" },
                  { icon: FiStar, number: "15+", label: "Years Experience" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="text-center"
                  >
                    <SafeIcon icon={stat.icon} className="text-gold-400 text-xl sm:text-2xl mx-auto mb-2" />
                    <div className="text-lg sm:text-xl lg:text-2xl font-playfair font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 font-montserrat font-bold  text-xs sm:text-sm leading-tight">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Professional Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Professional Portrait */}
                  <div className="w-full max-w-md mx-auto lg:max-w-none h-64 sm:h-80 md:h-96 lg:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-gold-400/30">
                    <img
                      src={portraitUrl}
                      alt="Lillian Adegbola - Professional Portrait"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        console.log('❌ Image failed to load, using fallback');
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjhGNkYwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjMwMCIgcj0iODAiIGZpbGw9IiNGOEUyMzEiLz4KPHRleHQgeD0iMjAwIiB5PSIzMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMzJCNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkxBPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>

                  {/* Floating elements - Responsive positioning */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-gold-gradient p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl"
                  >
                    <SafeIcon icon={FiAward} className="text-navy-900 text-lg sm:text-xl" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-white/90 backdrop-blur-sm p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl"
                  >
                    <SafeIcon icon={FiStar} className="text-gold-600 text-lg sm:text-xl" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Background decoration - Hidden on mobile */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/10 to-transparent rounded-2xl lg:rounded-3xl transform rotate-3 hidden sm:block"></div>
            </motion.div>
          </div>

          {/* Scroll indicator - Hidden on mobile */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hidden md:block"
          >
            <div className="w-6 h-10 border-2 border-gold-400/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gold-400 rounded-full mt-2"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformation Modal */}
      <TransformationModal
        isOpen={showTransformationModal}
        onClose={() => setShowTransformationModal(false)}
        onBookingClick={handleBookingFromModal}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
};

export default Hero;