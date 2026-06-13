import { requireAuth } from '@/lib/auth';
import { getIntegrationsOverview, getCalendarSyncs } from '@/services/integrations';
import IntegrationsClient from './IntegrationsClient';

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function IntegrationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const status = params.status || 'all';

  let overview = null;
  let calendarData = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    [overview, calendarData] = await Promise.all([
      getIntegrationsOverview(token),
      getCalendarSyncs(token, { page, limit: 10, status }),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load integrations';
  }

  return (
    <IntegrationsClient
      overview={overview}
      calendarData={calendarData}
      page={page}
      status={status}
      initialError={error}
    />
  );
}
