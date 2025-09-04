# Frontend Deployment Guide

## Overview
This is the frontend-only repository for the Capsaicin E-commerce application.

## Quick Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import this GitHub repository: `https://github.com/Uvaancovie/capsaicin-frontend`
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://capsaicin-backend.onrender.com`
5. Click "Deploy"

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel --prod

# Set environment variable when prompted:
# NEXT_PUBLIC_API_URL=https://capsaicin-backend.onrender.com
```

## Environment Variables Required

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://capsaicin-backend.onrender.com` | Backend API base URL |

## Backend Integration

This frontend connects to the backend deployed at:
**https://capsaicin-backend.onrender.com**

### Important: Backend CORS Configuration
After deploying the frontend, you need to update the backend's CORS settings:

1. Go to your Render dashboard
2. Navigate to your backend service
3. Add environment variable:
   - `FRONTEND_URL` = `https://your-vercel-app.vercel.app`

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/Uvaancovie/capsaicin-frontend.git
cd capsaicin-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://capsaicin-backend.onrender.com
```

4. Run development server:
```bash
npm run dev
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── shop/              # Product catalog
│   ├── cart/              # Shopping cart
│   ├── login/             # Authentication
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── admin-product-manager.tsx
│   ├── auth-form.tsx
│   ├── auth-provider.tsx
│   ├── cart-provider.tsx
│   ├── header.tsx
│   └── footer.tsx
├── lib/                   # Utilities
│   ├── api.ts            # API functions
│   └── utils.ts          # Helper utilities
└── public/               # Static assets
```

## Features

- ✅ Product catalog with search and filtering
- ✅ Admin dashboard for product management
- ✅ Shopping cart functionality
- ✅ User authentication (login/register)
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context API
- **TypeScript**: Full type safety

## Repository Structure

This is a frontend-only repository. The backend is maintained separately at:
- Backend: https://github.com/Uvaancovie/capsaicin-ecommerce (backend folder)
- Backend Deployment: https://capsaicin-backend.onrender.com

## Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Backend `FRONTEND_URL` updated with Vercel URL in Render
- [ ] Test all pages load correctly
- [ ] Test API connections (products, auth)
- [ ] Test admin functionality
- [ ] Test shopping cart functionality

## Support

For issues related to:
- Frontend bugs: Create issue in this repository
- Backend/API issues: Check the backend repository
- Deployment issues: Follow this guide or check Vercel documentation
