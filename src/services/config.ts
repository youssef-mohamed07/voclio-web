import { apiFetch } from './api';
import { AppConfig } from '@/lib/types';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export async function getConfig(token: string): Promise<AppConfig[]> {
  const response = await apiFetch<BackendResponse<AppConfig[]>>('/admin/config', { token });
  return response.data || response as any;
}

export async function updateConfig(
  token: string,
  configs: { key: string; value: string | boolean | number }[]
): Promise<AppConfig[]> {
  const response = await apiFetch<BackendResponse<AppConfig[]>>('/admin/config', {
    token,
    method: 'PUT',
    body: JSON.stringify({ configs }),
  });
  return response.data || response as any;
}
