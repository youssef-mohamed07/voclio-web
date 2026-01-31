export interface User {
  id: string;
  user_id?: number;
  email: string;
  name: string;
  phone_number?: string;
  avatar?: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  is_active: boolean;
  email_verified?: boolean;
  is_admin?: boolean;
  oauth_provider?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  api_calls_count?: number;
  notes_count?: number;
  tasks_count?: number;
  recordings_count?: number;
  tasks?: Task[];
  notes?: Note[];
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
}

export interface ApiUsageBreakdown {
  api_type: string;
  date: string;
  requests: number;
  errors: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  is_active: boolean;
  created_at: string;
  last_used?: string;
  permissions: string[];
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

export interface UserDetailsResponse {
  user: User;
  statistics: {
    total_notes: number;
    total_tasks: number;
    completed_tasks: number;
    total_recordings: number;
    total_reminders: number;
    total_tags: number;
    total_categories: number;
    focus_sessions: number;
    total_focus_time: number;
    active_sessions: number;
  };
  recent_activity: {
    notes: Array<{
      note_id: number;
      title: string;
      created_at: string;
    }>;
    tasks: Array<{
      task_id: number;
      title: string;
      status: string;
      created_at: string;
    }>;
    recordings: Array<{
      recording_id: number;
      file_size: number;
      format: string;
      created_at: string;
    }>;
  };
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
  daily_registrations: Array<{
    date: string;
    registrations: number;
  }>;
  most_active_users: Array<{
    user_id: number;
    email: string;
    name: string;
    notes_count: number;
    tasks_count: number;
    recordings_count: number;
  }>;
}

export interface AIUsageAnalytics {
  daily_stats: Array<{
    date: string;
    summarizations: number;
    total_ai_requests: number;
  }>;
  totals: {
    total_summarizations: number;
    active_ai_users: number;
    total_transcriptions: number;
  };
  token_estimate: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    estimated_cost_usd: string;
  };
}

export interface ContentStatistics {
  statistics: {
    notes_today: number;
    tasks_today: number;
    recordings_today: number;
    notes_week: number;
    tasks_week: number;
    recordings_week: number;
    avg_note_length: string;
    avg_recording_size: string;
    total_storage_used: number;
    total_storage_used_mb: string;
  };
  popular_tags: Array<{
    name: string;
    usage_count: number;
    color: string;
  }>;
  popular_categories: Array<{
    category_id: number;
    name: string;
    color: string;
    task_count: number;
  }>;
}

export interface SystemHealth {
  status: 'operational' | 'down';
  database: 'healthy' | 'unhealthy';
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
}

export interface ActivityLog {
  type: string;
  user: {
    email: string;
    name: string;
  };
  data: Record<string, any>;
  timestamp: string;
}
