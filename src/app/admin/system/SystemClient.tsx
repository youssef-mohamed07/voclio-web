'use client';

import { useState } from 'react';
import { SystemHealth, ActivityLog, PaginatedResponse } from '@/lib/types';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { clearOldData } from '@/services/system';

interface SystemClientProps {
  healthData: SystemHealth | null;
  logsData: PaginatedResponse<ActivityLog> | null;
  error: string | null;
}

export default function SystemClient({ healthData, logsData, error }: SystemClientProps) {
  const { showToast } = useToast();
  const [clearing, setClearing] = useState(false);

  const handleClearOldData = async () => {
    if (!confirm('Are you sure you want to clear data older than 90 days?')) return;
    
    setClearing(true);
    try {
      const token = localStorage.getItem('voclio_admin_token') || '';
      const result = await clearOldData(token, 90);
      showToast('success', result.message);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to clear old data');
    } finally {
      setClearing(false);
    }
  };

  if (error) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Error loading system data</h3>
        <p className="text-red-500 mt-1">{error}</p>
      </Card>
    );
  }

  if (!healthData || !logsData) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No data available</h3>
        <p className="text-gray-500 mt-1">System data will appear here once available</p>
      </Card>
    );
  }

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Management</h1>
          <p className="text-gray-500 mt-1">Monitor system health and manage data</p>
        </div>
        <Button variant="gradient" onClick={handleClearOldData} loading={clearing}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Old Data
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="System Status"
          value={healthData.status === 'operational' ? 'Operational' : 'Down'}
          change={healthData.database === 'healthy' ? 'Database healthy' : 'Database issues'}
          changeType={healthData.status === 'operational' ? 'positive' : 'negative'}
          icon={<StatusIcon />}
          gradient={healthData.status === 'operational' ? 'green' : 'red'}
        />
        <StatCard
          title="Uptime"
          value={formatUptime(healthData.uptime)}
          change={`${healthData.uptime.toLocaleString()}s`}
          changeType="positive"
          icon={<UptimeIcon />}
          gradient="blue"
        />
        <StatCard
          title="Active Sessions"
          value={healthData.active_sessions.toLocaleString()}
          change="Current users"
          changeType="neutral"
          icon={<SessionsIcon />}
          gradient="purple"
        />
        <StatCard
          title="Notifications"
          value={healthData.unread_notifications.toLocaleString()}
          change="Unread"
          changeType="neutral"
          icon={<NotificationsIcon />}
          gradient="orange"
        />
      </div>

      {/* Memory Usage */}
      <Card hover>
        <CardTitle>Memory Usage</CardTitle>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">RSS</p>
            <p className="text-2xl font-bold text-gray-900">{formatBytes(healthData.memory_usage.rss)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Heap Total</p>
            <p className="text-2xl font-bold text-gray-900">{formatBytes(healthData.memory_usage.heapTotal)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Heap Used</p>
            <p className="text-2xl font-bold text-gray-900">{formatBytes(healthData.memory_usage.heapUsed)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">External</p>
            <p className="text-2xl font-bold text-gray-900">{formatBytes(healthData.memory_usage.external)}</p>
          </div>
        </div>
      </Card>

      {/* Activity Logs */}
      <Card hover>
        <CardTitle>Recent Activity Logs</CardTitle>
        <div className="mt-6 space-y-3">
          {logsData.data.length > 0 ? (
            logsData.data.map((log) => (
              <div key={log.timestamp} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActivityColor(log.type)}`}>
                  {getActivityIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{log.type.replace(/_/g, ' ').toUpperCase()}</p>
                    <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {log.user.name} ({log.user.email})
                  </p>
                  {log.data && Object.keys(log.data).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(log.data).map(([key, value]) => (
                        <Badge key={key} variant="default">
                          {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No activity logs available
            </div>
          )}
        </div>
      </Card>

      {/* System Info */}
      <Card hover>
        <CardTitle>System Information</CardTitle>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(healthData.timestamp).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Database Status</p>
            <Badge variant={healthData.database === 'healthy' ? 'success' : 'error'} dot>
              {healthData.database}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    note_created: 'bg-blue-100 text-blue-600',
    task_created: 'bg-purple-100 text-purple-600',
    recording_created: 'bg-green-100 text-green-600',
    user_login: 'bg-gray-100 text-gray-600',
    user_logout: 'bg-gray-100 text-gray-600',
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
}

function getActivityIcon(type: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    note_created: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    task_created: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  };
  return icons[type] || (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// Icon Components
function StatusIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UptimeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SessionsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
