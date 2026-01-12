import { requireAuth } from '@/lib/auth';
import { getApiKeys } from '@/services/api-keys';
import ApiKeysClient from './ApiKeysClient';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ApiKeysPage({ searchParams }: PageProps) {
  const token = await requireAuth();
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);

  let keysData = null;
  let error = null;

  try {
    keysData = await getApiKeys(token, { page, limit: 10 });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load API keys';
  }

  return <ApiKeysClient initialData={keysData} initialError={error} currentPage={page} />;
}
