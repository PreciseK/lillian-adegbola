import { useState } from 'react';
import supabase from '../lib/supabase';
import { friendlyError } from '../lib/friendlyError';

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitContactForm = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('contact_messages_la2024')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service: formData.service,
          message: formData.message,
          status: 'unread'
        }]);

      if (error) throw error;

      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = friendlyError(err, "We couldn't send your message. Please try again.");
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  const subscribeToNewsletter = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers_la2024')
        .insert([{
          email: email,
          status: 'active',
          source: 'website'
        }]);

      if (error) throw error;

      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = friendlyError(err, "We couldn't subscribe you. Please try again.");
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  return { submitContactForm, subscribeToNewsletter, loading, error };
};