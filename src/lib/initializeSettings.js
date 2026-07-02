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
  services_list: [
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
  ],

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