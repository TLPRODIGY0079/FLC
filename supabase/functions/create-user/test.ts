/**
 * Test cases for create-user Edge Function
 * 
 * To run these tests locally:
 * 1. Start local Supabase: supabase start
 * 2. Serve function: supabase functions serve create-user
 * 3. Run tests: deno test --allow-net --allow-env test.ts
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.168.0/testing/asserts.ts'

const FUNCTION_URL = 'http://localhost:54321/functions/v1/create-user'
const ADMIN_TOKEN = 'test-admin-jwt-token' // Replace with actual test token

Deno.test('should reject request without authentication token', async () => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'Test User',
      role: 'leader',
    }),
  })

  assertEquals(response.status, 401)
  const data = await response.json()
  assertExists(data.error)
})

Deno.test('should reject request with invalid email format', async () => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'invalid-email',
      password: 'password123',
      full_name: 'Test User',
      role: 'leader',
    }),
  })

  assertEquals(response.status, 400)
  const data = await response.json()
  assertEquals(data.error, 'Invalid email format')
})

Deno.test('should reject request with weak password', async () => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: '123',
      full_name: 'Test User',
      role: 'leader',
    }),
  })

  assertEquals(response.status, 400)
  const data = await response.json()
  assertEquals(data.error, 'Password must be at least 6 characters')
})

Deno.test('should reject request with invalid role', async () => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'Test User',
      role: 'superadmin',
    }),
  })

  assertEquals(response.status, 400)
  const data = await response.json()
  assertEquals(data.error, 'Invalid role: must be admin or leader')
})

Deno.test('should reject request with missing required fields', async () => {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      // Missing password, full_name, and role
    }),
  })

  assertEquals(response.status, 400)
  const data = await response.json()
  assertExists(data.error)
})

Deno.test('should handle CORS preflight request', async () => {
  const response = await fetch(FUNCTION_URL, {
    method: 'OPTIONS',
  })

  assertEquals(response.status, 200)
  assertEquals(response.headers.get('Access-Control-Allow-Origin'), '*')
})

// Integration test (requires valid admin token and database)
Deno.test({
  name: 'should create user successfully with valid admin token',
  ignore: true, // Enable when testing with real database
  fn: async () => {
    const testEmail = `test-${Date.now()}@example.com`
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePass123!',
        full_name: 'Integration Test User',
        role: 'leader',
      }),
    })

    assertEquals(response.status, 200)
    const data = await response.json()
    assertEquals(data.success, true)
    assertExists(data.data.user_id)
    assertEquals(data.data.email, testEmail)
  },
})

// Integration test for duplicate email
Deno.test({
  name: 'should reject duplicate email',
  ignore: true, // Enable when testing with real database
  fn: async () => {
    const testEmail = 'existing@example.com'
    
    // First request
    await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePass123!',
        full_name: 'First User',
        role: 'leader',
      }),
    })

    // Second request with same email
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'DifferentPass456!',
        full_name: 'Second User',
        role: 'leader',
      }),
    })

    assertEquals(response.status, 409)
    const data = await response.json()
    assertEquals(data.error, 'A user with this email already exists')
  },
})
