import { apiFetchData, buildQueryString } from './api';
import { unwrapPaginated } from '@/lib/api-response';
import { mapLog } from '@/lib/mappers';
import { Log, PaginatedResponse } from '@/lib/types';

interface LogsParams {
  page?: number;
  limit?: number;
  activity_type?: string;
  action?: string;
  severity?: string;
  userId?: string;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
}

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export async function getLogs(token: string, params: LogsParams = {}): Promise<PaginatedResponse<Log>> {
  const query = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 20,
    action: params.action || params.activity_type,
    userId: params.userId,
    severity: params.severity,
    startDate: params.startDate || params.start_date,
    endDate: params.endDate || params.end_date,
  });

  const response = await apiFetchData<Record<string, unknown>[]>(`/admin/logs${query}`, { token });
  const paginated = unwrapPaginated(response);
  const logs = paginated.data.map((l) => mapLog(l as Record<string, unknown>));

  return { ...paginated, data: logs };
}
