# Admin User Management & Branding - Complete Setup

## 🎯 What Was Implemented

Your church management app now has:

✅ **Admin-Only User Creation** - Only admins can add new leaders
✅ **No Self-Registration** - "Create Account" button removed for security
✅ **Role-Based Access Control** - Admin and Leader permissions enforced
✅ **Church Branding** - Faith Life Church logo and imagery throughout
✅ **User Management Interface** - Easy-to-use admin dashboard
✅ **Secure Backend** - Supabase Edge Functions with proper validation

## 🚀 Quick Setup (Choose One Method)

### Method 1: SQL Script (Fastest - 2 minutes)

1. **Set Admin User:**
   - Open https://ornqdhmxzitnfhwqrhxq.supabase.co
   - Go to: SQL Editor → New Query
   - Copy & paste from: `scripts/update-admin-role.sql`
   - Click "Run"

2. **Create Security Policies:**
   - Still in SQL Editor: New Query
   - Copy & paste from: `scripts/test-admin-rls-policies.sql`
   - Click "Run"

3. **Deploy Edge Function:**
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref ornqdhmxzitnfhwqrhxq
   supabase functions deploy create-user
   ```

### Method 2: Node Script (Alternative)

```bash
# Ensure .env has SUPABASE_SERVICE_ROLE_KEY
npm run update-admin
```

Then follow steps 2-3 from Method 1.

## 📋 What Changed

### 1. Database Changes
- Admin user: **konda@gmail.com** (UID: 6787d2e2-862c-4160-a96a-878c84e89d25)
- New RLS policies for admin-only operations
- Role enforcement at database level

### 2. Login Page
**Before:**
- Generic "Church Management" title
- "Create Account" button
- Generic red background

**After:**
- "Faith Life Church" branding
- Church logo and background image
- "Contact administrator" message
- No self-registration

### 3. Navigation (Admin Only)
**New Menu Item:** "Manage Users"
- Only visible to admins
- Access user management dashboard
- Create/view all users

### 4. User Management Page (Admin Only)
- View all users with roles
- Search and filter functionality
- Create new users (admin or leader)
- Secure password generation
- Email validation
- Real-time success/error feedback

## 🎨 Branding Details

### Images Used:
1. **flc pic.webp** → Logo (Header, Login, Favicon)
2. **flc pic 2.webp** → Background (Sidebar, Login page)

### Branding Locations:
- **Login Page:** Full background + logo + church name
- **Sidebar:** Logo + "Faith Life Church Ministry Management"
- **Header:** Logo + "Faith Life Church Ministry"
- **Browser Tab:** Favicon with church logo
- **Fallback:** "FLC" text if images fail to load

## 👥 User Roles & Permissions

### Admin (konda@gmail.com)
✅ Create new users (admin or leader)
✅ View all user profiles
✅ Access "Manage Users" page
✅ Update user roles
✅ All leader permissions
✅ System settings access

### Leader (All Other Users)
✅ Submit reports
✅ Manage their own members
✅ View follow-ups
✅ Access calendar and messages
❌ Cannot create users
❌ Cannot access User Management
❌ Cannot view other profiles

## 🔒 Security Features

1. **No Self-Registration** - Users can only be created by admins
2. **JWT Authentication** - All admin operations require valid tokens
3. **Role Verification** - Checked on both frontend and backend
4. **Input Validation** - Email format, password strength enforced
5. **Duplicate Prevention** - Email uniqueness enforced
6. **Transaction Safety** - Automatic rollback on errors
7. **RLS Policies** - Database-level access control
8. **Service Role Protection** - Never exposed to client

## 📝 How to Create Users (Admin)

1. **Login as Admin:**
   - Email: konda@gmail.com
   - Password: (your password)

2. **Navigate:**
   - Look for "Manage Users" in sidebar
   - Click to open User Management page

3. **Create User:**
   - Click "Create User" button
   - Fill in form:
     * Email (required)
     * Full Name (required)
     * Password (click "Generate" for strong password)
     * Role (admin or leader)
     * Branch (optional)
   - Click "Create User"

4. **Success:**
   - Notification: "Leader [name] has been created and invitation sent"
   - User appears in the list immediately
   - Leader receives email with credentials

## ⚙️ Technical Details

### Files Created:
```
scripts/
  ├── update-admin-role.sql           # Set admin user
  ├── verify-admin-role.sql           # Verify admin
  ├── update-admin-user.js            # Node script
  ├── test-admin-rls-policies.sql     # Create policies
  ├── test-rls-policies.js            # Test policies
  └── TASK-1.1-INSTRUCTIONS.md        # Detailed guide

supabase/functions/
  └── create-user/
      ├── index.ts                    # Edge Function
      └── README.md                   # API docs

src/
  ├── hooks/
  │   └── useRoleAccess.js            # Permission hook
  ├── components/
  │   ├── ProtectedRoute.jsx          # Route guard
  │   └── CreateUserModal.jsx         # User creation UI
  ├── pages/
  │   └── UserManagement.jsx          # Admin dashboard
  └── lib/
      └── adminService.js             # Admin API calls
```

### Modified Files:
- `src/contexts/AuthContext.jsx` - Added admin functions
- `src/App.jsx` - Added protected route
- `src/components/Sidebar.jsx` - Added branding + admin menu
- `src/components/Header.jsx` - Added branding
- `src/pages/Login.jsx` - Removed self-reg + added branding
- `index.html` - Updated favicon + metadata

## 🧪 Testing

### Test Admin Access:
```bash
npm run dev
```
1. Login as konda@gmail.com
2. Verify "Manage Users" appears in sidebar
3. Click and open User Management page
4. Create a test user
5. Verify success notification

### Test Leader Restrictions:
1. Logout
2. Login with created leader account
3. Verify "Manage Users" does NOT appear
4. Try accessing URL: `/users` (should be blocked)

### Test Branding:
1. Check login page has church background
2. Check sidebar has church logo
3. Check header has church logo
4. Check browser tab has favicon
5. Verify fallback "FLC" if images missing

## 🐛 Troubleshooting

### "Manage Users" not appearing
```sql
-- Run in SQL Editor:
UPDATE profiles SET role = 'admin' 
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
```

### Edge Function errors
```bash
# View logs:
supabase functions logs create-user

# Redeploy:
supabase functions deploy create-user --force
```

### Images not loading
- Check files exist: `src/assets/flc pic.webp` and `flc pic 2.webp`
- Fallback "FLC" text should appear automatically

### RLS policy errors
```bash
# Re-run:
# Copy scripts/test-admin-rls-policies.sql to SQL Editor
```

## 📚 Documentation Files

- **QUICK_START_GUIDE.md** - Fast 5-minute setup
- **IMPLEMENTATION_SUMMARY.md** - Complete technical details
- **supabase/functions/DEPLOYMENT.md** - Edge Function deployment
- **scripts/TASK-1.1-INSTRUCTIONS.md** - Admin setup instructions

## 🎉 You're Ready!

Your church management app now has:
- ✅ Secure admin-only user creation
- ✅ Beautiful Faith Life Church branding
- ✅ Role-based access control
- ✅ Professional user management interface

**Admin Login:** konda@gmail.com
**Feature Access:** Sidebar → "Manage Users"

Need help? Check the documentation files above!
