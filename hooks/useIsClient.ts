import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the code is running on the client-side
 * This helps prevent hydration errors with server/client mismatches
 * 
 * @returns boolean - True if running on client-side, false during SSR
 */
export default function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
} 