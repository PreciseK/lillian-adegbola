import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import TransformationModal from './TransformationModal';
import BookingModal from './BookingModal';

const { FiMic, FiUsers, FiMapPin, FiCompass, FiBriefcase, FiHeart, FiMessageCircle, FiArrowRight, FiTarget, FiShield, FiStar, FiTrendingUp, FiBookOpen, FiSettings } = FiIcons;

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showTransformationModal, setShowTransformationModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const services = [
    {
      id: 'keynote',
      icon: FiMic,
      title: 'Keynote Speaker Services',
      subtitle: 'Inspire Action. Transform Mindsets.',
      description: 'As a dynamic keynote speaker, Lillian Adegbola delivers powerful talks that ignite leadership, drive growth, and inspire teams to achieve more. With expertise in leadership, collaboration, and personal effectiveness, her keynotes leave a lasting impact.',
      cta: 'Book Lillian for your next event to spark transformation.',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'leadership',
      icon: FiUsers,
      title: 'Leadership Coaching',
      subtitle: 'Unlock Your Potential. Lead with Confidence.',
      description: 'Through personalized leadership coaching, Lillian Adegbola empowers leaders to discover their strengths, overcome obstacles, and reach their full potential. By fostering self-awareness, building resilience, and developing effective strategies, leaders can inspire their teams and drive success.',
      cta: 'Ready to Elevate Your Leadership? Schedule a Discovery Call Today!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'executive',
      icon: FiTarget,
      title: 'Executive Coaching',
      subtitle: 'Elevate Performance. Achieve Exceptional Results.',
      description: 'As an executive coach, Lillian Adegbola partners with senior leaders to tackle complex challenges, enhance decision-making, and drive business growth. With tailored guidance and support, executives can refine their leadership style, build high-performing teams, and achieve outstanding results.',
      cta: 'Let\'s Drive Exceptional Results Together! Book Your Executive Coaching Session Now!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'retreats',
      icon: FiMapPin,
      title: 'Destination Retreat Leader',
      subtitle: 'Reconnect. Refocus. Renew.',
      description: 'Join Lillian Adegbola on curated destination retreats blending leadership growth, team building, and personal renewal in inspiring settings. These transformative experiences help leaders and teams reconnect with purpose, refocus on goals, and renew their energy for impact.',
      cta: 'Want to foster connection, creativity, and renewal? Plan Your Next Retreat. Let\'s Create an Unforgettable Experience!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'advisory',
      icon: FiCompass,
      title: 'Strategic Advisory',
      subtitle: 'Strategic Insight. Trusted Counsel.',
      description: 'As a seasoned advisor, Lillian Adegbola leverages her expertise in leadership, facilitation, and strategic thinking to guide organizations through challenges and opportunities. With a focus on driving growth, effectiveness, and innovation, she provides trusted counsel to inform critical decisions.',
      cta: 'Let\'s Explore Strategic Opportunities. Schedule a Consultation Today!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'business',
      icon: FiBriefcase,
      title: 'Business Coaching',
      subtitle: 'Grow Your Business. Unlock Potential.',
      description: 'With expert business coaching, Lillian Adegbola helps entrepreneurs and business leaders overcome challenges, leverage strengths, and achieve growth. Through personalized guidance and accountability, she empowers businesses to boost performance, enhance strategies, and reach goals.',
      cta: 'Partner with Lillian for business coaching tailored to your needs.',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'organizational',
      icon: FiTrendingUp,
      title: 'Organizational Development',
      subtitle: 'Build High-Performing Teams. Drive Results.',
      description: 'Lillian Adegbola supports organizational development through strategies that enhance teamwork, improve communication, and boost performance. With expertise in facilitation and leadership, she helps organizations build capacity, foster collaboration, and achieve sustainable results.',
      cta: 'Work with Lillian to transform your organization\'s potential into impact.',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'life',
      icon: FiHeart,
      title: 'Life Coaching',
      subtitle: 'Unlock Your Potential. Live with Purpose.',
      description: 'With compassionate and expert life coaching, Lillian Adegbola helps individuals clarify goals, overcome obstacles, and create meaningful change. Through personalized support and strategies, she empowers clients to gain clarity, build confidence, find balance, and develop the courage to live an intentional and impactful life.',
      cta: 'Partner with Lillian for life coaching that radically transforms your life journey.',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'facilitation',
      icon: FiMessageCircle,
      title: 'Facilitation Expertise',
      subtitle: 'Transform Conversations. Unlock Collaboration.',
      description: 'Expert facilitation unlocks collaboration, fuels innovation, and drives outcomes in leadership teams, workshops, and strategic meetings. With proven skills in guiding discussions, fostering participation, and managing dynamics, we help teams achieve more together.',
      cta: 'Unlock Your Team\'s Potential. Let\'s Discuss How Expert Facilitation Can Elevate Your Meetings!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'conflict',
      icon: FiShield,
      title: 'Conflict Resolution & Mediation',
      subtitle: 'Resolve Conflicts with Clarity and Purpose.',
      description: 'Expert guidance for navigating complex disputes and finding mutually beneficial solutions. Through specialized conflict management services, Lillian Adegbola helps individuals and organizations resolve conflicts effectively, restore relationships, and move forward with confidence.',
      cta: 'Resolve Conflicts with Ease. Schedule a Mediation Session Today!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'spiritual',
      icon: FiStar,
      title: 'Spiritual Coach/Advisor',
      subtitle: 'Nurture Your Spirit. Discover Your Path.',
      description: 'Guided spiritual development for those seeking deeper meaning and purpose. Through personalized coaching and mentorship, Lillian Adegbola helps individuals connect with their inner selves and live a more authentic, fulfilling life.',
      cta: 'Embark on Your Spiritual Journey. Schedule a Coaching Session Today!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'management',
      icon: FiSettings,
      title: 'Management Consultant',
      subtitle: 'Elevate Performance. Achieve Sustainable Growth.',
      description: 'As a seasoned Management Consultant, Lillian Adegbola provides strategic guidance to help organizations overcome challenges, optimize operations, and drive growth. With expertise in analysis, strategy, and implementation, she empowers businesses to achieve exceptional results.',
      cta: 'Unlock Your Organization\'s Potential. Let\'s Discuss Your Strategic Needs Today!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'capacity',
      icon: FiTrendingUp,
      title: 'Capacity Development',
      subtitle: 'Strengthen Your Organization. Amplify Your Impact.',
      description: 'Through tailored capacity development initiatives, Lillian Adegbola helps organizations build the skills, systems, and structures needed to achieve their goals. From team training to process improvement, she supports sustainable growth and enhanced effectiveness.',
      cta: 'Build Lasting Capacity. Explore Customized Development Solutions Today!',
      color: 'from-navy-700 to-navy-900'
    },
    {
      id: 'corporate',
      icon: FiBookOpen,
      title: 'Corporate Trainer',
      subtitle: 'Empower Your Team. Drive Business Results.',
      description: 'As a corporate trainer, Lillian Adegbola delivers engaging, results-driven training services that equip teams with the knowledge and skills needed to excel. From leadership development to functional training, she helps organizations unlock their full potential.',
      cta: 'Elevate Your Team\'s Performance. Schedule a Training Session Today!',
      color: 'from-navy-700 to-navy-900'
    }
  ];

  // Listen for service selection events from the navbar
  useEffect(() => {
    const handleServiceSelection = (event) => {
      const { serviceId } = event.detail;
      const serviceIndex = services.findIndex(service => service.id === serviceId);
      if (serviceIndex !== -1) {
        setActiveTab(serviceIndex);
      }
    };

    window.addEventListener('selectService', handleServiceSelection);

    // Also check for hash in URL on component mount
    const hash = window.location.hash;
    if (hash.startsWith('#services-')) {
      const serviceId = hash.replace('#services-', '');
      const serviceIndex = services.findIndex(service => service.id === serviceId);
      if (serviceIndex !== -1) {
        setActiveTab(serviceIndex);
      }
    }

    return () => {
      window.removeEventListener('selectService', handleServiceSelection);
    };
  }, [services]);

  const handleGetStartedClick = () => {
    setShowTransformationModal(true);
  };

  const handleBookingFromModal = () => {
    setShowBookingModal(true);
  };

  return (
    <>
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-luxury-pearl relative overflow-hidden">
        {/* Background decorations - Hidden on mobile */}
        <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/5 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-navy-800/5 rounded-full blur-3xl hidden sm:block"></div>

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
                How I Can Help You
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-navy-800 mb-4 sm:mb-6 leading-tight">
              Empowering Leaders
              <span className="text-luxury-gold font-dancing block mt-2">
                & Transforming Lives
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-700 font-montserrat max-w-4xl mx-auto leading-relaxed px-4">
              As a multi-faceted expert, I have delivered exceptional results for individuals, leaders, and organizations (including businesses and non-profits). Known for my bold, authentic, and transformative approach, I empower and guide ambitious achievers, visionary leaders, and forward-thinking organizations to unlock, unleash and maximize their true and highest potential. As{' '}
              <span className="text-luxury-gold font-semibold">the Queen of Clarity, Rapid Results, and Purpose,</span>{' '}
              my passion is Sustainable Positive Transformation, enduring Impact and Legacy.
            </p>
          </motion.div>

          {/* Services Tabs */}
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              {/* Mobile/Tablet Horizontal Scroll */}
              <div className="lg:hidden overflow-x-auto pb-4 mb-6">
                <div className="flex space-x-2 min-w-max">
                  {services.map((service, index) => (
                    <motion.button
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(index)}
                      className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                        activeTab === index
                          ? 'bg-navy-800 text-white shadow-xl'
                          : 'bg-white text-navy-800 hover:bg-navy-50 shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activeTab === index
                            ? 'bg-gold-400 text-navy-900'
                            : 'bg-navy-100 text-navy-600'
                        }`}>
                          <SafeIcon icon={service.icon} className="text-sm" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-montserrat font-semibold text-xs whitespace-nowrap">
                            {service.title.split(' ')[0]}
                          </h3>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Desktop Vertical Tabs */}
              <div className="space-y-2 sticky top-24 hidden lg:block max-h-[80vh] overflow-y-auto">
                {services.map((service, index) => (
                  <motion.button
                    key={service.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                      activeTab === index
                        ? 'bg-navy-800 text-white shadow-xl'
                        : 'bg-white text-navy-800 hover:bg-navy-50 shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activeTab === index
                          ? 'bg-gold-400 text-navy-900'
                          : 'bg-navy-100 text-navy-600'
                      }`}>
                        <SafeIcon icon={service.icon} className="text-sm" />
                      </div>
                      <div>
                        <h3 className="font-montserrat font-semibold text-xs leading-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${services[activeTab].color} p-6 sm:p-8 text-white relative`}>
                    {/* Enhanced gradient overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                          <SafeIcon icon={services[activeTab].icon} className="text-xl sm:text-2xl text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-playfair font-bold text-white drop-shadow-sm">
                            {services[activeTab].title}
                          </h3>
                          <p className="text-white/95 font-montserrat font-medium drop-shadow-sm text-sm sm:text-base">
                            {services[activeTab].subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <p className="text-gray-700 font-montserrat text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                      {services[activeTab].description}
                    </p>

                    <p className="text-navy-800 font-montserrat font-semibold mb-6 sm:mb-8 text-sm sm:text-base">
                      {services[activeTab].cta}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGetStartedClick}
                      className="bg-gold-gradient text-navy-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center group text-sm sm:text-base"
                    >
                      Get Started Today
                      <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16 lg:mt-20"
          >
            <div className="bg-navy-800 text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold mb-3 sm:mb-4">
                Ready to Transform Your Leadership Journey?
              </h3>
              <p className="text-lg sm:text-xl font-montserrat text-gray-200 mb-6 sm:mb-8 leading-relaxed">
                Let's work together to unlock your potential and achieve{' '}
                <span className="text-gold-400 font-semibold">sustainable positive transformation</span>.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStartedClick}
                className="bg-gold-gradient text-navy-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-montserrat font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Schedule Your Consultation
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

export default Services;