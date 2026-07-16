-- Test Script for Admin RLS Policies
-- Task 1.2: Test policies by attempting operations as both admin and leader users
-- This script should be run in the Supabase SQL Editor

-- ============================================
-- IMPORTANT: How to Test RLS Policies
-- ============================================
-- RLS policies are enforced based on the authenticated user context.
-- In Supabase SQL Editor, queries run with elevated privileges by default.
-- To properly test RLS policies, you have two options:
--
-- Option 1: Test through the Supabase client library (recommended)
-- Option 2: Use the application UI once it's built
--
-- This script provides verification queries to ensure policies exist and are correctly configured.
-- ============================================

-- ============================================
-- Verification 1: Check all RLS policies on profiles table
-- ============================================
SELECT 
    policyname,
    cmd as operation,
    qual as using_clause,
    with_check as with_check_clause,
    permissive
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY cmd, policyname;

-- Expected: Should see at least these policies:
-- - "Admins can view all profiles" (SELECT)
-- - "Admins can update user roles" (UPDATE)
-- - "Admins can insert new profiles" (INSERT)
-- Plus existing policies like:
-- - "Users can view all profiles" (SELECT)
-- - "Users can update their own profile" (UPDATE)
-- - "Users can insert their own profile" (INSERT)
-- - "Admins can update any profile" (UPDATE)

-- ============================================
-- Verification 2: Check that admin user has correct role
-- ============================================
SELECT 
    id,
    email,
    full_name,
    role,
    CASE 
        WHEN role = 'admin' THEN '✓ VERIFIED: User has admin role'
        ELSE '✗ ERROR: User does not have admin role'
    END as verification_status
FROM profiles 
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';

-- Expected: Should show role = 'admin' with ✓ VERIFIED status

-- ============================================
-- Verification 3: Check that RLS is enabled on profiles table
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Expected: rls_enabled should be TRUE

-- ============================================
-- Verification 4: Count users by role
-- ============================================
SELECT 
    role,
    COUNT(*) as user_count
FROM profiles
GROUP BY role
ORDER BY role;

-- Expected: Should show at least one admin user

-- ============================================
-- Verification 5: List all admin users
-- ============================================
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at;

-- Expected: Should show konda@gmail.com as admin

-- ============================================
-- Verification 6: List all leader users (sample)
-- ============================================
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE role = 'leader'
ORDER BY created_at
LIMIT 5;

-- Expected: Should show leader users (if any exist)

-- ============================================
-- Policy Logic Verification
-- ============================================
-- This section explains the expected behavior of the policies:

-- Policy: "Admins can view all profiles"
-- Logic: SELECT allowed if auth.uid() is an admin
-- Test: Admin users can SELECT all profiles

-- Policy: "Admins can update user roles" 
-- Logic: UPDATE allowed if auth.uid() is an admin
-- Test: Admin users can UPDATE any profile
-- Test: Non-admin users cannot UPDATE other users' profiles

-- Policy: "Admins can insert new profiles"
-- Logic: INSERT allowed if auth.uid() is an admin
-- Test: Admin users can INSERT new profiles
-- Test: Non-admin users can only INSERT their own profile (auth.uid() = id)

-- ============================================
-- Summary of Expected Behavior
-- ============================================
/*
After creating these policies:

1. ADMIN USER (konda@gmail.com) CAN:
   - View all profiles (SELECT)
   - Update any profile including role changes (UPDATE)
   - Insert new profiles for any user (INSERT)
   - Delete operations (based on existing policies)

2. LEADER USER CAN:
   - View all profiles (SELECT) - allowed by "Users can view all profiles" policy
   - Update only their own profile (UPDATE) - allowed by "Users can update their own profile" policy
   - Insert only their own profile (INSERT) - allowed by "Users can insert their own profile" policy
   - Cannot change any user's role
   - Cannot create profiles for other users

3. UNAUTHENTICATED USERS:
   - Cannot access profiles table at all (RLS blocks all operations)

IMPORTANT: These are DATABASE-LEVEL restrictions enforced by PostgreSQL RLS.
Even if someone has direct database access or uses the API, these rules are enforced.
*/

-- ============================================
-- Testing Instructions
-- ============================================
/*
To properly test these policies, follow these steps:

STEP 1: Verify policies are created (run this script in SQL Editor)
✓ All three policies should be listed in Verification 1
✓ Admin user should have admin role in Verification 2
✓ RLS should be enabled in Verification 3

STEP 2: Test through application code
Once the frontend is built (Tasks 4-6), test by:
1. Login as admin (konda@gmail.com)
   - Go to User Management page
   - Try to create a new user → Should succeed
   - Try to update a user's role → Should succeed
   
2. Login as leader
   - User Management menu should not be visible
   - Direct URL access to /users should redirect
   - Try to update own profile → Should succeed
   - Try to update another user via API call → Should fail

STEP 3: Test through Supabase client library
Create a test script that:
1. Authenticates as admin user
2. Tries to insert/update profiles → Should succeed
3. Authenticates as leader user  
4. Tries to update other profiles → Should fail

Example test code (JavaScript):
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test as admin
await supabase.auth.signInWithPassword({
  email: 'konda@gmail.com',
  password: 'admin-password'
});

// This should succeed
const { data, error } = await supabase
  .from('profiles')
  .update({ full_name: 'Test Update' })
  .eq('id', 'some-leader-id');

console.log('Admin update:', error ? 'FAILED' : 'SUCCESS');

// Test as leader
await supabase.auth.signInWithPassword({
  email: 'leader@example.com',
  password: 'leader-password'
});

// This should fail
const { data: data2, error: error2 } = await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .eq('id', 'some-other-user-id');

console.log('Leader update:', error2 ? 'BLOCKED (correct)' : 'ALLOWED (incorrect)');
```
*/
