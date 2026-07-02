import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSettings } from '../hooks/useSettings';

const { FiTool, FiMail, FiPhone, FiLinkedin, FiInstagram, FiFacebook } = FiIcons;

const Maintenance = () => {
  const { settings } = useSettings([
    'site_title',
    'contact_email',
    'contact_phone',
    'social_linkedin',
    'social_instagram',
    'social_facebook'
  ]);

  const siteTitle = settings.site_title || 'Lillian Adegbola';
  const email = settings.contact_email || 'clarityqueen23@gmail.com';
  const phone = settings.contact_phone || '+234 802 320 0539';

  return (
    <div className="min-h-screen bg-[#032B44] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#DAA520] to-transparent blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#DAA520] to-transparent blur-3xl"></div>
      </div>

      {/* Header / Logo */}
      <header className="z-10 max-w-7xl mx-auto w-full flex justify-between items-center py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center space-x-2"
        >
          <span className="font-playfair text-2xl font-bold tracking-widest text-[#DAA520]">
            {siteTitle.split(' - ')[0].toUpperCase()}
          </span>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="z-10 max-w-3xl mx-auto w-full text-center my-auto flex flex-col items-center justify-center py-12 px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 80, delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-[#DAA520] to-[#F8E231] rounded-2xl flex items-center justify-center shadow-xl shadow-black/30 mb-8"
        >
          <SafeIcon icon={FiTool} className="w-12 h-12 text-[#032B44]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl font-playfair font-bold mb-6 tracking-wide leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300"
        >
          Temporarily Offline For Scheduled Maintenance
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl font-montserrat text-gray-300 mb-12 max-w-2xl leading-relaxed"
        >
          We are upgrading our systems to serve you better. We'll be back online shortly. Thank you for your patience and support!
        </motion.p>

        {/* Contact info grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mb-12"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center space-x-4 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#DAA520]/20 flex items-center justify-center text-[#DAA520]">
              <SafeIcon icon={FiMail} className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-montserrat uppercase tracking-wider">Email Us</p>
              <a href={`mailto:${email}`} className="text-sm font-medium hover:text-[#DAA520] transition-colors font-montserrat">{email}</a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center space-x-4 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#DAA520]/20 flex items-center justify-center text-[#DAA520]">
              <SafeIcon icon={FiPhone} className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-400 font-montserrat uppercase tracking-wider">Call Us</p>
              <a href={`tel:${phone}`} className="text-sm font-medium hover:text-[#DAA520] transition-colors font-montserrat">{phone}</a>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center py-6 border-t border-white/10 text-gray-400 text-sm">
        <p className="font-montserrat mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} {siteTitle.split(' - ')[0]}. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-4">
          {settings.social_linkedin && (
            <a
              href={settings.social_linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#DAA520] hover:text-[#032B44] transition-all flex items-center justify-center text-white"
            >
              <SafeIcon icon={FiLinkedin} className="w-5 h-5" />
            </a>
          )}
          {settings.social_instagram && (
            <a
              href={settings.social_instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#DAA520] hover:text-[#032B44] transition-all flex items-center justify-center text-white"
            >
              <SafeIcon icon={FiInstagram} className="w-5 h-5" />
            </a>
          )}
          {settings.social_facebook && (
            <a
              href={settings.social_facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#DAA520] hover:text-[#032B44] transition-all flex items-center justify-center text-white"
            >
              <SafeIcon icon={FiFacebook} className="w-5 h-5" />
            </a>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Maintenance;
