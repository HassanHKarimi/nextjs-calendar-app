// Minimal _app.tsx without any CSS frameworks
import type { AppProps } from 'next/app'
import { useEffect, useState, Suspense } from 'react'
import '../styles/index.css'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

// Log on module load
console.log("[DIAGNOSTIC] _app.tsx module loaded");

// Custom loading component
function LoadingBar({ progress = 0, show = false }) {
  return (
    <>
      {show && (
        <div className="loading-bar" style={{
          opacity: show ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}></div>
      )}
    </>
  );
}

// Lazy load pages
const lazyLoading = (importFunc) => {
  const LazyComponent = dynamic(importFunc, {
    loading: () => null, // We'll handle loading state ourselves
    ssr: false
  });
  
  return LazyComponent;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [prevPath, setPrevPath] = useState('');
  
  // Log on component render
  console.log("[DIAGNOSTIC] MyApp rendering with route:", typeof window !== 'undefined' ? window.location.pathname : 'SSR');
  
  useEffect(() => {
    // Handle route change start
    const handleStart = (url: string) => {
      console.log("[DIAGNOSTIC] Route change starting to:", url);
      setPrevPath(router.pathname);
      setLoading(true);
      setLoadingProgress(10); // Initial progress
      
      // Simulate progress
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.floor(Math.random() * 10) + 1;
        });
      }, 200);
      
      return () => clearInterval(interval);
    };
    
    // Handle route change complete
    const handleComplete = (url: string) => {
      console.log("[DIAGNOSTIC] Route change completed to:", url);
      setLoadingProgress(100);
      
      // Small delay to show 100% before hiding
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 300);
    };
    
    // Handle route change error
    const handleError = (err: Error, url: string) => {
      console.log("[DIAGNOSTIC] Route change error to:", url, err);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 300);
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
    <Suspense fallback={<LoadingBar show={true} />}>
      <LoadingBar show={loading} progress={loadingProgress} />
      <div className={loading ? '' : 'fade-in'}>
        <Component {...pageProps} />
      </div>
    </Suspense>
  );
}
