import React, { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase';
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

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    mrr: 0,
    avgOrderValue: 0,
    conversionRate: 3.2, // Still mocked as we don't track visitors
    revenueGrowth: '+0%',
    mrrGrowth: '+0%',
    aovGrowth: '+0%',
    conversionGrowth: '+0%'
  });
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [revenueBySource, setRevenueBySource] = useState([]);
  const [membershipRevenue, setMembershipRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders_la2024')
        .select(`
          *,
          items:order_items_la2024(*)
        `)
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      // Fetch users for membership stats
      const { data: users, error: usersError } = await supabase
        .from('profiles_la2024')
        .select('membership_tier, subscription_status');

      if (usersError) throw usersError;

      processRevenueData(orders || [], users || []);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (orders, users) => {
    // 1. Overview Stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Estimate MRR based on active memberships in Users table * Prices
    // (Simplification: assuming Basic=0, Premium=29, Ultimate=99)
    const tierPrices = { basic: 0, premium: 29, ultimate: 99 };
    const mrr = users.reduce((sum, user) => {
      if (user.subscription_status === 'active') {
        return sum + (tierPrices[user.membership_tier?.toLowerCase()] || 0);
      }
      return sum;
    }, 0);

    setStats({
      totalRevenue,
      mrr,
      avgOrderValue,
      conversionRate: 3.2,
      revenueGrowth: '+10%', // Placeholder calculation
      mrrGrowth: '+5%',
      aovGrowth: '+2%',
      conversionGrowth: '+0.5%'
    });

    // 2. Monthly Revenue (group by month)
    const monthlyData = {};
    orders.forEach(order => {
      const month = new Date(order.created_at).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, revenue: 0, subscriptions: 0, courses: 0, products: 0 };
      }
      monthlyData[month].revenue += order.total;

      // Categorize revenue
      // This requires inspecting order items. 
      // Simplified: If order has items, verify types
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          // Assume item_type exists
          const type = item.item_type || 'products'; // course, subscription, product
          if (type.includes('course')) monthlyData[month].courses += item.price;
          else if (type.includes('subscription')) monthlyData[month].subscriptions += item.price;
          else monthlyData[month].products += item.price;
        });
      }
    });
    setRevenueHistory(Object.values(monthlyData));

    // 3. Revenue by Source
    let subRev = 0, courseRev = 0, prodRev = 0;
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const type = item.item_type || '';
          if (type.includes('course')) courseRev += item.price;
          else if (type.includes('subscription')) subRev += item.price;
          else prodRev += item.price;
        });
      }
    });
    const totalRev = subRev + courseRev + prodRev || 1;
    setRevenueBySource([
      { source: 'Subscriptions', amount: subRev, percentage: ((subRev / totalRev) * 100).toFixed(1), color: 'blue' },
      { source: 'Courses', amount: courseRev, percentage: ((courseRev / totalRev) * 100).toFixed(1), color: 'emerald' },
      { source: 'Products', amount: prodRev, percentage: ((prodRev / totalRev) * 100).toFixed(1), color: 'purple' }
    ]);

    // 4. Membership Revenue (Active Users count)
    const membershipCounts = users.reduce((acc, user) => {
      const tier = user.membership_tier || 'Basic';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {});

    setMembershipRevenue([
      { tier: 'Basic', revenue: 0, users: membershipCounts['Basic'] || 0, growth: '+2%' },
      { tier: 'Premium', revenue: (membershipCounts['Premium'] || 0) * 29, users: membershipCounts['Premium'] || 0, growth: '+5%' },
      { tier: 'Ultimate', revenue: (membershipCounts['Ultimate'] || 0) * 99, users: membershipCounts['Ultimate'] || 0, growth: '+8%' }
    ]);

    // 5. Top Products
    const productSales = {};
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!productSales[item.name]) {
            productSales[item.name] = { name: item.name, revenue: 0, sales: 0, price: item.price };
          }
          productSales[item.name].revenue += item.price;
          productSales[item.name].sales += 1;
        });
      }
    });
    setTopProducts(Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5));

    // 6. Payment Methods
    const methods = {};
    orders.forEach(order => {
      const method = order.payment_method || 'Unknown';
      methods[method] = (methods[method] || 0) + order.total;
    });
    const totalRevMethods = Object.values(methods).reduce((a, b) => a + b, 0) || 1;
    setPaymentMethods(Object.keys(methods).map(m => ({
      method: m,
      amount: methods[m],
      percentage: Math.round((methods[m] / totalRevMethods) * 100)
    })));
  };

  const revenueStats = [
    {
      title: 'Total Revenue',
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueGrowth,
      trend: 'up',
      icon: FiDollarSign,
      color: 'emerald',
      description: 'All-time revenue'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: `₦${stats.mrr.toLocaleString()}`,
      change: stats.mrrGrowth,
      trend: 'up',
      icon: FiCalendar,
      color: 'blue',
      description: 'MRR this month'
    },
    {
      title: 'Average Order Value',
      value: `₦${stats.avgOrderValue.toFixed(2)}`,
      change: stats.aovGrowth,
      trend: 'up',
      icon: FiShoppingCart,
      color: 'purple',
      description: 'Per transaction'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: stats.conversionGrowth,
      trend: 'up',
      icon: FiPercent,
      color: 'orange',
      description: 'Visitor to customer'
    }
  ];

  /* 
     We replace static arrays with state variables:
     monthlyRevenue -> revenueHistory
     revenueBySource -> revenueBySource
     membershipRevenue -> membershipRevenue
     topProducts -> topProducts
     paymentMethods -> paymentMethods
  */

  const SimpleBarChart = ({ data, dataKey, color = 'blue' }) => (
    <div className="flex items-end space-x-2 h-32">
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d[dataKey])) || 1;
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
                <div className={`flex items-center space-x-1 ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
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
              data={revenueHistory}
              dataKey={viewType}
              color="emerald"
            />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-playfair font-bold text-emerald-600">
                  ₦{revenueHistory[revenueHistory.length - 1]?.revenue.toLocaleString() || '0'}
                </p>
                <p className="text-sm font-montserrat text-gray-600">This Month</p>
              </div>
              <div>
                <p className="text-lg font-playfair font-bold text-blue-600">
                  ₦{stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm font-montserrat text-gray-600">Total Revenue</p>
              </div>
              <div>
                <p className="text-lg font-playfair font-bold text-purple-600">
                  ₦{revenueHistory.length > 0 ? Math.round(stats.totalRevenue / revenueHistory.length).toLocaleString() : '0'}
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
                        ₦{source.amount.toLocaleString()}
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
                      ₦{tier.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm font-montserrat text-gray-600">Revenue</p>
                  </div>
                  <div>
                    <p className="text-lg font-montserrat font-bold text-navy-800">
                      {tier.users.toLocaleString()}
                    </p>
                    <p className="text-sm font-montserrat text-gray-600">Users</p>
                  </div>
                  <div className={`text-sm font-montserrat font-medium ${tier.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
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
                        ₦{product.revenue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat text-gray-700">{product.sales}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-montserrat text-gray-700">₦{product.price.toFixed(2)}</span>
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
                      className={`${index === 0 ? 'text-blue-500' :
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
                  ₦{method.amount.toLocaleString()}
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