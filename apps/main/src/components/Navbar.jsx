import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import BookingModal from './BookingModal';
import logoIcon from '../assets/logo.png';

const { FiMenu, FiX, FiChevronDown, FiMic, FiUsers, FiTarget, FiBriefcase, FiTrendingUp, FiSettings, FiBookOpen, FiHeart, FiMessageCircle, FiShield, FiCompass, FiMapPin, FiStar } = FiIcons;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', href: '#home', path: '/' },
    { name: 'About', href: '#about', path: '/' },
    { name: 'Services', href: '#services', path: '/', hasSubmenu: true },
    { name: 'Blog', href: '/blog', path: '/blog' },
    { name: 'Contact', href: '#contact', path: '/' }
  ];

  // Services organized into 4 columns with service IDs for navigation
  const servicesMenu = [
    {
      title: "Leadership & Coaching",
      icon: FiUsers,
      services: [
        { name: "Leadership Coaching", description: "Unlock your potential", serviceId: "leadership" },
        { name: "Executive Coaching", description: "Strategic leadership", serviceId: "executive" },
        { name: "Life Coaching", description: "Personal transformation", serviceId: "life" },
        { name: "Spiritual Coach", description: "Spiritual guidance", serviceId: "spiritual" }
      ]
    },
    {
      title: "Business & Strategy",
      icon: FiBriefcase,
      services: [
        { name: "Business Coaching", description: "Accelerate growth", serviceId: "business" },
        { name: "Management Consultant", description: "Strategic guidance", serviceId: "management" },
        { name: "Strategic Advisory", description: "Expert counsel", serviceId: "advisory" },
        { name: "Organizational Development", description: "Enhance performance", serviceId: "organizational" }
      ]
    },
    {
      title: "Speaking & Training",
      icon: FiMic,
      services: [
        { name: "Keynote Speaking", description: "Inspiring presentations", serviceId: "keynote" },
        { name: "Corporate Training", description: "Professional development", serviceId: "corporate" },
        { name: "Facilitation", description: "Expert group facilitation", serviceId: "facilitation" },
        { name: "Capacity Development", description: "Building capabilities", serviceId: "capacity" }
      ]
    },
    {
      title: "Specialized Services",
      icon: FiTarget,
      services: [
        { name: "Conflict Resolution", description: "Expert mediation", serviceId: "conflict" },
        { name: "Destination Retreats", description: "Transformational experiences", serviceId: "retreats" }
      ]
    }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    // Handle scroll from navigation state
    if (location.pathname === '/' && location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.querySelector(location.state.scrollTo);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    }

    // Handle service selection from navigation state
    if (location.pathname === '/' && location.state?.serviceId) {
      setTimeout(() => {
        const servicesElement = document.querySelector('#services');
        if (servicesElement) {
          // Scroll to services first
          const navbarHeight = 80;
          const elementPosition = servicesElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Then select service
          window.dispatchEvent(new CustomEvent('selectService', {
            detail: { serviceId: location.state.serviceId }
          }));
        }
      }, 500);
    }
  }, [location]);

  const handleNavClick = (item) => {
    setIsOpen(false);
    setShowServicesMenu(false);

    if (item.path === '/blog') {
      navigate('/blog');
      return;
    }

    if (location.pathname !== '/') {
      // Navigate to homepage with scroll target
      navigate('/', { state: { scrollTo: item.href } });
      return;
    }

    // Smooth scroll to section on homepage
    const element = document.querySelector(item.href);
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

  const handleServiceClick = (service) => {
    setShowServicesMenu(false);
    setIsOpen(false);

    if (location.pathname !== '/') {
      // Navigate to homepage with service selection
      navigate('/', { state: { serviceId: service.serviceId } });
      return;
    }

    // First scroll to services section
    const servicesElement = document.querySelector('#services');
    if (servicesElement) {
      const navbarHeight = 80;
      const elementPosition = servicesElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // After scrolling to services, trigger the specific service selection
      setTimeout(() => {
        // Dispatch a custom event to notify the Services component
        window.dispatchEvent(new CustomEvent('selectService', {
          detail: { serviceId: service.serviceId }
        }));
      }, 800); // Wait for scroll to complete
    }
  };

  const handleHomeClick = () => {
    setIsOpen(false);
    setShowServicesMenu(false);

    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookingClick = () => {
    setIsOpen(false);
    setShowServicesMenu(false);
    setShowBookingModal(true);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gold-400/20'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleHomeClick}
            >
              <img src={logoIcon} alt="Lilian Adegbola Logo" className="w-12 h-12 rounded-full object-cover" />
              <div className="hidden sm:block">
                <h1 className={`font-dancing text-2xl font-bold transition-colors duration-300 ${scrolled ? 'text-navy-800' : 'text-white'
                  }`}>
                  Lillian Adegbola
                </h1>
                <p className={`text-xs font-montserrat font-bold transition-colors duration-300 ${scrolled ? 'text-navy-800' : 'text-white/80'
                  }`}>
                  The Queen of Clarity & Purpose
                </p>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                item.path === '/blog' ? (
                  <Link
                    key={item.name}
                    to="/blog"
                    onClick={() => {
                      setShowServicesMenu(false);
                      // Ensure scroll to top on blog page navigation
                      setTimeout(() => window.scrollTo(0, 0), 0);
                    }}
                    className={`hover:text-gold-400 transition-all duration-300 font-montserrat font-medium relative group ${scrolled ? 'text-navy-800' : 'text-white'
                      } ${location.pathname === '/blog' ? 'text-gold-400' : ''}`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ) : item.hasSubmenu ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setShowServicesMenu(true)}
                    onMouseLeave={() => setShowServicesMenu(false)}
                  >
                    <motion.button
                      onClick={() => handleNavClick(item)}
                      whileHover={{ y: -2 }}
                      className={`hover:text-gold-400 transition-all duration-300 font-montserrat font-medium relative group flex items-center ${scrolled ? 'text-navy-800' : 'text-white'
                        }`}
                    >
                      {item.name}
                      <SafeIcon icon={FiChevronDown} className={`ml-1 transition-transform duration-300 ${showServicesMenu ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-300"></span>
                    </motion.button>

                    {/* Services Megamenu - Compact and Centered */}
                    <AnimatePresence>
                      {showServicesMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="fixed top-20 left-0 right-0 mx-auto mt-0 bg-white rounded-xl shadow-2xl border border-gold-400/20 p-6 z-50"
                          style={{
                            width: 'min(85vw, 900px)',
                          }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {servicesMenu.map((column, columnIndex) => (
                              <div key={columnIndex} className="space-y-3">
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="w-7 h-7 bg-gold-gradient rounded-lg flex items-center justify-center">
                                    <SafeIcon icon={column.icon} className="text-navy-900 text-sm" />
                                  </div>
                                  <h3 className="font-playfair font-bold text-navy-800 text-sm">
                                    {column.title}
                                  </h3>
                                </div>

                                <div className="space-y-2">
                                  {column.services.map((service, serviceIndex) => (
                                    <motion.button
                                      key={serviceIndex}
                                      onClick={() => handleServiceClick(service)}
                                      whileHover={{ x: 3 }}
                                      className="block w-full text-left p-2 rounded-lg hover:bg-gold-400/10 transition-colors duration-300 group"
                                    >
                                      <div className="font-montserrat font-semibold text-navy-800 group-hover:text-gold-600 transition-colors text-xs mb-1">
                                        {service.name}
                                      </div>
                                      <div className="text-xs text-gray-600 leading-tight">
                                        {service.description}
                                      </div>
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Compact CTA Section */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                              <div className="text-center md:text-left">
                                <h4 className="font-playfair font-bold text-navy-800 text-sm mb-1">
                                  Ready to Transform Your Leadership?
                                </h4>
                                <p className="text-gray-600 font-montserrat text-xs">
                                  Schedule a complimentary consultation today.
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBookingClick}
                                className="bg-gold-gradient text-navy-900 px-4 py-2 rounded-full font-montserrat font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm whitespace-nowrap"
                              >
                                Book Free Consultation
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    whileHover={{ y: -2 }}
                    className={`hover:text-gold-400 transition-all duration-300 font-montserrat font-medium relative group ${scrolled ? 'text-navy-800' : 'text-white'
                      }`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-300"></span>
                  </motion.button>
                )
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookingClick}
                className="bg-gold-gradient text-navy-900 px-6 py-3 rounded-full font-montserrat font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Free Consultation
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/portal/login')}
                className={`ml-4 px-6 py-3 rounded-full font-montserrat font-semibold border-2 transition-all duration-300 ${scrolled
                  ? 'border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-navy-900'
                  }`}
              >
                Portal Login
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsOpen(!isOpen);
                  setShowServicesMenu(false);
                }}
                className={`hover:text-gold-400 transition-colors ${scrolled ? 'text-navy-800' : 'text-white'
                  }`}
              >
                <SafeIcon icon={isOpen ? FiX : FiMenu} className="h-6 w-6" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-b-2xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                item.path === '/blog' ? (
                  <Link
                    key={item.name}
                    to="/blog"
                    onClick={() => {
                      setIsOpen(false);
                      // Ensure scroll to top on blog page navigation
                      setTimeout(() => window.scrollTo(0, 0), 0);
                    }}
                    className="block w-full text-left text-navy-800 hover:text-gold-600 transition-colors font-montserrat font-medium"
                  >
                    {item.name}
                  </Link>
                ) : item.hasSubmenu ? (
                  <div key={item.name} className="space-y-2">
                    <motion.button
                      onClick={() => handleNavClick(item)}
                      whileHover={{ x: 10 }}
                      className="block w-full text-left text-navy-800 hover:text-gold-600 transition-colors font-montserrat font-medium flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      <SafeIcon icon={FiChevronDown} className="text-sm" />
                    </motion.button>

                    {/* Mobile Services Submenu - Compact */}
                    <div className="pl-4 space-y-2 border-l-2 border-gold-400/20">
                      {servicesMenu.map((column) => (
                        <div key={column.title} className="space-y-1">
                          <div className="text-xs font-montserrat font-semibold text-gold-600 uppercase tracking-wider mb-1">
                            {column.title}
                          </div>
                          {column.services.map((service) => (
                            <motion.button
                              key={service.name}
                              onClick={() => handleServiceClick(service)}
                              whileHover={{ x: 5 }}
                              className="block w-full text-left text-xs text-gray-600 hover:text-navy-800 transition-colors font-montserrat py-1"
                            >
                              {service.name}
                            </motion.button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    whileHover={{ x: 10 }}
                    className="block w-full text-left text-navy-800 hover:text-gold-600 transition-colors font-montserrat font-medium"
                  >
                    {item.name}
                  </motion.button>
                )
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookingClick}
                className="w-full bg-gold-gradient text-navy-900 py-3 rounded-full font-montserrat font-semibold shadow-lg"
              >
                Book Free Consultation
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/portal/login')}
                className="w-full mt-3 bg-white border-2 border-navy-900 text-navy-900 py-3 rounded-full font-montserrat font-semibold shadow-lg"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.nav >

      {/* Booking Modal */}
      < BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
};

export default Navbar;