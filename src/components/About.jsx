import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiZap, FiTarget, FiShield } = FiIcons;

const About = () => {
  const values = [
    {
      icon: FiTarget,
      title: "Clarity",
      description: "Gaining crystal-clear vision of your purpose, goals, and the path to achieve them."
    },
    {
      icon: FiHeart,
      title: "Authenticity", 
      description: "Being true to yourself and your values while leading with integrity and transparency."
    },
    {
      icon: FiZap,
      title: "Courage",
      description: "Embracing courage to face challenges and take bold actions toward your goals."
    },
    {
      icon: FiShield,
      title: "Excellence",
      description: "Commitment to the highest standards in everything you do, creating lasting impact."
    }
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Background decorations - Hidden on mobile */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/5 rounded-full blur-3xl hidden sm:block"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-navy-800/5 rounded-full blur-3xl hidden sm:block"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            <div className="space-y-3 sm:space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                viewport={{ once: true }}
                className="inline-flex items-center bg-navy-900/80 px-2 py-1 rounded-full"
              >
                <span className="text-luxury-gold font-montserrat font-medium text-sm sm:text-base">
                  About Lillian
                </span>
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-navy-800 leading-tight">
                A Powerhouse
                <span className="text-navy-900 font-dancing block mt-2">
                  of Transformation
                </span>
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6 text-gray-700 font-montserrat text-base sm:text-lg leading-relaxed">
              <p>
                With my <span className="text-navy-900 font-semibold">multi-gifted, multi-talented, and multi-skilled</span> expertise, 
                I have created incredible experiences, solutions, and results for many individuals, leaders, businesses, organizations, and non-profits.
              </p>
              
              <p>
                I am <span className="text-navy-900 font-semibold">bold, authentic, and dignified</span>. 
                As the Queen of Clarity, Rapid Results, and Purpose, I help confident and courageous people become 
                the best authentic version of themselves or their business.
              </p>
              
              <p>
                My passion lies in <span className="text-navy-900 font-semibold">Sustainable Positive Transformation</span> - 
                guiding you to unlock your fearless potential and live with clarity, freedom, purpose, impact, peace, joy, and fulfillment.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button className="bg-navy-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-semibold shadow-xl hover:bg-navy-900 transition-all duration-300 text-sm sm:text-base">
                Discover My Story
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Values Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 order-1 lg:order-2"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true }}
                className="bg-luxury-pearl p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gold-400/20"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gold-gradient rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <SafeIcon icon={value.icon} className="text-navy-900 text-lg sm:text-xl" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-playfair font-bold text-navy-800 mb-2 sm:mb-3">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 font-montserrat leading-relaxed text-sm sm:text-base">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="bg-navy-800 text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold mb-3 sm:mb-4 leading-tight">
              "Visionary, Strategic and Results-driven, I am{' '}
              <span className="text-gold-400">FEARLESS</span>."
            </h3>
            
            <p className="text-lg sm:text-xl font-montserrat text-gray-200 leading-relaxed">
              I embody <span className="text-gold-400 font-semibold">FREEDOM and FEARLESSNESS</span>, 
              empowering visionary leaders, ambitious achievers and organizations to break through limitations 
              and unleash their full potential.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;