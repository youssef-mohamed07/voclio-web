'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarSyncRow, IntegrationsOverview } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import DataTable from '@/components/tables/DataTable';
import { useToast } from '@/components/ui/Toast';
import { formatDateTime, formatNumber } from '@/lib/format';

interface IntegrationsClientProps {
  overview: IntegrationsOverview | null;
  calendarData: {
    data: CalendarSyncRow[];
    pagination: { page: number; limit: number; total: number; total_pages: number };
  } | null;
  page: number;
  status: string;
  initialError: string | null;
}

const FEATURE_LABELS: Record<string, string> = {
  voice_recording_enabled: 'Voice Recording',
  google_calendar_enabled: 'Google Calendar',
  home_widgets_enabled: 'Home Widgets',
  ai_suggestions_enabled: 'AI Suggestions',
  webex_integration_enabled: 'Webex Integration',
  onboarding_enabled: 'Onboarding Flow',
};

export default function IntegrationsClient({
  overview,
  calendarData,
  page,
  status,
  initialError,
}: IntegrationsClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.entries(overview?.feature_flags ?? {}).forEach(([key, val]) => {
      initial[key] = val.value;
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);

  const handleFlagToggle = (key: string, value: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveFlags = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/proxy/admin/integrations/feature-flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flags }),
      });
      if (!res.ok) throw new Error('Failed to save');
      showToast('success', 'Feature flags updated');
      router.refresh();
    } catch {
      showToast('error', 'Failed to save feature flags');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusFilter = (newStatus: string) => {
    router.push(`${ROUTES.INTEGRATIONS}?status=${newStatus}&page=1`);
  };

  if (initialError) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500">{initialError}</p>
      </Card>
    );
  }

  const services = overview?.services;
  const oauth = overview?.oauth;

  const calendarColumns = [
    {
      key: 'user',
      header: 'User',
      render: (row: CalendarSyncRow) => (
        <div>
          <p className="font-medium text-gray-900">{row.user_name || '—'}</p>
          <p className="text-xs text-gray-500">{row.user_email}</p>
        </div>
      ),
    },
    { key: 'calendar_name', header: 'Calendar', render: (r: CalendarSyncRow) => r.calendar_name || r.calendar_id },
    {
      key: 'sync_status',
      header: 'Status',
      render: (r: CalendarSyncRow) => (
        <Badge variant={r.sync_status === 'active' ? 'success' : r.sync_status === 'error' ? 'error' : 'warning'} dot>
          {r.sync_status}
        </Badge>
      ),
    },
    {
      key: 'last_sync_at',
      header: 'Last Sync',
      render: (r: CalendarSyncRow) => (r.last_sync_at ? formatDateTime(r.last_sync_at) : '—'),
    },
    {
      key: 'error_message',
      header: 'Error',
      render: (r: CalendarSyncRow) =>
        r.error_message ? (
          <span className="text-xs text-red-600 truncate max-w-[200px] block">{r.error_message}</span>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations & Features</h1>
          <p className="text-gray-500 mt-1">Manage OAuth, calendar sync, voice AI, and feature toggles</p>
        </div>
        <Link href={ROUTES.SYSTEM}>
          <Button variant="secondary">System Health →</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="OAuth Users"
          value={formatNumber(oauth?.total ?? 0)}
          change={`${oauth?.google ?? 0} Google · ${oauth?.webex ?? 0} Webex`}
          changeType="neutral"
          icon={<OAuthIcon className="w-6 h-6" />}
          gradient="purple"
        />
        <StatCard
          title="Voice Recordings"
          value={formatNumber(overview?.voice.total_recordings ?? 0)}
          change={`${overview?.voice.transcriptions_this_week ?? 0} transcriptions this week`}
          changeType="neutral"
          icon={<MicIcon className="w-6 h-6" />}
          gradient="blue"
        />
        <StatCard
          title="Calendar Syncs"
          value={formatNumber(overview?.calendar.active_syncs ?? 0)}
          change={`${overview?.calendar.error_syncs ?? 0} errors`}
          changeType={(overview?.calendar.error_syncs ?? 0) > 0 ? 'negative' : 'neutral'}
          icon={<CalendarIcon className="w-6 h-6" />}
          gradient="green"
        />
        <StatCard
          title="Focus Sessions"
          value={formatNumber(overview?.focus.total_sessions ?? 0)}
          change={`${overview?.focus.total_minutes ?? 0} total minutes`}
          changeType="neutral"
          icon={<FocusIcon className="w-6 h-6" />}
          gradient="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover>
          <CardTitle>OAuth Breakdown</CardTitle>
          <div className="mt-4 space-y-3">
            <OAuthRow label="Google" count={oauth?.google ?? 0} configured={services?.oauth.google} />
            <OAuthRow label="Facebook" count={oauth?.facebook ?? 0} configured={services?.oauth.facebook} />
            <OAuthRow label="Webex" count={oauth?.webex ?? 0} configured={services?.oauth.webex} />
            <OAuthRow label="Email Signup" count={oauth?.email_signup ?? 0} configured />
          </div>
        </Card>

        <Card hover>
          <CardTitle>Services Status</CardTitle>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ServiceBadge label="Database" ok={services?.database === 'healthy'} />
            <ServiceBadge label="Redis" ok={services?.redis.connected} hint={services?.redis.enabled ? 'enabled' : 'disabled'} />
            <ServiceBadge label="Email" ok={services?.email.configured} hint={services?.email.provider} />
            <ServiceBadge label="Storage" ok={services?.storage.configured} hint={services?.storage.provider} />
            <ServiceBadge label="Gemini" ok={services?.ai.gemini} />
            <ServiceBadge label="OpenRouter" ok={services?.ai.openrouter} />
            <ServiceBadge label="AssemblyAI" ok={services?.ai.assemblyai} />
          </div>
        </Card>
      </div>

      <Card hover>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>Feature Flags</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Toggle mobile and integration features for all users</p>
          </div>
          <Button onClick={handleSaveFlags} loading={saving}>
            Save Flags
          </Button>
        </div>
        <div className="divide-y divide-gray-100">
          {Object.entries(flags).map(([key, value]) => (
            <div key={key} className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">{FEATURE_LABELS[key] ?? key}</p>
                <p className="text-sm text-gray-500">
                  {overview?.feature_flags[key]?.description || key}
                </p>
              </div>
              <Toggle checked={value} onChange={(checked) => handleFlagToggle(key, checked)} />
            </div>
          ))}
        </div>
      </Card>

      <Card hover>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <CardTitle>Google Calendar Connections</CardTitle>
          <select
            value={status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="error">Error</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <DataTable
          columns={calendarColumns}
          data={calendarData?.data ?? []}
          keyExtractor={(row) => String(row.sync_id)}
          emptyMessage="No calendar connections yet"
        />
        {(calendarData?.pagination.total_pages ?? 1) > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => router.push(`${ROUTES.INTEGRATIONS}?status=${status}&page=${page - 1}`)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500 self-center">
              Page {page} of {calendarData?.pagination.total_pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= (calendarData?.pagination.total_pages ?? 1)}
              onClick={() => router.push(`${ROUTES.INTEGRATIONS}?status=${status}&page=${page + 1}`)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function OAuthRow({ label, count, configured }: { label: string; count: number; configured?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {configured !== undefined && (
          <Badge variant={configured ? 'success' : 'warning'} size="sm">
            {configured ? 'configured' : 'not set'}
          </Badge>
        )}
      </div>
      <span className="font-semibold text-gray-900">{count}</span>
    </div>
  );
}

function ServiceBadge({ label, ok, hint }: { label: string; ok?: boolean; hint?: string }) {
  return (
    <div className="p-3 rounded-xl bg-purple-50">
      <div className="flex items-center gap-2">
        <Badge variant={ok ? 'success' : 'error'} dot size="sm" />
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1 capitalize">{hint}</p>}
    </div>
  );
}

function OAuthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
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

function FocusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
