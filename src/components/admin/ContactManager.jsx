import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiMail, FiUser, FiBriefcase, FiMessageCircle, FiCheck, FiTrash2, FiEye, FiReply, FiFilter, FiX } = FiIcons;

const ContactManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages_la2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const { error } = await supabase
        .from('contact_messages_la2024')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(message =>
        message.id === messageId
          ? { ...message, status: newStatus }
          : message
      ));
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message status');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages_la2024')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      setMessages(messages.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-600';
      case 'read': return 'bg-blue-100 text-blue-600';
      case 'replied': return 'bg-green-100 text-green-600';
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
            Contact Messages
          </h2>
          <p className="text-gray-600 font-montserrat">
            Manage inquiries and contact form submissions
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-4">
          <SafeIcon icon={FiFilter} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 font-montserrat"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['unread', 'read', 'replied'].map(status => {
          const count = messages.filter(m => m.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-montserrat text-sm capitalize">
                    {status}
                  </p>
                  <p className="text-2xl font-playfair font-bold text-navy-800">
                    {count}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-playfair font-bold text-navy-800">
            Messages ({filteredMessages.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Service Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Message Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredMessages.map((message) => (
                <tr
                  key={message.id}
                  className={`hover:bg-gray-50 ${message.status === 'unread' ? 'bg-red-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                        <span className="text-navy-600 font-semibold text-sm">
                          {message.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 font-montserrat">
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500 font-montserrat">
                          {message.email}
                        </div>
                        {message.company && (
                          <div className="text-xs text-gray-400 font-montserrat">
                            {message.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-montserrat">
                      {message.service || 'General Inquiry'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-montserrat max-w-xs truncate">
                      {message.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-montserrat">
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 font-montserrat">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowModal(true);
                          if (message.status === 'unread') {
                            updateMessageStatus(message.id, 'read');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Message"
                      >
                        <SafeIcon icon={FiEye} />
                      </motion.button>
                      {message.status !== 'replied' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => updateMessageStatus(message.id, 'replied')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Replied"
                        >
                          <SafeIcon icon={FiReply} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteMessage(message.id)}
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

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiMail} className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat">
                No messages found
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-montserrat">
                {filter === 'all' ? 'No messages have been received yet.' : `No ${filter} messages found.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Details Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-playfair font-bold text-navy-800">
                  Message Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {selectedMessage.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  {selectedMessage.company && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <p className="text-gray-900 font-montserrat">
                        {selectedMessage.company}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Interest */}
              <div>
                <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                  Service Interest
                </h4>
                <p className="text-gray-900 font-montserrat">
                  {selectedMessage.service || 'General Inquiry'}
                </p>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                  Message
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 font-montserrat whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                  Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Received
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => {
                      updateMessageStatus(selectedMessage.id, e.target.value);
                      setSelectedMessage({ ...selectedMessage, status: e.target.value });
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 font-montserrat"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-montserrat font-medium hover:bg-blue-700"
                  >
                    Reply
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;