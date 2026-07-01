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

import { MEMBERSHIP_TIERS } from './utils/membershipUtils';

function PortalApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

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

  const handleMembershipUpgrade = (newTier, billingPeriod) => {
    console.log(`Upgrading to ${newTier} (${billingPeriod})`);
    setUser(prev => ({ ...prev, membershipTier: newTier }));
    alert(`Successfully upgraded to ${newTier} membership!`);
  };

  return (
    <div className="min-h-screen bg-luxury-pearl">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Redirect deprecated portal admin routes to the unified admin */}
          <Route path="admin/*" element={<Navigate to="/admin" replace />} />

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