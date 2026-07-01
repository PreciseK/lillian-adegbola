import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';
import logoIcon from '../assets/logo.png';

const { FiMail, FiPhone, FiLinkedin, FiInstagram, FiFacebook, FiArrowUp, FiSettings } = FiIcons;

const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const footerLinks = {
    services: [
      { name: 'Keynote Speaking', href: '#services', onClick: () => handleNavClick('#services') },
      { name: 'Leadership Coaching', href: '#services', onClick: () => handleNavClick('#services') },
      { name: 'Business Coaching', href: '#services', onClick: () => handleNavClick('#services') },
      { name: 'Life Coaching', href: '#services', onClick: () => handleNavClick('#services') },
      { name: 'Strategic Advisory', href: '#services', onClick: () => handleNavClick('#services') }
    ],
    company: [
      { name: 'About Lillian', href: '#about', onClick: () => handleNavClick('#about') },
      { name: 'Success Stories', href: '#testimonials', onClick: () => handleNavClick('#testimonials') },
      { name: 'Blog & Insights', href: '#blog', onClick: () => handleNavClick('#blog') },
      { name: 'Speaking Topics', href: '#services', onClick: () => handleNavClick('#services') },
      { name: 'Media Kit', href: '#contact', onClick: () => handleNavClick('#contact') }
    ],
    resources: [
      { name: 'Leadership Assessment', href: '#contact', onClick: () => handleNavClick('#contact') },
      { name: 'Free Resources', href: '#blog', onClick: () => handleNavClick('#blog') },
      { name: 'Podcast', href: '#blog', onClick: () => handleNavClick('#blog') },
      { name: 'Newsletter', href: '#blog', onClick: () => handleNavClick('#blog') },
      { name: 'Events', href: '#contact', onClick: () => handleNavClick('#contact') }
    ]
  };

  const socialLinks = [
    {
      icon: FiLinkedin,
      href: "https://ng.linkedin.com/in/lillianadegbola",
      label: "LinkedIn"
    },
    {
      icon: FiFacebook,
      href: "https://www.facebook.com/CoachLillianNkechiAdegbola/",
      label: "Facebook"
    },
    {
      icon: FiInstagram,
      href: "https://www.instagram.com/lillianadegbola/",
      label: "Instagram"
    },
    {
      // Custom X icon component
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "https://x.com/LillianAdegbola",
      label: "X (Twitter)"
    }
  ];

  return (
    <>
      <footer className="bg-navy-900 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-5 gap-8">

              {/* Brand Column */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {/* Logo */}
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={logoIcon} alt="Lilian Adegbola" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-dancing text-2xl text-white font-bold">
                        Lillian Adegbola
                      </h3>
                      <p className="text-gold-400 font-montserrat text-sm">
                        The Queen of Clarity & Purpose
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-300 font-montserrat leading-relaxed">
                    Empowering visionary leaders and ambitious achievers to unlock their potential and achieve
                    sustainable positive transformation through fearless leadership and authentic growth.
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiMail} className="text-gold-400" />
                      <a
                        href="mailto:clarityqueen23@gmail.com"
                        className="text-gray-300 hover:text-gold-400 transition-colors font-montserrat"
                      >
                        clarityqueen23@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiPhone} className="text-gold-400" />
                      <a
                        href="tel:+2348023200539"
                        className="text-gray-300 hover:text-gold-400 transition-colors font-montserrat"
                      >
                        +234 802 320 0539
                      </a>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white/10 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-gold-400 hover:text-navy-900 transition-all duration-300"
                        aria-label={social.label}
                      >
                        {typeof social.icon === 'function' ? (
                          <social.icon />
                        ) : (
                          <SafeIcon icon={social.icon} className="text-lg" />
                        )}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Services Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-playfair font-bold text-lg mb-6 text-gold-400">
                  Services
                </h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={link.onClick}
                        className="text-gray-300 hover:text-gold-400 transition-colors font-montserrat hover:translate-x-1 inline-block transform duration-300 text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Company Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="font-playfair font-bold text-lg mb-6 text-gold-400">
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={link.onClick}
                        className="text-gray-300 hover:text-gold-400 transition-colors font-montserrat hover:translate-x-1 inline-block transform duration-300 text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="font-playfair font-bold text-lg mb-6 text-gold-400">
                  Resources
                </h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={link.onClick}
                        className="text-gray-300 hover:text-gold-400 transition-colors font-montserrat hover:translate-x-1 inline-block transform duration-300 text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-16 pt-8 border-t border-gray-700"
            >
              <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:mx-0">
                <h4 className="font-playfair font-bold text-xl mb-4 text-gold-400">
                  Stay Inspired & Empowered
                </h4>
                <p className="text-gray-300 font-montserrat mb-6">
                  Get weekly insights, leadership tips, and exclusive resources delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all duration-300 font-montserrat"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gold-gradient text-navy-900 px-6 py-3 rounded-xl font-montserrat font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-gray-400 font-montserrat text-sm">
                    © {new Date().getFullYear()} Lillian Adegbola. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm font-montserrat">
                    <span>Created by</span>
                    <span className="text-gold-400 font-semibold mx-1">Maxmark Agency</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-gray-400 hover:text-gold-400 transition-colors font-montserrat text-sm"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="text-gray-400 hover:text-gold-400 transition-colors font-montserrat text-sm"
                  >
                    Terms of Service
                  </button>

                  {/* Admin Link */}
                  <Link
                    to="/admin"
                    className="text-gray-400 hover:text-gold-400 transition-colors font-montserrat text-sm flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiSettings} className="text-xs" />
                    <span>Admin</span>
                  </Link>

                  {/* Scroll to Top Button */}
                  <motion.button
                    onClick={scrollToTop}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center text-navy-900 shadow-lg hover:shadow-xl transition-all duration-300"
                    aria-label="Scroll to top"
                  >
                    <SafeIcon icon={FiArrowUp} className="text-lg" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {/* Terms of Service Modal */}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </>
  );
};

export default Footer;