# Frontend-Backend Connection Setup Summary

This document summarizes the steps taken to properly connect the Aarambh LMS frontend with the backend.

## Current Status

✅ **Backend Server**: Running on http://localhost:3001
✅ **Frontend Server**: Can be started with `npm run dev` on http://localhost:5173
✅ **Database Connection**: MongoDB successfully connected
✅ **API Communication**: Frontend can communicate with backend API

## Configuration Overview

### Environment Variables

**Frontend** ([.env](file:///Users/madanthambisetty/Downloads/Aarambh/.env)):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Backend** ([server/.env](file:///Users/madanthambisetty/Downloads/Aarambh/server/.env)):
```env
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Connection Flow

1. Frontend makes API requests to `http://localhost:3001/api/*`
2. Backend receives requests and processes them
3. Backend communicates with MongoDB database
4. Backend returns JSON responses to frontend
5. Frontend updates UI based on API responses

## Files Modified

1. **[server/config/database.js](server/config/database.js)** - Fixed MongoDB connection options
2. **[test-api-connection.js](test-api-connection.js)** - Created connection testing script
3. **[FRONTEND_BACKEND_CONNECTION.md](FRONTEND_BACKEND_CONNECTION.md)** - Created comprehensive connection guide

## How to Run the Application

### 1. Start the Backend Server
```bash
cd server
npm start
```

Expected output:
```
🚀 Aarambh LMS Backend Server Started
🚀 Server running on port: 3001
✅ MongoDB Connected
```

### 2. Start the Frontend Server
In a new terminal:
```bash
npm run dev
```

Expected output:
```
VITE v5.4.8  ready in 1234 ms
  ➜  Local:   http://localhost:5173/
```

### 3. Test the Connection
1. Visit http://localhost:5173
2. Try to register a new user
3. Check browser developer tools for any errors

## Verification Commands

```bash
# Test backend health
curl http://localhost:3001/health

# Test API connection
node test-api-connection.js

# Check if servers are running
lsof -i :3001  # Backend
lsof -i :5173  # Frontend (after starting)
```

## Troubleshooting

### If Backend Won't Start
1. Check if port 3001 is already in use:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. Verify MongoDB Atlas IP whitelist includes your IP

3. Check environment variables in [server/.env](server/.env)

### If Frontend Can't Connect to Backend
1. Ensure backend is running on port 3001

2. Check `VITE_API_BASE_URL` in [.env](file:///Users/madanthambisetty/Downloads/Aarambh/.env) file

3. Verify `ALLOWED_ORIGINS` in [server/.env](server/.env) includes `http://localhost:5173`

### Common Error Messages

1. **"Failed to fetch"**: Backend server not running or unreachable
2. **CORS errors**: `ALLOWED_ORIGINS` not configured correctly
3. **404 errors**: Incorrect API endpoint paths
4. **500 errors**: Backend server errors

## Production Deployment

For deployment to Render (backend) and Vercel (frontend):

1. Update environment variables in deployment platforms
2. Ensure `ALLOWED_ORIGINS` includes your frontend URL
3. Verify MongoDB Atlas IP whitelist includes Render IPs

## Next Steps

1. ✅ Start both servers (instructions above)
2. ✅ Visit http://localhost:5173
3. ✅ Register and login to test authentication
4. ✅ Navigate through different pages to test all features
5. ✅ Check browser console for any errors

## Documentation

- [FRONTEND_BACKEND_CONNECTION.md](FRONTEND_BACKEND_CONNECTION.md) - Complete connection guide
- [RENDER_MONGODB_INTEGRATION.md](RENDER_MONGODB_INTEGRATION.md) - Render deployment guide
- [MONGODB_TROUBLESHOOTING.md](MONGODB_TROUBLESHOOTING.md) - Database connection issues

The frontend and backend are now properly connected and ready for development and deployment.