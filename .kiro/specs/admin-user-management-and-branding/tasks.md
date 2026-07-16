# Implementation Plan: Admin User Management and Branding

## Overview

This implementation plan transforms the church management application from a self-registration system to an admin-controlled user provisioning system with role-based access control. The plan includes database updates, backend service creation (Supabase Edge Function), frontend component development, and church branding integration. Implementation follows a sequential approach building from database layer through backend services to frontend UI, with testing integrated throughout.

## Tasks

- [ ] 1. Database and RLS policy setup
  - [x] 1.1 Update admin user profile record with admin role
    - Update the profile record for user ID `6787d2e2-862c-4160-a96a-878c84e89d25` to set role as 'admin'
    - Verify the update by querying the profiles table
    - Create idempotency check to prevent duplicate role assignments
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  
  - [-] 1.2 Create RLS policies for admin-only access
    - Create policy "Admins can view all profiles" to allow admins to SELECT all profile records
    - Create policy "Admins can update user roles" to restrict UPDATE on profiles table to admin users only
    - Create policy "Admins can insert new profiles" for profile creation during user provisioning
    - Test policies by attempting operations as both admin and leader users
    - _Requirements: 7.1, 7.2, 7.4, 7.6, 7.7_

- [ ] 2. Backend admin user creation service
  - [ ] 2.1 Create Supabase Edge Function for admin user creation
    - Create new Edge Function at `supabase/functions/create-user/index.ts`
    - Implement request body validation for email, password, full_name, role, and optional branch_id
    - Implement admin role verification by querying profiles table for auth.uid()
    - Use Supabase Admin API to create auth user with `createUser()` method
    - Create corresponding profile record in profiles table with user metadata
    - Implement transaction-style error handling with rollback on profile creation failure
    - Return success response with user ID and profile data
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7, 8.1_
  
  - [ ] 2.2 Implement email validation and duplicate detection
    - Add email format validation using regex pattern check
    - Query profiles table to check for existing user with same email
    - Return HTTP 400 with error message "A user with this email already exists" if duplicate found
    - _Requirements: 2.5, 6.5, 6.8_
  
  - [ ] 2.3 Add error handling and logging
    - Implement try-catch blocks for auth user creation and profile insertion
    - Log security events for unauthorized access attempts with timestamp, user ID, and endpoint
    - Return user-friendly error messages with appropriate HTTP status codes
    - Implement rollback logic to delete auth user if profile creation fails
    - _Requirements: 7.6, 8.3_

- [ ] 3. Checkpoint - Verify database and backend services
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Frontend AuthContext enhancements
  - [ ] 4.1 Add admin user management functions to AuthContext
    - Add `createUser` function that calls the Edge Function with user data
    - Add `listAllUsers` function to query all profiles (admin-only)
    - Add `updateUserRole` function for role updates (admin-only)
    - Add error state management for user management operations
    - Update AuthContext interface to include new functions
    - _Requirements: 2.1, 2.2, 6.2, 6.4, 6.6, 6.7_
  
  - [ ] 4.2 Implement role-based permission hooks
    - Create `useRoleAccess` custom hook with permission checks
    - Add permission flags: `canManageUsers`, `canViewAllReports`, `canEditBranches`
    - Export hook for use in components
    - _Requirements: 7.1, 7.3_

- [ ] 5. User management UI components
  - [ ] 5.1 Create UserManagement page component
    - Create new file `src/pages/UserManagement.jsx`
    - Implement user list table with columns: email, full name, role, created date
    - Add search/filter functionality by email, name, or role
    - Add "Create User" button that opens modal
    - Implement loading states and error handling
    - Add role badges with distinct styling for admin/leader roles
    - _Requirements: 6.1, 6.2, 6.7_
  
  - [ ] 5.2 Create CreateUserModal component
    - Create modal component with form fields: email, full name, role dropdown, optional branch dropdown
    - Implement client-side validation for email format (5-320 chars), full name (2-100 chars)
    - Add password generation with 12+ characters including uppercase, lowercase, numeric, special characters
    - Display success notification "Leader [full name] has been created and invitation sent" on success
    - Display error messages for validation failures and duplicate emails
    - Call AuthContext.createUser on form submission
    - Close modal and refresh user list on successful creation
    - _Requirements: 2.1, 6.3, 6.4, 6.5, 6.6, 6.8, 8.1, 8.6_
  
  - [ ] 5.3 Add route protection for user management page
    - Create `ProtectedRoute` component that checks user role before rendering children
    - Wrap UserManagement page with ProtectedRoute requiring admin role
    - Redirect non-admin users to dashboard with message "Access denied: Admin privileges required"
    - Add redirect to dashboard if non-admin attempts direct URL access
    - _Requirements: 2.3, 2.4, 6.10, 7.3, 7.4, 7.5_

