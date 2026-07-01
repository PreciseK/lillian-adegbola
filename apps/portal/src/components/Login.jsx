import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiLock, FiEye, FiEyeOff, FiStar, FiUsers, FiAward, FiGift, FiTrendingUp } = FiIcons;

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login/signup
    const userData = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      membershipType: 'Premium'
    };
    onLogin(userData);
    navigate('/dashboard');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: FiGift,
      title: 'Premium Resources',
      description: 'Access our exclusive library of templates, guides, and tools'
    },
    {
      icon: FiAward,
      title: 'Expert Courses',
      description: 'Learn from industry-leading courses designed for success'
    },
    {
      icon: FiUsers,
      title: 'Exclusive Community',
      description: 'Connect with like-minded individuals on their growth journey'
    }
  ];

  const stats = [
    { icon: FiUsers, value: '5000+', label: 'Active Members' },
    { icon: FiStar, value: '4.9', label: 'Average Rating' },
    { icon: FiTrendingUp, value: '98%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Branding & Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-8"
            >
              {/* Logo & Brand */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center justify-center lg:justify-start space-x-4 mb-6"
                >
                  <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center">
                    <span className="text-navy-900 font-bold text-3xl font-playfair">LA</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-dancing font-bold text-white">
                      Lillian Adegbola
                    </h1>
                    <p className="text-lg font-montserrat font-bold text-gold-200">
                      The Queen of Clarity & Purpose
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-4">
                    Transform Your Journey to
                    <span className="text-gold-400 font-dancing block text-4xl lg:text-5xl">
                      Success & Purpose
                    </span>
                  </h2>
                  <p className="text-xl text-gray-200 font-montserrat mb-8">
                    Join thousands of members accessing premium resources, expert courses, 
                    and exclusive content designed to elevate your personal and professional growth.
                  </p>
                </motion.div>
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-6"
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-playfair font-bold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 font-montserrat">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gold-400/30"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <SafeIcon icon={stat.icon} className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                    <div className="text-2xl font-playfair font-bold text-white">{stat.value}</div>
                    <div className="text-sm font-montserrat text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-playfair font-bold text-navy-800 mb-2">
                    {isSignUp ? 'Join Our Community' : 'Welcome Back'}
                  </h3>
                  <p className="text-gray-600 font-montserrat">
                    {isSignUp 
                      ? 'Create your account to unlock premium content and find your purpose'
                      : 'Sign in to continue your journey of growth and clarity'
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isSignUp && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={isSignUp}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 font-montserrat"
                        placeholder="Enter your full name"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 font-montserrat"
                        placeholder="Enter your email"
                      />
                      <SafeIcon icon={FiMail} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200 font-montserrat"
                        placeholder="Enter your password"
                      />
                      <SafeIcon icon={FiLock} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-gradient text-navy-800 py-3 rounded-lg font-montserrat font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {isSignUp ? 'Create Account & Access Dashboard' : 'Sign In to Dashboard'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-gold-600 hover:text-gold-700 font-montserrat font-medium"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-montserrat mb-3">
                      What you'll get access to:
                    </p>
                    <div className="flex justify-center space-x-6 text-xs font-montserrat text-gray-600">
                      <span>✓ Premium Courses</span>
                      <span>✓ Exclusive Resources</span>
                      <span>✓ Member Shop</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;