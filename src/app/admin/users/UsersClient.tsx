'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, PaginatedResponse } from '@/lib/types';
import { SUBSCRIPTION_TIERS, ROUTES } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/tables/Pagination';
import { ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

interface UsersClientProps {
  initialData: PaginatedResponse<User> | null;
  initialError: string | null;
  initialFilters: {
    page: number;
    search: string;
    subscription_tier: string;
    is_active: string;
  };
}

export default function UsersClient({ initialData, initialError, initialFilters }: UsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialFilters.search);
  const [tier, setTier] = useState(initialFilters.subscription_tier);
  const [active, setActive] = useState(initialFilters.is_active);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1');
    startTransition(() => {
      router.push(`${ROUTES.USERS}?${params.toString()}`);
    });
  };

  const handleSearch = () => updateFilters({ search, subscription_tier: tier, is_active: active });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    startTransition(() => {
      router.push(`${ROUTES.USERS}?${params.toString()}`);
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/proxy/admin/users/${deleteModal.user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      showToast('success', 'User deleted successfully');
      setDeleteModal({ open: false, user: null });
      router.refresh();
    } catch {
      showToast('error', 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const tierBadgeVariant = (t: string): 'default' | 'info' | 'purple' | 'gradient' => {
    const variants: Record<string, 'default' | 'info' | 'purple' | 'gradient'> = {
      free: 'default', basic: 'info', pro: 'purple', enterprise: 'gradient',
    };
    return variants[t] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage user accounts and subscriptions</p>
        </div>
        <Button variant="gradient">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card hover>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              options={[
                { value: '', label: 'All Tiers' },
                ...SUBSCRIPTION_TIERS.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) })),
              ]}
            />
            <Select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
            />
            <Button variant="gradient" onClick={handleSearch} loading={isPending}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Grid */}
      {initialError ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Error loading users</h3>
          <p className="text-red-500 mt-1">{initialError}</p>
        </Card>
      ) : initialData?.data?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialData.data.map((user) => (
              <Card key={user.id} hover className="!p-0 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={user.is_active ? 'success' : 'error'} dot>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant={tierBadgeVariant(user.subscription_tier)}>
                      {user.subscription_tier}
                    </Badge>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{user.api_calls_count?.toLocaleString() || 0} API calls</span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Link href={`${ROUTES.USERS}/${user.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full" size="sm">View Details</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, user })}>
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {initialData.total_pages > 1 && (
            <Card>
              <Pagination
                currentPage={initialData.page}
                totalPages={initialData.total_pages}
                totalItems={initialData.total}
                itemsPerPage={initialData.limit}
                onPageChange={handlePageChange}
              />
            </Card>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters</p>
        </Card>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.name}? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
