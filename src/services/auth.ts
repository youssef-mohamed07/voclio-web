import { apiFetch } from './api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(token: string): Promise<void> {
  return apiFetch<void>('/auth/logout', {
    token,
    method: 'POST',
  });
}
