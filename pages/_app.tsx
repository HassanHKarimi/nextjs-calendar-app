// Minimal _app.tsx without any CSS frameworks
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import '../src/app/styles.css'
import { useRouter } from 'next/router'

// Log on module load
console.log("[DIAGNOSTIC] _app.tsx module loaded");

// Custom loading component
function LoadingOverlay() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#111827',
          borderBottomColor: '#111827',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>Loading your calendar...</p>
      </div>
    </div>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Log on component render
  console.log("[DIAGNOSTIC] MyApp rendering with route:", typeof window !== 'undefined' ? window.location.pathname : 'SSR');
  
  useEffect(() => {
    // Handle route change start
    const handleStart = (url: string) => {
      console.log("[DIAGNOSTIC] Route change starting to:", url);
      setLoading(true);
    };
    
    // Handle route change complete
    const handleComplete = (url: string) => {
      console.log("[DIAGNOSTIC] Route change completed to:", url);
      setLoading(false);
    };
    
    // Handle route change error
    const handleError = (err: Error, url: string) => {
      console.log("[DIAGNOSTIC] Route change error to:", url, err);
      setLoading(false);
    };
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);
    
    // Log on client-side
    console.log("[DIAGNOSTIC] MyApp mounted, current URL:", window.location.href);
    console.log("[DIAGNOSTIC] Current pathname:", window.location.pathname);
    
    // Add global error handler to catch any issues
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      console.log("[DIAGNOSTIC] Global error:", message);
      console.log("[DIAGNOSTIC] Error details:", {source, lineno, colno, error});
      
      // Call original handler if it exists
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
    
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
      window.onerror = originalOnError;
    };
  }, [router]);
  
  return (
    <>
      {loading && <LoadingOverlay />}
      <Component {...pageProps} />
    </>
  );
}
