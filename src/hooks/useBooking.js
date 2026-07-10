import { useState } from 'react';
import supabase from '../lib/supabase';
import { friendlyError } from '../lib/friendlyError';
import { sendBookingEmail, bookingReceivedEmail } from '../lib/bookingEmailTemplates';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBooking = async (bookingData) => {
    setLoading(true);
    setError(null);

    try {
      const record = {
        service_type: bookingData.service,
        service_name: getServiceName(bookingData.service),
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        company: bookingData.company,
        message: bookingData.message,
        timezone: bookingData.timezone || 'WAT',
        meeting_type: bookingData.meetingType || 'online',
        status: 'pending'
      };

      const { error } = await supabase
        .from('bookings_la2024')
        .insert([record]);

      if (error) throw error;

      sendBookingEmail({ ...record, meeting_address: bookingData.contactAddress }, bookingReceivedEmail);

      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = friendlyError(err, "We couldn't submit your booking. Please try again or contact us directly.");
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const getServiceName = (serviceId) => {
    const services = {
      'keynote': 'Keynote Speaker Services',
      'leadership': 'Leadership Coaching',
      'executive': 'Executive Coaching',
      'retreats': 'Destination Retreat Leader',
      'advisory': 'Strategic Advisory',
      'business': 'Business Coaching',
      'organizational': 'Organizational Development',
      'life': 'Life Coaching',
      'facilitation': 'Facilitation Expertise',
      'conflict': 'Conflict Resolution & Mediation',
      'spiritual': 'Spiritual Coach/Advisor',
      'management': 'Management Consultant',
      'capacity': 'Capacity Development',
      'corporate': 'Corporate Trainer'
    };
    return services[serviceId] || 'General Consultation';
  };

  return {
    submitBooking,
    loading,
    error
  };
};