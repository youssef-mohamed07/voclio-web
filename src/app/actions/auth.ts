'use client';

import { setToken, clearToken, setUser, clearUser } from '@/lib/auth';
import { login as loginService } from '@/services/auth';

export async function loginAction(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await loginService(email, password);
    setToken(response.token);
    setUser(response.user);
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Login failed. Please check your credentials.' 
    };
  }
}

export function logoutAction(): void {
  clearToken();
  clearUser();
  window.location.href = '/login';
}
