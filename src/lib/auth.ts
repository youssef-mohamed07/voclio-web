// Skip authentication - always return a test token
const TEST_TOKEN = 'test_admin_token_12345';

export async function getToken(): Promise<string> {
  return TEST_TOKEN;
}

export async function requireAuth(): Promise<string> {
  return TEST_TOKEN;
}

export async function isAuthenticated(): Promise<boolean> {
  return true;
}
