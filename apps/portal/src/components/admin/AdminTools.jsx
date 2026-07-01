import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiTool, FiUsers, FiMail, FiFileText, FiDownload, FiUpload, FiRefreshCw,
  FiSettings, FiBarChart3, FiShield, FiDatabase, FiServer, FiMonitor,
  FiCode, FiPackage, FiGlobe, FiSearch, FiFilter, FiPlay, FiPause,
  FiTrash2, FiEdit3, FiCopy, FiExternalLink, FiAlertCircle, FiCheckCircle
} = FiIcons;

const AdminTools = () => {
  const [activeCategory, setActiveCategory] = useState('user-management');
  const [searchTerm, setSearchTerm] = useState('');

  const toolCategories = [
    { id: 'user-management', name: 'User Management', icon: FiUsers },
    { id: 'content', name: 'Content Tools', icon: FiFileText },
    { id: 'system', name: 'System Tools', icon: FiServer },
    { id: 'analytics', name: 'Analytics Tools', icon: FiBarChart3 },
    { id: 'communication', name: 'Communication', icon: FiMail },
    { id: 'maintenance', name: 'Maintenance', icon: FiTool }
  ];

  const tools = {
    'user-management': [
      {
        id: 1,
        name: 'Bulk User Import',
        description: 'Import multiple users from CSV file',
        icon: FiUpload,
        color: 'blue',
        status: 'active',
        lastUsed: '2 hours ago'
      },
      {
        id: 2,
        name: 'User Data Export',
        description: 'Export user data with privacy compliance',
        icon: FiDownload,
        color: 'emerald',
        status: 'active',
        lastUsed: '1 day ago'
      },
      {
        id: 3,
        name: 'Membership Migrator',
        description: 'Migrate users between membership tiers',
        icon: FiRefreshCw,
        color: 'purple',
        status: 'active',
        lastUsed: '3 days ago'
      },
      {
        id: 4,
        name: 'Account Merger',
        description: 'Merge duplicate user accounts',
        icon: FiUsers,
        color: 'orange',
        status: 'active',
        lastUsed: '1 week ago'
      }
    ],
    'content': [
      {
        id: 5,
        name: 'Content Duplicator',
        description: 'Duplicate courses and resources',
        icon: FiCopy,
        color: 'blue',
        status: 'active',
        lastUsed: '5 hours ago'
      },
      {
        id: 6,
        name: 'Bulk Content Editor',
        description: 'Edit multiple content items at once',
        icon: FiEdit3,
        color: 'emerald',
        status: 'active',
        lastUsed: '2 days ago'
      },
      {
        id: 7,
        name: 'SEO Optimizer',
        description: 'Optimize content for search engines',
        icon: FiSearch,
        color: 'purple',
        status: 'active',
        lastUsed: '1 day ago'
      },
      {
        id: 8,
        name: 'Content Archiver',
        description: 'Archive old or unused content',
        icon: FiPackage,
        color: 'orange',
        status: 'active',
        lastUsed: '4 days ago'
      }
    ],
    'system': [
      {
        id: 9,
        name: 'Cache Manager',
        description: 'Clear and manage system cache',
        icon: FiRefreshCw,
        color: 'blue',
        status: 'active',
        lastUsed: '30 minutes ago'
      },
      {
        id: 10,
        name: 'Log Analyzer',
        description: 'Analyze system and error logs',
        icon: FiFileText,
        color: 'emerald',
        status: 'active',
        lastUsed: '1 hour ago'
      },
      {
        id: 11,
        name: 'Health Monitor',
        description: 'Monitor system health and performance',
        icon: FiMonitor,
        color: 'purple',
        status: 'running',
        lastUsed: 'Running now'
      },
      {
        id: 12,
        name: 'Security Scanner',
        description: 'Scan for security vulnerabilities',
        icon: FiShield,
        color: 'red',
        status: 'active',
        lastUsed: '6 hours ago'
      }
    ],
    'analytics': [
      {
        id: 13,
        name: 'Report Generator',
        description: 'Generate custom analytics reports',
        icon: FiBarChart3,
        color: 'blue',
        status: 'active',
        lastUsed: '3 hours ago'
      },
      {
        id: 14,
        name: 'Data Exporter',
        description: 'Export analytics data to various formats',
        icon: FiDownload,
        color: 'emerald',
        status: 'active',
        lastUsed: '1 day ago'
      },
      {
        id: 15,
        name: 'Trend Analyzer',
        description: 'Analyze user behavior trends',
        icon: FiTool,
        color: 'purple',
        status: 'active',
        lastUsed: '2 days ago'
      },
      {
        id: 16,
        name: 'Performance Tracker',
        description: 'Track platform performance metrics',
        icon: FiMonitor,
        color: 'orange',
        status: 'running',
        lastUsed: 'Running now'
      }
    ],
    'communication': [
      {
        id: 17,
        name: 'Bulk Email Sender',
        description: 'Send emails to multiple users',
        icon: FiMail,
        color: 'blue',
        status: 'active',
        lastUsed: '4 hours ago'
      },
      {
        id: 18,
        name: 'Notification Manager',
        description: 'Manage push notifications',
        icon: FiSettings,
        color: 'emerald',
        status: 'active',
        lastUsed: '2 hours ago'
      },
      {
        id: 19,
        name: 'Template Editor',
        description: 'Edit email and notification templates',
        icon: FiEdit3,
        color: 'purple',
        status: 'active',
        lastUsed: '1 day ago'
      },
      {
        id: 20,
        name: 'Message Scheduler',
        description: 'Schedule messages and announcements',
        icon: FiSettings,
        color: 'orange',
        status: 'active',
        lastUsed: '3 days ago'
      }
    ],
    'maintenance': [
      {
        id: 21,
        name: 'Database Optimizer',
        description: 'Optimize database performance',
        icon: FiDatabase,
        color: 'blue',
        status: 'active',
        lastUsed: '1 day ago'
      },
      {
        id: 22,
        name: 'File Cleanup',
        description: 'Clean up unused files and media',
        icon: FiTrash2,
        color: 'red',
        status: 'active',
        lastUsed: '2 days ago'
      },
      {
        id: 23,
        name: 'Update Manager',
        description: 'Manage system updates and patches',
        icon: FiRefreshCw,
        color: 'emerald',
        status: 'active',
        lastUsed: '1 week ago'
      },
      {
        id: 24,
        name: 'Backup Scheduler',
        description: 'Schedule automated backups',
        icon: FiPackage,
        color: 'purple',
        status: 'running',
        lastUsed: 'Running now'
      }
    ]
  };

  const filteredTools = tools[activeCategory]?.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleToolAction = (tool) => {
    if (tool.status === 'running') {
      alert(`${tool.name} is currently running. Check the status in the system monitor.`);
    } else {
      alert(`Launching ${tool.name}...`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const recentActivity = [
    { tool: 'Cache Manager', action: 'Cache cleared', time: '30 minutes ago', status: 'success' },
    { tool: 'User Data Export', action: 'Export completed', time: '1 hour ago', status: 'success' },
    { tool: 'Security Scanner', action: 'Scan completed', time: '6 hours ago', status: 'success' },
    { tool: 'Database Optimizer', action: 'Optimization completed', time: '1 day ago', status: 'success' }
  ];

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Admin Tools</h1>
            <p className="text-gray-600 font-montserrat">Administrative utilities and management tools</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat text-sm"
              />
            </div>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Category Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm h-fit"
          >
            <h2 className="text-lg font-playfair font-bold text-navy-800 mb-4">Tool Categories</h2>
            <nav className="space-y-2">
              {toolCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeCategory === category.id 
                      ? 'bg-gold-500 text-white shadow-lg' 
                      : 'text-navy-700 hover:bg-gold-50 hover:text-gold-700'
                  }`}
                >
                  <SafeIcon icon={category.icon} className="w-5 h-5" />
                  <span className="font-montserrat font-medium text-sm">{category.name}</span>
                </button>
              ))}
            </nav>

            {/* Recent Activity */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-montserrat font-semibold text-navy-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 4).map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-montserrat font-medium text-navy-800">{activity.tool}</p>
                    <p className="text-gray-600 font-montserrat">{activity.action}</p>
                    <p className="text-gray-500 font-montserrat text-xs">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Category Header */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <SafeIcon 
                    icon={toolCategories.find(cat => cat.id === activeCategory)?.icon || FiTool} 
                    className="w-6 h-6 text-gold-600" 
                  />
                  <h2 className="text-xl font-playfair font-bold text-navy-800">
                    {toolCategories.find(cat => cat.id === activeCategory)?.name || 'Tools'}
                  </h2>
                </div>
                <p className="text-gray-600 font-montserrat">
                  {filteredTools.length} tools available in this category
                </p>
              </div>

              {/* Tools Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-${tool.color}-500 rounded-lg flex items-center justify-center`}>
                        <SafeIcon icon={tool.icon} className="w-6 h-6 text-white" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(tool.status)}`}>
                        {tool.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">
                      {tool.name}
                    </h3>
                    
                    <p className="text-gray-600 font-montserrat mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-montserrat">
                        Last used: {tool.lastUsed}
                      </span>
                      <button
                        onClick={() => handleToolAction(tool)}
                        className={`px-4 py-2 rounded-lg font-montserrat font-medium transition-all duration-300 flex items-center ${
                          tool.status === 'running' 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                            : 'bg-gold-gradient text-navy-800 hover:shadow-lg'
                        }`}
                      >
                        <SafeIcon 
                          icon={tool.status === 'running' ? FiPause : FiPlay} 
                          className="w-4 h-4 mr-2" 
                        />
                        {tool.status === 'running' ? 'View Status' : 'Launch'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-playfair font-bold text-navy-800 mb-2">No Tools Found</h3>
                  <p className="text-gray-600 font-montserrat">
                    No tools match your search criteria. Try adjusting your search terms.
                  </p>
                </div>
              )}

              {/* System Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">System Status</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-luxury-pearl rounded-lg">
                    <SafeIcon icon={FiCheckCircle} className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <h3 className="font-montserrat font-medium text-navy-800">All Systems</h3>
                    <p className="text-sm text-emerald-600 font-montserrat">Operational</p>
                  </div>
                  <div className="text-center p-4 bg-luxury-pearl rounded-lg">
                    <SafeIcon icon={FiServer} className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-montserrat font-medium text-navy-800">Server Load</h3>
                    <p className="text-sm text-blue-600 font-montserrat">23% Average</p>
                  </div>
                  <div className="text-center p-4 bg-luxury-pearl rounded-lg">
                    <SafeIcon icon={FiDatabase} className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-montserrat font-medium text-navy-800">Database</h3>
                    <p className="text-sm text-purple-600 font-montserrat">99.9% Uptime</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Quick Actions</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { name: 'Clear Cache', icon: FiRefreshCw, color: 'blue' },
                    { name: 'Run Backup', icon: FiDownload, color: 'emerald' },
                    { name: 'Send Alert', icon: FiAlertCircle, color: 'orange' },
                    { name: 'View Logs', icon: FiFileText, color: 'purple' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-gold-400 transition-all duration-300 text-center group"
                    >
                      <div className={`w-8 h-8 bg-${action.color}-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <SafeIcon icon={action.icon} className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-montserrat font-medium text-navy-800 group-hover:text-gold-600 transition-colors">
                        {action.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;