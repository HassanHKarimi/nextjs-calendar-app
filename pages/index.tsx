// Fallback index page if App Router page doesn't work
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the app directory version
    router.push('/calendar');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Loading...</h1>
      <p className="mt-4">Redirecting to the application...</p>
    </div>
  );
}