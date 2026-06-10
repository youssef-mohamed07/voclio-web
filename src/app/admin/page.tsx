import { requireAuth } from '@/lib/auth';
import {
  getDashboardStats,
  getUsageChart,
  getTrafficSources,
  getRecentUsers,
  getRecentLogs,
} from '@/services/dashboard';
import DashboardClient from './DashboardClient';

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = params.period || '7d';

  let stats = null;
  let chart = null;
  let traffic = null;
  let usersData = null;
  let logsData = null;
  let error: string | null = null;

  try {
    const token = await requireAuth();
    [stats, chart, traffic, usersData, logsData] = await Promise.all([
      getDashboardStats(token),
      getUsageChart(token, period),
      getTrafficSources(token),
      getRecentUsers(token, 5),
      getRecentLogs(token, 5),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load dashboard';
  }

  return (
    <DashboardClient
      stats={stats}
      chart={chart}
      traffic={traffic}
      usersData={usersData}
      logsData={logsData}
      period={period}
      error={error}
    />
  );
}
