'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProfile, AdminNotification } from '@/lib/types';
import Button from '@/components/ui/Button';
import { formatDateTime } from '@/lib/format';

interface HeaderProps {
  onMenuClick: () => void;
  profile?: AdminProfile | null;
  notifications?: {
    notifications: AdminNotification[];
    unread_count: number;
    active_sessions: number;
  } | null;
}

export default function Header({ onMenuClick, profile, notifications }: HeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const adminName = profile?.user?.name ?? 'Admin User';
  const adminRole = profile?.role === 'admin' ? 'Super Admin' : 'User';
  const adminInitial = adminName.charAt(0).toUpperCase();
  const unreadCount = notifications?.unread_count ?? 0;
  const items = notifications?.notifications ?? [];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-20 glass border-b border-purple-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-purple-50 rounded-xl transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back{adminName !== 'Admin User' ? `, ${adminName.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your platform today.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-600 hover:bg-purple-50 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500">
                  {items.length ? `${items.length} recent activities` : 'No recent activity'}
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {items.length > 0 ? (
                  items.map((n) => (
                    <div key={n.id} className="p-4 hover:bg-purple-50 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 capitalize">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.description || n.user?.email || ''}</p>
                      <p className="text-xs text-purple-600 mt-1">{formatDateTime(n.created_at)}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-gray-400">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout} loading={loggingOut}>
          Logout
        </Button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{adminName}</p>
            <p className="text-xs text-gray-500">{adminRole}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            {adminInitial}
          </div>
        </div>
      </div>
    </header>
  );
}
