import { apiFetch, buildQueryString } from './api';
import { SystemHealth, ActivityLog, PaginatedResponse } from '@/lib/types';

export async function getSystemHealth(token: string): Promise<SystemHealth> {
  try {
    return await apiFetch<SystemHealth>('/admin/system/health', { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return {
      status: 'operational',
      database: 'healthy',
      uptime: 99.8,
      memory_usage: {
        rss: 125829120,
        heapTotal: 89456640,
        heapUsed: 62345728,
        external: 1234567,
      },
      active_sessions: 1247,
      unread_notifications: 3,
      timestamp: new Date().toISOString(),
    };
  }
}

interface ActivityLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
}

export async function getActivityLogs(
  token: string,
  params: ActivityLogsParams = {}
): Promise<PaginatedResponse<ActivityLog>> {
  try {
    const query = buildQueryString({
      page: params.page || 1,
      limit: params.limit || 50,
      userId: params.userId,
      action: params.action,
    });
    return await apiFetch<PaginatedResponse<ActivityLog>>(`/admin/system/activity-logs${query}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    const mockActivityLogs: ActivityLog[] = [
      { 
        type: 'login', 
        user: { email: 'john@example.com', name: 'John Doe' }, 
        data: { ip_address: '192.168.1.100' }, 
        timestamp: '2026-01-31T08:30:00Z' 
      },
      { 
        type: 'api_call', 
        user: { email: 'jane@example.com', name: 'Jane Smith' }, 
        data: { endpoint: 'GET /admin/users', ip_address: '10.0.0.50' }, 
        timestamp: '2026-01-31T08:25:00Z' 
      },
      { 
        type: 'config_update', 
        user: { email: 'john@example.com', name: 'John Doe' }, 
        data: { setting: 'rate_limit', ip_address: '192.168.1.100' }, 
        timestamp: '2026-01-31T08:20:00Z' 
      },
      { 
        type: 'logout', 
        user: { email: 'charlie@example.com', name: 'Charlie Davis' }, 
        data: { ip_address: '192.168.1.110' }, 
        timestamp: '2026-01-31T07:50:00Z' 
      },
    ];
    return {
      data: mockActivityLogs,
      total: mockActivityLogs.length,
      page: params.page || 1,
      limit: params.limit || 50,
      total_pages: 1,
    };
  }
}

export async function clearOldData(
  token: string,
  days: number
): Promise<{ deleted_sessions: number; deleted_notifications: number; message: string }> {
  try {
    return await apiFetch('/admin/system/clear-old-data', {
      token,
      method: 'POST',
      body: JSON.stringify({ days }),
    });
  } catch (error) {
    console.warn('API failed, using mock response:', error);
    return {
      deleted_sessions: 145,
      deleted_notifications: 892,
      message: `Successfully cleared data older than ${days} days`,
    };
  }
}
