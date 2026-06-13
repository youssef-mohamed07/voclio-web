import 'server-only';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/constants';
import { ApiSuccessResponse } from '@/lib/api-response';

export const AUTH_COOKIE = 'voclio_admin_token';

let cachedToken: string | null = null;

async function loginWithCredentials(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  const json = (await response.json()) as ApiSuccessResponse<{
    tokens: { access_token: string };
  }>;

  return json.data.tokens.access_token;
}

async function validateAdminToken(token: string): Promise<boolean> {
  if (!token.trim()) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cachedToken = null;
}

export async function getToken(): Promise<string> {
  if (process.env.ADMIN_ACCESS_TOKEN) {
    const envToken = process.env.ADMIN_ACCESS_TOKEN;
    if (await validateAdminToken(envToken)) {
      return envToken;
    }
    throw new Error('ADMIN_ACCESS_TOKEN is invalid or expired');
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(AUTH_COOKIE)?.value;
  if (cookieToken && (await validateAdminToken(cookieToken))) {
    return cookieToken;
  }

  if (cookieToken) {
    await clearAuthCookie();
  }

  if (cachedToken && (await validateAdminToken(cachedToken))) {
    return cachedToken;
  }

  cachedToken = null;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    cachedToken = await loginWithCredentials(email, password);
    return cachedToken;
  }

  throw new Error('Not authenticated');
}

export async function requireAuth(): Promise<string> {
  return getToken();
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    await getToken();
    return true;
  } catch {
    return false;
  }
}
