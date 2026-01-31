import { apiFetch, buildQueryString } from './api';
import { ApiUsage } from '@/lib/types';
import { mockApiUsage } from '@/lib/mock-data';

interface ApiUsageParams {
  start_date?: string;
  end_date?: string;
  api_type?: string;
}

export async function getApiUsage(token: string, params: ApiUsageParams = {}): Promise<ApiUsage> {
  try {
    const query = buildQueryString({
      start_date: params.start_date,
      end_date: params.end_date,
      api_type: params.api_type,
    });
    return await apiFetch<ApiUsage>(`/admin/api-usage${query}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return mockApiUsage;
  }
}
