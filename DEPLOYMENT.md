# Deployment Guide

## Vercel Deployment

Your project is configured for automatic deployment to Vercel. Here's what happens when you commit:

### ✅ Git Commit Will Deploy IF:

1. **Vercel Project is Connected** to your GitHub repository
2. **Environment Variables are Set** in Vercel Dashboard

### 🔧 Required Vercel Environment Variables

Go to your Vercel Project → Settings → Environment Variables and add:

```
VITE_SUPABASE_URL=https://zdrzoozqjcwvgxlpmkal.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SCHWAB_API_KEY=Os3C2znHkqciGVi5IMHlq7NeXqbEenDfGrnj5sijzJfRCGhU
VITE_SCHWAB_API_SECRET=m5YMEpTk0zluhdYz0kwFaKQ98VlOZkErxR0C1ilWyOvK6tEYxoAA7kjKKB5hk2NK
```

### 📋 Deployment Process

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Fix: Configure frontend deployment with environment setup"
   git push origin main
   ```

2. **Vercel will automatically:**
   - Detect the push to `main` branch
   - Run `cd frontend && npm install && npm run build`
   - Deploy the `frontend/dist` folder
   - Apply environment variables from Vercel dashboard

### 🏗️ Build Configuration

The root `vercel.json` is configured to:
- Install dependencies from `frontend/` directory
- Build the React app with Vite
- Serve the static files from `frontend/dist`
- Apply security headers

### 🧪 Test Locally Before Deploying

```bash
cd frontend
npm run build
npm run preview
```

This will build and preview the production bundle locally.

### ⚠️ Important Notes

- Your `.env` file is gitignored and **will NOT** be deployed
- Environment variables **must** be set in Vercel Dashboard
- The app will show a configuration error if env vars are missing
- Make sure all VITE_ prefixed variables are added to Vercel

### 🔗 Vercel Dashboard

Access your project settings at: https://vercel.com/dashboard

Navigate to: `Your Project` → `Settings` → `Environment Variables`

