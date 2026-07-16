# Quick Start Guide - Admin User Management

## Step-by-Step Setup (5 minutes)

### Step 1: Set Admin User (2 minutes)

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to https://ornqdhmxzitnfhwqrhxq.supabase.co
2. Navigate to: **SQL Editor** → **New query**
3. Copy and paste contents of `scripts/update-admin-role.sql`
4. Click **Run**
5. Verify you see "✓ Admin role assigned successfully"

**Option B: Using Node Script**
```bash
npm run update-admin
```

### Step 2: Create RLS Policies (1 minute)

1. In Supabase Dashboard: **SQL Editor** → **New query**
2. Copy and paste contents of `scripts/test-admin-rls-policies.sql`
3. Click **Run**
4. Verify policies were created

### Step 3: Deploy Edge Function (2 minutes)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ornqdhmxzitnfhwqrhxq

# Deploy the Edge Function
supabase functions deploy create-user
```

### Step 4: Test the Application

```bash
# Start development server
npm run dev
```

1. **Login as Admin:**
   - Email: `konda@gmail.com`
   - Password: (your password)

2. **Verify Admin Access:**
   - Look for "Manage Users" in the sidebar
   - Click it to open User Management page

3. **Create a Test User:**
   - Click "Create User" button
   - Fill in the form (click "Generate" for password)
   - Click "Create User"
   - Verify success notification

4. **Test Leader Access:**
   - Logout
   - Login with the new user credentials
   - Verify "Manage Users" menu item is NOT visible
   - Try accessing /users directly (should be blocked)

## What You Should See

### As Admin:
✅ "Manage Users" menu item in sidebar
✅ User Management page accessible
✅ Can create new users
✅ Church branding everywhere

### As Leader:
❌ No "Manage Users" menu item
❌ Cannot access User Management page
✅ Can use all other features
✅ Church branding everywhere

### Login Page Changes:
❌ No "Create Account" button
✅ Church logo and background image
✅ "Contact administrator" message

## Verification Commands

```bash
# Verify admin user in database
# Run in Supabase SQL Editor:
SELECT id, email, role FROM profiles WHERE email = 'konda@gmail.com';
# Should show: role = 'admin'

# Check Edge Function logs
supabase functions logs create-user

# Test Edge Function locally
supabase functions serve create-user
```

## Common Issues & Quick Fixes

### "Manage Users" not showing
```sql
-- Run in SQL Editor:
UPDATE profiles SET role = 'admin' WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
```

### Edge Function not found
```bash
# Redeploy:
supabase functions deploy create-user --force
```

### Images not loading
- Check `src/assets/flc pic.webp` and `src/assets/flc pic 2.webp` exist
- Fallback "FLC" text should appear if missing

### RLS Policy errors
```bash
# Re-run policy script
# Copy scripts/test-admin-rls-policies.sql to SQL Editor and run
```

## Production Deployment

```bash
# Build the application
npm run build

# Deploy to Netlify (if using Netlify)
netlify deploy --prod

# Or deploy to your hosting provider
```

**Important:** Ensure environment variables are set in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- (Do NOT set SUPABASE_SERVICE_ROLE_KEY in frontend - only in Edge Functions)

## Support Files

- **Full Documentation:** `IMPLEMENTATION_SUMMARY.md`
- **Edge Function Guide:** `supabase/functions/DEPLOYMENT.md`
- **Admin Setup Guide:** `scripts/TASK-1.1-INSTRUCTIONS.md`
- **API Documentation:** `supabase/functions/create-user/README.md`

## Success Checklist

- [ ] Admin user (konda@gmail.com) has role='admin' in database
- [ ] RLS policies created
- [ ] Edge Function deployed
- [ ] "Manage Users" menu appears for admin
- [ ] Can create new users as admin
- [ ] Leaders cannot access User Management
- [ ] Church branding visible on all pages
- [ ] No "Create Account" button on login
- [ ] "Contact administrator" message visible

**Status: Ready to Use! 🎉**
