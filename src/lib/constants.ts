export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  API_USAGE: '/admin/api-usage',
  API_KEYS: '/admin/api-keys',
  LOGS: '/admin/logs',
  CONFIG: '/admin/config',
} as const;

export const SUBSCRIPTION_TIERS = ['free', 'basic', 'pro', 'enterprise'] as const;
export const SEVERITY_LEVELS = ['info', 'warning', 'error', 'critical'] as const;
export const ACTIVITY_TYPES = ['login', 'logout', 'api_call', 'config_change', 'user_update'] as const;
