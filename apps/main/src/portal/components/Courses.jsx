import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiPlay, FiClock, FiUsers, FiStar, FiSearch, FiFilter, FiShoppingCart } = FiIcons;

const Courses = ({ isLoggedIn }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'business', name: 'Business' },
    { id: 'personal', name: 'Personal Development' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'leadership', name: 'Leadership' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses_la2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = (course) => {
    if (!isLoggedIn) {
      alert('Please sign in to purchase courses');
      return;
    }
    alert(`Purchasing ${course.title} for ₦${course.price}`);
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
            Premium Courses
          </h1>
          <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto">
            Unlock your potential with our expertly crafted courses designed to accelerate your growth
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
                placeholder="Search courses..."
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

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-playfair font-bold text-navy-800 mb-6">Featured Courses</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {courses.filter(course => course.is_featured).map((course, index) => (
              <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img src={course.image_url} alt={course.title} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-montserrat font-medium">
                    Featured
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <SafeIcon icon={FiPlay} className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gold-600 font-montserrat font-medium uppercase tracking-wide">
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-montserrat text-gray-600">{course.rating || 0}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 font-montserrat mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm font-montserrat text-gray-500 mb-4">
                    <div className="flex items-center">
                      <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
                      <span>{course.students_count?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-playfair font-bold text-gold-600">₦{course.price}</span>
                      {course.original_price && (
                        <span className="text-lg text-gray-400 line-through">₦{course.original_price}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handlePurchase(course)}
                      className="bg-gold-gradient text-navy-800 px-6 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center"
                    >
                      <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-2" />
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* All Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-playfair font-bold text-navy-800 mb-6">All Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <SafeIcon icon={FiPlay} className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gold-600 font-montserrat font-medium uppercase tracking-wide">
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-montserrat text-gray-600">{course.rating || 0}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-montserrat mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-xs font-montserrat text-gray-500 mb-4">
                    <span>{course.lessons_count || 0} lessons</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-playfair font-bold text-gold-600">₦{course.price}</span>
                      {course.original_price && (
                        <span className="text-sm text-gray-400 line-through">₦{course.original_price}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handlePurchase(course)}
                      className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-500 font-montserrat">
              No courses found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;