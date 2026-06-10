import { requireAuth } from '@/lib/auth';
import { getUser } from '@/services/users';
import { notFound } from 'next/navigation';
import UserDetailsClient from './UserDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const token = await requireAuth();
    const user = await getUser(token, id);
    return <UserDetailsClient user={user} />;
  } catch {
    notFound();
  }
}
