'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ApiKey, PaginatedResponse } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/tables/Pagination';
import Modal, { ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface ApiKeysClientProps {
  currentPage: number;
}

export default function ApiKeysClient({ currentPage }: ApiKeysClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<PaginatedResponse<ApiKey> | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; key: ApiKey | null }>({ open: false, key: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; key: ApiKey | null }>({ open: false, key: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [newKeyName, setNewKeyName] = useState('');
  const [editKeyName, setEditKeyName] = useState('');
  const [editKeyActive, setEditKeyActive] = useState(true);

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(`${ROUTES.API_KEYS}?page=${page}`);
    });
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/proxy/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, permissions: ['read'] }),
      });
      if (!res.ok) throw new Error('Failed to create API key');
      showToast('success', 'API key created successfully');
      setCreateModal(false);
      setNewKeyName('');
      router.refresh();
    } catch {
      showToast('error', 'Failed to create API key');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editModal.key) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/proxy/admin/api-keys/${editModal.key.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editKeyName, is_active: editKeyActive }),
      });
      if (!res.ok) throw new Error('Failed to update API key');
      showToast('success', 'API key updated successfully');
      setEditModal({ open: false, key: null });
      router.refresh();
    } catch {
      showToast('error', 'Failed to update API key');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.key) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/proxy/admin/api-keys/${deleteModal.key.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete API key');
      showToast('success', 'API key deleted successfully');
      setDeleteModal({ open: false, key: null });
      router.refresh();
    } catch {
      showToast('error', 'Failed to delete API key');
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (key: ApiKey) => {
    setEditKeyName(key.name);
    setEditKeyActive(key.is_active);
    setEditModal({ open: true, key });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'API key copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-500 mt-1">Manage API keys for external integrations</p>
        </div>
        <Button variant="gradient" onClick={() => setCreateModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Key
        </Button>
      </div>

      {!data ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">Loading API keys...</p>
        </Card>
      ) : data?.data?.length ? (
        <div className="grid gap-4">
          {data.data.map((key) => (
            <Card key={key.id} hover className="!p-0">
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${key.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <svg className={`w-6 h-6 ${key.is_active ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{key.name}</h3>
                        <Badge variant={key.is_active ? 'success' : 'error'} dot>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                          {key.key.slice(0, 20)}...{key.key.slice(-8)}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(key.key)}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-gray-400">Created</p>
                        <p className="text-gray-700 font-medium">{new Date(key.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Used</p>
                        <p className="text-gray-700 font-medium">{key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEditModal(key)}>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, key })}>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {data.total_pages > 1 && (
            <Card>
              <Pagination
                currentPage={currentPage}
                totalPages={data.total_pages}
                totalItems={data.total}
                itemsPerPage={data.limit}
                onPageChange={handlePageChange}
              />
            </Card>
          )}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No API keys yet</h3>
          <p className="text-gray-500 mt-1">Create your first API key to get started</p>
          <Button variant="gradient" className="mt-4" onClick={() => setCreateModal(true)}>Create Key</Button>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create API Key"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleCreate} loading={saving} disabled={!newKeyName.trim()}>Create</Button>
          </>
        }
      >
        <Input label="Key Name" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. Production API" />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, key: null })}
        title="Edit API Key"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal({ open: false, key: null })}>Cancel</Button>
            <Button variant="gradient" onClick={handleEdit} loading={saving}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Key Name" value={editKeyName} onChange={(e) => setEditKeyName(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={editKeyActive} onChange={() => setEditKeyActive(true)} className="w-4 h-4 text-purple-600" />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!editKeyActive} onChange={() => setEditKeyActive(false)} className="w-4 h-4 text-purple-600" />
                <span>Inactive</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, key: null })}
        onConfirm={handleDelete}
        title="Delete API Key"
        message={`Are you sure you want to delete "${deleteModal.key?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
