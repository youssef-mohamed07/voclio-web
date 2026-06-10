import { apiFetchData, buildQueryString } from './api';
import { unwrapData } from '@/lib/api-response';
import { mapApiUsage } from '@/lib/mappers';
import { ApiUsage } from '@/lib/types';

interface ApiUsageParams {
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
}

export async function getApiUsage(token: string, params: ApiUsageParams = {}): Promise<ApiUsage> {
  const query = buildQueryString({
    startDate: params.startDate || params.start_date,
    endDate: params.endDate || params.end_date,
  });
  const response = await apiFetchData<Record<string, unknown>>(`/admin/api-usage${query}`, { token });
  return mapApiUsage(unwrapData(response));
}
