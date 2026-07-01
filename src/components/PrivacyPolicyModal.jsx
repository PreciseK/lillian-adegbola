import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiShield, FiLock, FiMail, FiDatabase, FiEye, FiSettings } = FiIcons;

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-navy-800 text-white p-6 rounded-t-3xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl" />
            </button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                <SafeIcon icon={FiShield} className="text-navy-900 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-playfair font-bold">Privacy Policy</h2>
                <p className="text-gray-300 font-montserrat">How we protect and use your information</p>
              </div>
            </div>
            <p className="text-gray-200 text-sm font-montserrat">
              Last updated: January 17, 2025
            </p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="prose prose-lg max-w-none">

              {/* Introduction */}
              <section className="mb-8">
                <div className="bg-luxury-pearl p-6 rounded-xl mb-6">
                  <h3 className="text-xl font-playfair font-bold text-navy-800 mb-3 flex items-center">
                    <SafeIcon icon={FiEye} className="mr-2 text-gold-600" />
                    Our Commitment to Your Privacy
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed">
                    At Lillian Adegbola Coaching, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our website and services.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4 flex items-center">
                  <SafeIcon icon={FiDatabase} className="mr-2 text-gold-600" />
                  Information We Collect
                </h3>

                <div className="space-y-4">
                  <div className="bg-white border border-gold-400/20 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Personal Information</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Name and contact information (email, phone number)</li>
                      <li>• Company or organization details</li>
                      <li>• Professional background and goals</li>
                      <li>• Communication preferences</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gold-400/20 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Automatically Collected Information</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Website usage data and analytics</li>
                      <li>• Device information and browser type</li>
                      <li>• IP address and location data</li>
                      <li>• Cookies and similar tracking technologies</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gold-400/20 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Service-Related Information</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Booking and appointment details</li>
                      <li>• Session notes and progress tracking (with consent)</li>
                      <li>• Payment and billing information</li>
                      <li>• Feedback and testimonials (with permission)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4 flex items-center">
                  <SafeIcon icon={FiSettings} className="mr-2 text-gold-600" />
                  How We Use Your Information
                </h3>

                <div className="bg-blue-50 rounded-xl p-6 mb-4">
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3">Service Delivery</h4>
                  <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                    <li>• Providing coaching and consulting services</li>
                    <li>• Scheduling appointments and managing bookings</li>
                    <li>• Communicating about services and programs</li>
                    <li>• Customizing services to meet your needs</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-xl p-6 mb-4">
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3">Communication</h4>
                  <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                    <li>• Responding to inquiries and requests</li>
                    <li>• Sending newsletters and updates (with consent)</li>
                    <li>• Providing customer support</li>
                    <li>• Following up on services and programs</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3">Improvement and Analytics</h4>
                  <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                    <li>• Analyzing website usage to improve user experience</li>
                    <li>• Developing new services and resources</li>
                    <li>• Measuring the effectiveness of our programs</li>
                    <li>• Conducting research to enhance our offerings</li>
                  </ul>
                </div>
              </section>

              {/* Data Protection */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4 flex items-center">
                  <SafeIcon icon={FiLock} className="mr-2 text-gold-600" />
                  How We Protect Your Data
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Technical Safeguards</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• SSL encryption for data transmission</li>
                      <li>• Secure cloud storage systems</li>
                      <li>• Regular security audits and updates</li>
                      <li>• Access controls and authentication</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Operational Safeguards</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Limited access to personal information</li>
                      <li>• Staff training on privacy practices</li>
                      <li>• Confidentiality agreements</li>
                      <li>• Regular privacy impact assessments</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Your Privacy Rights</h3>

                <div className="bg-gold-50 rounded-xl p-6">
                  <p className="text-gray-700 font-montserrat mb-4">You have the following rights regarding your personal information:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                      <li>• <strong>Access:</strong> Request copies of your personal data</li>
                      <li>• <strong>Correction:</strong> Request correction of inaccurate information</li>
                      <li>• <strong>Deletion:</strong> Request deletion of your personal data</li>
                      <li>• <strong>Portability:</strong> Request transfer of your data</li>
                    </ul>
                    <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                      <li>• <strong>Restriction:</strong> Request limitation of processing</li>
                      <li>• <strong>Objection:</strong> Object to certain uses of your data</li>
                      <li>• <strong>Consent Withdrawal:</strong> Withdraw consent at any time</li>
                      <li>• <strong>Complaint:</strong> File complaints with regulatory authorities</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Third-Party Services */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Third-Party Services</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-gold-400 pl-4">
                    <p className="text-gray-700 font-montserrat text-sm"><strong>Supabase:</strong> Database and authentication services</p>
                  </div>
                  <div className="border-l-4 border-gold-400 pl-4">
                    <p className="text-gray-700 font-montserrat text-sm"><strong>Google Fonts:</strong> Typography services</p>
                  </div>
                  <div className="border-l-4 border-gold-400 pl-4">
                    <p className="text-gray-700 font-montserrat text-sm"><strong>Unsplash:</strong> Stock photography services</p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4 flex items-center">
                  <SafeIcon icon={FiMail} className="mr-2 text-gold-600" />
                  Contact Us About Privacy
                </h3>
                <div className="bg-navy-50 rounded-xl p-6">
                  <p className="text-gray-700 font-montserrat mb-4">
                    If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-navy-800 font-montserrat"><strong>Email:</strong> clarityqueen23@gmail.com</p>
                    <p className="text-navy-800 font-montserrat"><strong>Phone:</strong> +234 802 320 0539</p>
                    <p className="text-navy-800 font-montserrat"><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
                  </div>
                </div>
              </section>

              {/* Updates */}
              <section className="mb-6">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Policy Updates</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-gray-700 font-montserrat text-sm">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 rounded-b-3xl">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-montserrat text-sm">
                Your privacy is important to us
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-navy-800 text-white px-6 py-2 rounded-full font-montserrat font-semibold"
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;