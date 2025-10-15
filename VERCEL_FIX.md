# Fix Vercel Deployment

## The Problem
Vercel is looking for build output in the wrong directory because your frontend code is in a subdirectory.

## Solution: Set Root Directory in Vercel

### Step 1: Configure Root Directory in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project: `alpha-kite`
3. Click **Settings** (top navigation)
4. Scroll down to **Build & Development Settings**
5. Find **Root Directory**
6. Click **Edit**
7. Enter: `frontend`
8. Click **Save**

### Step 2: Verify Other Settings

While you're in **Build & Development Settings**, verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Install Command**: `npm install` (should auto-detect)

### Step 3: Commit and Push

```bash
git add vercel.json
git commit -m "fix: Simplify vercel.json for subdirectory deployment"
git push origin main
```

### Step 4: Trigger Redeploy

After pushing, Vercel will automatically deploy. Or you can manually trigger:
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment

## Why This Works

By setting **Root Directory** to `frontend`:
- Vercel runs all commands (`npm install`, `npm run build`) inside the `frontend/` directory
- The simplified `vercel.json` works correctly because paths are relative to `frontend/`
- Output directory `dist` becomes `frontend/dist` automatically

## Alternative: Delete vercel.json

If the above doesn't work, you can also:
1. Delete `vercel.json` from root
2. Let Vercel auto-detect everything
3. Just set Root Directory to `frontend` in dashboard

Vercel is smart enough to detect Vite projects automatically.

---

**After fixing, remember to:**
1. ✅ Set environment variables in Vercel (from IMMEDIATE_ACTION_REQUIRED.md)
2. ✅ Rotate your secrets first (they're still public on GitHub!)

