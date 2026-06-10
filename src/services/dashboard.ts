import { apiFetchData, buildQueryString } from './api';
import { unwrapData } from '@/lib/api-response';
import {
  DashboardStats,
  UsageChart,
  TrafficSources,
  AdminProfile,
  AdminNotification,
  PaginatedResponse,
  Log,
  User,
} from '@/lib/types';
import { mapLog, mapUser } from '@/lib/mappers';
import { unwrapPaginated } from '@/lib/api-response';

export async function getDashboardStats(token: string): Promise<DashboardStats> {
  const response = await apiFetchData<DashboardStats>('/admin/dashboard/stats', { token });
  return unwrapData(response);
}

export async function getUsageChart(token: string, period = '7d'): Promise<UsageChart> {
  const query = buildQueryString({ period });
  const response = await apiFetchData<UsageChart>(`/admin/dashboard/usage-chart${query}`, { token });
  return unwrapData(response);
}

export async function getTrafficSources(token: string): Promise<TrafficSources> {
  const response = await apiFetchData<TrafficSources>('/admin/dashboard/traffic-sources', { token });
  return unwrapData(response);
}

export async function getAdminProfile(token: string): Promise<AdminProfile> {
  const response = await apiFetchData<AdminProfile>('/admin/me', { token });
  return unwrapData(response);
}

export async function getNotifications(token: string, limit = 10): Promise<{
  notifications: AdminNotification[];
  unread_count: number;
  active_sessions: number;
}> {
  const query = buildQueryString({ limit });
  const response = await apiFetchData<{
    notifications: AdminNotification[];
    unread_count: number;
    active_sessions: number;
  }>(`/admin/notifications${query}`, { token });
  return unwrapData(response);
}

export async function getRecentUsers(token: string, limit = 5): Promise<PaginatedResponse<User>> {
  const query = buildQueryString({ page: 1, limit, sortBy: 'created_at', order: 'DESC' });
  const response = await apiFetchData<Record<string, unknown>[]>(`/admin/users${query}`, { token });
  const paginated = unwrapPaginated(response);
  return {
    ...paginated,
    data: paginated.data.map((u) => mapUser(u as Record<string, unknown>)),
  };
}

export async function getRecentLogs(token: string, limit = 5): Promise<PaginatedResponse<Log>> {
  const query = buildQueryString({ page: 1, limit });
  const response = await apiFetchData<Record<string, unknown>[]>(`/admin/logs${query}`, { token });
  const paginated = unwrapPaginated(response);
  return {
    ...paginated,
    data: paginated.data.map((l) => mapLog(l as Record<string, unknown>)),
  };
}

export async function getUiStrings(token: string, locale = 'en'): Promise<Record<string, string>> {
  const response = await apiFetchData<{ locale: string; strings: Record<string, string> }>(
    `/admin/ui-strings?locale=${locale}`,
    { token }
  );
  return unwrapData(response).strings;
}
