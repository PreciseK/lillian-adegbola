import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiCalendar,
  FiMail,
  FiUsers,
  FiEdit3,
  FiTrendingUp,
  FiClock,
  FiCheckCircle
} = FiIcons;

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    unreadMessages: 0,
    newsletterSubscribers: 0,
    publishedPosts: 0,
    thisMonthBookings: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [bookings, messages, subscribers, posts] = await Promise.all([
        supabase.from('bookings_la2024').select('*'),
        supabase.from('contact_messages_la2024').select('*'),
        supabase.from('newsletter_subscribers_la2024').select('*'),
        supabase.from('blog_posts_la2024').select('*')
      ]);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      setStats({
        totalBookings: bookings.data?.length || 0,
        pendingBookings: bookings.data?.filter(b => b.status === 'pending').length || 0,
        unreadMessages: messages.data?.filter(m => m.status === 'unread').length || 0,
        newsletterSubscribers: subscribers.data?.filter(s => s.status === 'active').length || 0,
        publishedPosts: posts.data?.filter(p => p.is_published).length || 0,
        thisMonthBookings: bookings.data?.filter(b => {
          const bookingDate = new Date(b.created_at);
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        }).length || 0
      });

      // Recent activity (last 5 bookings and messages)
      const recentBookings = bookings.data?.slice(-3).map(b => ({
        type: 'booking',
        title: `New booking from ${b.first_name} ${b.last_name}`,
        time: new Date(b.created_at).toLocaleDateString(),
        status: b.status
      })) || [];

      const recentMessages = messages.data?.slice(-2).map(m => ({
        type: 'message',
        title: `New message from ${m.name}`,
        time: new Date(m.created_at).toLocaleDateString(),
        status: m.status
      })) || [];

      setRecentActivity([...recentBookings, ...recentMessages].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      ));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: FiCalendar,
      color: 'bg-blue-500',
      change: `+${stats.thisMonthBookings} this month`
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: FiClock,
      color: 'bg-orange-500',
      change: 'Requires attention'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      icon: FiMail,
      color: 'bg-red-500',
      change: 'New inquiries'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.newsletterSubscribers,
      icon: FiUsers,
      color: 'bg-green-500',
      change: 'Active subscribers'
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts,
      icon: FiEdit3,
      color: 'bg-purple-500',
      change: 'Live articles'
    },
    {
      title: 'Monthly Growth',
      value: stats.thisMonthBookings,
      icon: FiTrendingUp,
      color: 'bg-indigo-500',
      change: 'New bookings'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-playfair font-bold text-navy-800 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 font-montserrat">
          Welcome to your admin dashboard. Here's what's happening with your website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-montserrat text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-3xl font-playfair font-bold text-navy-800 mt-1">
                  {card.value}
                </p>
                <p className="text-gray-500 font-montserrat text-xs mt-1">
                  {card.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={card.icon} className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'booking' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <SafeIcon 
                      icon={activity.type === 'booking' ? FiCalendar : FiMail} 
                      className={`text-sm ${
                        activity.type === 'booking' ? 'text-blue-600' : 'text-green-600'
                      }`} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-montserrat font-medium text-navy-800 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-gray-500 text-xs font-montserrat">
                      {activity.time}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${
                    activity.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    activity.status === 'unread' ? 'bg-red-100 text-red-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 font-montserrat text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full bg-navy-800 text-white p-3 rounded-lg font-montserrat font-medium hover:bg-navy-900 transition-colors"
            >
              View Pending Bookings
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full bg-gold-400 text-navy-900 p-3 rounded-lg font-montserrat font-medium hover:bg-gold-500 transition-colors"
            >
              Create New Blog Post
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-montserrat font-medium hover:bg-green-700 transition-colors"
            >
              Export Newsletter List
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardOverview;