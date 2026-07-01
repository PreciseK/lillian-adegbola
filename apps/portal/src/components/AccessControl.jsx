import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import MembershipBadge from './MembershipBadge';
import { hasFeatureAccess, getMembershipDisplayName, MEMBERSHIP_TIERS } from '../utils/membershipUtils';

const { FiLock, FiArrowRight, FiStar } = FiIcons;

const AccessControl = ({ 
  membershipTier, 
  requiredTier, 
  feature, 
  children, 
  fallbackComponent,
  showUpgradePrompt = true 
}) => {
  const hasAccess = hasFeatureAccess(membershipTier, feature) || 
                   (requiredTier && (
                     (requiredTier === MEMBERSHIP_TIERS.BASIC) ||
                     (requiredTier === MEMBERSHIP_TIERS.PREMIUM && membershipTier !== MEMBERSHIP_TIERS.BASIC) ||
                     (requiredTier === MEMBERSHIP_TIERS.ULTIMATE && membershipTier === MEMBERSHIP_TIERS.ULTIMATE)
                   ));

  if (hasAccess) {
    return children;
  }

  if (fallbackComponent) {
    return fallbackComponent;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const getRequiredTierForFeature = () => {
    if (requiredTier) return requiredTier;
    // Default feature requirements
    const featureRequirements = {
      analytics: MEMBERSHIP_TIERS.PREMIUM,
      calendar: MEMBERSHIP_TIERS.PREMIUM,
      liveEvents: MEMBERSHIP_TIERS.PREMIUM,
      privateCoaching: MEMBERSHIP_TIERS.ULTIMATE,
      prioritySupport: MEMBERSHIP_TIERS.PREMIUM,
      certificates: MEMBERSHIP_TIERS.PREMIUM
    };
    return featureRequirements[feature] || MEMBERSHIP_TIERS.PREMIUM;
  };

  const targetTier = getRequiredTierForFeature();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-sm border-2 border-dashed border-gray-300 text-center"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <SafeIcon icon={FiLock} className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-playfair font-bold text-navy-800 mb-2">
        {feature ? `${feature.charAt(0).toUpperCase() + feature.slice(1)} Access Required` : 'Upgrade Required'}
      </h3>
      
      <p className="text-gray-600 font-montserrat mb-6">
        This feature is available for {getMembershipDisplayName(targetTier)} members and above.
        Upgrade your membership to unlock this and many more features.
      </p>

      <div className="flex items-center justify-center space-x-3 mb-6">
        <span className="text-sm font-montserrat text-gray-500">Current:</span>
        <MembershipBadge tier={membershipTier} size="sm" />
        <SafeIcon icon={FiArrowRight} className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-montserrat text-gray-500">Required:</span>
        <MembershipBadge tier={targetTier} size="sm" />
      </div>

      <button className="bg-gold-gradient text-navy-800 px-6 py-3 rounded-lg font-montserrat font-medium hover:shadow-lg transition-all duration-300 flex items-center mx-auto">
        <SafeIcon icon={FiStar} className="w-4 h-4 mr-2" />
        Upgrade to {getMembershipDisplayName(targetTier)}
      </button>
    </motion.div>
  );
};

export default AccessControl;