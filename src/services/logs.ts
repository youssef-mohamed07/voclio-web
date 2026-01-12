import { apiFetch, buildQueryString } from './api';
import { Log, PaginatedResponse } from '@/lib/types';

interface LogsParams {
  page?: number;
  limit?: number;
  activity_type?: string;
  severity?: string;
  start_date?: string;
  end_date?: string;
}

export async function getLogs(token: string, params: LogsParams = {}): Promise<PaginatedResponse<Log>> {
  const query = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 20,
    activity_type: params.activity_type,
    severity: params.severity,
    start_date: params.start_date,
    end_date: params.end_date,
  });
  return apiFetch<PaginatedResponse<Log>>(`/admin/logs${query}`, { token });
}
