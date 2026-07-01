import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import logoIcon from '../../assets/logo.png';

const { FiHome, FiCalendar, FiMail, FiEdit3, FiStar, FiFileText, FiUsers, FiSettings, FiImage, FiType, FiSearch, FiShoppingBag, FiMessageCircle, FiBookOpen } = FiIcons;

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
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

  return (
    <div className="w-64 bg-navy-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-navy-700">
        <div className="flex items-center space-x-3">
          <img src={logoIcon} alt="Lilian Adegbola" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h2 className="font-dancing text-xl font-bold">Admin Panel</h2>
            <p className="text-gray-400 text-sm font-montserrat">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-montserrat font-medium transition-colors ${activeTab === item.id
                  ? 'bg-gold-400 text-navy-900'
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'
                  }`}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span>{item.name}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-navy-700">
        <p className="text-gray-400 text-xs font-montserrat text-center">
          Lillian Adegbola<br />
          Admin Dashboard v1.0
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;