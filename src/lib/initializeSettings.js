import supabase from './supabase';

const defaultSettings = {
  // Site Information
  site_title: 'Lillian Adegbola - Queen of Clarity & Purpose',
  site_tagline: 'Transforming Leaders, Empowering Lives',
  site_description: 'Empowering visionary leaders and ambitious achievers through transformational coaching, keynote speaking, and strategic guidance.',

  // Contact Information
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
  og_url: 'https://lillianadegbola.com',
  twitter_card: 'summary_large_image',
  twitter_title: 'Lillian Adegbola - Leadership Transformation',
  twitter_description: 'Unlock your fearless potential with transformational leadership coaching.',
  twitter_image: 'https://lillianadegbola.com/twitter-image.jpg',
  twitter_site: '@LillianAdegbola',
  canonical_url: 'https://lillianadegbola.com',
  robots_txt: 'User-agent: *\nAllow: /',
  sitemap_enabled: true,

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
  structured_data_enabled: true,

  // Site verification
  google_site_verification: '',
  bing_site_verification: '',

  // Social Media Links
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

  // Impact Metrics
  stat_leaders_transformed: '500+',
  stat_success_rate: '95%',
  stat_years_experience: '15+',
  stat_organizations_served: '50+',
  download_leadership_guide_url: '',

  // SEO Performance
  lazy_loading: true,
  image_optimization: true,
  minification: true,
  compression: true,
  caching_enabled: true,
  breadcrumbs_enabled: true,

  // SEO Content
  focus_keywords: 'leadership coaching, executive coaching, keynote speaker, business transformation',
  target_audience: 'executives, entrepreneurs, business leaders, professionals',
  content_strategy: 'thought leadership, case studies, transformation stories',
  rank_tracking_keywords: JSON.stringify([
    'leadership coach',
    'executive coach',
    'keynote speaker',
    'business coach',
    'transformation coach'
  ]),

  // Landing Page CMS Content
  // Hero Section
  hero_tagline: 'The Queen of Clarity & Purpose',
  hero_title_1: 'Transforming',
  hero_title_accent_1: 'Leaders',
  hero_title_2: 'Empowering',
  hero_title_accent_2: 'Lives',
  hero_description: 'Unlock your fearless potential and achieve sustainable positive transformation. I help ambitious leaders and visionaries become the best authentic version of themselves.',
  hero_cta_primary: 'Start Your Transformation',
  hero_cta_secondary: 'Explore Services',

  // About Section
  about_badge: 'About Lillian',
  about_heading_1: 'A Powerhouse',
  about_heading_accent: 'of Transformation',
  about_content: '<p>With my <strong>multi-gifted, multi-talented, and multi-skilled</strong> expertise, I have created incredible experiences, solutions, and results for many individuals, leaders, businesses, organizations, and non-profits.</p><p>I am <strong>bold, authentic, and dignified</strong>. As the Queen of Clarity, Rapid Results, and Purpose, I help confident and courageous people become the best authentic version of themselves or their business.</p><p>My passion lies in <strong>Sustainable Positive Transformation</strong> - guiding you to unlock your fearless potential and live with clarity, freedom, purpose, impact, peace, joy, and fulfillment.</p>',
  about_cta: 'Discover My Story',

  // Services Section
  services_badge: 'My Offerings',
  services_heading: 'Services & Coaching Solutions',
  services_subtext: 'Tailored guidance and transformational experiences designed to help you, your team, or your organization lead with clarity and achieve rapid, sustainable results.',

  // Testimonials Section
  testimonials_badge: 'Success Stories',
  testimonials_heading: 'Transformation in Action',
  testimonials_subtext: 'Read authentic feedback and stories of leaders and visionaries who have undergone sustainable positive transformation.',

  // Contact Section
  contact_badge: 'Get In Touch',
  contact_heading: 'Let\'s Begin Your Journey',
  contact_subtext: 'Ready to gain clarity, unlock your fearless potential, and create rapid results? Contact me today to book a keynote or starting session.'
};

export const initializeSettings = async () => {
  try {
    console.log('🔄 Initializing website settings...');

    // Fetch existing settings keys
    const { data: existingSettings, error: fetchError } = await supabase
      .from('site_settings_la2024')
      .select('key');

    if (fetchError) {
      console.error('❌ Error checking settings:', fetchError);
      return false;
    }

    const existingKeys = new Set(existingSettings?.map(s => s.key) || []);

    // Filter out defaults that already exist in database
    const missingSettings = Object.entries(defaultSettings)
      .filter(([key]) => !existingKeys.has(key))
      .map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

    if (missingSettings.length === 0) {
      console.log('✅ All default settings already exist');
      return true;
    }

    console.log(`🔄 Inserting ${missingSettings.length} missing settings...`);

    // Insert missing settings in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < missingSettings.length; i += batchSize) {
      const batch = missingSettings.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('site_settings_la2024')
        .insert(batch);

      if (insertError) {
        console.error('❌ Error inserting settings batch:', insertError);
        throw insertError;
      }

      console.log(`✅ Inserted missing settings batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(missingSettings.length / batchSize)}`);
    }

    console.log('✅ Default settings initialized/synchronized successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error initializing settings:', error);
    return false;
  }
};

export default initializeSettings;