import React, { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiBook, FiFileText, FiVideo, FiDownload, FiPlus, FiEdit3, FiTrash2, FiEye,
  FiSearch, FiFilter, FiUpload, FiCalendar, FiUsers, FiStar, FiTrendingUp,
  FiPlay, FiPause, FiSettings, FiCopy, FiShare2, FiMoreVertical
} = FiIcons;

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    avgRating: 0,
    totalResources: 0,
    totalDownloads: 0,
    resourceCategories: 0,
    storageUsed: '0 GB'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [coursesResponse, resourcesResponse] = await Promise.all([
        supabase.from('courses_la2024').select('*').order('created_at', { ascending: false }),
        supabase.from('resources_la2024').select('*').order('created_at', { ascending: false })
      ]);

      if (coursesResponse.error) throw coursesResponse.error;
      if (resourcesResponse.error) throw resourcesResponse.error;

      const coursesData = coursesResponse.data || [];
      const resourcesData = resourcesResponse.data || [];

      // Process courses
      const processedCourses = coursesData.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        status: course.is_published ? 'published' : (course.is_draft ? 'draft' : 'published'), // Fallback as status col might not exist
        category: course.category,
        price: course.price,
        students: course.students_count || 0, // Assuming students_count exists or 0
        rating: course.rating || 5.0,
        lessons: course.lessons_count || 0,
        duration: course.duration,
        createdAt: course.created_at,
        thumbnail: course.image_url || 'https://via.placeholder.com/150'
      }));

      // Process resources
      const processedResources = resourcesData.map(resource => ({
        id: resource.id,
        title: resource.title,
        type: resource.type || 'File',
        category: resource.category || 'General',
        downloads: resource.downloads || 0,
        size: resource.size || 'N/A',
        status: 'published', // Resources match published if they exist
        createdAt: resource.created_at,
        url: resource.url
      }));

      setCourses(processedCourses);
      setResources(processedResources);
      calculateStats(processedCourses, processedResources);

    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (courseData, resourceData) => {
    // Course Stats
    const totalCourses = courseData.length;
    const publishedCourses = courseData.filter(c => c.status === 'published').length;
    const totalStudents = courseData.reduce((sum, c) => sum + c.students, 0);
    const avgRating = totalCourses > 0
      ? (courseData.reduce((sum, c) => sum + c.rating, 0) / totalCourses).toFixed(1)
      : 0;

    // Resource Stats
    const totalResources = resourceData.length;
    const totalDownloads = resourceData.reduce((sum, r) => sum + r.downloads, 0);
    const uniqueCategories = new Set(resourceData.map(r => r.category)).size;

    setStats({
      totalCourses,
      publishedCourses,
      totalStudents,
      avgRating,
      totalResources,
      totalDownloads,
      resourceCategories: uniqueCategories,
      storageUsed: '2.4GB' // Placeholder
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-emerald-600 bg-emerald-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderCourses = () => (
    <div className="space-y-6">
      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Courses', value: stats.totalCourses.toString(), icon: FiBook, color: 'blue' },
          { title: 'Published', value: stats.publishedCourses.toString(), icon: FiPlay, color: 'emerald' },
          { title: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: FiUsers, color: 'purple' },
          { title: 'Avg Rating', value: stats.avgRating.toString(), icon: FiStar, color: 'gold' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-playfair font-bold text-navy-800">{stat.value}</p>
            <p className="text-sm font-montserrat text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Course List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-playfair font-bold text-navy-800">Courses</h3>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              New Course
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {courses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-playfair font-bold text-navy-800">{course.title}</h4>
                      <p className="text-sm text-gray-600 font-montserrat">{course.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 mt-2 text-sm font-montserrat text-gray-500">
                    <span>{course.students} students</span>
                    <span>{course.lessons} lessons</span>
                    <span>{course.duration}</span>
                    <span className="flex items-center">
                      <SafeIcon icon={FiStar} className="w-3 h-3 text-yellow-400 mr-1" />
                      {course.rating}
                    </span>
                    <span className="font-medium text-emerald-600">${course.price}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      {/* Resource Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Resources', value: stats.totalResources.toString(), icon: FiFileText, color: 'blue' },
          { title: 'Downloads', value: stats.totalDownloads > 1000 ? `${(stats.totalDownloads / 1000).toFixed(1)}K` : stats.totalDownloads.toString(), icon: FiDownload, color: 'emerald' },
          { title: 'Categories', value: stats.resourceCategories.toString(), icon: FiFilter, color: 'purple' },
          { title: 'Storage Used', value: stats.storageUsed, icon: FiUpload, color: 'orange' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-playfair font-bold text-navy-800">{stat.value}</p>
            <p className="text-sm font-montserrat text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Resource List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-playfair font-bold text-navy-800">Resources</h3>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
              Upload Resource
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Resource</th>
                <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Downloads</th>
                <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Size</th>
                <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-sm font-montserrat font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-montserrat font-medium text-navy-800">{resource.title}</p>
                    <p className="text-sm text-gray-500 font-montserrat">
                      Created {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-montserrat font-medium">
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-montserrat text-gray-700">{resource.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-montserrat text-gray-700">{resource.downloads.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-montserrat text-gray-700">{resource.size}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Content Management</h1>
            <p className="text-gray-600 font-montserrat">Manage courses, resources, and learning materials</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-6"
        >
          <div className="flex space-x-6 border-b border-gray-200">
            {[
              { id: 'courses', name: 'Courses', icon: FiBook },
              { id: 'resources', name: 'Resources', icon: FiFileText },
              { id: 'analytics', name: 'Analytics', icon: FiTrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-4 px-2 font-montserrat font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'text-gold-600 border-b-2 border-gold-600'
                  : 'text-gray-600 hover:text-navy-800'
                  }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mt-6">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'resources' && renderResources()}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <SafeIcon icon={FiTrendingUp} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">Content Analytics</h3>
              <p className="text-gray-600 font-montserrat">Detailed analytics coming soon...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentManagement;