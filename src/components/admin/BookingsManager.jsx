import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';
import { showToast } from '../../lib/toast';
import { useSettings } from '../../hooks/useSettings';
import {
  sendBookingEmail,
  bookingConfirmedEmail,
  bookingDeclinedEmail,
  notifyAdminsOfConfirmedBooking
} from '../../lib/bookingEmailTemplates';
import BookingCalendarView from './BookingCalendarView';

const {
  FiCalendar,
  FiCheck,
  FiX,
  FiEdit,
  FiTrash2,
  FiFilter,
  FiList,
  FiGrid,
  FiVideo,
  FiMapPin
} = FiIcons;

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('list');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
  const [declineReasonInput, setDeclineReasonInput] = useState('');
  const [savingAction, setSavingAction] = useState(false);

  const { settings } = useSettings(['contact_address']);

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

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setMeetingLinkInput(booking.meeting_link || '');
    setDeclineReasonInput(booking.decline_reason || '');
    setShowModal(true);
  };

  const closeBookingModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
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
      showToast.error('Error updating booking status');
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;

    if (selectedBooking.meeting_type === 'online' && !meetingLinkInput.trim()) {
      showToast.error('Please add a meeting link before confirming this online booking.');
      return;
    }

    setSavingAction(true);
    try {
      const updates = {
        status: 'confirmed',
        updated_at: new Date().toISOString(),
        ...(selectedBooking.meeting_type === 'online' ? { meeting_link: meetingLinkInput.trim() } : {})
      };

      const { error } = await supabase
        .from('bookings_la2024')
        .update(updates)
        .eq('id', selectedBooking.id);

      if (error) throw error;

      const updatedBooking = { ...selectedBooking, ...updates };
      setBookings(bookings.map(b => (b.id === selectedBooking.id ? updatedBooking : b)));

      const emailBooking = {
        ...updatedBooking,
        meeting_address: updatedBooking.meeting_type === 'offline' ? settings.contact_address : undefined
      };
      sendBookingEmail(emailBooking, bookingConfirmedEmail);
      notifyAdminsOfConfirmedBooking(emailBooking);

      showToast.success('Booking confirmed and customer notified.');
      closeBookingModal();
    } catch (error) {
      console.error('Error confirming booking:', error);
      showToast.error('Error confirming booking');
    } finally {
      setSavingAction(false);
    }
  };

  const handleDeclineBooking = async () => {
    if (!selectedBooking) return;

    if (!declineReasonInput.trim()) {
      showToast.error('Please provide a reason for declining this booking.');
      return;
    }

    setSavingAction(true);
    try {
      const updates = {
        status: 'cancelled',
        decline_reason: declineReasonInput.trim(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('bookings_la2024')
        .update(updates)
        .eq('id', selectedBooking.id);

      if (error) throw error;

      const updatedBooking = { ...selectedBooking, ...updates };
      setBookings(bookings.map(b => (b.id === selectedBooking.id ? updatedBooking : b)));

      sendBookingEmail(updatedBooking, bookingDeclinedEmail);

      showToast.success('Booking declined and customer notified.');
      closeBookingModal();
    } catch (error) {
      console.error('Error declining booking:', error);
      showToast.error('Error declining booking');
    } finally {
      setSavingAction(false);
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
      showToast.error('Error deleting booking');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-navy-800 mb-2">
            Bookings Management
          </h2>
          <p className="text-gray-600 font-montserrat">
            Manage consultation bookings and appointments
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-montserrat font-medium flex items-center gap-1.5 transition-colors ${view === 'list' ? 'bg-white shadow-sm text-navy-800' : 'text-gray-500'
                }`}
            >
              <SafeIcon icon={FiList} className="text-sm" />
              List
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 rounded-md text-sm font-montserrat font-medium flex items-center gap-1.5 transition-colors ${view === 'calendar' ? 'bg-white shadow-sm text-navy-800' : 'text-gray-500'
                }`}
            >
              <SafeIcon icon={FiGrid} className="text-sm" />
              Calendar
            </button>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
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

      {view === 'calendar' ? (
        <BookingCalendarView bookings={filteredBookings} onSelectBooking={openBookingModal} />
      ) : (
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
                    Format
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
                      <span className="inline-flex items-center gap-1 text-xs font-montserrat font-medium text-gray-600">
                        <SafeIcon icon={booking.meeting_type === 'offline' ? FiMapPin : FiVideo} className="text-gray-400" />
                        {booking.meeting_type === 'offline' ? 'In-Person' : 'Online'}
                      </span>
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
                          onClick={() => openBookingModal(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <SafeIcon icon={FiEdit} />
                        </motion.button>

                        {booking.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => openBookingModal(booking)}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm"
                            >
                              <SafeIcon icon={FiCheck} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => openBookingModal(booking)}
                              className="text-red-600 hover:text-red-900"
                              title="Decline"
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
      )}

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
                  onClick={closeBookingModal}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <p className="text-gray-900 font-montserrat flex items-center gap-1.5">
                      <SafeIcon icon={selectedBooking.meeting_type === 'offline' ? FiMapPin : FiVideo} className="text-gray-400" />
                      {selectedBooking.meeting_type === 'offline' ? 'In-Person' : 'Online'}
                    </p>
                  </div>
                  {selectedBooking.meeting_type === 'offline' && settings.contact_address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Address
                      </label>
                      <p className="text-gray-900 font-montserrat">{settings.contact_address}</p>
                    </div>
                  )}
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

              {/* Pending: Confirm / Decline workflow */}
              {selectedBooking.status === 'pending' && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  {selectedBooking.meeting_type === 'online' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Link (required to confirm) *
                      </label>
                      <input
                        type="url"
                        value={meetingLinkInput}
                        onChange={(e) => setMeetingLinkInput(e.target.value)}
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Decline Reason (required to decline)
                    </label>
                    <textarea
                      value={declineReasonInput}
                      onChange={(e) => setDeclineReasonInput(e.target.value)}
                      rows={2}
                      placeholder="e.g. That slot is no longer available..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={savingAction}
                      onClick={handleConfirmBooking}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-montserrat font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SafeIcon icon={FiCheck} />
                      Confirm Booking
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={savingAction}
                      onClick={handleDeclineBooking}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-montserrat font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SafeIcon icon={FiX} />
                      Decline Booking
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Non-pending: manual override + decline reason (read-only if present) */}
              {selectedBooking.status !== 'pending' && (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  {selectedBooking.meeting_type === 'online' && selectedBooking.meeting_link && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Link
                      </label>
                      <a
                        href={selectedBooking.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-800 underline font-montserrat text-sm break-all"
                      >
                        {selectedBooking.meeting_link}
                      </a>
                    </div>
                  )}
                  {selectedBooking.decline_reason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Decline Reason
                      </label>
                      <p className="text-gray-900 font-montserrat bg-gray-50 p-3 rounded-lg text-sm">
                        {selectedBooking.decline_reason}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Change Status
                    </label>
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => {
                        updateBookingStatus(selectedBooking.id, e.target.value);
                        setSelectedBooking({ ...selectedBooking, status: e.target.value });
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 font-montserrat"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    deleteBooking(selectedBooking.id);
                    closeBookingModal();
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-montserrat font-medium hover:bg-red-100"
                >
                  Delete Booking
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={closeBookingModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;
