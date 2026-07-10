import toast from 'react-hot-toast';

const baseStyle = {
  borderRadius: '12px',
  background: '#032B44',
  color: '#fff',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '14px',
  padding: '12px 16px'
};

/**
 * Themed toast helpers. Always pass a friendly message
 * (see src/lib/friendlyError.js) to showToast.error - never raw error.message.
 */
export const showToast = {
  success: (message) =>
    toast.success(message, {
      style: baseStyle,
      iconTheme: { primary: '#DAA520', secondary: '#032B44' }
    }),
  error: (message) =>
    toast.error(message, {
      style: baseStyle,
      iconTheme: { primary: '#EF4444', secondary: '#fff' }
    }),
  info: (message) => toast(message, { style: baseStyle })
};

export default showToast;
