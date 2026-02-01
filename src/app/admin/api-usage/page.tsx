import ApiUsageClient from './ApiUsageClient';

interface PageProps {
  searchParams: Promise<{
    start_date?: string;
    end_date?: string;
    api_type?: string;
  }>;
}

export default async function ApiUsagePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <ApiUsageClient
      initialFilters={{
        start_date: params.start_date || '',
        end_date: params.end_date || '',
        api_type: params.api_type || '',
      }}
    />
  );
}
