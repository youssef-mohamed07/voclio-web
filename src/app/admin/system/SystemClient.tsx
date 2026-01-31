'use client';

import { useState, useEffect } from 'react';
import { getSystemHealth, getActivityLogs, clearOldData } from '@/services/system';
import { SystemHealth, ActivityLog, PaginatedResponse } from '@/lib/types';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/tables/Pagination';

export default function SystemClient() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [logs, setLogs] = useState<PaginatedResponse<ActivityLog> | null>(null);
  const [clearModal, setClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [days, setDays] = useState(90);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const [healthData, logsData] = await Promise.all([
        getSystemHealth(token),
        getActivityLogs(token, { page, limit: 20 }),
      ]);
      setHealth(healthData);
      setLogs(logsData);
    } catch (error: any) {
      showToast('error', error.message || 'Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setClearing(true);
    try {
      const token = localStorage.getItem('token') || '';
      const result = await clearOldData(token, days);
      showToast('success', `Cleared ${result.deleted_sessions} sessions and ${result.deleted_notifications} notifications`);
      setClearModal(false);
      loadData();
    } catch (error: any) {
      showToast('error', error.message || 'Failed to clear old data');
    } finally {
      setClearing(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Management</h1>
          <p className="text-gray-500 mt-1">Monitor system health and manage data</p>
        </div>
        <Button variant="gradient" onClick={() => setClearModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Old Data
        </Button>
      </div>

      {/* System Health */}
      {health && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="System Status"
              value={health.status}
              change={health.database}
              changeType={health.status === 'operational' ? 'positive' : 'negative'}
              icon={<StatusIcon />}
              gradient={health.status === 'operational' ? 'green' : 'red'}
            />
            <StatCard
              title="Uptime"
              value={formatUptime(health.uptime)}
              change="Server running"
              changeType="positive"
              icon={<UptimeIcon />}
              gradient="blue"
            />
            <StatCard
              title="Active Sessions"
              value={health.active_sessions.toLocaleString()}
              change="Connected users"
              changeType="neutral"
              icon={<SessionsIcon />}
              gradient="purple"
            />
            <StatCard
              title="Notifications"
              value={health.unread_notifications.toLocaleString()}
              change="Unread"
              changeType="neutral"
              icon={<NotificationIcon />}
              gradient="orange"
            />
          </div>

          <Card hover>
            <CardTitle>Memory Usage</CardTitle>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-600">RSS</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatBytes(health.memory_usage.rss)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600">Heap Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatBytes(health.memory_usage.heapTotal)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-600">Heap Used</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatBytes(health.memory_usage.heapUsed)}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-sm text-gray-600">External</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatBytes(health.memory_usage.external)}</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Activity Logs */}
      {logs && (
        <>
          <Card hover>
            <CardTitle>Recent Activity Logs</CardTitle>
            <div className="mt-4 space-y-2">
              {logs.data.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="info" size="sm">{log.type}</Badge>
                      <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{log.user.name}</p>
                    <p className="text-xs text-gray-500">{log.user.email}</p>
                    {log.data && Object.keys(log.data).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {JSON.stringify(log.data, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {logs.total_pages > 1 && (
            <Card>
              <Pagination
                currentPage={logs.page}
                totalPages={logs.total_pages}
                totalItems={logs.total}
                itemsPerPage={logs.limit}
                onPageChange={setPage}
              />
            </Card>
          )}
        </>
      )}

      <Modal
        isOpen={clearModal}
        onClose={() => setClearModal(false)}
        title="Clear Old Data"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClearModal(false)} disabled={clearing}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearData} loading={clearing}>
              Clear Data
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">This will delete old sessions and read notifications.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Period (days)
            </label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 90)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
