import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiSettings, FiSave, FiMail, FiPhone, FiLinkedin, FiInstagram, FiFacebook, FiGlobe, FiSearch, FiImage, FiFileText, FiEye, FiCode, FiShield, FiClock, FiDatabase, FiUpload, FiType, FiLock, FiTrendingUp, FiUsers, FiDollarSign, FiToggleLeft, FiToggleRight, FiKey, FiServer, FiMonitor, FiAlertTriangle, FiCheck } = FiIcons;

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    // General Settings
    site_title: 'Lillian Adegbola - Queen of Clarity & Purpose',
    site_tagline: 'Transforming Leaders, Empowering Lives',
    site_description: 'Empowering visionary leaders and ambitious achievers through transformational coaching, keynote speaking, and strategic guidance.',
    contact_email: 'clarityqueen23@gmail.com',
    contact_phone: '+234 802 320 0539',
    contact_address: 'The Penthouse 26b Abia Street Banana Island Ikoyi',

    // Professional Images
    portrait_url: 'https://data.scriptsedgeonline.com/wp-content/uploads/2025/08/z-9c5N1_400x400.jpg',
    hero_portrait_url: 'https://data.scriptsedgeonline.com/wp-content/uploads/2025/08/z-9c5N1_400x400.jpg',
    about_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    logo_url: '',
    favicon_url: '',

    // SEO Settings
    meta_title: 'Lillian Adegbola - Leadership Coach & Keynote Speaker',
    meta_description: 'Transform your leadership with Lillian Adegbola. Expert coaching, powerful keynotes, and strategic guidance for visionary leaders.',
    meta_keywords: 'leadership coaching, executive coaching, keynote speaker, business coaching, transformation, empowerment',
    og_title: 'Lillian Adegbola - Queen of Clarity & Purpose',
    og_description: 'Transforming leaders and empowering lives through fearless coaching and authentic growth.',
    og_image: 'https://lillianadegbola.com/og-image.jpg',
    og_type: 'website',
    twitter_card: 'summary_large_image',
    twitter_title: 'Lillian Adegbola - Leadership Transformation',
    twitter_description: 'Unlock your fearless potential with transformational leadership coaching.',
    twitter_image: 'https://lillianadegbola.com/twitter-image.jpg',
    canonical_url: 'https://lillianadegbola.com',
    robots_txt: 'User-agent: *\nAllow: /',
    sitemap_enabled: true,

    // Social Media
    social_linkedin: 'https://ng.linkedin.com/in/lillianadegbola',
    social_facebook: 'https://www.facebook.com/CoachLillianNkechiAdegbola/',
    social_instagram: 'https://www.instagram.com/lillianadegbola/',
    social_twitter: 'https://x.com/LillianAdegbola',
    social_youtube: '',
    social_tiktok: '',

    // Analytics & Tracking
    google_analytics_id: '',
    google_tag_manager_id: '',
    facebook_pixel_id: '',
    google_search_console: '',
    hotjar_id: '',
    linkedin_insight_tag: '',
    microsoft_clarity_id: '',

    // Features
    booking_enabled: true,
    newsletter_enabled: true,
    blog_enabled: true,
    testimonials_enabled: true,
    contact_form_enabled: true,
    live_chat_enabled: false,
    cookie_banner_enabled: true,
    search_enabled: false,
    comments_enabled: false,
    social_sharing_enabled: true,

    // Performance & Security
    cache_enabled: true,
    compression_enabled: true,
    ssl_redirect: true,
    maintenance_mode: false,
    api_rate_limit: 100,
    backup_enabled: true,
    security_headers: true,
    two_factor_auth: false,

    // Branding
    primary_color: '#032B44',
    secondary_color: '#F8E231',
    accent_color: '#DAA520',
    background_color: '#FFFFFF',
    text_color: '#2C2C2C',
    link_color: '#032B44',
    button_style: 'rounded',
    font_primary: 'Playfair Display',
    font_secondary: 'Montserrat',

    // Content Settings
    posts_per_page: 6,
    excerpt_length: 150,
    default_post_status: 'draft',
    allow_comments: false,
    auto_excerpt: true,
    related_posts: true,

    // Email Settings
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_secure: true,
    from_email: 'clarityqueen23@gmail.com',
    from_name: 'Lillian Adegbola',
    reply_to_email: '',
    email_notifications: true,

    // Legal
    privacy_policy_url: '/privacy-policy',
    terms_of_service_url: '/terms-of-service',
    cookie_policy_url: '/cookie-policy',
    gdpr_enabled: false,
    ccpa_enabled: false,
    age_verification: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching all settings...');

      const { data, error } = await supabase
        .from('site_settings_la2024')
        .select('*');

      if (error) {
        console.error('❌ Error fetching settings:', error);
        setLoading(false);
        return;
      }

      console.log('✅ Fetched settings:', data?.length || 0, 'items');

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

      // Convert to form data with defaults
      const updatedFormData = { ...formData };
      Object.keys(updatedFormData).forEach(key => {
        if (settingsObj[key] !== undefined) {
          updatedFormData[key] = settingsObj[key];
        }
      });

      setFormData(updatedFormData);
      console.log('✅ Settings loaded successfully');

    } catch (error) {
      console.error('❌ Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('🔄 Saving settings...');

      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings_la2024')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      console.log('✅ Settings saved successfully!');
      alert('Settings saved successfully!');
      fetchSettings(); // Refresh settings
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // In a real application, you would upload to a cloud storage service
      // For now, we'll just use a placeholder URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          [fieldName]: event.target.result
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: FiGlobe },
    { id: 'images', name: 'Images', icon: FiImage },
    { id: 'seo', name: 'SEO & Meta', icon: FiSearch },
    { id: 'social', name: 'Social Media', icon: FiLinkedin },
    { id: 'analytics', name: 'Analytics', icon: FiTrendingUp },
    { id: 'features', name: 'Features', icon: FiSettings },
    { id: 'branding', name: 'Branding', icon: FiType },
    { id: 'email', name: 'Email', icon: FiMail },
    { id: 'security', name: 'Security', icon: FiShield }
  ];

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
      <div>
        <h2 className="text-3xl font-playfair font-bold text-navy-800 mb-2">
          Website Settings
        </h2>
        <p className="text-gray-600 font-montserrat">
          Manage your website configuration, SEO, and advanced settings
        </p>
      </div>

      {/* Settings Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
          Settings Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-800">
              {Object.keys(settings).length}
            </div>
            <div className="text-sm text-gray-600">Total Settings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formData.site_title ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Site Title</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formData.contact_email ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Contact Email</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold-600">
              {formData.portrait_url ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Portrait</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <SafeIcon icon={tab.icon} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                General Website Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Title *
                  </label>
                  <input
                    type="text"
                    name="site_title"
                    value={formData.site_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="Lillian Adegbola - Queen of Clarity & Purpose"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Tagline
                  </label>
                  <input
                    type="text"
                    name="site_tagline"
                    value={formData.site_tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="Transforming Leaders, Empowering Lives"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  name="site_description"
                  value={formData.site_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  placeholder="Brief description of your website and services..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="clarityqueen23@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  name="contact_address"
                  value={formData.contact_address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  placeholder="Your business address (optional)"
                />
              </div>
            </div>
          )}

          {/* Images Settings */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Professional Images
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portrait URL
                  </label>
                  <input
                    type="url"
                    name="portrait_url"
                    value={formData.portrait_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://example.com/portrait.jpg"
                  />
                  {formData.portrait_url && (
                    <div className="mt-2">
                      <img
                        src={formData.portrait_url}
                        alt="Portrait Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Image URL
                  </label>
                  <input
                    type="url"
                    name="about_image_url"
                    value={formData.about_image_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://example.com/about.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    name="favicon_url"
                    value={formData.favicon_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO & Meta Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                SEO & Meta Tags
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="Lillian Adegbola - Leadership Coach"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    name="canonical_url"
                    value={formData.canonical_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://lillianadegbola.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  placeholder="Transform your leadership with expert coaching..."
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  placeholder="leadership coaching, executive coaching, keynote speaker"
                />
              </div>

              <h4 className="text-md font-playfair font-bold text-navy-800 mt-8 mb-4">
                Open Graph (Facebook)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OG Title
                  </label>
                  <input
                    type="text"
                    name="og_title"
                    value={formData.og_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    name="og_image"
                    value={formData.og_image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Description
                </label>
                <textarea
                  name="og_description"
                  value={formData.og_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                />
              </div>

              <h4 className="text-md font-playfair font-bold text-navy-800 mt-8 mb-4">
                Twitter Cards
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    name="twitter_title"
                    value={formData.twitter_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Card Type
                  </label>
                  <select
                    name="twitter_card"
                    value={formData.twitter_card}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sitemap_enabled"
                    checked={formData.sitemap_enabled}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Enable XML Sitemap</span>
                </label>
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Social Media Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiLinkedin} className="inline mr-2" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="social_linkedin"
                    value={formData.social_linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiFacebook} className="inline mr-2" />
                    Facebook Page
                  </label>
                  <input
                    type="url"
                    name="social_facebook"
                    value={formData.social_facebook}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiInstagram} className="inline mr-2" />
                    Instagram Profile
                  </label>
                  <input
                    type="url"
                    name="social_instagram"
                    value={formData.social_instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    X (Twitter) Profile
                  </label>
                  <input
                    type="url"
                    name="social_twitter"
                    value={formData.social_twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://x.com/yourprofile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Channel
                  </label>
                  <input
                    type="url"
                    name="social_youtube"
                    value={formData.social_youtube}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok Profile
                  </label>
                  <input
                    type="url"
                    name="social_tiktok"
                    value={formData.social_tiktok}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://tiktok.com/@yourprofile"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Analytics Settings */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Analytics & Tracking
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    name="google_analytics_id"
                    value={formData.google_analytics_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Tag Manager ID
                  </label>
                  <input
                    type="text"
                    name="google_tag_manager_id"
                    value={formData.google_tag_manager_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    name="facebook_pixel_id"
                    value={formData.facebook_pixel_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="123456789012345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotjar ID
                  </label>
                  <input
                    type="text"
                    name="hotjar_id"
                    value={formData.hotjar_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Insight Tag
                  </label>
                  <input
                    type="text"
                    name="linkedin_insight_tag"
                    value={formData.linkedin_insight_tag}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Microsoft Clarity ID
                  </label>
                  <input
                    type="text"
                    name="microsoft_clarity_id"
                    value={formData.microsoft_clarity_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="abcdefghij"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Search Console Verification Code
                </label>
                <input
                  type="text"
                  name="google_search_console"
                  value={formData.google_search_console}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  placeholder="abcdefghijklmnopqrstuvwxyz123456789"
                />
              </div>
            </div>
          )}

          {/* Features Settings */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Website Features
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    { key: 'booking_enabled', label: 'Booking System' },
                    { key: 'newsletter_enabled', label: 'Newsletter Signup' },
                    { key: 'blog_enabled', label: 'Blog Section' },
                    { key: 'testimonials_enabled', label: 'Testimonials' },
                    { key: 'contact_form_enabled', label: 'Contact Form' }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name={feature.key}
                        checked={formData[feature.key]}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-medium text-gray-700">{feature.label}</span>
                      <SafeIcon
                        icon={formData[feature.key] ? FiToggleRight : FiToggleLeft}
                        className={`text-lg ${formData[feature.key] ? 'text-green-500' : 'text-gray-400'}`}
                      />
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'live_chat_enabled', label: 'Live Chat' },
                    { key: 'cookie_banner_enabled', label: 'Cookie Banner' },
                    { key: 'search_enabled', label: 'Site Search' },
                    { key: 'comments_enabled', label: 'Blog Comments' },
                    { key: 'social_sharing_enabled', label: 'Social Sharing' }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name={feature.key}
                        checked={formData[feature.key]}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-medium text-gray-700">{feature.label}</span>
                      <SafeIcon
                        icon={formData[feature.key] ? FiToggleRight : FiToggleLeft}
                        className={`text-lg ${formData[feature.key] ? 'text-green-500' : 'text-gray-400'}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Branding Settings */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Brand Colors & Typography
              </h3>

              <h4 className="text-md font-playfair font-bold text-navy-800 mb-4">
                Color Palette
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="w-12 h-12 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="w-12 h-12 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="accent_color"
                      value={formData.accent_color}
                      onChange={handleChange}
                      className="w-12 h-12 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      name="accent_color"
                      value={formData.accent_color}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>
                </div>
              </div>

              <h4 className="text-md font-playfair font-bold text-navy-800 mt-8 mb-4">
                Typography
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Font (Headings)
                  </label>
                  <select
                    name="font_primary"
                    value={formData.font_primary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  >
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Font (Body)
                  </label>
                  <select
                    name="font_secondary"
                    value={formData.font_secondary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  >
                    <option value="Montserrat">Montserrat</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Style
                  </label>
                  <select
                    name="button_style"
                    value={formData.button_style}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="square">Square</option>
                    <option value="pill">Pill Shape</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Email Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    name="from_email"
                    value={formData.from_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="clarityqueen23@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    value={formData.from_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="Lillian Adegbola"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    name="smtp_host"
                    value={formData.smtp_host}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    name="smtp_port"
                    value={formData.smtp_port}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtp_username"
                    value={formData.smtp_username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    name="smtp_password"
                    value={formData.smtp_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="smtp_secure"
                    checked={formData.smtp_secure}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Use SSL/TLS</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="email_notifications"
                    checked={formData.email_notifications}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Enable Email Notifications</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply-To Email
                </label>
                <input
                  type="email"
                  name="reply_to_email"
                  value={formData.reply_to_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  placeholder="Optional: Different reply-to address"
                />
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Security & Performance
              </h3>

              <h4 className="text-md font-playfair font-bold text-navy-800 mb-4">
                Security Features
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    { key: 'ssl_redirect', label: 'Force HTTPS Redirect' },
                    { key: 'security_headers', label: 'Security Headers' },
                    { key: 'two_factor_auth', label: 'Two-Factor Authentication' }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name={feature.key}
                        checked={formData[feature.key]}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-medium text-gray-700">{feature.label}</span>
                      <SafeIcon
                        icon={formData[feature.key] ? FiToggleRight : FiToggleLeft}
                        className={`text-lg ${formData[feature.key] ? 'text-green-500' : 'text-gray-400'}`}
                      />
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'cache_enabled', label: 'Enable Caching' },
                    { key: 'compression_enabled', label: 'Enable Compression' },
                    { key: 'backup_enabled', label: 'Automatic Backups' }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name={feature.key}
                        checked={formData[feature.key]}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-medium text-gray-700">{feature.label}</span>
                      <SafeIcon
                        icon={formData[feature.key] ? FiToggleRight : FiToggleLeft}
                        className={`text-lg ${formData[feature.key] ? 'text-green-500' : 'text-gray-400'}`}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Rate Limit (requests per minute)
                  </label>
                  <input
                    type="number"
                    name="api_rate_limit"
                    value={formData.api_rate_limit}
                    onChange={handleChange}
                    min="1"
                    max="1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="maintenance_mode"
                    checked={formData.maintenance_mode}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Maintenance Mode</span>
                  <SafeIcon
                    icon={formData.maintenance_mode ? FiAlertTriangle : FiCheck}
                    className={`ml-2 text-lg ${formData.maintenance_mode ? 'text-orange-500' : 'text-green-500'}`}
                  />
                </label>
              </div>

              {formData.maintenance_mode && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiAlertTriangle} className="text-orange-500 mr-2" />
                    <span className="text-orange-800 font-semibold">Maintenance Mode Active</span>
                  </div>
                  <p className="text-orange-700 mt-2">
                    When enabled, visitors will see a maintenance page instead of your website.
                  </p>
                </div>
              )}

              <h4 className="text-md font-playfair font-bold text-navy-800 mt-8 mb-4">
                Legal & Compliance
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy Policy URL
                  </label>
                  <input
                    type="text"
                    name="privacy_policy_url"
                    value={formData.privacy_policy_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="/privacy-policy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms of Service URL
                  </label>
                  <input
                    type="text"
                    name="terms_of_service_url"
                    value={formData.terms_of_service_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="/terms-of-service"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cookie Policy URL
                  </label>
                  <input
                    type="text"
                    name="cookie_policy_url"
                    value={formData.cookie_policy_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="/cookie-policy"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="gdpr_enabled"
                    checked={formData.gdpr_enabled}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">GDPR Compliance</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="ccpa_enabled"
                    checked={formData.ccpa_enabled}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">CCPA Compliance</span>
                </label>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-navy-800 text-white px-8 py-3 rounded-lg font-montserrat font-semibold hover:bg-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <SafeIcon icon={FiSave} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsManager;