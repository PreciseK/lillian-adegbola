import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiFileText, FiVideo, FiHeadphones, FiImage, FiSearch, FiFilter } = FiIcons;

const Resources = ({ isLoggedIn }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: FiFileText },
    { id: 'templates', name: 'Templates', icon: FiFileText },
    { id: 'videos', name: 'Videos', icon: FiVideo },
    { id: 'audio', name: 'Audio', icon: FiHeadphones },
    { id: 'graphics', name: 'Graphics', icon: FiImage }
  ];

  const resources = [
    {
      id: 1,
      title: 'Goal Setting Workbook',
      description: 'A comprehensive workbook to help you set and achieve your goals',
      category: 'templates',
      type: 'PDF',
      size: '2.5 MB',
      downloads: 1250,
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      premium: false
    },
    {
      id: 2,
      title: 'Morning Routine Checklist',
      description: 'Start your day right with this proven morning routine template',
      category: 'templates',
      type: 'PDF',
      size: '1.2 MB',
      downloads: 890,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      premium: false
    },
    {
      id: 3,
      title: 'Productivity Masterclass',
      description: 'Learn advanced productivity techniques from industry experts',
      category: 'videos',
      type: 'MP4',
      size: '45 MB',
      downloads: 567,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      premium: true
    },
    {
      id: 4,
      title: 'Meditation Audio Series',
      description: 'Guided meditation sessions for stress relief and focus',
      category: 'audio',
      type: 'MP3',
      size: '25 MB',
      downloads: 723,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      premium: false
    },
    {
      id: 5,
      title: 'Social Media Graphics Pack',
      description: 'Professional graphics for your social media presence',
      category: 'graphics',
      type: 'ZIP',
      size: '15 MB',
      downloads: 445,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      premium: true
    },
    {
      id: 6,
      title: 'Business Plan Template',
      description: 'Professional business plan template with examples',
      category: 'templates',
      type: 'DOCX',
      size: '3.1 MB',
      downloads: 334,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      premium: true
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (resource) => {
    if (resource.premium && !isLoggedIn) {
      alert('Please sign in to download premium resources');
      return;
    }
    // Simulate download
    alert(`Downloading ${resource.title}...`);
  };

  return (
    <div className="min-h-screen bg-luxury-pearl py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-playfair font-bold text-navy-800 mb-4">
            Free Resources
          </h1>
          <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto">
            Access our library of valuable resources designed to accelerate your personal and professional growth
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              />
            </div>
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none bg-white font-montserrat"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-montserrat font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gold-500 text-white shadow-lg'
                  : 'bg-white text-navy-700 hover:bg-gold-100 hover:text-gold-700'
              }`}
            >
              <SafeIcon icon={category.icon} className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <img src={resource.image} alt={resource.title} className="w-full h-48 object-cover" />
                {resource.premium && (
                  <div className="absolute top-3 right-3 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-montserrat font-medium">
                    Premium
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 font-montserrat mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between text-sm font-montserrat text-gray-500 mb-4">
                  <span>{resource.type} • {resource.size}</span>
                  <span>{resource.downloads} downloads</span>
                </div>
                <button
                  onClick={() => handleDownload(resource)}
                  className={`w-full py-3 rounded-lg font-montserrat font-medium transition-all duration-200 flex items-center justify-center ${
                    resource.premium && !isLoggedIn
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gold-gradient text-navy-800 hover:shadow-lg'
                  }`}
                  disabled={resource.premium && !isLoggedIn}
                >
                  <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
                  {resource.premium && !isLoggedIn ? 'Sign In Required' : 'Download'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-500 font-montserrat">
              No resources found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Resources;