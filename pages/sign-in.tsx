// Fallback sign-in page for Pages Router
import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user is logged in by looking for session cookie
    const hasSession = document.cookie.includes('next-auth.session-token') || 
                     document.cookie.includes('__Secure-next-auth.session-token');
    
    if (hasSession) {
      router.push("/calendar");
    }
  }, [router]);

  if (!mounted) return null;

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