// pages/auth/index.tsx - Redirect page
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// This component only exists to redirect users who try to access /auth
export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to sign in...</p>
    </div>
  );
}
