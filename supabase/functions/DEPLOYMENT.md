# Supabase Edge Functions Deployment Guide

## Prerequisites

### 1. Install Supabase CLI

**Windows (PowerShell):**
```powershell
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using NPM
npm install -g supabase
```

**macOS/Linux:**
```bash
# Using Homebrew
brew install supabase/tap/supabase

# Or using NPM
npm install -g supabase
```

### 2. Verify Installation
```bash
supabase --version
```

## Initial Setup

### 1. Login to Supabase
```bash
supabase login
```

This will open a browser window to authenticate with your Supabase account.

### 2. Link to Your Project
```bash
cd "c:\Users\Administrator\Desktop\All code\church app"
supabase link --project-ref ornqdhmxzitnfhwqrhxq
```

You'll be prompted to enter your database password.

### 3. Verify Link
```bash
supabase projects list
```

## Deploying Edge Functions

### Deploy All Functions
```bash
supabase functions deploy
```

### Deploy Specific Function
```bash
supabase functions deploy create-user
```

### Deploy with No Verification JWT
```bash
supabase functions deploy create-user --no-verify-jwt
```

## Environment Variables

Edge Functions automatically have access to these environment variables:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (for admin operations)
- `SUPABASE_ANON_KEY`: Anonymous key (for client operations)

### Setting Custom Environment Variables
```bash
supabase secrets set MY_SECRET_KEY=value
```

### Listing Secrets
```bash
supabase secrets list
```

## Local Development

### 1. Start Local Supabase
```bash
supabase start
```

This will start:
- Local Postgres database
- Auth server
- Storage server
- Edge Functions runtime

### 2. Serve Functions Locally
```bash
supabase functions serve create-user
```

The function will be available at:
```
http://localhost:54321/functions/v1/create-user
```

### 3. Test Locally
```bash
curl -X POST http://localhost:54321/functions/v1/create-user \
  -H "Authorization: Bearer YOUR_LOCAL_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User",
    "role": "leader"
  }'
```

### 4. View Function Logs
```bash
supabase functions serve create-user --debug
```

## Production Deployment

### 1. Test in Staging (Optional)
```bash
# Deploy to staging project
supabase link --project-ref your-staging-ref
supabase functions deploy create-user
```

### 2. Deploy to Production
```bash
# Link to production project
supabase link --project-ref ornqdhmxzitnfhwqrhxq
supabase functions deploy create-user
```

### 3. Verify Deployment
```bash
# Check function status
supabase functions list

# Test the deployed function
curl -X POST https://ornqdhmxzitnfhwqrhxq.supabase.co/functions/v1/create-user \
  -H "Authorization: Bearer YOUR_PROD_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "full_name": "Test User",
    "role": "leader"
  }'
```

## Monitoring and Debugging

### View Function Logs
```bash
# View recent logs
supabase functions logs create-user

# Follow logs in real-time
supabase functions logs create-user --follow
```

### Check Function Status
```bash
supabase functions list
```

### Function Metrics
View metrics in the Supabase Dashboard:
1. Navigate to Functions section
2. Click on `create-user` function
3. View invocations, errors, and execution time

## Troubleshooting

### Function Not Deploying
```bash
# Clear cache and redeploy
rm -rf .supabase/functions-cache
supabase functions deploy create-user --force
```

### Permission Errors
Ensure you have the correct project permissions:
```bash
supabase projects list
supabase link --project-ref ornqdhmxzitnfhwqrhxq
```

### CORS Errors
Check CORS headers in the function code:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### Authentication Errors
1. Verify JWT token is valid
2. Check that user has admin role in profiles table
3. Verify SUPABASE_SERVICE_ROLE_KEY is set correctly

## Rolling Back

### List Function Versions
```bash
supabase functions list --versions create-user
```

### Rollback to Previous Version
```bash
supabase functions deploy create-user --version previous
```

## Security Checklist

- [ ] Service role key is never exposed to client
- [ ] CORS headers are configured appropriately for production
- [ ] Admin role verification is in place
- [ ] Input validation is implemented
- [ ] Error messages don't leak sensitive information
- [ ] Logging excludes sensitive data (passwords, tokens)

## Integration with React App

The Edge Function is called from the React app using the `adminService.js` helper:

```javascript
import { createUser } from './lib/adminService.js'

const result = await createUser({
  email: 'newuser@example.com',
  password: 'SecurePass123!',
  full_name: 'New User',
  role: 'leader',
  branch_id: null,
})

if (result.success) {
  console.log('User created:', result.data)
} else {
  console.error('Error:', result.error)
}
```

## Useful Commands Reference

```bash
# Login
supabase login

# Link project
supabase link --project-ref ornqdhmxzitnfhwqrhxq

# Deploy function
supabase functions deploy create-user

# List functions
supabase functions list

# View logs
supabase functions logs create-user

# Start local dev
supabase start

# Serve function locally
supabase functions serve create-user

# Stop local dev
supabase stop

# Set secret
supabase secrets set SECRET_NAME=value

# List secrets
supabase secrets list

# Unset secret
supabase secrets unset SECRET_NAME
```

## Next Steps

After deploying the Edge Function:

1. ✅ Deploy `create-user` function to Supabase
2. ✅ Test function with admin user JWT
3. ✅ Integrate `adminService.js` into React components
4. ✅ Create UserManagement UI component
5. ✅ Implement role-based access control in UI
6. ✅ Test complete user creation workflow
7. ✅ Monitor function logs for errors
8. ✅ Set up alerts for function failures

## Support

- Supabase Functions Documentation: https://supabase.com/docs/guides/functions
- Supabase CLI Reference: https://supabase.com/docs/reference/cli
- Deno Documentation: https://deno.land/manual
