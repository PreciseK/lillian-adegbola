import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import BookingsManager from './BookingsManager';
import ContactManager from './ContactManager';
import BlogManager from './BlogManager';
import ResourcesManager from './ResourcesManager';
import TestimonialsManager from './TestimonialsManager';
import SettingsManager from './SettingsManager';
import NewsletterManager from './NewsletterManager';
import PortraitManager from './PortraitManager';
import FontManager from './FontManager';
import SEOManager from './SEOManager';
import adminAuth from '../../lib/adminAuth';


const { FiLogOut, FiExternalLink } = FiIcons;

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(adminAuth.getUser());
  }, []);

  const handleLogout = () => {
    adminAuth.logout();
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsManager />;
      case 'contacts':
        return <ContactManager />;
      case 'blog':
        return <BlogManager />;
      case 'resources':
        return <ResourcesManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'newsletter':
        return <NewsletterManager />;
      case 'portrait':
        return <PortraitManager />;
      case 'fonts':
        return <FontManager />;
      case 'seo':
        return <SEOManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-playfair font-bold text-navy-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 font-montserrat">
                Welcome back, {user?.name}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '#/portal/admin'}
              className="flex items-center space-x-2 bg-navy-800 text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-navy-900 transition-colors mr-2"
            >
              <SafeIcon icon={FiExternalLink} />
              <span>Go to Portal Admin</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-red-700 transition-colors"
            >
              <SafeIcon icon={FiLogOut} />
              <span>Logout</span>
            </motion.button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;