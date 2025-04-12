import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/calendar");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <SignInForm />

        <div className="text-center text-sm pt-4 border-t">
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
