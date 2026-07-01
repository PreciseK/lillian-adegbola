import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiImage, FiUpload, FiSave, FiEye, FiTrash2, FiEdit3, FiCheck, FiX } = FiIcons;

const PortraitManager = () => {
  const [currentPortrait, setCurrentPortrait] = useState('https://data.scriptsedgeonline.com/wp-content/uploads/2025/08/z-9c5N1_400x400.jpg');
  const [newPortraitUrl, setNewPortraitUrl] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCurrentPortrait();
  }, []);

  const fetchCurrentPortrait = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings_la2024')
        .select('value')
        .eq('key', 'portrait_url')
        .single();

      if (data && data.value) {
        const parsedValue = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        setCurrentPortrait(parsedValue);
      }
    } catch (error) {
      console.log('Using default portrait URL');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePortrait = async () => {
    if (!newPortraitUrl.trim()) {
      alert('Please enter a valid image URL');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings_la2024')
        .upsert({
          key: 'portrait_url',
          value: JSON.stringify(newPortraitUrl.trim()),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      setCurrentPortrait(newPortraitUrl.trim());
      setNewPortraitUrl('');
      setPreviewMode(false);
      alert('Portrait updated successfully!');
    } catch (error) {
      console.error('Error updating portrait:', error);
      alert('Error updating portrait: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (!newPortraitUrl.trim()) {
      alert('Please enter an image URL to preview');
      return;
    }
    setPreviewMode(true);
  };

  const handleCancelPreview = () => {
    setPreviewMode(false);
    setNewPortraitUrl('');
  };

  const presetPortraits = [
    {
      url: 'https://data.scriptsedgeonline.com/wp-content/uploads/2025/08/z-9c5N1_400x400.jpg',
      name: 'Current Professional'
    },
    {
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      name: 'Professional 1'
    },
    {
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      name: 'Professional 2'
    },
    {
      url: 'https://images.unsplash.com/photo-1594736797933-d0401ba6fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      name: 'Professional 3'
    }
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
          Portrait Management
        </h2>
        <p className="text-gray-600 font-montserrat">
          Manage and update the professional portrait displayed on your website
        </p>
      </div>

      {/* Current Portrait Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4 flex items-center">
          <SafeIcon icon={FiImage} className="mr-2 text-gold-600" />
          Current Portrait
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Portrait Display */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewMode ? newPortraitUrl : currentPortrait}
                alt="Professional Portrait"
                className="w-full max-w-md h-96 object-cover rounded-2xl shadow-lg border-4 border-gold-400/20"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGNkYwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNGOEUyMzEiLz4KPHRleHQgeD0iMjAwIiB5PSIyMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMzJCNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkxBPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
              
              {previewMode && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Preview
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-600 font-montserrat">
              <p><strong>Current URL:</strong></p>
              <p className="break-all bg-gray-50 p-2 rounded mt-1">
                {previewMode ? newPortraitUrl : currentPortrait}
              </p>
            </div>
          </div>

          {/* Update Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Portrait URL
              </label>
              <input
                type="url"
                value={newPortraitUrl}
                onChange={(e) => setNewPortraitUrl(e.target.value)}
                placeholder="https://example.com/your-portrait.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a direct URL to an image file (JPG, PNG, WebP)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!previewMode ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handlePreview}
                    disabled={!newPortraitUrl.trim()}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-montserrat font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiEye} />
                    <span>Preview</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSavePortrait}
                    disabled={!newPortraitUrl.trim() || saving}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg font-montserrat font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={saving ? FiUpload : FiSave} className={saving ? 'animate-spin' : ''} />
                    <span>{saving ? 'Saving...' : 'Save Portrait'}</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSavePortrait}
                    disabled={saving}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg font-montserrat font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={saving ? FiUpload : FiCheck} className={saving ? 'animate-spin' : ''} />
                    <span>{saving ? 'Saving...' : 'Confirm & Save'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleCancelPreview}
                    className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-montserrat font-medium hover:bg-gray-50"
                  >
                    <SafeIcon icon={FiX} />
                    <span>Cancel</span>
                  </motion.button>
                </>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-navy-800 mb-2 flex items-center">
                <SafeIcon icon={FiImage} className="mr-2 text-blue-600" />
                Image Guidelines
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Recommended size: 400x600px or higher</li>
                <li>• Format: JPG, PNG, or WebP</li>
                <li>• Professional headshot or portrait</li>
                <li>• High quality and well-lit</li>
                <li>• File size: Under 2MB for fast loading</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Portraits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
          Quick Select Portraits
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presetPortraits.map((preset, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer group"
              onClick={() => setNewPortraitUrl(preset.url)}
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Select</span>
              </div>
              <p className="text-xs text-gray-600 font-montserrat mt-2 text-center">
                {preset.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Usage Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
          Where This Portrait Appears
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-navy-800">Primary Locations:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Homepage Hero Section</li>
              <li>• About Page Header</li>
              <li>• Speaking Page Profile</li>
              <li>• Contact Page Sidebar</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-navy-800">Additional Uses:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Blog Post Author Bio</li>
              <li>• Social Media Cards</li>
              <li>• Newsletter Templates</li>
              <li>• Media Kit Downloads</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortraitManager;