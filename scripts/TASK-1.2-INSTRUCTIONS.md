# Task 1.2: Create RLS Policies for Admin-Only Access

## Objective
Create Row Level Security (RLS) policies to restrict profile management operations to admin users only.

## Requirements
- Create policy "Admins can view all profiles" to allow admins to SELECT all profile records
- Create policy "Admins can update user roles" to restrict UPDATE on profiles table to admin users only
- Create policy "Admins can insert new profiles" for profile creation during user provisioning
- Test policies by attempting operations as both admin and leader users
- Requirements: 7.1, 7.2, 7.4, 7.6, 7.7

---

## ⭐ RECOMMENDED METHOD: SQL Script in Supabase Dashboard

This is the easiest and most reliable approach.

### Steps:

1. **Open Supabase Dashboard**
   - Navigate to: https://ornqdhmxzitnfhwqrhxq.supabase.co
   - Sign in with your credentials

2. **Open SQL Editor**
   - In the left sidebar, click "SQL Editor"
   - Click "New query"

3. **Run the Policy Creation Script**
   - Open the file: `scripts/create-admin-rls-policies.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify the Results**
   - You should see NOTICE messages for each policy:
     - "Created policy: Admins can view all profiles" or "Policy already exists: Admins can view all profiles"
     - "Created policy: Admins can update user roles" or "Policy already exists: Admins can update user roles"
     - "Created policy: Admins can insert new profiles" or "Policy already exists: Admins can insert new profiles"
   - The final result set shows all policies on the profiles table

5. **Expected Output**
   ```
   NOTICE: Created policy: Admins can view all profiles
   NOTICE: Created policy: Admins can update user roles
   NOTICE: Created policy: Admins can insert new profiles
   
   Result Set: List of all policies
   ┌────────────────────────────────────┬───────────┬───────────────────────┬──────────────────────────┐
   │ policyname                         │ operation │ using_check           │ with_check_status        │
   ├────────────────────────────────────┼───────────┼───────────────────────┼──────────────────────────┤
   │ Admins can insert new profiles     │ INSERT    │ No USING clause       │ WITH CHECK clause present│
   │ Admins can update any profile      │ UPDATE    │ USING clause present  │ No WITH CHECK clause     │
   │ Admins can update user roles       │ UPDATE    │ USING clause present  │ No WITH CHECK clause     │
   │ Admins can view all profiles       │ SELECT    │ USING clause present  │ No WITH CHECK clause     │
   │ Users can insert their own profile │ INSERT    │ No USING clause       │ WITH CHECK clause present│
   │ Users can update their own profile │ UPDATE    │ USING clause present  │ No WITH CHECK clause     │
   │ Users can view all profiles        │ SELECT    │ USING clause present  │ No WITH CHECK clause     │
   └────────────────────────────────────┴───────────┴───────────────────────┴──────────────────────────┘
   ```

6. **Idempotency Check**
   - If you run the script multiple times, it will show "Policy already exists" messages
   - This confirms the policies are created once and won't cause errors on re-run

---

## Testing the Policies

After creating the policies, you must test them to ensure they work correctly.

### Prerequisites for Testing

1. **You need TWO user accounts:**
   - Admin user: konda@gmail.com (UID: 6787d2e2-862c-4160-a96a-878c84e89d25)
   - Leader user: Any existing leader account, or create one for testing

2. **Access to Supabase SQL Editor with different authenticated contexts**

### Test Script

Use the provided test script: `scripts/test-admin-rls-policies.sql`

### Test Execution Steps

#### Test 1: Admin Can View All Profiles

1. **In Supabase Dashboard:**
   - Go to Authentication → Users
   - Find the admin user (konda@gmail.com)
   - Note the UID: 6787d2e2-862c-4160-a96a-878c84e89d25

2. **Run the following query in SQL Editor:**
   ```sql
   -- Set the context to admin user (this simulates being logged in as admin)
   SET request.jwt.claim.sub = '6787d2e2-862c-4160-a96a-878c84e89d25';
   
   -- This should succeed and return all profiles
   SELECT id, email, full_name, role 
   FROM profiles 
   ORDER BY created_at DESC;
   ```

3. **Expected Result:** Should return all profile records

#### Test 2: Leader Cannot Update Another User's Role

1. **Find a leader user UID:**
   ```sql
   SELECT id, email, role FROM profiles WHERE role = 'leader' LIMIT 1;
   ```
   Copy the leader's UID

2. **Run as leader user:**
   ```sql
   -- Set context to leader user
   SET request.jwt.claim.sub = 'leader-uid-here';
   
   -- Try to update admin user's role (this should FAIL)
   UPDATE profiles 
   SET full_name = 'Test Update'
   WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
   ```

3. **Expected Result:** Should fail with error message about insufficient permissions

#### Test 3: Admin Can Update User Roles

1. **Run as admin user:**
   ```sql
   -- Set context to admin user
   SET request.jwt.claim.sub = '6787d2e2-862c-4160-a96a-878c84e89d25';
   
   -- Find a leader to update
   SELECT id, email, role FROM profiles WHERE role = 'leader' LIMIT 1;
   
   -- Update the leader's full_name (this should SUCCEED)
   UPDATE profiles 
   SET full_name = 'Updated by Admin'
   WHERE id = 'leader-uid-here';
   ```

2. **Expected Result:** Should succeed with message "1 row updated"

#### Test 4: Admin Can Insert New Profiles

**Note:** This test requires a corresponding auth.users entry. For safety, we'll just verify the policy exists rather than actually inserting.

1. **Verify the policy:**
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'profiles' 
   AND policyname = 'Admins can insert new profiles';
   ```

