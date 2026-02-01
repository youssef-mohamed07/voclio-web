'use client';

import { useEffect, useState } from 'react';
import { getUsers } from '@/services/users';
import { getToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import UsersClient from './UsersClient';
import { PaginatedResponse, User } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    subscription_tier?: string;
    is_active?: string;
    status?: string;
    sortBy?: string;
    order?: string;
  }>;
}

export default function UsersPage({ searchParams }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState<PaginatedResponse<User> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    search: '',
    subscription_tier: '',
    is_active: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const params = await searchParams;
      const page = parseInt(params.page || '1', 10);
      const search = params.search || '';
      const subscription_tier = params.subscription_tier || '';
      const is_active = params.is_active;
      const status = params.status || 'all';
      const sortBy = params.sortBy || 'created_at';
      const order = params.order || 'DESC';

      setFilters({ page, search, subscription_tier, is_active: params.is_active || '' });

      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await getUsers(token, {
          page,
          limit: 10,
          search,
          subscription_tier,
          is_active: is_active ? is_active === 'true' : undefined,
          status: status as any,
          sortBy: sortBy as any,
          order: order as any,
        });
        setUsersData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <UsersClient
      initialData={usersData}
      initialError={error}
      initialFilters={filters}
    />
  );
}
