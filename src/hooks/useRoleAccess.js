import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for role-based access control
 * Returns permission flags based on user's role
 */
export const useRoleAccess = () => {
  const { isAdmin, isLeader } = useAuth();

  return {
    // Admin-only permissions
    canManageUsers: isAdmin,
    canViewAllReports: isAdmin,
    canEditBranches: isAdmin,
    canViewSystemSettings: isAdmin,
    canDeleteRecords: isAdmin,
    
    // Shared permissions (both admin and leader)
    canManageOwnMembers: isLeader || isAdmin,
    canSubmitReports: isLeader || isAdmin,
    canViewFollowUps: isLeader || isAdmin,
    canManageOwnProfile: isLeader || isAdmin,
    canViewCalendar: isLeader || isAdmin,
    canSendMessages: isLeader || isAdmin,
  };
};
