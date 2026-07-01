import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiHelpCircle, FiSearch, FiBook, FiMessageCircle, FiMail, FiPhone,
  FiChevronDown, FiChevronRight, FiExternalLink, FiUser, FiClock,
  FiCheckCircle, FiAlertCircle, FiVideo, FiFileText, FiHeadphones
} = FiIcons;

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const categories = [
    { id: 'all', name: 'All Topics', icon: FiBook },
    { id: 'getting-started', name: 'Getting Started', icon: FiUser },
    { id: 'courses', name: 'Courses', icon: FiVideo },
    { id: 'billing', name: 'Billing', icon: FiFileText },
    { id: 'technical', name: 'Technical Issues', icon: FiAlertCircle },
    { id: 'community', name: 'Community', icon: FiMessageCircle }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with my membership?',
      answer: 'Welcome! After logging in, visit your dashboard to explore available courses, download resources, and set your learning goals. We recommend starting with our "Getting Started" guide in the Resources section.'
    },
    {
      id: 2,
      category: 'courses',
      question: 'Can I download course videos for offline viewing?',
      answer: 'Yes! Premium members can download course videos for offline viewing. Look for the download icon next to each lesson. Downloaded content is available for 30 days and requires periodic online sync.'
    },
    {
      id: 3,
      category: 'billing',
      question: 'How can I update my payment information?',
      answer: 'Go to Settings > Billing to update your payment method. You can add new cards, update existing ones, or change your billing address. Changes take effect immediately.'
    },
    {
      id: 4,
      category: 'technical',
      question: 'The videos won\'t play. What should I do?',
      answer: 'First, check your internet connection. Try refreshing the page or clearing your browser cache. If issues persist, try a different browser or contact support with details about your device and browser.'
    },
    {
      id: 5,
      category: 'community',
      question: 'How do I participate in community discussions?',
      answer: 'Visit the Community tab to browse discussions, ask questions, and share insights. Click "New Discussion" to start a topic. Be respectful and follow our community guidelines.'
    },
    {
      id: 6,
      category: 'courses',
      question: 'How do I track my progress?',
      answer: 'Your progress is automatically tracked as you complete lessons. Visit your Dashboard or Analytics page to see detailed progress reports, completion rates, and learning insights.'
    },
    {
      id: 7,
      category: 'billing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from Settings > Billing. You\'ll retain access until the end of your current billing period. No cancellation fees apply.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a reset link within a few minutes. Check your spam folder if you don\'t see it in your inbox.'
    }
  ];

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      icon: FiVideo,
      color: 'blue',
      items: ['Platform Overview', 'Course Navigation', 'Goal Setting', 'Community Features']
    },
    {
      title: 'User Guide',
      description: 'Comprehensive documentation and guides',
      icon: FiFileText,
      color: 'emerald',
      items: ['Quick Start Guide', 'Feature Documentation', 'Best Practices', 'Troubleshooting']
    },
    {
      title: 'Webinar Recordings',
      description: 'Recorded training sessions and Q&As',
      icon: FiHeadphones,
      color: 'purple',
      items: ['Platform Training', 'Success Stories', 'Monthly Q&A', 'Feature Updates']
    }
  ];

  const contactMethods = [
    {
      method: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Mon-Fri, 9 AM - 6 PM EST',
      icon: FiMessageCircle,
      color: 'blue',
      action: 'Start Chat'
    },
    {
      method: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      icon: FiMail,
      color: 'emerald',
      action: 'Send Email'
    },
    {
      method: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Premium members only',
      icon: FiPhone,
      color: 'purple',
      action: 'Call Now'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    alert('Support request submitted! We\'ll get back to you within 24 hours.');
    setSupportForm({ name: '', email: '', subject: '', message: '', priority: 'medium' });
  };

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Help Center</h1>
            <p className="text-gray-600 font-montserrat">Find answers and get support</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-montserrat text-gray-500">Need immediate help?</span>
            <button className="bg-gold-gradient text-navy-800 px-6 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiMessageCircle} className="w-4 h-4 mr-2" />
              Live Chat
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="relative max-w-2xl mx-auto">
            <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Help Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-${resource.color}-500 rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={resource.icon} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-navy-800">{resource.title}</h3>
                  <p className="text-sm text-gray-600 font-montserrat">{resource.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {resource.items.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2 text-sm font-montserrat text-gray-600 hover:text-gold-600 cursor-pointer">
                    <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-playfair font-bold text-navy-800 mb-4">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-gold-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <SafeIcon icon={category.icon} className="w-4 h-4" />
                    <span className="font-montserrat font-medium text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* FAQ List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">
                Frequently Asked Questions
                {searchTerm && (
                  <span className="text-sm font-montserrat font-normal text-gray-600 ml-2">
                    ({filteredFAQs.length} results)
                  </span>
                )}
              </h2>
              
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-montserrat font-medium text-navy-800">{faq.question}</span>
                      <SafeIcon 
                        icon={expandedFAQ === faq.id ? FiChevronDown : FiChevronRight} 
                        className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
                      />
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 text-gray-600 font-montserrat">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <SafeIcon icon={FiHelpCircle} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-montserrat">No FAQs found matching your search.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Contact Support Sidebar */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Contact Support</h3>
              <div className="space-y-4">
                {contactMethods.map((contact, index) => (
                  <div key={index} className="p-4 bg-luxury-pearl rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 bg-${contact.color}-500 rounded-full flex items-center justify-center`}>
                        <SafeIcon icon={contact.icon} className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-montserrat font-medium text-navy-800">{contact.method}</h4>
                    </div>
                    <p className="text-sm text-gray-600 font-montserrat mb-2">{contact.description}</p>
                    <p className="text-xs text-gray-500 font-montserrat mb-3">{contact.availability}</p>
                    <button className="w-full bg-gold-gradient text-navy-800 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 text-sm">
                      {contact.action}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Support Ticket Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Submit a Ticket</h3>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={supportForm.name}
                    onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                    required
                  />
                </div>
                <div>
                  <select
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm({...supportForm, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Describe your issue in detail..."
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-gradient text-navy-800 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Submit Ticket
                </button>
              </form>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-sm text-gray-600">Platform</span>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-montserrat text-emerald-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-sm text-gray-600">Video Streaming</span>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-montserrat text-emerald-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-sm text-gray-600">Downloads</span>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-montserrat text-emerald-600">Operational</span>
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

export default Help;