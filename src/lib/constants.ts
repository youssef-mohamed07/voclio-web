export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://voclio-backend.build8.dev/api';

export const API_KEY_TYPES = [
  { value: 'gemini', label: 'Gemini' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'assemblyai', label: 'AssemblyAI' },
  { value: 'google', label: 'Google' },
  { value: 'other', label: 'Other' },
] as const;

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
  INTEGRATIONS: '/admin/integrations',
  NOTIFICATIONS: '/admin/notifications',
  DOCS: '/admin/docs',
  API_EXPLORER: '/admin/api-explorer',
} as const;

export const USER_STATUS_FILTERS = [
  { value: '', label: 'All Users' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'admin', label: 'Admins' },
] as const;

export const SEVERITY_LEVELS = ['info', 'warning', 'error', 'critical'] as const;
export const ACTIVITY_TYPES = [
  'login',
  'logout',
  'api_call',
  'config_change',
  'user_update',
  'note_created',
  'task_created',
] as const;
