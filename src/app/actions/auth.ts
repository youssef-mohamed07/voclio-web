'use client';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/lib/auth';

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect('/login');
}
