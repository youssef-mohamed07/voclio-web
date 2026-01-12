import { requireAuth } from '@/lib/auth';
import AdminShell from '@/components/layout/AdminShell';
import { ToastProvider } from '@/components/ui/Toast';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
