import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';

const {
  FiMessageSquare, FiUsers, FiPlus, FiHeart, FiMessageCircle, FiShare2,
  FiBookmark, FiTrendingUp, FiStar, FiSearch, FiFilter, FiMoreHorizontal,
  FiUser, FiCalendar, FiEye, FiChevronDown, FiChevronUp, FiX
} = FiIcons;

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [showNewPost, setShowNewPost] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const [discussions, setDiscussions] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]); // No events table yet, keeping empty
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch Discussions with Author details
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts_la2024')
        .select(`
          *,
          author:profiles_la2024(first_name, last_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const formattedPosts = (postsData || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() : 'Unknown',
        avatar: post.author?.avatar_url || 'https://via.placeholder.com/100',
        category: post.category,
        timestamp: new Date(post.created_at).toLocaleDateString(),
        likes: post.likes_count || 0,
        replies: post.replies_count || 0,
        views: post.views_count || 0,
        trending: post.is_trending
      }));
      setDiscussions(formattedPosts);

      // Fetch Members (Profiles)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles_la2024')
        .select('*')
        .limit(10); // Limit to 10 for display

      if (profilesError) throw profilesError;

      const formattedMembers = (profilesData || []).map(profile => ({
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Community Member',
        avatar: profile.avatar_url || 'https://via.placeholder.com/100',
        role: profile.membership_tier || 'Member', // Using tier as role
        posts: 0, // Placeholder as we don't have post count in profile yet
        joined: new Date(profile.created_at).toLocaleDateString(),
        expertise: [] // Placeholder
      }));
      setMembers(formattedMembers);

    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) return alert('Please sign in to post');

    try {
      const { data, error } = await supabase
        .from('community_posts_la2024')
        .insert([{
          author_id: user.id,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category
        }])
        .select()
        .single();

      if (error) throw error;

      alert('Post created successfully!');
      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: 'general' });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to submit post');
    }
  };

  const categories = [
    { id: 'all', name: 'All', color: 'gray', count: 0 },
    { id: 'motivation', name: 'Motivation', color: 'emerald', count: 0 },
    { id: 'productivity', name: 'Productivity', color: 'purple', count: 0 },
    { id: 'celebration', name: 'Celebrations', color: 'gold', count: 0 },
    { id: 'habits', name: 'Habits', color: 'orange', count: 0 },
    { id: 'general', name: 'General', color: 'blue', count: 0 }
  ];

  const stats = [
    { title: 'Active Members', value: members.length.toString(), icon: FiUsers, color: 'blue' },
    { title: 'Discussions', value: discussions.length.toString(), icon: FiMessageSquare, color: 'emerald' },
    { title: 'This Week', value: '0', icon: FiTrendingUp, color: 'purple' }, // Placeholder
    { title: 'Success Stories', value: '0', icon: FiStar, color: 'gold' }
  ];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Compact Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-playfair font-bold text-navy-800 truncate">
              Community Hub
            </h1>
            <p className="text-xs text-gray-600 font-montserrat truncate">
              Connect, share, and grow together
            </p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="bg-gold-gradient text-navy-800 px-3 py-1.5 rounded-lg font-montserrat font-medium text-xs flex items-center"
          >
            <SafeIcon icon={FiPlus} className="w-3 h-3 mr-1" />
            Post
          </button>
        </div>

        {/* Mobile Search */}
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs font-montserrat focus:ring-1 focus:ring-gold-500"
          />
        </div>
      </div>

      <div className="px-3 py-3 space-y-3 overflow-hidden">
        {/* Compact Stats */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-6 h-6 bg-${stat.color}-500 rounded flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-montserrat text-gray-600">{stat.title}</span>
              </div>
              <p className="text-lg font-playfair font-bold text-navy-800 leading-none">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Categories - Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg p-3 shadow-sm"
        >
          <button
            onClick={() => setShowMobileCategories(!showMobileCategories)}
            className="w-full flex items-center justify-between mb-2"
          >
            <h2 className="text-sm font-playfair font-bold text-navy-800">Categories</h2>
            <SafeIcon
              icon={showMobileCategories ? FiChevronUp : FiChevronDown}
              className="w-4 h-4 text-gray-400"
            />
          </button>

          {showMobileCategories && (
            <div className="flex flex-wrap gap-1 mt-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowMobileCategories(false);
                  }}
                  className={`px-2 py-1 rounded-full font-montserrat font-medium text-xs transition-all duration-200 ${selectedCategory === category.id
                      ? `bg-${category.color}-500 text-white`
                      : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                    }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg p-3 shadow-sm"
        >
          <div className="flex space-x-1">
            {['discussions', 'members', 'events'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-2 font-montserrat font-medium transition-all duration-200 text-xs rounded ${activeTab === tab
                    ? 'text-gold-600 bg-gold-50'
                    : 'text-gray-600 hover:text-navy-800'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        {activeTab === 'discussions' && (
          <div className="space-y-3">
            {filteredDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-start space-x-2 mb-2">
                  <img
                    src={discussion.avatar}
                    alt={discussion.author}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-montserrat font-medium text-navy-800 text-xs truncate">
                        {discussion.author}
                      </span>
                      <span className="text-xs text-gray-500 font-montserrat">
                        {discussion.timestamp}
                      </span>
                      {discussion.trending && (
                        <span className="px-1 py-0.5 bg-red-100 text-red-700 text-xs font-montserrat font-medium rounded">
                          Trending
                        </span>
                      )}
                    </div>
                    <h3 className="font-playfair font-bold text-navy-800 text-sm mb-1 leading-tight">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-600 font-montserrat text-xs mb-2 line-clamp-2">
                      {discussion.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                          <SafeIcon icon={FiHeart} className="w-3 h-3" />
                          <span className="text-xs font-montserrat">{discussion.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                          <SafeIcon icon={FiMessageCircle} className="w-3 h-3" />
                          <span className="text-xs font-montserrat">{discussion.replies}</span>
                        </button>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <SafeIcon icon={FiEye} className="w-3 h-3" />
                          <span className="text-xs font-montserrat">{discussion.views}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-montserrat font-medium bg-blue-100 text-blue-700`}>
                        {discussion.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-3">
            {members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair font-bold text-navy-800 text-sm truncate">
                      {member.name}
                    </h3>
                    <p className="text-gold-600 font-montserrat font-medium text-xs">
                      {member.role}
                    </p>
                  </div>
                  <button className="bg-gold-gradient text-navy-800 px-3 py-1 rounded font-montserrat font-medium text-xs">
                    Connect
                  </button>
                </div>

                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-xs font-montserrat">
                    <span className="text-gray-600">{member.posts} posts</span>
                    <span className="text-gray-500">Joined {member.joined}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gold-100 text-gold-700 text-xs font-montserrat rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair font-bold text-navy-800 text-sm truncate">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 font-montserrat text-xs truncate">
                      {event.date}
                    </p>
                    <p className="text-gray-500 font-montserrat text-xs">
                      {event.attendees} members interested
                    </p>
                  </div>
                  <button className="bg-gold-gradient text-navy-800 px-3 py-1 rounded font-montserrat font-medium text-xs whitespace-nowrap">
                    Join
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Community Guidelines - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg p-3 shadow-sm"
        >
          <h3 className="text-sm font-playfair font-bold text-navy-800 mb-2">
            Community Guidelines
          </h3>
          <ul className="space-y-1 text-xs font-montserrat text-gray-600">
            <li>• Be respectful and supportive</li>
            <li>• Stay on topic and relevant</li>
            <li>• Share constructive feedback</li>
            <li>• Celebrate each other's wins</li>
          </ul>
        </motion.div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-playfair font-bold text-navy-800">
                New Discussion
              </h2>
              <button
                onClick={() => setShowNewPost(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-montserrat font-medium text-navy-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <label className="block text-sm font-montserrat font-medium text-navy-700 mb-1">
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                >
                  {categories.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-montserrat font-medium text-navy-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
                  placeholder="Share your thoughts, ask questions, or start a discussion..."
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-montserrat font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Community;