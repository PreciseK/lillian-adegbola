import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MembershipBadge from './MembershipBadge';
import { hasFeatureAccess, MEMBERSHIP_TIERS } from '../utils/membershipUtils';

const {
  FiHome, FiBook, FiShoppingBag, FiGift, FiUser, FiSettings, FiLogOut,
  FiMenu, FiX, FiAward, FiBarChart3, FiHelpCircle, FiBell, FiMessageSquare,
  FiCalendar, FiTarget, FiUpgrade, FiLock
} = FiIcons;

const Sidebar = ({ isCollapsed, setIsCollapsed, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const membershipTier = user?.membershipTier || MEMBERSHIP_TIERS.BASIC;

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
      description: 'Overview',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      name: 'Learning',
      href: '/courses',
      icon: FiBook,
      description: 'Courses',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: FiGift,
      description: 'Downloads',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      name: 'Shop',
      href: '/shop',
      icon: FiShoppingBag,
      description: 'Products',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      name: 'Goals',
      href: '/goals',
      icon: FiTarget,
      description: 'Track goals',
      requiredTier: MEMBERSHIP_TIERS.BASIC,
      feature: 'goals'
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: FiCalendar,
      description: 'Events',
      requiredTier: MEMBERSHIP_TIERS.PREMIUM,
      feature: 'calendar'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: FiBarChart3,
      description: 'Progress',
      requiredTier: MEMBERSHIP_TIERS.PREMIUM,
      feature: 'analytics'
    },
    {
      name: 'Community',
      href: '/community',
      icon: FiMessageSquare,
      description: 'Discuss',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
  ];

  const bottomNavigation = [
    {
      name: 'Profile',
      href: '/profile',
      icon: FiUser,
      description: 'Account',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: FiSettings,
      description: 'Preferences',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
    {
      name: 'Help',
      href: '/help',
      icon: FiHelpCircle,
      description: 'Support',
      requiredTier: MEMBERSHIP_TIERS.BASIC
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const canAccessFeature = (item) => {
    if (item.feature) {
      return hasFeatureAccess(membershipTier, item.feature);
    }
    // Check tier requirement
    const tierOrder = [MEMBERSHIP_TIERS.BASIC, MEMBERSHIP_TIERS.PREMIUM, MEMBERSHIP_TIERS.ULTIMATE];
    const userTierIndex = tierOrder.indexOf(membershipTier);
    const requiredTierIndex = tierOrder.indexOf(item.requiredTier);
    return userTierIndex >= requiredTierIndex;
  };

  const renderNavigationItem = (item, isBottomNav = false) => {
    const hasAccess = canAccessFeature(item);
    const isCurrentlyActive = isActive(item.href);

    if (!hasAccess) {
      return (
        <div
          key={item.name}
          className="relative flex items-center space-x-2 px-2 py-2 rounded text-gray-400 cursor-not-allowed"
        >
          <SafeIcon icon={item.icon} className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="font-montserrat font-medium text-xs truncate">{item.name}</p>
                <SafeIcon icon={FiLock} className="w-2.5 h-2.5 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-400 hidden sm:block truncate">{item.description}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`flex items-center space-x-2 px-2 py-2 rounded transition-all duration-200 group ${
          isCurrentlyActive 
            ? 'bg-gold-500 text-white shadow-sm' 
            : 'text-navy-700 hover:bg-gold-50 hover:text-gold-700'
        }`}
      >
        <SafeIcon 
          icon={item.icon} 
          className={`w-4 h-4 flex-shrink-0 ${
            isCurrentlyActive 
              ? 'text-white' 
              : 'text-navy-600 group-hover:text-gold-600'
          }`} 
        />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-montserrat font-medium text-xs truncate">{item.name}</p>
            <p className={`text-xs hidden sm:block truncate ${
              isCurrentlyActive 
                ? 'text-gold-100' 
                : 'text-gray-500'
            }`}>
              {item.description}
            </p>
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setIsCollapsed(true)} 
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? '48px' : '240px',
          x: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 flex flex-col lg:relative ${
          isCollapsed ? 'w-12' : 'w-60'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 min-w-0"
            >
              <div className="w-6 h-6 bg-gold-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-navy-900 font-bold text-xs font-playfair">LA</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-dancing text-sm font-bold text-navy-800 truncate">
                  Lillian Adegbola
                </h1>
                <p className="text-xs text-navy-600 hidden sm:block truncate">
                  Queen of Clarity
                </p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <SafeIcon icon={isCollapsed ? FiMenu : FiX} className="w-4 h-4 text-navy-700" />
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-luxury-gradient text-white"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-white text-xs truncate">
                  {user?.name?.split(' ')[0] || 'Member'}
                </p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <MembershipBadge tier={membershipTier} size="xs" />
                </div>
              </div>
              <div className="relative flex-shrink-0">
                <SafeIcon icon={FiBell} className="w-3 h-3 text-gold-400" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="space-y-0.5 px-2">
            {navigation.map(item => renderNavigationItem(item))}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-4 pt-2 border-t border-gray-200">
            <div className="space-y-0.5 px-2">
              {bottomNavigation.map(item => renderNavigationItem(item, true))}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-2 py-2 rounded text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-montserrat font-medium text-xs">Logout</p>
                    <p className="text-xs text-red-400 hidden sm:block">Sign out</p>
                  </div>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Membership Upgrade */}
        {!isCollapsed && membershipTier !== MEMBERSHIP_TIERS.ULTIMATE && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 m-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white"
          >
            <div className="flex items-center space-x-1 mb-1">
              <SafeIcon icon={FiAward} className="w-3 h-3 text-yellow-300" />
              <span className="font-montserrat font-semibold text-xs">
                Upgrade Available
              </span>
            </div>
            <p className="text-xs text-purple-100 mb-2">
              Unlock more features
            </p>
            <Link
              to="/membership"
              className="w-full bg-white text-purple-600 py-1 px-2 rounded text-xs font-montserrat font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center"
            >
              <SafeIcon icon={FiUpgrade} className="w-2.5 h-2.5 mr-1" />
              Learn More
            </Link>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;