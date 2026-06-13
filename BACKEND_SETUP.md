# Backend API Configuration

## Production Backend

The admin panel is now configured to use the production backend API:

```
https://voclio-backend.build8.dev/api
```

## How It Works

1. **Frontend** makes requests to `/api/proxy/*` (Next.js route)
2. **Next.js Proxy** forwards to `https://voclio-backend.build8.dev/api/*`
3. **Backend API** processes the request
4. **Response** flows back through the proxy to the frontend

This architecture eliminates CORS issues since the browser only communicates with the Next.js server (same origin).

## Environment Configuration

### Production (.env.production)
```bash
BACKEND_API_URL=https://voclio-backend.build8.dev/api
```

### Local Development (.env.local)
```bash
# Uncomment and use this for local backend development
# BACKEND_API_URL=http://localhost:3001/api
```

### Default Fallback
If no environment variable is set, the proxy defaults to:
```
https://voclio-backend.build8.dev/api
```

## Switching Between Environments

### Use Production Backend (Default)
```bash
# .env.local
BACKEND_API_URL=https://voclio-backend.build8.dev/api
```

### Use Local Backend
```bash
# .env.local
BACKEND_API_URL=http://localhost:3001/api
```

After changing the environment variable:
1. Restart the dev server: `npm run dev`
2. Hard refresh browser: `Ctrl + Shift + R`

## Testing the Connection

### Check if backend is reachable:
```bash
curl https://voclio-backend.build8.dev/api/health
```

### Monitor API calls in browser:
1. Open DevTools → Network tab
2. Navigate to any admin page
3. Look for requests to `/api/proxy/*`
4. Check the response to see if data is coming from the backend

## Fallback Behavior

If the backend API is unreachable or returns an error:
- The app will log a warning: `"API failed, using mock data"`
- Mock data will be displayed automatically
- The app continues to function normally
- No user-facing errors

This allows development and testing even when the backend is down.

## Expected Backend Endpoints

The admin panel expects these endpoints to be available:

### Users
- `GET /admin/users` - List users with pagination
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `POST /admin/users/:id/reset-password` - Reset password
- `PUT /admin/users/:id/status` - Update user status
- `PUT /admin/users/:id/role` - Update user role
- `POST /admin/users/bulk-delete` - Bulk delete users

### Analytics
- `GET /admin/analytics/system` - System overview
- `GET /admin/analytics/ai-usage` - AI usage statistics
- `GET /admin/analytics/content` - Content statistics

### API Keys
- `GET /admin/api-keys` - List API keys
- `POST /admin/api-keys` - Create API key
- `PUT /admin/api-keys/:id` - Update API key
- `DELETE /admin/api-keys/:id` - Delete API key

### API Usage
- `GET /admin/api-usage` - Get API usage statistics

### Logs
- `GET /admin/logs` - Get activity logs

### System
- `GET /admin/system/health` - System health status
- `GET /admin/system/activity-logs` - Activity logs
- `POST /admin/system/clear-old-data` - Clear old data

### Configuration
- `GET /admin/config` - Get configuration
- `PUT /admin/config` - Update configuration

## Authentication

All requests include the authentication token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is managed by the Next.js proxy and retrieved from cookies/session.

## Troubleshooting

### Backend not responding?
- Check if `https://voclio-backend.build8.dev` is accessible
- Verify the backend is running and healthy
- Check browser console for error messages
- App will automatically fall back to mock data

### CORS errors?
- Should not happen with the proxy setup
- If you see CORS errors, verify requests go to `/api/proxy/*` not directly to the backend
- Hard refresh browser to clear cache

### Authentication errors?
- Check if the auth token is valid
- Verify the backend accepts the token format
- Check proxy logs for authentication issues

## Development Tips

1. **Use mock data during development**: No need to run backend locally
2. **Test with production backend**: Set `BACKEND_API_URL` to production
3. **Debug proxy issues**: Check Next.js server logs
4. **Monitor network traffic**: Use browser DevTools Network tab

## Next Steps

1. Restart your dev server to apply the new backend URL
2. Test the connection by navigating to any admin page
3. Check browser console for any errors
4. Verify data is loading from the backend (not mock data)

If you see "API failed, using mock data" in the console, the backend might not be reachable or the endpoints might not match the expected format.
