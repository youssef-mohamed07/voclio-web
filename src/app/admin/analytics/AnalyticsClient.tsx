'use client';

import { SystemAnalytics, AIUsageAnalytics, ContentStatistics } from '@/lib/types';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface AnalyticsClientProps {
  systemData: SystemAnalytics | null;
  aiUsageData: AIUsageAnalytics | null;
  contentData: ContentStatistics | null;
  error: string | null;
}

export default function AnalyticsClient({ systemData, aiUsageData, contentData, error }: AnalyticsClientProps) {
  if (error) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Error loading analytics</h3>
        <p className="text-red-500 mt-1">{error}</p>
      </Card>
    );
  }

  if (!systemData || !aiUsageData || !contentData) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No data available</h3>
        <p className="text-gray-500 mt-1">Analytics data will appear here once available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">System-wide analytics and insights</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={systemData.overview.total_users.toLocaleString()}
          change={`${systemData.overview.new_users_month} this month`}
          changeType="positive"
          icon={<UsersIcon />}
          gradient="purple"
        />
        <StatCard
          title="Active Users"
          value={systemData.overview.active_users.toLocaleString()}
          change={`${Math.round((systemData.overview.active_users / systemData.overview.total_users) * 100)}% active`}
          changeType="positive"
          icon={<ActiveIcon />}
          gradient="green"
        />
        <StatCard
          title="Total Notes"
          value={systemData.overview.total_notes.toLocaleString()}
          change="Content created"
          changeType="neutral"
          icon={<NotesIcon />}
          gradient="blue"
        />
        <StatCard
          title="Total Tasks"
          value={systemData.overview.total_tasks.toLocaleString()}
          change={`${systemData.overview.completed_tasks} completed`}
          changeType="positive"
          icon={<TasksIcon />}
          gradient="orange"
        />
      </div>

      {/* Daily Registrations Chart */}
      <Card hover>
        <CardTitle>Daily Registrations (Last 30 Days)</CardTitle>
        <div className="mt-6 h-64 flex items-end justify-between gap-2">
          {systemData.daily_registrations.slice(-30).map((day, idx) => {
            const maxValue = Math.max(...systemData.daily_registrations.map(d => d.registrations));
            const heightPercent = maxValue > 0 ? (day.registrations / maxValue) * 100 : 0;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">{day.registrations}</span>
                <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-lg transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{new Date(day.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Most Active Users */}
      <Card hover>
        <CardTitle>Most Active Users</CardTitle>
        <div className="mt-6 space-y-4">
          {systemData.most_active_users.map((user, idx) => (
            <div key={user.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                  #{idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900">{user.notes_count}</p>
                  <p className="text-gray-500">Notes</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{user.tasks_count}</p>
                  <p className="text-gray-500">Tasks</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{user.recordings_count}</p>
                  <p className="text-gray-500">Recordings</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Usage Analytics */}
      {aiUsageData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Transcriptions"
              value={aiUsageData.totals.total_transcriptions.toLocaleString()}
              change="Voice-to-text"
              changeType="neutral"
              icon={<TranscriptionIcon />}
              gradient="blue"
            />
            <StatCard
              title="Total Summarizations"
              value={aiUsageData.totals.total_summarizations.toLocaleString()}
              change="AI-powered"
              changeType="neutral"
              icon={<AIIcon />}
              gradient="purple"
            />
            <StatCard
              title="Active AI Users"
              value={aiUsageData.totals.active_ai_users.toLocaleString()}
              change="Using AI features"
              changeType="positive"
              icon={<UsersIcon />}
              gradient="green"
            />
            <StatCard
              title="Estimated Cost"
              value={`$${aiUsageData.token_estimate.estimated_cost_usd}`}
              change={`${aiUsageData.token_estimate.total_tokens.toLocaleString()} tokens`}
              changeType="neutral"
              icon={<CostIcon />}
              gradient="orange"
            />
          </div>

          <Card hover>
            <CardTitle>AI Usage Trends</CardTitle>
            <div className="mt-6 h-64 flex items-end justify-between gap-2">
              {aiUsageData.daily_stats.slice(-30).map((day, idx) => {
                const maxValue = Math.max(...aiUsageData.daily_stats.map(d => d.total_ai_requests));
                const heightPercent = maxValue > 0 ? (day.total_ai_requests / maxValue) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">{day.total_ai_requests}</span>
                    <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{new Date(day.date).getDate()}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* Content Statistics */}
      {contentData && contentData.statistics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Notes Today"
              value={contentData.statistics.notes_today?.toLocaleString() || '0'}
              change={`${contentData.statistics.notes_week || 0} this week`}
              changeType="positive"
              icon={<NotesIcon />}
              gradient="blue"
            />
            <StatCard
              title="Tasks Today"
              value={contentData.statistics.tasks_today?.toLocaleString() || '0'}
              change={`${contentData.statistics.tasks_week || 0} this week`}
              changeType="positive"
              icon={<TasksIcon />}
              gradient="purple"
            />
            <StatCard
              title="Recordings Today"
              value={contentData.statistics.recordings_today?.toLocaleString() || '0'}
              change={`${contentData.statistics.recordings_week || 0} this week`}
              changeType="positive"
              icon={<RecordingIcon />}
              gradient="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Tags */}
            <Card hover>
              <CardTitle>Popular Tags</CardTitle>
              <div className="mt-6 space-y-3">
                {contentData.popular_tags && contentData.popular_tags.length > 0 ? (
                  contentData.popular_tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color || '#6366f1' }} />
                        <span className="font-medium text-gray-900">{tag.name}</span>
                      </div>
                      <Badge variant="default">{tag.usage_count || 0} uses</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No tags data available</p>
                )}
              </div>
            </Card>

            {/* Popular Categories */}
            <Card hover>
              <CardTitle>Popular Categories</CardTitle>
              <div className="mt-6 space-y-3">
                {contentData.popular_categories && contentData.popular_categories.length > 0 ? (
                  contentData.popular_categories.map((category) => (
                    <div key={category.category_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || '#6366f1' }} />
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <Badge variant="default">{category.task_count || 0} tasks</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No categories data available</p>
                )}
              </div>
            </Card>
          </div>

          {/* Storage Stats */}
          <Card hover>
            <CardTitle>Storage & Performance</CardTitle>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-3xl font-bold text-gray-900">{contentData.statistics.total_storage_used_mb || '0'} MB</p>
                <p className="text-sm text-gray-500 mt-1">Total Storage Used</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-3xl font-bold text-gray-900">{contentData.statistics.avg_note_length || '0'}</p>
                <p className="text-sm text-gray-500 mt-1">Avg Note Length (chars)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-3xl font-bold text-gray-900">
                  {contentData.statistics.avg_recording_size 
                    ? (parseInt(contentData.statistics.avg_recording_size) / 1024 / 1024).toFixed(2) 
                    : '0.00'} MB
                </p>
                <p className="text-sm text-gray-500 mt-1">Avg Recording Size</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// Icon Components
function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ActiveIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function TranscriptionIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function CostIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RecordingIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}
