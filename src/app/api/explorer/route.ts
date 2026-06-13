import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';
import { getServerApiBaseUrl, isAllowedApiPath } from '@/lib/api-environments';
import type { HttpMethod } from '@/lib/api-catalog';

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

interface ExplorerRequestBody {
  environment?: 'development' | 'production';
  method?: string;
  path?: string;
  query?: Record<string, string>;
  body?: unknown;
  useAuth?: boolean;
}

export async function POST(request: NextRequest) {
  let payload: ExplorerRequestBody;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const environment = payload.environment === 'production' ? 'production' : 'development';
  const method = (payload.method || 'GET').toUpperCase() as HttpMethod;
  const path = (payload.path || '').trim();
  const useAuth = payload.useAuth !== false;

  if (!METHODS.includes(method)) {
    return NextResponse.json({ error: `Unsupported method: ${method}` }, { status: 400 });
  }

  if (!path || !isAllowedApiPath(path)) {
    return NextResponse.json({ error: 'Invalid or disallowed API path' }, { status: 400 });
  }

  const baseUrl = getServerApiBaseUrl(environment).replace(/\/$/, '');
  const query = payload.query ?? {};
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (key.trim()) searchParams.set(key, value);
  });
  const queryString = searchParams.toString();
  const url = `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (useAuth) {
    try {
      const token = await getToken();
      headers.Authorization = `Bearer ${token}`;
    } catch {
      return NextResponse.json(
        { error: 'Not authenticated. Log in to the admin panel first.' },
        { status: 401 }
      );
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    cache: 'no-store',
  };

  if (method !== 'GET' && method !== 'DELETE' && payload.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body =
      typeof payload.body === 'string' ? payload.body : JSON.stringify(payload.body);
  }

  const started = Date.now();

  try {
    const response = await fetch(url, fetchOptions);
    const durationMs = Date.now() - started;
    const contentType = response.headers.get('content-type') || '';
    let data: unknown;

    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => '');
    }

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      durationMs,
      url,
      environment,
      method,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: 0,
        statusText: 'Network Error',
        durationMs: Date.now() - started,
        url,
        environment,
        method,
        error: error instanceof Error ? error.message : 'Request failed',
      },
      { status: 502 }
    );
  }
}
