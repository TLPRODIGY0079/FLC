import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createUser, listAllUsers, updateUserRole, deleteUser, getCurrentUserProfile } from '../lib/adminService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('Profile not found for user, setting default role');
        setUserRole('leader'); // Default to leader if no profile exists
      } else {
        setUserRole(data?.role || 'leader');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('leader'); // Default to leader on error
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userRole === 'admin';
  const isLeader = userRole === 'leader';

  const value = {
    user,
    userRole,
    isAdmin,
    isLeader,
    loading,
    error,
    // Admin user management functions
    createUser,
    listAllUsers,
    updateUserRole,
    deleteUser,
    getCurrentUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
