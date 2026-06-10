'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, PaginatedResponse } from '@/lib/types';
import { USER_STATUS_FILTERS, ROUTES } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/tables/Pagination';
import Modal, { ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

interface UsersClientProps {
  initialData: PaginatedResponse<User> | null;
  initialError: string | null;
  initialFilters: { page: number; search: string; status: string };
}

export default function UsersClient({ initialData, initialError, initialFilters }: UsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialFilters.search);
  const [status, setStatus] = useState(initialFilters.status);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', is_admin: false });

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1');
    startTransition(() => router.push(`${ROUTES.USERS}?${params.toString()}`));
  };

  const handleSearch = () => updateFilters({ search, status });
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    startTransition(() => router.push(`${ROUTES.USERS}?${params.toString()}`));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/proxy/admin/users/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: Array.from(selected).map((id) => parseInt(id, 10)) }),
      });
      if (!res.ok) throw new Error('Failed to delete users');
      showToast('success', `Deleted ${selected.size} users`);
      setSelected(new Set());
      setBulkDeleteModal(false);
      router.refresh();
    } catch {
      showToast('error', 'Failed to delete users');
    } finally {
      setDeleting(false);
    }
  };

  const handleCreate = async () => {
    if (!newUser.email || newUser.password.length < 8) {
      showToast('error', 'Email and password (min 8 chars) required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/proxy/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Failed to create user');
      }
      showToast('success', 'User created successfully');
      setCreateModal(false);
      setNewUser({ email: '', password: '', name: '', is_admin: false });
      router.refresh();
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage user accounts</p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <Button variant="danger" onClick={() => setBulkDeleteModal(true)}>
              Delete ({selected.size})
            </Button>
          )}
          <Button variant="gradient" onClick={() => setCreateModal(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </Button>
        </div>
      </div>

      <Card hover>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={USER_STATUS_FILTERS.map((f) => ({ value: f.value, label: f.label }))}
            />
            <Button variant="gradient" onClick={handleSearch} loading={isPending}>Filter</Button>
          </div>
        </div>
      </Card>

      {initialError ? (
        <Card className="text-center py-12"><p className="text-red-500">{initialError}</p></Card>
      ) : initialData?.data?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialData.data.map((user) => (
              <Card key={user.id} hover className={`!p-0 overflow-hidden ${selected.has(user.id) ? 'ring-2 ring-purple-500' : ''}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="w-4 h-4 rounded text-purple-600"
                      />
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
                    {user.is_admin && <Badge variant="gradient">Admin</Badge>}
                    <span className="text-xs text-gray-500">{user.api_calls_count ?? 0} recordings</span>
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
          <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
        </Card>
      )}

      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Add User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleCreate} loading={creating}>Create</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <Input label="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
          <Input label="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={newUser.is_admin} onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })} />
            <span className="text-sm">Grant admin access</span>
          </label>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Delete ${deleteModal.user?.name}? This cannot be undone.`}
        loading={deleting}
      />

      <ConfirmModal
        isOpen={bulkDeleteModal}
        onClose={() => setBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Bulk Delete Users"
        message={`Delete ${selected.size} selected users? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
