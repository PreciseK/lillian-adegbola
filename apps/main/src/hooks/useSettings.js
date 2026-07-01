import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export const useSettings = (settingKeys = []) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('site_settings_la2024').select('key, value');
      
      if (settingKeys.length > 0) {
        query = query.in('key', settingKeys);
      }

      const { data, error } = await query;

      if (error) throw error;

      const settingsObj = {};
      data?.forEach(setting => {
        try {
          settingsObj[setting.key] = typeof setting.value === 'string' 
            ? JSON.parse(setting.value) 
            : setting.value;
        } catch {
          settingsObj[setting.key] = setting.value;
        }
      });

      setSettings(settingsObj);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const { error } = await supabase
        .from('site_settings_la2024')
        .upsert({
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        [key]: value
      }));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSetting
  };
};