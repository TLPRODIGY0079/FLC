import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  PhoneCall, 
  GitBranch, 
  User, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  X,
  UsersRound
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import flcLogo from '../assets/flc pic 2.webp';

export default function Sidebar({ currentPage, setCurrentPage, isOpen, onClose }) {
  const { isAdmin } = useAuth();
  const [logoError, setLogoError] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', showFor: 'all' },
    { icon: FileText, label: 'Reports', path: '/reports', showFor: 'all' },
    { icon: Users, label: 'Members', path: '/members', showFor: 'all' },
    { icon: PhoneCall, label: 'Follow Ups', path: '/follow-ups', showFor: 'all' },
    { icon: GitBranch, label: 'Branches', path: '/branches', showFor: 'all' },
    { icon: User, label: 'Leaders', path: '/leaders', showFor: 'all' },
    { icon: UsersRound, label: 'Manage Users', path: '/users', showFor: 'admin' }, // Admin-only
    { icon: BarChart3, label: 'Analytics', path: '/analytics', showFor: 'all' },
    { icon: Calendar, label: 'Calendar', path: '/calendar', showFor: 'all' },
    { icon: MessageSquare, label: 'Messages', path: '/messages', showFor: 'all' },
    { icon: Settings, label: 'Settings', path: '/settings', showFor: 'all' },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => {
    if (item.showFor === 'admin') {
      return isAdmin;
    }
    return true;
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gradient-to-b from-red-900 to-red-800 min-h-screen p-6 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 mb-10">
          {!logoError ? (
            <img 
              src={flcLogo}
              alt="FLC Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-lg"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              FLC
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white leading-tight">Faith Life Church</h1>
            <p className="text-red-200 text-xs">Ministry Management</p>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-red-200 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.path);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-white text-red-900 shadow-lg' 
                        : 'text-red-100 hover:bg-red-700/50 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-100 hover:bg-red-700/50 hover:text-white transition-all mt-4"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );
}
