import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMessageCircle,
  FiCheck,
  FiX,
  FiEdit,
  FiTrash2,
  FiFilter
} = FiIcons;

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings_la2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings_la2024')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking status');
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings_la2024')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600';
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'completed': return 'bg-blue-100 text-blue-600';
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
            Bookings Management
          </h2>
          <p className="text-gray-600 font-montserrat">
            Manage consultation bookings and appointments
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
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'confirmed', 'cancelled', 'completed'].map(status => {
          const count = bookings.filter(b => b.status === status).length;
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

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-playfair font-bold text-navy-800">
            Recent Bookings ({filteredBookings.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                        <span className="text-navy-600 font-semibold text-sm">
                          {booking.first_name[0]}{booking.last_name[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 font-montserrat">
                          {booking.first_name} {booking.last_name}
                        </div>
                        <div className="text-sm text-gray-500 font-montserrat">
                          {booking.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-montserrat">
                      {booking.service_name}
                    </div>
                    <div className="text-sm text-gray-500 font-montserrat">
                      {booking.service_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-montserrat">
                      {new Date(booking.appointment_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 font-montserrat">
                      {booking.appointment_time} {booking.timezone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <SafeIcon icon={FiEdit} />
                      </motion.button>
                      
                      {booking.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                            title="Confirm"
                          >
                            <SafeIcon icon={FiCheck} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel"
                          >
                            <SafeIcon icon={FiX} />
                          </motion.button>
                        </>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteBooking(booking.id)}
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

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiCalendar} className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-montserrat">
                {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings found.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-playfair font-bold text-navy-800">
                  Booking Details
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
              {/* Client Information */}
              <div>
                <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                  Client Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {selectedBooking.first_name} {selectedBooking.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {selectedBooking.phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {selectedBooking.company || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div>
                <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                  Booking Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {selectedBooking.service_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {new Date(selectedBooking.appointment_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <p className="text-gray-900 font-montserrat">
                      {selectedBooking.appointment_time} {selectedBooking.timezone}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedBooking.message && (
                <div>
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3">
                    Message
                  </h4>
                  <p className="text-gray-900 font-montserrat bg-gray-50 p-4 rounded-lg">
                    {selectedBooking.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => {
                      updateBookingStatus(selectedBooking.id, e.target.value);
                      setSelectedBooking({...selectedBooking, status: e.target.value});
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 font-montserrat"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      deleteBooking(selectedBooking.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-montserrat font-medium hover:bg-red-700"
                  >
                    Delete
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

export default BookingsManager;