import { apiFetch, buildQueryString } from './api';
import { SystemAnalytics, AIUsageAnalytics, ContentStatistics } from '@/lib/types';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export async function getSystemAnalytics(token: string): Promise<SystemAnalytics> {
  const response = await apiFetch<BackendResponse<SystemAnalytics>>('/admin/analytics/system', { token });
  return response.data || response as any;
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
  const query = buildQueryString(params as Record<string, string | number | boolean | undefined>);
  const response = await apiFetch<BackendResponse<AIUsageAnalytics>>(`/admin/analytics/ai-usage${query}`, { token });
  return response.data || response as any;
}

interface AIUsagePerUserParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export async function getAIUsagePerUser(
  token: string,
  params: AIUsagePerUserParams = {}
): Promise<any> {
  const query = buildQueryString(params as Record<string, string | number | boolean | undefined>);
  const response = await apiFetch<BackendResponse<any>>(`/admin/analytics/ai-usage-per-user${query}`, { token });
  return response.data || response;
}

export async function getContentStatistics(token: string): Promise<ContentStatistics> {
  const response = await apiFetch<BackendResponse<ContentStatistics>>('/admin/analytics/content', { token });
  return response.data || response as any;
}
