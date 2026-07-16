-- Update Admin User Profile Script
-- This script updates the profile record for the designated admin user
-- Run this script in the Supabase SQL Editor

-- Target user ID
-- Email: konda@gmail.com
-- User ID: 6787d2e2-862c-4160-a96a-878c84e89d25

-- Step 1: Check current profile status
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  created_at, 
  updated_at
FROM profiles
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';

-- Step 2: Update role to 'admin' (with idempotency check)
UPDATE profiles
SET 
  role = 'admin',
  updated_at = NOW()
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25'
  AND role != 'admin'; -- Only update if not already admin

-- Step 3: Verify the update
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  created_at, 
  updated_at,
  CASE 
    WHEN role = 'admin' THEN '✓ Admin role assigned successfully'
    ELSE '✗ Update failed or user not found'
  END as status
FROM profiles
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
