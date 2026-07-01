import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiX, FiUser, FiLogOut, FiBook, FiShoppingBag, FiGift, FiHome } = FiIcons;

const Navbar = ({ isLoggedIn, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Resources', href: '/resources', icon: FiGift },
    { name: 'Courses', href: '/courses', icon: FiBook },
    { name: 'Shop', href: '/shop', icon: FiShoppingBag },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                <span className="text-navy-900 font-bold text-xl font-playfair">LA</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-dancing text-2xl font-bold text-navy-800">
                  Lillian Adegbola
                </h1>
                <p className="text-xs font-montserrat font-bold text-navy-600">
                  The Queen of Clarity & Purpose
                </p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-montserrat font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-gold-600 bg-gold-400/10'
                    : 'text-navy-700 hover:text-gold-600 hover:bg-gold-400/5'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={item.icon} className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}

            <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-navy-700 hover:text-gold-600 transition-colors duration-200"
              >
                <SafeIcon icon={FiUser} className="w-4 h-4" />
                <span className="text-sm font-montserrat font-medium">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogoutClick}
                className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                <span className="text-sm font-montserrat font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy-700 hover:text-gold-600 transition-colors duration-200"
            >
              <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-montserrat font-medium ${
                  isActive(item.href)
                    ? 'text-gold-600 bg-gold-400/10'
                    : 'text-navy-700 hover:text-gold-600 hover:bg-gold-400/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={item.icon} className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}

            <div className="border-t border-gray-200 pt-4">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-montserrat font-medium text-navy-700 hover:text-gold-600"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUser} className="w-4 h-4" />
                  <span>Profile</span>
                </div>
              </Link>
              <button
                onClick={handleLogoutClick}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-montserrat font-medium text-red-500 hover:text-red-600"
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;