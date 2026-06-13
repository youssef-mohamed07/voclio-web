import { apiFetchData } from './api';
import { unwrapData } from '@/lib/api-response';
import { CalendarSyncRow, IntegrationsOverview } from '@/lib/types';

export async function getIntegrationsOverview(token: string): Promise<IntegrationsOverview> {
  const response = await apiFetchData<IntegrationsOverview>('/admin/integrations/overview', { token });
  return unwrapData(response);
}

export async function getCalendarSyncs(
  token: string,
  params: { page?: number; limit?: number; status?: string } = {}
): Promise<{ data: CalendarSyncRow[]; pagination: { page: number; limit: number; total: number; total_pages: number } }> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  const qs = search.toString();
  const response = await apiFetchData<{
    data: CalendarSyncRow[];
    pagination: { page: number; limit: number; total: number; total_pages: number };
  }>(`/admin/integrations/calendar${qs ? `?${qs}` : ''}`, { token });
  return unwrapData(response);
}

export async function updateFeatureFlags(
  token: string,
  flags: Record<string, boolean>
): Promise<void> {
  const payload: Record<string, string> = {};
  Object.entries(flags).forEach(([key, value]) => {
    payload[key] = String(value);
  });
  await apiFetchData('/admin/integrations/feature-flags', {
    token,
    method: 'PUT',
    body: JSON.stringify({ flags: payload }),
  });
}
