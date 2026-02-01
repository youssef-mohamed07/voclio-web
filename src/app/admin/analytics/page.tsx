'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSystemAnalytics, getAIUsageAnalytics, getContentStatistics } from '@/services/analytics';
import { getToken } from '@/lib/auth';
import AnalyticsClient from './AnalyticsClient';
import { SystemAnalytics, AIUsageAnalytics, ContentStatistics } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [systemData, setSystemData] = useState<SystemAnalytics | null>(null);
  const [aiUsageData, setAIUsageData] = useState<AIUsageAnalytics | null>(null);
  const [contentData, setContentData] = useState<ContentStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [partialErrors, setPartialErrors] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const [system, ai, content] = await Promise.allSettled([
          getSystemAnalytics(token),
          getAIUsageAnalytics(token, {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
          }),
          getContentStatistics(token),
        ]);

        const errors: string[] = [];

        if (system.status === 'fulfilled') {
          setSystemData(system.value);
        } else {
          console.error('System analytics error:', system.reason?.message || system.reason);
          errors.push('System analytics unavailable');
        }

        if (ai.status === 'fulfilled') {
          setAIUsageData(ai.value);
        } else {
          console.error('AI usage analytics error:', ai.reason?.message || ai.reason);
          errors.push('AI usage analytics unavailable');
        }

        if (content.status === 'fulfilled') {
          setContentData(content.value);
        } else {
          console.error('Content statistics error:', content.reason?.message || content.reason);
          errors.push('Content statistics unavailable');
        }

        setPartialErrors(errors);

        // Only set error if all requests failed
        if (system.status === 'rejected' && ai.status === 'rejected' && content.status === 'rejected') {
          setError('Failed to load analytics data');
        } else {
          setError(null);
        }
      } catch (err: any) {
        console.error('Analytics error:', err);
        setError(err.message || 'Failed to load analytics');
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
    <>
      {partialErrors.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-yellow-800">Some analytics data is unavailable</p>
              <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                {partialErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <AnalyticsClient
        systemData={systemData}
        aiUsageData={aiUsageData}
        contentData={contentData}
        error={error}
      />
    </>
  );
}
