import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import supabase from './lib/supabase';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import VideoShowcase from './components/VideoShowcase';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Blog from './components/Blog';
import BlogPage from './components/BlogPage';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import SEOHead from './components/SEOHead';
import { initializeSettings } from './lib/initializeSettings';
import PortalApp from './portal/App';
import Maintenance from './components/Maintenance';
import { useSettings } from './hooks/useSettings';
import './App.css';

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const { settings, loading } = useSettings(['maintenance_mode']);
  const isAdminPath = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-pearl flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  const isMaintenanceMode = settings.maintenance_mode === true;

  if (isMaintenanceMode && !isAdminPath) {
    return <Maintenance />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Portal Route */}
        <Route path="/portal/*" element={<PortalApp />} />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminRoute />} />

        {/* Main Website Routes */}
        <Route path="/*" element={
          <div className="min-h-screen bg-luxury-pearl">
            <SEOHead pageType="home" />
            <Navbar />
            <Routes>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Hero />
                  <About />
                  <Services />
                  <VideoShowcase />
                  <Gallery />
                  <Testimonials />
                  <Blog />
                  <Contact />
                </motion.div>
              } />
              <Route path="/blog" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <SEOHead
                    pageType="blog"
                    pageData={{
                      title: 'Leadership Insights & Transformation Stories - Lillian Adegbola',
                      description: 'Discover powerful leadership strategies, transformation stories, and actionable insights from Lillian Adegbola. Expert coaching tips and business growth advice.',
                      canonical_url: `${window.location.origin}/blog`
                    }}
                  />
                  <BlogPage />
                </motion.div>
              } />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </>
  );
}

function App() {
  useEffect(() => {
    // Initialize settings when app loads
    initializeSettings().then((success) => {
      if (success) {
        console.log('🎉 Website settings ready!');
      } else {
        console.log('⚠️ Using fallback settings');
      }
    });
  }, []);

  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      <AppContent />
    </Router>
  );
}

export default App;