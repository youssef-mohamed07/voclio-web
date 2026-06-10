'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AdminProfile, AdminNotification } from '@/lib/types';

interface AdminShellProps {
  children: React.ReactNode;
  profile?: AdminProfile | null;
  notifications?: {
    notifications: AdminNotification[];
    unread_count: number;
    active_sessions: number;
  } | null;
  navLabels?: Record<string, string>;
}

export default function AdminShell({ children, profile, notifications, navLabels }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} labels={navLabels} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          profile={profile}
          notifications={notifications}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
