#!/bin/bash

echo "🚨 SECURITY BREACH REMEDIATION SCRIPT"
echo "======================================"
echo ""
echo "This script will:"
echo "1. Remove .env from git tracking (current commit)"
echo "2. Remove .env from git history (all commits)"
echo "3. Force push to GitHub to remove exposed secrets"
echo ""
echo "⚠️  WARNING: This will rewrite git history and require force push!"
echo "⚠️  CRITICAL: You MUST rotate all secrets FIRST (see SECURITY_BREACH_REMEDIATION.md)"
echo ""
read -p "Have you already rotated ALL secrets in Supabase and Schwab? (yes/no): " ROTATED

if [ "$ROTATED" != "yes" ]; then
    echo ""
    echo "❌ STOP! Rotate secrets FIRST before running this script!"
    echo ""
    echo "Follow the steps in SECURITY_BREACH_REMEDIATION.md:"
    echo "1. Rotate Supabase Service Role Key"
    echo "2. Rotate Supabase Anon Key" 
    echo "3. Change Database Password"
    echo "4. Revoke and regenerate Schwab API credentials"
    echo ""
    exit 1
fi

echo ""
echo "Step 1: Committing removal of .env from current state..."
git add .gitignore vercel.json SECURITY_BREACH_REMEDIATION.md
git add frontend/
git commit -m "security: Remove .env from git and clean up leaked credentials

BREAKING CHANGE: All API keys and secrets have been rotated.
- Removed .env from git tracking
- Updated .gitignore to prevent future leaks
- Added security remediation documentation

Closes security alerts:
- Supabase Service Key rotated
- PostgreSQL credentials rotated  
- Schwab API keys regenerated
"

echo ""
echo "Step 2: Installing git-filter-repo (if needed)..."
if ! command -v git-filter-repo &> /dev/null; then
    echo "Installing git-filter-repo..."
    brew install git-filter-repo || pip3 install git-filter-repo
fi

echo ""
echo "Step 3: Removing .env from entire git history..."
git filter-repo --path .env --invert-paths --force

echo ""
echo "Step 4: Cleaning up git repository..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Local repository cleaned!"
echo ""
echo "Step 5: Force push to GitHub..."
read -p "Ready to FORCE PUSH to GitHub and overwrite history? (yes/no): " PUSH

if [ "$PUSH" = "yes" ]; then
    git push --force-with-lease origin main
    echo ""
    echo "✅ Done! Secrets removed from GitHub!"
    echo ""
    echo "Final steps:"
    echo "1. Go to https://github.com/MAKaminski/alpha-kite/security"
    echo "2. Mark each alert as 'Revoked'"
    echo "3. Update Vercel environment variables with NEW secrets"
    echo ""
else
    echo ""
    echo "⚠️  Skipped force push. Run manually when ready:"
    echo "   git push --force-with-lease origin main"
    echo ""
fi

echo "🎉 Remediation complete!"

