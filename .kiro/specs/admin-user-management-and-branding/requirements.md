# Requirements Document

## Introduction

This document defines the requirements for enhancing the church management application with secure admin user management capabilities and updated branding. The feature establishes a specific admin user, implements a secure role-based access control system where admins can add leaders without self-registration, and updates the application branding with custom church imagery.

## Glossary

- **Admin_User**: A user with administrative privileges who can manage leaders and access all system features
- **Leader_User**: A standard user who manages members, reports, and follow-ups but cannot create other users
- **User_Management_System**: The subsystem responsible for user registration, role assignment, and authentication
- **Auth_System**: Supabase authentication system that handles user credentials and sessions
- **Profile_Table**: Database table storing user profile information including role assignments
- **Branding_Assets**: Visual elements including the application icon and background image
- **Application_Icon**: The icon image displayed in browser tabs, bookmarks, and application headers
- **Background_Image**: The decorative image displayed on the login page
- **Registration_Workflow**: The process by which new leader users are added to the system

## Requirements

### Requirement 1: Specific Admin User Provisioning

**User Story:** As a system administrator, I want a specific user account designated as the primary admin, so that I have guaranteed administrative access to the system.

#### Acceptance Criteria

1. WHEN the system is initialized, IF a profile record with UID "6787d2e2-862c-4160-a96a-878c84e89d25" does not exist, THEN THE User_Management_System SHALL create a profile record with email "konda@gmail.com" and UID "6787d2e2-862c-4160-a96a-878c84e89d25"
2. WHEN the system is initialized, IF a profile record with UID "6787d2e2-862c-4160-a96a-878c84e89d25" already exists, THEN THE User_Management_System SHALL not create a duplicate profile and SHALL log the idempotency event
3. THE User_Management_System SHALL assign the role "admin" to the profile with UID "6787d2e2-862c-4160-a96a-878c84e89d25"
4. WHEN the admin user with UID "6787d2e2-862c-4160-a96a-878c84e89d25" authenticates, THE Auth_System SHALL grant permissions to create, read, update, and delete all user profiles, branches, members, reports, and follow-ups
5. THE User_Management_System SHALL persist the admin role assignment for UID "6787d2e2-862c-4160-a96a-878c84e89d25" across all database operations
6. IF authentication fails for the admin user with UID "6787d2e2-862c-4160-a96a-878c84e89d25", THEN THE Auth_System SHALL log the failure event and deny access without granting any permissions

### Requirement 2: Admin-Controlled Leader Registration

**User Story:** As an admin, I want to be the only one who can add new leaders to the system, so that I can maintain security and control over who has access.

#### Acceptance Criteria

1. WHEN an admin user accesses the user management interface, THE User_Management_System SHALL display a form with input fields for email (maximum 320 characters) and full name (maximum 100 characters)
2. WHEN an admin submits a new leader with email and full name, THE User_Management_System SHALL create a user account with role "leader"
3. THE User_Management_System SHALL prevent leader users from accessing the add user functionality
4. WHEN a non-admin user attempts to access the add user functionality, THE User_Management_System SHALL deny access and display the message "Access denied: Admin privileges required"
5. WHEN an admin submits a new leader with an email that already exists in the system, THE User_Management_System SHALL display the error message "A user with this email already exists" and SHALL NOT create a duplicate account
6. WHEN the User_Management_System successfully creates a leader account, THE User_Management_System SHALL send an email invitation containing a password setup link that expires in 48 hours
7. IF the email delivery fails after 3 retry attempts, THEN THE User_Management_System SHALL display the message "User created but email delivery failed. Please resend invitation manually" and SHALL mark the account as pending activation

### Requirement 3: Self-Registration Removal

**User Story:** As an admin, I want to disable public self-registration, so that only I can approve and add leaders to the system.

#### Acceptance Criteria

1. THE User_Management_System SHALL remove the "Create Account" button from the login page
2. WHEN a user navigates to the login page, THE User_Management_System SHALL display only the sign-in form without registration UI elements including buttons, links, and instructional text for account creation
3. IF a direct API call is made to the sign-up endpoint, THEN THE User_Management_System SHALL reject the request with HTTP status code 403 and error message "Self-registration is disabled. Contact your administrator for access"
4. THE User_Management_System SHALL maintain the sign-in functionality for existing users with valid credentials
5. THE User_Management_System SHALL provide a mechanism for admins to manually create user accounts through the admin interface

