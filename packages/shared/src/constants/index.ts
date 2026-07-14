export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const THROTTLE_LIMITS = {
  DEFAULT: { ttl: 60000, limit: 100 },
  AUTH: { ttl: 60000, limit: 10 },
  UPLOAD: { ttl: 60000, limit: 20 },
} as const;

export const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
} as const;
