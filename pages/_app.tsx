// Minimal _app.tsx without any CSS frameworks
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../src/app/styles.css'

// Log on module load
console.log("[DIAGNOSTIC] _app.tsx module loaded");

export default function MyApp({ Component, pageProps }: AppProps) {
  // Log on component render
  console.log("[DIAGNOSTIC] MyApp rendering with route:", typeof window !== 'undefined' ? window.location.pathname : 'SSR');
  
  useEffect(() => {
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
      window.onerror = originalOnError;
    };
  }, []);
  
  return <Component {...pageProps} />;
}
