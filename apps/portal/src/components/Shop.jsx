import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiShoppingCart, FiHeart, FiStar, FiSearch, FiFilter, FiTruck } = FiIcons;

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'books', name: 'Books' },
    { id: 'planners', name: 'Planners' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'apparel', name: 'Apparel' }
  ];

  const products = [
    {
      id: 1,
      name: 'Success Mindset Journal',
      description: 'A premium leather-bound journal designed to help you cultivate a success mindset',
      category: 'planners',
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      bestseller: true,
      inStock: true
    },
    {
      id: 2,
      name: 'Empowerment T-Shirt',
      description: 'Comfortable cotton t-shirt with inspiring message for daily motivation',
      category: 'apparel',
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      bestseller: false,
      inStock: true
    },
    {
      id: 3,
      name: 'Leadership Principles Book',
      description: 'Comprehensive guide to developing exceptional leadership skills',
      category: 'books',
      price: 24.99,
      originalPrice: 34.99,
      rating: 4.9,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      bestseller: true,
      inStock: true
    },
    {
      id: 4,
      name: 'Goal Achievement Planner',
      description: '12-month planner with goal-setting frameworks and progress tracking',
      category: 'planners',
      price: 39.99,
      originalPrice: 54.99,
      rating: 4.7,
      reviews: 445,
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      bestseller: false,
      inStock: true
    },
    {
      id: 5,
      name: 'Motivational Water Bottle',
      description: 'Stainless steel water bottle with time markers and motivational quotes',
      category: 'accessories',
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.5,
      reviews: 267,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      bestseller: false,
      inStock: false
    },
    {
      id: 6,
      name: 'Success Affirmation Cards',
      description: 'Set of 50 beautifully designed cards with powerful affirmations',
      category: 'accessories',
      price: 14.99,
      originalPrice: 19.99,
      rating: 4.8,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      bestseller: false,
      inStock: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-luxury-pearl py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-playfair font-bold text-navy-800 mb-4">
            Exclusive Shop
          </h1>
          <p className="text-xl text-gray-600 font-montserrat max-w-3xl mx-auto">
            Discover curated products designed to support your journey to success and personal growth
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              />
            </div>
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none bg-white font-montserrat"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiShoppingCart} className="w-5 h-5" />
              <span className="font-montserrat font-medium">{cart.length} items</span>
            </div>
          </div>
        </motion.div>

        {/* Bestsellers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-playfair font-bold text-navy-800 mb-6">Bestsellers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(product => product.bestseller).map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-montserrat font-medium">
                    Bestseller
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200">
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gold-600 font-montserrat font-medium uppercase tracking-wide">
                      {product.category}
                    </span>
                    <div className="flex items-center">
                      <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-montserrat text-gray-600">{product.rating}</span>
                      <span className="text-sm font-montserrat text-gray-400 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 font-montserrat mb-4">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-playfair font-bold text-gold-600">${product.price}</span>
                      <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                    </div>
                    <div className="flex items-center text-emerald-600 text-sm font-montserrat">
                      <SafeIcon icon={FiTruck} className="w-4 h-4 mr-1" />
                      <span>Free Shipping</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full py-3 rounded-lg font-montserrat font-medium transition-all duration-300 flex items-center justify-center ${
                      product.inStock
                        ? 'bg-gold-gradient text-navy-800 hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-5 h-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* All Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-playfair font-bold text-navy-800 mb-6">All Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  {product.bestseller && (
                    <div className="absolute top-3 left-3 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-montserrat font-medium">
                      Bestseller
                    </div>
                  )}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200">
                    <SafeIcon icon={FiHeart} className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gold-600 font-montserrat font-medium uppercase tracking-wide">
                      {product.category}
                    </span>
                    <div className="flex items-center">
                      <SafeIcon icon={FiStar} className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-xs font-montserrat text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm font-montserrat mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-playfair font-bold text-gold-600">${product.price}</span>
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full py-2 rounded-lg font-montserrat font-medium transition-all duration-300 text-sm flex items-center justify-center ${
                      product.inStock
                        ? 'bg-gold-gradient text-navy-800 hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-500 font-montserrat">
              No products found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;