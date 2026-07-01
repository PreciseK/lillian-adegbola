import React, { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTrash2, FiSearch, FiMessageSquare, FiHeart, FiEye, FiCheck, FiX } = FiIcons;

const CommunityManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('community_posts_la2024')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const { error } = await supabase
                .from('community_posts_la2024')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleToggleTrending = async (post) => {
        try {
            const { error } = await supabase
                .from('community_posts_la2024')
                .update({ is_trending: !post.is_trending })
                .eq('id', post.id);
            if (error) throw error;
            fetchPosts();
        } catch (error) {
            console.error('Error updating trending status:', error);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-playfair font-bold text-navy-900">Community Manager</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Title</th>
                                <th className="p-4 font-semibold text-gray-600">Category</th>
                                <th className="p-4 font-semibold text-gray-600">Stats</th>
                                <th className="p-4 font-semibold text-gray-600">Trending</th>
                                <th className="p-4 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <h3 className="font-medium text-navy-900 mb-1">{post.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{post.content}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700`}>
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><SafeIcon icon={FiHeart} /> {post.likes_count}</span>
                                            <span className="flex items-center gap-1"><SafeIcon icon={FiMessageSquare} /> {post.replies_count}</span>
                                            <span className="flex items-center gap-1"><SafeIcon icon={FiEye} /> {post.views_count}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleTrending(post)}
                                            className={`p-1 rounded ${post.is_trending ? 'text-gold-500 bg-gold-50' : 'text-gray-300 hover:text-gray-500'}`}
                                        >
                                            <SafeIcon icon={FiCheck} />
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete Post"
                                        >
                                            <SafeIcon icon={FiTrash2} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CommunityManager;
