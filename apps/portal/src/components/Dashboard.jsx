import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MembershipBadge from './MembershipBadge';
import UsageIndicator from './UsageIndicator';
import AccessControl from './AccessControl';
import { UsageTracker, hasFeatureAccess, MEMBERSHIP_TIERS } from '../utils/membershipUtils';

const {
  FiBook, FiDownload, FiShoppingBag, FiTrendingUp, FiClock, FiStar, FiGift,
  FiArrowRight, FiAward, FiUsers, FiUser, FiTarget, FiCalendar, FiPlay,
  FiCheckCircle, FiAlertCircle, FiBarChart3, FiDollarSign, FiMessageSquare,
  FiHeart, FiEye, FiMoreVertical, FiUpgrade, FiMenu, FiX, FiChevronDown,
  FiChevronUp
} = FiIcons;

const Dashboard = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [usageTracker, setUsageTracker] = useState(null);
  const [membershipTier, setMembershipTier] = useState(user?.membershipTier || MEMBERSHIP_TIERS.BASIC);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [showMobileUsage, setShowMobileUsage] = useState(false);

  useEffect(() => {
    const tracker = new UsageTracker(membershipTier);
    tracker.resetMonthlyUsage();
    setUsageTracker(tracker);
  }, [membershipTier]);

  // Mock usage data - in real app this would come from backend
  const currentUsage = {
    resources: 3,
    downloads: 7,
    goals: 2,
    courses: 1
  };

  // Dashboard Statistics with membership-aware data
  const stats = [
    {
      title: 'Courses',
      value: '12',
      change: '+2',
      icon: FiBook,
      color: 'blue',
      trend: 'up',
      feature: 'courses'
    },
    {
      title: 'Hours',
      value: '48.5',
      change: '+5.2',
      icon: FiClock,
      color: 'emerald',
      trend: 'up'
    },
    {
      title: 'Downloads',
      value: currentUsage.downloads.toString(),
      change: '+12',
      icon: FiDownload,
      color: 'purple',
      trend: 'up',
      feature: 'downloads',
      showUsage: true
    },
    {
      title: 'Points',
      value: '2,840',
      change: '+240',
      icon: FiStar,
      color: 'gold',
      trend: 'up'
    }
  ];

  // Quick Actions with membership restrictions
  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume course',
      icon: FiPlay,
      color: 'blue',
      link: '/courses',
      action: 'Digital Marketing - Lesson 5',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      title: 'Set Goal',
      description: 'Create new goal',
      icon: FiTarget,
      color: 'emerald',
      link: '/goals',
      action: `${currentUsage.goals} active goals`,
      feature: 'goals',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      title: 'Analytics',
      description: 'Track progress',
      icon: FiBarChart3,
      color: 'purple',
      link: '/analytics',
      action: 'Progress insights',
      feature: 'analytics',
      requiredTier: MEMBERSHIP_TIERS.PREMIUM
    },
    {
      title: 'Community',
      description: 'Join discussion',
      icon: FiMessageSquare,
      color: 'orange',
      link: '/community',
      action: '12 discussions',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    }
  ];

  const canAccessFeature = (feature) => {
    return hasFeatureAccess(membershipTier, feature);
  };

  // Current Learning Data
  const currentLearning = [
    {
      id: 1,
      title: 'Digital Marketing Mastery',
      progress: 75,
      nextLesson: 'Social Media Strategy',
      timeLeft: '2h 30m',
      type: 'course'
    },
    {
      id: 2,
      title: 'Leadership Excellence',
      progress: 45,
      nextLesson: 'Team Communication',
      timeLeft: '4h 15m',
      type: 'course'
    },
    {
      id: 3,
      title: 'Goal Achievement Planner',
      progress: 90,
      nextLesson: 'Review & Reflect',
      timeLeft: '30m',
      type: 'resource'
    }
  ];

  // Recent Activity Data
  const recentActivity = [
    {
      id: 1,
      action: 'Completed lesson',
      item: 'Email Marketing Basics',
      time: '2h ago',
      icon: FiCheckCircle,
      color: 'emerald'
    },
    {
      id: 2,
      action: 'Downloaded resource',
      item: 'Social Media Templates',
      time: '1d ago',
      icon: FiDownload,
      color: 'blue'
    },
    {
      id: 3,
      action: 'Joined discussion',
      item: 'Productivity Tips',
      time: '2d ago',
      icon: FiMessageSquare,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Compact Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-3 py-3">
        <div className="flex flex-col space-y-3">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-playfair font-bold text-navy-800 truncate">
                Welcome, {user?.name?.split(' ')[0] || 'Member'}! 👋
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <MembershipBadge tier={membershipTier} size="xs" />
                <span className="text-xs text-gray-500 font-montserrat">Dashboard</span>
              </div>
            </div>
            
            {/* Controls - Compact */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-xs font-montserrat focus:ring-1 focus:ring-gold-500"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
              
              {membershipTier === MEMBERSHIP_TIERS.BASIC && (
                <Link
                  to="/membership"
                  className="bg-gold-gradient text-navy-800 px-2 py-1 rounded text-xs font-montserrat font-medium flex items-center"
                >
                  <SafeIcon icon={FiUpgrade} className="w-3 h-3 mr-1" />
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-3 space-y-3 overflow-hidden">
        {/* Membership Usage Overview - Collapsible */}
        {membershipTier !== MEMBERSHIP_TIERS.ULTIMATE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg p-3 shadow-sm border-l-2 border-gold-500"
          >
            <button
              onClick={() => setShowMobileUsage(!showMobileUsage)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="text-sm font-playfair font-bold text-navy-800">
                Monthly Usage
              </h2>
              <SafeIcon 
                icon={showMobileUsage ? FiChevronUp : FiChevronDown} 
                className="w-4 h-4 text-gray-400" 
              />
            </button>
            
            {showMobileUsage && (
              <div className="grid grid-cols-1 gap-2 mt-3">
                <div className="p-2 bg-luxury-pearl rounded">
                  <h3 className="text-xs font-montserrat font-medium text-navy-700 mb-1">Resources</h3>
                  <UsageIndicator 
                    membershipTier={membershipTier} 
                    feature="resources" 
                    currentUsage={currentUsage.resources}
                    className="text-xs"
                  />
                </div>
                <div className="p-2 bg-luxury-pearl rounded">
                  <h3 className="text-xs font-montserrat font-medium text-navy-700 mb-1">Downloads</h3>
                  <UsageIndicator 
                    membershipTier={membershipTier} 
                    feature="downloads" 
                    currentUsage={currentUsage.downloads}
                    className="text-xs"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Compact Statistics Cards */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-6 h-6 bg-${stat.color}-500 rounded flex items-center justify-center`}>
                  <SafeIcon icon={stat.icon} className="w-3 h-3 text-white" />
                </div>
                <SafeIcon 
                  icon={FiTrendingUp} 
                  className="w-3 h-3 text-emerald-500" 
                />
              </div>
              
              <div>
                <p className="text-lg font-playfair font-bold text-navy-800 leading-none">
                  {stat.value}
                </p>
                <p className="text-xs font-montserrat text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs font-montserrat text-emerald-600">
                  {stat.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions - Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg p-3 shadow-sm"
        >
          <button
            onClick={() => setShowMobileActions(!showMobileActions)}
            className="w-full flex items-center justify-between mb-2"
          >
            <h2 className="text-sm font-playfair font-bold text-navy-800">Quick Actions</h2>
            <SafeIcon 
              icon={showMobileActions ? FiChevronUp : FiChevronDown} 
              className="w-4 h-4 text-gray-400" 
            />
          </button>
          
          <div className={`grid grid-cols-1 gap-2 ${showMobileActions ? '' : 'hidden'}`}>
            {quickActions.map((action, index) => {
              const hasAccess = !action.feature || canAccessFeature(action.feature);
              
              if (!hasAccess) {
                return (
                  <div key={index} className="relative p-2 border border-dashed border-gray-300 rounded bg-gray-50">
                    <div className="flex items-center space-x-2 opacity-50">
                      <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                        <SafeIcon icon={action.icon} className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-montserrat font-semibold text-gray-500 truncate">
                          {action.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded">
                      <div className="text-center">
                        <SafeIcon icon={FiUpgrade} className="w-4 h-4 text-gold-600 mx-auto mb-1" />
                        <p className="text-xs font-montserrat text-gold-600 font-medium">Upgrade</p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:border-gold-400 hover:bg-gold-50 transition-all duration-300"
                >
                  <div className={`w-6 h-6 bg-${action.color}-500 rounded flex items-center justify-center`}>
                    <SafeIcon icon={action.icon} className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-montserrat font-semibold text-navy-800 truncate">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {action.action}
                    </p>
                  </div>
                  <SafeIcon icon={FiArrowRight} className="w-3 h-3 text-gray-400" />
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Current Learning - Compact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg p-3 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-playfair font-bold text-navy-800">
              Current Learning
            </h2>
            <Link
              to="/courses"
              className="text-gold-600 hover:text-gold-700 font-montserrat font-medium flex items-center text-xs"
            >
              View All 
              <SafeIcon icon={FiArrowRight} className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-2">
            {currentLearning.slice(0, 2).map((item) => (
              <div key={item.id} className="p-2 bg-luxury-pearl rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-montserrat font-medium text-navy-800 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      Next: {item.nextLesson}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-gray-500">{item.timeLeft}</span>
                    <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                      item.type === 'course' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-montserrat text-gray-600">Progress</span>
                    <span className="text-xs font-montserrat font-medium text-navy-800">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gold-500 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity - Compact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg p-3 shadow-sm"
        >
          <h3 className="text-sm font-playfair font-bold text-navy-800 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-2">
                <div className={`w-5 h-5 bg-${activity.color}-500 rounded-full flex items-center justify-center`}>
                  <SafeIcon icon={activity.icon} className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-montserrat text-navy-800 font-medium truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs font-montserrat text-gray-600 truncate">
                    {activity.item}
                  </p>
                </div>
                <span className="text-xs font-montserrat text-gray-400 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Analytics Preview or Upgrade Prompt - Compact */}
        <AccessControl
          membershipTier={membershipTier}
          feature="analytics"
          fallbackComponent={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg p-3 shadow-sm border border-dashed border-gold-300"
            >
              <div className="text-center">
                <SafeIcon icon={FiBarChart3} className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                <h3 className="font-playfair font-bold text-navy-800 mb-1 text-sm">
                  Analytics Insights
                </h3>
                <p className="text-xs text-gray-600 font-montserrat mb-2">
                  Get detailed progress insights
                </p>
                <MembershipBadge tier={MEMBERSHIP_TIERS.PREMIUM} size="xs" />
                <p className="text-xs text-gray-500 font-montserrat mt-1">Premium feature</p>
              </div>
            </motion.div>
          }
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-lg p-3 shadow-sm"
          >
            <h3 className="text-sm font-playfair font-bold text-navy-800 mb-2">Analytics</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-montserrat text-gray-600">Weekly Progress</span>
                <span className="text-xs font-montserrat font-bold text-emerald-600">+15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-montserrat text-gray-600">Learning Streak</span>
                <span className="text-xs font-montserrat font-bold text-gold-600">7 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-montserrat text-gray-600">Goal Completion</span>
                <span className="text-xs font-montserrat font-bold text-purple-600">67%</span>
              </div>
            </div>
          </motion.div>
        </AccessControl>

        {/* Upcoming Events - Compact */}
        <AccessControl
          membershipTier={membershipTier}
          feature="calendar"
          fallbackComponent={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg p-3 shadow-sm border border-dashed border-gold-300"
            >
              <div className="text-center">
                <SafeIcon icon={FiCalendar} className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                <h3 className="font-playfair font-bold text-navy-800 mb-1 text-sm">
                  Calendar & Events
                </h3>
                <p className="text-xs text-gray-600 font-montserrat mb-2">
                  Schedule learning sessions
                </p>
                <MembershipBadge tier={MEMBERSHIP_TIERS.PREMIUM} size="xs" />
                <p className="text-xs text-gray-500 font-montserrat mt-1">Premium feature</p>
              </div>
            </motion.div>
          }
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg p-3 shadow-sm"
          >
            <h3 className="text-sm font-playfair font-bold text-navy-800 mb-2">Upcoming Events</h3>
            <div className="space-y-2">
              <div className="p-2 bg-luxury-pearl rounded">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCalendar} className="w-3 h-3 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-montserrat font-medium text-navy-800 text-xs truncate">
                      Live Coaching Session
                    </h4>
                    <p className="text-xs text-gray-600 font-montserrat">
                      Tomorrow at 3:00 PM
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-luxury-pearl rounded">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="w-3 h-3 text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-montserrat font-medium text-navy-800 text-xs truncate">
                      Community Q&A
                    </h4>
                    <p className="text-xs text-gray-600 font-montserrat">
                      Friday at 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AccessControl>
      </div>
    </div>
  );
};

export default Dashboard;