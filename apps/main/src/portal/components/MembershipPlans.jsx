import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiCheck, FiX, FiStar, FiCrown, FiZap, FiUsers, FiBook, 
  FiDownload, FiVideo, FiHeadphones, FiMessageSquare, FiCalendar,
  FiBarChart3, FiTarget, FiAward, FiShield, FiCreditCard
} = FiIcons;

const MembershipPlans = ({ currentPlan = 'basic', onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: FiStar,
      color: 'blue',
      description: 'Perfect for getting started on your growth journey',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      features: {
        resources: { limit: 5, description: 'Basic resources per month' },
        courses: { limit: 1, description: 'Access to 1 free course' },
        community: { access: 'limited', description: 'Basic community access' },
        support: { type: 'email', description: 'Email support only' },
        downloads: { limit: 10, description: 'Downloads per month' },
        analytics: false,
        goals: { limit: 3, description: 'Track up to 3 goals' },
        calendar: false,
        liveEvents: false,
        privateCoaching: false,
        certificatesCustom: false
      },
      includes: [
        'Access to free resources library',
        'Basic goal tracking (3 goals)',
        'Community forum access',
        'Email support',
        '10 downloads per month'
      ],
      excludes: [
        'Premium courses',
        'Live coaching sessions',
        'Advanced analytics',
        'Calendar integration',
        'Priority support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: FiCrown,
      color: 'gold',
      description: 'Accelerate your growth with premium content and features',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      popular: true,
      features: {
        resources: { limit: 'unlimited', description: 'Unlimited premium resources' },
        courses: { limit: 'all', description: 'Access to all courses' },
        community: { access: 'full', description: 'Full community access' },
        support: { type: 'priority', description: 'Priority email & chat support' },
        downloads: { limit: 'unlimited', description: 'Unlimited downloads' },
        analytics: true,
        goals: { limit: 'unlimited', description: 'Unlimited goal tracking' },
        calendar: true,
        liveEvents: true,
        privateCoaching: false,
        certificatesCustom: true
      },
      includes: [
        'Everything in Basic',
        'All premium courses & resources',
        'Unlimited goal tracking',
        'Advanced analytics & insights',
        'Calendar & event management',
        'Live group coaching sessions',
        'Priority support',
        'Downloadable certificates'
      ],
      excludes: [
        '1-on-1 coaching sessions',
        'Custom learning paths',
        'White-label resources'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      icon: FiZap,
      color: 'purple',
      description: 'Complete transformation with personalized coaching and exclusive access',
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      popular: false,
      features: {
        resources: { limit: 'unlimited', description: 'Unlimited premium + exclusive resources' },
        courses: { limit: 'all', description: 'All courses + exclusive masterclasses' },
        community: { access: 'vip', description: 'VIP community access' },
        support: { type: 'dedicated', description: 'Dedicated success manager' },
        downloads: { limit: 'unlimited', description: 'Unlimited downloads + white-label' },
        analytics: true,
        goals: { limit: 'unlimited', description: 'Unlimited goals + AI insights' },
        calendar: true,
        liveEvents: true,
        privateCoaching: true,
        certificatesCustom: true
      },
      includes: [
        'Everything in Premium',
        'Monthly 1-on-1 coaching calls',
        'Exclusive masterclasses',
        'VIP community access',
        'Custom learning paths',
        'White-label resources',
        'Dedicated success manager',
        'Early access to new content'
      ],
      excludes: []
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade(selectedPlan, billingPeriod);
    }
  };

  const getPrice = (plan) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (billingPeriod === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyTotal = plan.monthlyPrice * 12;
      const savings = monthlyTotal - plan.yearlyPrice;
      return Math.round(savings);
    }
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-playfair font-bold text-navy-800 mb-4">
          Choose Your Membership Plan
        </h1>
        <p className="text-xl text-gray-600 font-montserrat mb-8">
          Unlock your potential with the perfect plan for your growth journey
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md font-montserrat font-medium transition-all duration-200 ${
              billingPeriod === 'monthly'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-md font-montserrat font-medium transition-all duration-200 relative ${
              billingPeriod === 'yearly'
                ? 'bg-gold-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
              plan.popular ? 'ring-2 ring-gold-500 scale-105' : 'hover:shadow-xl'
            } ${selectedPlan === plan.id ? 'ring-2 ring-purple-500' : ''}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gold-500 text-white text-center py-2 font-montserrat font-medium text-sm">
                Most Popular
              </div>
            )}

            <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-${plan.color}-500 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <SafeIcon icon={plan.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-navy-800 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 font-montserrat mb-6">
                  {plan.description}
                </p>
                
                {/* Pricing */}
                <div className="mb-6">
                  {plan.monthlyPrice === 0 ? (
                    <div className="text-4xl font-playfair font-bold text-navy-800">
                      Free
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-playfair font-bold text-navy-800">
                        ${getPrice(plan)}
                        <span className="text-lg text-gray-500 font-montserrat">
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {getSavings(plan) > 0 && (
                        <div className="text-emerald-600 font-montserrat font-medium text-sm">
                          Save ${getSavings(plan)} per year
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.includes.map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-montserrat text-sm">{feature}</span>
                  </div>
                ))}
                {plan.excludes.map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3 opacity-50">
                    <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-500 font-montserrat text-sm line-through">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 rounded-lg font-montserrat font-medium transition-all duration-300 ${
                  currentPlan === plan.id
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : selectedPlan === plan.id
                    ? `bg-${plan.color}-500 text-white shadow-lg`
                    : plan.popular
                    ? 'bg-gold-gradient text-navy-800 hover:shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id
                  ? 'Current Plan'
                  : selectedPlan === plan.id
                  ? 'Selected'
                  : plan.monthlyPrice === 0
                  ? 'Get Started'
                  : 'Choose Plan'
                }
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl p-8 shadow-sm"
      >
        <h2 className="text-2xl font-playfair font-bold text-navy-800 mb-6 text-center">
          Feature Comparison
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-montserrat font-medium text-navy-700 py-4">Features</th>
                {plans.map(plan => (
                  <th key={plan.id} className="text-center font-montserrat font-medium text-navy-700 py-4">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'resources', label: 'Resources Access', icon: FiDownload },
                { key: 'courses', label: 'Course Access', icon: FiBook },
                { key: 'goals', label: 'Goal Tracking', icon: FiTarget },
                { key: 'analytics', label: 'Analytics & Insights', icon: FiBarChart3 },
                { key: 'calendar', label: 'Calendar Integration', icon: FiCalendar },
                { key: 'liveEvents', label: 'Live Events', icon: FiVideo },
                { key: 'privateCoaching', label: '1-on-1 Coaching', icon: FiUsers },
                { key: 'support', label: 'Support Level', icon: FiMessageSquare }
              ].map(feature => (
                <tr key={feature.key} className="border-b border-gray-100">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={feature.icon} className="w-5 h-5 text-gray-600" />
                      <span className="font-montserrat text-navy-800">{feature.label}</span>
                    </div>
                  </td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-4">
                      {typeof plan.features[feature.key] === 'boolean' ? (
                        plan.features[feature.key] ? (
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400 mx-auto" />
                        )
                      ) : typeof plan.features[feature.key] === 'object' ? (
                        <span className="text-sm font-montserrat text-gray-700">
                          {plan.features[feature.key].description || plan.features[feature.key].limit || plan.features[feature.key].access || plan.features[feature.key].type}
                        </span>
                      ) : (
                        <span className="text-sm font-montserrat text-gray-700">
                          {plan.features[feature.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Upgrade Button */}
      {selectedPlan !== currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleUpgrade}
            className="bg-gold-gradient text-navy-800 px-8 py-4 rounded-lg font-montserrat font-semibold hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
          >
            <SafeIcon icon={FiCreditCard} className="w-5 h-5 mr-2" />
            Upgrade to {plans.find(p => p.id === selectedPlan)?.name}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MembershipPlans;