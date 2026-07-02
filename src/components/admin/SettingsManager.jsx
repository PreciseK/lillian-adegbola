import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';
import RichTextEditor from '../../common/RichTextEditor';

const { FiSettings, FiSave, FiMail, FiPhone, FiLinkedin, FiInstagram, FiFacebook, FiGlobe, FiSearch, FiImage, FiFileText, FiEye, FiCode, FiShield, FiClock, FiDatabase, FiUpload, FiType, FiLock, FiTrendingUp, FiUsers, FiDollarSign, FiToggleLeft, FiToggleRight, FiKey, FiServer, FiMonitor, FiAlertTriangle, FiCheck } = FiIcons;

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [expandedServiceIndex, setExpandedServiceIndex] = useState(null);
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

    // Email Settings (SMTP credentials are stored as Edge Function env vars, not here)
    smtp_host: '',
    smtp_port: 587,
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
    stat_leaders_transformed: '500+',
    stat_success_rate: '95%',
    stat_years_experience: '15+',
    stat_organizations_served: '50+',
    download_leadership_guide_url: '',

    // Landing Page CMS Content
    hero_tagline: 'The Queen of Clarity & Purpose',
    hero_title_1: 'Transforming',
    hero_title_accent_1: 'Leaders',
    hero_title_2: 'Empowering',
    hero_title_accent_2: 'Lives',
    hero_description: 'Unlock your fearless potential and achieve sustainable positive transformation.',
    hero_cta_primary: 'Start Your Transformation',
    hero_cta_secondary: 'Explore Services',
    about_badge: 'About Lillian',
    about_heading_1: 'A Powerhouse',
    about_heading_accent: 'of Transformation',
    about_content: '',
    about_cta: 'Discover My Story',
    services_badge: 'My Offerings',
    services_heading: 'Services & Coaching Solutions',
    services_subtext: '',
    testimonials_badge: 'Success Stories',
    testimonials_heading: 'Transformation in Action',
    testimonials_subtext: '',
    contact_badge: 'Get In Touch',
    contact_heading: 'Let\'s Begin Your Journey',
    contact_subtext: '',
    services_list: []
  });

  const [cmsSubTab, setCmsSubTab] = useState('hero');

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

      // If services_list is empty, populate it with default 14 services
      if (!updatedFormData.services_list || !Array.isArray(updatedFormData.services_list) || updatedFormData.services_list.length === 0) {
        updatedFormData.services_list = [
          {
            id: 'keynote',
            icon: 'FiMic',
            title: 'Keynote Speaker Services',
            subtitle: 'Inspire Action. Transform Mindsets.',
            description: 'As a dynamic keynote speaker, Lillian Adegbola delivers powerful talks that ignite leadership, drive growth, and inspire teams to achieve more. With expertise in leadership, collaboration, and personal effectiveness, her keynotes leave a lasting impact.',
            cta: 'Book Lillian for your next event to spark transformation.',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'leadership',
            icon: 'FiUsers',
            title: 'Leadership Coaching',
            subtitle: 'Unlock Your Potential. Lead with Confidence.',
            description: 'Through personalized leadership coaching, Lillian Adegbola empowers leaders to discover their strengths, overcome obstacles, and reach their full potential. By fostering self-awareness, building resilience, and developing effective strategies, leaders can inspire their teams and drive success.',
            cta: 'Ready to Elevate Your Leadership? Schedule a Discovery Call Today!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'executive',
            icon: 'FiTarget',
            title: 'Executive Coaching',
            subtitle: 'Elevate Performance. Achieve Exceptional Results.',
            description: 'As an executive coach, Lillian Adegbola partners with senior leaders to tackle complex challenges, enhance decision-making, and drive business growth. With tailored guidance and support, executives can refine their leadership style, build high-performing teams, and achieve outstanding results.',
            cta: 'Let\'s Drive Exceptional Results Together! Book Your Executive Coaching Session Now!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'retreats',
            icon: 'FiMapPin',
            title: 'Destination Retreat Leader',
            subtitle: 'Reconnect. Refocus. Renew.',
            description: 'Join Lillian Adegbola on curated destination retreats blending leadership growth, team building, and personal renewal in inspiring settings. These transformative experiences help leaders and teams reconnect with purpose, refocus on goals, and renew their energy for impact.',
            cta: 'Want to foster connection, creativity, and renewal? Plan Your Next Retreat. Let\'s Create an Unforgettable Experience!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'advisory',
            icon: 'FiCompass',
            title: 'Strategic Advisory',
            subtitle: 'Strategic Insight. Trusted Counsel.',
            description: 'As a seasoned advisor, Lillian Adegbola leverages her expertise in leadership, facilitation, and strategic thinking to guide organizations through challenges and opportunities. With a focus on driving growth, effectiveness, and innovation, she provides trusted counsel to inform critical decisions.',
            cta: 'Let\'s Explore Strategic Opportunities. Schedule a Consultation Today!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'business',
            icon: 'FiBriefcase',
            title: 'Business Coaching',
            subtitle: 'Grow Your Business. Unlock Potential.',
            description: 'With expert business coaching, Lillian Adegbola helps entrepreneurs and business leaders overcome challenges, leverage strengths, and achieve growth. Through personalized guidance and accountability, she empowers businesses to boost performance, enhance strategies, and reach goals.',
            cta: 'Partner with Lillian for business coaching tailored to your needs.',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'organizational',
            icon: 'FiTrendingUp',
            title: 'Organizational Development',
            subtitle: 'Build High-Performing Teams. Drive Results.',
            description: 'Lillian Adegbola supports organizational development through strategies that enhance teamwork, improve communication, and boost performance. With expertise in facilitation and leadership, she helps organizations build capacity, foster collaboration, and achieve sustainable results.',
            cta: 'Work with Lillian to transform your organization\'s potential into impact.',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'life',
            icon: 'FiHeart',
            title: 'Life Coaching',
            subtitle: 'Unlock Your Potential. Live with Purpose.',
            description: 'With compassionate and expert life coaching, Lillian Adegbola helps individuals clarify goals, overcome obstacles, and create meaningful change. Through personalized support and strategies, she empowers clients to gain clarity, build confidence, find balance, and develop the courage to live an intentional and impactful life.',
            cta: 'Partner with Lillian for life coaching that radically transforms your life journey.',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'facilitation',
            icon: 'FiMessageCircle',
            title: 'Facilitation Expertise',
            subtitle: 'Transform Conversations. Unlock Collaboration.',
            description: 'Expert facilitation unlocks collaboration, fuels innovation, and drives outcomes in leadership teams, workshops, and strategic meetings. With proven skills in guiding discussions, fostering participation, and managing dynamics, we help teams achieve more together.',
            cta: 'Unlock Your Team\'s Potential. Let\'s Discuss How Expert Facilitation Can Elevate Your Meetings!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'conflict',
            icon: 'FiShield',
            title: 'Conflict Resolution & Mediation',
            subtitle: 'Resolve Differences. Rebuild Trust.',
            description: 'Unlock collaboration and rebuild trust with expert mediation and conflict resolution services. We facilitate dialogue and help parties find mutually beneficial solutions in professional environments.',
            cta: 'Address conflict before it hinders performance. Schedule a session today.',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'spiritual',
            icon: 'FiStar',
            title: 'Spiritual Coach/Advisor',
            subtitle: 'Nurture Your Spirit. Discover Your Path.',
            description: 'Guided spiritual development for those seeking deeper meaning and purpose. Through personalized coaching and mentorship, Lillian Adegbola helps individuals connect with their inner selves and live a more authentic, fulfilling life.',
            cta: 'Embark on Your Spiritual Journey. Schedule a Coaching Session Today!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'management',
            icon: 'FiSettings',
            title: 'Management Consultant',
            subtitle: 'Elevate Performance. Achieve Sustainable Growth.',
            description: 'As a seasoned Management Consultant, Lillian Adegbola provides strategic guidance to help organizations overcome challenges, optimize operations, and drive growth. With expertise in analysis, strategy, and implementation, she empowers businesses to achieve exceptional results.',
            cta: 'Unlock Your Organization\'s Potential. Let\'s Discuss Your Strategic Needs Today!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'capacity',
            icon: 'FiTrendingUp',
            title: 'Capacity Development',
            subtitle: 'Strengthen Your Organization. Amplify Your Impact.',
            description: 'Through tailored capacity development initiatives, Lillian Adegbola helps organizations build the skills, systems, and structures needed to achieve their goals. From team training to process improvement, she supports sustainable growth and enhanced effectiveness.',
            cta: 'Build Lasting Capacity. Explore Customized Development Solutions Today!',
            color: 'from-navy-700 to-navy-900'
          },
          {
            id: 'corporate',
            icon: 'FiBookOpen',
            title: 'Corporate Trainer',
            subtitle: 'Empower Your Team. Drive Business Results.',
            description: 'As a corporate trainer, Lillian Adegbola delivers engaging, results-driven training services that equip teams with the knowledge and skills needed to excel. From leadership development to functional training, she helps organizations unlock their full potential.',
            cta: 'Elevate Your Team\'s Performance. Schedule a Training Session Today!',
            color: 'from-navy-700 to-navy-900'
          }
        ];
      }

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

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...(formData.services_list || [])];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setFormData({
      ...formData,
      services_list: updatedServices
    });
  };

  const handleResetServicesToDefault = () => {
    if (window.confirm("Are you sure you want to reset the services list to the default 14 professional services? This will overwrite any edits you've made to the service titles and descriptions.")) {
      const defaults = [
        {
          id: 'keynote',
          icon: 'FiMic',
          title: 'Keynote Speaker Services',
          subtitle: 'Inspire Action. Transform Mindsets.',
          description: 'As a dynamic keynote speaker, Lillian Adegbola delivers powerful talks that ignite leadership, drive growth, and inspire teams to achieve more. With expertise in leadership, collaboration, and personal effectiveness, her keynotes leave a lasting impact.',
          cta: 'Book Lillian for your next event to spark transformation.',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'leadership',
          icon: 'FiUsers',
          title: 'Leadership Coaching',
          subtitle: 'Unlock Your Potential. Lead with Confidence.',
          description: 'Through personalized leadership coaching, Lillian Adegbola empowers leaders to discover their strengths, overcome obstacles, and reach their full potential. By fostering self-awareness, building resilience, and developing effective strategies, leaders can inspire their teams and drive success.',
          cta: 'Ready to Elevate Your Leadership? Schedule a Discovery Call Today!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'executive',
          icon: 'FiTarget',
          title: 'Executive Coaching',
          subtitle: 'Elevate Performance. Achieve Exceptional Results.',
          description: 'As an executive coach, Lillian Adegbola partners with senior leaders to tackle complex challenges, enhance decision-making, and drive business growth. With tailored guidance and support, executives can refine their leadership style, build high-performing teams, and achieve outstanding results.',
          cta: 'Let\'s Drive Exceptional Results Together! Book Your Executive Coaching Session Now!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'retreats',
          icon: 'FiMapPin',
          title: 'Destination Retreat Leader',
          subtitle: 'Reconnect. Refocus. Renew.',
          description: 'Join Lillian Adegbola on curated destination retreats blending leadership growth, team building, and personal renewal in inspiring settings. These transformative experiences help leaders and teams reconnect with purpose, refocus on goals, and renew their energy for impact.',
          cta: 'Want to foster connection, creativity, and renewal? Plan Your Next Retreat. Let\'s Create an Unforgettable Experience!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'advisory',
          icon: 'FiCompass',
          title: 'Strategic Advisory',
          subtitle: 'Strategic Insight. Trusted Counsel.',
          description: 'As a seasoned advisor, Lillian Adegbola leverages her expertise in leadership, facilitation, and strategic thinking to guide organizations through challenges and opportunities. With a focus on driving growth, effectiveness, and innovation, she provides trusted counsel to inform critical decisions.',
          cta: 'Let\'s Explore Strategic Opportunities. Schedule a Consultation Today!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'business',
          icon: 'FiBriefcase',
          title: 'Business Coaching',
          subtitle: 'Grow Your Business. Unlock Potential.',
          description: 'With expert business coaching, Lillian Adegbola helps entrepreneurs and business leaders overcome challenges, leverage strengths, and achieve growth. Through personalized guidance and accountability, she empowers businesses to boost performance, enhance strategies, and reach goals.',
          cta: 'Partner with Lillian for business coaching tailored to your needs.',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'organizational',
          icon: 'FiTrendingUp',
          title: 'Organizational Development',
          subtitle: 'Build High-Performing Teams. Drive Results.',
          description: 'Lillian Adegbola supports organizational development through strategies that enhance teamwork, improve communication, and boost performance. With expertise in facilitation and leadership, she helps organizations build capacity, foster collaboration, and achieve sustainable results.',
          cta: 'Work with Lillian to transform your organization\'s potential into impact.',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'life',
          icon: 'FiHeart',
          title: 'Life Coaching',
          subtitle: 'Unlock Your Potential. Live with Purpose.',
          description: 'With compassionate and expert life coaching, Lillian Adegbola helps individuals clarify goals, overcome obstacles, and create meaningful change. Through personalized support and strategies, she empowers clients to gain clarity, build confidence, find balance, and develop the courage to live an intentional and impactful life.',
          cta: 'Partner with Lillian for life coaching that radically transforms your life journey.',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'facilitation',
          icon: 'FiMessageCircle',
          title: 'Facilitation Expertise',
          subtitle: 'Transform Conversations. Unlock Collaboration.',
          description: 'Expert facilitation unlocks collaboration, fuels innovation, and drives outcomes in leadership teams, workshops, and strategic meetings. With proven skills in guiding discussions, fostering participation, and managing dynamics, we help teams achieve more together.',
          cta: 'Unlock Your Team\'s Potential. Let\'s Discuss How Expert Facilitation Can Elevate Your Meetings!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'conflict',
          icon: 'FiShield',
          title: 'Conflict Resolution & Mediation',
          subtitle: 'Resolve Differences. Rebuild Trust.',
          description: 'Unlock collaboration and rebuild trust with expert mediation and conflict resolution services. We facilitate dialogue and help parties find mutually beneficial solutions in professional environments.',
          cta: 'Address conflict before it hinders performance. Schedule a session today.',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'spiritual',
          icon: 'FiStar',
          title: 'Spiritual Coach/Advisor',
          subtitle: 'Nurture Your Spirit. Discover Your Path.',
          description: 'Guided spiritual development for those seeking deeper meaning and purpose. Through personalized coaching and mentorship, Lillian Adegbola helps individuals connect with their inner selves and live a more authentic, fulfilling life.',
          cta: 'Embark on Your Spiritual Journey. Schedule a Coaching Session Today!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'management',
          icon: 'FiSettings',
          title: 'Management Consultant',
          subtitle: 'Elevate Performance. Achieve Sustainable Growth.',
          description: 'As a seasoned Management Consultant, Lillian Adegbola provides strategic guidance to help organizations overcome challenges, optimize operations, and drive growth. With expertise in analysis, strategy, and implementation, she empowers businesses to achieve exceptional results.',
          cta: 'Unlock Your Organization\'s Potential. Let\'s Discuss Your Strategic Needs Today!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'capacity',
          icon: 'FiTrendingUp',
          title: 'Capacity Development',
          subtitle: 'Strengthen Your Organization. Amplify Your Impact.',
          description: 'Through tailored capacity development initiatives, Lillian Adegbola helps organizations build the skills, systems, and structures needed to achieve their goals. From team training to process improvement, she supports sustainable growth and enhanced effectiveness.',
          cta: 'Build Lasting Capacity. Explore Customized Development Solutions Today!',
          color: 'from-navy-700 to-navy-900'
        },
        {
          id: 'corporate',
          icon: 'FiBookOpen',
          title: 'Corporate Trainer',
          subtitle: 'Empower Your Team. Drive Business Results.',
          description: 'As a corporate trainer, Lillian Adegbola delivers engaging, results-driven training services that equip teams with the knowledge and skills needed to excel. From leadership development to functional training, she helps organizations unlock their full potential.',
          cta: 'Elevate Your Team\'s Performance. Schedule a Training Session Today!',
          color: 'from-navy-700 to-navy-900'
        }
      ];
      setFormData({
        ...formData,
        services_list: defaults
      });
    }
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
    { id: 'cms', name: 'Landing Page CMS', icon: FiFileText },
    { id: 'images', name: 'Images', icon: FiImage },
    { id: 'seo', name: 'SEO & Meta', icon: FiSearch },
    { id: 'social', name: 'Social Media', icon: FiLinkedin },
    { id: 'analytics', name: 'Analytics', icon: FiTrendingUp },
    { id: 'features', name: 'Features', icon: FiSettings },
    { id: 'branding', name: 'Branding', icon: FiType },
    { id: 'legal', name: 'Legal & Privacy', icon: FiShield }
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

              {/* Impact Metrics (Stats / Ratings) */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-base font-playfair font-bold text-navy-800 mb-2">
                  Impact Statistics (Homepage Ratings)
                </h4>
                <p className="text-xs text-gray-500 mb-4 font-montserrat">
                  Configure the rating metrics displayed on the home page. Set any metric to 0 or leave it empty to hide it on the website.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leaders Transformed (e.g., 500+)
                    </label>
                    <input
                      type="text"
                      name="stat_leaders_transformed"
                      value={formData.stat_leaders_transformed}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="500+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Success Rate (e.g., 95%)
                    </label>
                    <input
                      type="text"
                      name="stat_success_rate"
                      value={formData.stat_success_rate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="95%"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience (e.g., 15+)
                    </label>
                    <input
                      type="text"
                      name="stat_years_experience"
                      value={formData.stat_years_experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="15+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizations Served (e.g., 50+)
                    </label>
                    <input
                      type="text"
                      name="stat_organizations_served"
                      value={formData.stat_organizations_served}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                      placeholder="50+"
                    />
                </div>
              </div>
            </div>

              {/* Downloadable Assets */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-base font-playfair font-bold text-navy-800 mb-2">
                  Downloadable Assets
                </h4>
                <p className="text-xs text-gray-500 mb-4 font-montserrat">
                  Configure links for downloadable resources on your public website.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leadership Guide PDF Link
                  </label>
                  <input
                    type="url"
                    name="download_leadership_guide_url"
                    value={formData.download_leadership_guide_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                    placeholder="https://example.com/leadership-guide.pdf"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-montserrat">
                    This link is used when visitors click the "Download Leadership Guide" button on the homepage.
                  </p>
                </div>
              </div>

              {/* Site Status (Maintenance Mode) */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-base font-playfair font-bold text-navy-800 mb-2">
                  Site Status
                </h4>
                <p className="text-xs text-gray-500 mb-4 font-montserrat">
                  Control the availability of your public website and user portal.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex-1 pr-6">
                    <h5 className="font-playfair font-bold text-amber-800 mb-1 text-sm md:text-base">
                      Enable Maintenance Mode
                    </h5>
                    <p className="text-xs md:text-sm text-amber-700 font-montserrat leading-relaxed">
                      When enabled, all pages (except the Admin Dashboard) will show a custom maintenance page. You can still access this dashboard to toggle it back off.
                    </p>
                  </div>
                  <label className="flex items-center space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="maintenance_mode"
                      checked={formData.maintenance_mode}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-amber-800 uppercase tracking-wider font-montserrat">
                      {formData.maintenance_mode ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Landing Page CMS Settings */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">
                  Landing Page Content Manager
                </h3>
                <p className="text-sm text-gray-600 font-montserrat">
                  Customize the written content shown across the main sections of your public website.
                </p>
              </div>

              {/* Sidebar layout inside CMS tab */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                
                {/* Section Subnav/Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1.5 shadow-sm sticky top-24">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-2 border-b border-gray-100 font-montserrat">
                      CMS Sections
                    </p>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('hero')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold font-montserrat transition-all flex items-center justify-between ${
                        cmsSubTab === 'hero'
                          ? 'bg-navy-800 text-white shadow'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Hero Section</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        Top
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('about')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold font-montserrat transition-all flex items-center justify-between ${
                        cmsSubTab === 'about'
                          ? 'bg-navy-800 text-white shadow'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>About Lillian</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        Bio
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('services')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold font-montserrat transition-all flex items-center justify-between ${
                        cmsSubTab === 'services'
                          ? 'bg-navy-800 text-white shadow'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Services Section</span>
                      <span className="text-[10px] bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded font-bold">
                        {formData.services_list?.length || 0} items
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('testimonials')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold font-montserrat transition-all flex items-center justify-between ${
                        cmsSubTab === 'testimonials'
                          ? 'bg-navy-800 text-white shadow'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Testimonials</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        Stories
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('contact')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold font-montserrat transition-all flex items-center justify-between ${
                        cmsSubTab === 'contact'
                          ? 'bg-navy-800 text-white shadow'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Contact Section</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        Footer
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sub Tab Content */}
                <div className="lg:col-span-3 space-y-6">

                  {cmsSubTab === 'hero' && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                      <h4 className="text-md font-playfair font-bold text-navy-800 border-b border-gray-200 pb-3 flex items-center">
                        <span className="w-2.5 h-2.5 bg-gold-500 rounded-full mr-2"></span>
                        Hero Section
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Tagline
                          </label>
                          <input
                            type="text"
                            name="hero_tagline"
                            value={formData.hero_tagline || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="The Queen of Clarity & Purpose"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hero Description / Subtext
                          </label>
                          <textarea
                            name="hero_description"
                            value={formData.hero_description || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="Unlock your fearless potential..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Headline Part 1
                          </label>
                          <input
                            type="text"
                            name="hero_title_1"
                            value={formData.hero_title_1 || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Transforming"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Headline Accent 1 (Cursive)
                          </label>
                          <input
                            type="text"
                            name="hero_title_accent_1"
                            value={formData.hero_title_accent_1 || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Leaders"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Headline Part 2
                          </label>
                          <input
                            type="text"
                            name="hero_title_2"
                            value={formData.hero_title_2 || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Empowering"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Headline Accent 2 (Cursive)
                          </label>
                          <input
                            type="text"
                            name="hero_title_accent_2"
                            value={formData.hero_title_accent_2 || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Lives"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Button (CTA)
                          </label>
                          <input
                            type="text"
                            name="hero_cta_primary"
                            value={formData.hero_cta_primary || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="Start Your Transformation"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secondary Button (CTA)
                          </label>
                          <input
                            type="text"
                            name="hero_cta_secondary"
                            value={formData.hero_cta_secondary || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="Explore Services"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {cmsSubTab === 'about' && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                      <h4 className="text-md font-playfair font-bold text-navy-800 border-b border-gray-200 pb-3 flex items-center">
                        <span className="w-2.5 h-2.5 bg-gold-500 rounded-full mr-2"></span>
                        About Section
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section Badge
                          </label>
                          <input
                            type="text"
                            name="about_badge"
                            value={formData.about_badge || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="About Lillian"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heading Title Part 1
                          </label>
                          <input
                            type="text"
                            name="about_heading_1"
                            value={formData.about_heading_1 || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="A Powerhouse"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heading Accent (Cursive)
                          </label>
                          <input
                            type="text"
                            name="about_heading_accent"
                            value={formData.about_heading_accent || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="of Transformation"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          About Biography (WYSIWYG Rich Text) *
                        </label>
                        <RichTextEditor
                          value={formData.about_content || ''}
                          onChange={(val) => setFormData(prev => ({ ...prev, about_content: val }))}
                          placeholder="Write Lillian's biography/about content..."
                          height={200}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          About Button text (CTA)
                        </label>
                        <input
                          type="text"
                          name="about_cta"
                          value={formData.about_cta || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                          placeholder="Discover My Story"
                        />
                      </div>
                    </div>
                  )}

                  {cmsSubTab === 'services' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-3">
                          <h4 className="text-md font-playfair font-bold text-navy-800 flex items-center">
                            <span className="w-2.5 h-2.5 bg-gold-500 rounded-full mr-2"></span>
                            Services Section Header
                          </h4>
                          <button
                            type="button"
                            onClick={handleResetServicesToDefault}
                            className="px-3 py-1.5 border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold font-montserrat transition-all flex items-center self-start sm:self-auto shadow-sm"
                          >
                            Reset Services to Default List
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Services Badge
                            </label>
                            <input
                              type="text"
                              name="services_badge"
                              value={formData.services_badge || ''}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                              placeholder="My Offerings"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Services Heading
                            </label>
                            <input
                              type="text"
                              name="services_heading"
                              value={formData.services_heading || ''}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                              placeholder="Services & Coaching Solutions"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Services Subtext
                          </label>
                          <textarea
                            name="services_subtext"
                            value={formData.services_subtext || ''}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
                            placeholder="Tailored guidance and transformational experiences..."
                          />
                        </div>
                      </div>

                      {/* Individual Services Content */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                        <h4 className="text-md font-playfair font-bold text-navy-800 border-b border-gray-200 pb-3 flex items-center">
                          <span className="w-2.5 h-2.5 bg-gold-500 rounded-full mr-2"></span>
                          Individual Services & Offerings ({formData.services_list?.length || 0})
                        </h4>

                        <div className="space-y-4">
                          {formData.services_list && formData.services_list.map((service, index) => (
                            <div key={service.id || index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                              <button
                                type="button"
                                onClick={() => setExpandedServiceIndex(expandedServiceIndex === index ? null : index)}
                                className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded">
                                    {index + 1}
                                  </span>
                                  <span className="font-playfair font-bold text-navy-800 text-sm">
                                    {service.title || `Service ${index + 1}`}
                                  </span>
                                  <span className="text-xs text-gray-500 font-montserrat font-medium">
                                    ({service.id})
                                  </span>
                                </div>
                                <span className="text-navy-800 font-bold text-lg leading-none">
                                  {expandedServiceIndex === index ? '−' : '+'}
                                </span>
                              </button>

                              {expandedServiceIndex === index && (
                                <div className="p-5 border-t border-gray-200 space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Service Title
                                      </label>
                                      <input
                                        type="text"
                                        value={service.title || ''}
                                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                                        placeholder="Service Title"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Subtitle
                                      </label>
                                      <input
                                        type="text"
                                        value={service.subtitle || ''}
                                        onChange={(e) => handleServiceChange(index, 'subtitle', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                                        placeholder="Subtitle"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Icon Component (Lucide/Feather name)
                                      </label>
                                      <select
                                        value={service.icon || ''}
                                        onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                                      >
                                        <option value="FiMic">FiMic (Microphone)</option>
                                        <option value="FiUsers">FiUsers (Users/Coaching)</option>
                                        <option value="FiTarget">FiTarget (Target/Goal)</option>
                                        <option value="FiMapPin">FiMapPin (Map Pin/Retreats)</option>
                                        <option value="FiCompass">FiCompass (Compass/Advisory)</option>
                                        <option value="FiBriefcase">FiBriefcase (Briefcase/Business)</option>
                                        <option value="FiHeart">FiHeart (Heart/Life)</option>
                                        <option value="FiMessageCircle">FiMessageCircle (Message/Facilitation)</option>
                                        <option value="FiShield">FiShield (Shield/Mediation)</option>
                                        <option value="FiStar">FiStar (Star/Spiritual)</option>
                                        <option value="FiSettings">FiSettings (Settings/Consultant)</option>
                                        <option value="FiTrendingUp">FiTrendingUp (Trending Up/Capacity)</option>
                                        <option value="FiBookOpen">FiBookOpen (Book/Training)</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        CTA Text
                                      </label>
                                      <input
                                        type="text"
                                        value={service.cta || ''}
                                        onChange={(e) => handleServiceChange(index, 'cta', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                                        placeholder="CTA Action Button Text"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      value={service.description || ''}
                                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                                      placeholder="Service Description"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Testimonials Section Tab */}
                  {cmsSubTab === 'testimonials' && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                      <h4 className="text-md font-playfair font-bold text-navy-800 border-b border-gray-200 pb-3 flex items-center">
                        <span className="w-2.5 h-2.5 bg-gold-500 rounded-full mr-2"></span>
                        Testimonials Section Header
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                          <input
                            type="text"
                            name="testimonials_badge"
                            value={formData.testimonials_badge || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Success Stories"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Heading</label>
                          <input
                            type="text"
                            name="testimonials_heading"
                            value={formData.testimonials_heading || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Transformation in Action"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Subtext</label>
                          <textarea
                            name="testimonials_subtext"
                            value={formData.testimonials_subtext || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Discover how visionary leaders..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Section Tab */}
                  {cmsSubTab === 'contact' && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                      <h4 className="text-md font-playfair font-bold text-navy-800 border-b border-gray-200 pb-3 flex items-center">
                        <span className="w-2.5 h-2.5 bg-gold-500 rounded-full mr-2"></span>
                        Contact Section Header
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                          <input
                            type="text"
                            name="contact_badge"
                            value={formData.contact_badge || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Get In Touch"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Heading</label>
                          <input
                            type="text"
                            name="contact_heading"
                            value={formData.contact_heading || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Let's Begin Your Journey"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Subtext</label>
                          <textarea
                            name="contact_subtext"
                            value={formData.contact_subtext || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm"
                            placeholder="Ready to gain clarity..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
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

          {/* Legal Settings */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                Legal & Compliance
              </h3>

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