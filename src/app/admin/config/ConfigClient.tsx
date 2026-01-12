'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppConfig } from '@/lib/types';
import Card, { CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Toggle from '@/components/ui/Toggle';
import { useToast } from '@/components/ui/Toast';

interface ConfigClientProps {
  initialData: AppConfig[] | null;
  initialError: string | null;
}

export default function ConfigClient({ initialData, initialError }: ConfigClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [configs, setConfigs] = useState<AppConfig[]>(initialData || []);
  const [originalConfigs] = useState<AppConfig[]>(initialData || []);
  const [saving, setSaving] = useState(false);

  const hasChanges = JSON.stringify(configs) !== JSON.stringify(originalConfigs);

  const updateConfig = (key: string, value: string | boolean | number) => {
    setConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, value } : c))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const changedConfigs = configs
        .filter((c, i) => JSON.stringify(c.value) !== JSON.stringify(originalConfigs[i]?.value))
        .map((c) => ({ key: c.key, value: c.value }));

      const res = await fetch('/api/proxy/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: changedConfigs }),
      });

      if (!res.ok) throw new Error('Failed to save configuration');
      showToast('success', 'Configuration saved successfully');
      router.refresh();
    } catch {
      showToast('error', 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfigs(originalConfigs);
  };

  const renderConfigInput = (config: AppConfig) => {
    switch (config.type) {
      case 'boolean':
        return (
          <Toggle
            checked={config.value as boolean}
            onChange={(checked) => updateConfig(config.key, checked)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={String(config.value)}
            onChange={(e) => updateConfig(config.key, Number(e.target.value))}
            className="max-w-xs"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={String(config.value)}
            onChange={(e) => updateConfig(config.key, e.target.value)}
            className="max-w-md"
          />
        );
    }
  };

  if (initialError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
          <p className="text-gray-500 mt-1">Manage application settings</p>
        </div>
        <Card>
          <div className="text-center text-red-500 py-8">{initialError}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
          <p className="text-gray-500 mt-1">Manage application settings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReset} disabled={!hasChanges || saving}>
            Reset
          </Button>
          <Button onClick={handleSave} loading={saving} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>Configure system-wide settings for your application</CardDescription>

        <div className="mt-6 divide-y divide-gray-100">
          {configs.map((config) => (
            <div key={config.key} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{formatConfigKey(config.key)}</p>
                <p className="text-sm text-gray-500 mt-1">{config.description}</p>
              </div>
              <div className="sm:ml-4">{renderConfigInput(config)}</div>
            </div>
          ))}
        </div>

        {configs.length === 0 && (
          <div className="text-center text-gray-500 py-8">No configuration options available</div>
        )}
      </Card>
    </div>
  );
}

function formatConfigKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
