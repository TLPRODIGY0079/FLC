import { useState } from 'react';
import { Moon, Sun, Bell, Shield, User, Database, Globe, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sun size={20} className="text-gray-600 dark:text-gray-400" />
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Dark Mode</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Switch between light and dark theme</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  darkMode ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    darkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                >
                  {darkMode ? <Moon size={14} className="text-red-600 m-1" /> : <Sun size={14} className="text-yellow-500 m-1" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Push Notifications</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Receive notifications on your device</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    notifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Email Notifications</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Receive updates via email</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  emailNotifications ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={20} className="text-gray-600 dark:text-gray-400" />
            Account
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Profile Information</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Update your personal details</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Change Password</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Update your security credentials</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-gray-600 dark:text-gray-400" />
            Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Two-Factor Authentication</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Add an extra layer of security</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Login History</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">View recent login activity</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                View
              </button>
            </div>
          </div>
        </div>

        {/* Data & Storage */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Database size={20} className="text-gray-600 dark:text-gray-400" />
            Data & Storage
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Export Data</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Download your ministry data</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                Export
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Clear Cache</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Free up storage space</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe size={20} className="text-gray-600 dark:text-gray-400" />
            Language & Region
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Language</label>
              <select className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Timezone</label>
              <select className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200">
                <option value="utc">UTC (Coordinated Universal Time)</option>
                <option value="est">EST (Eastern Standard Time)</option>
                <option value="pst">PST (Pacific Standard Time)</option>
                <option value="gmt">GMT (Greenwich Mean Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