- [ ] 6. Navigation and routing updates
  - [ ] 6.1 Add "Users" navigation item to Sidebar
    - Add conditional "Users" menu item in Sidebar.jsx that only renders for admin users
    - Use Lucide React Users icon for menu item
    - Add route path "/users" pointing to UserManagement component
    - _Requirements: 6.1, 7.1, 7.3_
  
  - [ ] 6.2 Update App.jsx routing configuration
    - Add route for "/users" with UserManagement component wrapped in ProtectedRoute
    - Ensure route is positioned correctly in route hierarchy
    - _Requirements: 6.10_

- [ ] 7. Checkpoint - Verify user management functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Login page updates - remove self-registration
  - [ ] 8.1 Remove sign-up UI from Login component
    - Remove "Create Account" button from Login.jsx
    - Remove any sign-up related state variables and handler functions
    - Remove sign-up form elements if present
    - _Requirements: 3.1, 3.2_
  
  - [ ] 8.2 Add admin contact message to login page
    - Add message "Don't have an account? Contact your administrator for access"
    - Style message consistently with existing login page design
    - _Requirements: 3.2, 3.5_
  
  - [ ] 8.3 Disable self-registration API endpoint
    - Update backend to reject direct signUp API calls with HTTP 403
    - Return error message "Self-registration is disabled. Contact your administrator for access"
    - Maintain sign-in functionality for existing users
    - _Requirements: 3.3, 3.4, 3.5_

- [ ] 9. Church branding integration
  - [ ] 9.1 Update favicon and HTML metadata
    - Copy `flc pic.webp` from src/assets to public directory
    - Update index.html to reference `flc pic.webp` as favicon
    - Add favicon with multiple sizes (16x16, 32x32, 64x64) for browser compatibility
    - Add fallback favicon with text "FLC" if image fails to load
    - _Requirements: 4.1, 4.2, 4.5, 4.6_
  
  - [ ] 9.2 Add church logo to Header component
    - Import `flc pic.webp` from src/assets in Header.jsx
    - Replace generic avatar with church logo image element
    - Add CSS classes for sizing (w-10 h-10) and styling (rounded-full, object-cover)
    - Implement error handler that displays fallback with text "FLC" if image fails to load
    - Update greeting text to include "Faith Life Church Ministry"
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [ ] 9.3 Add church logo to Sidebar component
    - Import `flc pic 2.webp` from src/assets in Sidebar.jsx
    - Add church logo to sidebar header with title "Faith Life Church" and subtitle "Ministry Management"
    - Size logo appropriately (w-12 h-12) with rounded styling
    - Implement error handler with fallback for missing image
    - _Requirements: 4.1, 4.3, 4.4, 4.5_
  
  - [ ] 9.4 Update Login page with church branding
    - Import both `flc pic.webp` (logo) and `flc pic 2.webp` (background) from src/assets
    - Add church logo above login form with size w-24 h-24
    - Add church name "Faith Life Church" as heading
    - Add subtitle "Ministry Management System"
    - Set `flc pic 2.webp` as background image with CSS background-size: cover
    - Add semi-transparent overlay (rgba(0, 0, 0, 0.4)) over background for form readability
    - Implement fallback background color #1a1a2e if image fails to load
    - Ensure form elements have minimum 4.5:1 contrast ratio against background
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ] 9.5 Verify branding asset loading and build output
    - Verify both `flc pic.webp` and `flc pic 2.webp` exist in src/assets directory
    - Run build command and verify images are included in dist/assets output
    - Test fallback behavior by temporarily removing images
    - Verify images are under 500 KB in WebP format
    - Add preload link tag for `flc pic.webp` in index.html for priority loading
    - _Requirements: 4.6, 5.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 10. Final checkpoint and integration testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- This implementation transforms the app from self-registration to admin-controlled user provisioning
- The designated admin user (konda@gmail.com, UID: 6787d2e2-862c-4160-a96a-878c84e89d25) must be updated first
- Supabase Edge Functions are used instead of RPC functions for better security with service role key
- All admin operations require both client-side UI checks and server-side RLS policy enforcement
- Church branding assets (flc pic.webp and flc pic 2.webp) must exist in src/assets directory before implementation
- Testing focuses on integration and E2E tests rather than property-based tests due to the infrastructure nature of the feature
- Checkpoints allow for incremental validation and user feedback
- All tasks reference specific requirements for traceability

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["4.1", "4.2"] },
    { "id": 4, "tasks": ["5.1", "6.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "6.2", "8.1"] },
    { "id": 6, "tasks": ["8.2", "8.3", "9.1"] },
    { "id": 7, "tasks": ["9.2", "9.3", "9.4"] },
    { "id": 8, "tasks": ["9.5"] }
  ]
}
```
