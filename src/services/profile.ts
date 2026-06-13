import { apiFetch } from './api';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

export interface UserProfile {
  user_id: number;
  email: string;
  name: string;
  phone_number?: string;
  is_active: boolean;
  is_admin: boolean;
  email_verified: boolean;
  oauth_provider?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

export async function getCurrentUser(token: string): Promise<UserProfile> {
  const response = await apiFetch<BackendResponse<UserProfile>>('/auth/profile', { token });
  return response.data || response as any;
}

export async function getNotifications(token: string, limit: number = 10): Promise<Notification[]> {
  const response = await apiFetch<BackendResponse<Notification[]>>(`/notifications?limit=${limit}`, { token });
  return response.data || response as any;
}

export async function markNotificationAsRead(token: string, notificationId: number): Promise<void> {
  await apiFetch(`/notifications/${notificationId}/read`, {
    token,
    method: 'PUT',
  });
}

export async function markAllNotificationsAsRead(token: string): Promise<void> {
  await apiFetch('/notifications/read-all', {
    token,
    method: 'PUT',
  });
}
