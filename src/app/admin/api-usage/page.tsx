import { requireAuth } from '@/lib/auth';
import { getApiUsage } from '@/services/api-usage';
import ApiUsageClient from './ApiUsageClient';

interface PageProps {
  searchParams: Promise<{
    start_date?: string;
    end_date?: string;
  }>;
}

export default async function ApiUsagePage({ searchParams }: PageProps) {
  const params = await searchParams;

  let usageData = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    usageData = await getApiUsage(token, {
      start_date: params.start_date,
      end_date: params.end_date,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load API usage';
  }

  return (
    <ApiUsageClient
      initialData={usageData}
      initialError={error}
      initialFilters={{
        start_date: params.start_date || '',
        end_date: params.end_date || '',
      }}
    />
  );
}
