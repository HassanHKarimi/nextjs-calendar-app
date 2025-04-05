import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/calendar");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <span className="text-blue-600">Calendar App</span>
        </h1>

        <p className="mt-3 text-2xl">
          A simple calendar application built with Next.js and TypeScript
        </p>

        <div className="flex flex-wrap items-center justify-center mt-6 gap-4">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "px-8"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-8"
            )}
          >
            Sign Up
          </Link>
        </div>
        
        <div className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">User Authentication</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Secure login and registration system to keep your events private.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">Event Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create, edit, and delete events with ease.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">Multiple Views</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Daily, weekly, and monthly calendar views for better planning.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-2">Responsive Design</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Works perfectly on all devices - desktop, tablet, and mobile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
