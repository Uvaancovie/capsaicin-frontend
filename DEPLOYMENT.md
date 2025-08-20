# Deployment Guide

## 🚀 Deploy Backend to Render

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2. Deploy Backend
1. **Connect Repository**: Link your GitHub repo to Render
2. **Create Web Service**: 
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Environment Variables** (Add in Render dashboard):
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_GmLPFNAS14ye@ep-soft-shape-a8ohty1g-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   PORT=10000
   ```

4. **Deploy**: Click "Create Web Service"
5. **Get URL**: Copy your Render backend URL (e.g., `https://capsaicin-backend.onrender.com`)

## 🌐 Deploy Frontend to Vercel

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 2. Deploy Frontend
1. **Import Project**: Connect your GitHub repo
2. **Framework**: Vercel will auto-detect Next.js
3. **Root Directory**: Leave as root (not backend folder)

4. **Environment Variables** (Add in Vercel dashboard):
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
   ```

5. **Deploy**: Click "Deploy"

### 3. Update CORS
After getting your Vercel URL, update the `FRONTEND_URL` environment variable in Render with your Vercel URL.

## ✅ Final Steps

1. **Initialize Database**: Visit `https://your-render-backend.onrender.com/init-db` (POST request)
2. **Test Admin**: Go to `https://your-vercel-app.vercel.app/admin`
3. **Add Products**: Use the admin panel to add products
4. **Test Shop**: Visit `https://your-vercel-app.vercel.app/shop`

## 🔧 Troubleshooting

- **CORS Errors**: Make sure `FRONTEND_URL` in Render matches your Vercel URL
- **Database Issues**: Check `DATABASE_URL` is correctly set in Render
- **API Not Found**: Ensure `NEXT_PUBLIC_API_URL` in Vercel points to your Render backend

## 📝 URLs You'll Need

- **Render Backend**: `https://your-app-name.onrender.com`
- **Vercel Frontend**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin`
- **Shop Page**: `https://your-project.vercel.app/shop`
