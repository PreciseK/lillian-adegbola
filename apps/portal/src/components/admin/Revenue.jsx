import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiDollarSign, FiTrendingUp, FiTrendingDown, FiCreditCard, FiCalendar,
  FiDownload, FiRefreshCw, FiFilter, FiBarChart3, FiPieChart, FiTarget,
  FiUsers, FiShoppingCart, FiPercent, FiArrowUp, FiArrowDown
} = FiIcons;

const Revenue = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [viewType, setViewType] = useState('overview');

  // Mock revenue data
  const revenueStats = [
    {
      title: 'Total Revenue',
      value: '$89,420',
      change: '+18.5%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'emerald',
      description: 'All-time revenue'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '$12,680',
      change: '+12.3%',
      trend: 'up',
      icon: FiCalendar,
      color: 'blue',
      description: 'MRR this month'
    },
    {
      title: 'Average Order Value',
      value: '$67.50',
      change: '+8.2%',
      trend: 'up',
      icon: FiShoppingCart,
      color: 'purple',
      description: 'Per transaction'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      trend: 'up',
      icon: FiPercent,
      color: 'orange',
      description: 'Visitor to customer'
    }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 8420, subscriptions: 6200, courses: 1890, products: 330 },
    { month: 'Feb', revenue: 9150, subscriptions: 6800, courses: 2010, products: 340 },
    { month: 'Mar', revenue: 10200, subscriptions: 7500, courses: 2300, products: 400 },
    { month: 'Apr', revenue: 9800, subscriptions: 7200, courses: 2200, products: 400 },
    { month: 'May', revenue: 11400, subscriptions: 8100, courses: 2800, products: 500 },
    { month: 'Jun', revenue: 12680, subscriptions: 8900, courses: 3200, products: 580 }
  ];

  const revenueBySource = [
    { source: 'Subscriptions', amount: 8900, percentage: 70.2, color: 'blue' },
    { source: 'Courses', amount: 3200, percentage: 25.2, color: 'emerald' },
    { source: 'Products', amount: 580, percentage: 4.6, color: 'purple' }
  ];

  const membershipRevenue = [
    { tier: 'Basic', revenue: 0, users: 1523, growth: '+5.2%' },
    { tier: 'Premium', revenue: 32670, users: 1089, growth: '+12.8%' },
    { tier: 'Ultimate', revenue: 23490, users: 235, growth: '+28.4%' }
  ];

  const topProducts = [
    { name: 'Digital Marketing Mastery', revenue: 12450, sales: 125, price: 99.60 },
    { name: 'Leadership Excellence', revenue: 8920, sales: 89, price: 100.22 },
    { name: 'Personal Branding Course', revenue: 6780, sales: 86, price: 78.84 },
    { name: 'Success Mindset Journal', revenue: 4590, sales: 153, price: 30.00 },
    { name: 'Goal Achievement Planner', revenue: 3240, sales: 81, price: 40.00 }
  ];

  const paymentMethods = [
    { method: 'Credit Card', percentage: 78, amount: 9890 },
    { method: 'PayPal', percentage: 18, amount: 2282 },
    { method: 'Bank Transfer', percentage: 4, amount: 508 }
  ];

  const SimpleBarChart = ({ data, dataKey, color = 'blue' }) => (
    <div className="flex items-end space-x-2 h-32">
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d[dataKey]));
        const height = (item[dataKey] / maxValue) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
              style={{ height: `${height}%` }}
            />
            <span className="text-xs font-montserrat text-gray-600 mt-1">{item.month}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Revenue Dashboard</h1>
            <p className="text-gray-600 font-montserrat">Financial performance and revenue analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-gold-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 ${
                  stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  <SafeIcon icon={stat.trend === 'up' ? FiArrowUp : FiArrowDown} className="w-4 h-4" />
                  <span className="text-sm font-montserrat font-medium">{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-playfair font-bold text-navy-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-montserrat text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs font-montserrat text-gray-500">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Monthly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">Revenue Trend</h2>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-gold-500"
              >
                <option value="revenue">Total Revenue</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="courses">Courses</option>
                <option value="products">Products</option>
              </select>
            </div>
            <SimpleBarChart 
              data={monthlyRevenue} 
              dataKey={viewType} 
              color="emerald" 
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-playfair font-bold text-emerald-600">
                  ${monthlyRevenue[monthlyRevenue.length - 1]?.revenue.toLocaleString()}
                </p>
                <p className="text-sm font-montserrat text-gray-600">This Month</p>
              </div>
              <div>
                <p className="text-lg font-playfair font-bold text-blue-600">
                  ${monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
                </p>
                <p className="text-sm font-montserrat text-gray-600">Total (6 Months)</p>
              </div>
              <div>
                <p className="text-lg font-playfair font-bold text-purple-600">
                  ${Math.round(monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthlyRevenue.length).toLocaleString()}
                </p>
                <p className="text-sm font-montserrat text-gray-600">Monthly Average</p>
              </div>
            </div>
          </motion.div>

          {/* Revenue by Source */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Revenue Sources</h3>
            <div className="space-y-4">
              {revenueBySource.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat font-medium text-navy-800">{source.source}</span>
                    <div className="text-right">
                      <span className="font-montserrat font-bold text-navy-800">
                        ${source.amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({source.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${source.color}-500`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Membership Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Revenue by Membership Tier</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {membershipRevenue.map((tier, index) => (
              <div key={index} className="text-center p-4 bg-luxury-pearl rounded-lg">
                <h3 className="font-montserrat font-bold text-navy-800 mb-2">{tier.tier}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-2xl font-playfair font-bold text-emerald-600">
                      ${tier.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm font-montserrat text-gray-600">Revenue</p>
                  </div>
                  <div>
                    <p className="text-lg font-montserrat font-bold text-navy-800">
                      {tier.users.toLocaleString()}
                    </p>
                    <p className="text-sm font-montserrat text-gray-600">Users</p>
                  </div>
                  <div className={`text-sm font-montserrat font-medium ${
                    tier.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {tier.growth} growth
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-playfair font-bold text-navy-800">Top Revenue Generators</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Revenue</th>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Sales</th>
                  <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Avg Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-montserrat font-medium text-navy-800">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat font-bold text-emerald-600">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat text-gray-700">{product.sales}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat text-gray-700">${product.price.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Payment Methods</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${
                        index === 0 ? 'text-blue-500' :
                        index === 1 ? 'text-emerald-500' : 'text-purple-500'
                      }`}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${method.percentage}, 100`}
                      strokeLinecap="round"
                      fill="transparent"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-playfair font-bold text-navy-800">
                      {method.percentage}%
                    </span>
                  </div>
                </div>
                <h3 className="font-montserrat font-medium text-navy-800 mb-1">{method.method}</h3>
                <p className="font-montserrat font-bold text-emerald-600">
                  ${method.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Revenue;