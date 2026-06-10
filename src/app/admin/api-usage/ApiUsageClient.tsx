'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiUsage } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import { formatDate, formatNumber } from '@/lib/format';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DataTable from '@/components/tables/DataTable';

interface ApiUsageClientProps {
  initialData: ApiUsage | null;
  initialError: string | null;
  initialFilters: {
    start_date: string;
    end_date: string;
  };
}

export default function ApiUsageClient({ initialData, initialError, initialFilters }: ApiUsageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [startDate, setStartDate] = useState(initialFilters.start_date);
  const [endDate, setEndDate] = useState(initialFilters.end_date);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (startDate) params.set('start_date', startDate);
    else params.delete('start_date');
    if (endDate) params.set('end_date', endDate);
    else params.delete('end_date');
    startTransition(() => {
      router.push(`${ROUTES.API_USAGE}?${params.toString()}`);
    });
  };

  const totals = initialData?.totals;

  const stats = [
    {
      label: 'AI Operations',
      value: totals?.total_ai_operations != null ? formatNumber(totals.total_ai_operations) : initialData?.total_requests != null ? formatNumber(initialData.total_requests) : '—',
      icon: RequestsIcon,
      color: 'bg-purple-100 text-[#6D28D9]',
    },
    {
      label: 'Transcriptions',
      value: totals?.total_transcriptions != null ? formatNumber(totals.total_transcriptions) : '—',
      icon: ErrorsIcon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active AI Users',
      value: totals?.active_ai_users != null ? formatNumber(totals.active_ai_users) : '—',
      icon: SuccessIcon,
      color: 'bg-green-100 text-green-600',
    },
  ];

  const columns = [
    { key: 'date', header: 'Date', render: (item: { date: string }) => formatDate(item.date) },
    { key: 'transcriptions', header: 'Transcriptions', render: (item: { transcriptions?: number }) => formatNumber(item.transcriptions ?? 0) },
    { key: 'task_extractions', header: 'Task Extractions', render: (item: { task_extractions?: number }) => formatNumber(item.task_extractions ?? 0) },
    { key: 'requests', header: 'Total AI Requests', render: (item: { requests: number }) => formatNumber(item.requests) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Usage</h1>
        <p className="text-gray-500 mt-1">Monitor AI operations, transcriptions, and token usage</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & Table */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-100">
          <CardTitle>Usage Breakdown</CardTitle>
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
            <Button onClick={handleFilter} loading={isPending}>Apply Filters</Button>
          </div>
        </div>

        {initialError ? (
          <div className="p-8 text-center text-red-500">{initialError}</div>
        ) : (
          <DataTable
            columns={columns}
            data={initialData?.breakdown || []}
            keyExtractor={(item) => `${item.api_type}-${item.date}`}
            emptyMessage="No usage data available"
          />
        )}
      </Card>
    </div>
  );
}

function RequestsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ErrorsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
