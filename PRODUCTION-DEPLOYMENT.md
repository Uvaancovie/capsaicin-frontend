# Production Deployment Guide

## Overview
- **Backend**: Deployed on Render at https://capsaicin-backend.onrender.com
- **Frontend**: Deploy on Vercel
- **Database**: Neon PostgreSQL (already connected)

## Current Status
✅ Backend deployed successfully on Render
✅ Database connected to Neon
⚠️  Frontend needs deployment to Vercel

## Step 1: Update Backend CORS for Production

Your backend on Render needs to be updated to allow your Vercel domain. You'll need to:

1. **Add Vercel URL to environment variables in Render:**
   - Go to your Render dashboard
   - Navigate to your backend service
   - Go to Environment tab
   - Add: `FRONTEND_URL=https://your-app-name.vercel.app`

2. **Also add localhost for development:**
   - The backend already includes `localhost:3001` in allowed origins

## Step 2: Deploy Frontend to Vercel

1. **Create Vercel account** at vercel.com
2. **Connect your GitHub repository** (if using GitHub)
3. **Set environment variables in Vercel:**
   ```
   NEXT_PUBLIC_API_URL=https://capsaicin-backend.onrender.com
   ```

## Step 3: Update Backend with Vercel URL

After you get your Vercel URL (e.g., `https://your-app-name.vercel.app`):

1. **Update Render environment variable:**
   - Set `FRONTEND_URL=https://your-app-name.vercel.app`

## Step 4: Test the Connection

### Current Local Testing Setup
- Frontend: `http://localhost:3001`
- Backend: `https://capsaicin-backend.onrender.com`
- API calls configured via `.env.local`

### CORS Configuration
Your backend is configured to accept requests from:
- `http://localhost:3001` (local development)
- `http://localhost:3000` (alternative local)
- `process.env.FRONTEND_URL` (production Vercel URL)

## Environment Variables Summary

### Frontend (.env.local - for local development)
```
NEXT_PUBLIC_API_URL=https://capsaicin-backend.onrender.com
```

### Frontend (Vercel - for production)
```
NEXT_PUBLIC_API_URL=https://capsaicin-backend.onrender.com
```

### Backend (Render - current)
```
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Backend (Render - add this)
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Quick Vercel Deployment Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from your project directory**:
   ```bash
   vercel --prod
   ```

3. **Or use Vercel Dashboard**:
   - Connect GitHub repository
   - Import project
   - Set environment variables
   - Deploy

## Testing Checklist

- [ ] Backend API responding at https://capsaicin-backend.onrender.com/products
- [ ] Local frontend connects to Render backend
- [ ] Vercel deployment successful
- [ ] CORS configured for Vercel domain
- [ ] All API endpoints working (products, auth)
- [ ] Admin panel functional
- [ ] Shop page displaying products

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set in Render
- Check Vercel deployment URL matches exactly

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` in Vercel environment
- Test API endpoints directly with curl/Postman

### Database Issues
- Check Neon database status
- Verify `DATABASE_URL` in Render environment

## Next Steps

1. **Deploy to Vercel** and get your production URL
2. **Update Render's `FRONTEND_URL`** environment variable
3. **Test the production deployment**
4. **Optional**: Set up custom domain if needed
