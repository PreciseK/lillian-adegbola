import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { getMembershipBadgeColor, getMembershipDisplayName, MEMBERSHIP_TIERS } from '../utils/membershipUtils';

const { FiStar, FiCrown, FiZap } = FiIcons;

const MembershipBadge = ({ tier, size = 'md', showText = true, className = '' }) => {
  const getIcon = (tier) => {
    switch (tier) {
      case MEMBERSHIP_TIERS.BASIC: return FiStar;
      case MEMBERSHIP_TIERS.PREMIUM: return FiCrown;
      case MEMBERSHIP_TIERS.ULTIMATE: return FiZap;
      default: return FiStar;
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs': return showText ? 'px-2 py-0.5 text-xs' : 'w-5 h-5';
      case 'sm': return showText ? 'px-2 py-1 text-xs' : 'w-6 h-6';
      case 'md': return showText ? 'px-3 py-1 text-sm' : 'w-8 h-8';
      case 'lg': return showText ? 'px-4 py-2 text-base' : 'w-10 h-10';
      default: return showText ? 'px-3 py-1 text-sm' : 'w-8 h-8';
    }
  };

  const getIconSize = (size) => {
    switch (size) {
      case 'xs': return 'w-2.5 h-2.5';
      case 'sm': return 'w-3 h-3';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-5 h-5';
      default: return 'w-4 h-4';
    }
  };

  const color = getMembershipBadgeColor(tier);
  const displayName = getMembershipDisplayName(tier);
  const IconComponent = getIcon(tier);

  if (!showText) {
    return (
      <div className={`bg-${color}-500 rounded-full flex items-center justify-center ${getSizeClasses(size)} ${className}`}>
        <SafeIcon icon={IconComponent} className={`${getIconSize(size)} text-white`} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1 bg-${color}-500 text-white rounded-full font-montserrat font-medium ${getSizeClasses(size)} ${className}`}>
      <SafeIcon icon={IconComponent} className={getIconSize(size)} />
      <span className="whitespace-nowrap">{displayName}</span>
    </div>
  );
};

export default MembershipBadge;