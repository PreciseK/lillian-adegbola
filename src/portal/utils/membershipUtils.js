// Membership utility functions
export const MEMBERSHIP_TIERS = {
  BASIC: 'basic',
  PREMIUM: 'premium', 
  ULTIMATE: 'ultimate'
};

export const MEMBERSHIP_FEATURES = {
  [MEMBERSHIP_TIERS.BASIC]: {
    resources: { limit: 5, unlimited: false },
    courses: { limit: 1, unlimited: false },
    downloads: { limit: 10, unlimited: false },
    goals: { limit: 3, unlimited: false },
    analytics: false,
    calendar: false,
    liveEvents: false,
    privateCoaching: false,
    prioritySupport: false,
    certificates: false
  },
  [MEMBERSHIP_TIERS.PREMIUM]: {
    resources: { limit: null, unlimited: true },
    courses: { limit: null, unlimited: true },
    downloads: { limit: null, unlimited: true },
    goals: { limit: null, unlimited: true },
    analytics: true,
    calendar: true,
    liveEvents: true,
    privateCoaching: false,
    prioritySupport: true,
    certificates: true
  },
  [MEMBERSHIP_TIERS.ULTIMATE]: {
    resources: { limit: null, unlimited: true },
    courses: { limit: null, unlimited: true },
    downloads: { limit: null, unlimited: true },
    goals: { limit: null, unlimited: true },
    analytics: true,
    calendar: true,
    liveEvents: true,
    privateCoaching: true,
    prioritySupport: true,
    certificates: true
  }
};

export const hasFeatureAccess = (membershipTier, feature) => {
  const tierFeatures = MEMBERSHIP_FEATURES[membershipTier];
  return tierFeatures ? tierFeatures[feature] : false;
};

export const getFeatureLimit = (membershipTier, feature) => {
  const tierFeatures = MEMBERSHIP_FEATURES[membershipTier];
  if (!tierFeatures || !tierFeatures[feature]) return 0;
  
  if (typeof tierFeatures[feature] === 'boolean') {
    return tierFeatures[feature] ? Infinity : 0;
  }
  
  if (tierFeatures[feature].unlimited) return Infinity;
  return tierFeatures[feature].limit || 0;
};

export const canAccessResource = (membershipTier, resourceType = 'general') => {
  if (membershipTier === MEMBERSHIP_TIERS.ULTIMATE) return true;
  if (membershipTier === MEMBERSHIP_TIERS.PREMIUM) return resourceType !== 'ultimate-exclusive';
  if (membershipTier === MEMBERSHIP_TIERS.BASIC) return resourceType === 'free';
  return false;
};

export const canAccessCourse = (membershipTier, courseType = 'free') => {
  if (membershipTier === MEMBERSHIP_TIERS.ULTIMATE) return true;
  if (membershipTier === MEMBERSHIP_TIERS.PREMIUM) return courseType !== 'ultimate-exclusive';
  if (membershipTier === MEMBERSHIP_TIERS.BASIC) return courseType === 'free';
  return false;
};

export const getRemainingUsage = (membershipTier, feature, currentUsage = 0) => {
  const limit = getFeatureLimit(membershipTier, feature);
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentUsage);
};

export const getMembershipBadgeColor = (tier) => {
  switch (tier) {
    case MEMBERSHIP_TIERS.BASIC: return 'blue';
    case MEMBERSHIP_TIERS.PREMIUM: return 'gold';
    case MEMBERSHIP_TIERS.ULTIMATE: return 'purple';
    default: return 'gray';
  }
};

export const getMembershipDisplayName = (tier) => {
  switch (tier) {
    case MEMBERSHIP_TIERS.BASIC: return 'Basic';
    case MEMBERSHIP_TIERS.PREMIUM: return 'Premium';
    case MEMBERSHIP_TIERS.ULTIMATE: return 'Ultimate';
    default: return 'Unknown';
  }
};

// Usage tracking utilities
export class UsageTracker {
  constructor(membershipTier) {
    this.membershipTier = membershipTier;
    this.usage = this.loadUsage();
  }

  loadUsage() {
    const saved = localStorage.getItem(`usage_${this.membershipTier}`);
    return saved ? JSON.parse(saved) : {
      resources: 0,
      downloads: 0,
      goals: 0,
      lastReset: new Date().toISOString()
    };
  }

  saveUsage() {
    localStorage.setItem(`usage_${this.membershipTier}`, JSON.stringify(this.usage));
  }

  canUseFeature(feature) {
    const limit = getFeatureLimit(this.membershipTier, feature);
    if (limit === Infinity) return true;
    return this.usage[feature] < limit;
  }

  useFeature(feature) {
    if (!this.canUseFeature(feature)) {
      throw new Error(`${feature} limit exceeded for ${this.membershipTier} membership`);
    }
    this.usage[feature] = (this.usage[feature] || 0) + 1;
    this.saveUsage();
  }

  getRemainingUses(feature) {
    return getRemainingUsage(this.membershipTier, feature, this.usage[feature] || 0);
  }

  resetMonthlyUsage() {
    const now = new Date();
    const lastReset = new Date(this.usage.lastReset);
    
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      this.usage = {
        resources: 0,
        downloads: 0,
        goals: this.usage.goals, // Goals don't reset monthly
        lastReset: now.toISOString()
      };
      this.saveUsage();
    }
  }
}