2. **Expected Result:** Should return the policy information

#### Test 5: Leader Cannot Insert New Profiles

**Note:** This verifies that without the admin check, inserts should fail.

The existing policy "Users can insert their own profile" only allows users to insert profiles where `auth.uid() = id`. The new "Admins can insert new profiles" policy allows admins to insert any profile.

---

## Alternative Testing Method: Using Application UI

Once the frontend is built (Tasks 4-6), you can test policies through the application:

1. **Login as Admin** (konda@gmail.com)
   - Navigate to User Management page
   - Try creating a new user → Should succeed
   - Try viewing all users → Should succeed
   - Try updating a user's role → Should succeed

2. **Login as Leader**
   - Try accessing User Management page → Should be redirected
   - User Management menu item should not be visible

---

## Verification Checklist

After running the policy creation script and tests:

- [ ] Three new policies created on profiles table:
  - [ ] "Admins can view all profiles" (SELECT)
  - [ ] "Admins can update user roles" (UPDATE)
  - [ ] "Admins can insert new profiles" (INSERT)

- [ ] Policy tests completed:
  - [ ] Admin can SELECT all profiles ✓
  - [ ] Admin can UPDATE any profile ✓
  - [ ] Admin can INSERT new profiles ✓
  - [ ] Leader CANNOT update other profiles ✓
  - [ ] Leader CANNOT insert arbitrary profiles ✓

- [ ] Policies are idempotent (can run script multiple times without errors) ✓

---

## Understanding RLS Policy Behavior

### How Multiple Policies Work

Supabase/PostgreSQL RLS policies for the same operation (SELECT, INSERT, UPDATE, DELETE) are combined with **OR** logic:

- If ANY policy allows the operation, it succeeds
- This means having both "Users can view all profiles" AND "Admins can view all profiles" is fine
- They work together: regular users can view profiles, and admins also can

### Policy Syntax

**FOR SELECT and UPDATE (USING clause):**
```sql
USING ( condition )
```
- Determines which rows can be selected or updated
- Evaluated against existing rows in the table

**FOR INSERT and UPDATE (WITH CHECK clause):**
```sql
WITH CHECK ( condition )
```
- Determines if new values are allowed to be inserted or updated
- Evaluated against new/updated values

---

## Troubleshooting

### Issue: "Policy already exists" error (not a NOTICE)

**Solution:** The script uses idempotency checks, but if you get an actual error:
```sql
-- Drop the existing policy first
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update user roles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert new profiles" ON profiles;

-- Then run the creation script again
```

### Issue: Tests fail even for admin user

**Solution:** 
1. Verify the admin user role is set correctly:
   ```sql
   SELECT id, email, role FROM profiles 
   WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
   ```
   Should show role = 'admin'

2. Ensure Task 1.1 (Update admin user profile) was completed successfully

### Issue: Cannot test with SET request.jwt.claim.sub

**Solution:** The `SET request.jwt.claim.sub` approach may not work in all Supabase versions. Instead:
1. Use the Supabase client library with actual authentication
2. Test through the application UI once it's built
3. Use Supabase's "Auth" context in SQL Editor (if available in your version)

### Issue: Policies are too restrictive

**Solution:** 
- Remember that multiple policies are OR'd together
- The existing "Users can view all profiles" still allows leaders to view profiles
- The new "Admins can..." policies provide additional access for admins
- If you need to make policies more restrictive, you may need to drop existing policies

---

## Security Notes

⚠️ **IMPORTANT:**

- **RLS policies are the security layer** that protects your database
- Always test policies thoroughly before deploying to production
- Policies are evaluated at the database level, so they apply to:
  - Direct database queries
  - Supabase client library calls
  - API requests
  - Any other database access method

- **Defense in Depth:** 
  - These database policies are the PRIMARY security layer
  - Frontend UI checks (hiding buttons, etc.) are SECONDARY
  - Never rely solely on frontend checks for security

---

## Next Steps

Once this task is complete:
✅ Admin users can be restricted to specific operations at the database level
✅ RLS policies enforce role-based access control
✅ You can proceed to Task 2.1: Create Supabase Edge Function for admin user creation

---

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Understanding RLS Policies](https://supabase.com/docs/guides/database/postgres/row-level-security)

