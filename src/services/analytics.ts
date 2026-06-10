import { apiFetchData, buildQueryString } from './api';
import { unwrapData } from '@/lib/api-response';
import { ContentStats, SystemAnalytics, AIUsagePerUser } from '@/lib/types';

export async function getSystemAnalytics(token: string): Promise<SystemAnalytics> {
  const response = await apiFetchData<SystemAnalytics>('/admin/analytics/system', { token });
  return unwrapData(response);
}

export async function getContentStats(token: string): Promise<ContentStats> {
  const response = await apiFetchData<{
    statistics: Record<string, number | string>;
    popular_tags: Array<{ name: string; usage_count: number }>;
    popular_categories: Array<{ name: string; task_count: string }>;
  }>('/admin/analytics/content', { token });
  const data = unwrapData(response);
  const s = data.statistics;
  return {
    today: {
      notes: Number(s.notes_today ?? 0),
      tasks: Number(s.tasks_today ?? 0),
      recordings: Number(s.recordings_today ?? 0),
    },
    week: {
      notes: Number(s.notes_week ?? 0),
      tasks: Number(s.tasks_week ?? 0),
      recordings: Number(s.recordings_week ?? 0),
    },
    averages: {
      avg_note_length: String(s.avg_note_length ?? '0'),
      avg_recording_size: String(s.avg_recording_size ?? '0'),
    },
    storage: {
      total_storage_used: Number(s.total_storage_used ?? 0),
      total_storage_used_mb: String(s.total_storage_used_mb ?? '0'),
    },
    popular_tags: (data.popular_tags ?? []).map((t) => ({ name: t.name, count: t.usage_count })),
    popular_categories: (data.popular_categories ?? []).map((c) => ({
      name: c.name,
      count: parseInt(String(c.task_count), 10) || 0,
    })),
  };
}

export async function getAIUsagePerUser(
  token: string,
  params: { startDate?: string; endDate?: string; limit?: number } = {}
): Promise<AIUsagePerUser> {
  const query = buildQueryString({
    startDate: params.startDate,
    endDate: params.endDate,
    limit: params.limit ?? 50,
  });
  const response = await apiFetchData<AIUsagePerUser>(`/admin/analytics/ai-usage-per-user${query}`, { token });
  return unwrapData(response);
}
