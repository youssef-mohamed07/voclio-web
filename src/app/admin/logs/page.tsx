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
  const params = await searchParams;

  return (
    <LogsClient
      initialFilters={{
        page: parseInt(params.page || '1', 10),
        activity_type: params.activity_type || '',
        severity: params.severity || '',
        start_date: params.start_date || '',
        end_date: params.end_date || '',
      }}
    />
  );
}
