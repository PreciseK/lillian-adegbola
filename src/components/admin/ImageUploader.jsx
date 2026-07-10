import React, { useState } from 'react';
import supabase from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { friendlyError } from '../../lib/friendlyError';

const { FiUpload, FiTrash2, FiLoader } = FiIcons;

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

const ImageUploader = ({ value, onChange, bucket = 'website-images', label = 'Image', helpText }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('That file is too large. Please upload an image under 15MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase storage
      let { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(friendlyError(err, 'Failed to upload image'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {helpText && <p className="text-xs text-gray-500">{helpText}</p>}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Image Preview */}
        {value ? (
          <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-md"
              title="Remove image"
            >
              <SafeIcon icon={FiTrash2} className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-2">
            <SafeIcon icon={FiUpload} className="w-8 h-8 mb-1 text-gray-300" />
            <span className="text-xs font-montserrat text-center text-gray-400">No image</span>
          </div>
        )}

        {/* Upload Controls */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex gap-2">
            <label className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 bg-white shadow-sm transition-colors ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin text-gold-600" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiUpload} className="w-4 h-4 text-gray-500" />
                  <span>Choose File</span>
                </>
              )}
            </label>
            
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-medium">Or enter image URL:</span>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
