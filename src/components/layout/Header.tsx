'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VoclioLogo from '@/components/brand/VoclioLogo';
import { AdminProfile } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import Button from '@/components/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  profile?: AdminProfile | null;
}

export default function Header({ onMenuClick, profile }: HeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const adminName = profile?.user?.name ?? 'Admin User';
  const adminRole = profile?.role === 'admin' ? 'Super Admin' : 'User';
  const adminInitial = adminName.charAt(0).toUpperCase();

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
        <Link href={ROUTES.DASHBOARD} className="lg:hidden">
          <VoclioLogo size={36} className="rounded-lg" />
        </Link>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back{adminName !== 'Admin User' ? `, ${adminName.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your platform today.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
