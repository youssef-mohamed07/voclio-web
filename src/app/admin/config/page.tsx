import { requireAuth } from '@/lib/auth';
import { getConfig } from '@/services/config';
import ConfigClient from './ConfigClient';

export default async function ConfigPage() {
  const token = await requireAuth();

  let configData = null;
  let error = null;

  try {
    configData = await getConfig(token);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load configuration';
  }

  return <ConfigClient initialData={configData} initialError={error} />;
}
