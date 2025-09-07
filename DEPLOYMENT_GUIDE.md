# 🚀 Complete Deployment Guide for Capsaicin E-commerce

## Overview
This guide will help you deploy:
- **Backend** → Render (Node.js API server)
- **Frontend** → Vercel (Next.js application)

---

## 📦 Step 1: Deploy Backend to Render

### A. Create Backend Repository
1. Create a new GitHub repository called `capsaicin-backend`
2. Copy all files from the `backend` folder to the root of this new repository
3. Important files to include:
   ```
   server.js
   package.json
   seed-products.js
   .gitignore
   ```

### B. Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your `capsaicin-backend` repository
4. Configure the service:
   - **Name**: `capsaicin-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

### C. Set Environment Variables on Render
In the Render dashboard, add these environment variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://way2flyagency:way2flymillionaire@mern.7txgf4m.mongodb.net/capsaicin-ecommerce
PORT=4000
```

### D. Note Your Backend URL
After deployment, Render will give you a URL like:
`https://capsaicin-backend-xxxx.onrender.com`

**SAVE THIS URL - you'll need it for the frontend!**

---

## 🌐 Step 2: Deploy Frontend to Vercel

### A. Update Frontend Configuration
1. In your main repository, update `.env.production`:
   ```
   NEXT_PUBLIC_API_URL=https://your-actual-render-url.onrender.com
   ```
   Replace with your actual Render backend URL from Step 1D.

### B. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click **"New Project"**
3. Import your `capsaicin-frontend` repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### C. Set Environment Variables on Vercel
In Vercel dashboard → Your Project → Settings → Environment Variables:
```
Variable: NEXT_PUBLIC_API_URL
Value: https://your-actual-render-url.onrender.com
Environment: Production
```

### D. Update Backend CORS
After getting your Vercel URL (e.g., `https://capsaicin-ecommerce.vercel.app`), update the backend CORS:

1. In your backend repository, edit `server.js`:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:3001', 
       'http://localhost:4000', 
       'https://capsaicin-ecommerce.vercel.app', // Your actual Vercel URL
       'https://your-vercel-app.vercel.app'      // Add your actual URL here
     ],
     credentials: true
   }));
   ```

2. Commit and push to trigger redeployment on Render.

---

## 🔧 Step 3: Test Your Deployment

### Test Backend
Visit: `https://your-render-url.onrender.com/health`
You should see:
```json
{
  "status": "OK",
  "message": "Server is healthy",
  "timestamp": "2025-09-07T..."
}
```

### Test Frontend
Visit your Vercel URL and test:
1. ✅ Homepage loads
2. ✅ Shop page shows products
3. ✅ Can add items to cart
4. ✅ Can generate invoice
5. ✅ Admin dashboard works (username: `admincapepharm`, password: `capepharm123$`)

---

## 🚨 Important Notes

### Free Tier Limitations
- **Render Free**: Spins down after 15 minutes of inactivity
- **First request**: Takes 30+ seconds to wake up
- **Consider paid plan** for production use

### Security Checklist
- ✅ Environment variables set correctly
- ✅ CORS origins updated with actual domains
- ✅ MongoDB connection string secure
- ✅ No sensitive data in code

---

## 🔄 Deployment Commands Summary

### For Backend Updates:
```bash
# In your backend repository
git add .
git commit -m "Update backend"
git push origin main
# Render will auto-deploy
```

### For Frontend Updates:
```bash
# In your main repository
git add .
git commit -m "Update frontend"
git push origin main
# Vercel will auto-deploy
```

---

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Error**
   - Update backend CORS with your actual Vercel URL
   - Redeploy backend after CORS update

2. **API Connection Failed**
   - Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
   - Ensure backend is running (visit `/health` endpoint)

3. **Build Failed**
   - Check all dependencies are in `package.json`
   - Check for TypeScript errors

4. **Database Connection Failed**
   - Verify `MONGODB_URI` in Render environment variables
   - Check MongoDB Atlas IP whitelist (should allow all: `0.0.0.0/0`)

### Quick Health Checks:
- Backend Health: `https://your-render-url.onrender.com/health`
- Frontend: Open browser console for error messages
- Database: Check MongoDB Atlas metrics

---

## 📋 Deployment Checklist

### Backend (Render):
- [ ] Created separate GitHub repository
- [ ] Deployed on Render
- [ ] Environment variables set
- [ ] Health endpoint working
- [ ] MongoDB connection working

### Frontend (Vercel):
- [ ] Deployed on Vercel
- [ ] Environment variables set
- [ ] API connection working
- [ ] All pages loading
- [ ] Admin dashboard accessible

### Final Steps:
- [ ] Updated backend CORS with Vercel URL
- [ ] Tested complete user flow
- [ ] Noted all URLs for future reference

---

🎉 **Congratulations!** Your Capsaicin E-commerce application is now live!

**Backend**: https://your-render-url.onrender.com
**Frontend**: https://your-vercel-url.vercel.app


# the following changes ahve been made to the original deployment guide to reflect the new setup with an external backend.

# the frontend now connects to an external backend hosted on Render, so all references to local backend setup and deployment have been removed.

