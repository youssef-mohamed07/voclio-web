import { requireAuth } from '@/lib/auth';
import { getSystemHealth } from '@/services/system';
import SystemClient from './SystemClient';

export default async function SystemPage() {
  let health = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    health = await getSystemHealth(token);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load system health';
  }

  return <SystemClient health={health} initialError={error} />;
}
