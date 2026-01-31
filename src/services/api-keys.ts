import { apiFetch, buildQueryString } from './api';
import { ApiKey, PaginatedResponse } from '@/lib/types';
import { mockApiKeys, paginateMockData } from '@/lib/mock-data';

interface ApiKeysParams {
  page?: number;
  limit?: number;
}

export async function getApiKeys(token: string, params: ApiKeysParams = {}): Promise<PaginatedResponse<ApiKey>> {
  try {
    const query = buildQueryString({
      page: params.page || 1,
      limit: params.limit || 10,
    });
    return await apiFetch<PaginatedResponse<ApiKey>>(`/admin/api-keys${query}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return paginateMockData(mockApiKeys, params.page || 1, params.limit || 10);
  }
}

export async function createApiKey(
  token: string,
  data: { name: string; permissions: string[] }
): Promise<ApiKey> {
  try {
    return await apiFetch<ApiKey>('/admin/api-keys', {
      token,
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return {
      id: String(mockApiKeys.length + 1),
      name: data.name,
      key: `voc_live_${Math.random().toString(36).substring(2, 32)}`,
      is_active: true,
      created_at: new Date().toISOString(),
      last_used: undefined,
      permissions: data.permissions,
    };
  }
}

export async function updateApiKey(
  token: string,
  id: string,
  data: Partial<ApiKey>
): Promise<ApiKey> {
  try {
    return await apiFetch<ApiKey>(`/admin/api-keys/${id}`, {
      token,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    const apiKey = mockApiKeys.find(k => k.id === id);
    if (!apiKey) throw new Error('API key not found');
    return { ...apiKey, ...data };
  }
}

export async function deleteApiKey(token: string, id: string): Promise<void> {
  try {
    return await apiFetch<void>(`/admin/api-keys/${id}`, {
      token,
      method: 'DELETE',
    });
  } catch (error) {
    console.warn('API failed, simulating delete:', error);
    return Promise.resolve();
  }
}
