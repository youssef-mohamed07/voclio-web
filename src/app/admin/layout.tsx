import { redirect } from 'next/navigation';
import AdminShell from '@/components/layout/AdminShell';
import { ToastProvider } from '@/components/ui/Toast';
import { isAuthenticated } from '@/lib/auth';
import { getAdminProfile, getNotifications, getUiStrings } from '@/services/dashboard';
import { requireAuth } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login');
  }

  let profile = null;
  let notifications: Awaited<ReturnType<typeof getNotifications>> | null = null;
  let navLabels: Record<string, string> = {};

  try {
    const token = await requireAuth();
    [profile, notifications, navLabels] = await Promise.all([
      getAdminProfile(token),
      getNotifications(token, 5),
      getUiStrings(token, 'en'),
    ]);
  } catch {
    redirect('/login');
  }

  return (
    <ToastProvider>
      <AdminShell profile={profile} notifications={notifications} navLabels={navLabels}>
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
