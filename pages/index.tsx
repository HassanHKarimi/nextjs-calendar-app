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

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '3rem 1.5rem'
  };

  const headerStyle = {
    margin: '0 auto',
    width: '100%',
    maxWidth: '28rem',
    textAlign: 'center'
  };

  const titleStyle = {
    marginTop: '1.5rem',
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827'
  };

  const subtitleStyle = {
    marginTop: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280'
  };

  const formContainerStyle = {
    marginTop: '2rem',
    margin: '2rem auto',
    width: '100%',
    maxWidth: '28rem'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2rem 1rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    borderRadius: '0.5rem'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.25rem'
  };

  const inputStyle = {
    appearance: 'none',
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    fontSize: '0.875rem'
  };

  const errorStyle = {
    backgroundColor: '#fee2e2',
    borderLeft: '4px solid #f87171',
    padding: '1rem',
    marginBottom: '1rem'
  };

  const errorTextStyle = {
    fontSize: '0.875rem',
    color: '#b91c1c'
  };

  const buttonStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    backgroundColor: '#2563eb',
    cursor: 'pointer',
    opacity: isLoading ? '0.5' : '1'
  };

  const dividerContainerStyle = {
    marginTop: '1.5rem',
    position: 'relative'
  };

  const dividerStyle = {
    borderTop: '1px solid #e5e7eb',
    position: 'absolute',
    top: '50%',
    width: '100%'
  };

  const dividerTextContainerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '0.875rem'
  };

  const dividerTextStyle = {
    padding: '0 0.5rem',
    backgroundColor: 'white',
    color: '#6b7280'
  };

  const demoInfoStyle = {
    marginTop: '1.5rem',
    fontSize: '0.875rem', 
    color: '#6b7280'
  };

  const listStyle = {
    listStyle: 'disc',
    paddingLeft: '1.25rem',
    marginTop: '0.5rem'
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          Calendar App Login
        </h2>
        <p style={subtitleStyle}>
          Sign in to access your calendar
        </p>
      </div>

      <div style={formContainerStyle}>
        <div style={formStyle}>
          <form onSubmit={handleLogin}>
            <div style={formGroupStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="••••••"
                />
              </div>
            </div>

            {error && (
              <div style={errorStyle}>
                <div>
                  <div>
                    <p style={errorTextStyle}>
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
                style={buttonStyle}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div style={dividerContainerStyle}>
            <div style={dividerStyle}></div>
            <div style={dividerTextContainerStyle}>
              <span style={dividerTextStyle}>
                Demo Information
              </span>
            </div>
          </div>

          <div style={demoInfoStyle}>
            <p>This is a demo application.</p>
            <ul style={listStyle}>
              <li>Any email containing '@' and password with 6+ characters will work</li>
              <li>Sample: user@example.com / password123</li>
              <li>Authentication is required to create events and access certain features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}