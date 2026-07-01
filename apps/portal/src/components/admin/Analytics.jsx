import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiBarChart3, FiTrendingUp, FiTrendingDown, FiUsers, FiBook, FiDollarSign,
  FiCalendar, FiDownload, FiRefreshCw, FiFilter, FiEye, FiTarget, FiAward,
  FiShoppingCart, FiMessageSquare, FiClock, FiPercent, FiGlobe, FiMobile
} = FiIcons;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock analytics data
  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '$89,420',
      change: '+18.5%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'emerald'
    },
    {
      title: 'Active Users',
      value: '2,156',
      change: '+12.3%',
      trend: 'up',
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Course Completions',
      value: '1,847',
      change: '+25.4%',
      trend: 'up',
      icon: FiBook,
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      trend: 'up',
      icon: FiPercent,
      color: 'orange'
    }
  ];

  const userEngagement = [
    { month: 'Jan', sessions: 3240, pageViews: 15680, avgTime: 4.2 },
    { month: 'Feb', sessions: 3890, pageViews: 18920, avgTime: 4.8 },
    { month: 'Mar', sessions: 4120, pageViews: 21340, avgTime: 5.1 },
    { month: 'Apr', sessions: 3850, pageViews: 19280, avgTime: 4.9 },
    { month: 'May', sessions: 4560, pageViews: 23450, avgTime: 5.4 },
    { month: 'Jun', sessions: 4890, pageViews: 25120, avgTime: 5.8 }
  ];

  const topPages = [
    { page: '/dashboard', views: 45680, bounce: '32%', avgTime: '3:24' },
    { page: '/courses', views: 38920, bounce: '28%', avgTime: '4:16' },
    { page: '/resources', views: 32140, bounce: '35%', avgTime: '2:45' },
    { page: '/community', views: 28560, bounce: '22%', avgTime: '5:32' },
    { page: '/shop', views: 21890, bounce: '45%', avgTime: '2:18' }
  ];

  const deviceBreakdown = [
    { device: 'Desktop', percentage: 65, users: 1402 },
    { device: 'Mobile', percentage: 28, users: 603 },
    { device: 'Tablet', percentage: 7, users: 151 }
  ];

  const geographicData = [
    { country: 'United States', users: 1205, percentage: 56 },
    { country: 'Canada', users: 324, percentage: 15 },
    { country: 'United Kingdom', users: 289, percentage: 13 },
    { country: 'Australia', users: 156, percentage: 7 },
    { country: 'Germany', users: 182, percentage: 9 }
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
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Analytics Dashboard</h1>
            <p className="text-gray-600 font-montserrat">Comprehensive insights and performance metrics</p>
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
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
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
                <p className="text-2xl font-playfair font-bold text-navy-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-montserrat text-gray-600 mb-2">
                  {stat.title}
                </p>
                <p className={`text-xs font-montserrat ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change} vs last period
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Engagement Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">User Engagement</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-gold-500"
              >
                <option value="sessions">Sessions</option>
                <option value="pageViews">Page Views</option>
                <option value="avgTime">Avg Time</option>
              </select>
            </div>
            <SimpleBarChart 
              data={userEngagement} 
              dataKey={selectedMetric === 'sessions' ? 'sessions' : selectedMetric === 'pageViews' ? 'pageViews' : 'avgTime'} 
              color="gold" 
            />
          </motion.div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Device Usage</h3>
            <div className="space-y-4">
              {deviceBreakdown.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={device.device === 'Desktop' ? FiGlobe : FiMobile} className="w-4 h-4 text-gray-600" />
                      <span className="font-montserrat font-medium text-navy-800">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-montserrat font-bold text-navy-800">{device.users}</span>
                      <span className="text-sm text-gray-500 ml-2">({device.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        device.device === 'Desktop' ? 'bg-blue-500' :
                        device.device === 'Mobile' ? 'bg-emerald-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-playfair font-bold text-navy-800">Top Pages</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Page</th>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Views</th>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Bounce Rate</th>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-montserrat font-medium text-navy-800">{page.page}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat text-gray-700">{page.views.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-montserrat ${
                        parseInt(page.bounce) > 40 ? 'text-red-600' : 
                        parseInt(page.bounce) > 30 ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                        {page.bounce}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat text-gray-700">{page.avgTime}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Geographic Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Geographic Distribution</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {geographicData.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-montserrat text-navy-800">{country.country}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gold-500 h-2 rounded-full" 
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                    <span className="font-montserrat font-medium text-navy-800 w-12 text-right">
                      {country.users}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                  {geographicData.map((country, index) => {
                    const previousPercentage = geographicData.slice(0, index).reduce((sum, c) => sum + c.percentage, 0);
                    const colors = ['text-blue-500', 'text-emerald-500', 'text-purple-500', 'text-orange-500', 'text-pink-500'];
                    return (
                      <path
                        key={index}
                        className={colors[index % colors.length]}
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${country.percentage}, 100`}
                        strokeDashoffset={-previousPercentage}
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-playfair font-bold text-navy-800">
                      {geographicData.reduce((sum, c) => sum + c.users, 0)}
                    </div>
                    <div className="text-sm font-montserrat text-gray-600">Total Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;