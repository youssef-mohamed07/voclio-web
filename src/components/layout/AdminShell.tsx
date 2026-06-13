'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AdminProfile } from '@/lib/types';

interface AdminShellProps {
  children: React.ReactNode;
  profile?: AdminProfile | null;
  navLabels?: Record<string, string>;
}

export default function AdminShell({ children, profile, navLabels }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} labels={navLabels} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} profile={profile} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
