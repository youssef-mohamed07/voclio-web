import ApiKeysClient from './ApiKeysClient';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ApiKeysPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);

  return <ApiKeysClient currentPage={page} />;
}
