'use client';

import AdminShell from '@/components/layout/AdminShell';
import { ToastProvider } from '@/components/ui/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
