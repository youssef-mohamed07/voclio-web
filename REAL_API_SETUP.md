# Real API Integration - Complete Setup

## ✅ What Changed

### 1. **Real Authentication System**
- Removed test token authentication
- Implemented proper cookie-based authentication
- Created login page with admin credentials support
- Added middleware to protect admin routes

### 2. **Backend API Configuration**
- **Production Backend**: `https://voclio-backend.build8.dev/api`
- All API calls route through Next.js proxy at `/api/proxy`
- No more CORS issues

### 3. **Removed Mock Data Fallbacks**
- All services now use real API data only
- No more "using mock data" fallbacks
- Proper error handling and display

### 4. **Admin Credentials**
```json
{
  "email": "seifashraf12331@gmail.com",
  "password": "newpassword1234"
}
```

## 🚀 How to Use

### First Time Setup

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the app**:
   ```
   http://localhost:3002
   ```

3. **You'll be redirected to login page**:
   ```
   http://localhost:3002/login
   ```

4. **Login with admin credentials**:
   - Email: `seifashraf12331@gmail.com`
   - Password: `newpassword1234`

5. **After successful login**:
   - You'll be redirected to `/admin` (dashboard)
   - All data will be fetched from the real backend API
   - Token is stored in secure HTTP-only cookie

## 🔐 Authentication Flow

1. **User visits any `/admin/*` route**
   - Middleware checks for `voclio_admin_token` cookie
   - If no token → redirect to `/login`
   - If has token → allow access

2. **User submits login form**
   - Credentials sent to `/api/proxy/auth/login`
   - Backend validates and returns JWT token
   - Token stored in HTTP-only cookie (7 days expiry)
   - User redirected to `/admin`

3. **Subsequent API calls**
   - All requests include token from cookie
   - Proxy adds `Authorization: Bearer <token>` header
   - Backend validates token and returns data

4. **Logout**
   - Token cookie is cleared
   - User redirected to `/login`

## 📁 Files Modified/Created

### New Files:
- `src/app/login/page.tsx` - Login page (server component)
- `src/app/login/LoginClient.tsx` - Login form (client component)
- `src/middleware.ts` - Route protection middleware
- `.env.production` - Production environment config
- `.env.example` - Example environment config

### Modified Files:
- `src/lib/auth.ts` - Real cookie-based authentication
- `src/app/actions/auth.ts` - Login/logout server actions
- `src/app/api/proxy/[...path]/route.ts` - Allow auth endpoints without token
- `src/services/*.ts` - Removed all mock data fallbacks
- `.env.local` - Updated backend URL

## 🌐 API Endpoints

All endpoints are accessed through `/api/proxy/*`:

### Authentication
- `POST /api/proxy/auth/login` - Login (no token required)
- `POST /api/proxy/auth/logout` - Logout

### Admin Endpoints (require authentication)
- `GET /api/proxy/admin/users` - List users
- `GET /api/proxy/admin/analytics/system` - System analytics
- `GET /api/proxy/admin/analytics/ai-usage` - AI usage stats
- `GET /api/proxy/admin/analytics/content` - Content stats
- `GET /api/proxy/admin/api-keys` - List API keys
- `GET /api/proxy/admin/api-usage` - API usage stats
- `GET /api/proxy/admin/logs` - Activity logs
- `GET /api/proxy/admin/system/health` - System health
- `GET /api/proxy/admin/system/activity-logs` - Activity logs
- `GET /api/proxy/admin/config` - Configuration

## 🔧 Environment Variables

### `.env.local` (Development)
```bash
BACKEND_API_URL=https://voclio-backend.build8.dev/api
```

### `.env.production` (Production)
```bash
BACKEND_API_URL=https://voclio-backend.build8.dev/api
```

## 🧪 Testing the Integration

### 1. Test Login
```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3002

# Should redirect to /login
# Enter credentials and login
```

### 2. Test API Calls
```bash
# Open DevTools → Network tab
# Navigate to /admin/users
# Check requests:
# - Should see POST to /api/proxy/auth/login (if not logged in)
# - Should see GET to /api/proxy/admin/users
# - Should receive real data from backend
```

### 3. Test Authentication
```bash
# Try accessing /admin without login
# Should redirect to /login

# Login with credentials
# Should redirect to /admin

# Try accessing /login while logged in
# Should redirect to /admin
```

## 🐛 Troubleshooting

### "Unauthorized" Error
- Token might be expired or invalid
- Clear cookies and login again
- Check if backend is accepting the token

### "Network Error" or "Failed to Fetch"
- Backend might be down
- Check if `https://voclio-backend.build8.dev` is accessible
- Verify BACKEND_API_URL in .env.local

### Stuck on Login Page
- Check browser console for errors
- Verify credentials are correct
- Check Network tab for API response

### Data Not Loading
- Check if you're logged in (should have token cookie)
- Check Network tab for API calls
- Verify backend endpoints match expected format

## 📊 Expected Backend Response Format

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "seifashraf12331@gmail.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Users List Response
```json
{
  "data": [
    {
      "id": "1",
      "email": "user@example.com",
      "name": "User Name",
      "subscription_tier": "pro",
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z",
      ...
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "total_pages": 10
}
```

## 🎯 Next Steps

1. **Restart your dev server** to apply all changes
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Navigate to** `http://localhost:3002`
4. **Login** with the admin credentials
5. **Verify** real data is loading from the backend

## 🔒 Security Notes

- Tokens are stored in HTTP-only cookies (not accessible via JavaScript)
- Cookies are secure in production (HTTPS only)
- Tokens expire after 7 days
- All admin routes are protected by middleware
- No sensitive data in localStorage or sessionStorage

## 📝 Admin Credentials (Reminder)

```
Email: seifashraf12331@gmail.com
Password: newpassword1234
```

**Important**: Change these credentials in production!

---

**Status**: ✅ Ready for real API integration
**Backend**: https://voclio-backend.build8.dev/api
**Frontend**: http://localhost:3002 (dev) or your production URL
