'use client';

import { useState } from 'react';
import { SystemAnalytics, ContentStats, AIUsagePerUser } from '@/lib/types';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/tables/DataTable';
import { formatNumber } from '@/lib/format';

interface AnalyticsClientProps {
  system: SystemAnalytics | null;
  content: ContentStats | null;
  aiPerUser: AIUsagePerUser | null;
  initialError: string | null;
}

export default function AnalyticsClient({ system, content, aiPerUser, initialError }: AnalyticsClientProps) {
  const [tab, setTab] = useState<'overview' | 'content' | 'ai'>('overview');

  if (initialError) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500">{initialError}</p>
      </Card>
    );
  }

  const overview = system?.overview;

  const aiColumns = [
    { key: 'name', header: 'User', render: (r: AIUsagePerUser['users'][0]) => r.name || r.email },
    { key: 'email', header: 'Email' },
    {
      key: 'operations',
      header: 'AI Ops',
      render: (r: AIUsagePerUser['users'][0]) => formatNumber(r.operations.total_operations),
    },
    {
      key: 'tokens',
      header: 'Tokens',
      render: (r: AIUsagePerUser['users'][0]) => formatNumber(r.tokens.total_tokens),
    },
    {
      key: 'cost',
      header: 'Est. Cost',
      render: (r: AIUsagePerUser['users'][0]) => `$${r.cost.estimated_cost_usd}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">System-wide metrics and insights</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {(['overview', 'content', 'ai'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium capitalize ${
              tab === t ? 'text-[#6D28D9] border-b-2 border-[#6D28D9]' : 'text-gray-500'
            }`}
          >
            {t === 'ai' ? 'AI per User' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && overview && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Total Users" value={overview.total_users} />
            <MetricCard label="Active Users" value={overview.active_users} />
            <MetricCard label="New (Week)" value={overview.new_users_week} />
            <MetricCard label="Admins" value={overview.admin_users} />
            <MetricCard label="Notes" value={overview.total_notes} />
            <MetricCard label="Tasks" value={overview.total_tasks} />
            <MetricCard label="Completed Tasks" value={overview.completed_tasks} />
            <MetricCard label="Recordings" value={overview.total_recordings} />
          </div>

          {system.most_active_users?.length > 0 && (
            <Card hover>
              <CardTitle>Most Active Users</CardTitle>
              <div className="mt-4 space-y-2">
                {system.most_active_users.slice(0, 5).map((u, i) => (
                  <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm">
                    <span className="font-medium">{String(u.name || u.email)}</span>
                    <span className="text-gray-500">
                      {Number(u.notes_count ?? 0) + Number(u.tasks_count ?? 0) + Number(u.recordings_count ?? 0)} items
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {tab === 'content' && content && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hover>
            <CardTitle>Today</CardTitle>
            <div className="mt-4 space-y-2">
              <Row label="Notes" value={content.today.notes} />
              <Row label="Tasks" value={content.today.tasks} />
              <Row label="Recordings" value={content.today.recordings} />
            </div>
          </Card>
          <Card hover>
            <CardTitle>This Week</CardTitle>
            <div className="mt-4 space-y-2">
              <Row label="Notes" value={content.week.notes} />
              <Row label="Tasks" value={content.week.tasks} />
              <Row label="Recordings" value={content.week.recordings} />
            </div>
          </Card>
          <Card hover>
            <CardTitle>Storage</CardTitle>
            <p className="text-3xl font-bold text-gray-900 mt-4">{content.storage.total_storage_used_mb} MB</p>
            <p className="text-sm text-gray-500 mt-1">Avg note length: {content.averages.avg_note_length} chars</p>
          </Card>
          <Card hover>
            <CardTitle>Popular Tags</CardTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {content.popular_tags?.length ? (
                content.popular_tags.map((t) => (
                  <Badge key={t.name} variant="purple">{t.name} ({t.count})</Badge>
                ))
              ) : (
                <p className="text-sm text-gray-400">No tags yet</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === 'ai' && aiPerUser && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Users with AI" value={aiPerUser.summary.total_users_with_ai_usage} />
            <MetricCard label="Total Operations" value={aiPerUser.summary.total_operations} />
            <MetricCard label="Total Tokens" value={aiPerUser.summary.total_tokens} />
            <MetricCard label="Est. Cost" value={`$${aiPerUser.summary.total_cost_usd}`} />
          </div>
          <Card padding="none">
            <DataTable
              columns={aiColumns}
              data={aiPerUser.users}
              keyExtractor={(r) => String(r.user_id)}
              emptyMessage="No AI usage data yet"
            />
          </Card>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {typeof value === 'number' ? formatNumber(value) : value}
      </p>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{formatNumber(value)}</span>
    </div>
  );
}
