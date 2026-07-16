import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env file');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ADMIN_USER_ID = '6787d2e2-862c-4160-a96a-878c84e89d25';

async function updateAdminUser() {
  try {
    console.log('Starting admin user update...');
    console.log(`Target user ID: ${ADMIN_USER_ID}`);

    // Step 1: Check if profile exists and get current role (idempotency check)
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', ADMIN_USER_ID)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError.message);
      process.exit(1);
    }

    if (!existingProfile) {
      console.error(`Profile not found for user ID: ${ADMIN_USER_ID}`);
      process.exit(1);
    }

    console.log('Current profile:', existingProfile);

    // Idempotency check: if already admin, skip update
    if (existingProfile.role === 'admin') {
      console.log('✓ User is already an admin. No update needed.');
      console.log('Idempotency check passed - role assignment is already complete.');
      return;
    }

    // Step 2: Update role to admin
    console.log(`Updating role from '${existingProfile.role}' to 'admin'...`);
    
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', ADMIN_USER_ID)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError.message);
      process.exit(1);
    }

    console.log('✓ Profile updated successfully');

    // Step 3: Verify the update
    const { data: verifiedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at, updated_at')
      .eq('id', ADMIN_USER_ID)
      .single();

    if (verifyError) {
      console.error('Error verifying profile:', verifyError.message);
      process.exit(1);
    }

    console.log('\n=== Verification Complete ===');
    console.log('Updated profile details:');
    console.log(`  ID: ${verifiedProfile.id}`);
    console.log(`  Email: ${verifiedProfile.email}`);
    console.log(`  Full Name: ${verifiedProfile.full_name || 'N/A'}`);
    console.log(`  Role: ${verifiedProfile.role}`);
    console.log(`  Created: ${verifiedProfile.created_at}`);
    console.log(`  Updated: ${verifiedProfile.updated_at}`);
    console.log('\n✓ Admin user update completed successfully!');

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the update
updateAdminUser();
