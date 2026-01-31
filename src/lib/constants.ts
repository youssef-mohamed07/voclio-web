// Use the Next.js proxy route to avoid CORS issues
export const API_BASE_URL = '/api/proxy';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  ANALYTICS: '/admin/analytics',
  API_USAGE: '/admin/api-usage',
  API_KEYS: '/admin/api-keys',
  LOGS: '/admin/logs',
  SYSTEM: '/admin/system',
  CONFIG: '/admin/config',
} as const;

export const SUBSCRIPTION_TIERS = ['free', 'basic', 'pro', 'enterprise'] as const;
export const SEVERITY_LEVELS = ['info', 'warning', 'error', 'critical'] as const;
export const ACTIVITY_TYPES = ['login', 'logout', 'api_call', 'config_change', 'user_update'] as const;
