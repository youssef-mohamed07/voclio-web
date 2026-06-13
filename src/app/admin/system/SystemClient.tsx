'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SystemHealth } from '@/lib/types';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { formatDateTime } from '@/lib/format';

interface SystemClientProps {
  health: SystemHealth | null;
  initialError: string | null;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SystemClient({ health, initialError }: SystemClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [days, setDays] = useState('90');
  const [clearing, setClearing] = useState(false);

  const handleClearOldData = async () => {
    setClearing(true);
    try {
      const res = await fetch('/api/proxy/admin/system/clear-old-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: parseInt(days, 10) || 90 }),
      });
      if (!res.ok) throw new Error('Failed to clear old data');
      const json = await res.json();
      const data = json.data ?? json;
      showToast(
        'success',
        `Cleared ${data.deleted_sessions ?? 0} sessions and ${data.deleted_notifications ?? 0} notifications`
      );
      router.refresh();
    } catch {
      showToast('error', 'Failed to clear old data');
    } finally {
      setClearing(false);
    }
  };

  if (initialError) {
    return (
      <Card className="text-center py-12">
        <p className="text-red-500">{initialError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System</h1>
        <p className="text-gray-500 mt-1">Server health and maintenance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Status</p>
          <div className="mt-2">
            <Badge variant={health?.status === 'operational' ? 'success' : 'warning'} dot>
              {health?.status ?? '—'}
            </Badge>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Database</p>
          <div className="mt-2">
            <Badge variant={health?.database === 'healthy' ? 'success' : 'error'} dot>
              {health?.database ?? '—'}
            </Badge>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Uptime</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {health ? formatUptime(health.uptime) : '—'}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Active Sessions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{health?.active_sessions ?? '—'}</p>
        </Card>
      </div>

      {health?.services && (
        <Card hover>
          <CardTitle>Connected Services</CardTitle>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <ServiceStatus label="Redis" ok={health.services.redis.connected} detail={health.services.redis.enabled ? 'enabled' : 'disabled'} />
            <ServiceStatus label="Email" ok={health.services.email.configured} detail={health.services.email.provider} />
            <ServiceStatus label="Storage" ok={health.services.storage.configured} detail={health.services.storage.provider} />
            <ServiceStatus label="Gemini AI" ok={health.services.ai.gemini} />
            <ServiceStatus label="OpenRouter" ok={health.services.ai.openrouter} />
            <ServiceStatus label="AssemblyAI" ok={health.services.ai.assemblyai} />
            <ServiceStatus label="Google OAuth" ok={health.services.oauth.google} />
            <ServiceStatus label="Webex OAuth" ok={health.services.oauth.webex} />
          </div>
        </Card>
      )}

      {health?.memory_usage && (
        <Card hover>
          <CardTitle>Memory Usage</CardTitle>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="RSS" value={formatBytes(health.memory_usage.rss)} />
            <Stat label="Heap Total" value={formatBytes(health.memory_usage.heapTotal)} />
            <Stat label="Heap Used" value={formatBytes(health.memory_usage.heapUsed)} />
            <Stat label="External" value={formatBytes(health.memory_usage.external)} />
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Last checked: {formatDateTime(health.timestamp)}
          </p>
        </Card>
      )}

      <Card hover>
        <CardTitle>Maintenance</CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          Clear expired sessions and old read notifications older than the specified days.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 items-end">
          <Input
            label="Retention (days)"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="danger" onClick={handleClearOldData} loading={clearing}>
            Clear Old Data
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-purple-50 rounded-xl">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ServiceStatus({ label, ok, detail }: { label: string; ok?: boolean; detail?: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2">
        <Badge variant={ok ? 'success' : 'error'} dot size="sm">
          {ok ? 'OK' : 'Off'}
        </Badge>
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
      {detail && <p className="text-xs text-gray-500 mt-1 capitalize">{detail}</p>}
    </div>
  );
}
