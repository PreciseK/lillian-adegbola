import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';
import { showToast } from '../../lib/toast';
import GalleryImageUploader from './GalleryImageUploader';
import {
  GALLERY_QUOTA_BYTES,
  formatBytes,
  getGalleryStorageUsageBytes,
  deleteGalleryImage
} from '../../lib/galleryStorage';
import { resolveVideoEmbed } from '../../lib/videoEmbed';

const {
  FiImage,
  FiVideo,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiStar,
  FiSave,
  FiX,
  FiHardDrive,
  FiPlay
} = FiIcons;

const EMPTY_FORM = {
  type: 'image',
  title: '',
  caption: '',
  image_url: '',
  video_url: '',
  thumbnail_url: '',
  is_featured: false,
  is_published: true
};

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedBytes, setUsedBytes] = useState(0);
  const [usageLoading, setUsageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
    refreshUsage();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items_la2024')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setLoading(false);
    }
  };

  const refreshUsage = async () => {
    setUsageLoading(true);
    try {
      const bytes = await getGalleryStorageUsageBytes();
      setUsedBytes(bytes);
    } catch (error) {
      console.error('Error fetching gallery storage usage:', error);
    } finally {
      setUsageLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingItem(null);
    setFormError(null);
  };

  const handleEdit = (item) => {
    setFormData({ ...EMPTY_FORM, ...item });
    setEditingItem(item);
    setFormError(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, type }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (formData.type === 'image' && !formData.image_url) {
      setFormError('Please upload an image before saving.');
      return;
    }

    if (formData.type === 'video') {
      if (!formData.video_url) {
        setFormError('Please enter a video URL.');
        return;
      }
      const resolved = resolveVideoEmbed(formData.video_url);
      if (!resolved) {
        setFormError('That URL could not be resolved to a playable video. Use a YouTube/Vimeo link or a direct video file URL.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        type: formData.type,
        title: formData.title || null,
        caption: formData.caption || null,
        image_url: formData.type === 'image' ? formData.image_url : null,
        video_url: formData.type === 'video' ? formData.video_url : null,
        thumbnail_url: formData.type === 'video' ? (formData.thumbnail_url || null) : null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        updated_at: new Date().toISOString()
      };

      if (editingItem) {
        const { error } = await supabase
          .from('gallery_items_la2024')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
        setItems(items.map((item) => (item.id === editingItem.id ? { ...item, ...payload } : item)));
      } else {
        const { data, error } = await supabase
          .from('gallery_items_la2024')
          .insert([payload])
          .select();
        if (error) throw error;
        setItems([data[0], ...items]);
      }

      resetForm();
      setShowModal(false);
      refreshUsage();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      setFormError(error.message || 'Failed to save gallery item');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const { error } = await supabase
        .from('gallery_items_la2024')
        .delete()
        .eq('id', item.id);
      if (error) throw error;

      if (item.type === 'image' && item.image_url) {
        await deleteGalleryImage(item.image_url);
      }

      setItems(items.filter((i) => i.id !== item.id));
      refreshUsage();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      showToast.error('Error deleting gallery item');
    }
  };

  const toggleField = async (item, field) => {
    try {
      const { error } = await supabase
        .from('gallery_items_la2024')
        .update({ [field]: !item[field], updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      setItems(items.map((i) => (i.id === item.id ? { ...i, [field]: !i[field] } : i)));
    } catch (error) {
      console.error('Error updating gallery item:', error);
      showToast.error('Error updating gallery item');
    }
  };

  const usagePercent = Math.min(100, (usedBytes / GALLERY_QUOTA_BYTES) * 100);
  const meterColor = usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500';

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-navy-800 mb-2">Gallery Management</h2>
          <p className="text-gray-600 font-montserrat">Manage photos and videos shown on the homepage gallery</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-navy-800 text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-navy-900 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Gallery Item</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Total</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">{items.length}</p>
            </div>
            <SafeIcon icon={FiImage} className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Images</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {items.filter((i) => i.type === 'image').length}
              </p>
            </div>
            <SafeIcon icon={FiImage} className="text-2xl text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Videos</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {items.filter((i) => i.type === 'video').length}
              </p>
            </div>
            <SafeIcon icon={FiVideo} className="text-2xl text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Featured</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {items.filter((i) => i.is_featured).length}
              </p>
            </div>
            <SafeIcon icon={FiStar} className="text-2xl text-gold-500" />
          </div>
        </div>
      </div>

      {/* Storage meter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiHardDrive} className="text-navy-800" />
            <h3 className="font-montserrat font-semibold text-navy-800">Gallery Storage</h3>
          </div>
          <span className="text-sm font-montserrat text-gray-600">
            {usageLoading ? 'Calculating…' : `${formatBytes(usedBytes)} / ${formatBytes(GALLERY_QUOTA_BYTES)} (${usagePercent.toFixed(1)}%)`}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${meterColor} transition-all duration-500`}
            style={{ width: `${usageLoading ? 0 : usagePercent}%` }}
          />
        </div>
        {usagePercent >= 90 && !usageLoading && (
          <p className="text-xs text-red-600 font-montserrat mt-2">
            Gallery storage is nearly full. Delete unused photos to free up space.
          </p>
        )}
      </div>

      {/* Item Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video bg-gray-100">
              <img
                src={item.type === 'image' ? item.image_url : (item.thumbnail_url || item.image_url || '')}
                alt={item.title || 'Gallery item'}
                className="w-full h-full object-cover"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <SafeIcon icon={FiPlay} className="text-white text-3xl" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {item.is_featured && <SafeIcon icon={FiStar} className="text-gold-400 drop-shadow" />}
                {!item.is_published && <SafeIcon icon={FiEyeOff} className="text-orange-300 drop-shadow" />}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <SafeIcon icon={item.type === 'video' ? FiVideo : FiImage} className="text-gray-400 text-sm" />
                <h3 className="font-playfair font-bold text-navy-800 truncate">
                  {item.title || 'Untitled'}
                </h3>
              </div>
              {item.caption && (
                <p className="text-sm text-gray-600 font-montserrat line-clamp-2 mb-3">{item.caption}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900" title="Edit">
                    <SafeIcon icon={FiEdit3} />
                  </button>
                  <button
                    onClick={() => toggleField(item, 'is_published')}
                    className={item.is_published ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}
                    title={item.is_published ? 'Unpublish' : 'Publish'}
                  >
                    <SafeIcon icon={item.is_published ? FiEyeOff : FiEye} />
                  </button>
                  <button
                    onClick={() => toggleField(item, 'is_featured')}
                    className={item.is_featured ? 'text-gold-600 hover:text-gold-900' : 'text-gray-400 hover:text-gold-600'}
                    title={item.is_featured ? 'Remove from Featured' : 'Add to Featured'}
                  >
                    <SafeIcon icon={FiStar} />
                  </button>
                  <button onClick={() => deleteItem(item)} className="text-red-600 hover:text-red-900" title="Delete">
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
                <span className="text-xs text-gray-500 font-montserrat">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiImage} className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat">No gallery items</h3>
          <p className="mt-1 text-sm text-gray-500 font-montserrat">Get started by adding your first photo or video.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-playfair font-bold text-navy-800">
                  {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type toggle */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
                <button
                  type="button"
                  onClick={() => handleTypeChange('image')}
                  disabled={!!editingItem}
                  className={`px-5 py-2 text-sm font-montserrat font-medium flex items-center gap-2 ${
                    formData.type === 'image' ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  } ${editingItem ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <SafeIcon icon={FiImage} /> Image
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('video')}
                  disabled={!!editingItem}
                  className={`px-5 py-2 text-sm font-montserrat font-medium flex items-center gap-2 border-l border-gray-300 ${
                    formData.type === 'video' ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  } ${editingItem ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <SafeIcon icon={FiVideo} /> Video
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="Optional title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <textarea
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  placeholder="Optional caption"
                />
              </div>

              {formData.type === 'image' ? (
                <GalleryImageUploader
                  label="Photo"
                  value={formData.image_url}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
                  onUploaded={refreshUsage}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                    <input
                      type="text"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=... or a direct .mp4 URL"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Videos are linked by URL only — there is no video upload for the gallery.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail image URL</label>
                    <input
                      type="text"
                      name="thumbnail_url"
                      value={formData.thumbnail_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      placeholder="Optional preview image shown before playback"
                    />
                  </div>
                </div>
              )}

              {formError && <p className="text-sm text-red-600 font-montserrat">{formError}</p>}

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured on homepage carousel</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Published</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-navy-800 text-white rounded-lg font-montserrat font-medium hover:bg-navy-900 flex items-center space-x-2 disabled:opacity-60"
                >
                  <SafeIcon icon={FiSave} />
                  <span>{saving ? 'Saving…' : editingItem ? 'Update' : 'Save'} Item</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
