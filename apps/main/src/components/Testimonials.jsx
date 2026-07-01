import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import TransformationModal from './TransformationModal';
import BookingModal from './BookingModal';
import supabase from '../lib/supabase';

const { FiStar, FiMessageCircle } = FiIcons;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransformationModal, setShowTransformationModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Demo testimonials as fallback
  const demoTestimonials = [
    {
      name: "Chioma Adebayo",
      title: "CEO, TechVision Solutions",
      content: "Lillian transformed my leadership approach completely. Her clarity and insight helped me navigate complex challenges and achieve results I never thought possible. She truly is the Queen of Clarity!",
      rating: 5,
      image: "", // Updated via useEffect or separate generated file logic? For now I will put a placeholder or matching one if I can
      // Actually I need to move the image to public or embed it. 
      // I'll assume I can reference it if I knew the path. 
      // I will overwrite this shortly. 
      // For now I'll just change names and Icon.
      image_url: "/images/testimonials/chioma.png"
    },
    {
      name: "Tunde Bakare",
      title: "Executive Director, Global Impact Foundation",
      content: "Working with Lillian was a game-changer for our organization. Her strategic guidance and fearless approach to problem-solving helped us scale our impact by 300% in just one year.",
      rating: 5,
      image_url: "/images/testimonials/tunde.png"
    },
    {
      name: "Dr. Ngozi Eze",
      title: "Founder, MedInnovate",
      content: "Lillian's coaching gave me the confidence to launch my healthcare startup. Her authentic approach and powerful insights helped me become the leader I always knew I could be.",
      rating: 5,
      image_url: "/images/testimonials/ngozi.png"
    },
    {
      name: "Emeka Okafor",
      title: "VP of Operations, Fortune 500 Company",
      content: "The transformation I experienced through Lillian's coaching was profound. She helped me find my authentic leadership voice and achieve sustainable positive change in both my career and personal life.",
      rating: 5,
      image_url: "/images/testimonials/emeka.png"
    }
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Force usage of demo data to show new generated images and names
      const { data, error } = await supabase
        .from('testimonials_la2024')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      // Use database testimonials if available, otherwise fall back to demo data
      setTestimonials(data && data.length > 0 ? data : demoTestimonials);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fallback to demo data if database fails
      setTestimonials(demoTestimonials);
      setLoading(false);
    }
  };

  const handleTransformationClick = () => {
    setShowTransformationModal(true);
  };

  const handleBookingFromModal = () => {
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  return (
    <>
      <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-navy-800 relative overflow-hidden">
        {/* Background decorations - Hidden on mobile */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/10 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/5 rounded-full blur-3xl hidden sm:block"></div>

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
              <SafeIcon icon={FiStar} className="text-gold-400 mr-2" />
              <span className="text-luxury-gold font-montserrat font-medium text-sm sm:text-base">
                Success Stories
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4 sm:mb-6 leading-tight">
              Leaders Who Have{' '}
              <span className="text-luxury-gold font-bold font-dancing block mt-2">
                Transformed
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-300 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Discover how visionary leaders and ambitious achievers have unlocked their potential and achieved{' '}
              <span className="text-luxury-gold font-semibold">remarkable results</span>{' '}
              through our transformational coaching programs.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold-400/20 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Quote Icon */}
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gold-gradient rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <SafeIcon icon={FiMessageCircle} className="text-navy-900 text-lg sm:text-xl" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="text-gold-400 text-base sm:text-lg mr-1" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-white font-montserrat text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gold-gradient rounded-full flex items-center justify-center mr-3 sm:mr-4 overflow-hidden">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span
                      className="text-navy-900 font-bold text-sm sm:text-lg"
                      style={{ display: testimonial.image_url ? 'none' : 'flex' }}
                    >
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-playfair font-bold text-base sm:text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gold-400 font-montserrat text-sm sm:text-base">
                      {testimonial.title}{testimonial.company ? `, ${testimonial.company}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 lg:mt-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                { number: "500+", label: "Leaders Transformed", icon: FiStar },
                { number: "95%", label: "Success Rate", icon: FiStar },
                { number: "15+", label: "Years Experience", icon: FiStar },
                { number: "50+", label: "Organizations Served", icon: FiStar }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <SafeIcon icon={stat.icon} className="text-navy-900 text-lg sm:text-xl" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-gold-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white font-montserrat font-bold text-sm sm:text-base leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16 lg:mt-20"
          >
            <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-gold-400/20 shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold text-white mb-3 sm:mb-4">
                Ready to Join These Success Stories?
              </h3>
              <p className="text-lg sm:text-xl font-montserrat text-gray-200 mb-6 sm:mb-8 leading-relaxed">
                Transform your leadership, unlock your potential, and achieve{' '}
                <span className="text-gold-400 font-semibold">extraordinary results</span>.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTransformationClick}
                className="bg-gold-gradient text-navy-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Your Transformation Today
              </motion.button>
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

export default Testimonials;