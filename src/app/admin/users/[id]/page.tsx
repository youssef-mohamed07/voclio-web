import UserDetailsClient from './UserDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <UserDetailsClient userId={id} />;
}
