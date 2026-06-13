'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DashboardStats,
  UsageChart,
  TrafficSources,
  PaginatedResponse,
  User,
  Log,
} from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import { formatDateTime, formatNumber, formatWeekday } from '@/lib/format';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

interface DashboardClientProps {
  stats: DashboardStats | null;
  chart: UsageChart | null;
  traffic: TrafficSources | null;
  usersData: PaginatedResponse<User> | null;
  logsData: PaginatedResponse<Log> | null;
  period: string;
  error: string | null;
}

const TRAFFIC_COLORS = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
];

function formatChange(percent: number): { text: string; type: 'positive' | 'negative' | 'neutral' } {
  const sign = percent > 0 ? '+' : '';
  const type = percent > 0 ? 'positive' : percent < 0 ? 'negative' : 'neutral';
  return { text: `${sign}${percent}% from last week`, type };
}

export default function DashboardClient({
  stats,
  chart,
  traffic,
  usersData,
  logsData,
  period,
  error,
}: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (newPeriod: string) => {
    startTransition(() => {
      router.push(`${ROUTES.DASHBOARD}?period=${newPeriod}`);
    });
  };

  if (error) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Could not load dashboard data. Check that the backend is running on port 3000.
        </p>
      </Card>
    );
  }

  const chartData = chart?.data ?? [];
  const maxValue = Math.max(...chartData.map((d) => d.api_requests), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to Voclio Admin Panel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="API Requests"
          value={formatNumber(stats?.api_requests.value ?? 0)}
          change={formatChange(stats?.api_requests.change_percent ?? 0).text}
          changeType={formatChange(stats?.api_requests.change_percent ?? 0).type}
          icon={<RequestsIcon className="w-6 h-6" />}
          gradient="purple"
        />
        <StatCard
          title="Active Users"
          value={formatNumber(stats?.active_users.value ?? 0)}
          change={formatChange(stats?.active_users.change_percent ?? 0).text}
          changeType={formatChange(stats?.active_users.change_percent ?? 0).type}
          icon={<SuccessIcon className="w-6 h-6" />}
          gradient="green"
        />
        <StatCard
          title="Voice Recordings"
          value={formatNumber(stats?.voice_recordings?.value ?? 0)}
          change={formatChange(stats?.voice_recordings?.change_percent ?? 0).text}
          changeType={formatChange(stats?.voice_recordings?.change_percent ?? 0).type}
          icon={<MicIcon className="w-6 h-6" />}
          gradient="blue"
        />
        <StatCard
          title="Calendar Syncs"
          value={formatNumber(stats?.calendar_connections?.value ?? 0)}
          change={`${formatNumber(stats?.oauth_integrations?.value ?? 0)} OAuth users`}
          changeType="neutral"
          icon={<CalendarIcon className="w-6 h-6" />}
          gradient="red"
        />
      </div>

      <div className="flex justify-end">
        <Link
          href={ROUTES.INTEGRATIONS}
          className="text-sm text-[#6D28D9] hover:text-[#5B21B6] font-medium"
        >
          Manage integrations & feature flags →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" hover>
          <div className="flex items-center justify-between mb-6">
            <CardTitle>API Usage Overview</CardTitle>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              disabled={isPending}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2 overflow-x-auto">
            {chartData.length > 0 ? (
              chartData.map((item) => {
                const heightPercent = (item.api_requests / maxValue) * 100;
                const label = formatWeekday(item.date);
                return (
                  <div key={item.date} className="flex-1 min-w-[40px] flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">{item.api_requests}</span>
                    <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-[#6D28D9] to-[#8B5CF6] rounded-lg transition-all duration-500"
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">No chart data</div>
            )}
          </div>
        </Card>

        <Card hover>
          <CardTitle>Traffic Sources</CardTitle>
          <div className="mt-6 space-y-4">
            {(traffic?.sources ?? []).map((source, i) => (
              <div key={source.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{source.name}</span>
                  <span className="font-semibold text-gray-900">{source.percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${TRAFFIC_COLORS[i % TRAFFIC_COLORS.length]} rounded-full transition-all duration-500`}
                    style={{ width: `${source.percent}%` }}
                  />
                </div>
              </div>
            ))}
            {!traffic?.sources?.length && (
              <p className="text-sm text-gray-400 text-center">No traffic data</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Users</CardTitle>
            <Link href={ROUTES.USERS} className="text-sm text-[#6D28D9] hover:text-[#5B21B6] font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {(usersData?.data ?? []).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.is_active ? 'success' : 'error'} dot>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
            {!usersData?.data?.length && (
              <p className="text-sm text-gray-400 text-center py-4">No users yet</p>
            )}
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Activity</CardTitle>
            <Link href={ROUTES.LOGS} className="text-sm text-[#6D28D9] hover:text-[#5B21B6] font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {(logsData?.data ?? []).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                <SeverityIcon severity={log.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(log.created_at)}</p>
                </div>
                <Badge variant={getSeverityVariant(log.severity)} size="sm">
                  {log.severity}
                </Badge>
              </div>
            ))}
            {!logsData?.data?.length && (
              <p className="text-sm text-gray-400 text-center py-4">No activity yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getSeverityVariant(severity: string): 'info' | 'warning' | 'error' | 'default' {
  const variants: Record<string, 'info' | 'warning' | 'error'> = {
    info: 'info',
    warning: 'warning',
    error: 'error',
    critical: 'error',
  };
  return variants[severity] || 'default';
}

function SeverityIcon({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    critical: 'bg-red-100 text-red-600',
  };
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[severity] || 'bg-gray-100 text-gray-600'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

function RequestsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ErrorsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
