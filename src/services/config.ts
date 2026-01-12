import { apiFetch } from './api';
import { AppConfig } from '@/lib/types';

export async function getConfig(token: string): Promise<AppConfig[]> {
  return apiFetch<AppConfig[]>('/admin/config', { token });
}

export async function updateConfig(
  token: string,
  configs: { key: string; value: string | boolean | number }[]
): Promise<AppConfig[]> {
  return apiFetch<AppConfig[]>('/admin/config', {
    token,
    method: 'PUT',
    body: JSON.stringify({ configs }),
  });
}
