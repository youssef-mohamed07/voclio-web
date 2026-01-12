import { requireAuth } from '@/lib/auth';
import { getUser } from '@/services/users';
import { notFound } from 'next/navigation';
import UserDetailsClient from './UserDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: PageProps) {
  const token = await requireAuth();
  const { id } = await params;

  let user = null;
  try {
    user = await getUser(token, id);
  } catch {
    notFound();
  }

  return <UserDetailsClient user={user} />;
}
