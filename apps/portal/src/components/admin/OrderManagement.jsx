import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiShoppingCart, FiDollarSign, FiPackage, FiTruck, FiSearch, FiFilter,
  FiEye, FiEdit3, FiCheck, FiX, FiClock, FiRefreshCw, FiDownload,
  FiUser, FiCalendar, FiCreditCard, FiAlertCircle, FiTrendingUp
} = FiIcons;

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Mock orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      items: [
        { name: 'Digital Marketing Mastery', type: 'course', price: 99.99 },
        { name: 'Success Mindset Journal', type: 'product', price: 49.99 }
      ],
      total: 149.98,
      status: 'completed',
      paymentMethod: 'Credit Card',
      orderDate: '2024-02-20',
      completedDate: '2024-02-20'
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      items: [
        { name: 'Leadership Excellence', type: 'course', price: 129.99 }
      ],
      total: 129.99,
      status: 'pending',
      paymentMethod: 'PayPal',
      orderDate: '2024-02-19',
      completedDate: null
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      items: [
        { name: 'Goal Achievement Planner', type: 'product', price: 39.99 },
        { name: 'Motivational Water Bottle', type: 'product', price: 19.99 }
      ],
      total: 59.98,
      status: 'processing',
      paymentMethod: 'Credit Card',
      orderDate: '2024-02-18',
      completedDate: null
    },
    {
      id: 'ORD-2024-004',
      customer: {
        name: 'Alex Rodriguez',
        email: 'alex.r@email.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      items: [
        { name: 'Premium Membership Upgrade', type: 'subscription', price: 299.99 }
      ],
      total: 299.99,
      status: 'failed',
      paymentMethod: 'Credit Card',
      orderDate: '2024-02-17',
      completedDate: null
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return FiCheck;
      case 'processing': return FiPackage;
      case 'pending': return FiClock;
      case 'failed': return FiX;
      case 'refunded': return FiRefreshCw;
      default: return FiClock;
    }
  };

  const orderStats = [
    {
      title: 'Total Orders',
      value: '1,247',
      change: '+12%',
      icon: FiShoppingCart,
      color: 'blue'
    },
    {
      title: 'Revenue',
      value: '$89,420',
      change: '+18.5%',
      icon: FiDollarSign,
      color: 'emerald'
    },
    {
      title: 'Pending',
      value: '23',
      change: '-5%',
      icon: FiClock,
      color: 'yellow'
    },
    {
      title: 'Avg Order Value',
      value: '$67.50',
      change: '+8.2%',
      icon: FiTrendingUp,
      color: 'purple'
    }
  ];

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Order Management</h1>
            <p className="text-gray-600 font-montserrat">Process orders, payments, and customer transactions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-all duration-300 flex items-center">
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export Orders
            </button>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Sync Orders
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-montserrat font-medium ${
                  stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-playfair font-bold text-navy-800">{stat.value}</p>
              <p className="text-sm font-montserrat text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-montserrat font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-montserrat font-medium text-navy-800">{order.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-montserrat font-medium text-navy-800">{order.customer.name}</p>
                          <p className="text-sm text-gray-500 font-montserrat">{order.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm font-montserrat">
                            <span className="text-navy-800">{item.name}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                              item.type === 'course' ? 'bg-blue-100 text-blue-700' :
                              item.type === 'product' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-montserrat font-bold text-emerald-600">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 font-montserrat">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={getStatusIcon(order.status)} className="w-4 h-4" />
                        <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-montserrat text-gray-700">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'failed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiShoppingCart} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-montserrat">No orders found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">Order Details</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Order ID</label>
                  <p className="font-montserrat font-bold text-navy-800">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-montserrat font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Order Date</label>
                  <p className="font-montserrat text-gray-800">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Payment Method</label>
                  <p className="font-montserrat text-gray-800">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-playfair font-bold text-navy-800 mb-3">Customer Information</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedOrder.customer.avatar}
                    alt={selectedOrder.customer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-montserrat font-medium text-navy-800">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-600 font-montserrat">{selectedOrder.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-playfair font-bold text-navy-800 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-luxury-pearl rounded-lg">
                      <div>
                        <p className="font-montserrat font-medium text-navy-800">{item.name}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.type === 'course' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'product' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="font-montserrat font-bold text-emerald-600">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="font-playfair font-bold text-lg text-navy-800">Total:</span>
                  <span className="font-playfair font-bold text-lg text-emerald-600">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 bg-gold-gradient text-navy-800 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300">
                  Update Status
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-colors">
                  Send Invoice
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-montserrat font-medium hover:bg-red-50 transition-colors">
                  Refund
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;