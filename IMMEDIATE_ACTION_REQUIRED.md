# 🚨 IMMEDIATE ACTION REQUIRED - DO THIS NOW!

## Your secrets are PUBLIC on GitHub! Act within 1 hour!

### ⏱️ STEP 1: Rotate Supabase Credentials (5 minutes)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/zdrzoozqjcwvgxlpmkal/settings/api

2. **Reset Service Role Key** (MOST CRITICAL):
   - Click "Reset" next to Service Role Key
   - Copy the new key
   - Save it in your password manager

3. **Reset Anon Key**:
   - Click "Reset" next to Anon Key  
   - Copy the new key
   - Save it

4. **Change Database Password**:
   - Go to: https://supabase.com/dashboard/project/zdrzoozqjcwvgxlpmkal/settings/database
   - Click "Reset Database Password"
   - Copy the new password
   - Save it

### ⏱️ STEP 2: Rotate Schwab API Keys (5 minutes)

1. Log into: https://developer.schwab.com/dashboard
2. Revoke current API Key ending in: `...jzJfRCGhU`
3. Generate new API Key and Secret
4. Copy and save them

### ⏱️ STEP 3: Update Local Files (2 minutes)

Update `/Users/makaminski1337/alpha-kite/.env`:
```bash
# BROKER (NEW CREDENTIALS)
SCHWAB_API_KEY=<your_new_key>
SCHWAB_API_SECRET=<your_new_secret>
...

# SUPABASE (NEW CREDENTIALS)
SUPABASE_URL="https://zdrzoozqjcwvgxlpmkal.supabase.co"
SUPABASE_ANON_KEY="<your_new_anon_key>"
SUPABASE_SERVICE_ROLE_KEY="<your_new_service_role_key>"
POSTGRES_PASSWORD="<your_new_db_password>"
...
```

Update `/Users/makaminski1337/alpha-kite/frontend/.env`:
```bash
VITE_SUPABASE_URL=https://zdrzoozqjcwvgxlpmkal.supabase.co
VITE_SUPABASE_ANON_KEY=<your_new_anon_key>
VITE_SCHWAB_API_KEY=<your_new_schwab_key>
VITE_SCHWAB_API_SECRET=<your_new_schwab_secret>
```

### ⏱️ STEP 4: Run Security Fix Script (2 minutes)

```bash
cd /Users/makaminski1337/alpha-kite
./fix-security-breach.sh
```

This will:
- Remove .env from git tracking
- Remove .env from git history
- Force push to GitHub to remove secrets

### ⏱️ STEP 5: Update Vercel (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Navigate to: Your Project → Settings → Environment Variables
3. Update ALL 4 environment variables with NEW values:
   - `VITE_SUPABASE_URL` (stays same)
   - `VITE_SUPABASE_ANON_KEY` (NEW)
   - `VITE_SCHWAB_API_KEY` (NEW)
   - `VITE_SCHWAB_API_SECRET` (NEW)
4. Redeploy the application

### ⏱️ STEP 6: Close GitHub Alerts (1 minute)

1. Go to: https://github.com/MAKaminski/alpha-kite/security
2. For each alert, click "Close as" → "Revoked"
3. Add comment: "Credentials rotated and removed from git history"

---

## Total Time: ~15-20 minutes

## After Completion

✅ All secrets rotated
✅ Git history cleaned  
✅ GitHub alerts closed
✅ Vercel updated
✅ Application secured

---

**START NOW! Every minute counts!** 🏃‍♂️💨

