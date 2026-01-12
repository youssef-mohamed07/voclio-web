const http = require('http');

// Mock data
const users = [
  { 
    id: '1', email: 'john@example.com', name: 'John Doe', subscription_tier: 'pro', is_active: true, 
    created_at: '2025-01-01T10:00:00Z', last_login: '2025-01-12T08:30:00Z', api_calls_count: 1250,
    tasks: [
      { id: 't1', title: 'Complete onboarding', description: 'Finish the user onboarding flow', status: 'completed', priority: 'high', created_at: '2025-01-05T10:00:00Z', completed_at: '2025-01-06T14:00:00Z' },
      { id: 't2', title: 'Review API documentation', description: 'Go through the API docs', status: 'in_progress', priority: 'medium', created_at: '2025-01-10T09:00:00Z' },
      { id: 't3', title: 'Set up webhooks', status: 'pending', priority: 'low', created_at: '2025-01-11T11:00:00Z' },
    ],
    notes: [
      { id: 'n1', title: 'VIP Customer', content: 'High-value customer, prioritize support requests. Has been with us since beta.', is_pinned: true, created_at: '2025-01-02T10:00:00Z', updated_at: '2025-01-02T10:00:00Z' },
      { id: 'n2', title: 'Feature Request', content: 'Requested bulk export feature for Q1 2025', is_pinned: false, created_at: '2025-01-08T15:00:00Z', updated_at: '2025-01-08T15:00:00Z' },
    ]
  },
  { 
    id: '2', email: 'jane@example.com', name: 'Jane Smith', subscription_tier: 'enterprise', is_active: true, 
    created_at: '2024-12-15T14:00:00Z', last_login: '2025-01-11T16:45:00Z', api_calls_count: 3420,
    tasks: [
      { id: 't4', title: 'Migrate to new API version', status: 'in_progress', priority: 'urgent', created_at: '2025-01-09T10:00:00Z' },
    ],
    notes: [
      { id: 'n3', title: 'Enterprise Deal', content: 'Signed 2-year enterprise contract. Account manager: Sarah', is_pinned: true, created_at: '2024-12-15T14:00:00Z', updated_at: '2024-12-15T14:00:00Z' },
    ]
  },
  { 
    id: '3', email: 'bob@example.com', name: 'Bob Wilson', subscription_tier: 'basic', is_active: false, 
    created_at: '2024-11-20T09:00:00Z', last_login: '2024-12-01T11:00:00Z', api_calls_count: 89,
    tasks: [],
    notes: [
      { id: 'n4', title: 'Churned User', content: 'Left due to pricing concerns. Might return with discount offer.', is_pinned: false, created_at: '2024-12-05T10:00:00Z', updated_at: '2024-12-05T10:00:00Z' },
    ]
  },
  { 
    id: '4', email: 'alice@example.com', name: 'Alice Brown', subscription_tier: 'free', is_active: true, 
    created_at: '2025-01-05T12:00:00Z', last_login: '2025-01-10T09:15:00Z', api_calls_count: 45,
    tasks: [
      { id: 't5', title: 'Upgrade to Pro', description: 'Considering upgrade', status: 'pending', priority: 'medium', created_at: '2025-01-07T10:00:00Z' },
    ],
    notes: []
  },
  { 
    id: '5', email: 'charlie@example.com', name: 'Charlie Davis', subscription_tier: 'pro', is_active: true, 
    created_at: '2024-10-10T08:00:00Z', last_login: '2025-01-12T07:00:00Z', api_calls_count: 2100,
    tasks: [
      { id: 't6', title: 'Integration testing', status: 'completed', priority: 'high', created_at: '2025-01-01T10:00:00Z', completed_at: '2025-01-03T16:00:00Z' },
      { id: 't7', title: 'Security audit', status: 'in_progress', priority: 'urgent', created_at: '2025-01-10T10:00:00Z' },
    ],
    notes: [
      { id: 'n5', title: 'Technical Contact', content: 'Prefers email communication. Very technical, works with our API team directly.', is_pinned: false, created_at: '2024-10-15T10:00:00Z', updated_at: '2024-10-15T10:00:00Z' },
    ]
  },
  { 
    id: '6', email: 'diana@example.com', name: 'Diana Prince', subscription_tier: 'enterprise', is_active: true, 
    created_at: '2024-09-01T08:00:00Z', last_login: '2025-01-12T10:00:00Z', api_calls_count: 5600,
    tasks: [],
    notes: []
  },
  { 
    id: '7', email: 'evan@example.com', name: 'Evan Rogers', subscription_tier: 'basic', is_active: true, 
    created_at: '2024-12-01T08:00:00Z', last_login: '2025-01-11T14:00:00Z', api_calls_count: 320,
    tasks: [],
    notes: []
  },
  { 
    id: '8', email: 'fiona@example.com', name: 'Fiona Green', subscription_tier: 'pro', is_active: false, 
    created_at: '2024-08-15T08:00:00Z', last_login: '2024-11-20T09:00:00Z', api_calls_count: 890,
    tasks: [],
    notes: []
  },
];

