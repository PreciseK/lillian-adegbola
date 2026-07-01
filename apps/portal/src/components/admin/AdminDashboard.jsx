import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { MEMBERSHIP_TIERS } from '../../utils/membershipUtils';

const {
  FiUsers, FiDollarSign, FiTrendingUp, FiBook, FiShoppingCart, FiMessageSquare,
  FiCalendar, FiDownload, FiBarChart3, FiAlertCircle, FiCheckCircle, FiClock,
  FiTarget, FiAward, FiEye, FiEdit3, FiTrash2, FiPlus, FiRefreshCw, FiFilter,
  FiArrowRight
} = FiIcons;

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);

  // Mock admin data - in real app this would come from backend
  const adminStats = {
    totalUsers: 2847,
    activeUsers: 2156,
    newUsersThisMonth: 284,
    totalRevenue: 89420,
    monthlyRevenue: 12680,
    revenueGrowth: 18.5,
    totalCourses: 24,
    activeCourses: 21,
    totalResources: 156,
    totalOrders: 1247,
    pendingOrders: 23,
    communityPosts: 892,
    supportTickets: 45,
    pendingTickets: 12
  };

  const membershipBreakdown = [
    { tier: MEMBERSHIP_TIERS.BASIC, count: 1523, percentage: 53.5, revenue: 0 },
    { tier: MEMBERSHIP_TIERS.PREMIUM, count: 1089, percentage: 38.3, revenue: 32670 },
    { tier: MEMBERSHIP_TIERS.ULTIMATE, count: 235, percentage: 8.2, revenue: 23490 }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user_signup',
      message: 'New Premium user registered',
      user: 'Sarah Johnson',
      timestamp: '2 minutes ago',
      icon: FiUsers,
      color: 'emerald'
    },
    {
      id: 2,
      type: 'course_purchase',
      message: 'Course "Leadership Mastery" purchased',
      user: 'Mike Chen',
      timestamp: '15 minutes ago',
      icon: FiBook,
      color: 'blue'
    },
    {
      id: 3,
      type: 'support_ticket',
      message: 'New support ticket submitted',
      user: 'Emma Davis',
      timestamp: '32 minutes ago',
      icon: FiMessageSquare,
      color: 'orange'
    },
    {
      id: 4,
      type: 'upgrade',
      message: 'User upgraded to Ultimate',
      user: 'Alex Rodriguez',
      timestamp: '1 hour ago',
      icon: FiTrendingUp,
      color: 'purple'
    }
  ];

  const quickStats = [
    {
      title: 'Total Users',
      value: adminStats.totalUsers.toLocaleString(),
      change: `+${adminStats.newUsersThisMonth}`,
      changeType: 'increase',
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Monthly Revenue',
      value: `$${adminStats.monthlyRevenue.toLocaleString()}`,
      change: `+${adminStats.revenueGrowth}%`,
      changeType: 'increase',
      icon: FiDollarSign,
      color: 'emerald'
    },
    {
      title: 'Active Courses',
      value: adminStats.activeCourses,
      change: `${adminStats.totalCourses} total`,
      changeType: 'neutral',
      icon: FiBook,
      color: 'purple'
    },
    {
      title: 'Pending Support',
      value: adminStats.pendingTickets,
      change: `${adminStats.supportTickets} total`,
      changeType: adminStats.pendingTickets > 10 ? 'decrease' : 'neutral',
      icon: FiMessageSquare,
      color: adminStats.pendingTickets > 10 ? 'red' : 'orange'
    }
  ];

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Admin Dashboard</h1>
            <p className="text-gray-600 font-montserrat">Comprehensive platform management and analytics</p>
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
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <SafeIcon icon={FiRefreshCw} className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
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
                  icon={stat.changeType === 'increase' ? FiTrendingUp : stat.changeType === 'decrease' ? FiAlertCircle : FiCheckCircle} 
                  className={`w-4 h-4 ${
                    stat.changeType === 'increase' ? 'text-emerald-500' : 
                    stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-400'
                  }`} 
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
                  stat.changeType === 'increase' ? 'text-emerald-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Membership Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">Membership Distribution</h2>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-montserrat text-gray-500">Live Data</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {membershipBreakdown.map((tier, index) => (
                <div key={tier.tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        tier.tier === MEMBERSHIP_TIERS.BASIC ? 'bg-blue-500' :
                        tier.tier === MEMBERSHIP_TIERS.PREMIUM ? 'bg-gold-500' : 'bg-purple-500'
                      }`} />
                      <span className="font-montserrat font-medium text-navy-800 capitalize">
                        {tier.tier}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-montserrat font-bold text-navy-800">
                        {tier.count.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({tier.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        tier.tier === MEMBERSHIP_TIERS.BASIC ? 'bg-blue-500' :
                        tier.tier === MEMBERSHIP_TIERS.PREMIUM ? 'bg-gold-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${tier.percentage}%` }}
                    />
                  </div>
                  {tier.revenue > 0 && (
                    <p className="text-xs text-gray-500 font-montserrat">
                      Revenue: ${tier.revenue.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-playfair font-bold text-navy-800">
                    {adminStats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-sm font-montserrat text-gray-600">Total Users</p>
                </div>
                <div>
                  <p className="text-lg font-playfair font-bold text-emerald-600">
                    ${adminStats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm font-montserrat text-gray-600">Total Revenue</p>
                </div>
                <div>
                  <p className="text-lg font-playfair font-bold text-blue-600">
                    {((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm font-montserrat text-gray-600">Active Rate</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800">Recent Activity</h3>
              <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-${activity.color}-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <SafeIcon icon={activity.icon} className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-montserrat text-navy-800 font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs font-montserrat text-gray-500">
                      by {activity.user}
                    </p>
                    <p className="text-xs font-montserrat text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-center py-2 text-gold-600 hover:text-gold-700 font-montserrat font-medium text-sm border-t border-gray-200 pt-4">
              View All Activity
            </button>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Manage Users', desc: 'View and edit user accounts', icon: FiUsers, color: 'blue', link: '/admin/users' },
              { title: 'Content Management', desc: 'Manage courses and resources', icon: FiBook, color: 'emerald', link: '/admin/content' },
              { title: 'Order Management', desc: 'Process orders and payments', icon: FiShoppingCart, color: 'purple', link: '/admin/orders' },
              { title: 'Support Center', desc: 'Handle support tickets', icon: FiMessageSquare, color: 'orange', link: '/admin/support' }
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-gold-400 transition-all duration-300 text-left group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 bg-${action.color}-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <SafeIcon icon={action.icon} className="w-5 h-5 text-white" />
                  </div>
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4 text-gray-400 group-hover:text-gold-600" />
                </div>
                <h3 className="font-montserrat font-semibold text-navy-800 mb-1 group-hover:text-gold-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 font-montserrat">
                  {action.desc}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">System Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { service: 'Platform', status: 'operational', uptime: '99.9%' },
              { service: 'Payment System', status: 'operational', uptime: '99.7%' },
              { service: 'Content Delivery', status: 'operational', uptime: '99.8%' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                <div>
                  <h3 className="font-montserrat font-medium text-navy-800">{service.service}</h3>
                  <p className="text-sm text-gray-600 font-montserrat">Uptime: {service.uptime}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-montserrat text-emerald-600 capitalize">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;