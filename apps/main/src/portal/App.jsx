import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Regular Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Resources from './components/Resources';
import Courses from './components/Courses';
import Shop from './components/Shop';
import Profile from './components/Profile';
import Goals from './components/Goals';
import Calendar from './components/Calendar';
import Analytics from './components/Analytics';
import Community from './components/Community';
import Settings from './components/Settings';
import Help from './components/Help';
import Login from './components/Login';
import MembershipPlans from './components/MembershipPlans';

// Admin Components
import AdminSidebar from './components/admin/AdminSidebar';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import UserManagement from './components/admin/UserManagement';
import ContentManagement from './components/admin/ContentManagement';
import OrderManagement from './components/admin/OrderManagement';
import SupportCenter from './components/admin/SupportCenter';
import AdminAnalytics from './components/admin/Analytics';
import Revenue from './components/admin/Revenue';
import SystemSettings from './components/admin/SystemSettings';
import DatabaseManagement from './components/admin/DatabaseManagement';
import AdminTools from './components/admin/AdminTools';
import CoursesManager from './components/admin/CoursesManager';
import ShopManager from './components/admin/ShopManager';
import CommunityManager from './components/admin/CommunityManager';
import TestimonialsManager from './components/admin/TestimonialsManager';

import { MEMBERSHIP_TIERS } from './utils/membershipUtils';

function PortalApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  // Check for legacy admin authentication
  React.useEffect(() => {
    try {
      const legacyAdmin = JSON.parse(localStorage.getItem('admin_user'));
      if (legacyAdmin && !isAdminLoggedIn) {
        setIsAdminLoggedIn(true);
        setAdminUser(legacyAdmin);
      }
    } catch (error) {
      console.error('Error checking legacy admin auth:', error);
    }
  }, [isAdminLoggedIn]);

  // Handle window resize for responsive sidebar
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    const userWithMembership = {
      ...userData,
      membershipTier: userData.membershipTier || MEMBERSHIP_TIERS.BASIC
    };
    setUser(userWithMembership);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleAdminLogin = (adminData) => {
    setIsAdminLoggedIn(true);
    setAdminUser(adminData);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  const handleMembershipUpgrade = (newTier, billingPeriod) => {
    console.log(`Upgrading to ${newTier} (${billingPeriod})`);
    setUser(prev => ({ ...prev, membershipTier: newTier }));
    alert(`Successfully upgraded to ${newTier} membership!`);
  };

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/portal" replace />;
  };

  const AdminProtectedRoute = ({ children }) => {
    return isAdminLoggedIn ? children : <Navigate to="/portal/admin/login" replace />;
  };

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {/* Portal App Container - no Router here, handled by Main App */}
      <AnimatePresence mode="wait">
        <Routes>
          {/* Admin Routes */}
          <Route
            path="admin/login"
            element={
              isAdminLoggedIn ?
                <Navigate to="admin" replace /> :
                <AdminLogin onLogin={handleAdminLogin} />
            }
          />

          {/* Admin Panel Routes */}
          <Route
            path="admin/*"
            element={
              <AdminProtectedRoute>
                <div className="flex">
                  <AdminSidebar
                    isCollapsed={sidebarCollapsed}
                    setIsCollapsed={setSidebarCollapsed}
                    user={adminUser}
                    onLogout={handleAdminLogout}
                  />
                  <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-12 lg:ml-20' : 'ml-0'
                    }`}>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="content" element={<ContentManagement />} />
                      <Route path="orders" element={<OrderManagement />} />
                      <Route path="support" element={<SupportCenter />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="revenue" element={<Revenue />} />
                      <Route path="system" element={<SystemSettings />} />
                      <Route path="database" element={<DatabaseManagement />} />
                      <Route path="tools" element={<AdminTools />} />
                      <Route path="courses" element={<CoursesManager />} />
                      <Route path="shop" element={<ShopManager />} />
                      <Route path="community" element={<CommunityManager />} />
                      <Route path="testimonials" element={<TestimonialsManager />} />
                    </Routes>
                  </div>
                </div>
              </AdminProtectedRoute>
            }
          />

          {/* Regular User Routes */}
          {isLoggedIn ? (
            <Route
              path="/*"
              element={
                <div className="flex min-h-screen">
                  <Sidebar
                    isCollapsed={sidebarCollapsed}
                    setIsCollapsed={setSidebarCollapsed}
                    user={user}
                    onLogout={handleLogout}
                  />
                  <div className={`flex-1 transition-all duration-300 min-w-0 ${sidebarCollapsed ? 'ml-12 lg:ml-12' : 'ml-60 lg:ml-60'
                    }`}>
                    <Routes>
                      <Route path="/" element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard user={user} />} />
                      <Route path="resources" element={<Resources isLoggedIn={isLoggedIn} membershipTier={user?.membershipTier} />} />
                      <Route path="courses" element={<Courses isLoggedIn={isLoggedIn} membershipTier={user?.membershipTier} />} />
                      <Route path="shop" element={<Shop membershipTier={user?.membershipTier} />} />
                      <Route path="profile" element={<Profile user={user} />} />
                      <Route path="membership" element={<MembershipPlans currentPlan={user?.membershipTier} onUpgrade={handleMembershipUpgrade} />} />
                      <Route path="goals" element={<Goals membershipTier={user?.membershipTier} />} />
                      <Route path="calendar" element={<Calendar membershipTier={user?.membershipTier} />} />
                      <Route path="analytics" element={<Analytics membershipTier={user?.membershipTier} />} />
                      <Route path="community" element={<Community membershipTier={user?.membershipTier} />} />
                      <Route path="settings" element={<Settings membershipTier={user?.membershipTier} />} />
                      <Route path="help" element={<Help membershipTier={user?.membershipTier} />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          ) : (
            <Route
              path="/*"
              element={
                <Routes>
                  <Route path="/" element={<Login onLogin={handleLogin} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              }
            />
          )}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default PortalApp;