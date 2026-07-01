import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import BlogPostModal from './BlogPostModal';
import supabase from '../lib/supabase';

const { FiCalendar, FiClock, FiArrowRight, FiTag, FiUser, FiEye, FiExternalLink } = FiIcons;

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Demo data fallback
  const blogPosts = [
    {
      id: 1,
      title: 'The Fearless Leader: Embracing Authentic Leadership in Uncertain Times',
      excerpt: 'Discover how authentic leadership becomes your superpower during challenging times. Learn the 5 key principles that separate fearless leaders from the rest.',
      content: `# The Fearless Leader: Embracing Authentic Leadership in Uncertain Times

In today's rapidly changing world, the old models of leadership are crumbling. Command-and-control hierarchies are giving way to more collaborative, authentic approaches that inspire rather than intimidate.

## What Makes a Fearless Leader?

Fearless leadership isn't about the absence of fear—it's about moving forward despite it. Here are the key characteristics:

### 1. Authentic Self-Expression
Fearless leaders show up as their genuine selves. They don't hide behind masks or pretend to have all the answers.

### 2. Vulnerability as Strength
The most powerful leaders understand that vulnerability is not weakness—it's courage.

### 3. Clear Vision and Purpose
Fearless leaders are crystal clear about their "why." They can articulate not just what they're doing, but why it matters.

*Are you ready to step into fearless leadership? The journey begins with a single courageous choice.*`,
      category: 'leadership',
      author: 'Lillian Adegbola',
      created_at: '2024-01-15T10:00:00Z',
      read_time: '8 min read',
      views: 1247,
      featured_image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_featured: true
    },
    {
      id: 2,
      title: 'Clarity Over Chaos: Your 30-Day Guide to Purpose-Driven Living',
      excerpt: 'Transform confusion into clarity with this comprehensive guide. Step-by-step strategies to align your actions with your authentic purpose.',
      content: `# Clarity Over Chaos: Your 30-Day Guide to Purpose-Driven Living

In a world of endless distractions and competing priorities, finding clarity can feel like searching for a needle in a haystack. But what if I told you that clarity isn't something you find—it's something you create?

## The Clarity Framework: 4 Pillars of Purpose-Driven Living

### Pillar 1: Values Alignment
Your values are your internal compass. When your actions align with your values, you experience flow and fulfillment.

### Pillar 2: Vision Creation
A clear vision pulls you forward. Without it, you're pushed around by circumstances and other people's agendas.

*Your purpose-driven life is waiting for you to claim it.*`,
      category: 'transformation',
      author: 'Lillian Adegbola',
      created_at: '2024-01-08T10:00:00Z',
      read_time: '12 min read',
      views: 892,
      featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_featured: true
    },
    {
      id: 3,
      title: 'The Executive Coaching Revolution: Why Traditional Methods Fall Short',
      excerpt: 'Explore the evolution of executive coaching and why breakthrough results require breakthrough approaches. The future of leadership development is here.',
      content: `# The Executive Coaching Revolution: Why Traditional Methods Fall Short

The executive coaching industry is at a crossroads. While traditional coaching methods have served their purpose, the rapidly evolving business landscape demands a more revolutionary approach.

## The Revolutionary Approach

Revolutionary coaching addresses the leader as a complete human being—mind, body, emotions, and spirit.

*Are you ready to revolutionize your leadership development? The future is waiting.*`,
      category: 'coaching',
      author: 'Lillian Adegbola',
      created_at: '2024-01-01T10:00:00Z',
      read_time: '6 min read',
      views: 654,
      featured_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_featured: false
    },
    {
      id: 4,
      title: 'Building Resilient Teams: The Leadership Blueprint for 2024',
      excerpt: 'Learn the essential strategies for creating teams that thrive under pressure and adapt to change with confidence and clarity.',
      content: `# Building Resilient Teams: The Leadership Blueprint for 2024

In an era of constant change and unprecedented challenges, team resilience isn't just nice to have—it's essential for survival and success.

## The 5 Pillars of Team Resilience

Building resilient teams requires intentional effort and consistent practice.

*What will you do today to build your team's resilience for tomorrow's challenges?*`,
      category: 'leadership',
      author: 'Lillian Adegbola',
      created_at: '2023-12-20T10:00:00Z',
      read_time: '10 min read',
      views: 1156,
      featured_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_featured: false
    },
    {
      id: 5,
      title: 'From Burnout to Breakthrough: A Personal Transformation Story',
      excerpt: 'A vulnerable look at overcoming burnout and finding renewed purpose. Real strategies that work when everything feels overwhelming.',
      content: `# From Burnout to Breakthrough: A Personal Transformation Story

Burnout isn't just being tired—it's a complete disconnection from your purpose and passion.

## The Journey Back

Recovery requires both practical strategies and inner work.

*Your breakthrough is waiting on the other side of burnout.*`,
      category: 'transformation',
      author: 'Lillian Adegbola',
      created_at: '2023-12-15T10:00:00Z',
      read_time: '7 min read',
      views: 2341,
      featured_image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_featured: false
    },
    {
      id: 6,
      title: 'The Art of Powerful Conversations: Coaching Techniques for Leaders',
      excerpt: 'Master the conversation skills that transform relationships and accelerate results. Essential techniques every leader needs to know.',
      content: `# The Art of Powerful Conversations: Coaching Techniques for Leaders

Great leaders are great conversationalists. They know how to ask the right questions, listen deeply, and guide others to their own insights.

## The Conversation Framework

Every powerful conversation has structure and intention.

*Transform your relationships through the power of conversation.*`,
      category: 'coaching',
      author: 'Lillian Adegbola',
      created_at: '2023-12-08T10:00:00Z',
      read_time: '9 min read',
      views: 743,
      featured_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_featured: false
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_la2024')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6); // Limit to 6 posts for homepage

      if (error) throw error;
      setPosts(data && data.length > 0 ? data : blogPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Fallback to demo data if Supabase fails
      setPosts(blogPosts);
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const categories = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'leadership', name: 'Leadership', count: posts.filter(p => p.category === 'leadership').length },
    { id: 'coaching', name: 'Coaching', count: posts.filter(p => p.category === 'coaching').length },
    { id: 'transformation', name: 'Transformation', count: posts.filter(p => p.category === 'transformation').length }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const featuredPosts = posts.filter(post => post.is_featured);

  return (
    <>
      <section id="blog" className="py-20 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-800/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              viewport={{ once: true }}
              className="inline-flex items-center bg-navy-900/80 px-4 py-2 rounded-full mb-6"
            >
              <span className="text-luxury-gold font-montserrat font-medium">
                Insights & Resources
              </span>
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-navy-800 mb-6 leading-tight">
              Leadership Insights &
              <span className="text-navy-900 font-dancing block mt-2">
                Transformation Stories
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 font-montserrat max-w-3xl mx-auto leading-relaxed">
              Discover powerful strategies, real transformation stories, and actionable insights to
              <span className="text-navy-900 font-semibold"> accelerate your leadership journey</span> and create lasting impact.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-montserrat font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-navy-800 text-white shadow-xl'
                    : 'bg-luxury-pearl text-navy-800 hover:bg-navy-50 shadow-md'
                }`}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </motion.div>

          {/* Featured Posts */}
          {selectedCategory === 'all' && featuredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h3 className="text-2xl font-playfair font-bold text-navy-800 mb-8">Featured Articles</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    viewport={{ once: true }}
                    onClick={() => handlePostClick(post)}
                    className="bg-luxury-pearl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gold-gradient text-navy-900 px-3 py-1 rounded-full text-sm font-montserrat font-semibold">
                          Featured
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <div className="flex items-center space-x-1 text-white text-xs">
                          <SafeIcon icon={FiEye} />
                          <span>{post.views?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 font-montserrat mb-4">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiCalendar} className="text-gold-600" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="text-gold-600" />
                          <span>{post.read_time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiEye} className="text-gold-600" />
                          <span>{post.views?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-playfair font-bold text-navy-800 mb-3 group-hover:text-gold-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-700 font-montserrat leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiTag} className="text-gold-600" />
                          <span className="text-sm text-gray-600 font-montserrat capitalize">
                            {post.category}
                          </span>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center text-navy-800 hover:text-gold-600 font-montserrat font-semibold transition-colors group"
                        >
                          Read More
                          <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Posts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-playfair font-bold text-navy-800">
                {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
              </h3>
              <Link
                to="/blog"
                onClick={() => {
                  // Ensure scroll to top on blog page navigation
                  setTimeout(() => window.scrollTo(0, 0), 0);
                }}
                className="flex items-center space-x-2 text-navy-800 hover:text-gold-600 font-montserrat font-semibold transition-colors group"
              >
                <span>View All</span>
                <SafeIcon icon={FiExternalLink} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(0, 6).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true }}
                  onClick={() => handlePostClick(post)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gold-400/20 group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {post.is_featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gold-gradient text-navy-900 px-2 py-1 rounded-full text-xs font-montserrat font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center space-x-1 text-white text-xs">
                        <SafeIcon icon={FiEye} />
                        <span>{post.views?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-xs text-gray-600 font-montserrat mb-3">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="text-gold-600" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="text-gold-600" />
                        <span>{post.read_time}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-playfair font-bold text-navy-800 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-700 font-montserrat text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gold-600 font-montserrat font-semibold capitalize bg-gold-400/10 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="flex items-center text-navy-800 hover:text-gold-600 font-montserrat font-semibold text-sm transition-colors group"
                      >
                        Read
                        <SafeIcon icon={FiArrowRight} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <div className="bg-navy-800 text-white p-8 lg:p-12 rounded-3xl shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-playfair font-bold mb-4">
                Never Miss a Leadership Insight
              </h3>
              <p className="text-xl font-montserrat text-gray-200 mb-8 leading-relaxed">
                Get weekly leadership tips, transformation stories, and exclusive resources delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full text-navy-900 font-montserrat focus:ring-2 focus:ring-gold-400 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gold-gradient text-navy-900 px-6 py-3 rounded-full font-montserrat font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Post Modal */}
      <BlogPostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        post={selectedPost}
      />
    </>
  );
};

export default Blog;