// pages/auth/auth-context.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for authentication on mount
  useEffect(() => {
    // Skip auth check for login page
    if (router.pathname === '/' || router.pathname === '/calendar/new-event/public') {
      setLoading(false);
      return;
    }

    try {
      // Only run on client-side
      if (typeof window !== 'undefined') {
        const storedAuth = sessionStorage.getItem('calendarAuth');
        
        if (storedAuth) {
          const auth = JSON.parse(storedAuth);
          if (auth.isAuthenticated && auth.user) {
            setUser(auth.user);
            setLoading(false);
            return;
          }
        }
        
        // Not authenticated, redirect to login
        router.push('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // On error, redirect to login
      if (typeof window !== 'undefined') {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  }, [router.pathname]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('calendarAuth', JSON.stringify({
        isAuthenticated: true,
        user: userData
      }));
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('calendarAuth');
      router.push('/');
    }
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  // Show loading state or render children
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}