import {
  User,
  Task,
  Note,
  ApiKey,
  Log,
  AppConfig,
  ApiUsage,
} from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapUser(raw: Record<string, any>): User {
  const recordings = parseInt(raw.recordings_count ?? '0', 10) || 0;
  return {
    id: String(raw.user_id ?? raw.id),
    email: raw.email ?? '',
    name: raw.name ?? '',
    is_active: Boolean(raw.is_active),
    is_admin: Boolean(raw.is_admin),
    created_at: raw.created_at ?? new Date().toISOString(),
    updated_at: raw.updated_at ?? raw.created_at ?? new Date().toISOString(),
    api_calls_count: recordings,
    phone_number: raw.phone_number,
    email_verified: raw.email_verified,
    oauth_provider: raw.oauth_provider,
    tasks_count: parseInt(raw.tasks_count ?? '0', 10) || 0,
    notes_count: parseInt(raw.notes_count ?? '0', 10) || 0,
  };
}

export function mapTask(raw: Record<string, any>): Task {
  return {
    id: String(raw.task_id ?? raw.id),
    title: raw.title ?? '',
    description: raw.description,
    status: raw.status ?? 'pending',
    priority: raw.priority ?? 'medium',
    due_date: raw.due_date,
    created_at: raw.created_at ?? new Date().toISOString(),
    completed_at: raw.completed_at,
  };
}

export function mapNote(raw: Record<string, any>): Note {
  return {
    id: String(raw.note_id ?? raw.id),
    title: raw.title ?? '',
    content: raw.content ?? '',
    color: raw.color,
    is_pinned: Boolean(raw.is_pinned),
    created_at: raw.created_at ?? new Date().toISOString(),
    updated_at: raw.updated_at ?? raw.created_at ?? new Date().toISOString(),
  };
}

export function mapApiKey(raw: Record<string, any>): ApiKey {
  const token = raw.access_token ?? raw.key ?? '';
  return {
    id: String(raw.key_id ?? raw.id),
    name: raw.name || raw.api_type || 'API Key',
    key: token,
    api_type: raw.api_type,
    provider: raw.provider,
    is_active: Boolean(raw.is_active),
    created_at: raw.created_at ?? new Date().toISOString(),
    last_used: raw.last_used,
    permissions: raw.permissions ?? [],
    rate_limit: raw.rate_limit,
  };
}

export function mapLog(raw: Record<string, any>): Log {
  return {
    id: String(raw.id ?? raw.log_id),
    activity_type: raw.activity_type ?? raw.type ?? 'unknown',
    severity: raw.severity ?? 'info',
    message: raw.message ?? raw.activity_type?.replace(/_/g, ' ') ?? '',
    user_id: raw.user?.user_id ? String(raw.user.user_id) : raw.user_id ? String(raw.user_id) : undefined,
    user_email: raw.user?.email ?? raw.user_email,
    ip_address: raw.ip_address,
    created_at: raw.created_at ?? raw.timestamp ?? new Date().toISOString(),
    metadata: raw.data ?? raw.metadata,
  };
}

export function mapConfigItem(raw: Record<string, any>): AppConfig {
  const key = raw.config_key ?? raw.key;
  const valueStr = raw.config_value ?? String(raw.value ?? '');
  let type: AppConfig['type'] = 'string';
  let value: string | boolean | number = valueStr;

  if (valueStr === 'true' || valueStr === 'false') {
    type = 'boolean';
    value = valueStr === 'true';
  } else if (valueStr !== '' && !isNaN(Number(valueStr))) {
    type = 'number';
    value = Number(valueStr);
  }

  return {
    id: String(raw.config_id ?? raw.id ?? key),
    key,
    value,
    type,
    description: raw.description ?? '',
    updated_at: raw.updated_at ?? new Date().toISOString(),
  };
}

export function mapApiUsage(raw: Record<string, any>): ApiUsage {
  const totals = raw.totals ?? {};
  const dailyStats = raw.daily_stats ?? [];
  const totalOps = totals.total_ai_operations ?? 0;

  const breakdown = dailyStats.map((day: Record<string, any>) => ({
    api_type: 'ai',
    date: day.date,
    requests: day.total_ai_requests ?? day.transcriptions ?? 0,
    errors: 0,
    transcriptions: day.transcriptions ?? 0,
    task_extractions: day.task_extractions ?? 0,
  }));

  return {
    total_requests: totalOps,
    total_errors: 0,
    success_rate: totalOps > 0 ? 100 : 0,
    breakdown,
    totals: {
      total_transcriptions: totals.total_transcriptions ?? 0,
      total_task_extractions: totals.total_task_extractions ?? 0,
      total_note_extractions: totals.total_note_extractions ?? 0,
      total_summarizations: totals.total_summarizations ?? 0,
      active_ai_users: totals.active_ai_users ?? 0,
      total_ai_operations: totalOps,
    },
    token_estimate: raw.token_estimate,
    daily_stats: dailyStats,
  };
}

export function mapUserDetail(
  raw: Record<string, any>,
  tasks: Task[] = [],
  notes: Note[] = []
): User {
  const user = mapUser(raw.user ?? raw);
  const stats = raw.statistics ?? {};
  return {
    ...user,
    tasks,
    notes,
    api_calls_count: stats.total_recordings ?? user.api_calls_count,
    tasks_count: stats.total_tasks ?? tasks.length,
    notes_count: stats.total_notes ?? notes.length,
    statistics: stats,
  };
}
