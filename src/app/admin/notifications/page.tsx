import { requireAuth } from '@/lib/auth';
import {
  getNotificationRecipients,
  getNotificationTemplates,
  getPushNotificationStats,
  getScheduledNotifications,
} from '@/services/pushNotifications';
import NotificationsClient from './NotificationsClient';

export default async function NotificationsPage() {
  let stats = null;
  let recipients = null;
  let templates = null;
  let scheduled = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    [stats, recipients, templates, scheduled] = await Promise.all([
      getPushNotificationStats(token),
      getNotificationRecipients(token),
      getNotificationTemplates(token, 'en'),
      getScheduledNotifications(token),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load notifications panel';
  }

  return (
    <NotificationsClient
      stats={stats}
      recipients={recipients}
      templates={templates}
      scheduled={scheduled}
      initialError={error}
    />
  );
}
