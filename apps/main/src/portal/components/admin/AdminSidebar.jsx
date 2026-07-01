import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import supabase from '../../../lib/supabase';


const {
  FiHome, FiUsers, FiBook, FiShoppingCart, FiMessageSquare, FiBarChart3,
  FiSettings, FiLogOut, FiMenu, FiX, FiShield, FiDollarSign, FiFileText,
  FiCalendar, FiDownload, FiHelpCircle, FiBell, FiDatabase, FiTool,
  FiBookOpen, FiShoppingBag, FiMessageCircle, FiStar
} = FiIcons;

const AdminSidebar = ({ isCollapsed, setIsCollapsed, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/portal/admin',
      icon: FiHome,
      description: 'Overview & analytics'
    },
    {
      name: 'User Management',
      href: '/portal/admin/users',
      icon: FiUsers,
      description: 'Manage users & memberships'
    },
    {
      name: 'Content Management',
      href: '/portal/admin/content',
      icon: FiBook,
      description: 'Courses & resources'
    },
    {
      name: 'Order Management',
      href: '/portal/admin/orders',
      icon: FiShoppingCart,
      description: 'Process orders & payments'
    },
    {
      name: 'Support Center',
      href: '/portal/admin/support',
      icon: FiMessageSquare,
      description: 'Customer support tickets'
    },
    {
      name: 'Analytics',
      href: '/portal/admin/analytics',
      icon: FiBarChart3,
      description: 'Reports & insights'
    },
    {
      name: 'Revenue',
      href: '/portal/admin/revenue',
      icon: FiDollarSign,
      description: 'Financial reports'
    },
    {
      name: 'Courses Manager',
      href: '/portal/admin/courses',
      icon: FiBookOpen,
      description: 'Manage courses'
    },
    {
      name: 'Shop Manager',
      href: '/portal/admin/shop',
      icon: FiShoppingBag,
      description: 'Manage products'
    },
    {
      name: 'Community Manager',
      href: '/portal/admin/community',
      icon: FiMessageCircle,
      description: 'Manage posts'
    },
    {
      name: 'Testimonials',
      href: '/portal/admin/testimonials',
      icon: FiStar,
      description: 'Manage success stories'
    }
  ];

  const systemNavigation = [
    {
      name: 'System Settings',
      href: '/portal/admin/system',
      icon: FiSettings,
      description: 'Platform configuration'
    },
    {
      name: 'Database',
      href: '/portal/admin/database',
      icon: FiDatabase,
      description: 'Database management'
    },
    {
      name: 'Tools',
      href: '/portal/admin/tools',
      icon: FiTool,
      description: 'Admin utilities'
    }
  ];

  const isActive = (path) => location.pathname === path;



  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Logout error:', error);
      if (onLogout) onLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout exception:', error);
      navigate('/');
    }
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
          width: isCollapsed ? '80px' : '280px',
          x: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full bg-navy-800 shadow-xl z-50 flex flex-col lg:relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-navy-600">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-navy-900" />
              </div>
              <div>
                <h1 className="font-dancing text-lg font-bold text-white">
                  Admin Panel
                </h1>
                <p className="text-xs font-montserrat text-gold-200">
                  Platform Management
                </p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-navy-700 transition-colors"
          >
            <SafeIcon icon={isCollapsed ? FiMenu : FiX} className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Admin Info */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-navy-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-montserrat font-semibold text-white">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-xs font-montserrat text-gold-200">
                  System Administrator
                </p>
              </div>
              <div className="relative">
                <SafeIcon icon={FiBell} className="w-5 h-5 text-gold-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">5</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Main Navigation */}
          <div className="space-y-1 px-3">
            <div className={`${!isCollapsed ? 'px-3 py-2' : 'px-1 py-2'}`}>
              {!isCollapsed && (
                <p className="text-xs font-montserrat font-semibold text-gold-400 uppercase tracking-wider">
                  Main
                </p>
              )}
            </div>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive(item.href)
                  ? 'bg-gold-500 text-navy-800 shadow-lg'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                  }`}
              >
                <SafeIcon
                  icon={item.icon}
                  className={`w-5 h-5 ${isActive(item.href) ? 'text-navy-800' : 'text-gray-400 group-hover:text-white'
                    }`}
                />
                {!isCollapsed && (
                  <div className="flex-1">
                    <p className="font-montserrat font-medium text-sm">{item.name}</p>
                    <p className={`text-xs ${isActive(item.href) ? 'text-navy-600' : 'text-gray-500 group-hover:text-gray-300'
                      }`}>
                      {item.description}
                    </p>
                  </div>
                )}
                {isCollapsed && isActive(item.href) && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gold-500 text-navy-800 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* System Navigation */}
          <div className="mt-8 space-y-1 px-3">
            <div className={`${!isCollapsed ? 'px-3 py-2' : 'px-1 py-2'}`}>
              {!isCollapsed && (
                <p className="text-xs font-montserrat font-semibold text-gold-400 uppercase tracking-wider">
                  System
                </p>
              )}
            </div>
            {systemNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive(item.href)
                  ? 'bg-gold-500 text-navy-800 shadow-lg'
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                  }`}
              >
                <SafeIcon
                  icon={item.icon}
                  className={`w-5 h-5 ${isActive(item.href) ? 'text-navy-800' : 'text-gray-400 group-hover:text-white'
                    }`}
                />
                {!isCollapsed && (
                  <div className="flex-1">
                    <p className="font-montserrat font-medium text-sm">{item.name}</p>
                    <p className={`text-xs ${isActive(item.href) ? 'text-navy-600' : 'text-gray-500 group-hover:text-gray-300'
                      }`}>
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-4 border-t border-navy-600 px-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-all duration-200 group"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5" />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="font-montserrat font-medium text-sm">Logout</p>
                  <p className="text-xs text-red-300">Exit admin panel</p>
                </div>
              )}
            </button>
          </div>
        </nav>

        {/* System Status */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 m-4 bg-emerald-900 bg-opacity-20 rounded-xl border border-emerald-500 border-opacity-30"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-montserrat font-semibold text-emerald-400 text-sm">
                System Status
              </span>
            </div>
            <p className="text-xs text-emerald-300 mb-2">
              All systems operational
            </p>
            <div className="text-xs font-montserrat text-gray-400">
              <div>Uptime: 99.9%</div>
              <div>Users online: 2,156</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default AdminSidebar;