const apiKeys = [
  { id: '1', name: 'Production API', key: 'voc_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx', is_active: true, created_at: '2025-01-01T10:00:00Z', last_used: '2025-01-12T09:00:00Z', permissions: ['read', 'write'] },
  { id: '2', name: 'Development API', key: 'voc_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx', is_active: true, created_at: '2024-12-20T14:00:00Z', last_used: '2025-01-11T15:30:00Z', permissions: ['read'] },
  { id: '3', name: 'Legacy Integration', key: 'voc_live_oldxxxxxxxxxxxxxxxxxxxxxxxxx', is_active: false, created_at: '2024-06-15T09:00:00Z', last_used: '2024-11-01T10:00:00Z', permissions: ['read'] },
  { id: '4', name: 'Mobile App', key: 'voc_live_mobxxxxxxxxxxxxxxxxxxxxxxxxx', is_active: true, created_at: '2024-11-01T10:00:00Z', last_used: '2025-01-12T08:00:00Z', permissions: ['read', 'write'] },
];

const logs = [
  { id: '1', activity_type: 'login', severity: 'info', message: 'User john@example.com logged in successfully', user_id: '1', user_email: 'john@example.com', ip_address: '192.168.1.100', created_at: '2025-01-12T08:30:00Z' },
  { id: '2', activity_type: 'api_call', severity: 'info', message: 'API request to /users endpoint', user_id: '2', user_email: 'jane@example.com', ip_address: '10.0.0.50', created_at: '2025-01-12T08:25:00Z' },
  { id: '3', activity_type: 'config_change', severity: 'warning', message: 'Rate limiting configuration updated', user_id: '1', user_email: 'john@example.com', ip_address: '192.168.1.100', created_at: '2025-01-12T08:20:00Z' },
  { id: '4', activity_type: 'api_call', severity: 'error', message: 'API rate limit exceeded for user', user_id: '3', user_email: 'bob@example.com', ip_address: '172.16.0.25', created_at: '2025-01-12T08:15:00Z' },
  { id: '5', activity_type: 'user_update', severity: 'info', message: 'User subscription upgraded to Pro', user_id: '4', user_email: 'alice@example.com', ip_address: '192.168.1.105', created_at: '2025-01-12T08:10:00Z' },
  { id: '6', activity_type: 'login', severity: 'critical', message: 'Multiple failed login attempts detected', user_id: null, user_email: 'unknown@attacker.com', ip_address: '203.0.113.50', created_at: '2025-01-12T08:05:00Z' },
  { id: '7', activity_type: 'api_call', severity: 'info', message: 'Bulk export completed successfully', user_id: '2', user_email: 'jane@example.com', ip_address: '10.0.0.50', created_at: '2025-01-12T07:55:00Z' },
  { id: '8', activity_type: 'logout', severity: 'info', message: 'User charlie@example.com logged out', user_id: '5', user_email: 'charlie@example.com', ip_address: '192.168.1.110', created_at: '2025-01-12T07:50:00Z' },
];

