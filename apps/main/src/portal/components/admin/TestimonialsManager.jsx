import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../../lib/supabase';

const {
    FiStar,
    FiPlus,
    FiTrash2,
    FiEdit3,
    FiEye,
    FiEyeOff,
    FiUser,
    FiSave,
    FiX
} = FiIcons;

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        company: '',
        content: '',
        rating: 5,
        image_url: '',
        is_featured: false,
        is_published: true
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from('testimonials_la2024')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTestimonials(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const testimonialData = {
                ...formData,
                updated_at: new Date().toISOString()
            };

            if (editingTestimonial) {
                const { error } = await supabase
                    .from('testimonials_la2024')
                    .update(testimonialData)
                    .eq('id', editingTestimonial.id);

                if (error) throw error;

                setTestimonials(testimonials.map(testimonial =>
                    testimonial.id === editingTestimonial.id ? { ...testimonial, ...testimonialData } : testimonial
                ));
            } else {
                const { data, error } = await supabase
                    .from('testimonials_la2024')
                    .insert([testimonialData])
                    .select();

                if (error) throw error;

                setTestimonials([data[0], ...testimonials]);
            }

            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Error saving testimonial');
        }
    };

    const deleteTestimonial = async (testimonialId) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const { error } = await supabase
                .from('testimonials_la2024')
                .delete()
                .eq('id', testimonialId);

            if (error) throw error;

            setTestimonials(testimonials.filter(testimonial => testimonial.id !== testimonialId));
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Error deleting testimonial');
        }
    };

    const togglePublished = async (testimonialId, currentStatus) => {
        try {
            const { error } = await supabase
                .from('testimonials_la2024')
                .update({
                    is_published: !currentStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', testimonialId);

            if (error) throw error;

            setTestimonials(testimonials.map(testimonial =>
                testimonial.id === testimonialId
                    ? { ...testimonial, is_published: !currentStatus }
                    : testimonial
            ));
        } catch (error) {
            console.error('Error updating testimonial:', error);
            alert('Error updating testimonial status');
        }
    };

    const toggleFeatured = async (testimonialId, currentStatus) => {
        try {
            const { error } = await supabase
                .from('testimonials_la2024')
                .update({
                    is_featured: !currentStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', testimonialId);

            if (error) throw error;

            setTestimonials(testimonials.map(testimonial =>
                testimonial.id === testimonialId
                    ? { ...testimonial, is_featured: !currentStatus }
                    : testimonial
            ));
        } catch (error) {
            console.error('Error updating testimonial:', error);
            alert('Error updating testimonial status');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            title: '',
            company: '',
            content: '',
            rating: 5,
            image_url: '',
            is_featured: false,
            is_published: true
        });
        setEditingTestimonial(null);
    };

    const handleEdit = (testimonial) => {
        setFormData(testimonial);
        setEditingTestimonial(testimonial);
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
                        Testimonials Management
                    </h2>
                    <p className="text-gray-600 font-montserrat">
                        Manage client testimonials and success stories
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
                    <span>Add Testimonial</span>
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 font-montserrat text-sm">Total</p>
                            <p className="text-2xl font-playfair font-bold text-navy-800">
                                {testimonials.length}
                            </p>
                        </div>
                        <SafeIcon icon={FiUser} className="text-2xl text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 font-montserrat text-sm">Published</p>
                            <p className="text-2xl font-playfair font-bold text-navy-800">
                                {testimonials.filter(t => t.is_published).length}
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
                                {testimonials.filter(t => t.is_featured).length}
                            </p>
                        </div>
                        <SafeIcon icon={FiStar} className="text-2xl text-gold-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 font-montserrat text-sm">Avg Rating</p>
                            <p className="text-2xl font-playfair font-bold text-navy-800">
                                {testimonials.length > 0
                                    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                                    : '0'
                                }
                            </p>
                        </div>
                        <SafeIcon icon={FiStar} className="text-2xl text-gold-500" />
                    </div>
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                                    <span className="text-navy-600 font-semibold">
                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-playfair font-bold text-navy-800">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 font-montserrat">
                                        {testimonial.title}
                                    </p>
                                    {testimonial.company && (
                                        <p className="text-xs text-gray-500 font-montserrat">
                                            {testimonial.company}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-1">
                                {testimonial.is_featured && (
                                    <SafeIcon icon={FiStar} className="text-gold-500 text-sm" />
                                )}
                                {!testimonial.is_published && (
                                    <SafeIcon icon={FiEyeOff} className="text-orange-500 text-sm" />
                                )}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                                <SafeIcon
                                    key={i}
                                    icon={FiStar}
                                    className={`text-sm ${i < testimonial.rating ? 'text-gold-500' : 'text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="ml-2 text-sm text-gray-600 font-montserrat">
                                ({testimonial.rating}/5)
                            </span>
                        </div>

                        {/* Content */}
                        <p className="text-gray-700 font-montserrat text-sm leading-relaxed mb-4 line-clamp-3">
                            "{testimonial.content}"
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleEdit(testimonial)}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Edit"
                                >
                                    <SafeIcon icon={FiEdit3} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => togglePublished(testimonial.id, testimonial.is_published)}
                                    className={testimonial.is_published ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                                    title={testimonial.is_published ? "Unpublish" : "Publish"}
                                >
                                    <SafeIcon icon={testimonial.is_published ? FiEyeOff : FiEye} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}
                                    className={testimonial.is_featured ? "text-gold-600 hover:text-gold-900" : "text-gray-400 hover:text-gold-600"}
                                    title={testimonial.is_featured ? "Remove from Featured" : "Add to Featured"}
                                >
                                    <SafeIcon icon={FiStar} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => deleteTestimonial(testimonial.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete"
                                >
                                    <SafeIcon icon={FiTrash2} />
                                </motion.button>
                            </div>

                            <div className="flex items-center space-x-1 text-xs text-gray-500 font-montserrat">
                                <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-12">
                    <SafeIcon icon={FiStar} className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat">
                        No testimonials
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 font-montserrat">
                        Get started by adding your first testimonial.
                    </p>
                </div>
            )}

            {/* Create/Edit Testimonial Modal */}
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
                                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                    />
                                </div>

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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating *
                                    </label>
                                    <select
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                    >
                                        <option value={5}>5 Stars</option>
                                        <option value={4}>4 Stars</option>
                                        <option value={3}>3 Stars</option>
                                        <option value={2}>2 Stars</option>
                                        <option value={1}>1 Star</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Testimonial Content *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                    placeholder="Write the testimonial content here..."
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
                                        Featured Testimonial
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
                                    <span>{editingTestimonial ? 'Update' : 'Save'} Testimonial</span>
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TestimonialsManager;
