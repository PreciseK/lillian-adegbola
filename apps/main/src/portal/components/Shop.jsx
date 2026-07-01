import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiShoppingCart, FiHeart, FiStar, FiSearch, FiFilter, FiTruck } = FiIcons;

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'books', name: 'Books' },
    { id: 'planners', name: 'Planners' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'apparel', name: 'Apparel' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products_la2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
            {products.filter(product => product.is_bestseller).map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover" />
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
                      <span className="text-sm font-montserrat text-gray-600">{product.rating || 0}</span>
                      <span className="text-sm font-montserrat text-gray-400 ml-1">({product.reviews_count || 0})</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 font-montserrat mb-4">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-playfair font-bold text-gold-600">₦{product.price}</span>
                      {product.original_price && (
                        <span className="text-lg text-gray-400 line-through">₦{product.original_price}</span>
                      )}
                    </div>
                    <div className="flex items-center text-emerald-600 text-sm font-montserrat">
                      <SafeIcon icon={FiTruck} className="w-4 h-4 mr-1" />
                      <span>Free Shipping</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.in_stock}
                    className={`w-full py-3 rounded-lg font-montserrat font-medium transition-all duration-300 flex items-center justify-center ${product.in_stock
                      ? 'bg-gold-gradient text-navy-800 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-5 h-5 mr-2" />
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
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
                  <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                  {product.is_bestseller && (
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
                      <span className="text-xs font-montserrat text-gray-600">{product.rating || 0}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm font-montserrat mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-playfair font-bold text-gold-600">₦{product.price}</span>
                      {product.original_price && (
                        <span className="text-sm text-gray-400 line-through">₦{product.original_price}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.in_stock}
                    className={`w-full py-2 rounded-lg font-montserrat font-medium transition-all duration-300 text-sm flex items-center justify-center ${product.in_stock
                      ? 'bg-gold-gradient text-navy-800 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <SafeIcon icon={FiShoppingCart} className="w-4 h-4 mr-2" />
                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
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