### Requirement 4: Application Icon Branding

**User Story:** As a system administrator, I want the application to display our church's icon, so that users can easily identify and recognize our application.

#### Acceptance Criteria

1. THE Branding_Assets SHALL reference the file "flc pic.webp" from the src/assets directory as the Application_Icon
2. WHEN a browser loads the application, THE Branding_Assets SHALL display "flc pic.webp" in the browser tab as a favicon with dimensions between 16x16 and 512x512 pixels
3. THE Branding_Assets SHALL display "flc pic.webp" in the application header navigation bar adjacent to the application title with dimensions between 32x32 and 256x256 pixels
4. WHEN the Application_Icon is displayed in different contexts, THE Branding_Assets SHALL scale the icon proportionally without cropping to fit the target dimensions
5. IF "flc pic.webp" fails to load, THEN THE Branding_Assets SHALL display a fallback icon placeholder with the text "FLC"
6. THE Branding_Assets SHALL verify "flc pic.webp" exists in the src/assets directory during build time and SHALL log an error if the file is missing

### Requirement 5: Login Background Branding

**User Story:** As a system administrator, I want the login page to display our church's background image, so that users see our branding when they authenticate.

#### Acceptance Criteria

1. THE Login_Page SHALL display "flc pic 2.webp" from the src/assets directory as the background image
2. WHEN a user navigates to the login page on a device with viewport width between 320px and 3840px, THE Login_Page SHALL scale "flc pic 2.webp" using CSS background-size cover with aspect ratio maintained
3. IF "flc pic 2.webp" fails to load, THEN THE Login_Page SHALL display a solid fallback background color #1a1a2e with a centered loading indicator
4. THE Login_Page SHALL ensure the login form elements have a minimum contrast ratio of 4.5:1 against the Background_Image
5. WHEN the application builds, THE Login_Page SHALL verify "flc pic 2.webp" exists in the src/assets directory and SHALL log an error if missing
6. THE Login_Page SHALL apply a semi-transparent overlay (rgba 0 0 0 0.4) over "flc pic 2.webp" to improve readability of the login form

### Requirement 6: User Management Interface

**User Story:** As an admin, I want a dedicated user management interface within the application, so that I can add and manage leaders without using Supabase directly.

#### Acceptance Criteria

1. WHERE the user has role "admin", THE User_Management_System SHALL display a user management navigation option labeled "Manage Users"
2. WHEN an admin accesses the user management page, THE User_Management_System SHALL display a list of all existing users with columns for email, full name, role, and account status
3. WHEN an admin accesses the user management page, THE User_Management_System SHALL display a form with fields for email (maximum 320 characters), full name (maximum 100 characters), and optional branch assignment (dropdown with existing branches)
4. WHEN an admin submits the add leader form with an email between 5-320 characters, a full name between 2-100 characters, and a valid optional branch ID, THE User_Management_System SHALL create a new leader account within 5 seconds
5. WHEN an admin submits the add leader form with an email that does not match the pattern [local-part]@[domain], THE User_Management_System SHALL display the error message "Invalid email format"
6. WHEN the User_Management_System successfully creates a new leader, THE User_Management_System SHALL display a success notification "Leader [full name] has been created and invitation sent" for 5 seconds
7. WHEN the User_Management_System successfully creates a new leader, THE User_Management_System SHALL update the user list to include the new leader within 2 seconds
8. IF an admin submits the add leader form with an email that already exists in the system, THEN THE User_Management_System SHALL display the error message "A user with this email already exists" and SHALL NOT create a duplicate account
9. WHEN a new leader is created, THE User_Management_System SHALL send an activation email and set the account status to "Pending" until the leader completes the password setup
10. IF a non-admin user attempts to access the user management route directly by URL, THEN THE User_Management_System SHALL redirect to the dashboard page within 1 second

### Requirement 7: Role-Based Access Control Enforcement

**User Story:** As a system administrator, I want role-based access controls enforced throughout the application, so that leaders cannot perform administrative functions.

#### Acceptance Criteria

