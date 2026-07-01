import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiDatabase, FiDownload, FiUpload, FiRefreshCw, FiTrash2, FiCheckCircle,
  FiAlertCircle, FiClock, FiHardDrive, FiServer, FiActivity, FiBarChart3,
  FiSettings, FiPlay, FiPause, FiRotateCcw, FiShield, FiUsers, FiFileText
} = FiIcons;

const DatabaseManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBackupRunning, setIsBackupRunning] = useState(false);

  // Mock database data
  const dbStats = [
    {
      title: 'Total Records',
      value: '47,832',
      change: '+1,234 today',
      icon: FiDatabase,
      color: 'blue'
    },
    {
      title: 'Database Size',
      value: '2.4 GB',
      change: '+45 MB this week',
      icon: FiHardDrive,
      color: 'emerald'
    },
    {
      title: 'Active Connections',
      value: '23',
      change: 'Peak: 45',
      icon: FiActivity,
      color: 'purple'
    },
    {
      title: 'Query Performance',
      value: '12ms',
      change: 'Avg response time',
      icon: FiBarChart3,
      color: 'orange'
    }
  ];

  const tables = [
    { name: 'users', records: 2847, size: '234 MB', lastModified: '2 hours ago' },
    { name: 'courses', records: 24, size: '12 MB', lastModified: '1 day ago' },
    { name: 'resources', records: 156, size: '89 MB', lastModified: '3 hours ago' },
    { name: 'orders', records: 1247, size: '67 MB', lastModified: '30 mins ago' },
    { name: 'support_tickets', records: 892, size: '45 MB', lastModified: '1 hour ago' },
    { name: 'analytics', records: 15643, size: '234 MB', lastModified: '15 mins ago' }
  ];

  const backups = [
    {
      id: 1,
      name: 'daily_backup_2024_02_20',
      size: '2.1 GB',
      created: '2024-02-20 03:00:00',
      type: 'Automated',
      status: 'completed'
    },
    {
      id: 2,
      name: 'manual_backup_2024_02_19',
      size: '2.0 GB',
      created: '2024-02-19 15:30:00',
      type: 'Manual',
      status: 'completed'
    },
    {
      id: 3,
      name: 'daily_backup_2024_02_19',
      size: '2.0 GB',
      created: '2024-02-19 03:00:00',
      type: 'Automated',
      status: 'completed'
    }
  ];

  const queryLogs = [
    {
      id: 1,
      query: 'SELECT * FROM users WHERE membership_tier = "premium"',
      duration: '15ms',
      timestamp: '2024-02-20 14:30:25',
      status: 'success'
    },
    {
      id: 2,
      query: 'UPDATE orders SET status = "completed" WHERE id = 1247',
      duration: '8ms',
      timestamp: '2024-02-20 14:28:15',
      status: 'success'
    },
    {
      id: 3,
      query: 'INSERT INTO support_tickets (user_id, subject, message)',
      duration: '12ms',
      timestamp: '2024-02-20 14:25:10',
      status: 'success'
    }
  ];

  const handleBackup = () => {
    setIsBackupRunning(true);
    // Simulate backup process
    setTimeout(() => {
      setIsBackupRunning(false);
      alert('Database backup completed successfully!');
    }, 3000);
  };

  const handleRestore = (backupId) => {
    if (confirm('Are you sure you want to restore from this backup? This action cannot be undone.')) {
      alert(`Restoring from backup ${backupId}...`);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiDatabase },
    { id: 'tables', name: 'Tables', icon: FiFileText },
    { id: 'backups', name: 'Backups', icon: FiDownload },
    { id: 'queries', name: 'Query Logs', icon: FiActivity },
    { id: 'maintenance', name: 'Maintenance', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">Database Management</h1>
            <p className="text-gray-600 font-montserrat">Monitor and manage database operations</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleBackup}
              disabled={isBackupRunning}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-blue-700 transition-all duration-300 flex items-center disabled:opacity-50"
            >
              <SafeIcon icon={isBackupRunning ? FiClock : FiDownload} className={`w-4 h-4 mr-2 ${isBackupRunning ? 'animate-spin' : ''}`} />
              {isBackupRunning ? 'Backing Up...' : 'Create Backup'}
            </button>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm h-fit"
          >
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-gold-500 text-white shadow-lg' 
                      : 'text-navy-700 hover:bg-gold-50 hover:text-gold-700'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5" />
                  <span className="font-montserrat font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>

            {/* Database Status */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-montserrat font-semibold text-navy-800 mb-4">Database Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-montserrat text-gray-600">Connection</span>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-montserrat text-emerald-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-montserrat text-gray-600">Replication</span>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-montserrat text-emerald-600">Synced</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-montserrat text-gray-600">Last Backup</span>
                  <span className="text-xs font-montserrat text-gray-500">2 hours ago</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Overview */}
              {activeTab === 'overview' && (
                <>
                  {/* Database Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dbStats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 bg-${stat.color}-500 rounded-lg flex items-center justify-center`}>
                            <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-playfair font-bold text-navy-800 mb-1">
                            {stat.value}
                          </p>
                          <p className="text-sm font-montserrat text-gray-600 mb-2">
                            {stat.title}
                          </p>
                          <p className="text-xs font-montserrat text-gray-500">
                            {stat.change}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Recent Database Activity</h2>
                    <div className="space-y-4">
                      {[
                        { action: 'User registration', table: 'users', time: '2 minutes ago', type: 'INSERT' },
                        { action: 'Order completed', table: 'orders', time: '5 minutes ago', type: 'UPDATE' },
                        { action: 'New support ticket', table: 'support_tickets', time: '8 minutes ago', type: 'INSERT' },
                        { action: 'Course progress updated', table: 'user_progress', time: '12 minutes ago', type: 'UPDATE' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-luxury-pearl rounded-lg">
                          <div>
                            <p className="font-montserrat font-medium text-navy-800">{activity.action}</p>
                            <p className="text-sm text-gray-600 font-montserrat">Table: {activity.table}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-montserrat font-medium ${
                              activity.type === 'INSERT' ? 'bg-emerald-100 text-emerald-700' :
                              activity.type === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {activity.type}
                            </span>
                            <p className="text-xs text-gray-500 font-montserrat mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tables */}
              {activeTab === 'tables' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-playfair font-bold text-navy-800">Database Tables</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Table Name</th>
                          <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Records</th>
                          <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Size</th>
                          <th className="px-6 py-3 text-left text-sm font-montserrat font-medium text-gray-700">Last Modified</th>
                          <th className="px-6 py-3 text-center text-sm font-montserrat font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {tables.map((table, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <span className="font-montserrat font-medium text-navy-800">{table.name}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-montserrat text-gray-700">{table.records.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-montserrat text-gray-700">{table.size}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-montserrat text-gray-700">{table.lastModified}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <SafeIcon icon={FiBarChart3} className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                  <SafeIcon icon={FiSettings} className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Backups */}
              {activeTab === 'backups' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-playfair font-bold text-navy-800">Database Backups</h2>
                      <div className="flex items-center space-x-3">
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-emerald-700 transition-colors flex items-center">
                          <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                          Upload Backup
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {backups.map((backup) => (
                        <div key={backup.id} className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                          <div>
                            <h3 className="font-montserrat font-medium text-navy-800">{backup.name}</h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 font-montserrat">
                              <span>Size: {backup.size}</span>
                              <span>Created: {backup.created}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                backup.type === 'Automated' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {backup.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleRestore(backup.id)}
                              className="bg-gold-gradient text-navy-800 px-3 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center text-sm"
                            >
                              <SafeIcon icon={FiRotateCcw} className="w-4 h-4 mr-1" />
                              Restore
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <SafeIcon icon={FiDownload} className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Backup Schedule */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Backup Schedule</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                        <div>
                          <h3 className="font-montserrat font-medium text-navy-800">Daily Backup</h3>
                          <p className="text-sm text-gray-600 font-montserrat">Runs every day at 3:00 AM</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-montserrat text-emerald-600">Enabled</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                        <div>
                          <h3 className="font-montserrat font-medium text-navy-800">Weekly Full Backup</h3>
                          <p className="text-sm text-gray-600 font-montserrat">Runs every Sunday at 2:00 AM</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-montserrat text-emerald-600">Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Query Logs */}
              {activeTab === 'queries' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-playfair font-bold text-navy-800">Recent Query Logs</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {queryLogs.map((log) => (
                      <div key={log.id} className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <code className="text-sm bg-gray-100 p-2 rounded font-mono text-navy-800 block">
                              {log.query}
                            </code>
                          </div>
                          <div className="ml-4 text-right">
                            <span className={`px-2 py-1 rounded text-xs font-montserrat font-medium ${
                              log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 font-montserrat">
                          <span>Duration: {log.duration}</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Database Maintenance</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-all duration-300 text-left group">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <h3 className="font-montserrat font-semibold text-navy-800 mb-1 group-hover:text-blue-600 transition-colors">
                          Optimize Tables
                        </h3>
                        <p className="text-sm text-gray-600 font-montserrat">
                          Optimize database tables for better performance
                        </p>
                      </button>

                      <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-emerald-400 transition-all duration-300 text-left group">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <SafeIcon icon={FiTrash2} className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <h3 className="font-montserrat font-semibold text-navy-800 mb-1 group-hover:text-emerald-600 transition-colors">
                          Clean Up Logs
                        </h3>
                        <p className="text-sm text-gray-600 font-montserrat">
                          Remove old log entries to free up space
                        </p>
                      </button>

                      <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-400 transition-all duration-300 text-left group">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <h3 className="font-montserrat font-semibold text-navy-800 mb-1 group-hover:text-purple-600 transition-colors">
                          Analyze Performance
                        </h3>
                        <p className="text-sm text-gray-600 font-montserrat">
                          Run performance analysis on database queries
                        </p>
                      </button>

                      <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-orange-400 transition-all duration-300 text-left group">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <SafeIcon icon={FiShield} className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <h3 className="font-montserrat font-semibold text-navy-800 mb-1 group-hover:text-orange-600 transition-colors">
                          Security Scan
                        </h3>
                        <p className="text-sm text-gray-600 font-montserrat">
                          Run security scan to identify vulnerabilities
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Maintenance Schedule */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-playfair font-bold text-navy-800 mb-6">Scheduled Maintenance</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                        <div>
                          <h3 className="font-montserrat font-medium text-navy-800">Table Optimization</h3>
                          <p className="text-sm text-gray-600 font-montserrat">Next run: Sunday, 1:00 AM</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-montserrat text-emerald-600">Scheduled</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-luxury-pearl rounded-lg">
                        <div>
                          <h3 className="font-montserrat font-medium text-navy-800">Log Cleanup</h3>
                          <p className="text-sm text-gray-600 font-montserrat">Next run: Daily, 4:00 AM</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-montserrat text-emerald-600">Scheduled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagement;