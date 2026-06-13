import { apiFetchData, buildQueryString } from './api';
import { unwrapData, unwrapPaginated } from '@/lib/api-response';
import { mapUser, mapTask, mapNote, mapUserDetail } from '@/lib/mappers';
import { User, Task, Note, PaginatedResponse } from '@/lib/types';

interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface BackendUsersResponse {
  data: Array<{
    user_id: number;
    email: string;
    name: string;
    phone_number?: string;
    is_active: boolean;
    email_verified?: boolean;
    is_admin?: boolean;
    oauth_provider?: string;
    created_at: string;
    updated_at?: string;
    notes_count?: number;
    tasks_count?: number;
    recordings_count?: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export async function getUsers(token: string, params: UsersParams = {}): Promise<PaginatedResponse<User>> {
  const query = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search,
    status: params.status,
  });

  const response = await apiFetchData<Record<string, unknown>[]>(`/admin/users${query}`, { token });
  const paginated = unwrapPaginated(response);
  return {
    ...paginated,
    data: paginated.data.map((u) => mapUser(u as Record<string, unknown>)),
  };
}

export async function getUser(token: string, id: string): Promise<User> {
  const [detailRes, tasksRes, notesRes] = await Promise.all([
    apiFetchData<Record<string, unknown>>(`/admin/users/${id}`, { token }),
    apiFetchData<{ tasks: Record<string, unknown>[] }>(`/admin/users/${id}/tasks`, { token }),
    apiFetchData<{ notes: Record<string, unknown>[] }>(`/admin/users/${id}/notes`, { token }),
  ]);

  const detail = unwrapData(detailRes);
  const tasks = (unwrapData(tasksRes).tasks ?? []).map((t) => mapTask(t));
  const notes = (unwrapData(notesRes).notes ?? []).map((n) => mapNote(n));

  return mapUserDetail(detail, tasks, notes);
}

export async function createUser(
  token: string,
  data: { email: string; password: string; name?: string; is_admin?: boolean }
): Promise<User> {
  const response = await apiFetchData<Record<string, unknown>>('/admin/users', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapUser(unwrapData(response));
}

export async function updateUser(
  token: string,
  id: string,
  data: Partial<{ name: string; email: string; is_active: boolean; is_admin: boolean; phone_number: string }>
): Promise<User> {
  const response = await apiFetchData<Record<string, unknown>>(`/admin/users/${id}`, {
    token,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return mapUser(unwrapData(response));
}

export async function deleteUser(token: string, id: string): Promise<void> {
  await apiFetchData<null>(`/admin/users/${id}`, { token, method: 'DELETE' });
}

export async function resetUserPassword(
  token: string,
  id: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await apiFetchData<null>(`/admin/users/${id}/reset-password`, {
    token,
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  });
  return { message: response.message ?? 'Password reset successfully' };
}

export async function createUserTask(
  token: string,
  userId: string,
  data: { title: string; description?: string; priority?: string }
): Promise<Task> {
  const response = await apiFetchData<{ task: Record<string, unknown> }>(
    `/admin/users/${userId}/tasks`,
    { token, method: 'POST', body: JSON.stringify(data) }
  );
  return mapTask(unwrapData(response).task);
}

export async function updateUserTask(
  token: string,
  userId: string,
  taskId: string,
  data: Partial<{ title: string; description: string; status: string; priority: string }>
): Promise<Task> {
  const response = await apiFetchData<{ task: Record<string, unknown> }>(
    `/admin/users/${userId}/tasks/${taskId}`,
    { token, method: 'PUT', body: JSON.stringify(data) }
  );
  return mapTask(unwrapData(response).task);
}

export async function deleteUserTask(token: string, userId: string, taskId: string): Promise<void> {
  await apiFetchData<null>(`/admin/users/${userId}/tasks/${taskId}`, { token, method: 'DELETE' });
}

export async function createUserNote(
  token: string,
  userId: string,
  data: { title: string; content: string }
): Promise<Note> {
  const response = await apiFetchData<{ note: Record<string, unknown> }>(
    `/admin/users/${userId}/notes`,
    { token, method: 'POST', body: JSON.stringify(data) }
  );
  return mapNote(unwrapData(response).note);
}

export async function updateUserNote(
  token: string,
  userId: string,
  noteId: string,
  data: Partial<{ title: string; content: string; is_pinned: boolean }>
): Promise<Note> {
  const response = await apiFetchData<{ note: Record<string, unknown> }>(
    `/admin/users/${userId}/notes/${noteId}`,
    { token, method: 'PUT', body: JSON.stringify(data) }
  );
  return mapNote(unwrapData(response).note);
}

export async function deleteUserNote(token: string, userId: string, noteId: string): Promise<void> {
  await apiFetchData<null>(`/admin/users/${userId}/notes/${noteId}`, { token, method: 'DELETE' });
}

export async function bulkDeleteUsers(token: string, userIds: string[]): Promise<{ deleted_count: number }> {
  const response = await apiFetchData<{ deleted_count: number }>('/admin/users/bulk-delete', {
    token,
    method: 'POST',
    body: JSON.stringify({ userIds: userIds.map((id) => parseInt(id, 10)) }),
  });
  return unwrapData(response);
}

export async function updateUserStatus(
  token: string,
  id: string,
  is_active: boolean
): Promise<User> {
  const response = await apiFetchData<Record<string, unknown>>(`/admin/users/${id}/status`, {
    token,
    method: 'PUT',
    body: JSON.stringify({ is_active }),
  });
  return mapUser(unwrapData(response));
}

export async function updateUserRole(
  token: string,
  id: string,
  is_admin: boolean
): Promise<User> {
  const response = await apiFetchData<Record<string, unknown>>(`/admin/users/${id}/role`, {
    token,
    method: 'PUT',
    body: JSON.stringify({ is_admin }),
  });
  return mapUser(unwrapData(response));
}
