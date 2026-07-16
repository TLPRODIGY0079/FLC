# Create User Edge Function

## Overview

This Supabase Edge Function allows admin users to create new user accounts with associated profiles. It implements secure role-based access control and transaction-style error handling.

## Features

- **Admin Role Verification**: Only users with `role = 'admin'` can create new users
- **Request Body Validation**: Validates email format, password strength, role values, and required fields
- **Duplicate Prevention**: Checks if email already exists before creating user
- **Transaction-Style Rollback**: If profile creation fails, the auth user is automatically deleted
- **CORS Support**: Handles preflight requests for browser-based clients

## Request Format

### Endpoint
```
POST https://[your-project-ref].supabase.co/functions/v1/create-user
```

### Headers
```
Authorization: Bearer [user-jwt-token]
Content-Type: application/json
```

### Request Body
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "leader",
  "branch_id": "uuid-optional"
}
```

### Required Fields
- `email` (string): Valid email address
- `password` (string): Minimum 6 characters
- `full_name` (string): User's display name
- `role` (string): Either "admin" or "leader"

### Optional Fields
- `branch_id` (string): UUID of branch to assign user to

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": "uuid",
    "email": "newuser@example.com",
    "full_name": "John Doe",
    "role": "leader",
    "branch_id": null,
    "profile": {
      "id": "uuid",
      "email": "newuser@example.com",
      "full_name": "John Doe",
      "role": "leader",
      "branch_id": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Unauthorized: Invalid or missing authentication token"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden: Admin privileges required"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid email format"
}
```

#### 409 Conflict
```json
{
  "error": "A user with this email already exists"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Failed to create user profile: [error details]. User creation has been rolled back."
}
```

## Deployment

### Prerequisites
1. Install Supabase CLI: `npm install -g supabase`
2. Link to your project: `supabase link --project-ref [your-project-ref]`

### Deploy Command
```bash
supabase functions deploy create-user
```

### Environment Variables
The function requires these environment variables (automatically provided by Supabase):
- `SUPABASE_URL`: Your project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations
- `SUPABASE_ANON_KEY`: Anon key for client authentication

## Usage Example

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// User must be authenticated as admin
const { data: { session } } = await supabase.auth.getSession()

const response = await fetch(
  `${SUPABASE_URL}/functions/v1/create-user`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'newleader@church.com',
      password: 'SecurePass123!',
      full_name: 'Jane Leader',
      role: 'leader',
      branch_id: null,
    }),
  }
)

const result = await response.json()

if (result.success) {
  console.log('User created:', result.data)
} else {
  console.error('Error:', result.error)
}
```

### Using Supabase Functions Invoke
```typescript
const { data, error } = await supabase.functions.invoke('create-user', {
  body: {
    email: 'newleader@church.com',
    password: 'SecurePass123!',
    full_name: 'Jane Leader',
    role: 'leader',
  },
})

if (error) {
  console.error('Error:', error)
} else {
  console.log('User created:', data)
}
```

## Security Considerations

1. **Admin-Only Access**: The function verifies the requesting user has `role = 'admin'` before processing
2. **Service Role Key**: Uses service role key for admin operations (never exposed to client)
3. **Email Verification**: New users are created with `email_confirm: true` to skip verification
4. **Transaction Safety**: If profile creation fails, the auth user is automatically deleted
5. **CORS**: Configured to allow requests from any origin (adjust in production)

## Testing

### Test with cURL
```bash
curl -X POST https://[your-project-ref].supabase.co/functions/v1/create-user \
  -H "Authorization: Bearer [admin-user-jwt]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User",
    "role": "leader"
  }'
```

## Validation Rules

- **Email**: Must match pattern `[local-part]@[domain]`
- **Password**: Minimum 6 characters
- **Full Name**: Required, no minimum length
- **Role**: Must be exactly "admin" or "leader"
- **Branch ID**: Optional, must be valid UUID if provided

## Error Handling

The function implements comprehensive error handling:

1. **Authentication Errors**: Invalid or missing JWT token
2. **Authorization Errors**: Non-admin users attempting to create users
3. **Validation Errors**: Invalid email, weak password, invalid role
4. **Conflict Errors**: Email already exists
5. **Database Errors**: Profile creation failure with automatic rollback

## Rollback Strategy

If profile creation fails after the auth user is created, the function automatically:
1. Logs the error
2. Deletes the auth user using admin API
3. Returns error response with rollback notification

This ensures data consistency between `auth.users` and `profiles` tables.

## Requirements Validation

This Edge Function satisfies the following requirements:
- **Requirement 2.1**: Implements request body validation for email, password, full_name, role, and optional branch_id
- **Requirement 2.2**: Verifies admin role by querying profiles table for auth.uid()
- **Requirement 2.4**: Uses Supabase Admin API createUser() method
- **Requirement 2.5**: Creates corresponding profile record with user metadata
- **Requirement 2.6**: Implements transaction-style error handling with rollback
- **Requirement 2.7**: Returns success response with user ID and profile data
- **Requirement 8.1**: Supports secure credential management (password minimum 6 characters)
