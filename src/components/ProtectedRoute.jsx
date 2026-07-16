import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Shield } from 'lucide-react';

/**
 * ProtectedRoute component
 * Wraps components that require specific role access
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string} props.requiredRole - Required role ('admin' or 'leader')
 * @param {React.ReactNode} props.fallback - Optional custom fallback component
 */
export default function ProtectedRoute({ children, requiredRole = null, fallback = null }) {
  const { user, userRole, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null; // The App component handles this
  }

  // Check if user has required role
  if (requiredRole && userRole !== requiredRole) {
    if (fallback) {
      return fallback;
    }

    // Default unauthorized message
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access this page. Admin privileges are required.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <AlertCircle size={16} />
            <span>Your current role: {userRole || 'Unknown'}</span>
          </div>
        </div>
      </div>
    );
  }

  // User is authorized
  return children;
}
