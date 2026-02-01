import { apiFetch } from './api';

interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      user_id: number;
      email: string;
      name: string;
    };
    tokens: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  };
}

export async function login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; name: string; role: string } }> {
  try {
    // Call the API directly without token
    const response = await fetch('https://voclio-backend.build8.dev/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || errorData.message || 'Login failed');
    }

    const data: BackendLoginResponse = await response.json();
    
    // Check if response has the expected structure
    if (!data.success || !data.data?.tokens?.access_token) {
      throw new Error('Invalid response from server');
    }
    
    // Transform the response to match our expected format
    return {
      token: data.data.tokens.access_token,
      user: {
        id: String(data.data.user.user_id),
        email: data.data.user.email,
        name: data.data.user.name,
        role: 'admin',
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed. Please try again.');
  }
}

export async function logout(token: string): Promise<void> {
  return apiFetch<void>('/auth/logout', {
    token,
    method: 'POST',
  });
}
