import { ROUTES } from '@/lib/constants';

export interface DocSection {
  id: string;
  title: string;
  summary: string;
  href?: string;
  items: DocItem[];
}

export interface DocItem {
  name: string;
  description: string;
}

export const ADMIN_DOCS_INTRO = {
  title: 'Admin Panel Guide',
  subtitle:
    'Reference for every page in the Voclio admin dashboard — what it shows, what you can do, and how it connects to the mobile app and backend.',
  bullets: [
    'All pages require an admin account (is_admin = true on the backend).',
    'Data is loaded from the Voclio backend API via secure server-side proxy routes.',
    'Changes to Configuration and Feature Flags affect all mobile app users immediately after save.',
    'API Keys are stored encrypted on the backend and used for AI, transcription, and OAuth services.',
  ],
};

export const ADMIN_DOC_SECTIONS: DocSection[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    summary: 'High-level overview of platform activity at a glance.',
    href: ROUTES.DASHBOARD,
    items: [
      {
        name: 'API Requests',
        description:
          'Total API traffic for the selected period, with week-over-week change. Includes mobile and web client calls.',
      },
      {
        name: 'Active Users',
        description:
          'Users who logged in or made API calls recently. Helps track engagement trends.',
      },
      {
        name: 'Voice Recordings',
        description:
          'Count of voice notes uploaded through the mobile app and processed by the backend.',
      },
      {
        name: 'Calendar Syncs',
        description:
          'Users with an active Google Calendar connection. Also shows total OAuth sign-in users.',
      },
      {
        name: 'API Usage Chart',
        description:
          'Bar chart of daily API requests. Switch between 7, 30, or 90 days using the period selector.',
      },
      {
        name: 'Traffic Sources',
        description:
          'Breakdown of where requests come from (mobile iOS/Android, web, etc.) as percentages.',
      },
      {
        name: 'Recent Users',
        description:
          'Latest registered users with quick links to their profile page.',
      },
      {
        name: 'Recent Activity',
        description:
          'Latest audit log entries (logins, config changes, API events). Links to full Activity Logs.',
      },
    ],
  },
  {
    id: 'users',
    title: 'Users',
    summary: 'Search, create, and manage all Voclio accounts.',
    href: ROUTES.USERS,
    items: [
      {
        name: 'Search & Filters',
        description:
          'Filter by name or email, and by status: All, Active, Inactive, or Admins only.',
      },
      {
        name: 'Create User',
        description:
          'Manually add a user with email, password, name, and optional admin role.',
      },
      {
        name: 'Bulk Delete',
        description:
          'Select multiple users with checkboxes and delete them in one action.',
      },
      {
        name: 'User Row Actions',
        description:
          'Open user details, toggle admin/active status from the list, or delete a single user.',
      },
      {
        name: 'Pagination',
        description: 'Browse large user lists page by page (server-side pagination).',
      },
    ],
  },
  {
    id: 'user-details',
    title: 'User Details',
    summary: 'Deep view of a single user — profile, tasks, notes, and admin actions.',
    items: [
      {
        name: 'Overview Tab',
        description:
          'Profile info, registration date, OAuth provider (Google/Facebook/email), and usage stats (tasks, notes, voice).',
      },
      {
        name: 'Admin / Active Toggles',
        description:
          'Grant or revoke admin access. Deactivate accounts to block login without deleting data.',
      },
      {
        name: 'Reset Password',
        description:
          'Set a new password for email-based accounts (not available for pure OAuth users).',
      },
      {
        name: 'Tasks Tab',
        description:
          'View, create, and manage tasks on behalf of the user. Useful for support and debugging.',
      },
      {
        name: 'Notes Tab',
        description:
          'View, create, edit, and delete the user\'s notes from the admin panel.',
      },
      {
        name: 'Delete User',
        description:
          'Permanently removes the user and associated data. Use with caution.',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    summary: 'System-wide metrics across users, content, and AI consumption.',
    href: ROUTES.ANALYTICS,
    items: [
      {
        name: 'Overview Tab',
        description:
          'Totals: users (active, new, admins), notes, tasks (completed vs pending), reminders, voice recordings, focus sessions.',
      },
      {
        name: 'Content Tab',
        description:
          'Content creation trends — notes and tasks created per day/week, category breakdowns.',
      },
      {
        name: 'AI per User Tab',
        description:
          'Per-user AI usage: operation count, token usage, and estimated cost in USD. Helps identify heavy AI consumers.',
      },
    ],
  },
  {
    id: 'api-usage',
    title: 'API Usage',
    summary: 'Track AI operations, transcriptions, and daily usage over a date range.',
    href: ROUTES.API_USAGE,
    items: [
      {
        name: 'Date Range Filter',
        description:
          'Set start and end dates to analyze AI usage for a specific period.',
      },
      {
        name: 'AI Operations',
        description:
          'Total AI calls (summaries, task extraction, productivity suggestions, etc.).',
      },
      {
        name: 'Transcriptions',
        description:
          'Voice-to-text operations powered by AssemblyAI or configured transcription provider.',
      },
      {
        name: 'Active AI Users',
        description: 'Number of distinct users who triggered at least one AI operation in the period.',
      },
      {
        name: 'Daily Breakdown Table',
        description:
          'Per-day counts for transcriptions, task extractions, and total AI requests.',
      },
    ],
  },
  {
    id: 'api-keys',
    title: 'API Keys',
    summary: 'Manage third-party service credentials used by the backend.',
    href: ROUTES.API_KEYS,
    items: [
      {
        name: 'Key Types',
        description:
          'Gemini, OpenRouter, AssemblyAI, Google, or Other. Each type maps to a backend integration.',
      },
      {
        name: 'Create Key',
        description:
          'Add a named key with type and access token. The token is stored securely and never shown again in full.',
      },
      {
        name: 'Edit Key',
        description: 'Rename a key or enable/disable it without deleting the stored token.',
      },
      {
        name: 'Delete Key',
        description:
          'Remove a key permanently. Related features (AI, transcription) may stop working until a new key is added.',
      },
      {
        name: 'Active Status',
        description:
          'Inactive keys are ignored by the backend. Use this to rotate keys safely.',
      },
    ],
  },
  {
    id: 'logs',
    title: 'Activity Logs',
    summary: 'Audit trail of important events across the platform.',
    href: ROUTES.LOGS,
    items: [
      {
        name: 'Activity Type Filter',
        description:
          'Filter by: login, logout, api_call, config_change, user_update, note_created, task_created.',
      },
      {
        name: 'Severity Filter',
        description: 'Filter by info, warning, error, or critical severity levels.',
      },
      {
        name: 'Date Range',
        description: 'Narrow logs to a specific time window for incident investigation.',
      },
      {
        name: 'Log Entry Details',
        description:
          'Each row shows user (if any), action description, IP address, timestamp, and severity badge.',
      },
      {
        name: 'Use Cases',
        description:
          'Debug failed logins, track who changed configuration, monitor suspicious API activity.',
      },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations & Features',
    summary: 'OAuth stats, connected services, calendar syncs, and mobile feature flags.',
    href: ROUTES.INTEGRATIONS,
    items: [
      {
        name: 'OAuth Breakdown',
        description:
          'Counts of users signed in via Google, Facebook, Webex, or email/password.',
      },
      {
        name: 'Services Status',
        description:
          'Live status of Database, Redis, Email, Storage (Cloudinary/S3), and AI providers.',
      },
      {
        name: 'Feature Flags',
        description:
          'Toggle mobile features globally: Voice Recording, Google Calendar, Home Widgets, AI Suggestions, Onboarding, etc. Saved to backend config.',
      },
      {
        name: 'Calendar Sync Table',
        description:
          'Lists users with Google Calendar connected — calendar name, sync status, last sync time, and errors.',
      },
      {
        name: 'Voice & Focus Stats',
        description:
          'Platform-wide voice recording count and focus session metrics from the productivity module.',
      },
    ],
  },
  {
    id: 'system',
    title: 'System',
    summary: 'Server health monitoring and database maintenance.',
    href: ROUTES.SYSTEM,
    items: [
      {
        name: 'Operational Status',
        description: 'Overall server status and database health indicator.',
      },
      {
        name: 'Uptime & Sessions',
        description:
          'How long the backend has been running and how many active user sessions exist.',
      },
      {
        name: 'Connected Services',
        description:
          'Quick health check for Redis, Email, Storage, Gemini, OpenRouter, AssemblyAI, Google OAuth, Webex.',
      },
      {
        name: 'Memory Usage',
        description:
          'Node.js process memory: RSS, heap total/used, and external memory.',
      },
      {
        name: 'Clear Old Data',
        description:
          'Maintenance action: deletes expired sessions and old read notifications older than N days (default 90).',
      },
    ],
  },
  {
    id: 'config',
    title: 'Configuration',
    summary: 'Application-wide settings stored in the backend database.',
    href: ROUTES.CONFIG,
    items: [
      {
        name: 'General',
        description:
          'App name, default language, support email, allow signups toggle, maintenance mode.',
      },
      {
        name: 'Features & Integrations',
        description:
          'Same feature toggles as Integrations page — voice, calendar, widgets, AI suggestions, onboarding.',
      },
      {
        name: 'Security & Limits',
        description:
          'Rate limiting, max requests per minute, session timeout, max upload file size.',
      },
      {
        name: 'Save / Reset',
        description:
          'Save only sends changed keys. Reset reverts unsaved edits on the current page.',
      },
      {
        name: 'Maintenance Mode',
        description:
          'When enabled, the mobile app and API may reject non-admin requests (depends on backend implementation).',
      },
    ],
  },
  {
    id: 'api-explorer',
    title: 'API Explorer',
    summary: 'Built-in Postman alternative to test all Voclio API endpoints.',
    href: ROUTES.API_EXPLORER,
    items: [
      {
        name: 'Environment Switch',
        description:
          'Toggle between Development (localhost) and Production (voclio-backend.build8.dev). URLs are configurable via NEXT_PUBLIC_API_URL_DEV and NEXT_PUBLIC_API_URL_PROD.',
      },
      {
        name: 'Endpoint Catalog',
        description:
          '114 endpoints auto-imported from the backend Postman collection, grouped by module (Auth, Tasks, Admin, Calendar, etc.).',
      },
      {
        name: 'Request Builder',
        description:
          'Change HTTP method, edit path (replace :id placeholders), add query params, and edit JSON body before sending.',
      },
      {
        name: 'Admin Auth',
        description:
          'When enabled, attaches your current admin session JWT automatically. Disable to test public endpoints like /auth/login.',
      },
      {
        name: 'Response Viewer',
        description:
          'Shows status code, response time in ms, full request URL, and formatted JSON response.',
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile App Connection',
    summary: 'How admin settings affect the Voclio Flutter mobile app.',
    items: [
      {
        name: 'Authentication',
        description:
          'Users sign in via email/password, Google, or Facebook. Admin users use the same accounts with is_admin flag for web panel access.',
      },
      {
        name: 'Tasks & Notes',
        description:
          'Created and synced via API. Admins can view and manage them from User Details.',
      },
      {
        name: 'Voice Recording',
        description:
          'Requires voice_recording_enabled flag and a valid AssemblyAI (or configured) API key. Audio is uploaded to Cloudinary/storage.',
      },
      {
        name: 'Google Calendar',
        description:
          'Requires google_calendar_enabled flag and Google OAuth credentials on the backend. Users connect via OAuth deep link (voclio://oauth/callback).',
      },
      {
        name: 'AI Suggestions',
        description:
          'Productivity tips powered by OpenRouter/Gemini. Controlled by ai_suggestions_enabled and API keys.',
      },
      {
        name: 'Reminders & Notifications',
        description:
          'Push/in-app notifications generated by the backend. Old read notifications can be purged from System → Clear Old Data.',
      },
    ],
  },
];
