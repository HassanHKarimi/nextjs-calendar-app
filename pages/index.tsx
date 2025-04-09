// Homepage with authentication requirement
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check if already authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedAuth = sessionStorage.getItem('calendarAuth');
        if (storedAuth) {
          const auth = JSON.parse(storedAuth);
          if (auth.isAuthenticated && auth.user) {
            console.log('User already authenticated, redirecting to calendar');
            // Short delay to ensure page is fully loaded
            setTimeout(() => {
              router.push('/calendar');
            }, 100);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Clear potentially corrupted storage
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem('calendarAuth');
          } catch (clearErr) {
            console.error('Failed to clear storage:', clearErr);
          }
        }
      }
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // For demo purposes, simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }
    
    // Simulate authentication
    setTimeout(() => {
      try {
        // Demo login - any email with any password of at least 6 characters works
        if (email.includes('@') && password.length >= 6) {
          setIsAuthenticated(true);
          // Safely store auth in sessionStorage
          try {
            const userData = {
              email: email,
              name: email.split('@')[0] || 'User', // Fallback name if parsing fails
              id: 'user-' + Math.random().toString(36).substring(2, 9)
            };
            
            sessionStorage.setItem('calendarAuth', JSON.stringify({
              isAuthenticated: true,
              user: userData
            }));
            
            console.log('Authentication successful, redirecting to calendar');
            router.push('/calendar');
          } catch (storageError) {
            console.error('Storage error:', storageError);
            // Still allow navigation even if storage fails
            router.push('/calendar');
          }
        } else {
          setError('Invalid credentials. Email must contain @ and password must be at least 6 characters.');
        }
      } catch (e) {
        console.error('Login error:', e);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Calendar App Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your calendar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Information
                </span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>This is a demo application.</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Any email containing '@' and password with 6+ characters will work</li>
                <li>Sample: user@example.com / password123</li>
                <li>Authentication is required to create events and access certain features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}