1. WHEN the User_Management_System renders interface elements, THE User_Management_System SHALL verify the user's role is "admin" before displaying admin-only navigation options, buttons, and forms
2. WHEN the User_Management_System receives an API request for an admin-only operation, THE User_Management_System SHALL verify the requesting user's role is "admin" on the server side before processing the request
3. WHERE a user is authenticated with role "leader", THE User_Management_System SHALL hide all navigation options for user management, system settings, and branch administration
4. IF a leader user attempts to access an admin-only route directly, THEN THE User_Management_System SHALL respond with HTTP status code 403 and error message "Access denied: Admin privileges required"
5. WHEN a leader user attempts to access an admin-only route directly, THE User_Management_System SHALL redirect to the dashboard page within 1 second
6. WHEN a user without role "admin" attempts to access an admin-only endpoint, THE User_Management_System SHALL log an entry containing timestamp, user ID, attempted endpoint, and HTTP response code
7. THE User_Management_System SHALL enforce role verification on both the client-side (for UI rendering) and server-side (for API requests) to prevent unauthorized access

### Requirement 8: Leader Account Credentials Management

**User Story:** As an admin, I want to set initial credentials for new leader accounts, so that leaders can access the system with secure credentials.

#### Acceptance Criteria

1. WHEN an admin creates a new leader account, THE User_Management_System SHALL generate a temporary secure password with at least 12 characters including uppercase, lowercase, numeric, and special characters
2. WHEN the User_Management_System generates a temporary password, THE User_Management_System SHALL send the password to the new leader via email within 30 seconds
3. IF the email delivery fails after 3 retry attempts over 60 seconds, THEN THE User_Management_System SHALL display an alert to the admin with the message "Email delivery failed. Please provide the temporary password manually: [password]"
4. THE User_Management_System SHALL set the temporary password to expire 72 hours after generation
5. WHEN a leader logs in with a temporary password, THE User_Management_System SHALL prompt for a new password before granting access to the application
6. WHEN a leader submits a new password, THE User_Management_System SHALL enforce password complexity requirements: minimum 12 characters, at least one uppercase letter, one lowercase letter, one numeric digit, and one special character
7. IF a leader attempts to set a new password that matches any of their previous 5 passwords, THEN THE User_Management_System SHALL reject the password and display the message "Password has been used recently. Please choose a different password"
8. IF a temporary password expires before the leader logs in, THEN THE User_Management_System SHALL reject the login attempt and display the message "Temporary password has expired. Please contact your administrator for a new invitation"

### Requirement 9: Database Role Persistence

**User Story:** As a developer, I want user roles to be consistently stored and retrieved from the database, so that role-based permissions remain accurate across sessions.

#### Acceptance Criteria

1. WHEN a new user account is created with signup metadata including a role field, THE User_Management_System SHALL insert a record in the Profile_Table with the role value from the metadata
2. WHEN a new user account is created without a role field in the signup metadata, THE User_Management_System SHALL insert a record in the Profile_Table with the default role "leader"
3. WHEN a user authenticates, THE Auth_System SHALL retrieve the user's role from the Profile_Table within 2 seconds
4. IF a user authenticates and no profile record exists in the Profile_Table, THEN THE Auth_System SHALL deny access and display the message "Profile not found. Contact your administrator"
5. IF the Profile_Table query fails due to a database error during authentication, THEN THE Auth_System SHALL deny access and log the error with timestamp, user ID, and error details
6. WHEN the User_Management_System validates a role value from the Profile_Table, THE User_Management_System SHALL verify the role matches one of the allowed values: "admin" or "leader"
7. IF a role value in the Profile_Table does not match "admin" or "leader", THEN THE User_Management_System SHALL reject the authentication attempt and log the invalid role value
8. THE Profile_Table SHALL enforce referential integrity with the auth.users table using the user ID as a foreign key
9. WHEN a user's role is updated in the Profile_Table, THE User_Management_System SHALL reflect the change in subsequent authentication requests within 1 second

### Requirement 10: Branding Asset Management

**User Story:** As a developer, I want branding assets to be properly referenced and loaded, so that the application displays the correct church imagery.

#### Acceptance Criteria

1. THE Branding_Assets SHALL import flc pic.webp and flc pic 2.webp from the src/assets directory
2. WHEN the application builds, THE Branding_Assets SHALL include both image files in the build output
3. THE Branding_Assets SHALL use WebP format with individual file sizes not exceeding 500 KB
4. IF an image fails to load, THEN THE Branding_Assets SHALL display a solid background color with alt text indicating the church name
5. THE Branding_Assets SHALL preload flc pic.webp using link rel preload to prioritize loading before interactive content
6. WHEN the application builds, THE Branding_Assets SHALL verify both image files are present in the dist/assets directory
