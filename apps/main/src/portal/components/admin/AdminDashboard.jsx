import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { MEMBERSHIP_TIERS } from '../../utils/membershipUtils';
import supabase from '../../../lib/supabase';

const {
  FiUsers, FiDollarSign, FiTrendingUp, FiBook, FiShoppingCart, FiMessageSquare,
  FiCalendar, FiDownload, FiBarChart3, FiAlertCircle, FiCheckCircle, FiClock,
  FiTarget, FiAward, FiEye, FiEdit3, FiTrash2, FiPlus, FiRefreshCw, FiFilter,
  FiArrowRight
} = FiIcons;

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalResources: 0,
    totalOrders: 0,
    pendingOrders: 0,
    communityPosts: 0,
    supportTickets: 0,
    pendingTickets: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const [membershipBreakdown, setMembershipBreakdown] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Counts
      const { count: totalUsers } = await supabase
        .from('profiles_la2024')
        .select('*', { count: 'exact', head: true });

      const { count: totalCourses } = await supabase
        .from('courses_la2024')
        .select('*', { count: 'exact', head: true });

      const { count: totalResources } = await supabase
        .from('resources_la2024')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch Membership Distribution
      const tiers = [MEMBERSHIP_TIERS.BASIC, MEMBERSHIP_TIERS.PREMIUM, MEMBERSHIP_TIERS.ULTIMATE];
      const membershipData = await Promise.all(
        tiers.map(async (tier) => {
          const { count } = await supabase
            .from('profiles_la2024')
            .select('*', { count: 'exact', head: true })
            .eq('membership_tier', tier);
          return { tier, count: count || 0 };
        })
      );

      const totalCalculatedUsers = membershipData.reduce((acc, curr) => acc + curr.count, 0) || 1; // avoid divide by zero
      const formattedMembership = membershipData.map(item => ({
        tier: item.tier,
        count: item.count,
        percentage: ((item.count / totalCalculatedUsers) * 100).toFixed(1),
        revenue: item.count * (item.tier === MEMBERSHIP_TIERS.PREMIUM ? 29 : item.tier === MEMBERSHIP_TIERS.ULTIMATE ? 99 : 0) // Estimated MRR
      }));
      setMembershipBreakdown(formattedMembership);

      // 3. Fetch Financials (Orders)
      const { data: orders } = await supabase
        .from('orders_la2024')
        .select('total, created_at, status')
        .eq('status', 'completed');

      const totalRev = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

      // Calculate Monthly Revenue (Orders this month)
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthlyRev = orders
        ?.filter(o => o.created_at >= firstDayOfMonth)
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0) || 0;

      // 4. Fetch Recent Activity (Signups + Orders)
      const { data: recentUsers } = await supabase
        .from('profiles_la2024')
        .select('id, first_name, last_name, created_at, membership_tier')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentOrders } = await supabase
        .from('orders_la2024')
        .select('id, total, created_at, user_id, status') // join profile if possible, or fetch separate
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch user names for orders if needed
      // For simplicity, we just format the activities we have
      let activities = [];

      if (recentUsers) {
        activities.push(...recentUsers.map(u => ({
          id: `u-${u.id}`,
          type: 'user_signup',
          message: `New ${u.membership_tier} user registered`,
          user: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Anonymous User',
          timestamp: new Date(u.created_at),
          icon: FiUsers,
          color: 'blue'
        })));
      }

      if (recentOrders) {
        // We'd ideally need the user name here. 
        // For now, we'll genericize it or quick-fetch if critical. 
        // Let's assume 'Customer' to save an N+1 query for this sprint.
        activities.push(...recentOrders.map(o => ({
          id: `o-${o.id}`,
          type: 'course_purchase',
          message: `Order #${o.id.slice(0, 8)} ${o.status}`,
          user: 'Customer',
          timestamp: new Date(o.created_at),
          icon: FiShoppingCart,
          color: 'emerald'
        })));
      }

      // Sort and take top 5
      activities.sort((a, b) => b.timestamp - a.timestamp);
      const topActivity = activities.slice(0, 5).map(act => ({
        ...act,
        timestamp: getTimeAgo(act.timestamp)
      }));
      setRecentActivity(topActivity);

      setAdminStats(prev => ({
        ...prev,
        totalUsers: totalUsers || 0,
        totalCourses: totalCourses || 0,
        totalResources: totalResources || 0,
        totalRevenue: totalRev,
        monthlyRevenue: monthlyRev,
        activeUsers: formattedMembership.find(m => m.tier !== 'free')?.count || 0 // Rough proxy for active paid
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const refreshData = () => {
    fetchDashboardData();
  };

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

  // Removed duplicate refreshData function

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
                  className={`w-4 h-4 ${stat.changeType === 'increase' ? 'text-emerald-500' :
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
                <p className={`text-xs font-montserrat ${stat.changeType === 'increase' ? 'text-emerald-600' :
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
                      <div className={`w-4 h-4 rounded-full ${tier.tier === MEMBERSHIP_TIERS.BASIC ? 'bg-blue-500' :
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
                      className={`h-2 rounded-full ${tier.tier === MEMBERSHIP_TIERS.BASIC ? 'bg-blue-500' :
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