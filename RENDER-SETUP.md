# 🚀 Render Backend Environment Variables Setup

## Required Environment Variables for Render Dashboard

Go to your Render service dashboard: https://dashboard.render.com
Navigate to your backend service → Environment

Add these environment variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_GmLPFNAS14ye@ep-soft-shape-a8ohty1g-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your-secure-jwt-secret-change-this-in-production

NODE_ENV=production

FRONTEND_URL=https://capsaicin-frontend.vercel.app

PORT=3000
```

## Important Notes:

1. **JWT_SECRET**: Change "your-secure-jwt-secret-change-this-in-production" to a strong, random secret
2. **FRONTEND_URL**: This is your actual Vercel frontend URL
3. **DATABASE_URL**: Your Neon database connection string (already correct)

## After Adding Environment Variables:

1. Save the environment variables in Render
2. Render will automatically redeploy your backend
3. Test the connection with: https://capsaicin-backend.onrender.com/health

## Frontend Configuration:

Your frontend at https://capsaicin-frontend.vercel.app should have:
- Environment variable: `NEXT_PUBLIC_API_URL=https://capsaicin-backend.onrender.com`

## Test Endpoints:

- Health: https://capsaicin-backend.onrender.com/health
- Products: https://capsaicin-backend.onrender.com/products
- Root: https://capsaicin-backend.onrender.com/
