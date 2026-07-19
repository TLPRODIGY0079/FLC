-- Add admin user (konda@gmail.com) with admin role
-- Run this in Supabase SQL Editor AFTER creating the user via Supabase Dashboard

-- This script updates the profile to have admin role for the specific user ID
-- User ID: 6787d2e2-862c-4160-a96a-878c84e89d25
-- Email: konda@gmail.com

-- First, ensure the profile exists with admin role
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  branch_id,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '6787d2e2-862c-4160-a96a-878c84e89d25',
  'konda@gmail.com',
  'Admin',
  'admin',
  NULL,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin',
  updated_at = NOW();

-- Verify the admin user was created
SELECT id, email, full_name, role, created_at 
FROM public.profiles 
WHERE id = '6787d2e2-862c-4160-a96a-878c84e89d25';
