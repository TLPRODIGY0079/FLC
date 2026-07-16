import { Bell, Search, Filter, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import flcLogo from '../assets/flc pic.webp';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const [logoError, setLogoError] = useState(false);

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <header className="bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{getGreeting()}, {getUserName()}! 👋</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Faith Life Church Ministry</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 w-64"
          />
        </div>
        
        <button className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
          <Filter size={18} />
          <span>Filter</span>
        </button>
        
        <button className="relative p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Church Logo / User Avatar */}
        {!logoError ? (
          <img 
            src={flcLogo}
            alt="FLC Logo" 
            className="w-10 h-10 rounded-full object-cover shadow-md"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">FLC</span>
          </div>
        )}
      </div>
    </header>
  );
}