const configs = [
  { id: '1', key: 'rate_limit_enabled', value: true, type: 'boolean', description: 'Enable API rate limiting for all endpoints', updated_at: '2025-01-10T10:00:00Z' },
  { id: '2', key: 'max_requests_per_minute', value: 100, type: 'number', description: 'Maximum API requests allowed per minute per user', updated_at: '2025-01-10T10:00:00Z' },
  { id: '3', key: 'maintenance_mode', value: false, type: 'boolean', description: 'Enable maintenance mode to block all API requests', updated_at: '2025-01-08T14:00:00Z' },
  { id: '4', key: 'support_email', value: 'support@voclio.com', type: 'string', description: 'Support email address shown to users', updated_at: '2025-01-05T09:00:00Z' },
  { id: '5', key: 'session_timeout_minutes', value: 30, type: 'number', description: 'User session timeout in minutes', updated_at: '2025-01-01T12:00:00Z' },
  { id: '6', key: 'allow_signups', value: true, type: 'boolean', description: 'Allow new user registrations', updated_at: '2025-01-01T12:00:00Z' },
  { id: '7', key: 'max_api_keys_per_user', value: 5, type: 'number', description: 'Maximum number of API keys a user can create', updated_at: '2025-01-01T12:00:00Z' },
];

const TEST_TOKEN = 'test_admin_token_12345';

