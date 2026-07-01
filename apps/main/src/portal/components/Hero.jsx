import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowRight, FiStar, FiUsers, FiAward } = FiIcons;

const Hero = () => {
  const stats = [
    { icon: FiUsers, value: '5000+', label: 'Members' },
    { icon: FiStar, value: '4.9', label: 'Rating' },
    { icon: FiAward, value: '50+', label: 'Courses' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="bg-luxury-gradient min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* Hero Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center space-x-4 mb-8"
              >
                <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center">
                  <span className="text-navy-900 font-bold text-3xl font-playfair">LA</span>
                </div>
                <div>
                  <h2 className="text-3xl font-dancing font-bold text-white">
                    Lillian Adegbola
                  </h2>
                  <p className="text-lg font-montserrat font-bold text-gold-200">
                    The Queen of Clarity & Purpose
                  </p>
                </div>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-playfair font-bold mb-6">
                Transform Your
                <span className="text-gold-400 font-dancing block text-6xl lg:text-7xl">
                  Journey
                </span>
              </h1>
              
              <p className="text-xl font-montserrat mb-8 text-gray-200">
                Join thousands of members accessing premium resources, courses, and exclusive content 
                designed to elevate your personal and professional growth with clarity and purpose.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/login"
                  className="bg-gold-gradient text-navy-800 px-8 py-4 rounded-full font-montserrat font-semibold hover:shadow-xl transition-all duration-300 text-center"
                >
                  Start Your Journey
                  <SafeIcon icon={FiArrowRight} className="inline ml-2 w-5 h-5" />
                </Link>
                
                <Link
                  to="/resources"
                  className="border-2 border-gold-400 text-gold-400 px-8 py-4 rounded-full font-montserrat font-semibold hover:bg-gold-400 hover:text-navy-800 transition-all duration-300 text-center"
                >
                  Explore Resources
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <SafeIcon icon={stat.icon} className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                    <div className="text-2xl font-playfair font-bold text-white">{stat.value}</div>
                    <div className="text-sm font-montserrat text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Lillian Adegbola - The Queen of Clarity & Purpose"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute inset-0 bg-gold-gradient opacity-20 rounded-2xl transform rotate-6"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-playfair font-bold text-navy-800 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 font-montserrat">
              Access premium content, courses, and products all in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Free Resources',
                description: 'Access valuable guides, templates, and tools to kickstart your journey with clarity',
                icon: FiStar,
                color: 'emerald'
              },
              {
                title: 'Premium Courses',
                description: 'Comprehensive courses designed to accelerate your growth and find your purpose',
                icon: FiAward,
                color: 'purple'
              },
              {
                title: 'Exclusive Shop',
                description: 'Curated products and merchandise to support your transformative lifestyle',
                icon: FiUsers,
                color: 'blue'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-luxury-pearl p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-${feature.color}-500 rounded-full flex items-center justify-center mb-6`}>
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-montserrat">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;