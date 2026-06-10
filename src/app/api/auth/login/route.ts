import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';
import { AUTH_COOKIE } from '@/lib/auth';
import { ApiSuccessResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.error?.message || 'Invalid email or password';
      return NextResponse.json({ error: message }, { status: 401 });
    }

    const json = data as ApiSuccessResponse<{
      tokens: { access_token: string; expires_in?: number };
      user: { user_id: number; email: string; name: string };
    }>;

    const token = json.data.tokens.access_token;

    const adminCheck = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!adminCheck.ok) {
      return NextResponse.json(
        { error: 'This account does not have admin access' },
        { status: 403 }
      );
    }

    const maxAge = json.data.tokens.expires_in ?? 3600;

    const res = NextResponse.json({
      success: true,
      user: json.data.user,
    });

    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Unable to connect to server' }, { status: 503 });
  }
}
