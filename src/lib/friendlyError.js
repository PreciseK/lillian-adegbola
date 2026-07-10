/**
 * Translates a raw error (Supabase/PostgREST/Postgres error object, plain
 * JS Error, or string) into a short, human-readable message safe to show
 * to end users. Falls back to a generic message rather than ever
 * surfacing raw SQL/constraint text.
 *
 * @param {unknown} error
 * @param {string} [fallback] - shown when no specific mapping applies
 * @returns {string}
 */
export const friendlyError = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;

  const code = error?.code;
  const rawMessage = typeof error === 'string' ? error : error?.message || '';
  const message = rawMessage.toLowerCase();

  // Postgres error codes (RLS, constraints) - see https://www.postgresql.org/docs/current/errcodes-appendix.html
  switch (code) {
    case '23505': // unique_violation
      return 'That already exists. Please use a different value.';
    case '23503': // foreign_key_violation
      return "This item is linked to other data, so that action can't be completed right now.";
    case '23502': // not_null_violation
      return 'Please fill in all required fields.';
    case '42501': // insufficient_privilege / RLS violation
      return "You don't have permission to do that.";
    case 'PGRST116':
      return "We couldn't find that. It may have been removed.";
    default:
      break;
  }

  // Supabase Auth error text
  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }
  if (message.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }
  if (message.includes('user already registered')) {
    return 'An account with that email already exists.';
  }
  if (message.includes('password should be at least')) {
    return 'Password is too short. Please choose a longer password.';
  }

  // Supabase Storage errors
  if (message.includes('exceeded the maximum allowed size')) {
    return 'That file is too large. Please upload an image under 15MB.';
  }

  // Network failures (fetch/DNS/offline)
  if (message.includes('failed to fetch') || message.includes('networkerror') || message.includes('network request failed')) {
    return "Network error. Please check your connection and try again.";
  }

  // Row level security phrased without a code (rare, but seen from PostgREST)
  if (message.includes('row-level security') || message.includes('permission denied')) {
    return "You don't have permission to do that.";
  }

  return fallback;
};

export default friendlyError;
