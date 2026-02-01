import { apiFetch, buildQueryString } from './api';
import { User, PaginatedResponse, UserDetailsResponse } from '@/lib/types';

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
    sortBy: params.sortBy,
    order: params.order,
  });
  
  const response = await apiFetch<BackendUsersResponse>(`/admin/users${query}`, { token });
  
  // Check if response has the expected structure
  if (!response || !response.data || !Array.isArray(response.data)) {
    throw new Error('Invalid response from server');
  }
  
  // Transform backend response to frontend format
  return {
    data: response.data.map(user => ({
      id: String(user.user_id),
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      phone_number: user.phone_number,
      subscription_tier: 'free' as const,
      is_active: user.is_active,
      email_verified: user.email_verified,
      is_admin: user.is_admin,
      oauth_provider: user.oauth_provider,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
      notes_count: user.notes_count,
      tasks_count: user.tasks_count,
      recordings_count: user.recordings_count,
    })),
    total: response.pagination.total,
    page: response.pagination.page,
    limit: response.pagination.limit,
    total_pages: Math.ceil(response.pagination.total / response.pagination.limit),
  };
}

export async function getUser(token: string, id: string): Promise<User> {
  const response = await apiFetch<{ user: any }>(`/admin/users/${id}`, { token });
  const user = response.user;
  
  return {
    id: String(user.user_id),
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    phone_number: user.phone_number,
    subscription_tier: 'free' as const,
    is_active: user.is_active,
    email_verified: user.email_verified,
    is_admin: user.is_admin,
    oauth_provider: user.oauth_provider,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
  };
}

export async function getUserDetails(token: string, id: string): Promise<UserDetailsResponse> {
  const response = await apiFetch<any>(`/admin/users/${id}`, { token });
  // Handle both wrapped and unwrapped responses
  if (response.data) {
    return response.data;
  }
  return response;
}

export async function updateUser(token: string, id: string, data: Partial<User>): Promise<User> {
  const response = await apiFetch<{ user: any }>(`/admin/users/${id}`, {
    token,
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  const user = response.user;
  return {
    id: String(user.user_id),
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    subscription_tier: 'free' as const,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
  };
}

export async function deleteUser(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/admin/users/${id}`, {
    token,
    method: 'DELETE',
  });
}

export async function resetUserPassword(token: string, id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/users/${id}/reset-password`, {
    token,
    method: 'POST',
  });
}

export async function updateUserStatus(
  token: string,
  id: string,
  is_active: boolean
): Promise<User> {
  const response = await apiFetch<{ user: any }>(`/admin/users/${id}/status`, {
    token,
    method: 'PUT',
    body: JSON.stringify({ is_active }),
  });
  
  const user = response.user;
  return {
    id: String(user.user_id),
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    subscription_tier: 'free' as const,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
  };
}

export async function updateUserRole(
  token: string,
  id: string,
  is_admin: boolean
): Promise<User> {
  const response = await apiFetch<{ user: any }>(`/admin/users/${id}/role`, {
    token,
    method: 'PUT',
    body: JSON.stringify({ is_admin }),
  });
  
  const user = response.user;
  return {
    id: String(user.user_id),
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    subscription_tier: 'free' as const,
    is_active: user.is_active,
    is_admin: user.is_admin,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
  };
}

export async function bulkDeleteUsers(
  token: string,
  userIds: string[]
): Promise<{ message: string; deleted_count: number }> {
  return apiFetch(`/admin/users/bulk-delete`, {
    token,
    method: 'POST',
    body: JSON.stringify({ userIds: userIds.map(id => parseInt(id)) }),
  });
}
