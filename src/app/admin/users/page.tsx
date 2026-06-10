import { requireAuth } from '@/lib/auth';
import { getUsers } from '@/services/users';
import UsersClient from './UsersClient';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const status = params.status || '';

  let usersData = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    usersData = await getUsers(token, { page, limit: 10, search, status });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load users';
  }

  return (
    <UsersClient
      initialData={usersData}
      initialError={error}
      initialFilters={{ page, search, status }}
    />
  );
}
