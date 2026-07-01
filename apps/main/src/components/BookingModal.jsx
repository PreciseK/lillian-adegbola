import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBooking } from '../hooks/useBooking';

const { FiX, FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiBriefcase, FiMessageCircle, FiCheck } = FiIcons;

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    timezone: 'EST'
  });

  const { submitBooking, loading, error } = useBooking();

  const services = [
    {
      id: 'keynote',
      name: 'Keynote Speaker Services',
      duration: '30 min',
      description: 'Inspire Action. Transform Mindsets.',
      price: 'Free Consultation'
    },
    {
      id: 'leadership',
      name: 'Leadership Coaching',
      duration: '30 min',
      description: 'Unlock Your Potential. Lead with Confidence.',
      price: 'Complimentary Discovery Call'
    },
    {
      id: 'executive',
      name: 'Executive Coaching',
      duration: '30 min',
      description: 'Elevate Performance. Achieve Exceptional Results.',
      price: 'Complimentary Discovery Call'
    },
    {
      id: 'retreats',
      name: 'Destination Retreat Leader',
      duration: '30 min',
      description: 'Reconnect. Refocus. Renew.',
      price: 'Free Consultation'
    },
    {
      id: 'advisory',
      name: 'Strategic Advisory',
      duration: '30 min',
      description: 'Strategic Insight. Trusted Counsel.',
      price: 'Free Consultation'
    },
    {
      id: 'business',
      name: 'Business Coaching',
      duration: '30 min',
      description: 'Grow Your Business. Unlock Potential.',
      price: 'Complimentary Discovery Call'
    },
    {
      id: 'organizational',
      name: 'Organizational Development',
      duration: '30 min',
      description: 'Build High-Performing Teams. Drive Results.',
      price: 'Free Consultation'
    },
    {
      id: 'life',
      name: 'Life Coaching',
      duration: '30 min',
      description: 'Unlock Your Potential. Live with Purpose.',
      price: 'Complimentary Discovery Call'
    },
    {
      id: 'facilitation',
      name: 'Facilitation Expertise',
      duration: '30 min',
      description: 'Transform Conversations. Unlock Collaboration.',
      price: 'Free Consultation'
    },
    {
      id: 'conflict',
      name: 'Conflict Resolution & Mediation',
      duration: '30 min',
      description: 'Resolve Conflicts with Clarity and Purpose.',
      price: 'Free Consultation'
    },
    {
      id: 'spiritual',
      name: 'Spiritual Coach/Advisor',
      duration: '30 min',
      description: 'Nurture Your Spirit. Discover Your Path.',
      price: 'Complimentary Discovery Call'
    },
    {
      id: 'management',
      name: 'Management Consultant',
      duration: '30 min',
      description: 'Elevate Performance. Achieve Sustainable Growth.',
      price: 'Free Consultation'
    },
    {
      id: 'capacity',
      name: 'Capacity Development',
      duration: '30 min',
      description: 'Strengthen Your Organization. Amplify Your Impact.',
      price: 'Free Consultation'
    },
    {
      id: 'corporate',
      name: 'Corporate Trainer',
      duration: '30 min',
      description: 'Empower Your Team. Drive Business Results.',
      price: 'Free Consultation'
    }
  ];

  // Generate next 14 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })
        });
      }
    }
    return dates;
  };

  const timeSlots = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      ...formData
    };

    const result = await submitBooking(bookingData);
    if (result.success) {
      setStep(4); // Show confirmation
    } else {
      alert('Error submitting booking: ' + result.error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setStep(1);
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      timezone: 'EST'
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-navy-800 text-white p-6 rounded-t-3xl relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                <SafeIcon icon={FiCalendar} className="text-navy-900 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-playfair font-bold">Book Your Consultation</h2>
                <p className="text-gray-300 font-montserrat">Transform your leadership journey</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step >= stepNumber
                        ? 'bg-gold-400 text-navy-900'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {step > stepNumber ? <SafeIcon icon={FiCheck} /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-colors ${
                        step > stepNumber ? 'bg-gold-400' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
                    Choose Your Service
                  </h3>
                  <p className="text-gray-600 font-montserrat">
                    Select the type of consultation that best fits your needs
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {services.map((service) => (
                    <motion.button
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        selectedService === service.id
                          ? 'border-gold-400 bg-gold-400/10'
                          : 'border-gray-200 hover:border-gold-400/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-playfair font-bold text-navy-800 text-sm">
                          {service.name}
                        </h4>
                        <span className="text-xs text-gold-600 font-montserrat font-semibold">
                          {service.duration}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 font-montserrat text-xs mb-2">
                        {service.description}
                      </p>
                      
                      <p className="text-gold-600 font-montserrat font-semibold text-xs">
                        {service.price}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectedService && setStep(2)}
                    disabled={!selectedService}
                    className="bg-navy-800 text-white px-8 py-3 rounded-full font-montserrat font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Select Date & Time
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
                    Select Date & Time
                  </h3>
                  <p className="text-gray-600 font-montserrat">
                    Choose your preferred 30-minute consultation slot (EST timezone)
                  </p>
                </div>

                {/* Date Selection */}
                <div>
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                    Available Dates
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {getAvailableDates().map((date) => (
                      <motion.button
                        key={date.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(date.value)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          selectedDate === date.value
                            ? 'bg-gold-400 text-navy-900'
                            : 'bg-gray-100 text-navy-800 hover:bg-gold-100'
                        }`}
                      >
                        <div className="font-montserrat font-semibold text-sm">
                          {date.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                      Available Times (EST) - 30 Minutes Each
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <motion.button
                          key={time}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-xl text-center transition-all ${
                            selectedTime === time
                              ? 'bg-gold-400 text-navy-900'
                              : 'bg-gray-100 text-navy-800 hover:bg-gold-100'
                          }`}
                        >
                          <div className="font-montserrat font-semibold text-sm">
                            {time}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(1)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-montserrat font-semibold"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectedDate && selectedTime && setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className="bg-navy-800 text-white px-8 py-3 rounded-full font-montserrat font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Your Information
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
                    Your Information
                  </h3>
                  <p className="text-gray-600 font-montserrat">
                    Please provide your contact details for your 30-minute consultation
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-navy-800 font-montserrat font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-navy-800 font-montserrat font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-navy-800 font-montserrat font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-navy-800 font-montserrat font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-navy-800 font-montserrat font-medium mb-2">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-navy-800 font-montserrat font-medium mb-2">
                      What would you like to discuss in your 30-minute consultation?
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                      placeholder="Share your goals, challenges, or what you hope to achieve in our session..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStep(2)}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-montserrat font-semibold"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gold-gradient text-navy-900 px-8 py-3 rounded-full font-montserrat font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Booking...' : 'Book 30-Min Consultation'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <SafeIcon icon={FiCheck} className="text-green-600 text-3xl" />
                </div>

                <div>
                  <h3 className="text-2xl font-playfair font-bold text-navy-800 mb-2">
                    30-Minute Consultation Booked!
                  </h3>
                  <p className="text-gray-600 font-montserrat">
                    Your consultation has been successfully scheduled
                  </p>
                </div>

                <div className="bg-luxury-pearl p-6 rounded-2xl text-left max-w-md mx-auto">
                  <h4 className="font-playfair font-bold text-navy-800 mb-4">
                    Booking Details:
                  </h4>
                  <div className="space-y-2 font-montserrat text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="text-navy-800 font-semibold">
                        {services.find(s => s.id === selectedService)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-navy-800 font-semibold">30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-navy-800 font-semibold">
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="text-navy-800 font-semibold">
                        {selectedTime} EST
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 font-montserrat">
                  <p className="mb-2">
                    📧 A confirmation email has been sent to <strong>{formData.email}</strong>
                  </p>
                  <p>
                    📱 You'll receive calendar invite and meeting details shortly
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="bg-navy-800 text-white px-8 py-3 rounded-full font-montserrat font-semibold"
                >
                  Close
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;