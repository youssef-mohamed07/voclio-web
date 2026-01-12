export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  api_calls_count?: number;
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
