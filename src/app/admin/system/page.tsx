'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSystemHealth, getActivityLogs } from '@/services/system';
import { getToken } from '@/lib/auth';
import SystemClient from './SystemClient';
import { SystemHealth, ActivityLog, PaginatedResponse } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';

export default function SystemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [logsData, setLogsData] = useState<PaginatedResponse<ActivityLog> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const [health, logs] = await Promise.all([
          getSystemHealth(token),
          getActivityLogs(token, { page: 1, limit: 20 }),
        ]);

        setHealthData(health);
        setLogsData(logs);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load system data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <SystemClient
      healthData={healthData}
      logsData={logsData}
      error={error}
    />
  );
}