// Helper functions
function paginate(data, page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const paginatedData = data.slice(start, start + limit);
  return {
    data: paginatedData,
    total: data.length,
    page,
    limit,
    total_pages: Math.ceil(data.length / limit),
  };
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function checkAuth(req) {
  const auth = req.headers.authorization;
  return auth === `Bearer ${TEST_TOKEN}`;
}

// Server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const params = Object.fromEntries(url.searchParams);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return sendJSON(res, {});
  }

  // Login endpoint (no auth required)
  if (path === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    if (body.email === 'admin@test.com' && body.password === 'admin123') {
      return sendJSON(res, { token: TEST_TOKEN, user: { id: '0', email: 'admin@test.com', name: 'Test Admin', role: 'admin' } });
    }
    return sendJSON(res, { message: 'Invalid credentials' }, 401);
  }

  // All other endpoints require auth
  if (!checkAuth(req)) {
    return sendJSON(res, { message: 'Unauthorized' }, 401);
  }

  // Users
  if (path === '/api/admin/users' && req.method === 'GET') {
    let filtered = [...users];
    if (params.search) filtered = filtered.filter(u => u.name.toLowerCase().includes(params.search.toLowerCase()) || u.email.toLowerCase().includes(params.search.toLowerCase()));
    if (params.subscription_tier) filtered = filtered.filter(u => u.subscription_tier === params.subscription_tier);
    if (params.is_active !== undefined) filtered = filtered.filter(u => u.is_active === (params.is_active === 'true'));
    return sendJSON(res, paginate(filtered, +params.page || 1, +params.limit || 10));
  }

  const userMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (userMatch) {
    const user = users.find(u => u.id === userMatch[1]);
    if (!user) return sendJSON(res, { message: 'User not found' }, 404);
    if (req.method === 'GET') return sendJSON(res, user);
    if (req.method === 'PUT') {
      const body = await parseBody(req);
      Object.assign(user, body);
      return sendJSON(res, user);
    }
    if (req.method === 'DELETE') {
      const idx = users.findIndex(u => u.id === userMatch[1]);
      users.splice(idx, 1);
      return sendJSON(res, {}, 204);
    }
  }

  if (path.match(/^\/api\/admin\/users\/[^/]+\/reset-password$/) && req.method === 'POST') {
    return sendJSON(res, { message: 'Password reset email sent' });
  }

  // API Usage
  if (path === '/api/admin/api-usage' && req.method === 'GET') {
    return sendJSON(res, {
      total_requests: 45230,
      total_errors: 1250,
      success_rate: 97.24,
      breakdown: [
        { api_type: 'users', date: '2025-01-12', requests: 1200, errors: 25 },
        { api_type: 'auth', date: '2025-01-12', requests: 3500, errors: 150 },
        { api_type: 'data', date: '2025-01-12', requests: 8900, errors: 320 },
        { api_type: 'users', date: '2025-01-11', requests: 1150, errors: 30 },
        { api_type: 'auth', date: '2025-01-11', requests: 3200, errors: 120 },
        { api_type: 'data', date: '2025-01-11', requests: 8500, errors: 280 },
        { api_type: 'webhooks', date: '2025-01-12', requests: 2100, errors: 45 },
        { api_type: 'webhooks', date: '2025-01-11', requests: 1980, errors: 38 },
      ],
    });
  }

  // API Keys
  if (path === '/api/admin/api-keys' && req.method === 'GET') {
    return sendJSON(res, paginate(apiKeys, +params.page || 1, +params.limit || 10));
  }
  if (path === '/api/admin/api-keys' && req.method === 'POST') {
    const body = await parseBody(req);
    const newKey = { id: String(apiKeys.length + 1), name: body.name, key: 'sk_new_' + Math.random().toString(36).slice(2), is_active: true, created_at: new Date().toISOString(), permissions: body.permissions || ['read'] };
    apiKeys.push(newKey);
    return sendJSON(res, newKey, 201);
  }

  const keyMatch = path.match(/^\/api\/admin\/api-keys\/([^/]+)$/);
  if (keyMatch) {
    const key = apiKeys.find(k => k.id === keyMatch[1]);
    if (!key) return sendJSON(res, { message: 'API key not found' }, 404);
    if (req.method === 'PUT') {
      const body = await parseBody(req);
      Object.assign(key, body);
      return sendJSON(res, key);
    }
    if (req.method === 'DELETE') {
      const idx = apiKeys.findIndex(k => k.id === keyMatch[1]);
      apiKeys.splice(idx, 1);
      return sendJSON(res, {}, 204);
    }
  }

  // Logs
  if (path === '/api/admin/logs' && req.method === 'GET') {
    let filtered = [...logs];
    if (params.activity_type) filtered = filtered.filter(l => l.activity_type === params.activity_type);
    if (params.severity) filtered = filtered.filter(l => l.severity === params.severity);
    return sendJSON(res, paginate(filtered, +params.page || 1, +params.limit || 20));
  }

  // Config
  if (path === '/api/admin/config' && req.method === 'GET') {
    return sendJSON(res, configs);
  }
  if (path === '/api/admin/config' && req.method === 'PUT') {
    const body = await parseBody(req);
    if (body.configs) {
      body.configs.forEach(update => {
        const config = configs.find(c => c.key === update.key);
        if (config) config.value = update.value;
      });
    }
    return sendJSON(res, configs);
  }

  // Logout
  if (path === '/api/auth/logout' && req.method === 'POST') {
    return sendJSON(res, { message: 'Logged out' });
  }

  sendJSON(res, { message: 'Not found' }, 404);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log('\n' + '═'.repeat(50));
  console.log('  🚀 VOCLIO Mock API Server');
  console.log('═'.repeat(50));
  console.log(`  Server: http://localhost:${PORT}`);
  console.log('  Status: Running');
  console.log('═'.repeat(50));
  console.log('  📧 Test Login:');
  console.log('     Email: admin@test.com');
  console.log('     Password: admin123');
  console.log('═'.repeat(50) + '\n');
});
