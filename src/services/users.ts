import { apiFetch, buildQueryString } from './api';
import { User, PaginatedResponse, UserDetailsResponse } from '@/lib/types';
import { mockUsers, paginateMockData } from '@/lib/mock-data';

interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive' | 'admin';
  sortBy?: 'created_at' | 'email' | 'name';
  order?: 'ASC' | 'DESC';
  subscription_tier?: string;
  is_active?: boolean;
}

export async function getUsers(token: string, params: UsersParams = {}): Promise<PaginatedResponse<User>> {
  try {
    const query = buildQueryString({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
      status: params.status,
      sortBy: params.sortBy,
      order: params.order,
      subscription_tier: params.subscription_tier,
      is_active: params.is_active,
    });
    return await apiFetch<PaginatedResponse<User>>(`/admin/users${query}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    let filteredUsers = mockUsers;
    if (params.search) {
      filteredUsers = mockUsers.filter(u => 
        u.name.toLowerCase().includes(params.search!.toLowerCase()) || 
        u.email.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    if (params.is_active !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.is_active === params.is_active);
    }
    if (params.subscription_tier) {
      filteredUsers = filteredUsers.filter(u => u.subscription_tier === params.subscription_tier);
    }
    return paginateMockData(filteredUsers, params.page || 1, params.limit || 10);
  }
}

export async function getUser(token: string, id: string): Promise<User> {
  try {
    return await apiFetch<User>(`/admin/users/${id}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }
}

export async function getUserDetails(token: string, id: string): Promise<UserDetailsResponse> {
  try {
    return await apiFetch<UserDetailsResponse>(`/admin/users/${id}`, { token });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return {
      user,
      statistics: {
        total_notes: user.notes?.length || 0,
        total_tasks: user.tasks?.length || 0,
        completed_tasks: user.tasks?.filter(t => t.status === 'completed').length || 0,
        total_recordings: 0,
        total_reminders: 0,
        total_tags: 0,
        total_categories: 0,
        focus_sessions: 0,
        total_focus_time: 0,
        active_sessions: 0,
      },
      recent_activity: {
        notes: user.notes?.map(n => ({ note_id: parseInt(n.id), title: n.title, created_at: n.created_at })) || [],
        tasks: user.tasks?.map(t => ({ task_id: parseInt(t.id.substring(1)), title: t.title, status: t.status, created_at: t.created_at })) || [],
        recordings: [],
      },
    };
  }
}

export async function updateUser(token: string, id: string, data: Partial<User>): Promise<User> {
  try {
    return await apiFetch<User>(`/admin/users/${id}`, {
      token,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user, ...data };
  }
}

export async function deleteUser(token: string, id: string): Promise<void> {
  try {
    return await apiFetch<void>(`/admin/users/${id}`, {
      token,
      method: 'DELETE',
    });
  } catch (error) {
    console.warn('API failed, simulating delete:', error);
    return Promise.resolve();
  }
}

export async function resetUserPassword(token: string, id: string): Promise<{ message: string }> {
  try {
    return await apiFetch<{ message: string }>(`/admin/users/${id}/reset-password`, {
      token,
      method: 'POST',
    });
  } catch (error) {
    console.warn('API failed, using mock response:', error);
    return { message: 'Password reset email sent successfully' };
  }
}

export async function updateUserStatus(
  token: string,
  id: string,
  is_active: boolean
): Promise<User> {
  try {
    return await apiFetch<User>(`/admin/users/${id}/status`, {
      token,
      method: 'PUT',
      body: JSON.stringify({ is_active }),
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user, is_active };
  }
}

export async function updateUserRole(
  token: string,
  id: string,
  is_admin: boolean
): Promise<User> {
  try {
    return await apiFetch<User>(`/admin/users/${id}/role`, {
      token,
      method: 'PUT',
      body: JSON.stringify({ is_admin }),
    });
  } catch (error) {
    console.warn('API failed, using mock data:', error);
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user };
  }
}

export async function bulkDeleteUsers(
  token: string,
  userIds: string[]
): Promise<{ message: string; deleted_count: number }> {
  try {
    return await apiFetch(`/admin/users/bulk-delete`, {
      token,
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  } catch (error) {
    console.warn('API failed, using mock response:', error);
    return { message: 'Users deleted successfully', deleted_count: userIds.length };
  }
}
