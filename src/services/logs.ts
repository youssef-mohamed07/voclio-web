import { apiFetch, buildQueryString } from './api';
import { Log, PaginatedResponse } from '@/lib/types';
import { mockLogs, paginateMockData } from '@/lib/mock-data';

interface LogsParams {
  page?: number;
  limit?: number;
  activity_type?: string;
  severity?: string;
  start_date?: string;
  end_date?: string;
}

export async function getLogs(token: string, params: LogsParams = {}): Promise<PaginatedResponse<Log>> {
  try {
    const query = buildQueryString({
      page: params.page || 1,
      limit: params.limit || 20,
      activity_type: params.activity_type,
      severity: params.severity,
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return await apiFetch<PaginatedResponse<Log>>(`/admin/logs${query}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    let filteredLogs = mockLogs;
    if (params.activity_type) {
      filteredLogs = filteredLogs.filter(log => log.activity_type === params.activity_type);
    }
    if (params.severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === params.severity);
    }
    return paginateMockData(filteredLogs, params.page || 1, params.limit || 20);
  }
}
