import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiUser, FiBell, FiLock, FiCreditCard, FiDownload, FiTrash2,
  FiToggleLeft, FiToggleRight, FiSave, FiEye, FiEyeOff, FiEdit3,
  FiShield, FiGlobe, FiMoon, FiSun, FiVolume2, FiVolumeX
} = FiIcons;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [settings, setSettings] = useState({
    // Profile settings
    displayName: '',
    email: '',
    phone: '',
    membershipTier: 'Basic', // Default
    timezone: 'GMT+01:00',
    language: 'en',

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    courseReminders: true,
    communityUpdates: false,
    marketingEmails: false,

    // Privacy settings
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    allowMessages: true,

    // Appearance settings
    darkMode: false,
    soundEffects: true,
    animations: true,
    compactView: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('profiles_la2024')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const userSettings = data.settings || {};
          const notifications = userSettings.notifications || {};
          const privacy = userSettings.privacy || {};
          const appearance = userSettings.appearance || {};

          setSettings(prev => ({
            ...prev,
            displayName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            email: user.email,
            phone: data.phone || '',
            location: data.location || '', // Using location if needed
            membershipTier: data.membership_tier ? data.membership_tier.charAt(0).toUpperCase() + data.membership_tier.slice(1) : 'Basic',

            // Map JSONB settings back to flat state
            emailNotifications: notifications.email !== undefined ? notifications.email : true,
            pushNotifications: notifications.push !== undefined ? notifications.push : true,
            weeklyDigest: notifications.weeklyDigest !== undefined ? notifications.weeklyDigest : true,
            courseReminders: notifications.courseReminders !== undefined ? notifications.courseReminders : true,
            communityUpdates: notifications.communityUpdates !== undefined ? notifications.communityUpdates : false,
            marketingEmails: notifications.marketingEmails !== undefined ? notifications.marketingEmails : false,

            profileVisibility: privacy.profileVisibility || 'public',
            showProgress: privacy.showProgress !== undefined ? privacy.showProgress : true,
            showAchievements: privacy.showAchievements !== undefined ? privacy.showAchievements : true,
            allowMessages: privacy.allowMessages !== undefined ? privacy.allowMessages : true,

            darkMode: appearance.darkMode || false,
            soundEffects: appearance.soundEffects !== undefined ? appearance.soundEffects : true,
            animations: appearance.animations !== undefined ? appearance.animations : true,
            compactView: appearance.compactView !== undefined ? appearance.compactView : false,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your Premium subscription? You will lose access to premium content.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles_la2024')
        .update({ membership_tier: 'basic' })
        .eq('id', user.id);

      if (error) throw error;

      alert('Subscription cancelled successfully. You are now on the Basic plan.');
      fetchSettings(); // Refresh data
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const nameParts = settings.displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const settingsJson = {
        notifications: {
          email: settings.emailNotifications,
          push: settings.pushNotifications,
          weeklyDigest: settings.weeklyDigest,
          courseReminders: settings.courseReminders,
          communityUpdates: settings.communityUpdates,
          marketingEmails: settings.marketingEmails
        },
        privacy: {
          profileVisibility: settings.profileVisibility,
          showProgress: settings.showProgress,
          showAchievements: settings.showAchievements,
          allowMessages: settings.allowMessages
        },
        appearance: {
          darkMode: settings.darkMode,
          soundEffects: settings.soundEffects,
          animations: settings.animations,
          compactView: settings.compactView
        }
      };

      const updates = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone: settings.phone,
        settings: settingsJson,
        updated_at: new Date()
      };

      const { error } = await supabase
        .from('profiles_la2024')
        .upsert(updates);

      if (error) throw error;
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FiUser },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'privacy', name: 'Privacy & Security', icon: FiShield },
    { id: 'billing', name: 'Billing', icon: FiCreditCard },
    { id: 'preferences', name: 'Preferences', icon: FiGlobe },
    { id: 'data', name: 'Data & Storage', icon: FiDownload }
  ];

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ${enabled ? 'bg-gold-500' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Settings</h1>
            <p className="text-gray-600 font-montserrat">Manage your account and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-gold-gradient text-navy-800 px-6 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm h-fit"
          >
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'text-navy-700 hover:bg-gold-50 hover:text-gold-700'
                    }`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5" />
                  <span className="font-montserrat font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Profile Information</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => updateSetting('displayName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => updateSetting('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      >
                        <option value="GMT-12:00">(GMT-12:00) International Date Line West</option>
                        <option value="GMT-08:00">(GMT-08:00) Pacific Time</option>
                        <option value="GMT-05:00">(GMT-05:00) Eastern Time</option>
                        <option value="GMT+00:00">(GMT+00:00) Greenwich Mean Time</option>
                        <option value="GMT+01:00">(GMT+01:00) Central European Time</option>
                        <option value="GMT+03:00">(GMT+03:00) Moscow Standard Time</option>
                        <option value="GMT+05:30">(GMT+05:30) Indian Standard Time</option>
                        <option value="GMT+08:00">(GMT+08:00) China Standard Time</option>
                        <option value="GMT+09:00">(GMT+09:00) Japan Standard Time</option>
                        <option value="GMT+10:00">(GMT+10:00) Australian Eastern Standard Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Change Password</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Notification Preferences</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on your devices' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Get a summary of your progress each week' },
                      { key: 'courseReminders', label: 'Course Reminders', desc: 'Reminders about upcoming lessons and deadlines' },
                      { key: 'communityUpdates', label: 'Community Updates', desc: 'Updates from the community discussions' },
                      { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotional emails about new courses and features' }
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                        <div>
                          <h3 className="font-montserrat font-medium text-navy-800">{label}</h3>
                          <p className="text-sm text-gray-600 font-montserrat">{desc}</p>
                        </div>
                        <ToggleSwitch
                          enabled={settings[key]}
                          onChange={(value) => updateSetting(key, value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Privacy & Security</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Profile Visibility</h3>
                      <div className="space-y-3">
                        {[
                          { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
                          { value: 'members', label: 'Members Only', desc: 'Only community members can see your profile' },
                          { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                        ].map(option => (
                          <label key={option.value} className="flex items-center space-x-3 p-3 bg-luxury-pearl rounded-lg cursor-pointer">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option.value}
                              checked={settings.profileVisibility === option.value}
                              onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                              className="text-gold-500 focus:ring-gold-500"
                            />
                            <div>
                              <div className="font-montserrat font-medium text-navy-800">{option.label}</div>
                              <div className="text-sm text-gray-600 font-montserrat">{option.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'showProgress', label: 'Show Learning Progress', desc: 'Display your course progress publicly' },
                        { key: 'showAchievements', label: 'Show Achievements', desc: 'Display your badges and achievements' },
                        { key: 'allowMessages', label: 'Allow Direct Messages', desc: 'Let other members send you messages' }
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                          <div>
                            <h3 className="font-montserrat font-medium text-navy-800">{label}</h3>
                            <p className="text-sm text-gray-600 font-montserrat">{desc}</p>
                          </div>
                          <ToggleSwitch
                            enabled={settings[key]}
                            onChange={(value) => updateSetting(key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Billing & Subscription</h2>

                  <div className="bg-gold-50 border border-gold-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-playfair font-bold text-navy-800">{settings.membershipTier} Membership</h3>
                        <p className="text-gray-600 font-montserrat">
                          {settings.membershipTier === 'Premium'
                            ? 'Full access to all courses and resources'
                            : 'Limited access to free content'}
                        </p>
                        {settings.membershipTier === 'Premium' && (
                          <p className="text-sm text-gray-500 font-montserrat mt-1">Next billing: {new Date().toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-playfair font-bold text-gold-600">
                          {settings.membershipTier === 'Premium' ? '₦29.99' : 'Free'}
                        </div>
                        <div className="text-sm text-gray-500 font-montserrat">per month</div>
                      </div>
                    </div>
                  </div>

                  {settings.membershipTier === 'Premium' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-playfair font-bold text-navy-800">Payment Methods</h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-6 bg-gray-800 rounded text-white text-xs flex items-center justify-center font-bold">
                              VISA
                            </div>
                            <div>
                              <div className="font-montserrat font-medium text-navy-800">•••• •••• •••• 4242</div>
                              <div className="text-sm text-gray-500 font-montserrat">Expires 12/2025</div>
                            </div>
                          </div>
                          <button className="text-gold-600 hover:text-gold-700 font-montserrat font-medium">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="font-montserrat font-medium text-navy-800">Download Invoice History</div>
                      <div className="text-sm text-gray-500 font-montserrat">Get all your past invoices</div>
                    </button>

                    {settings.membershipTier === 'Premium' && (
                      <button
                        onClick={handleCancelSubscription}
                        className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                      >
                        <div className="font-montserrat font-medium">Cancel Subscription</div>
                        <div className="text-sm font-montserrat">End your membership (Downgrade to Basic)</div>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">App Preferences</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme across the platform', icon: settings.darkMode ? FiMoon : FiSun },
                      { key: 'soundEffects', label: 'Sound Effects', desc: 'Play sounds for interactions and notifications', icon: settings.soundEffects ? FiVolume2 : FiVolumeX },
                      { key: 'animations', label: 'Animations', desc: 'Enable smooth animations and transitions' },
                      { key: 'compactView', label: 'Compact View', desc: 'Use a more condensed layout' }
                    ].map(({ key, label, desc, icon }) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                        <div className="flex items-center space-x-3">
                          {icon && <SafeIcon icon={icon} className="w-5 h-5 text-gray-600" />}
                          <div>
                            <h3 className="font-montserrat font-medium text-navy-800">{label}</h3>
                            <p className="text-sm text-gray-600 font-montserrat">{desc}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={settings[key]}
                          onChange={(value) => updateSetting(key, value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Language & Region</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => updateSetting('language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Storage */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Data & Storage</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-luxury-pearl p-6 rounded-lg">
                      <h3 className="font-playfair font-bold text-navy-800 mb-2">Storage Used</h3>
                      <div className="text-3xl font-playfair font-bold text-gold-600 mb-1">2.4 GB</div>
                      <div className="text-sm text-gray-600 font-montserrat">of 10 GB available</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div className="bg-gold-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>

                    <div className="bg-luxury-pearl p-6 rounded-lg">
                      <h3 className="font-playfair font-bold text-navy-800 mb-2">Downloaded Content</h3>
                      <div className="text-3xl font-playfair font-bold text-blue-600 mb-1">145</div>
                      <div className="text-sm text-gray-600 font-montserrat">files downloaded</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-playfair font-bold text-navy-800">Data Management</h3>

                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-montserrat font-medium text-navy-800">Export My Data</div>
                          <div className="text-sm text-gray-500 font-montserrat">Download all your data in a portable format</div>
                        </div>
                        <SafeIcon icon={FiDownload} className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>

                    <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-montserrat font-medium text-navy-800">Clear Cache</div>
                          <div className="text-sm text-gray-500 font-montserrat">Free up space by clearing temporary files</div>
                        </div>
                        <SafeIcon icon={FiTrash2} className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>

                    <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-montserrat font-medium">Delete Account</div>
                          <div className="text-sm font-montserrat">Permanently delete your account and all data</div>
                        </div>
                        <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;