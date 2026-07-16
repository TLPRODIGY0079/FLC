# Task 1.1: Update Admin User Profile Record

## Objective
Update the profile record for user ID `6787d2e2-862c-4160-a96a-878c84e89d25` (konda@gmail.com) to set role as 'admin'.

## Requirements
- Update the profile record with admin role
- Verify the update by querying the profiles table
- Ensure idempotency (prevent duplicate role assignments)
- Requirements: 1.1, 1.2, 1.3, 1.5

---

## ⭐ RECOMMENDED METHOD: SQL Script

This is the easiest and fastest approach.

### Steps:

1. **Open Supabase Dashboard**
   - Navigate to: https://ornqdhmxzitnfhwqrhxq.supabase.co
   - Sign in with your credentials

2. **Open SQL Editor**
   - In the left sidebar, click "SQL Editor"
   - Click "New query"

3. **Run the Update Script**
   - Open the file: `scripts/update-admin-role.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify the Results**
   - You should see 3 result sets:
     1. Current profile status (before update)
     2. Number of rows affected by the update
     3. Verification with ✓ or ✗ status

5. **Expected Output**
   ```
   Result 1: Current profile
   id: 6787d2e2-862c-4160-a96a-878c84e89d25
   email: konda@gmail.com
   role: leader (or admin if already updated)
   
   Result 2: Update query
   (1 row affected) or (0 rows affected if already admin)
   
   Result 3: Verification
   status: ✓ Admin role assigned successfully
   ```

6. **Idempotency Check**
   - If you run the script multiple times, it will show "0 rows affected" after the first run
   - This confirms the idempotency check is working

---

## ALTERNATIVE METHOD: Node.js Script

If you prefer automation or need to run this repeatedly.

### Prerequisites:

1. **Get Service Role Key**
   - In Supabase Dashboard: Project Settings → API
   - Scroll to "Project API keys"
   - Copy the "service_role" key (NOT the anon key)

2. **Add to .env file**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### Steps:

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install
   ```

2. **Run the Script**
   ```bash
   npm run update-admin
   ```
   Or:
   ```bash
   node scripts/update-admin-user.js
   ```

3. **Expected Output**
   ```
   Starting admin user update...
   Target user ID: 6787d2e2-862c-4160-a96a-878c84e89d25
   Current profile: { id: '...', email: 'konda@gmail.com', role: 'leader' }
   Updating role from 'leader' to 'admin'...
   ✓ Profile updated successfully
   
   === Verification Complete ===
   Updated profile details:
     ID: 6787d2e2-862c-4160-a96a-878c84e89d25
     Email: konda@gmail.com
     Role: admin
     
   ✓ Admin user update completed successfully!
   ```

4. **If Already Admin**
   ```
   ✓ User is already an admin. No update needed.
   Idempotency check passed - role assignment is already complete.
   ```

---

## Verification

After running either method, you can verify the update:

### Method 1: Run Verification Script
1. Open SQL Editor in Supabase Dashboard
2. Copy contents of `scripts/verify-admin-role.sql`
3. Paste and run
4. Look for "✓ VERIFIED: User has admin role"

### Method 2: Manual Query
Run this query in SQL Editor:
```sql
SELECT id, email, role 
FROM profiles 
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
```

Expected result:
```
id: 6787d2e2-862c-4160-a96a-878c84e89d25
email: konda@gmail.com
role: admin
```

---

## Troubleshooting

### Issue: Profile not found
**Solution:** The user may not have logged in yet. The profile is created automatically on first login via the `handle_new_user()` trigger. Have the user log in first, then run the script again.

### Issue: Permission denied error
**Solution:** 
- SQL method: Ensure you're logged in as the project owner
- Node.js method: Verify the Service Role Key is correct in `.env`

### Issue: Script runs but role doesn't change
**Solution:** Check that:
1. The user ID is correct: `6787d2e2-862c-4160-a96a-878c84e89d25`
2. The profiles table has a `role` column with CHECK constraint allowing 'admin'
3. Run the verification script to confirm current state

---

## Next Steps

Once this task is complete:
✅ The admin user can now access admin-only features
✅ RLS policies will recognize this user as an admin
✅ You can proceed to Task 1.2: Create RLS policies for admin-only access

---

## Security Notes

⚠️ **IMPORTANT:**
- The Service Role Key bypasses all Row Level Security (RLS)
- Never commit the Service Role Key to version control
- The `.env` file is already in `.gitignore`
- Only use the Service Role Key in secure environments
