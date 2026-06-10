import { apiFetchData } from './api';
import { unwrapData } from '@/lib/api-response';
import { SystemHealth } from '@/lib/types';

export async function getSystemHealth(token: string): Promise<SystemHealth> {
  const response = await apiFetchData<SystemHealth>('/admin/system/health', { token });
  return unwrapData(response);
}

export async function clearOldData(
  token: string,
  days = 90
): Promise<{ deleted_sessions: number; deleted_notifications: number }> {
  const response = await apiFetchData<{ deleted_sessions: number; deleted_notifications: number }>(
    '/admin/system/clear-old-data',
    { token, method: 'POST', body: JSON.stringify({ days }) }
  );
  return unwrapData(response);
}
