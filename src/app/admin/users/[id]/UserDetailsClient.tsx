'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';
import { ROUTES } from '@/lib/constants';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';
import { ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import { getToken } from '@/lib/auth';
import { getUserDetails, updateUser, deleteUser, resetUserPassword } from '@/services/users';

interface UserDetailsClientProps {
  userId: string;
}

export default function UserDetailsClient({ userId }: UserDetailsClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getUserDetails(token, userId);
        setUser(response.user);
        setIsActive(response.user.is_active);
      } catch (error) {
        showToast('error', 'Failed to load user details');
        router.push(ROUTES.USERS);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const hasChanges = isActive !== user.is_active;

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      const updated = await updateUser(token, user.id, { is_active: isActive });
      setUser(updated);
      showToast('success', 'User updated successfully');
    } catch {
      showToast('error', 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    const token = getToken();
    if (!token) return;

    setResetting(true);
    try {
      await resetUserPassword(token, user.id);
      showToast('success', 'Password reset email sent');
    } catch {
      showToast('error', 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!token) return;

    setDeleting(true);
    try {
      await deleteUser(token, user.id);
      showToast('success', 'User deleted successfully');
      router.push(ROUTES.USERS);
    } catch {
      showToast('error', 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={ROUTES.USERS} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-purple-50 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <Badge variant={user.is_active ? 'success' : 'error'} size="md" dot>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card hover>
            <CardTitle>User Information</CardTitle>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem label="User ID" value={user.id} icon={<IdIcon />} />
              <InfoItem label="Email" value={user.email} icon={<EmailIcon />} />
              <InfoItem label="Name" value={user.name} icon={<UserIcon />} />
              <InfoItem label="Created" value={new Date(user.created_at).toLocaleDateString()} icon={<CalendarIcon />} />
            </div>
          </Card>

          <Card hover>
            <CardTitle>Account Status</CardTitle>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Toggle checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Inactive'} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="gradient" onClick={handleSave} loading={saving} disabled={!hasChanges}>
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setIsActive(user.is_active)} disabled={!hasChanges}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card hover>
            <CardTitle>Quick Stats</CardTitle>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-gray-600">Status</span>
                <Badge variant={user.is_active ? 'success' : 'error'} dot>{user.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-gray-600">Notes</span>
                <span className="font-semibold text-gray-900">{user.notes_count || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-gray-600">Tasks</span>
                <span className="font-semibold text-gray-900">{user.tasks_count || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-gray-600">Recordings</span>
                <span className="font-semibold text-gray-900">{user.recordings_count || 0}</span>
              </div>
            </div>
          </Card>

          <Card hover>
            <CardTitle>Actions</CardTitle>
            <div className="mt-4 space-y-3">
              <Button variant="secondary" className="w-full" onClick={handleResetPassword} loading={resetting}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                Reset Password
              </Button>
              <Button variant="danger" className="w-full" onClick={() => setDeleteModal(true)}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Delete User
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function IdIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>;
}

function EmailIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}

function UserIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}

function CalendarIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
