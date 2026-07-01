import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiMessageCircle, FiCalendar, FiArrowRight } = FiIcons;

const TransformationModal = ({ isOpen, onClose, onBookingClick }) => {
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleWhatsAppClick = () => {
    // WhatsApp link with pre-filled message
    const phoneNumber = "2348023200539"; // Replace with actual WhatsApp number
    const message = encodeURIComponent("Hello Lillian! I'm interested in starting my transformation journey. I'd love to learn more about your coaching services.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleBookingClick = () => {
    onClose();
    onBookingClick();
  };

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
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
          >
            <SafeIcon icon={FiX} className="text-gray-600 text-xl" />
          </button>

          {/* Header */}
          <div className="bg-navy-800 text-white p-6 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-400/10 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-navy-900 font-bold text-2xl">LA</span>
              </div>
              <h2 className="text-2xl font-playfair font-bold mb-2">
                Start Your Transformation
              </h2>
              <p className="text-gray-200 font-montserrat">
                Choose how you'd like to connect with Lillian
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="p-6 space-y-4">
            {/* WhatsApp Option */}
            <motion.button
              onClick={handleWhatsAppClick}
              onHoverStart={() => setHoveredOption('whatsapp')}
              onHoverEnd={() => setHoveredOption(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-6 rounded-2xl border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                  <SafeIcon icon={FiMessageCircle} className="text-green-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-playfair font-bold text-navy-800 mb-1">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-gray-600 font-montserrat text-sm leading-relaxed mb-3">
                    Get instant access to Lillian for quick questions and immediate guidance
                  </p>
                  <div className="flex items-center text-green-600 font-montserrat font-semibold text-sm">
                    <span>Start chatting now</span>
                    <SafeIcon
                      icon={FiArrowRight}
                      className={`ml-2 transition-transform ${hoveredOption === 'whatsapp' ? 'translate-x-1' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Booking Option */}
            <motion.button
              onClick={handleBookingClick}
              onHoverStart={() => setHoveredOption('booking')}
              onHoverEnd={() => setHoveredOption(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-6 rounded-2xl border-2 border-gold-400/30 hover:border-gold-400 hover:bg-gold-50 transition-all duration-300 text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-100 group-hover:bg-gold-200 rounded-xl flex items-center justify-center transition-colors">
                  <SafeIcon icon={FiCalendar} className="text-gold-700 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-playfair font-bold text-navy-800 mb-1">
                    Book Free Consultation
                  </h3>
                  <p className="text-gray-600 font-montserrat text-sm leading-relaxed mb-3">
                    Schedule a comprehensive 30-minute discovery call to explore your transformation journey
                  </p>
                  <div className="flex items-center text-gold-700 font-montserrat font-semibold text-sm">
                    <span>Schedule your call</span>
                    <SafeIcon
                      icon={FiArrowRight}
                      className={`ml-2 transition-transform ${hoveredOption === 'booking' ? 'translate-x-1' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-gray-500 font-montserrat text-xs">
              Both options connect you directly with Lillian for personalized guidance
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransformationModal;