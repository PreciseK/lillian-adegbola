import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import logoIcon from '../../assets/logo.png';

const {
  FiHome, FiCalendar, FiMail, FiEdit3, FiStar, FiFileText, FiUsers, FiSettings,
  FiImage, FiType, FiSearch, FiShoppingBag, FiMessageCircle, FiBookOpen,
  FiBarChart3, FiShoppingCart, FiDatabase, FiTool, FiMessageSquare
} = FiIcons;

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const websiteItems = [
    { id: 'overview', name: 'Overview', icon: FiHome },
    { id: 'bookings', name: 'Bookings', icon: FiCalendar },
    { id: 'contacts', name: 'Contact Messages', icon: FiMail },
    { id: 'blog', name: 'Blog Posts', icon: FiEdit3 },
    { id: 'testimonials', name: 'Testimonials', icon: FiStar },
    { id: 'resources', name: 'Resources', icon: FiFileText },
    { id: 'newsletter', name: 'Newsletter', icon: FiUsers },
    { id: 'portrait', name: 'Portrait Manager', icon: FiImage },
    { id: 'fonts', name: 'Font Settings', icon: FiType },
    { id: 'seo', name: 'SEO Management', icon: FiSearch },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ];

  const portalItems = [
    { id: 'portal-overview', name: 'Portal Stats', icon: FiBarChart3 },
    { id: 'users', name: 'User Management', icon: FiUsers },
    { id: 'orders', name: 'Order Management', icon: FiShoppingCart },
    { id: 'support', name: 'Support Tickets', icon: FiMessageSquare },
    { id: 'courses', name: 'Courses Manager', icon: FiBookOpen },
    { id: 'shop', name: 'Shop Manager', icon: FiShoppingBag },
    { id: 'community', name: 'Community Manager', icon: FiMessageCircle },
    { id: 'system', name: 'System Settings', icon: FiSettings },
    { id: 'database', name: 'Database Manager', icon: FiDatabase },
    { id: 'tools', name: 'Admin Tools', icon: FiTool }
  ];

  const renderNavGroup = (title, items) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-montserrat">
        {title}
      </h3>
      <ul className="space-y-1 px-3">
        {items.map((item) => (
          <li key={item.id}>
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-montserrat font-medium text-sm transition-colors ${
                activeTab === item.id
                  ? 'bg-gold-400 text-navy-900'
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <SafeIcon icon={item.icon} className="text-base" />
              <span>{item.name}</span>
            </motion.button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="w-64 bg-navy-900 text-white flex flex-col h-screen border-r border-navy-800">
      {/* Logo */}
      <div className="p-6 border-b border-navy-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <img src={logoIcon} alt="Lilian Adegbola" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h2 className="font-dancing text-xl font-bold">Admin Panel</h2>
            <p className="text-gray-400 text-xs font-montserrat">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto min-h-0">
        {renderNavGroup('Website', websiteItems)}
        {renderNavGroup('Portal', portalItems)}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-navy-700 bg-navy-950 flex-shrink-0">
        <p className="text-gray-400 text-xxs font-montserrat text-center">
          Lillian Adegbola<br />
          Admin Dashboard v1.1
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;