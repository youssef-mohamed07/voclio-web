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

export async function getToken(): Promise<string> {
  if (process.env.ADMIN_ACCESS_TOKEN) {
    return process.env.ADMIN_ACCESS_TOKEN;
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(AUTH_COOKIE)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  if (cachedToken) {
    return cachedToken;
  }

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
