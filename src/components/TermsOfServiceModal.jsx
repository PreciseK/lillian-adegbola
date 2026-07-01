import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiFileText, FiScale, FiMail, FiAlertTriangle, FiCheck, FiUsers } = FiIcons;

const TermsOfServiceModal = ({ isOpen, onClose }) => {
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
                <SafeIcon icon={FiFileText} className="text-navy-900 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-playfair font-bold">Terms of Service</h2>
                <p className="text-gray-300 font-montserrat">Terms and conditions for using our services</p>
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
                    <SafeIcon icon={FiScale} className="mr-2 text-gold-600" />
                    Agreement to Terms
                  </h3>
                  <p className="text-gray-700 font-montserrat leading-relaxed">
                    By accessing and using the services provided by Lillian Adegbola Coaching, you agree to be bound by these Terms of Service. Please read them carefully before using our website or engaging our services.
                  </p>
                </div>
              </section>

              {/* Services */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4 flex items-center">
                  <SafeIcon icon={FiUsers} className="mr-2 text-gold-600" />
                  Our Services
                </h3>

                <div className="space-y-4">
                  <div className="bg-white border border-gold-400/20 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Coaching Services</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Leadership and executive coaching</li>
                      <li>• Business and life coaching</li>
                      <li>• Strategic advisory services</li>
                      <li>• Group coaching and workshops</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gold-400/20 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Speaking Services</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Keynote presentations</li>
                      <li>• Corporate training and workshops</li>
                      <li>• Conference and event speaking</li>
                      <li>• Retreat leadership and facilitation</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gold-400/20 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Digital Services</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Online courses and programs</li>
                      <li>• Virtual coaching sessions</li>
                      <li>• Digital resources and tools</li>
                      <li>• Newsletter and content subscriptions</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Client Responsibilities */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Client Responsibilities</h3>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3">Your Commitments</h4>
                  <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                    <li>• <strong>Honesty:</strong> Provide accurate information about your goals and circumstances</li>
                    <li>• <strong>Participation:</strong> Actively engage in the coaching process</li>
                    <li>• <strong>Confidentiality:</strong> Respect the confidentiality of group sessions</li>
                    <li>• <strong>Payment:</strong> Make payments according to agreed terms</li>
                    <li>• <strong>Respect:</strong> Treat all participants and staff with respect</li>
                    <li>• <strong>Responsibility:</strong> Take responsibility for implementing insights and actions</li>
                  </ul>
                </div>
              </section>

              {/* Booking and Cancellation */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Booking and Cancellation Policy</h3>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2 flex items-center">
                      <SafeIcon icon={FiCheck} className="mr-2 text-green-600" />
                      Booking Confirmation
                    </h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Bookings are confirmed upon receipt of payment</li>
                      <li>• You will receive email confirmation with session details</li>
                      <li>• Calendar invitations will be sent for scheduled sessions</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2 flex items-center">
                      <SafeIcon icon={FiAlertTriangle} className="mr-2 text-orange-600" />
                      Cancellation Policy
                    </h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• <strong>24-hour notice:</strong> Full refund for cancellations with 24+ hours notice</li>
                      <li>• <strong>Less than 24 hours:</strong> 50% refund for cancellations with less than 24 hours notice</li>
                      <li>• <strong>No-shows:</strong> No refund for missed appointments without notice</li>
                      <li>• <strong>Rescheduling:</strong> Free rescheduling with 24+ hours notice</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Professional Standards and Limitations</h3>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3">Important Disclaimers</h4>
                  <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                    <li>• <strong>Not Therapy:</strong> Coaching services are not a substitute for professional medical or psychological treatment</li>
                    <li>• <strong>Individual Results:</strong> Results may vary and are not guaranteed</li>
                    <li>• <strong>Professional Judgment:</strong> We reserve the right to refer clients to appropriate professionals when needed</li>
                    <li>• <strong>Confidentiality Limits:</strong> We may be required to break confidentiality if there is risk of harm</li>
                    <li>• <strong>Business Advice:</strong> Coaching insights are for personal development, not specific business or financial advice</li>
                  </ul>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Intellectual Property</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Our Content</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• Website content and materials are protected by copyright</li>
                      <li>• Coaching methodologies and frameworks are proprietary</li>
                      <li>• You may not reproduce content without permission</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Your Content</h4>
                    <ul className="text-gray-700 font-montserrat space-y-1 text-sm">
                      <li>• You retain ownership of content you provide</li>
                      <li>• You grant us license to use testimonials and feedback</li>
                      <li>• We will request permission before sharing your stories</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Service Termination</h3>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <p className="text-gray-700 font-montserrat mb-4">
                    Either party may terminate the coaching relationship at any time with appropriate notice:
                  </p>
                  <ul className="text-gray-700 font-montserrat space-y-2 text-sm">
                    <li>• <strong>Client Termination:</strong> You may end services at any time with 48 hours notice</li>
                    <li>• <strong>Coach Termination:</strong> We may end services if the relationship is no longer beneficial</li>
                    <li>• <strong>Refund Policy:</strong> Unused sessions may be refunded based on individual agreements</li>
                    <li>• <strong>Transition Support:</strong> We will provide referrals to other professionals when appropriate</li>
                  </ul>
                </div>
              </section>

              {/* Dispute Resolution */}
              <section className="mb-8">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4">Dispute Resolution</h3>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">First Step: Direct Communication</h4>
                    <p className="text-gray-700 font-montserrat text-sm">
                      We encourage open communication to resolve any concerns. Please contact us directly to discuss any issues.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Mediation</h4>
                    <p className="text-gray-700 font-montserrat text-sm">
                      If direct communication doesn't resolve the issue, we agree to participate in mediation through a mutually agreed-upon mediator.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-montserrat font-semibold text-navy-800 mb-2">Governing Law</h4>
                    <p className="text-gray-700 font-montserrat text-sm">
                      These terms are governed by the laws of the jurisdiction where services are provided, without regard to conflict of law principles.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-6">
                <h3 className="text-xl font-playfair font-bold text-navy-800 mb-4 flex items-center">
                  <SafeIcon icon={FiMail} className="mr-2 text-gold-600" />
                  Questions About These Terms
                </h3>
                <div className="bg-navy-50 rounded-xl p-6">
                  <p className="text-gray-700 font-montserrat mb-4">
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-navy-800 font-montserrat"><strong>Email:</strong> clarityqueen23@gmail.com</p>
                    <p className="text-navy-800 font-montserrat"><strong>Phone:</strong> +234 802 320 0539</p>
                    <p className="text-navy-800 font-montserrat"><strong>Business Address:</strong> The Penthouse 26b Abia Street Banana Island Ikoyi</p>
                  </div>
                </div>
              </section>

              {/* Acceptance */}
              <section className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="font-montserrat font-semibold text-navy-800 mb-3 flex items-center">
                    <SafeIcon icon={FiCheck} className="mr-2 text-green-600" />
                    By Using Our Services
                  </h4>
                  <p className="text-gray-700 font-montserrat text-sm">
                    By accessing our website, booking consultations, or engaging our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 rounded-b-3xl">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-montserrat text-sm">
                Thank you for choosing our services
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

export default TermsOfServiceModal;