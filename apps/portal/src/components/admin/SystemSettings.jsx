import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiSettings, FiServer, FiMail, FiShield, FiGlobe, FiDatabase, FiKey,
  FiToggleLeft, FiToggleRight, FiSave, FiRefreshCw, FiAlertCircle,
  FiCheckCircle, FiMonitor, FiCloud, FiLock, FiUsers, FiFileText,
  FiUpload, FiDownload, FiBell, FiCreditCard, FiCode
} = FiIcons;

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Lillian Adegbola Platform',
    siteDescription: 'Transform your journey with premium courses and resources',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@lilianadegbola.com',
    smtpPassword: '••••••••',
    fromEmail: 'noreply@lilianadegbola.com',
    fromName: 'Lillian Adegbola Platform',
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordMinLength: '8',
    maxLoginAttempts: '5',
    requireStrongPasswords: true,
    allowSocialLogin: true,
    
    // Payment Settings
    stripePublishableKey: 'pk_test_••••••••',
    stripeSecretKey: 'sk_test_••••••••',
    paypalClientId: '••••••••',
    paypalSecret: '••••••••',
    currency: 'USD',
    taxRate: '8.25',
    
    // Storage Settings
    storageProvider: 'aws',
    awsAccessKey: '••••••••',
    awsSecretKey: '••••••••',
    awsBucket: 'lillian-platform-storage',
    awsRegion: 'us-east-1',
    maxFileSize: '50',
    allowedFileTypes: 'jpg,jpeg,png,pdf,mp4,mp3',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    slackWebhook: '',
    discordWebhook: '',
    
    // API Settings
    apiRateLimit: '1000',
    apiTimeout: '30',
    corsEnabled: true,
    allowedOrigins: 'https://lilianadegbola.com'
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate saving
    alert('Settings saved successfully!');
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-gold-500' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const tabs = [
    { id: 'general', name: 'General', icon: FiSettings },
    { id: 'email', name: 'Email', icon: FiMail },
    { id: 'security', name: 'Security', icon: FiShield },
    { id: 'payments', name: 'Payments', icon: FiCreditCard },
    { id: 'storage', name: 'Storage', icon: FiCloud },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'api', name: 'API', icon: FiCode }
  ];

  const systemStatus = [
    { service: 'Web Server', status: 'operational', uptime: '99.9%', lastCheck: '2 mins ago' },
    { service: 'Database', status: 'operational', uptime: '99.8%', lastCheck: '1 min ago' },
    { service: 'Email Service', status: 'operational', uptime: '99.7%', lastCheck: '3 mins ago' },
    { service: 'File Storage', status: 'operational', uptime: '99.9%', lastCheck: '1 min ago' },
    { service: 'Payment Gateway', status: 'operational', uptime: '99.6%', lastCheck: '5 mins ago' }
  ];

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">System Settings</h1>
            <p className="text-gray-600 font-montserrat">Configure platform settings and preferences</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-all duration-300 flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Reset to Defaults
            </button>
            <button 
              onClick={handleSave}
              className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-gold-500 text-white shadow-lg' 
                      : 'text-navy-700 hover:bg-gold-50 hover:text-gold-700'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5" />
                  <span className="font-montserrat font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>

            {/* System Status */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-montserrat font-semibold text-navy-800 mb-4">System Status</h3>
              <div className="space-y-3">
                {systemStatus.slice(0, 3).map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-montserrat text-gray-600">{service.service}</span>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-montserrat text-emerald-600">{service.uptime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">General Settings</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => updateSetting('siteName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Site Description
                      </label>
                      <input
                        type="text"
                        value={settings.siteDescription}
                        onChange={(e) => updateSetting('siteDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Maintenance Mode</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Temporarily disable site access for maintenance</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.maintenanceMode}
                        onChange={(value) => updateSetting('maintenanceMode', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Allow Registration</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Enable new user registrations</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.allowRegistration}
                        onChange={(value) => updateSetting('allowRegistration', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Email Verification Required</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Require email verification for new accounts</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.requireEmailVerification}
                        onChange={(value) => updateSetting('requireEmailVerification', value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Email Configuration</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.smtpHost}
                        onChange={(e) => updateSetting('smtpHost', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        value={settings.smtpPort}
                        onChange={(e) => updateSetting('smtpPort', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={settings.fromEmail}
                        onChange={(e) => updateSetting('fromEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={settings.fromName}
                        onChange={(e) => updateSetting('fromName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiMail} className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-montserrat font-medium text-blue-800">Test Email Configuration</h3>
                        <p className="text-sm text-blue-600 font-montserrat">Send a test email to verify your settings</p>
                      </div>
                    </div>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-blue-700 transition-colors">
                      Send Test Email
                    </button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Security Settings</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Password Min Length
                      </label>
                      <input
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => updateSetting('passwordMinLength', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Enable 2FA for admin accounts</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.twoFactorAuth}
                        onChange={(value) => updateSetting('twoFactorAuth', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Require Strong Passwords</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Enforce complex password requirements</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.requireStrongPasswords}
                        onChange={(value) => updateSetting('requireStrongPasswords', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Allow Social Login</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Enable login with Google, Facebook, etc.</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.allowSocialLogin}
                        onChange={(value) => updateSetting('allowSocialLogin', value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Payment Configuration</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting('currency', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.taxRate}
                        onChange={(e) => updateSetting('taxRate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-playfair font-bold text-navy-800">Stripe Configuration</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                          Publishable Key
                        </label>
                        <input
                          type="text"
                          value={settings.stripePublishableKey}
                          onChange={(e) => updateSetting('stripePublishableKey', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                          Secret Key
                        </label>
                        <input
                          type="password"
                          value={settings.stripeSecretKey}
                          onChange={(e) => updateSetting('stripeSecretKey', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Storage Settings */}
              {activeTab === 'storage' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Storage Configuration</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        value={settings.maxFileSize}
                        onChange={(e) => updateSetting('maxFileSize', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Allowed File Types
                      </label>
                      <input
                        type="text"
                        value={settings.allowedFileTypes}
                        onChange={(e) => updateSetting('allowedFileTypes', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        placeholder="jpg,png,pdf,mp4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        AWS S3 Bucket
                      </label>
                      <input
                        type="text"
                        value={settings.awsBucket}
                        onChange={(e) => updateSetting('awsBucket', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        AWS Region
                      </label>
                      <select
                        value={settings.awsRegion}
                        onChange={(e) => updateSetting('awsRegion', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      >
                        <option value="us-east-1">US East (N. Virginia)</option>
                        <option value="us-west-2">US West (Oregon)</option>
                        <option value="eu-west-1">Europe (Ireland)</option>
                        <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Email Notifications</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Send notifications via email</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.emailNotifications}
                        onChange={(value) => updateSetting('emailNotifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">Push Notifications</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Browser push notifications</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.pushNotifications}
                        onChange={(value) => updateSetting('pushNotifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                      <div>
                        <h3 className="font-montserrat font-medium text-navy-800">SMS Notifications</h3>
                        <p className="text-sm text-gray-600 font-montserrat">Send notifications via SMS</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.smsNotifications}
                        onChange={(value) => updateSetting('smsNotifications', value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Slack Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.slackWebhook}
                        onChange={(e) => updateSetting('slackWebhook', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        placeholder="https://hooks.slack.com/..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Discord Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.discordWebhook}
                        onChange={(e) => updateSetting('discordWebhook', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        placeholder="https://discord.com/api/webhooks/..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* API Settings */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-playfair font-bold text-navy-800">API Configuration</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Rate Limit (requests/hour)
                      </label>
                      <input
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => updateSetting('apiRateLimit', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        value={settings.apiTimeout}
                        onChange={(e) => updateSetting('apiTimeout', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">
                        Allowed Origins (CORS)
                      </label>
                      <input
                        type="text"
                        value={settings.allowedOrigins}
                        onChange={(e) => updateSetting('allowedOrigins', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                        placeholder="https://example.com,https://app.example.com"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                    <div>
                      <h3 className="font-montserrat font-medium text-navy-800">CORS Enabled</h3>
                      <p className="text-sm text-gray-600 font-montserrat">Allow cross-origin requests</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.corsEnabled}
                      onChange={(value) => updateSetting('corsEnabled', value)}
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiKey} className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h3 className="font-montserrat font-medium text-yellow-800">API Keys</h3>
                        <p className="text-sm text-yellow-600 font-montserrat">Manage API keys for external integrations</p>
                      </div>
                    </div>
                    <button className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-yellow-700 transition-colors">
                      Manage API Keys
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

export default SystemSettings;