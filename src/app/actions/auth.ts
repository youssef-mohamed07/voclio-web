'use server';

import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

// Simplified auth actions since we're skipping login
export async function logoutAction(): Promise<void> {
  redirect(ROUTES.DASHBOARD);
}
