// Fallback calendar page for Pages Router
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Loading...</h1>
        <p className="mt-4">Please wait while we retrieve your calendar</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Calendar</h1>
        <div className="flex gap-4">
          <Link
            href="/calendar/day"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Day View
          </Link>
          <Link
            href="/calendar/week"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Week View
          </Link>
          <Link
            href="/calendar/new-event"
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            New Event
          </Link>
        </div>
      </header>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <p className="text-lg">
          Welcome, {session?.user?.name || "User"}! This is the fallback calendar
          page for compatibility with Pages Router.
        </p>
        <p className="mt-4">
          Your email: {session?.user?.email || "Not available"}
        </p>
      </div>
    </div>
  );
}