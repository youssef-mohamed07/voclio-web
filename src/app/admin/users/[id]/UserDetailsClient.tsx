'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Task, Note } from '@/lib/types';
import { SUBSCRIPTION_TIERS, ROUTES } from '@/lib/constants';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';
import Modal, { ConfirmModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

interface UserDetailsClientProps {
  user: User;
}

export default function UserDetailsClient({ user: initialUser }: UserDetailsClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState(initialUser);
  const [tier, setTier] = useState(user.subscription_tier);
  const [isActive, setIsActive] = useState(user.is_active);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'notes'>('overview');
  const [taskModal, setTaskModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; description: string; priority: 'low' | 'medium' | 'high' | 'urgent' }>({ title: '', description: '', priority: 'medium' });
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const hasChanges = tier !== user.subscription_tier || isActive !== user.is_active;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/proxy/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_tier: tier, is_active: isActive }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      const updated = await res.json();
      setUser(updated);
      showToast('success', 'User updated successfully');
    } catch {
      showToast('error', 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    setResetting(true);
    try {
      const res = await fetch(`/api/proxy/admin/users/${user.id}/reset-password`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset password');
      showToast('success', 'Password reset email sent');
    } catch {
      showToast('error', 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/proxy/admin/users/${user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      showToast('success', 'User deleted successfully');
      router.push(ROUTES.USERS);
    } catch {
      showToast('error', 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      priority: newTask.priority,
      created_at: new Date().toISOString(),
    };
    setUser({ ...user, tasks: [...(user.tasks || []), task] });
    setTaskModal(false);
    setNewTask({ title: '', description: '', priority: 'medium' });
    showToast('success', 'Task added successfully');
  };

  const handleAddNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser({ ...user, notes: [...(user.notes || []), note] });
    setNoteModal(false);
    setNewNote({ title: '', content: '' });
    showToast('success', 'Note added successfully');
  };

  const toggleTaskStatus = (taskId: string) => {
    setUser({
      ...user,
      tasks: user.tasks?.map(t => 
        t.id === taskId 
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed', completed_at: t.status === 'completed' ? undefined : new Date().toISOString() }
          : t
      ),
    });
  };

  const deleteTask = (taskId: string) => {
    setUser({ ...user, tasks: user.tasks?.filter(t => t.id !== taskId) });
    showToast('success', 'Task deleted');
  };

  const deleteNote = (noteId: string) => {
    setUser({ ...user, notes: user.notes?.filter(n => n.id !== noteId) });
    showToast('success', 'Note deleted');
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    urgent: 'bg-red-100 text-red-600',
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['overview', 'tasks', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-[#6D28D9]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'tasks' && user.tasks?.length ? ` (${user.tasks.length})` : ''}
            {tab === 'notes' && user.notes?.length ? ` (${user.notes.length})` : ''}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6]" />
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card hover>
              <CardTitle>User Information</CardTitle>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="User ID" value={user.id} icon={<IdIcon />} />
                <InfoItem label="Email" value={user.email} icon={<EmailIcon />} />
                <InfoItem label="Name" value={user.name} icon={<UserIcon />} />
                <InfoItem label="Created" value={new Date(user.created_at).toLocaleDateString()} icon={<CalendarIcon />} />
                <InfoItem label="Last Login" value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'} icon={<ClockIcon />} />
                <InfoItem label="API Calls" value={user.api_calls_count?.toLocaleString() || '0'} icon={<ChartIcon />} />
              </div>
            </Card>

            <Card hover>
              <CardTitle>Subscription & Status</CardTitle>
              <div className="mt-4 space-y-4">
                <Select
                  label="Subscription Tier"
                  value={tier}
                  onChange={(e) => setTier(e.target.value as typeof tier)}
                  options={SUBSCRIPTION_TIERS.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                  <Toggle checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Inactive'} />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="gradient" onClick={handleSave} loading={saving} disabled={!hasChanges}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => { setTier(user.subscription_tier); setIsActive(user.is_active); }} disabled={!hasChanges}>
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
                  <span className="text-gray-600">Tier</span>
                  <Badge variant="gradient">{user.subscription_tier}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-gray-600">Tasks</span>
                  <span className="font-semibold text-gray-900">{user.tasks?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-gray-600">Notes</span>
                  <span className="font-semibold text-gray-900">{user.notes?.length || 0}</span>
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
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Tasks ({user.tasks?.length || 0})</h2>
            <Button variant="gradient" onClick={() => setTaskModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Button>
          </div>

          {user.tasks?.length ? (
            <div className="grid gap-4">
              {user.tasks.map((task) => (
                <Card key={task.id} hover className="!p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.status === 'completed' 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                      <p className="text-xs text-gray-400 mt-2">Created {new Date(task.created_at).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No tasks yet</h3>
              <p className="text-gray-500 mt-1">Add a task to track this user&apos;s activities</p>
            </Card>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Notes ({user.notes?.length || 0})</h2>
            <Button variant="gradient" onClick={() => setNoteModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Note
            </Button>
          </div>

          {user.notes?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.notes.map((note) => (
                <Card key={note.id} hover className="!p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{note.title}</h3>
                    <button onClick={() => deleteNote(note.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-3">{new Date(note.created_at).toLocaleDateString()}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No notes yet</h3>
              <p className="text-gray-500 mt-1">Add notes about this user</p>
            </Card>
          )}
        </div>
      )}

      {/* Modals */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        loading={deleting}
      />

      <Modal isOpen={taskModal} onClose={() => setTaskModal(false)} title="Add New Task" footer={
        <>
          <Button variant="secondary" onClick={() => setTaskModal(false)}>Cancel</Button>
          <Button variant="gradient" onClick={handleAddTask} disabled={!newTask.title}>Add Task</Button>
        </>
      }>
        <div className="space-y-4">
          <Input label="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              rows={3}
              placeholder="Task description (optional)"
            />
          </div>
          <Select
            label="Priority"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
        </div>
      </Modal>

      <Modal isOpen={noteModal} onClose={() => setNoteModal(false)} title="Add New Note" footer={
        <>
          <Button variant="secondary" onClick={() => setNoteModal(false)}>Cancel</Button>
          <Button variant="gradient" onClick={handleAddNote} disabled={!newNote.title || !newNote.content}>Add Note</Button>
        </>
      }>
        <div className="space-y-4">
          <Input label="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} placeholder="Note title" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              rows={4}
              placeholder="Note content"
            />
          </div>
        </div>
      </Modal>
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

function ClockIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function ChartIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
}
