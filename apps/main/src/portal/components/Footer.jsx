import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiLinkedin, FiFacebook } = FiIcons;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Resources', href: '/resources' },
    { name: 'Courses', href: '/courses' },
    { name: 'Shop', href: '/shop' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' }
  ];

  const socialLinks = [
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FiFacebook, href: '#', label: 'Facebook' }
  ];

  return (
    <footer className="bg-luxury-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center">
                <span className="text-navy-900 font-bold text-2xl font-playfair">LA</span>
              </div>
              <div>
                <h3 className="text-2xl font-dancing font-bold text-white">
                  Lillian Adegbola
                </h3>
                <p className="text-sm font-montserrat font-bold text-gold-200">
                  The Queen of Clarity & Purpose
                </p>
              </div>
            </motion.div>
            <p className="text-gray-300 font-montserrat mb-6">
              Empowering individuals to unlock their full potential through premium resources,
              courses, and transformative content.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors duration-200"
                >
                  <SafeIcon icon={social.icon} className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-playfair font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-gold-400 font-montserrat transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-playfair font-bold mb-4">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-gold-400 font-montserrat transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-playfair font-bold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="w-5 h-5 text-gold-400" />
                <span className="text-gray-300 font-montserrat">clarityqueen23@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="w-5 h-5 text-gold-400" />
                <span className="text-gray-300 font-montserrat">+234 802 320 0539</span>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gold-400" />
                <span className="text-gray-300 font-montserrat">The Penthouse 26b Abia Street Banana Island Ikoyi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 font-montserrat text-sm">
            © {currentYear} Lillian Adegbola. All rights reserved.
          </p>
          <p className="text-gray-300 font-montserrat text-sm mt-4 md:mt-0">
            Made with ❤️ for your success
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;