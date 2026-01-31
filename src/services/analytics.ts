import { apiFetch, buildQueryString } from './api';
import { SystemAnalytics, AIUsageAnalytics, ContentStatistics } from '@/lib/types';

export async function getSystemAnalytics(token: string): Promise<SystemAnalytics> {
  try {
    return await apiFetch<SystemAnalytics>('/admin/analytics/system', { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return {
      overview: {
        total_users: 8,
        active_users: 6,
        inactive_users: 2,
        new_users_week: 2,
        new_users_month: 5,
        total_notes: 245,
        total_tasks: 156,
        completed_tasks: 89,
        total_recordings: 78,
        total_reminders: 34,
        total_focus_sessions: 123,
        admin_users: 1,
        oauth_users: 3,
      },
      daily_registrations: [
        { date: '2026-01-25', registrations: 1 },
        { date: '2026-01-26', registrations: 0 },
        { date: '2026-01-27', registrations: 2 },
        { date: '2026-01-28', registrations: 1 },
        { date: '2026-01-29', registrations: 0 },
        { date: '2026-01-30', registrations: 1 },
        { date: '2026-01-31', registrations: 0 },
      ],
      most_active_users: [
        { user_id: 2, email: 'jane@example.com', name: 'Jane Smith', notes_count: 45, tasks_count: 32, recordings_count: 18 },
        { user_id: 5, email: 'charlie@example.com', name: 'Charlie Davis', notes_count: 38, tasks_count: 28, recordings_count: 15 },
        { user_id: 1, email: 'john@example.com', name: 'John Doe', notes_count: 35, tasks_count: 25, recordings_count: 12 },
      ],
    };
  }
}

interface AIUsageParams {
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export async function getAIUsageAnalytics(
  token: string,
  params: AIUsageParams = {}
): Promise<AIUsageAnalytics> {
  try {
    const query = buildQueryString(params as Record<string, string | number | boolean | undefined>);
    return await apiFetch<AIUsageAnalytics>(`/admin/analytics/ai-usage${query}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return {
      daily_stats: [
        { date: '2026-01-25', summarizations: 12, total_ai_requests: 45 },
        { date: '2026-01-26', summarizations: 15, total_ai_requests: 52 },
        { date: '2026-01-27', summarizations: 10, total_ai_requests: 38 },
        { date: '2026-01-28', summarizations: 18, total_ai_requests: 61 },
        { date: '2026-01-29', summarizations: 14, total_ai_requests: 48 },
        { date: '2026-01-30', summarizations: 16, total_ai_requests: 55 },
        { date: '2026-01-31', summarizations: 19, total_ai_requests: 64 },
      ],
      totals: {
        total_summarizations: 104,
        active_ai_users: 6,
        total_transcriptions: 78,
      },
      token_estimate: {
        input_tokens: 125000,
        output_tokens: 45000,
        total_tokens: 170000,
        estimated_cost_usd: '2.55',
      },
    };
  }
}

export async function getContentStatistics(token: string): Promise<ContentStatistics> {
  try {
    return await apiFetch<ContentStatistics>('/admin/analytics/content', { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return {
      statistics: {
        notes_today: 12,
        tasks_today: 8,
        recordings_today: 5,
        notes_week: 45,
        tasks_week: 32,
        recordings_week: 18,
        avg_note_length: '245',
        avg_recording_size: '2.5',
        total_storage_used: 1250000000,
        total_storage_used_mb: '1192.09',
      },
      popular_tags: [
        { name: 'work', usage_count: 45, color: '#3B82F6' },
        { name: 'personal', usage_count: 38, color: '#10B981' },
        { name: 'urgent', usage_count: 25, color: '#EF4444' },
        { name: 'ideas', usage_count: 22, color: '#F59E0B' },
        { name: 'meeting', usage_count: 18, color: '#8B5CF6' },
      ],
      popular_categories: [
        { category_id: 1, name: 'Work Projects', color: '#3B82F6', task_count: 45 },
        { category_id: 2, name: 'Personal Goals', color: '#10B981', task_count: 32 },
        { category_id: 3, name: 'Shopping', color: '#F59E0B', task_count: 18 },
        { category_id: 4, name: 'Health', color: '#EF4444', task_count: 15 },
      ],
    };
  }
}
