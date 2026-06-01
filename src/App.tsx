import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { User } from './types';
import { getCurrentUser, setCurrentUser as setStoredUser } from './lib/storage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setStoredUser(u);
    toast.success(`Welcome back, ${u.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setStoredUser(null);
    toast.info('Logged out successfully');
  };

  const handleUpdateUser = (updated: User) => {
    setUser(updated);
    setStoredUser(updated);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-center" richColors />
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
      )}
    </div>
  );
}