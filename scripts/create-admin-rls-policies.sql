-- RLS Policies for Admin-Only Access
-- Task 1.2: Create RLS policies for admin-only access
-- Requirements: 7.1, 7.2, 7.4, 7.6, 7.7
-- This script creates policies to ensure admins have full access to profile management

-- Note: Check if policies already exist before creating them to ensure idempotency

-- Policy 1: Admins can view all profiles
-- This policy allows admin users to SELECT all profile records
-- This works alongside the existing "Users can view all profiles" policy
-- Multiple SELECT policies are OR'd together
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Admins can view all profiles'
    ) THEN
        CREATE POLICY "Admins can view all profiles" 
          ON profiles 
          FOR SELECT 
          USING (
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE id = auth.uid() AND role = 'admin'
            )
          );
        RAISE NOTICE 'Created policy: Admins can view all profiles';
    ELSE
        RAISE NOTICE 'Policy already exists: Admins can view all profiles';
    END IF;
END $$;

-- Policy 2: Admins can update user roles
-- This policy restricts UPDATE on profiles table to admin users only
-- Note: This is more specific than the existing "Admins can update any profile" policy
-- and provides explicit admin-only update capability
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Admins can update user roles'
    ) THEN
        CREATE POLICY "Admins can update user roles" 
          ON profiles 
          FOR UPDATE 
          USING (
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE id = auth.uid() AND role = 'admin'
            )
          );
        RAISE NOTICE 'Created policy: Admins can update user roles';
    ELSE
        RAISE NOTICE 'Policy already exists: Admins can update user roles';
    END IF;
END $$;

-- Policy 3: Admins can insert new profiles
-- This policy allows admins to insert new profile records during user provisioning
-- This is critical for admin-controlled user creation workflow
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Admins can insert new profiles'
    ) THEN
        CREATE POLICY "Admins can insert new profiles" 
          ON profiles 
          FOR INSERT 
          WITH CHECK (
            EXISTS (
              SELECT 1 FROM profiles 
              WHERE id = auth.uid() AND role = 'admin'
            )
          );
        RAISE NOTICE 'Created policy: Admins can insert new profiles';
    ELSE
        RAISE NOTICE 'Policy already exists: Admins can insert new profiles';
    END IF;
END $$;

-- Verification: List all policies on profiles table
SELECT 
    policyname,
    cmd as operation,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING clause present'
        ELSE 'No USING clause'
    END as using_check,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK clause present'
        ELSE 'No WITH CHECK clause'
    END as with_check_status
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;
