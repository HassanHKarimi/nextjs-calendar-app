// Fallback sign-in page for Pages Router
import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on page load
  useEffect(() => {
    setMounted(true);
    
    // Verify if the user is already authenticated
    const checkAuth = () => {
      try {
        // Check for Next.js Auth session cookie
        const hasSession = document.cookie.includes('next-auth.session-token') || 
                         document.cookie.includes('__Secure-next-auth.session-token');
        
        // Check for our custom session storage auth
        let hasCustomSession = false;
        if (typeof window !== 'undefined') {
          try {
            const storedAuth = sessionStorage.getItem('calendarAuth');
            if (storedAuth) {
              const auth = JSON.parse(storedAuth);
              hasCustomSession = auth.isAuthenticated && auth.user;
            }
          } catch (err) {
            console.error('Error checking custom session:', err);
            // Clear potentially corrupted storage
            try {
              sessionStorage.removeItem('calendarAuth');
            } catch (clearErr) {
              console.error('Failed to clear storage:', clearErr);
            }
          }
        }
        
        // Redirect to calendar if authenticated by either method
        if (hasSession || hasCustomSession) {
          console.log('User already authenticated, redirecting to calendar');
          router.push("/calendar");
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Don't render content until client-side hydration is complete
  if (!mounted) return null;
  
  // Show loading indicator
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <SignInForm />

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-medium underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}