import { requireAuth } from '@/lib/auth';
import { getApiUsage } from '@/services/api-usage';
import { getUsers } from '@/services/users';
import { getLogs } from '@/services/logs';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default async function DashboardPage() {
  const token = await requireAuth();

  let apiUsage = null;
  let usersData = null;
  let logsData = null;

  try {
    [apiUsage, usersData, logsData] = await Promise.all([
      getApiUsage(token).catch(() => null),
      getUsers(token, { limit: 5 }).catch(() => null),
      getLogs(token, { limit: 5 }).catch(() => null),
    ]);
  } catch {
    // Handle errors gracefully
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
          title="Total Requests"
          value={apiUsage?.total_requests?.toLocaleString() ?? '45,230'}
          change="+12.5% from last month"
          changeType="positive"
          icon={<RequestsIcon className="w-6 h-6" />}
          gradient="purple"
        />
        <StatCard
          title="Success Rate"
          value={apiUsage?.success_rate ? `${apiUsage.success_rate.toFixed(1)}%` : '97.2%'}
          change="+2.1% from last month"
          changeType="positive"
          icon={<SuccessIcon className="w-6 h-6" />}
          gradient="green"
        />
        <StatCard
          title="Total Users"
          value={usersData?.total?.toLocaleString() ?? '1,234'}
          change="+8.3% from last month"
          changeType="positive"
          icon={<UsersIcon className="w-6 h-6" />}
          gradient="blue"
        />
        <StatCard
          title="Total Errors"
          value={apiUsage?.total_errors?.toLocaleString() ?? '1,250'}
          change="-5.2% from last month"
          changeType="positive"
          icon={<ErrorsIcon className="w-6 h-6" />}
          gradient="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" hover>
          <div className="flex items-center justify-between mb-6">
            <CardTitle>API Usage Overview</CardTitle>
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const heights = [65, 80, 45, 90, 70, 55, 85];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: `${heights[i]}%` }}>
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[#6D28D9] to-[#8B5CF6] rounded-t-lg transition-all duration-500"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card hover>
          <CardTitle>Traffic Sources</CardTitle>
          <div className="mt-6 space-y-4">
            {[
              { name: 'Direct', value: 45, color: 'bg-purple-500' },
              { name: 'API', value: 30, color: 'bg-blue-500' },
              { name: 'Referral', value: 15, color: 'bg-green-500' },
              { name: 'Social', value: 10, color: 'bg-orange-500' },
            ].map((source) => (
              <div key={source.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{source.name}</span>
                  <span className="font-semibold text-gray-900">{source.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${source.color} rounded-full transition-all duration-500`} style={{ width: `${source.value}%` }} />
                </div>
              </div>
            ))}
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
          {usersData?.data?.length ? (
            <div className="space-y-3">
              {usersData.data.map((user) => (
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
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No users found</p>
          )}
        </Card>

        {/* Recent Logs */}
        <Card hover>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Activity</CardTitle>
            <Link href={ROUTES.LOGS} className="text-sm text-[#6D28D9] hover:text-[#5B21B6] font-medium">
              View all →
            </Link>
          </div>
          {logsData?.data?.length ? (
            <div className="space-y-3">
              {logsData.data.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors">
                  <SeverityIcon severity={log.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={getSeverityVariant(log.severity)} size="sm">
                    {log.severity}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
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
      {severity === 'info' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      {severity === 'warning' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
      {(severity === 'error' || severity === 'critical') && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
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
