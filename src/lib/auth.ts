'use client';

// Simple client-side token and user management
const TOKEN_KEY = 'voclio_admin_token';
const USER_KEY = 'voclio_admin_user';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_admin?: boolean;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUser(user: StoredUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

export function requireAuth(): string {
  const token = getToken();
  if (!token) {
    throw new Error('Unauthorized');
  }
  return token;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
