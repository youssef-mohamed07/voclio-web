export type ApiEnvironmentId = 'development' | 'production';

export interface ApiEnvironment {
  id: ApiEnvironmentId;
  label: string;
  baseUrl: string;
}

/** Public base URLs for the in-panel API explorer (browser-safe). */
export const API_ENVIRONMENTS: ApiEnvironment[] = [
  {
    id: 'development',
    label: 'Development',
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL_DEV ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3000/api',
  },
  {
    id: 'production',
    label: 'Production',
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL_PROD || 'https://voclio-backend.build8.dev/api',
  },
];

export function getServerApiBaseUrl(environment: ApiEnvironmentId): string {
  if (environment === 'production') {
    return (
      process.env.API_URL_PROD ||
      process.env.NEXT_PUBLIC_API_URL_PROD ||
      'https://voclio-backend.build8.dev/api'
    );
  }

  return (
    process.env.API_URL_DEV ||
    process.env.NEXT_PUBLIC_API_URL_DEV ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:3000/api'
  );
}

const ALLOWED_PREFIXES = [
  '/auth',
  '/admin',
  '/notes',
  '/tasks',
  '/voice',
  '/tags',
  '/reminders',
  '/notifications',
  '/settings',
  '/productivity',
  '/calendar',
  '/dashboard',
  '/categories',
  '/queue',
  '/health',
  '/',
] as const;

export function isAllowedApiPath(path: string): boolean {
  if (!path.startsWith('/') || path.includes('..') || path.includes('://')) {
    return false;
  }

  if (path === '/health' || path === '/') return true;

  return ALLOWED_PREFIXES.some(
    (prefix) => prefix !== '/' && (path === prefix || path.startsWith(`${prefix}/`))
  );
}
