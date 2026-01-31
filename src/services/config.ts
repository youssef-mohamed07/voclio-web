import { apiFetch } from './api';
import { AppConfig } from '@/lib/types';
import { mockConfigs } from '@/lib/mock-data';

export async function getConfig(token: string): Promise<AppConfig[]> {
  try {
    return await apiFetch<AppConfig[]>('/admin/config', { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return mockConfigs;
  }
}

export async function updateConfig(
  token: string,
  configs: { key: string; value: string | boolean | number }[]
): Promise<AppConfig[]> {
  try {
    return await apiFetch<AppConfig[]>('/admin/config', {
      token,
      method: 'PUT',
      body: JSON.stringify({ configs }),
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return mockConfigs.map(config => {
      const update = configs.find(c => c.key === config.key);
      return update ? { ...config, value: update.value, updated_at: new Date().toISOString() } : config;
    });
  }
}
