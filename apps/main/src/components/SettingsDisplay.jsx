import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const SettingsDisplay = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching all settings for debug...');
      const { data, error } = await supabase
        .from('site_settings_la2024')
        .select('*');

      if (error) {
        console.error('❌ Settings fetch error:', error);
        setSettings({ error: error.message });
      } else {
        console.log('✅ Settings fetched:', data?.length || 0, 'items');
        const settingsObj = {};
        data?.forEach(setting => {
          try {
            settingsObj[setting.key] = JSON.parse(setting.value);
          } catch {
            settingsObj[setting.key] = setting.value;
          }
        });
        setSettings(settingsObj);
      }
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Settings error:', error);
      setSettings({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const settingsCount = Object.keys(settings).length;
  const hasError = settings.error;

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2 flex items-center">
        ⚙️ Settings Debug Panel
        {loading && <span className="ml-2 animate-spin">🔄</span>}
      </h3>
      
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={hasError ? 'text-red-600' : 'text-green-600'}>
            {hasError ? '❌ Error' : `✅ ${settingsCount} settings loaded`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Last Refresh:</span>
          <span className="text-gray-600">{lastRefresh}</span>
        </div>

        {hasError && (
          <div className="text-red-600 text-xs mt-2">
            Error: {settings.error}
          </div>
        )}

        {!hasError && settingsCount > 0 && (
          <div className="mt-2 space-y-1">
            <div><strong>Portrait:</strong> {settings.portrait_url ? '✓ Set' : '✗ Default'}</div>
            <div><strong>Site Title:</strong> {settings.site_title ? '✓ Set' : '✗ Default'}</div>
            <div><strong>Primary Font:</strong> {settings.primary_font || 'Default'}</div>
            <div><strong>Contact Email:</strong> {settings.contact_email ? '✓ Set' : '✗ Not set'}</div>
          </div>
        )}

        {!hasError && settingsCount === 0 && (
          <div className="text-orange-600">
            No settings found in database
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button 
          onClick={fetchSettings}
          disabled={loading}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        <button 
          onClick={() => console.log('Current settings:', settings)}
          className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
        >
          Log Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsDisplay;