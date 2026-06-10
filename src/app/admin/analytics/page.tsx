import { requireAuth } from '@/lib/auth';
import { getSystemAnalytics, getContentStats, getAIUsagePerUser } from '@/services/analytics';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  let system = null;
  let content = null;
  let aiPerUser = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    [system, content, aiPerUser] = await Promise.all([
      getSystemAnalytics(token),
      getContentStats(token),
      getAIUsagePerUser(token, { limit: 20 }),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load analytics';
  }

  return (
    <AnalyticsClient
      system={system}
      content={content}
      aiPerUser={aiPerUser}
      initialError={error}
    />
  );
}
