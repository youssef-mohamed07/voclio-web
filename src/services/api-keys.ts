import { apiFetch, buildQueryString } from './api';
import { ApiKey, PaginatedResponse } from '@/lib/types';

interface ApiKeysParams {
  page?: number;
  limit?: number;
}

export async function getApiKeys(token: string, params: ApiKeysParams = {}): Promise<PaginatedResponse<ApiKey>> {
  const query = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 10,
  });
  return apiFetch<PaginatedResponse<ApiKey>>(`/admin/api-keys${query}`, { token });
}

export async function createApiKey(
  token: string,
  data: { name: string; permissions: string[] }
): Promise<ApiKey> {
  return apiFetch<ApiKey>('/admin/api-keys', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateApiKey(
  token: string,
  id: string,
  data: Partial<ApiKey>
): Promise<ApiKey> {
  return apiFetch<ApiKey>(`/admin/api-keys/${id}`, {
    token,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteApiKey(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/admin/api-keys/${id}`, {
    token,
    method: 'DELETE',
  });
}
