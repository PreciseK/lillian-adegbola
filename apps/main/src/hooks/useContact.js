import { useState } from 'react';
import supabase from '../lib/supabase';

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitContactForm = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('contact_messages_la2024')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service: formData.service,
          message: formData.message,
          status: 'unread'
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

  const subscribeToNewsletter = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers_la2024')
        .insert([{
          email: email,
          status: 'active',
          source: 'website'
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

  return { submitContactForm, subscribeToNewsletter, loading, error };
};