import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { getRemainingUsage, getFeatureLimit } from '../utils/membershipUtils';

const { FiAlertCircle, FiCheckCircle } = FiIcons;

const UsageIndicator = ({ 
  membershipTier, 
  feature, 
  currentUsage = 0, 
  className = '', 
  showWarning = true 
}) => {
  const limit = getFeatureLimit(membershipTier, feature);
  const remaining = getRemainingUsage(membershipTier, feature, currentUsage);

  if (limit === Infinity) {
    return (
      <div className={`flex items-center space-x-2 text-emerald-600 ${className}`}>
        <SafeIcon icon={FiCheckCircle} className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-montserrat">Unlimited</span>
      </div>
    );
  }

  const percentage = limit > 0 ? (currentUsage / limit) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = remaining <= 0;

  return (
    <div className={`space-y-1 sm:space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-montserrat text-gray-600">
          {currentUsage} of {limit} used
        </span>
        {showWarning && isNearLimit && (
          <div className="flex items-center space-x-1">
            <SafeIcon 
              icon={FiAlertCircle} 
              className={`w-3 h-3 sm:w-4 sm:h-4 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} 
            />
            <span className={`text-xs font-montserrat ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`}>
              {isAtLimit ? 'Limit reached' : 'Near limit'}
            </span>
          </div>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
        <div 
          className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
            isAtLimit ? 'bg-red-500' : 
            isNearLimit ? 'bg-yellow-500' : 'bg-emerald-500'
          }`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {remaining > 0 && (
        <p className="text-xs text-gray-500 font-montserrat">
          {remaining} remaining this month
        </p>
      )}
    </div>
  );
};

export default UsageIndicator;