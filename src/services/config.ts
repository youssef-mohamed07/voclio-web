import { apiFetchData } from './api';
import { unwrapData } from '@/lib/api-response';
import { mapConfigItem } from '@/lib/mappers';
import { AppConfig } from '@/lib/types';

export async function getConfig(token: string): Promise<AppConfig[]> {
  const response = await apiFetchData<{
    items?: Record<string, unknown>[];
    config?: Record<string, Record<string, unknown>>;
  }>('/admin/config', { token });
  const data = unwrapData(response);
  const items = data.items ?? Object.entries(data.config ?? {}).map(([key, val]) => {
    const entry = val as Record<string, unknown>;
    return { config_key: key, config_value: entry.value, description: entry.description, updated_at: entry.updated_at };
  });
  return items.map((item) => mapConfigItem(item as Record<string, unknown>));
}

export async function updateConfig(
  token: string,
  configs: { key: string; value: string | boolean | number }[]
): Promise<AppConfig[]> {
  const config: Record<string, string> = {};
  configs.forEach((c) => {
    config[c.key] = String(c.value);
  });

  await apiFetchData('/admin/config', {
    token,
    method: 'PUT',
    body: JSON.stringify({ config }),
  });

  return getConfig(token);
}
