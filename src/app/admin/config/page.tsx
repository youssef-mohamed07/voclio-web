import { requireAuth } from '@/lib/auth';
import { getConfig } from '@/services/config';
import ConfigClient from './ConfigClient';

export default async function ConfigPage() {
  let configData = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    configData = await getConfig(token);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load configuration';
  }

  return <ConfigClient initialData={configData} initialError={error} />;
}
