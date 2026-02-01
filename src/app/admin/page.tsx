'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { getToken } from '@/lib/auth';
import { getSystemAnalytics } from '@/services/analytics';
import { getUsers } from '@/services/users';
import { getActivityLogs } from '@/services/system';
import { SystemAnalytics, User, ActivityLog } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const fetchData = async () => {
      try {
        const [analyticsData, usersData, logsData] = await Promise.all([
          getSystemAnalytics(token),
          getUsers(token, { page: 1, limit: 5, sortBy: 'created_at', order: 'DESC' }),
          getActivityLogs(token, { page: 1, limit: 5 }),
        ]);

        setAnalytics(analyticsData);
        setRecentUsers(usersData.data);
        setRecentLogs(logsData.data);
      } catch (error) {
        router.push(ROUTES.LOGIN);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to Voclio Admin Panel</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={analytics.overview.total_users.toLocaleString()}
          change="+8.3% from last month"
          changeType="positive"
          icon={<UsersIcon className="w-6 h-6" />}
          gradient="blue"
        />
        <StatCard
          title="Active Users"
          value={analytics.overview.active_users.toLocaleString()}
          change="+5.2% from last month"
          changeType="positive"
          icon={<SuccessIcon className="w-6 h-6" />}
          gradient="green"
        />
        <StatCard
          title="Total Notes"
          value={analytics.overview.total_notes.toLocaleString()}
          change="+12.5% from last month"
          changeType="positive"
          icon={<RequestsIcon className="w-6 h-6" />}
          gradient="purple"
        />
        <StatCard
          title="Total Tasks"
          value={analytics.overview.total_tasks.toLocaleString()}
          change="+7.8% from last month"
          changeType="positive"
          icon={<ErrorsIcon className="w-6 h-6" />}
          gradient="red"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card hover>
          <CardTitle>Content Statistics</CardTitle>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Recordings</span>
              <span className="font-semibold text-gray-900">{analytics.overview.total_recordings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Notes</span>
              <span className="font-semibold text-gray-900">{analytics.overview.total_notes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-semibold text-gray-900">{analytics.overview.total_tasks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Tasks</span>
              <span className="font-semibold text-gray-900">{analytics.overview.completed_tasks.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card hover>
          <CardTitle>User Statistics</CardTitle>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold text-gray-900">{analytics.overview.total_users.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold text-green-600">{analytics.overview.active_users.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inactive Users</span>
              <span className="font-semibold text-gray-500">{analytics.overview.inactive_users.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Activity Rate</span>
              <span className="font-semibold text-purple-600">
                {analytics.overview.total_users > 0 ? ((analytics.overview.active_users / analytics.overview.total_users) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </Card>

        <Card hover>
          <CardTitle>System Overview</CardTitle>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Content</span>
              <span className="font-semibold text-gray-900">
                {(analytics.overview.total_notes + analytics.overview.total_tasks + analytics.overview.total_recordings).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg per User</span>
              <span className="font-semibold text-gray-900">
                {analytics.overview.total_users > 0 
                  ? ((analytics.overview.total_notes + analytics.overview.total_tasks + analytics.overview.total_recordings) / analytics.overview.total_users).toFixed(1)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Notes per User</span>
              <span className="font-semibold text-blue-600">
                {analytics.overview.total_users > 0 ? (analytics.overview.total_notes / analytics.overview.total_users).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasks per User</span>
              <span className="font-semibold text-orange-600">
                {analytics.overview.total_users > 0 ? (analytics.overview.total_tasks / analytics.overview.total_users).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card hover>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Users</CardTitle>
            <Link href={ROUTES.USERS} className="text-sm text-[#6D28D9] hover:text-[#5B21B6] font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
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
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No users found</p>
            )}
          </div>
        </Card>

        {/* Recent Logs */}
        <Card hover>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Activity</CardTitle>
            <Link href={ROUTES.LOGS} className="text-sm text-[#6D28D9] hover:text-[#5B21B6] font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, index) => (
                <div key={`${log.timestamp}-${index}`} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                  <ActivityIcon action={log.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{log.type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {log.user.email || 'System'} • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="info" size="sm">
                    {log.type.split('_')[0]}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No activity logs found</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ActivityIcon({ action }: { action: string }) {
  const colors: Record<string, string> = {
    user: 'bg-blue-100 text-blue-600',
    note: 'bg-green-100 text-green-600',
    task: 'bg-orange-100 text-orange-600',
    recording: 'bg-purple-100 text-purple-600',
    default: 'bg-gray-100 text-gray-600',
  };

  const actionType = action.toLowerCase().split('_')[0];
  const colorClass = colors[actionType] || colors.default;

  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
