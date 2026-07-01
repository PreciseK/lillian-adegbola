import React, { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

const SEOHead = ({ pageType = 'home', pageData = {} }) => {
  const { settings, loading } = useSettings([
    'meta_title', 'meta_description', 'meta_keywords', 'canonical_url',
    'og_title', 'og_description', 'og_image', 'og_type', 'og_url',
    'twitter_card', 'twitter_title', 'twitter_description', 'twitter_image', 'twitter_site',
    'schema_type', 'schema_name', 'schema_job_title', 'schema_description', 'schema_url', 'schema_image', 'schema_same_as',
    'google_site_verification', 'bing_site_verification'
  ]);

  useEffect(() => {
    if (loading) return;

    // Update document title
    const title = pageData.title || settings.meta_title || 'Lillian Adegbola - Queen of Clarity & Purpose';
    document.title = title;

    // Update or create meta tags
    updateOrCreateMeta('description', pageData.description || settings.meta_description);
    updateOrCreateMeta('keywords', settings.meta_keywords);

    // Open Graph tags
    updateOrCreateMeta('og:title', pageData.og_title || settings.og_title, 'property');
    updateOrCreateMeta('og:description', pageData.og_description || settings.og_description, 'property');
    updateOrCreateMeta('og:image', pageData.og_image || settings.og_image, 'property');
    updateOrCreateMeta('og:type', settings.og_type, 'property');
    updateOrCreateMeta('og:url', pageData.canonical_url || settings.canonical_url, 'property');

    // Twitter Card tags
    updateOrCreateMeta('twitter:card', settings.twitter_card);
    updateOrCreateMeta('twitter:title', pageData.twitter_title || settings.twitter_title);
    updateOrCreateMeta('twitter:description', pageData.twitter_description || settings.twitter_description);
    updateOrCreateMeta('twitter:image', pageData.twitter_image || settings.twitter_image);
    updateOrCreateMeta('twitter:site', settings.twitter_site);

    // Site verification tags
    if (settings.google_site_verification) {
      updateOrCreateMeta('google-site-verification', settings.google_site_verification);
    }
    if (settings.bing_site_verification) {
      updateOrCreateMeta('msvalidate.01', settings.bing_site_verification);
    }

    // Canonical URL
    updateOrCreateLink('canonical', pageData.canonical_url || settings.canonical_url);

    // Schema.org structured data
    if (settings.schema_type && settings.structured_data_enabled !== false) {
      updateStructuredData();
    }

  }, [settings, pageData, loading, pageType]);

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

  const updateStructuredData = () => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': settings.schema_type || 'Person',
      name: settings.schema_name || 'Lillian Adegbola',
      jobTitle: settings.schema_job_title || 'Leadership Coach & Keynote Speaker',
      description: settings.schema_description || 'Queen of Clarity & Purpose - Transforming leaders and empowering lives',
      url: settings.schema_url || 'https://lillianadegbola.com',
      image: settings.schema_image || 'https://lillianadegbola.com/profile-image.jpg'
    };

    // Add social media links if available
    if (settings.schema_same_as) {
      try {
        const sameAs = typeof settings.schema_same_as === 'string' 
          ? JSON.parse(settings.schema_same_as) 
          : settings.schema_same_as;
        if (Array.isArray(sameAs) && sameAs.length > 0) {
          structuredData.sameAs = sameAs;
        }
      } catch (e) {
        console.warn('Invalid schema_same_as format:', settings.schema_same_as);
      }
    }

    // Add services if it's a Person or Professional Service
    if (settings.schema_type === 'Person' || settings.schema_type === 'ProfessionalService') {
      structuredData.knowsAbout = [
        'Leadership Coaching',
        'Executive Coaching',
        'Keynote Speaking',
        'Business Coaching',
        'Life Coaching',
        'Personal Transformation'
      ];

      structuredData.offers = {
        '@type': 'Service',
        serviceType: 'Leadership & Life Coaching',
        description: 'Empowering leaders through transformational coaching and strategic guidance'
      };
    }

    // Create and append script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  };

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;