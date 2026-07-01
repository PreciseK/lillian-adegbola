import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiCalendar, FiClock, FiUser, FiTag, FiEye, FiShare2, FiBookmark } = FiIcons;

const BlogPostModal = ({ isOpen, onClose, post }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    // Add to browser bookmarks or local storage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_posts') || '[]');
    if (!bookmarks.find(b => b.id === post.id)) {
      bookmarks.push({ id: post.id, title: post.title, slug: post.slug });
      localStorage.setItem('bookmarked_posts', JSON.stringify(bookmarks));
      alert('Article bookmarked!');
    } else {
      alert('Article already bookmarked!');
    }
  };

  const formatContent = (content) => {
    if (!content) return '';
    
    // Convert markdown-style content to HTML
    let formatted = content
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-playfair font-bold text-navy-800 mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-playfair font-bold text-navy-800 mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-playfair font-bold text-navy-800 mb-3 mt-4">$1</h3>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-navy-800">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$1. $2</li>')
      
      // Paragraphs
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.startsWith('<h') || paragraph.startsWith('<li')) {
          return paragraph;
        }
        if (paragraph.trim()) {
          return `<p class="text-gray-700 font-montserrat leading-relaxed mb-4">${paragraph}</p>`;
        }
        return '';
      })
      .join('');

    return formatted;
  };

  if (!isOpen || !post) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden"
        >
          {/* Header with Image */}
          <div className="relative">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 lg:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-white text-xl" />
            </button>

            {/* Article Meta Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-4 text-white/90 text-sm font-montserrat mb-4">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="text-gold-400" />
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiClock} className="text-gold-400" />
                  <span>{post.read_time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiEye} className="text-gold-400" />
                  <span>{post.views?.toLocaleString() || '0'} views</span>
                </div>
              </div>
              
              <h1 className="text-2xl lg:text-4xl font-playfair font-bold text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            {/* Author and Category Info */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                  <span className="text-navy-900 font-bold text-lg">LA</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="text-gold-600" />
                    <span className="font-montserrat font-semibold text-navy-800">
                      Lillian Adegbola
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiTag} className="text-gold-600" />
                    <span className="text-sm text-gray-600 font-montserrat capitalize">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-montserrat font-medium text-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiShare2} />
                  <span>Share</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className="flex items-center space-x-2 bg-gold-400/10 hover:bg-gold-400/20 px-4 py-2 rounded-full font-montserrat font-medium text-gold-700 transition-colors"
                >
                  <SafeIcon icon={FiBookmark} />
                  <span>Save</span>
                </motion.button>
              </div>
            </div>

            {/* Article Excerpt */}
            <div className="mb-8">
              <p className="text-xl text-gray-700 font-montserrat leading-relaxed italic border-l-4 border-gold-400 pl-6">
                {post.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-navy-800 text-white p-6 rounded-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center">
                    <span className="text-navy-900 font-bold text-xl">LA</span>
                  </div>
                  <div>
                    <h3 className="font-playfair font-bold text-xl">Lillian Adegbola</h3>
                    <p className="text-gold-400 font-montserrat">Queen of Clarity & Purpose</p>
                  </div>
                </div>
                <p className="text-gray-200 font-montserrat leading-relaxed mb-4">
                  Empowering visionary leaders and ambitious achievers to unlock their potential and achieve 
                  sustainable positive transformation through fearless leadership and authentic growth.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="bg-gold-gradient text-navy-900 px-6 py-3 rounded-full font-montserrat font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Work With Lillian
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogPostModal;