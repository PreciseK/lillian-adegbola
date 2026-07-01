import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
    FiEdit3,
    FiPlus,
    FiTrash2,
    FiFileText,
    FiVideo,
    FiHeadphones,
    FiImage,
    FiSave,
    FiX,
    FiDownload
} = FiIcons;

const ResourcesManager = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: 'PDF',
        size: '',
        url: '',
        image: '',
        downloads: 0,
        premium: false
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const { data, error } = await supabase
                .from('resources_la2024')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResources(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resourceData = {
                ...formData,
                updated_at: new Date().toISOString()
            };

            if (editingResource) {
                const { error } = await supabase
                    .from('resources_la2024')
                    .update(resourceData)
                    .eq('id', editingResource.id);

                if (error) throw error;

                setResources(resources.map(res =>
                    res.id === editingResource.id ? { ...res, ...resourceData } : res
                ));
            } else {
                const { data, error } = await supabase
                    .from('resources_la2024')
                    .insert([resourceData])
                    .select();

                if (error) throw error;

                setResources([data[0], ...resources]);
            }

            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving resource:', error);
            alert('Error saving resource');
        }
    };

    const deleteResource = async (resourceId) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            const { error } = await supabase
                .from('resources_la2024')
                .delete()
                .eq('id', resourceId);

            if (error) throw error;

            setResources(resources.filter(res => res.id !== resourceId));
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Error deleting resource');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            type: 'PDF',
            size: '',
            url: '',
            image: '',
            downloads: 0,
            premium: false
        });
        setEditingResource(null);
    };

    const handleEdit = (resource) => {
        setFormData(resource);
        setEditingResource(resource);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const getIconForType = (type) => {
        switch (type.toLowerCase()) {
            case 'video': return FiVideo;
            case 'audio': return FiHeadphones;
            case 'image': return FiImage;
            default: return FiFileText;
        }
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
                        Resources Management
                    </h2>
                    <p className="text-gray-600 font-montserrat">
                        Manage downloadable resources and materials
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
                    <span>New Resource</span>
                </motion.button>
            </div>

            {/* Resources List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-playfair font-bold text-navy-800">
                        All Resources ({resources.length})
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                <th className="px-6 py-3 text-left text-xs font-montserrat font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {resources.map((resource) => (
                                <tr key={resource.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                                <SafeIcon icon={getIconForType(resource.type)} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 font-montserrat">
                                                    {resource.title}
                                                </div>
                                                {resource.premium && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-100 text-gold-800">
                                                        Premium
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 capitalize">
                                            {resource.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat">
                                        {resource.type} • {resource.size}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-montserrat">
                                        <div className="flex items-center space-x-1">
                                            <SafeIcon icon={FiDownload} className="w-4 h-4" />
                                            <span>{resource.downloads || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => handleEdit(resource)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit"
                                            >
                                                <SafeIcon icon={FiEdit3} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => deleteResource(resource.id)}
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

                    {resources.length === 0 && (
                        <div className="text-center py-12">
                            <SafeIcon icon={FiFileText} className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 font-montserrat">No resources</h3>
                            <p className="mt-1 text-sm text-gray-500 font-montserrat">Get started by creating your first resource.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-playfair font-bold text-navy-800">
                                {editingResource ? 'Edit Resource' : 'Add New Resource'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <SafeIcon icon={FiX} className="text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                        >
                                            <option value="templates">Templates</option>
                                            <option value="videos">Videos</option>
                                            <option value="audio">Audio</option>
                                            <option value="graphics">Graphics</option>
                                            <option value="documents">Documents</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type (e.g., PDF, MP4)</label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                                        <input
                                            type="text"
                                            name="url"
                                            value={formData.url}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Size (e.g., 2.5 MB)</label>
                                        <input
                                            type="text"
                                            name="size"
                                            value={formData.size}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex items-center h-full pt-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="premium"
                                                checked={formData.premium}
                                                onChange={handleChange}
                                                className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Premium Resource</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-navy-800 text-white rounded-lg font-montserrat font-medium hover:bg-navy-900 flex items-center space-x-2"
                                >
                                    <SafeIcon icon={FiSave} />
                                    <span>{editingResource ? 'Update' : 'Create'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ResourcesManager;
