import { apiFetch, buildQueryString } from './api';
import { SystemHealth, ActivityLog, PaginatedResponse } from '@/lib/types';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export async function getSystemHealth(token: string): Promise<SystemHealth> {
  const response = await apiFetch<BackendResponse<SystemHealth>>('/admin/system/health', { token });
  return response.data || response as any;
}

interface ActivityLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
}

interface BackendActivityLogsResponse {
  data: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export async function getActivityLogs(
  token: string,
  params: ActivityLogsParams = {}
): Promise<PaginatedResponse<ActivityLog>> {
  const query = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 50,
    userId: params.userId,
    action: params.action,
  });
  
  const response = await apiFetch<BackendActivityLogsResponse>(`/admin/system/activity-logs${query}`, { token });
  
  return {
    data: response.data,
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
    total_pages: Math.ceil(response.pagination.total / response.pagination.limit),
  };
}

export async function clearOldData(
  token: string,
  days: number
): Promise<{ deleted_sessions: number; deleted_notifications: number; message: string }> {
  const response = await apiFetch<any>('/admin/system/clear-old-data', {
    token,
    method: 'POST',
    body: JSON.stringify({ days }),
  });
  return response.data || response;
}
