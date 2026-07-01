import { useState } from 'react';
import supabase from '../lib/supabase';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBooking = async (bookingData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('bookings_la2024')
        .insert([{
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
          timezone: bookingData.timezone || 'EST',
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      setLoading(false);
      return { success: true, data: data[0] };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
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