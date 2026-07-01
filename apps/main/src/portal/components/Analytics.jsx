import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiBarChart3, FiTrendingUp, FiTrendingDown, FiUsers, FiClock, 
  FiBook, FiTarget, FiAward, FiCalendar, FiDownload, FiEye,
  FiFilter, FiRefreshCw
} = FiIcons;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock analytics data
  const stats = [
    {
      title: 'Learning Hours',
      value: '48.5',
      change: '+12.3%',
      trend: 'up',
      icon: FiClock,
      color: 'blue',
      description: 'Total hours spent learning'
    },
    {
      title: 'Courses Completed',
      value: '12',
      change: '+25%',
      trend: 'up',
      icon: FiBook,
      color: 'emerald',
      description: 'Courses finished this period'
    },
    {
      title: 'Goals Achieved',
      value: '8',
      change: '+33.3%',
      trend: 'up',
      icon: FiTarget,
      color: 'purple',
      description: 'Goals completed successfully'
    },
    {
      title: 'Engagement Score',
      value: '94%',
      change: '+5.2%',
      trend: 'up',
      icon: FiTrendingUp,
      color: 'orange',
      description: 'Overall engagement level'
    }
  ];

  const learningProgress = [
    { month: 'Jan', hours: 35, courses: 2, goals: 1 },
    { month: 'Feb', hours: 42, courses: 3, goals: 2 },
    { month: 'Mar', hours: 48, courses: 4, goals: 3 },
    { month: 'Apr', hours: 38, courses: 2, goals: 1 },
    { month: 'May', hours: 55, courses: 5, goals: 4 },
    { month: 'Jun', hours: 48, courses: 3, goals: 2 }
  ];

  const coursePerformance = [
    {
      course: 'Digital Marketing Mastery',
      completion: 95,
      timeSpent: 12.5,
      score: 92,
      status: 'completed'
    },
    {
      course: 'Personal Branding Excellence',
      completion: 75,
      timeSpent: 8.2,
      score: 88,
      status: 'in-progress'
    },
    {
      course: 'Leadership Fundamentals',
      completion: 45,
      timeSpent: 6.8,
      score: 85,
      status: 'in-progress'
    },
    {
      course: 'Entrepreneurship Bootcamp',
      completion: 30,
      timeSpent: 4.2,
      score: 90,
      status: 'in-progress'
    }
  ];

  const goalAnalytics = [
    {
      category: 'Learning',
      total: 8,
      completed: 6,
      inProgress: 2,
      success: 75
    },
    {
      category: 'Career',
      total: 5,
      completed: 3,
      inProgress: 2,
      success: 60
    },
    {
      category: 'Personal',
      total: 6,
      completed: 5,
      inProgress: 1,
      success: 83
    },
    {
      category: 'Health',
      total: 3,
      completed: 2,
      inProgress: 1,
      success: 67
    }
  ];

  const achievements = [
    { name: 'Quick Learner', earned: '2024-01-15', points: 100 },
    { name: 'Course Completer', earned: '2024-02-03', points: 150 },
    { name: 'Goal Crusher', earned: '2024-02-20', points: 200 },
    { name: 'Consistency Champion', earned: '2024-03-01', points: 250 }
  ];

  const SimpleBarChart = ({ data, dataKey, color = 'blue' }) => (
    <div className="flex items-end space-x-2 h-32">
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d[dataKey]));
        const height = (item[dataKey] / maxValue) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
              style={{ height: `${height}%` }}
            />
            <span className="text-xs font-montserrat text-gray-600 mt-1">{item.month}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Analytics & Insights</h1>
            <p className="text-gray-600 font-montserrat">Track your progress and performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-gold-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <SafeIcon 
                  icon={stat.trend === 'up' ? FiTrendingUp : FiTrendingDown} 
                  className={`w-4 h-4 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`} 
                />
              </div>
              <div>
                <p className="text-2xl font-playfair font-bold text-navy-800 mb-1">{stat.value}</p>
                <p className="text-sm font-montserrat text-gray-600 mb-2">{stat.title}</p>
                <p className={`text-xs font-montserrat ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change} vs last period
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Learning Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">Learning Progress</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-gold-500"
                >
                  <option value="hours">Learning Hours</option>
                  <option value="courses">Courses Completed</option>
                  <option value="goals">Goals Achieved</option>
                </select>
              </div>
            </div>
            <SimpleBarChart 
              data={learningProgress} 
              dataKey={selectedMetric === 'hours' ? 'hours' : selectedMetric === 'courses' ? 'courses' : 'goals'}
              color="gold"
            />
          </motion.div>

          {/* Achievement Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiAward} className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-montserrat font-medium text-navy-800 text-sm">
                      {achievement.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-montserrat">
                        {new Date(achievement.earned).toLocaleDateString()}
                      </p>
                      <span className="text-xs font-montserrat font-medium text-gold-600">
                        +{achievement.points} pts
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Course Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Course Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-montserrat font-medium text-navy-700 py-3">Course</th>
                  <th className="text-left font-montserrat font-medium text-navy-700 py-3">Completion</th>
                  <th className="text-left font-montserrat font-medium text-navy-700 py-3">Time Spent</th>
                  <th className="text-left font-montserrat font-medium text-navy-700 py-3">Score</th>
                  <th className="text-left font-montserrat font-medium text-navy-700 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((course, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4">
                      <p className="font-montserrat font-medium text-navy-800">{course.course}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gold-500 h-2 rounded-full"
                            style={{ width: `${course.completion}%` }}
                          />
                        </div>
                        <span className="text-sm font-montserrat text-gray-600">{course.completion}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-montserrat text-navy-800">{course.timeSpent}h</span>
                    </td>
                    <td className="py-4">
                      <span className="font-montserrat font-medium text-gold-600">{course.score}%</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${
                        course.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Goal Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Goal Performance by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goalAnalytics.map((category, index) => (
              <div key={index} className="text-center">
                <h3 className="font-montserrat font-medium text-navy-800 mb-3">{category.category}</h3>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-gold-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${category.success}, 100`}
                      strokeLinecap="round"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-playfair font-bold text-navy-800">{category.success}%</span>
                  </div>
                </div>
                <div className="space-y-1 text-sm font-montserrat">
                  <p className="text-gray-600">Total: {category.total}</p>
                  <p className="text-emerald-600">Completed: {category.completed}</p>
                  <p className="text-blue-600">In Progress: {category.inProgress}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;