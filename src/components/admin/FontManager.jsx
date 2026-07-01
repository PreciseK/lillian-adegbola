import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiType, FiSave, FiRotateCcw, FiEye, FiCheck, FiX } = FiIcons;

const FontManager = () => {
  const [fontSettings, setFontSettings] = useState({
    primary_font: 'Playfair Display',
    secondary_font: 'Montserrat',
    accent_font: 'Dancing Script',
    body_font_size: '16',
    heading_font_size: '48',
    line_height: '1.6',
    font_weight_normal: '400',
    font_weight_bold: '700'
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    fetchFontSettings();
  }, []);

  const fetchFontSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings_la2024')
        .select('key, value')
        .in('key', [
          'primary_font', 'secondary_font', 'accent_font', 
          'body_font_size', 'heading_font_size', 'line_height',
          'font_weight_normal', 'font_weight_bold'
        ]);

      if (error) throw error;

      const settings = {};
      data?.forEach(setting => {
        try {
          settings[setting.key] = typeof setting.value === 'string' 
            ? JSON.parse(setting.value) 
            : setting.value;
        } catch {
          settings[setting.key] = setting.value;
        }
      });

      const updatedSettings = { ...fontSettings, ...settings };
      setFontSettings(updatedSettings);
      setOriginalSettings(updatedSettings);
    } catch (error) {
      console.log('Using default font settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFontSettings = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(fontSettings).map(([key, value]) => ({
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

      // Apply font changes to the document
      applyFontSettings();
      
      setOriginalSettings({ ...fontSettings });
      setPreviewMode(false);
      alert('Font settings updated successfully!');
    } catch (error) {
      console.error('Error updating font settings:', error);
      alert('Error updating font settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const applyFontSettings = () => {
    const root = document.documentElement;
    
    // Update CSS custom properties
    root.style.setProperty('--font-primary', fontSettings.primary_font);
    root.style.setProperty('--font-secondary', fontSettings.secondary_font);
    root.style.setProperty('--font-accent', fontSettings.accent_font);
    root.style.setProperty('--font-size-body', `${fontSettings.body_font_size}px`);
    root.style.setProperty('--font-size-heading', `${fontSettings.heading_font_size}px`);
    root.style.setProperty('--line-height', fontSettings.line_height);
    root.style.setProperty('--font-weight-normal', fontSettings.font_weight_normal);
    root.style.setProperty('--font-weight-bold', fontSettings.font_weight_bold);

    // Update Google Fonts link if needed
    updateGoogleFonts();
  };

  const updateGoogleFonts = () => {
    const fonts = [
      fontSettings.primary_font,
      fontSettings.secondary_font,
      fontSettings.accent_font
    ].filter(font => font && font !== 'Arial' && font !== 'Georgia' && font !== 'Times New Roman');

    if (fonts.length > 0) {
      const fontQuery = fonts.map(font => 
        `${font.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900`
      ).join('&family=');

      const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
      if (existingLink) {
        existingLink.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
      } else {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://fonts.googleapis.com';
        document.head.appendChild(link);

        const link2 = document.createElement('link');
        link2.rel = 'preconnect';
        link2.href = 'https://fonts.gstatic.com';
        link2.crossOrigin = 'anonymous';
        document.head.appendChild(link2);

        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
        document.head.appendChild(fontLink);
      }
    }
  };

  const handlePreview = () => {
    setPreviewMode(true);
    applyFontSettings();
  };

  const handleCancelPreview = () => {
    setPreviewMode(false);
    setFontSettings({ ...originalSettings });
    // Revert to original settings
    const root = document.documentElement;
    root.style.setProperty('--font-primary', originalSettings.primary_font);
    root.style.setProperty('--font-secondary', originalSettings.secondary_font);
    root.style.setProperty('--font-accent', originalSettings.accent_font);
    root.style.setProperty('--font-size-body', `${originalSettings.body_font_size}px`);
    root.style.setProperty('--font-size-heading', `${originalSettings.heading_font_size}px`);
    root.style.setProperty('--line-height', originalSettings.line_height);
    root.style.setProperty('--font-weight-normal', originalSettings.font_weight_normal);
    root.style.setProperty('--font-weight-bold', originalSettings.font_weight_bold);
  };

  const resetToDefaults = () => {
    const defaults = {
      primary_font: 'Playfair Display',
      secondary_font: 'Montserrat',
      accent_font: 'Dancing Script',
      body_font_size: '16',
      heading_font_size: '48',
      line_height: '1.6',
      font_weight_normal: '400',
      font_weight_bold: '700'
    };
    setFontSettings(defaults);
  };

  const handleInputChange = (key, value) => {
    setFontSettings({
      ...fontSettings,
      [key]: value
    });
  };

  const googleFonts = [
    'Playfair Display', 'Montserrat', 'Dancing Script', 'Open Sans', 'Roboto',
    'Lato', 'Oswald', 'Source Sans Pro', 'Raleway', 'Poppins', 'Merriweather',
    'PT Sans', 'Ubuntu', 'Nunito', 'Work Sans', 'Crimson Text', 'Libre Baskerville',
    'Cormorant Garamond', 'EB Garamond', 'Lora', 'Inter', 'Fira Sans'
  ];

  const systemFonts = [
    'Arial', 'Georgia', 'Times New Roman', 'Helvetica', 'Verdana', 'Trebuchet MS'
  ];

  const allFonts = [...googleFonts, ...systemFonts];

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
          Font Settings
        </h2>
        <p className="text-gray-600 font-montserrat">
          Customize typography and font settings for your website
        </p>
      </div>

      {/* Preview Banner */}
      {previewMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiEye} className="text-blue-600" />
              <span className="text-blue-800 font-semibold">Preview Mode Active</span>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSaveFontSettings}
                disabled={saving}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-green-700 disabled:opacity-50"
              >
                <SafeIcon icon={saving ? FiSave : FiCheck} className={saving ? 'animate-spin' : ''} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleCancelPreview}
                className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-gray-50"
              >
                <SafeIcon icon={FiX} />
                <span>Cancel</span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Font Family Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-bold text-navy-800 mb-6 flex items-center">
          <SafeIcon icon={FiType} className="mr-2 text-gold-600" />
          Font Families
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Font (Headings)
            </label>
            <select
              value={fontSettings.primary_font}
              onChange={(e) => handleInputChange('primary_font', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
            >
              <optgroup label="Google Fonts">
                {googleFonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </optgroup>
              <optgroup label="System Fonts">
                {systemFonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </optgroup>
            </select>
            <div className="mt-2 p-3 bg-gray-50 rounded border text-center" style={{ fontFamily: fontSettings.primary_font }}>
              <h4 className="text-lg font-bold">Sample Heading Text</h4>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Font (Body Text)
            </label>
            <select
              value={fontSettings.secondary_font}
              onChange={(e) => handleInputChange('secondary_font', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
            >
              <optgroup label="Google Fonts">
                {googleFonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </optgroup>
              <optgroup label="System Fonts">
                {systemFonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </optgroup>
            </select>
            <div className="mt-2 p-3 bg-gray-50 rounded border" style={{ fontFamily: fontSettings.secondary_font }}>
              <p>This is sample body text to demonstrate the font appearance and readability.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Font (Decorative)
            </label>
            <select
              value={fontSettings.accent_font}
              onChange={(e) => handleInputChange('accent_font', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
            >
              <optgroup label="Google Fonts">
                {googleFonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </optgroup>
              <optgroup label="System Fonts">
                {systemFonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </optgroup>
            </select>
            <div className="mt-2 p-3 bg-gray-50 rounded border text-center" style={{ fontFamily: fontSettings.accent_font }}>
              <p className="text-lg">Decorative Text</p>
            </div>
          </div>
        </div>
      </div>

      {/* Font Size and Spacing Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-bold text-navy-800 mb-6">
          Size and Spacing
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Font Size (px)
            </label>
            <input
              type="number"
              min="12"
              max="24"
              value={fontSettings.body_font_size}
              onChange={(e) => handleInputChange('body_font_size', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading Font Size (px)
            </label>
            <input
              type="number"
              min="24"
              max="72"
              value={fontSettings.heading_font_size}
              onChange={(e) => handleInputChange('heading_font_size', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Line Height
            </label>
            <select
              value={fontSettings.line_height}
              onChange={(e) => handleInputChange('line_height', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
            >
              <option value="1.2">Tight (1.2)</option>
              <option value="1.4">Snug (1.4)</option>
              <option value="1.6">Normal (1.6)</option>
              <option value="1.8">Relaxed (1.8)</option>
              <option value="2.0">Loose (2.0)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Weight (Bold)
            </label>
            <select
              value={fontSettings.font_weight_bold}
              onChange={(e) => handleInputChange('font_weight_bold', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
            >
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-bold text-navy-800 mb-6">
          Typography Preview
        </h3>
        
        <div className="space-y-6">
          <div style={{ 
            fontFamily: fontSettings.primary_font,
            fontSize: `${fontSettings.heading_font_size}px`,
            lineHeight: fontSettings.line_height,
            fontWeight: fontSettings.font_weight_bold
          }}>
            <h1 className="text-navy-800">Main Heading Sample</h1>
          </div>
          
          <div style={{ 
            fontFamily: fontSettings.accent_font,
            fontSize: `${Math.round(fontSettings.heading_font_size * 0.75)}px`,
            lineHeight: fontSettings.line_height
          }}>
            <h2 className="text-gold-600">Accent Font Sample</h2>
          </div>
          
          <div style={{ 
            fontFamily: fontSettings.secondary_font,
            fontSize: `${fontSettings.body_font_size}px`,
            lineHeight: fontSettings.line_height,
            fontWeight: fontSettings.font_weight_normal
          }}>
            <p className="text-gray-700">
              This is a sample paragraph demonstrating how the body text will appear with your selected font settings. 
              It includes regular text and <strong style={{ fontWeight: fontSettings.font_weight_bold }}>bold text</strong> to 
              show the contrast and readability of your typography choices.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={resetToDefaults}
          className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-gray-50"
        >
          <SafeIcon icon={FiRotateCcw} />
          <span>Reset to Defaults</span>
        </motion.button>

        {!previewMode && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handlePreview}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-blue-700"
          >
            <SafeIcon icon={FiEye} />
            <span>Preview Changes</span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSaveFontSettings}
          disabled={saving}
          className="flex items-center justify-center space-x-2 bg-navy-800 text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-navy-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SafeIcon icon={saving ? FiSave : FiSave} className={saving ? 'animate-spin' : ''} />
          <span>{saving ? 'Saving...' : 'Save Font Settings'}</span>
        </motion.button>
      </div>

      {/* Font Guidelines */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-semibold text-navy-800 mb-3">Font Selection Guidelines</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h5 className="font-semibold mb-2">Best Practices:</h5>
            <ul className="space-y-1">
              <li>• Choose fonts that reflect your brand personality</li>
              <li>• Ensure good contrast between headings and body text</li>
              <li>• Test readability on different screen sizes</li>
              <li>• Limit to 2-3 font families maximum</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Performance Tips:</h5>
            <ul className="space-y-1">
              <li>• Google Fonts are optimized for web performance</li>
              <li>• System fonts load fastest but offer less uniqueness</li>
              <li>• Avoid too many font weights to reduce load time</li>
              <li>• Test loading speed after font changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontManager;