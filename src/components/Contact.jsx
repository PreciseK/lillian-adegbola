import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import BookingModal from './BookingModal';
import { useContact } from '../hooks/useContact';

const { FiMail, FiPhone, FiMapPin, FiSend, FiCalendar, FiLinkedin, FiInstagram, FiFacebook } = FiIcons;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    service: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { submitContactForm, loading, error } = useContact();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitContactForm(formData);

    if (result.success) {
      alert('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        service: ''
      });
    } else {
      alert('Error sending message: ' + result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email",
      content: "clarityqueen23@gmail.com",
      link: "mailto:clarityqueen23@gmail.com"
    },
    {
      icon: FiPhone,
      title: "Phone",
      content: "+234 802 320 0539",
      link: "tel:+2348023200539"
    },
    {
      icon: FiMapPin,
      title: "Location",
      content: "The Penthouse 26b Abia Street Banana Island Ikoyi",
      link: null
    }
  ];

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
      // Using a generic icon since X icon isn't in react-icons/fi
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
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        {/* Background decorations - Hidden on mobile */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/5 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-navy-800/5 rounded-full blur-3xl hidden sm:block"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              viewport={{ once: true }}
              className="inline-flex items-center bg-navy-900/80 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6"
            >
              <span className="text-luxury-gold font-montserrat font-medium text-sm sm:text-base">
                Get In Touch
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-navy-800 mb-4 sm:mb-6 leading-tight">
              Ready to Begin Your
              <span className="text-navy-900 font-dancing block font-bold mt-2">
                Transformation?
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-700 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Let's connect and explore how we can unlock your potential, achieve your goals, and create{' '}
              <span className="text-navy-900 font-semibold">sustainable positive transformation</span> together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-luxury-pearl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl order-2 lg:order-1"
            >
              <h3 className="text-xl sm:text-2xl font-playfair font-bold text-navy-800 mb-4 sm:mb-6">
                Send Me a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-navy-800 font-montserrat font-medium mb-2 text-sm sm:text-base">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all duration-300 font-montserrat text-sm sm:text-base"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-navy-800 font-montserrat font-medium mb-2 text-sm sm:text-base">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all duration-300 font-montserrat text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-navy-800 font-montserrat font-medium mb-2 text-sm sm:text-base">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all duration-300 font-montserrat text-sm sm:text-base"
                    placeholder="Your company or organization"
                  />
                </div>

                <div>
                  <label className="block text-navy-800 font-montserrat font-medium mb-2 text-sm sm:text-base">
                    Service of Interest
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all duration-300 font-montserrat text-sm sm:text-base"
                  >
                    <option value="">Select a service</option>
                    <option value="keynote">Keynote Speaking</option>
                    <option value="leadership">Leadership Coaching</option>
                    <option value="business">Business Coaching</option>
                    <option value="life">Life Coaching</option>
                    <option value="retreats">Destination Retreats</option>
                    <option value="advisory">Strategic Advisory</option>
                    <option value="facilitation">Facilitation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-navy-800 font-montserrat font-medium mb-2 text-sm sm:text-base">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all duration-300 font-montserrat resize-none text-sm sm:text-base"
                    placeholder="Tell me about your goals, challenges, and how I can help you achieve transformation..."
                  ></textarea>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-navy-800 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-montserrat font-semibold shadow-xl hover:bg-navy-900 transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <SafeIcon icon={FiSend} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8 order-1 lg:order-2"
            >

              {/* Contact Info Cards */}
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gold-400/20 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gold-gradient rounded-lg sm:rounded-xl flex items-center justify-center">
                        <SafeIcon icon={info.icon} className="text-navy-900 text-lg sm:text-xl" />
                      </div>
                      <div>
                        <h4 className="font-playfair font-bold text-navy-800 text-base sm:text-lg">
                          {info.title}
                        </h4>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 font-montserrat hover:text-gold-600 transition-colors text-sm sm:text-base"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 font-montserrat text-sm sm:text-base">
                            {info.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Action Buttons */}
              <div className="space-y-3 sm:space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-gold-gradient text-navy-900 py-3 sm:py-4 rounded-lg sm:rounded-xl font-montserrat font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group text-sm sm:text-base"
                >
                  <SafeIcon icon={FiCalendar} className="mr-2" />
                  Schedule a Consultation
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full border-2 border-navy-800 text-navy-800 py-3 sm:py-4 rounded-lg sm:rounded-xl font-montserrat font-bold hover:bg-navy-800 hover:text-white transition-all duration-300 text-sm sm:text-base"
                >
                  Download Leadership Guide
                </motion.button>
              </div>

              {/* Social Links */}
              <div className="pt-6 sm:pt-8">
                <h4 className="font-playfair font-bold text-navy-800 text-base sm:text-lg mb-3 sm:mb-4">
                  Connect With Me
                </h4>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 sm:w-12 h-10 sm:h-12 bg-navy-800 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-gold-600 transition-all duration-300"
                      aria-label={social.label}
                    >
                      {typeof social.icon === 'function' ? (
                        <social.icon />
                      ) : (
                        <SafeIcon icon={social.icon} className="text-base sm:text-lg" />
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-navy-800 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl"
              >
                <p className="font-playfair font-bold text-base sm:text-lg mb-2">
                  "Your transformation begins with a single conversation."
                </p>
                <p className="text-gold-400 font-montserrat text-sm sm:text-base">
                  - Lillian Adegbola
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
};

export default Contact;