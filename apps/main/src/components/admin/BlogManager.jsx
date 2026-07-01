import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiCalendar,
  FiUser,
  FiTag,
  FiSave,
  FiX
} = FiIcons;

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    featured_image: '',
    is_featured: false,
    is_published: false,
    read_time: '5 min read'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_la2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const slug = formData.slug || generateSlug(formData.title);
      const postData = {
        ...formData,
        slug,
        updated_at: new Date().toISOString()
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts_la2024')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        
        setPosts(posts.map(post => 
          post.id === editingPost.id ? { ...post, ...postData } : post
        ));
      } else {
        const { data, error } = await supabase
          .from('blog_posts_la2024')
          .insert([postData])
          .select();
        
        if (error) throw error;
        
        setPosts([data[0], ...posts]);
      }

      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts_la2024')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const togglePublished = async (postId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blog_posts_la2024')
        .update({ 
          is_published: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_published: !currentStatus }
          : post
      ));
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post status');
    }
  };

  const toggleFeatured = async (postId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blog_posts_la2024')
        .update({ 
          is_featured: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_featured: !currentStatus }
          : post
      ));
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      featured_image: '',
      is_featured: false,
      is_published: false,
      read_time: '5 min read'
    });
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setFormData(post);
    setEditingPost(post);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-navy-800 mb-2">
            Blog Management
          </h2>
          <p className="text-gray-600 font-montserrat">
            Create and manage blog posts and articles
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-navy-800 text-white px-6 py-3 rounded-lg font-montserrat font-medium hover:bg-navy-900 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>New Post</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Total Posts</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {posts.length}
              </p>
            </div>
            <SafeIcon icon={FiEdit3} className="text-2xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Published</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {posts.filter(p => p.is_published).length}
              </p>
            </div>
            <SafeIcon icon={FiEye} className="text-2xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Featured</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {posts.filter(p => p.is_featured).length}
              </p>
            </div>
            <SafeIcon icon={FiStar} className="text-2xl text-gold-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-montserrat text-sm">Drafts</p>
              <p className="text-2xl font-playfair font-bold text-navy-800">
                {posts.filter(p => !p.is_published).length}
              </p>
            </div>
            <SafeIcon icon={FiEyeOff} className="text-2xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-playfair font-bold text-navy-800">
            All Posts ({posts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium text-gray-900 font-montserrat">
                          {post.title}
                        </div>
                        {post.is_featured && (
                          <SafeIcon icon={FiStar} className="text-gold-500 text-sm" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 font-montserrat">
                        {post.excerpt.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.is_published 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-montserrat">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <SafeIcon icon={FiEdit3} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => togglePublished(post.id, post.is_published)}
                        className={post.is_published ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                        title={post.is_published ? "Unpublish" : "Publish"}
                      >
                        <SafeIcon icon={post.is_published ? FiEyeOff : FiEye} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => toggleFeatured(post.id, post.is_featured)}
                        className={post.is_featured ? "text-gold-600 hover:text-gold-900" : "text-gray-400 hover:text-gold-600"}
                        title={post.is_featured ? "Remove from Featured" : "Add to Featured"}
                      >
                        <SafeIcon icon={FiStar} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiEdit3} className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat">
                No blog posts
              </h3>
              <p className="mt-1 text-sm text-gray-500 font-montserrat">
                Get started by creating your first blog post.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-playfair font-bold text-navy-800">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Auto-generated from title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="leadership">Leadership</option>
                    <option value="coaching">Coaching</option>
                    <option value="transformation">Transformation</option>
                    <option value="business">Business</option>
                    <option value="personal-growth">Personal Growth</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleChange}
                    placeholder="5 min read"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Featured Post
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Publish Immediately
                  </span>
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
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-navy-800 text-white rounded-lg font-montserrat font-medium hover:bg-navy-900 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSave} />
                  <span>{editingPost ? 'Update Post' : 'Create Post'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;