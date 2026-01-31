'use client';

import { useState, useEffect } from 'react';
import { getSystemAnalytics, getAIUsageAnalytics, getContentStatistics } from '@/services/analytics';
import { SystemAnalytics, AIUsageAnalytics, ContentStatistics } from '@/lib/types';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';

export default function AnalyticsClient() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [systemData, setSystemData] = useState<SystemAnalytics | null>(null);
  const [aiData, setAIData] = useState<AIUsageAnalytics | null>(null);
  const [contentData, setContentData] = useState<ContentStatistics | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const [system, ai, content] = await Promise.all([
        getSystemAnalytics(token),
        getAIUsageAnalytics(token, dateRange),
        getContentStatistics(token),
      ]);
      setSystemData(system);
      setAIData(ai);
      setContentData(content);
    } catch (error: any) {
      showToast('error', error.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Comprehensive system analytics and insights</p>
      </div>

      {/* System Overview */}
      {systemData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={systemData.overview.total_users.toLocaleString()}
              change={`${systemData.overview.new_users_week} new this week`}
              changeType="positive"
              icon={<UsersIcon />}
              gradient="purple"
            />
            <StatCard
              title="Active Users"
              value={systemData.overview.active_users.toLocaleString()}
              change={`${((systemData.overview.active_users / systemData.overview.total_users) * 100).toFixed(1)}% active`}
              changeType="positive"
              icon={<ActiveIcon />}
              gradient="green"
            />
            <StatCard
              title="Total Notes"
              value={systemData.overview.total_notes.toLocaleString()}
              change={`${systemData.overview.total_tasks.toLocaleString()} tasks`}
              changeType="neutral"
              icon={<NotesIcon />}
              gradient="blue"
            />
            <StatCard
              title="Admin Users"
              value={systemData.overview.admin_users.toLocaleString()}
              change={`${systemData.overview.oauth_users} OAuth users`}
              changeType="neutral"
              icon={<AdminIcon />}
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
                        className="w-full bg-gradient-to-t from-[#6D28D9] to-[#8B5CF6] rounded-lg transition-all duration-500"
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
            <CardTitle>Most Active Users (Top 10)</CardTitle>
            <div className="mt-4 space-y-3">
              {systemData.most_active_users.map((user, idx) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">#{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{user.notes_count}</p>
                      <p className="text-xs text-gray-500">Notes</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{user.tasks_count}</p>
                      <p className="text-xs text-gray-500">Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{user.recordings_count}</p>
                      <p className="text-xs text-gray-500">Recordings</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* AI Usage Analytics */}
      {aiData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Summarizations"
              value={aiData.totals.total_summarizations.toLocaleString()}
              change="AI-powered"
              changeType="neutral"
              icon={<AIIcon />}
              gradient="purple"
            />
            <StatCard
              title="Total Transcriptions"
              value={aiData.totals.total_transcriptions.toLocaleString()}
              change="Voice-to-text"
              changeType="neutral"
              icon={<TranscriptionIcon />}
              gradient="blue"
            />
            <StatCard
              title="Active AI Users"
              value={aiData.totals.active_ai_users.toLocaleString()}
              change="Using AI features"
              changeType="positive"
              icon={<UsersIcon />}
              gradient="green"
            />
            <StatCard
              title="Estimated Cost"
              value={`$${aiData.token_estimate.estimated_cost_usd}`}
              change={`${aiData.token_estimate.total_tokens.toLocaleString()} tokens`}
              changeType="neutral"
              icon={<CostIcon />}
              gradient="orange"
            />
          </div>

          <Card hover>
            <CardTitle>AI Usage Trends</CardTitle>
            <div className="mt-6 h-64 flex items-end justify-between gap-2">
              {aiData.daily_stats.slice(-30).map((day, idx) => {
                const maxValue = Math.max(...aiData.daily_stats.map(d => d.total_ai_requests));
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
      {contentData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card hover>
              <CardTitle>Content Activity</CardTitle>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm text-gray-600">Notes Today</span>
                  <span className="text-lg font-bold text-gray-900">{contentData.statistics.notes_today}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm text-gray-600">Tasks Today</span>
                  <span className="text-lg font-bold text-gray-900">{contentData.statistics.tasks_today}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="text-sm text-gray-600">Recordings Today</span>
                  <span className="text-lg font-bold text-gray-900">{contentData.statistics.recordings_today}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="text-lg font-bold text-gray-900">{contentData.statistics.total_storage_used_mb} MB</span>
                </div>
              </div>
            </Card>

            <Card hover>
              <CardTitle>Weekly Activity</CardTitle>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm text-gray-600">Notes This Week</span>
                  <span className="text-lg font-bold text-gray-900">{contentData.statistics.notes_week}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm text-gray-600">Tasks This Week</span>
                  <span className="text-lg font-bold text-gray-900">{contentData.statistics.tasks_week}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="text-sm text-gray-600">Recordings This Week</span>
                  <span className="text-lg font-bold text-gray-900">{contentData.statistics.recordings_week}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                  <span className="text-sm text-gray-600">Avg Note Length</span>
                  <span className="text-lg font-bold text-gray-900">{parseFloat(contentData.statistics.avg_note_length).toFixed(0)} chars</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card hover>
              <CardTitle>Popular Tags (Top 10)</CardTitle>
              <div className="mt-4 space-y-2">
                {contentData.popular_tags.map((tag, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span className="text-sm text-gray-900">{tag.name}</span>
                    </div>
                    <Badge variant="default">{tag.usage_count}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card hover>
              <CardTitle>Popular Categories (Top 10)</CardTitle>
              <div className="mt-4 space-y-2">
                {contentData.popular_categories.map((category) => (
                  <div key={category.category_id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm text-gray-900">{category.name}</span>
                    </div>
                    <Badge variant="info">{category.task_count} tasks</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

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

function AdminIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

function TranscriptionIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
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
