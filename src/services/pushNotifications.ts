import { apiFetchData } from './api';
import { unwrapData } from '@/lib/api-response';
import {
  NotificationRecipient,
  NotificationTemplate,
  PushNotificationSendResult,
  PushNotificationStats,
  ScheduledNotificationCampaign,
} from '@/lib/types';

export async function getPushNotificationStats(token: string): Promise<PushNotificationStats> {
  const response = await apiFetchData<PushNotificationStats>('/admin/push-notifications/stats', { token });
  return unwrapData(response);
}

export async function getNotificationTemplates(token: string, locale = 'en'): Promise<NotificationTemplate[]> {
  const response = await apiFetchData<{ templates: NotificationTemplate[] }>(
    `/admin/push-notifications/templates?locale=${locale}`,
    { token }
  );
  return unwrapData(response).templates;
}

export async function getScheduledNotifications(token: string): Promise<ScheduledNotificationCampaign[]> {
  const response = await apiFetchData<{ scheduled: ScheduledNotificationCampaign[] }>(
    '/admin/push-notifications/scheduled',
    { token }
  );
  return unwrapData(response).scheduled;
}

export async function getNotificationRecipients(
  token: string,
  search = ''
): Promise<NotificationRecipient[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await apiFetchData<{ recipients: NotificationRecipient[] }>(
    `/admin/push-notifications/recipients${query}`,
    { token }
  );
  return unwrapData(response).recipients;
}

export async function sendPushNotification(
  token: string,
  payload: {
    user_id?: number | null;
    email?: string | null;
    broadcast?: boolean;
    audience?: string | null;
    template_key?: string | null;
    title?: string;
    message?: string;
    type?: string;
    priority?: string;
    send_push?: boolean;
  }
): Promise<PushNotificationSendResult> {
  const response = await apiFetchData<PushNotificationSendResult>('/admin/push-notifications/send', {
    token,
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrapData(response);
}

export async function createScheduledNotification(
  token: string,
  payload: Record<string, unknown>
): Promise<ScheduledNotificationCampaign> {
  const response = await apiFetchData<ScheduledNotificationCampaign>('/admin/push-notifications/scheduled', {
    token,
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return unwrapData(response);
}

export async function enablePresetCampaigns(token: string): Promise<ScheduledNotificationCampaign[]> {
  const response = await apiFetchData<{ created: ScheduledNotificationCampaign[] }>(
    '/admin/push-notifications/presets',
    { token, method: 'POST', body: JSON.stringify({}) }
  );
  return unwrapData(response).created;
}

export async function updateScheduledNotification(
  token: string,
  id: number,
  payload: Record<string, unknown>
): Promise<ScheduledNotificationCampaign> {
  const response = await apiFetchData<ScheduledNotificationCampaign>(
    `/admin/push-notifications/scheduled/${id}`,
    { token, method: 'PATCH', body: JSON.stringify(payload) }
  );
  return unwrapData(response);
}

export async function deleteScheduledNotification(token: string, id: number): Promise<void> {
  await apiFetchData(`/admin/push-notifications/scheduled/${id}`, {
    token,
    method: 'DELETE',
  });
}
