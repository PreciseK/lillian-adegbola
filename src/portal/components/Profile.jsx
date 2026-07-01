import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';

const { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiX } = FiIcons;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    membershipType: 'Basic'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('profiles_la2024')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setProfileData({
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            email: user.email || '',
            phone: data.phone || '',
            location: data.location || '',
            bio: data.bio || '',
            membershipType: data.membership_tier ? data.membership_tier.charAt(0).toUpperCase() + data.membership_tier.slice(1) : 'Basic'
          });
        } else {
          // If no profile exists yet, set email from auth
          setProfileData(prev => ({ ...prev, email: user.email }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const nameParts = profileData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updates = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        updated_at: new Date()
      };

      const { error } = await supabase
        .from('profiles_la2024')
        .upsert(updates);

      if (error) throw error;

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const membershipBenefits = [
    'Access to all premium courses',
    'Unlimited resource downloads',
    'Priority customer support',
    'Exclusive member events',
    'Monthly coaching calls'
  ];

  const achievements = [
    {
      title: 'First Course Completed',
      date: '2023-01-15',
      icon: FiUser
    },
    {
      title: '10 Resources Downloaded',
      date: '2023-02-20',
      icon: FiUser
    },
    {
      title: 'Community Contributor',
      date: '2023-03-10',
      icon: FiUser
    },
    {
      title: 'Goal Achiever',
      date: '2023-04-05',
      icon: FiUser
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-pearl py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-luxury-gradient rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-2">
                <h1 className="text-3xl font-playfair font-bold">{profileData.name}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors"
                >
                  <SafeIcon icon={isEditing ? FiX : FiEdit3} className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-gold-200 font-montserrat mb-2">{profileData.email}</p>
              <div className="inline-block bg-gold-400 text-navy-800 px-4 py-2 rounded-full text-sm font-montserrat font-medium">
                {profileData.membershipType} Member
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-playfair font-bold text-navy-800">Profile Information</h2>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="bg-gold-gradient text-navy-800 px-4 py-2 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 py-3">
                      <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400" />
                      <span className="text-navy-800 font-montserrat">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 py-3">
                      <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                      <span className="text-navy-800 font-montserrat">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 py-3">
                      <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
                      <span className="text-navy-800 font-montserrat">{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 py-3">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400" />
                      <span className="text-navy-800 font-montserrat">{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-montserrat font-medium text-navy-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-montserrat"
                  />
                ) : (
                  <p className="text-navy-800 font-montserrat py-3">{profileData.bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Membership & Achievements */}
          <div className="space-y-8">
            {/* Membership Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">
                {profileData.membershipType} Benefits
              </h3>
              <ul className="space-y-3">
                {membershipBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="text-gray-600 text-sm font-montserrat">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-playfair font-bold text-navy-800 mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                      <SafeIcon icon={achievement.icon} className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-montserrat font-medium text-navy-800 text-sm">
                        {achievement.title}
                      </p>
                      <p className="text-gray-500 text-xs font-montserrat">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;