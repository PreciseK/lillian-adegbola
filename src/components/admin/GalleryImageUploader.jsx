import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { uploadGalleryImage } from '../../lib/galleryStorage';
import { friendlyError } from '../../lib/friendlyError';

const { FiUpload, FiTrash2, FiLoader } = FiIcons;

/**
 * Image uploader scoped to the gallery-images bucket. Unlike the generic
 * ImageUploader, every upload is quota-checked against the 2GB gallery
 * cap before any bytes are sent — uploads that would exceed it are
 * rejected with an inline error instead of going through.
 */
const GalleryImageUploader = ({ value, onChange, onUploaded, label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { publicUrl } = await uploadGalleryImage(file);
      onChange(publicUrl);
      onUploaded?.();
    } catch (err) {
      console.error('Error uploading gallery image:', err);
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
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default GalleryImageUploader;
