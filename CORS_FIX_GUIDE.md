# CORS Fix Guide

## Problem
The admin panel was making direct API calls from the browser to `http://localhost:3001`, which caused CORS errors.

## Solution
All API calls now go through a Next.js proxy route at `/api/proxy`, which runs server-side and forwards requests to the backend API.

## How It Works

1. **Frontend** → Makes requests to `/api/proxy/*` (same origin, no CORS)
2. **Next.js Proxy** → Forwards to `http://localhost:3001/api/*` (server-side, no CORS)
3. **Backend API** → Responds to the proxy
4. **Proxy** → Returns response to frontend

## Configuration

### Frontend (src/lib/constants.ts)
```typescript
export const API_BASE_URL = '/api/proxy';
```

### Proxy (src/app/api/proxy/[...path]/route.ts)
```typescript
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001/api';
```

### Environment (.env.local)
```
BACKEND_API_URL=http://localhost:3001/api
```

## Fallback Mock Data

All services now include fallback mock data. If the API fails (backend not running, network error, etc.), the app will:
1. Log a warning to the console
2. Return mock data instead
3. Continue functioning normally

This allows development and testing without a running backend.

## Important: Restart Required

After updating the API configuration, you MUST restart the Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Troubleshooting

### Still seeing CORS errors?

1. **Hard refresh the browser**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear browser cache**: Open DevTools → Application → Clear storage
3. **Restart the dev server**: Stop and restart `npm run dev`
4. **Check the Network tab**: Verify requests are going to `/api/proxy/*` not `localhost:3001`

### Seeing "API failed, using mock data" in console?

This is normal if:
- Backend API is not running
- Backend API is on a different port
- Network connection issues

The app will work with mock data until the backend is available.

### Want to use real API?

1. Ensure backend is running on `http://localhost:3001`
2. Backend should have endpoints like `/api/admin/users`, `/api/admin/analytics`, etc.
3. Restart Next.js dev server
4. Refresh browser

## Testing

To verify the fix is working:

1. Open browser DevTools → Network tab
2. Navigate to any admin page
3. Check the API requests:
   - ✅ Should see: `http://localhost:3002/api/proxy/admin/...`
   - ❌ Should NOT see: `http://localhost:3001/api/admin/...`

If you see requests to `localhost:3001`, the browser is using cached code. Hard refresh!
