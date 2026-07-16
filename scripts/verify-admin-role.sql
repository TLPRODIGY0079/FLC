-- Verify Admin Role Assignment
-- This script checks if the admin user has been properly configured

-- Query the profile to verify admin role
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  branch_id,
  created_at, 
  updated_at,
  CASE 
    WHEN role = 'admin' THEN '✓ VERIFIED: User has admin role'
    WHEN role = 'leader' THEN '✗ FAILED: User still has leader role'
    ELSE '✗ FAILED: User has unknown role: ' || role
  END as verification_status
FROM profiles
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';

-- Additional check: Verify user exists
SELECT 
  CASE 
    WHEN COUNT(*) = 1 THEN '✓ User profile exists'
    WHEN COUNT(*) = 0 THEN '✗ User profile not found'
    ELSE '✗ Multiple profiles found (data integrity issue)'
  END as existence_check,
  COUNT(*) as profile_count
FROM profiles
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
