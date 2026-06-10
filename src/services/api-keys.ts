import { apiFetchData } from './api';
import { unwrapData } from '@/lib/api-response';
import { mapApiKey } from '@/lib/mappers';
import { ApiKey, PaginatedResponse } from '@/lib/types';

export async function getApiKeys(token: string): Promise<PaginatedResponse<ApiKey>> {
  const response = await apiFetchData<{ api_keys: Record<string, unknown>[] }>('/admin/api-keys', { token });
  const keys = (unwrapData(response).api_keys ?? []).map((k) => mapApiKey(k));
  return {
    data: keys,
    total: keys.length,
    page: 1,
    limit: keys.length || 10,
    total_pages: 1,
  };
}

export async function createApiKey(
  token: string,
  data: { name: string; api_type: string; access_token: string; provider?: string }
): Promise<ApiKey> {
  const response = await apiFetchData<{ api_key: Record<string, unknown> }>('/admin/api-keys', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapApiKey(unwrapData(response).api_key);
}

export async function updateApiKey(
  token: string,
  id: string,
  data: Partial<{ name: string; api_type: string; access_token: string; is_active: boolean; provider?: string }>
): Promise<ApiKey> {
  const response = await apiFetchData<{ api_key: Record<string, unknown> }>(`/admin/api-keys/${id}`, {
    token,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return mapApiKey(unwrapData(response).api_key);
}

export async function deleteApiKey(token: string, id: string): Promise<void> {
  await apiFetchData<null>(`/admin/api-keys/${id}`, { token, method: 'DELETE' });
}
