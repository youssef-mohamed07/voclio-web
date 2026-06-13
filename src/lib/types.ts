export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  is_active: boolean;
  is_admin?: boolean;
  phone_number?: string;
  email_verified?: boolean;
  oauth_provider?: string | null;
  created_at: string;
  updated_at: string;
  last_login?: string;
  api_calls_count?: number;
  tasks_count?: number;
  notes_count?: number;
  tasks?: Task[];
  notes?: Note[];
  statistics?: Record<string, number>;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
  completed_at?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiUsage {
  total_requests: number;
  total_errors: number;
  success_rate: number;
  breakdown: ApiUsageBreakdown[];
  totals?: {
    total_transcriptions: number;
    total_task_extractions: number;
    total_note_extractions: number;
    total_summarizations: number;
    active_ai_users: number;
    total_ai_operations: number;
  };
  token_estimate?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    estimated_cost_usd: string;
  };
  daily_stats?: Array<{
    date: string;
    transcriptions: number;
    task_extractions: number;
    total_ai_requests: number;
  }>;
}

export interface ApiUsageBreakdown {
  api_type: string;
  date: string;
  requests: number;
  errors: number;
  transcriptions?: number;
  task_extractions?: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  api_type?: string;
  provider?: string;
  is_active: boolean;
  created_at: string;
  last_used?: string;
  permissions: string[];
  rate_limit?: number;
}

export interface Log {
  id: string;
  activity_type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface AppConfig {
  id: string;
  key: string;
  value: string | boolean | number;
  type: 'string' | 'boolean' | 'number';
  description: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface AdminProfile {
  user: {
    user_id: number;
    email: string;
    name: string;
    is_admin: boolean;
    is_active: boolean;
  };
  role: string;
}

export interface AdminNotification {
  id: number;
  title: string;
  description: string;
  severity: string;
  type: string;
  created_at: string;
  is_read: boolean;
  user?: { id: number; email: string; name: string } | null;
}

export interface DashboardStats {
  total_users: { value: number; change_percent: number };
  active_users: { value: number; change_percent: number };
  total_tasks: { value: number; change_percent: number };
  api_requests: { value: number; change_percent: number };
  content_this_month: { value: number; change_percent: number };
  voice_recordings?: { value: number; change_percent: number };
  calendar_connections?: { value: number; change_percent: number };
  oauth_integrations?: { value: number; change_percent: number };
}

export interface UsageChart {
  period: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[] }>;
  data: Array<{ date: string; users: number; api_requests: number; tasks: number }>;
}

export interface TrafficSources {
  sources: Array<{ name: string; value: number; percent: number }>;
  total_users: number;
}

export interface SystemHealth {
  status: string;
  database: string;
  uptime: number;
  memory_usage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  active_sessions: number;
  unread_notifications: number;
  timestamp: string;
  services?: {
    database?: string;
    redis: { enabled: boolean; connected: boolean; healthy?: boolean; host: string | null };
    storage: { provider: string; configured: boolean; bucket: string };
    email: { provider: string; configured: boolean };
    ai: { gemini: boolean; openrouter: boolean; assemblyai: boolean };
    oauth: { google: boolean; facebook: boolean; webex: boolean };
  };
}

export interface IntegrationsOverview {
  oauth: {
    total: number;
    google: number;
    facebook: number;
    webex: number;
    email_signup: number;
    total_users: number;
  };
  voice: { total_recordings: number; transcriptions_this_week: number };
  focus: { total_sessions: number; total_minutes: number };
  calendar: {
    total_connections: number;
    active_syncs: number;
    error_syncs: number;
    synced_this_week: number;
  };
  feature_flags: Record<string, { value: boolean; description: string | null; updated_at: string | null }>;
  services: SystemHealth['services'];
}

export interface CalendarSyncRow {
  sync_id: number;
  user_id: number;
  user_email: string | null;
  user_name: string | null;
  calendar_id: string;
  calendar_name: string | null;
  sync_enabled: boolean;
  sync_status: string;
  last_sync_at: string | null;
  error_message: string | null;
  updated_at: string;
}

export interface SystemAnalytics {
  overview: {
    total_users: number;
    active_users: number;
    inactive_users: number;
    new_users_week: number;
    new_users_month: number;
    total_notes: number;
    total_tasks: number;
    completed_tasks: number;
    total_recordings: number;
    total_reminders: number;
    total_focus_sessions: number;
    admin_users: number;
    oauth_users: number;
  };
  daily_registrations: Array<{ date: string; registrations: string }>;
  most_active_users: Array<Record<string, unknown>>;
}

export interface ContentStats {
  today: { notes: number; tasks: number; recordings: number };
  week: { notes: number; tasks: number; recordings: number };
  averages: { avg_note_length: string; avg_recording_size: string };
  storage: { total_storage_used: number; total_storage_used_mb: string };
  popular_tags: Array<{ name: string; count: number }>;
  popular_categories: Array<{ name: string; count: number }>;
}

export interface AIUsagePerUser {
  users: Array<{
    user_id: number;
    email: string;
    name: string;
    operations: { total_operations: number; transcriptions: number; task_extractions: number };
    tokens: { total_tokens: number };
    cost: { estimated_cost_usd: string };
  }>;
  summary: {
    total_users_with_ai_usage: number;
    total_operations: number;
    total_tokens: number;
    total_cost_usd: string;
  };
}
