import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiSearch, FiSave, FiGlobe, FiTrendingUp, FiEye, FiCode, FiSettings, FiCheck, FiAlertTriangle, FiExternalLink } = FiIcons;

const SEOManager = () => {
  const [seoData, setSeoData] = useState({
    // Basic SEO
    site_title: 'Lillian Adegbola - Queen of Clarity & Purpose',
    site_tagline: 'Transforming Leaders, Empowering Lives',
    meta_title: 'Lillian Adegbola - Leadership Coach & Keynote Speaker',
    meta_description: 'Transform your leadership with Lillian Adegbola. Expert coaching, powerful keynotes, and strategic guidance for visionary leaders.',
    meta_keywords: 'leadership coaching, executive coaching, keynote speaker, business coaching, transformation, empowerment',
    canonical_url: 'https://lillianadegbola.com',

    // Open Graph
    og_title: 'Lillian Adegbola - Queen of Clarity & Purpose',
    og_description: 'Transforming leaders and empowering lives through fearless coaching and authentic growth.',
    og_image: 'https://lillianadegbola.com/og-image.jpg',
    og_type: 'website',
    og_url: 'https://lillianadegbola.com',
    og_site_name: 'Lillian Adegbola',

    // Twitter Cards
    twitter_card: 'summary_large_image',
    twitter_title: 'Lillian Adegbola - Leadership Transformation',
    twitter_description: 'Unlock your fearless potential with transformational leadership coaching.',
    twitter_image: 'https://lillianadegbola.com/twitter-image.jpg',
    twitter_site: '@LillianAdegbola',
    twitter_creator: '@LillianAdegbola',

    // Technical SEO
    robots_txt: 'User-agent: *\nAllow: /',
    sitemap_enabled: true,
    sitemap_url: 'https://lillianadegbola.com/sitemap.xml',
    google_site_verification: '',
    bing_site_verification: '',
    yandex_site_verification: '',

    // Schema.org
    schema_type: 'Person',
    schema_name: 'Lillian Adegbola',
    schema_job_title: 'Leadership Coach & Keynote Speaker',
    schema_description: 'Queen of Clarity & Purpose - Transforming leaders and empowering lives',
    schema_url: 'https://lillianadegbola.com',
    schema_image: 'https://lillianadegbola.com/profile-image.jpg',
    schema_same_as: JSON.stringify([
      'https://ng.linkedin.com/in/lillianadegbola',
      'https://www.instagram.com/lillianadegbola/',
      'https://www.facebook.com/CoachLillianNkechiAdegbola/',
      'https://x.com/LillianAdegbola'
    ]),

    // Local SEO
    business_name: 'Lillian Adegbola Coaching',
    business_type: 'Professional Coach',
    business_description: 'Leadership coaching and keynote speaking services',
    business_phone: '+234 802 320 0539',
    business_email: 'clarityqueen23@gmail.com',
    business_address: 'The Penthouse 26b Abia Street Banana Island Ikoyi',
    business_hours: 'Monday-Friday: 9AM-5PM EST',

    // Advanced SEO
    hreflang_enabled: false,
    amp_enabled: false,
    pwa_enabled: true,
    structured_data_enabled: true,
    breadcrumbs_enabled: true,

    // Performance
    lazy_loading: true,
    image_optimization: true,
    minification: true,
    compression: true,
    caching_enabled: true,

    // Analytics Integration
    google_analytics_id: '',
    google_tag_manager_id: '',
    google_search_console_property: '',
    bing_webmaster_tools: '',
    yandex_metrica: '',

    // Content SEO
    focus_keywords: 'leadership coaching, executive coaching, keynote speaker, business transformation',
    target_audience: 'executives, entrepreneurs, business leaders, professionals',
    content_strategy: 'thought leadership, case studies, transformation stories',

    // Monitoring
    rank_tracking_keywords: JSON.stringify([
      'leadership coach',
      'executive coach',
      'keynote speaker',
      'business coach',
      'transformation coach',
      'leadership development',
      'executive coaching services',
      'business transformation',
      'leadership training',
      'professional development'
    ])
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [seoScore, setSeoScore] = useState(0);

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  useEffect(() => {
    calculateSEOScore();
  }, [seoData]);

  const fetchSEOSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings_la2024')
        .select('key, value')
        .like('key', '%seo%')
        .or('key.like.%meta%,key.like.%og_%,key.like.%twitter_%,key.like.%schema_%,key.like.%robots%,key.like.%sitemap%');

      if (error) throw error;

      if (data && data.length > 0) {
        const settings = {};
        data.forEach(setting => {
          try {
            settings[setting.key] = typeof setting.value === 'string'
              ? JSON.parse(setting.value)
              : setting.value;
          } catch {
            settings[setting.key] = setting.value;
          }
        });

        setSeoData(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(seoData).map(([key, value]) => ({
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

      alert('SEO settings saved successfully!');

      // Update document head
      updateDocumentHead();

    } catch (error) {
      console.error('Error saving SEO settings:', error);
      alert('Error saving SEO settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateDocumentHead = () => {
    // Update title
    document.title = seoData.meta_title || seoData.site_title;

    // Update meta description
    updateOrCreateMeta('description', seoData.meta_description);
    updateOrCreateMeta('keywords', seoData.meta_keywords);

    // Update Open Graph tags
    updateOrCreateMeta('og:title', seoData.og_title, 'property');
    updateOrCreateMeta('og:description', seoData.og_description, 'property');
    updateOrCreateMeta('og:image', seoData.og_image, 'property');
    updateOrCreateMeta('og:type', seoData.og_type, 'property');
    updateOrCreateMeta('og:url', seoData.og_url, 'property');

    // Update Twitter Card tags
    updateOrCreateMeta('twitter:card', seoData.twitter_card);
    updateOrCreateMeta('twitter:title', seoData.twitter_title);
    updateOrCreateMeta('twitter:description', seoData.twitter_description);
    updateOrCreateMeta('twitter:image', seoData.twitter_image);

    // Update canonical URL
    updateOrCreateLink('canonical', seoData.canonical_url);
  };

  const updateOrCreateMeta = (name, content, attribute = 'name') => {
    if (!content) return;

    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const updateOrCreateLink = (rel, href) => {
    if (!href) return;

    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  };

  const calculateSEOScore = () => {
    let score = 0;
    const checks = [
      { check: seoData.meta_title && seoData.meta_title.length >= 30 && seoData.meta_title.length <= 60, points: 10 },
      { check: seoData.meta_description && seoData.meta_description.length >= 120 && seoData.meta_description.length <= 160, points: 10 },
      { check: seoData.meta_keywords && seoData.meta_keywords.length > 0, points: 5 },
      { check: seoData.og_title && seoData.og_title.length > 0, points: 8 },
      { check: seoData.og_description && seoData.og_description.length > 0, points: 8 },
      { check: seoData.og_image && seoData.og_image.length > 0, points: 8 },
      { check: seoData.twitter_card && seoData.twitter_card.length > 0, points: 7 },
      { check: seoData.canonical_url && seoData.canonical_url.length > 0, points: 8 },
      { check: seoData.schema_type && seoData.schema_type.length > 0, points: 10 },
      { check: seoData.sitemap_enabled, points: 5 },
      { check: seoData.robots_txt && seoData.robots_txt.length > 0, points: 5 },
      { check: seoData.focus_keywords && seoData.focus_keywords.length > 0, points: 8 },
      { check: seoData.google_site_verification && seoData.google_site_verification.length > 0, points: 5 },
      { check: seoData.structured_data_enabled, points: 8 }
    ];

    checks.forEach(({ check, points }) => {
      if (check) score += points;
    });

    setSeoScore(score);
  };

  const handleInputChange = (field, value) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'basic', name: 'Basic SEO', icon: FiSearch },
    { id: 'social', name: 'Social Media', icon: FiGlobe },
    { id: 'technical', name: 'Technical', icon: FiCode },
    { id: 'schema', name: 'Schema.org', icon: FiSettings },
    { id: 'performance', name: 'Performance', icon: FiTrendingUp },
    { id: 'monitoring', name: 'Monitoring', icon: FiEye }
  ];

  const getSEOScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSEOScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
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
      <div>
        <h2 className="text-3xl font-playfair font-bold text-navy-800 mb-2">
          SEO Management
        </h2>
        <p className="text-gray-600 font-montserrat">
          Optimize your website for search engines and social media
        </p>
      </div>

      {/* SEO Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">
              SEO Health Score
            </h3>
            <p className="text-gray-600 font-montserrat">
              Overall optimization score based on best practices
            </p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-2xl ${getSEOScoreColor(seoScore)}`}>
              {seoScore}/100
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {getSEOScoreLabel(seoScore)}
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-navy-800">
              {seoData.meta_title && seoData.meta_title.length >= 30 && seoData.meta_title.length <= 60 ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Meta Title</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-navy-800">
              {seoData.meta_description && seoData.meta_description.length >= 120 && seoData.meta_description.length <= 160 ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Meta Description</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-navy-800">
              {seoData.og_image && seoData.og_title ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Open Graph</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-navy-800">
              {seoData.structured_data_enabled ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600">Schema.org</div>
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

        <div className="p-6">
          {/* Basic SEO Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Basic SEO Settings
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title *
                  </label>
                  <input
                    type="text"
                    value={seoData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="Lillian Adegbola - Leadership Coach & Keynote Speaker"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Recommended: 30-60 characters</span>
                    <span className={seoData.meta_title.length >= 30 && seoData.meta_title.length <= 60 ? 'text-green-600' : 'text-red-600'}>
                      {seoData.meta_title.length}/60
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description *
                  </label>
                  <textarea
                    value={seoData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="Transform your leadership with expert coaching and powerful keynotes..."
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Recommended: 120-160 characters</span>
                    <span className={seoData.meta_description.length >= 120 && seoData.meta_description.length <= 160 ? 'text-green-600' : 'text-red-600'}>
                      {seoData.meta_description.length}/160
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={seoData.meta_keywords}
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="leadership coaching, executive coaching, keynote speaker"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical URL *
                  </label>
                  <input
                    type="url"
                    value={seoData.canonical_url}
                    onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://lillianadegbola.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Keywords
                  </label>
                  <input
                    type="text"
                    value={seoData.focus_keywords}
                    onChange={(e) => handleInputChange('focus_keywords', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="leadership coaching, executive coaching, keynote speaker"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Social Media & Open Graph
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <h4 className="text-md font-playfair font-bold text-navy-800">Open Graph (Facebook)</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={seoData.og_title}
                      onChange={(e) => handleInputChange('og_title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Type
                    </label>
                    <select
                      value={seoData.og_type}
                      onChange={(e) => handleInputChange('og_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="profile">Profile</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OG Description
                  </label>
                  <textarea
                    value={seoData.og_description}
                    onChange={(e) => handleInputChange('og_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    value={seoData.og_image}
                    onChange={(e) => handleInputChange('og_image', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630 pixels</p>
                </div>

                <h4 className="text-md font-playfair font-bold text-navy-800 mt-8">Twitter Cards</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Card Type
                    </label>
                    <select
                      value={seoData.twitter_card}
                      onChange={(e) => handleInputChange('twitter_card', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Handle
                    </label>
                    <input
                      type="text"
                      value={seoData.twitter_site}
                      onChange={(e) => handleInputChange('twitter_site', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="@LillianAdegbola"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={seoData.twitter_title}
                    onChange={(e) => handleInputChange('twitter_title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Description
                  </label>
                  <textarea
                    value={seoData.twitter_description}
                    onChange={(e) => handleInputChange('twitter_description', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Image URL
                  </label>
                  <input
                    type="url"
                    value={seoData.twitter_image}
                    onChange={(e) => handleInputChange('twitter_image', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Technical SEO Tab */}
          {activeTab === 'technical' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Technical SEO Settings
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Robots.txt Content
                  </label>
                  <textarea
                    value={seoData.robots_txt}
                    onChange={(e) => handleInputChange('robots_txt', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat font-mono text-sm"
                    placeholder="User-agent: *&#10;Allow: /"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={seoData.sitemap_enabled}
                      onChange={(e) => handleInputChange('sitemap_enabled', e.target.checked)}
                      className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable XML Sitemap</span>
                  </label>
                </div>

                {seoData.sitemap_enabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitemap URL
                    </label>
                    <input
                      type="url"
                      value={seoData.sitemap_url}
                      onChange={(e) => handleInputChange('sitemap_url', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Site Verification
                    </label>
                    <input
                      type="text"
                      value={seoData.google_site_verification}
                      onChange={(e) => handleInputChange('google_site_verification', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="verification-code-here"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bing Site Verification
                    </label>
                    <input
                      type="text"
                      value={seoData.bing_site_verification}
                      onChange={(e) => handleInputChange('bing_site_verification', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="verification-code-here"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-playfair font-bold text-navy-800">Advanced Features</h4>

                  {[
                    { key: 'structured_data_enabled', label: 'Enable Schema.org Structured Data' },
                    { key: 'breadcrumbs_enabled', label: 'Enable Breadcrumbs' },
                    { key: 'pwa_enabled', label: 'Progressive Web App Features' },
                    { key: 'amp_enabled', label: 'Accelerated Mobile Pages (AMP)' },
                    { key: 'hreflang_enabled', label: 'Hreflang Tags (Multi-language)' }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={seoData[feature.key]}
                        onChange={(e) => handleInputChange(feature.key, e.target.checked)}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Schema.org Tab */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Schema.org Structured Data
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schema Type
                    </label>
                    <select
                      value={seoData.schema_type}
                      onChange={(e) => handleInputChange('schema_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    >
                      <option value="Person">Person</option>
                      <option value="Organization">Organization</option>
                      <option value="LocalBusiness">Local Business</option>
                      <option value="ProfessionalService">Professional Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={seoData.schema_name}
                      onChange={(e) => handleInputChange('schema_name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title / Business Type
                  </label>
                  <input
                    type="text"
                    value={seoData.schema_job_title}
                    onChange={(e) => handleInputChange('schema_job_title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={seoData.schema_description}
                    onChange={(e) => handleInputChange('schema_description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schema URL
                  </label>
                  <input
                    type="url"
                    value={seoData.schema_url}
                    onChange={(e) => handleInputChange('schema_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schema Image
                  </label>
                  <input
                    type="url"
                    value={seoData.schema_image}
                    onChange={(e) => handleInputChange('schema_image', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Links (JSON Array)
                  </label>
                  <textarea
                    value={seoData.schema_same_as}
                    onChange={(e) => handleInputChange('schema_same_as', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat font-mono text-sm"
                    placeholder='["https://linkedin.com/in/profile", "https://twitter.com/profile"]'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Performance Optimization
              </h3>

              <div className="space-y-4">
                {[
                  { key: 'lazy_loading', label: 'Enable Lazy Loading for Images', description: 'Load images only when they come into viewport' },
                  { key: 'image_optimization', label: 'Automatic Image Optimization', description: 'Compress and optimize images for faster loading' },
                  { key: 'minification', label: 'CSS/JS Minification', description: 'Reduce file sizes by removing unnecessary characters' },
                  { key: 'compression', label: 'Gzip Compression', description: 'Compress files before sending to browsers' },
                  { key: 'caching_enabled', label: 'Browser Caching', description: 'Store static resources in visitor browsers' }
                ].map((feature) => (
                  <div key={feature.key} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={seoData[feature.key]}
                      onChange={(e) => handleInputChange(feature.key, e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                    />
                    <div>
                      <span className="font-medium text-gray-700">{feature.label}</span>
                      <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                SEO Monitoring & Analytics
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={seoData.google_analytics_id}
                      onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
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
                      value={seoData.google_tag_manager_id}
                      onChange={(e) => handleInputChange('google_tag_manager_id', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Keywords for Rank Tracking
                  </label>
                  <textarea
                    value={seoData.rank_tracking_keywords}
                    onChange={(e) => handleInputChange('rank_tracking_keywords', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder='["leadership coach", "executive coach", "keynote speaker"]'
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter as JSON array format</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={seoData.target_audience}
                      onChange={(e) => handleInputChange('target_audience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Strategy
                    </label>
                    <input
                      type="text"
                      value={seoData.content_strategy}
                      onChange={(e) => handleInputChange('content_strategy', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    />
                  </div>
                </div>

                {/* SEO Tools Links */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-navy-800 mb-4">SEO Tools & Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiExternalLink} />
                      <span>Google Search Console</span>
                    </a>
                    <a
                      href="https://www.google.com/webmasters/tools/richsnippets"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiExternalLink} />
                      <span>Rich Results Test</span>
                    </a>
                    <a
                      href="https://developers.facebook.com/tools/debug/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiExternalLink} />
                      <span>Facebook Debugger</span>
                    </a>
                    <a
                      href="https://cards-dev.twitter.com/validator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiExternalLink} />
                      <span>Twitter Card Validator</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <motion.button
              type="button"
              disabled={saving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="bg-navy-800 text-white px-8 py-3 rounded-lg font-montserrat font-semibold hover:bg-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <SafeIcon icon={FiSave} />
              <span>{saving ? 'Saving...' : 'Save SEO Settings'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOManager;