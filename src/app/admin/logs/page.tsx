import { requireAuth } from '@/lib/auth';
import { getLogs } from '@/services/logs';
import LogsClient from './LogsClient';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    activity_type?: string;
    severity?: string;
    start_date?: string;
    end_date?: string;
  }>;
}

export default async function LogsPage({ searchParams }: PageProps) {
  const token = await requireAuth();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);

  let logsData = null;
  let error = null;

  try {
    logsData = await getLogs(token, {
      page,
      limit: 20,
      activity_type: params.activity_type,
      severity: params.severity,
      start_date: params.start_date,
      end_date: params.end_date,
    });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load logs';
  }

  return (
    <LogsClient
      initialData={logsData}
      initialError={error}
      initialFilters={{
        page,
        activity_type: params.activity_type || '',
        severity: params.severity || '',
        start_date: params.start_date || '',
        end_date: params.end_date || '',
      }}
    />
  );
}
