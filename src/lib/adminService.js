import { supabase } from './supabase.js';

/**
 * Admin Service
 * Provides administrative functions for user management
 */

/**
 * Create a new user (admin-only operation)
 * Uses Supabase admin API to create auth user and profile
 * 
 * @param {Object} userData - User creation data
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password (min 6 characters)
 * @param {string} userData.full_name - User's full name
 * @param {string} userData.role - User's role ('admin' or 'leader')
 * @param {string} [userData.branch_id] - Optional branch ID to assign
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const createUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.full_name || !userData.role) {
      return {
        success: false,
        error: 'Missing required fields: email, password, full_name, and role are required',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return {
        success: false,
        error: 'Invalid email format',
      };
    }

    // Validate password length
    if (userData.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }

    // Validate role
    if (!['admin', 'leader'].includes(userData.role)) {
      return {
        success: false,
        error: 'Invalid role: must be admin or leader',
      };
    }

    // Create auth user using admin API
    // Note: This requires the service_role key, which should be handled securely
    // For now, we'll use the client-side auth.signup which creates the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
        },
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return {
        success: false,
        error: authError.message || 'Failed to create user account',
      };
    }

    // The profile will be created automatically by the trigger
    // We just need to update the role if needed
    if (authData.user) {
      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update the profile with the correct role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: userData.role,
          full_name: userData.full_name,
          branch_id: userData.branch_id || null,
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Don't fail here, the user was created
      }
    }

    return {
      success: true,
      data: authData.user,
    };

  } catch (error) {
    console.error('Unexpected error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * List all users (admin-only operation)
 * 
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export const listAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, branch_id, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch users',
      };
    }

    return {
      success: true,
      data: data || [],
    };

  } catch (error) {
    console.error('Unexpected error fetching users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Update user role (admin-only operation)
 * 
 * @param {string} userId - User ID to update
 * @param {string} newRole - New role ('admin' or 'leader')
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    // Validate role
    if (!['admin', 'leader'].includes(newRole)) {
      return {
        success: false,
        error: 'Invalid role: must be admin or leader',
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        error: error.message || 'Failed to update user role',
      };
    }

    return {
      success: true,
      data,
    };

  } catch (error) {
    console.error('Unexpected error updating user role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Delete user (admin-only operation)
 * Note: This only deletes the profile. The auth user should be deleted via Edge Function.
 * 
 * @param {string} userId - User ID to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete user',
      };
    }

    return {
      success: true,
    };

  } catch (error) {
    console.error('Unexpected error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Get current user's profile with role
 * 
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, branch_id, avatar_url, created_at')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch user profile',
      };
    }

    return {
      success: true,
      data,
    };

  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
