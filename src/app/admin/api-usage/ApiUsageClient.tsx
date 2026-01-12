'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiUsage } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import DataTable from '@/components/tables/DataTable';

interface ApiUsageClientProps {
  initialData: ApiUsage | null;
  initialError: string | null;
  initialFilters: {
    start_date: string;
    end_date: string;
    api_type: string;
  };
}

export default function ApiUsageClient({ initialData, initialError, initialFilters }: ApiUsageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [startDate, setStartDate] = useState(initialFilters.start_date);
  const [endDate, setEndDate] = useState(initialFilters.end_date);
  const [apiType, setApiType] = useState(initialFilters.api_type);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (startDate) params.set('start_date', startDate);
    else params.delete('start_date');
    if (endDate) params.set('end_date', endDate);
    else params.delete('end_date');
    if (apiType) params.set('api_type', apiType);
    else params.delete('api_type');
    startTransition(() => {
      router.push(`${ROUTES.API_USAGE}?${params.toString()}`);
    });
  };

  const stats = [
    {
      label: 'Total Requests',
      value: initialData?.total_requests?.toLocaleString() ?? '—',
      icon: RequestsIcon,
      color: 'bg-purple-100 text-[#6D28D9]',
    },
    {
      label: 'Total Errors',
      value: initialData?.total_errors?.toLocaleString() ?? '—',
      icon: ErrorsIcon,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Success Rate',
      value: initialData?.success_rate ? `${initialData.success_rate.toFixed(2)}%` : '—',
      icon: SuccessIcon,
      color: 'bg-green-100 text-green-600',
    },
  ];

  const columns = [
    { key: 'api_type', header: 'API Type' },
    { key: 'date', header: 'Date', render: (item: { date: string }) => new Date(item.date).toLocaleDateString() },
    { key: 'requests', header: 'Requests', render: (item: { requests: number }) => item.requests.toLocaleString() },
    { key: 'errors', header: 'Errors', render: (item: { errors: number }) => item.errors.toLocaleString() },
    {
      key: 'success_rate',
      header: 'Success Rate',
      render: (item: { requests: number; errors: number }) => {
        const rate = item.requests > 0 ? ((item.requests - item.errors) / item.requests * 100).toFixed(1) : '0';
        return `${rate}%`;
      },
    },
  ];

  const apiTypes = [...new Set(initialData?.breakdown?.map((b) => b.api_type) || [])];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Usage</h1>
        <p className="text-gray-500 mt-1">Monitor API requests and performance metrics</p>
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
            <Select
              value={apiType}
              onChange={(e) => setApiType(e.target.value)}
              options={[{ value: '', label: 'All API Types' }, ...apiTypes.map((t) => ({ value: t, label: t }))]}
            />
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
