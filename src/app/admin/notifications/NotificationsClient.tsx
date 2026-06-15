'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardTitle, StatCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/tables/DataTable';
import { useToast } from '@/components/ui/Toast';
import {
  NotificationRecipient,
  NotificationTemplate,
  PushNotificationStats,
  ScheduledNotificationCampaign,
} from '@/lib/types';
import { formatNumber } from '@/lib/format';

interface NotificationsClientProps {
  stats: PushNotificationStats | null;
  recipients: NotificationRecipient[] | null;
  templates: NotificationTemplate[] | null;
  scheduled: ScheduledNotificationCampaign[] | null;
  initialError: string | null;
}

const AUDIENCE_OPTIONS = [
  { value: 'all_active', label: 'All active users' },
  { value: 'with_push_token', label: 'Users with push token' },
  { value: 'with_pending_tasks', label: 'Users with open tasks' },
  { value: 'with_tasks_due_today', label: 'Users with tasks due today' },
  { value: 'with_overdue_tasks', label: 'Users with overdue tasks' },
  { value: 'inactive_7d', label: 'Inactive 7+ days' },
];

export default function NotificationsClient({
  stats,
  recipients,
  templates,
  scheduled,
  initialError,
}: NotificationsClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [targetMode, setTargetMode] = useState<'user' | 'audience' | 'broadcast'>('user');
  const [userId, setUserId] = useState('');
  const [audience, setAudience] = useState('with_pending_tasks');
  const [templateKey, setTemplateKey] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('system');
  const [priority, setPriority] = useState('normal');
  const [sendPush, setSendPush] = useState(true);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<Record<string, unknown> | null>(null);

  const [scheduleName, setScheduleName] = useState('');
  const [scheduleRecurrence, setScheduleRecurrence] = useState<'once' | 'daily' | 'weekly'>('daily');
  const [scheduleAt, setScheduleAt] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [enablingPresets, setEnablingPresets] = useState(false);

  const selectedTemplate = useMemo(
    () => templates?.find((item) => item.key === templateKey) ?? null,
    [templates, templateKey]
  );

  const templateOptions = useMemo(
    () => [
      { value: '', label: 'Custom message' },
      ...(templates ?? []).map((template) => ({
        value: template.key,
        label: `[${template.category}] ${template.label}`,
      })),
    ],
    [templates]
  );

  const userOptions = useMemo(
    () => [
      { value: '', label: 'Select user...' },
      ...(recipients ?? []).map((recipient) => ({
        value: String(recipient.user_id),
        label: `${recipient.name || recipient.email} (${recipient.email})${recipient.device_tokens ? ' · push ready' : ''}`,
      })),
    ],
    [recipients]
  );

  const applyTemplate = (key: string) => {
    setTemplateKey(key);
    const template = templates?.find((item) => item.key === key);
    if (!template) {
      return;
    }
    setTitle(template.preview.title);
    setMessage(template.preview.message);
    setType(template.notificationType);
    setPriority(template.priority);
    if (targetMode === 'audience') {
      setAudience(template.audience);
    }
  };

  const handleSend = async () => {
    if (!templateKey && (!title.trim() || !message.trim())) {
      showToast('error', 'Select a template or enter title and message');
      return;
    }

    if (targetMode === 'user' && !userId) {
      showToast('error', 'Select a user or change target mode');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/proxy/admin/push-notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: targetMode === 'user' ? Number(userId) : null,
          broadcast: targetMode === 'broadcast',
          audience: targetMode === 'audience' ? audience : null,
          template_key: templateKey || null,
          title: title.trim(),
          message: message.trim(),
          type,
          priority,
          send_push: sendPush,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || json?.message || 'Failed to send notification');
      }

      const data = json.data ?? json;
      setLastResult(data);
      showToast(
        'success',
        `Sent to ${data.recipients ?? 0} user(s). Push delivered: ${data.push_sent ?? 0}`
      );
      if (!templateKey) {
        setTitle('');
        setMessage('');
      }
      router.refresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleName.trim()) {
      showToast('error', 'Campaign name is required');
      return;
    }
    if (!templateKey && (!title.trim() || !message.trim())) {
      showToast('error', 'Select a template or enter title and message');
      return;
    }

    setScheduling(true);
    try {
      const res = await fetch('/api/proxy/admin/push-notifications/scheduled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scheduleName.trim(),
          template_key: templateKey || null,
          title: templateKey ? null : title.trim(),
          message: templateKey ? null : message.trim(),
          notification_type: selectedTemplate?.notificationType ?? type,
          priority: selectedTemplate?.priority ?? priority,
          audience: targetMode === 'user' ? 'single_user' : targetMode === 'broadcast' ? 'all_active' : audience,
          target_user_id: targetMode === 'user' ? Number(userId) : null,
          recurrence: scheduleRecurrence,
          scheduled_at: scheduleAt ? new Date(scheduleAt).toISOString() : new Date().toISOString(),
          send_push: sendPush,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || json?.message || 'Failed to schedule notification');
      }
      showToast('success', 'Scheduled campaign created');
      setScheduleName('');
      router.refresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to schedule notification');
    } finally {
      setScheduling(false);
    }
  };

  const handleEnablePresets = async () => {
    setEnablingPresets(true);
    try {
      const res = await fetch('/api/proxy/admin/push-notifications/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || json?.message || 'Failed to enable presets');
      }
      showToast('success', 'Ready-made daily/weekly campaigns enabled');
      router.refresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to enable presets');
    } finally {
      setEnablingPresets(false);
    }
  };

  const handleToggleScheduled = async (row: ScheduledNotificationCampaign) => {
    try {
      const res = await fetch(`/api/proxy/admin/push-notifications/scheduled/${row.scheduled_notification_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !row.is_active }),
      });
      if (!res.ok) throw new Error('Failed to update campaign');
      router.refresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to update campaign');
    }
  };

  const handleDeleteScheduled = async (id: number) => {
    try {
      const res = await fetch(`/api/proxy/admin/push-notifications/scheduled/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete campaign');
      showToast('success', 'Campaign deleted');
      router.refresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to delete campaign');
    }
  };

  if (initialError) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500">{initialError}</p>
      </Card>
    );
  }

  const recipientColumns = [
    {
      key: 'user',
      header: 'User',
      render: (row: NotificationRecipient) => (
        <div>
          <p className="font-medium text-gray-900">{row.name || '—'}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'device_tokens',
      header: 'Devices',
      render: (row: NotificationRecipient) => (
        <Badge variant={row.device_tokens > 0 ? 'success' : 'warning'} dot>
          {row.device_tokens > 0 ? `${row.device_tokens} registered` : 'No push token'}
        </Badge>
      ),
    },
    {
      key: 'platforms',
      header: 'Platforms',
      render: (row: NotificationRecipient) =>
        row.platforms.length ? row.platforms.join(', ') : '—',
    },
  ];

  const scheduledColumns = [
    {
      key: 'name',
      header: 'Campaign',
      render: (row: ScheduledNotificationCampaign) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.template_key || 'Custom'}</p>
        </div>
      ),
    },
    {
      key: 'recurrence',
      header: 'Recurrence',
      render: (row: ScheduledNotificationCampaign) => (
        <Badge variant="default">{row.recurrence}</Badge>
      ),
    },
    {
      key: 'next_run_at',
      header: 'Next run',
      render: (row: ScheduledNotificationCampaign) =>
        new Date(row.next_run_at).toLocaleString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ScheduledNotificationCampaign) => (
        <Badge variant={row.is_active ? 'success' : 'warning'} dot>
          {row.is_active ? 'Active' : 'Paused'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ScheduledNotificationCampaign) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => handleToggleScheduled(row)}>
            {row.is_active ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="secondary" onClick={() => handleDeleteScheduled(row.scheduled_notification_id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Ready templates, scheduled engagement, and task/reminder-linked alerts
          </p>
        </div>
        <Button onClick={handleEnablePresets} disabled={enablingPresets}>
          {enablingPresets ? 'Enabling...' : 'Enable ready presets'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Firebase Push"
          value={stats?.push_configured ? 'Ready' : 'Off'}
          change={stats?.push_configured ? 'Service account connected' : 'Add Firebase credentials'}
          changeType={stats?.push_configured ? 'positive' : 'negative'}
          icon={<BellIcon className="w-6 h-6" />}
          gradient={stats?.push_configured ? 'green' : 'orange'}
        />
        <StatCard
          title="Device Tokens"
          value={formatNumber(stats?.device_tokens ?? 0)}
          change="Registered devices"
          changeType="neutral"
          icon={<BellIcon className="w-6 h-6" />}
          gradient="purple"
        />
        <StatCard
          title="Users With Push"
          value={formatNumber(stats?.users_with_tokens ?? 0)}
          change="Can receive push alerts"
          changeType="neutral"
          icon={<BellIcon className="w-6 h-6" />}
          gradient="blue"
        />
        <StatCard
          title="Scheduled"
          value={formatNumber(scheduled?.filter((item) => item.is_active).length ?? 0)}
          change="Active campaigns"
          changeType="neutral"
          icon={<BellIcon className="w-6 h-6" />}
          gradient="pink"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Send Notification</CardTitle>
          <div className="space-y-4 mt-4">
            <Select
              label="Template"
              value={templateKey}
              onChange={(e) => applyTemplate(e.target.value)}
              options={templateOptions}
            />

            {selectedTemplate && (
              <div className="rounded-lg bg-purple-50 border border-purple-100 p-3 text-sm text-gray-700">
                <p className="font-medium text-purple-900">{selectedTemplate.preview.title}</p>
                <p className="mt-1">{selectedTemplate.preview.message}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Suggested: {selectedTemplate.suggestedRecurrence} at {selectedTemplate.suggestedTime}
                </p>
              </div>
            )}

            <Select
              label="Target"
              value={targetMode}
              onChange={(e) => setTargetMode(e.target.value as 'user' | 'audience' | 'broadcast')}
              options={[
                { value: 'user', label: 'Single user' },
                { value: 'audience', label: 'Smart audience' },
                { value: 'broadcast', label: 'All active users' },
              ]}
            />

            {targetMode === 'user' && (
              <Select
                label="User"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                options={userOptions}
              />
            )}

            {targetMode === 'audience' && (
              <Select
                label="Audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                options={AUDIENCE_OPTIONS}
              />
            )}

            {!templateKey && (
              <>
                <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Notification message"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
                  />
                </div>
              </>
            )}

            {!templateKey && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  options={[
                    { value: 'system', label: 'System' },
                    { value: 'general', label: 'General' },
                    { value: 'reminder', label: 'Reminder' },
                    { value: 'task', label: 'Task' },
                    { value: 'achievement', label: 'Achievement' },
                  ]}
                />
                <Select
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                />
              </div>
            )}

            <Toggle label="Send push notification" checked={sendPush} onChange={setSendPush} />

            <Button onClick={handleSend} disabled={sending} className="w-full sm:w-auto">
              {sending ? 'Sending...' : 'Send now'}
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Schedule Campaign</CardTitle>
          <div className="space-y-4 mt-4">
            <Input
              label="Campaign name"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="Morning motivation"
            />
            <Input
              label="First run"
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
            />
            <Select
              label="Recurrence"
              value={scheduleRecurrence}
              onChange={(e) => setScheduleRecurrence(e.target.value as 'once' | 'daily' | 'weekly')}
              options={[
                { value: 'once', label: 'Once' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
              ]}
            />
            <p className="text-xs text-gray-500">
              Uses the selected template/audience above. Task and reminder templates auto-link to user tasks.
            </p>
            <Button onClick={handleSchedule} disabled={scheduling} className="w-full sm:w-auto">
              {scheduling ? 'Scheduling...' : 'Schedule campaign'}
            </Button>

            <div className="border-t pt-4">
              <CardTitle>Last Result</CardTitle>
              {lastResult ? (
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <p>Recipients: <strong>{String(lastResult.recipients ?? 0)}</strong></p>
                  <p>In-app created: <strong>{String(lastResult.notifications_created ?? 0)}</strong></p>
                  <p>Push sent: <strong>{String(lastResult.push_sent ?? 0)}</strong></p>
                  <p>Push failed: <strong>{String(lastResult.push_failed ?? 0)}</strong></p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">Send a notification to see delivery results here.</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Scheduled Campaigns</CardTitle>
        <div className="mt-4">
          <DataTable
            columns={scheduledColumns}
            data={scheduled ?? []}
            keyExtractor={(row) => String(row.scheduled_notification_id)}
            emptyMessage="No scheduled campaigns yet. Enable presets or schedule one above."
          />
        </div>
      </Card>

      <Card>
        <CardTitle>Users & Push Readiness</CardTitle>
        <div className="mt-4">
          <DataTable
            columns={recipientColumns}
            data={recipients ?? []}
            keyExtractor={(row) => String(row.user_id)}
            emptyMessage="No users found"
          />
        </div>
      </Card>
    </div>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
