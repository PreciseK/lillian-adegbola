import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';

const { FiAlertCircle } = FiIcons;

/**
 * Standard inline error banner for forms. Pass an already-friendly
 * message (see src/lib/friendlyError.js) - never render raw error.message.
 */
const InlineError = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-montserrat text-sm ${className}`}
    >
      <SafeIcon icon={FiAlertCircle} className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default InlineError;
