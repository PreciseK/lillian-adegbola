import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../../../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiMessageSquare, FiClock, FiCheck, FiAlertCircle, FiUser, FiMail,
  FiSearch, FiFilter, FiEye, FiEdit3, FiSend, FiTag, FiCalendar,
  FiArrowRight, FiMoreVertical, FiRefreshCw, FiDownload
} = FiIcons;

const SupportCenter = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openTickets: 0,
    pendingResponse: 0,
    resolvedToday: 0,
    avgResponseTime: '0h'
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets_la2024')
        .select(`
          *,
          customer:profiles_la2024 (
            first_name,
            last_name,
            email,
            avatar_url,
            membership_tier
          ),
          responses:support_ticket_responses_la2024 (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process tickets for display
      const processedTickets = data.map(ticket => ({
        id: ticket.id,
        subject: ticket.subject,
        customer: {
          name: `${ticket.customer?.first_name || ''} ${ticket.customer?.last_name || ''}`.trim() || 'Guest',
          email: ticket.customer?.email || 'No Email',
          avatar: ticket.customer?.avatar_url || 'https://via.placeholder.com/40',
          membershipTier: ticket.customer?.membership_tier || 'basic'
        },
        priority: ticket.priority,
        status: ticket.status,
        category: ticket.category,
        createdAt: ticket.created_at,
        lastUpdate: ticket.updated_at,
        assignedTo: ticket.assigned_to || 'Unassigned',
        description: ticket.description,
        responses: ticket.responses?.[0]?.count || 0
      }));

      setTickets(processedTickets);
      calculateStats(processedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ticketData) => {
    const openTickets = ticketData.filter(t => t.status === 'open').length;
    const pendingResponse = ticketData.filter(t => t.status === 'pending').length;

    // Resolved today
    const today = new Date().toISOString().split('T')[0];
    const resolvedToday = ticketData.filter(t =>
      t.status === 'resolved' && t.lastUpdate.startsWith(today)
    ).length;

    setStats({
      openTickets,
      pendingResponse,
      resolvedToday,
      avgResponseTime: '2.4h' // Placeholder as calculation is complex without detailed logs
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Removed duplicate getStatusColor

  const supportStats = [
    {
      title: 'Open Tickets',
      value: stats.openTickets.toString(),
      change: 'Active',
      icon: FiMessageSquare,
      color: 'blue'
    },
    {
      title: 'Pending Response',
      value: stats.pendingResponse.toString(),
      change: 'Needs Attention',
      icon: FiClock,
      color: 'yellow'
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedToday.toString(),
      change: 'Today',
      icon: FiCheck,
      color: 'green'
    },
    {
      title: 'Avg Response Time',
      value: stats.avgResponseTime,
      change: 'Calculated',
      icon: FiAlertCircle,
      color: 'purple'
    }
  ];

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Support Center</h1>
            <p className="text-gray-600 font-montserrat">Manage customer support tickets and inquiries</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-all duration-300 flex items-center">
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-2xl font-playfair font-bold text-navy-800">{stat.value}</p>
              <p className="text-sm font-montserrat text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xs font-montserrat text-gray-500">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex space-x-6 border-b border-gray-200 mb-6">
            {[
              { id: 'tickets', name: 'Support Tickets', icon: FiMessageSquare },
              { id: 'analytics', name: 'Analytics', icon: FiAlertCircle },
              { id: 'knowledge', name: 'Knowledge Base', icon: FiEdit3 }
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

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets by subject, customer, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tickets List */}
        {activeTab === 'tickets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setShowTicketModal(true);
                  }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-playfair font-bold text-navy-800">{ticket.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={ticket.customer.avatar}
                            alt={ticket.customer.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm font-montserrat text-gray-700">{ticket.customer.name}</span>
                        </div>
                        <span className="text-sm font-montserrat text-gray-500">#{ticket.id}</span>
                        <span className="text-sm font-montserrat text-gray-500">{ticket.category}</span>
                      </div>

                      <p className="text-sm font-montserrat text-gray-600 mb-3 line-clamp-2">
                        {ticket.description}
                      </p>

                      <div className="flex items-center justify-between text-xs font-montserrat text-gray-500">
                        <span>Created {formatTime(ticket.createdAt)}</span>
                        <span>Updated {formatTime(ticket.lastUpdate)}</span>
                        <span>Assigned to {ticket.assignedTo}</span>
                        <span>{ticket.responses} responses</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-montserrat">No tickets found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-sm text-center"
          >
            <SafeIcon icon={FiAlertCircle} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">Support Analytics</h3>
            <p className="text-gray-600 font-montserrat">Detailed analytics and reporting coming soon...</p>
          </motion.div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-sm text-center"
          >
            <SafeIcon icon={FiEdit3} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">Knowledge Base Management</h3>
            <p className="text-gray-600 font-montserrat">Manage FAQ articles and help documentation...</p>
          </motion.div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">Ticket Details</h2>
              <button
                onClick={() => setShowTicketModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiMoreVertical} className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-playfair font-bold text-navy-800">{selectedTicket.subject}</h3>
                  <span className="text-sm font-montserrat text-gray-500">#{selectedTicket.id}</span>
                </div>

                <div className="flex items-center space-x-4 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-montserrat font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority} priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-montserrat font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-montserrat font-medium">
                    {selectedTicket.category}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm font-montserrat text-gray-600">
                  <span>Created {formatTime(selectedTicket.createdAt)}</span>
                  <span>Last update {formatTime(selectedTicket.lastUpdate)}</span>
                  <span>Assigned to {selectedTicket.assignedTo}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center space-x-4 p-4 bg-luxury-pearl rounded-lg">
                <img
                  src={selectedTicket.customer.avatar}
                  alt={selectedTicket.customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-montserrat font-medium text-navy-800">{selectedTicket.customer.name}</p>
                  <p className="text-sm text-gray-600 font-montserrat">{selectedTicket.customer.email}</p>
                  <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded-full font-montserrat font-medium capitalize">
                    {selectedTicket.customer.membershipTier} Member
                  </span>
                </div>
              </div>

              {/* Ticket Description */}
              <div>
                <h4 className="font-playfair font-bold text-navy-800 mb-2">Description</h4>
                <p className="font-montserrat text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Response Area */}
              <div>
                <h4 className="font-playfair font-bold text-navy-800 mb-3">Response</h4>
                <textarea
                  rows={4}
                  placeholder="Type your response here..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg font-montserrat text-sm">
                    <option>Change Status</option>
                    <option>Open</option>
                    <option>Pending</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg font-montserrat text-sm">
                    <option>Change Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-colors">
                    Save Draft
                  </button>
                  <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
                    <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                    Send Response
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupportCenter;