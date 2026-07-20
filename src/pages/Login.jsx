import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Church, Mail, Lock, Loader2 } from 'lucide-react';
import flcLogo from '../assets/flc pic.webp';
import flcBackground from '../assets/flc pic 2.webp';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect email or password');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email to confirm your account');
        } else {
          throw error;
        }
      }
      
      onLogin(data.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${flcBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Semi-transparent overlay for form readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700 relative z-10">
        <div className="text-center mb-8">
          {/* Church Logo */}
          {!logoError ? (
            <img 
              src={flcLogo}
              alt="FIRST LOVE CHURCH" 
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">FLC</span>
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FIRST LOVE CHURCH</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Ministry Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-colors shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Admin Contact Message */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="font-medium">Don't have an account?</p>
          <p className="mt-1">Contact your administrator for access</p>
        </div>
      </div>
    </div>
  );
}
