import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiUsers,
  FiMail,
  FiDownload,
  FiTrash2,
  FiFilter,
  FiCalendar,
  FiTrendingUp
} = FiIcons;

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers_la2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSubscribers(data || []);
      
      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      setStats({
        total: data?.length || 0,
        active: data?.filter(s => s.status === 'active').length || 0,
        unsubscribed: data?.filter(s => s.status === 'unsubscribed').length || 0,
        thisMonth: data?.filter(s => {
          const subDate = new Date(s.created_at);
          return subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear;
        }).length || 0
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setLoading(false);
    }
  };

  const updateSubscriberStatus = async (subscriberId, newStatus) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers_la2024')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriberId);

      if (error) throw error;
      
      setSubscribers(subscribers.map(subscriber => 
        subscriber.id === subscriberId 
          ? { ...subscriber, status: newStatus }
          : subscriber
      ));
      
      // Update stats
      fetchSubscribers();
    } catch (error) {
      console.error('Error updating subscriber:', error);
      alert('Error updating subscriber status');
    }
  };

  const deleteSubscriber = async (subscriberId) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers_la2024')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;
      
      setSubscribers(subscribers.filter(subscriber => subscriber.id !== subscriberId));
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Error deleting subscriber');
    }
  };

  const exportSubscribers = () => {
    const activeSubscribers = subscribers.filter(s => s.status === 'active');
    const csvContent = [
      ['Email', 'Source', 'Date Subscribed'],
      ...activeSubscribers.map(s => [
        s.email,
        s.source,
        new Date(s.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    if (filter === 'all') return true;
    return subscriber.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'unsubscribed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-navy-800 mb-2">
            Newsletter Management
          </h2>
          <p className="text-gray-600 font-montserrat">
            Manage newsletter subscribers and email list
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={exportSubscribers}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiDownload} />
          <span>Export List</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Total Subscribers</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {stats.total}
              </p>
            </div>
            <SafeIcon icon={FiUsers} className="text-2xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Active</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {stats.active}
              </p>
            </div>
            <SafeIcon icon={FiMail} className="text-2xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Unsubscribed</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {stats.unsubscribed}
              </p>
            </div>
            <SafeIcon icon={FiUsers} className="text-2xl text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">This Month</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {stats.thisMonth}
              </p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="text-2xl text-gold-500" />
          </div>
        </div>
      </div>

      {/* Filter and Actions */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiFilter} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 font-montserrat"
          >
            <option value="all">All Subscribers</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
          <span className="text-gray-600 font-montserrat text-sm">
            Showing {filteredSubscribers.length} subscribers
          </span>
        </div>
        
        <div className="text-gray-600 font-montserrat text-sm">
          Growth Rate: {stats.total > 0 ? ((stats.thisMonth / stats.total) * 100).toFixed(1) : 0}% this month
        </div>
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-playfair font-bold text-navy-800">
            Subscribers ({filteredSubscribers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Date Subscribed
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiMail} className="text-navy-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 font-montserrat">
                          {subscriber.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-montserrat capitalize">
                      {subscriber.source || 'Website'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-montserrat">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 font-montserrat">
                      {new Date(subscriber.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {subscriber.status === 'active' ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => updateSubscriberStatus(subscriber.id, 'unsubscribed')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Unsubscribe"
                        >
                          <SafeIcon icon={FiMail} />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => updateSubscriberStatus(subscriber.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                          title="Reactivate"
                        >
                          <SafeIcon icon={FiMail} />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat">
                No subscribers found
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-montserrat">
                {filter === 'all' ? 'No newsletter subscribers yet.' : `No ${filter} subscribers found.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
            Subscription Trends
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-montserrat">This Week</span>
              <span className="font-semibold text-navy-800">
                {subscribers.filter(s => {
                  const subDate = new Date(s.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return subDate >= weekAgo;
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-montserrat">This Month</span>
              <span className="font-semibold text-navy-800">{stats.thisMonth}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-montserrat">Conversion Rate</span>
              <span className="font-semibold text-green-600">
                {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={exportSubscribers}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-montserrat font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiDownload} />
              <span>Export Active Subscribers</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-montserrat font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiMail} />
              <span>Send Newsletter Campaign</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-colors"
            >
              View Analytics Report
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterManager;