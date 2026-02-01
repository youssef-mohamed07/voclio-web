import { API_BASE_URL } from '@/lib/constants';
import { ApiError } from '@/lib/types';

interface FetchOptions extends RequestInit {
  token?: string;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details: any;
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      message: 'An error occurred',
      status: response.status,
    };

    try {
      const data: BackendResponse<any> = await response.json();
      error.message = data.error?.message || data.message || getErrorMessage(response.status);
      error.errors = data.error?.details;
    } catch {
      error.message = getErrorMessage(response.status);
    }

    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  const json: BackendResponse<T> = await response.json();
  
  // If backend wraps response in { success, data }, return the whole response
  // The service layer will handle extracting what it needs
  if (json.success !== undefined) {
    return json as unknown as T;
  }
  
  // Otherwise return as is
  return json as unknown as T;
}

function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    cache: fetchOptions.cache || 'no-store',
  });

  return handleResponse<T>(response);
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
