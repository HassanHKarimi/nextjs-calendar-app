// Minimal _app.tsx without any CSS frameworks
import type { AppProps } from 'next/app'
import { useEffect, useState, Suspense } from 'react'
import '../styles/index.css'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

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
  
  useEffect(() => {
    // Handle route change start
    const handleStart = (url: string) => {
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
      setLoadingProgress(100);
      
      // Small delay to show 100% before hiding
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 300);
    };
    
    // Handle route change error
    const handleError = (err: Error, url: string) => {
      setLoadingProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 300);
    };
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);
    
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
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
