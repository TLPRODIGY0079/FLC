# Admin Scripts

This directory contains administrative scripts for managing the church application.

## Available Scripts

### 1. update-admin-role.sql (⭐ RECOMMENDED)
SQL script to update the admin user profile directly in Supabase Dashboard.

**Purpose:** Grant admin privileges to the designated user (konda@gmail.com)

**Usage:**
1. Go to Supabase Dashboard: https://ornqdhmxzitnfhwqrhxq.supabase.co
2. Navigate to: SQL Editor
3. Copy and paste the contents of `scripts/update-admin-role.sql`
4. Click "Run" to execute
5. The script will verify the update automatically

**Advantages:**
- ✅ No local setup required
- ✅ No need for Service Role Key
- ✅ Includes idempotency check
- ✅ Immediate verification

---

### 2. update-admin-user.js
Node.js script to update the admin user profile programmatically.

**Purpose:** Same as SQL script, but automated via Node.js

**Requirements:**
- Node.js (version 14+)
- Valid Supabase service role key
- The target user must exist in the `auth.users` and `profiles` tables

**Setup:**

1. Ensure your `.env` file contains the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

**Usage:**

Run the script using npm:
```bash
npm run update-admin
```

Or directly with Node:
```bash
node scripts/update-admin-user.js
```

### Features

1. **Idempotency**: The script checks if the user is already an admin before attempting the update. If the user already has the admin role, it skips the update and reports success.

2. **Verification**: After updating the role, the script queries the profiles table to verify the change was applied correctly.

3. **Error Handling**: The script provides clear error messages if:
   - Environment variables are missing
   - The user profile doesn't exist
   - Database operations fail

### Target User

- **User ID**: `6787d2e2-862c-4160-a96a-878c84e89d25`
- **Email**: `konda@gmail.com`

To update a different user, modify the `ADMIN_USER_ID` constant in the script.

### Output

The script will output:
- Current profile information
- Update status (or idempotency skip message)
- Verification of the final profile state

### Security Notes

- This script uses the Supabase service role key, which bypasses Row Level Security (RLS)
- The service role key should never be exposed in client-side code
- Keep the `.env` file secure and never commit it to version control
