import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SubmitReport from './pages/SubmitReport';
import Members from './pages/Members';
import Analytics from './pages/Analytics';
import Branches from './pages/Branches';
import LeaderProfile from './pages/LeaderProfile';
import FollowUps from './pages/FollowUps';
import Leaders from './pages/Leaders';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2, AlertCircle } from 'lucide-react';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading, error, user } = useAuth();

  const handleLogin = (user) => {
    // Login successful, user state will be updated by AuthContext
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Please check your Supabase configuration in the .env file.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard />;
      case '/reports':
        return <SubmitReport />;
      case '/members':
        return <Members />;
      case '/follow-ups':
        return <FollowUps />;
      case '/analytics':
        return <Analytics />;
      case '/branches':
        return <Branches />;
      case '/leaders':
        return <Leaders />;
      case '/users':
        return (
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        );
      case '/calendar':
        return <Calendar />;
      case '/messages':
        return <Messages />;
      case '/settings':
        return <Settings />;
      case '/leader-profile':
        return <LeaderProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
