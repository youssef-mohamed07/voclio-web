import { requireAuth } from '@/lib/auth';
import { getUsers } from '@/services/users';
import UsersClient from './UsersClient';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    subscription_tier?: string;
    is_active?: string;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const token = await requireAuth();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const subscription_tier = params.subscription_tier || '';
  const is_active = params.is_active === 'true' ? true : params.is_active === 'false' ? false : undefined;

  let usersData = null;
  let error = null;

  try {
    usersData = await getUsers(token, {
      page,
      limit: 10,
      search: search || undefined,
      subscription_tier: subscription_tier || undefined,
      is_active,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load users';
  }

  return (
    <UsersClient
      initialData={usersData}
      initialError={error}
      initialFilters={{ page, search, subscription_tier, is_active: params.is_active || '' }}
    />
  );
}
