import { apiFetch, buildQueryString } from './api';
import { ApiKey, PaginatedResponse } from '@/lib/types';

interface ApiKeysParams {
  page?: number;
  limit?: number;
}

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export async function getApiKeys(token: string, params: ApiKeysParams = {}): Promise<PaginatedResponse<ApiKey>> {
  const query = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 10,
  });
  const response = await apiFetch<BackendResponse<PaginatedResponse<ApiKey>>>(`/admin/api-keys${query}`, { token });
  return response.data || response as any;
}

export async function createApiKey(
  token: string,
  data: { name: string; permissions: string[] }
): Promise<ApiKey> {
  const response = await apiFetch<BackendResponse<ApiKey>>('/admin/api-keys', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data || response as any;
}

export async function updateApiKey(
  token: string,
  id: string,
  data: Partial<ApiKey>
): Promise<ApiKey> {
  const response = await apiFetch<BackendResponse<ApiKey>>(`/admin/api-keys/${id}`, {
    token,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data || response as any;
}

export async function deleteApiKey(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/admin/api-keys/${id}`, {
    token,
    method: 'DELETE',
  });
}
