import { apiFetch, buildQueryString } from './api';
import { User, PaginatedResponse } from '@/lib/types';

interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
  subscription_tier?: string;
  is_active?: boolean;
}

export async function getUsers(token: string, params: UsersParams = {}): Promise<PaginatedResponse<User>> {
  const query = buildQueryString({
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search,
    subscription_tier: params.subscription_tier,
    is_active: params.is_active,
  });
  return apiFetch<PaginatedResponse<User>>(`/admin/users${query}`, { token });
}

export async function getUser(token: string, id: string): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}`, { token });
}

export async function updateUser(token: string, id: string, data: Partial<User>): Promise<User> {
  return apiFetch<User>(`/admin/users/${id}`, {
    token,
    method: 'PUT',
    body: JSON.stringify(data),
  });
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
