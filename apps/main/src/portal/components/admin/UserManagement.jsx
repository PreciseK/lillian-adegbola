import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import MembershipBadge from '../MembershipBadge';
import { MEMBERSHIP_TIERS, getMembershipDisplayName } from '../../utils/membershipUtils';
import supabase from '../../../lib/supabase';

const {
  FiSearch, FiFilter, FiUser, FiMail, FiCalendar, FiEdit3, FiTrash2, FiEye,
  FiUserPlus, FiDownload, FiUpload, FiMoreVertical, FiCheck, FiX, FiCrown,
  FiShield, FiAlertCircle, FiRefreshCw
} = FiIcons;

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterStatus, filterTier]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles_la2024')
        .select('*');

      if (filterStatus !== 'all') {
        // query = query.eq('status', filterStatus); // status column might need to be added to profiles
      }

      if (filterTier !== 'all') {
        query = query.eq('membership_tier', filterTier);
      }

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match UI expected format
      const transformedUsers = data.map(user => ({
        id: user.id,
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name',
        email: user.email || 'No Email',
        membershipTier: user.membership_tier || MEMBERSHIP_TIERS.BASIC,
        status: 'active', // Defaulting to active as status column might not exist yet
        joinDate: user.created_at,
        lastActive: user.updated_at,
        totalSpent: 0, // Needs orders table
        coursesCompleted: 0, // Needs enrollments table
        avatar: user.avatar_url || 'https://via.placeholder.com/100'
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesTier = filterTier === 'all' || user.membershipTier === filterTier;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case 'activate':
        alert(`Activating ${selectedUsers.length} users`);
        break;
      case 'deactivate':
        alert(`Deactivating ${selectedUsers.length} users`);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete selected users?')) {
          alert(`Deleting ${selectedUsers.length} users`);
        }
        break;
      default:
        break;
    }
    setSelectedUsers([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-playfair font-bold text-navy-800">User Management</h1>
            <p className="text-gray-600 font-montserrat">Manage user accounts, memberships, and activities</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-all duration-300 flex items-center">
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center">
              <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
              >
                <option value="all">All Tiers</option>
                <option value={MEMBERSHIP_TIERS.BASIC}>Basic</option>
                <option value={MEMBERSHIP_TIERS.PREMIUM}>Premium</option>
                <option value={MEMBERSHIP_TIERS.ULTIMATE}>Ultimate</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="font-montserrat font-medium text-blue-800">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="bg-emerald-500 text-white px-3 py-1 rounded font-montserrat text-sm hover:bg-emerald-600 transition-colors"
                  >
                    <SafeIcon icon={FiCheck} className="w-3 h-3 mr-1" />
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="bg-gray-500 text-white px-3 py-1 rounded font-montserrat text-sm hover:bg-gray-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-3 h-3 mr-1" />
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="bg-red-500 text-white px-3 py-1 rounded font-montserrat text-sm hover:bg-red-600 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(user => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Membership</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Join Date</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Activity</th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-medium text-gray-700">Revenue</th>
                  <th className="px-6 py-4 text-center text-sm font-montserrat font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-montserrat font-medium text-navy-800">{user.name}</p>
                          <p className="text-sm text-gray-500 font-montserrat">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <MembershipBadge tier={user.membershipTier} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-montserrat text-gray-700">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-montserrat">
                        <p className="text-gray-700">{user.coursesCompleted} courses</p>
                        <p className="text-gray-500">
                          Last: {new Date(user.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-montserrat font-medium text-emerald-600">
                        ${user.totalSpent.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                          <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiUser} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-montserrat">No users found matching your criteria.</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 font-montserrat">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-montserrat hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-gold-500 text-white rounded text-sm font-montserrat">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-montserrat hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm font-montserrat hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-playfair font-bold text-navy-800">{selectedUser.name}</h3>
                  <p className="text-gray-600 font-montserrat">{selectedUser.email}</p>
                  <MembershipBadge tier={selectedUser.membershipTier} size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-montserrat font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Total Spent</label>
                  <p className="font-montserrat font-bold text-emerald-600">${selectedUser.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Join Date</label>
                  <p className="font-montserrat text-gray-800">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-montserrat font-medium text-gray-700 mb-1">Courses Completed</label>
                  <p className="font-montserrat text-gray-800">{selectedUser.coursesCompleted}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-gold-gradient text-navy-800 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300">
                  Edit User
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-montserrat font-medium hover:bg-gray-50 transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;