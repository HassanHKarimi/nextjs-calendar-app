// pages/calendar/new-event/public.tsx - Public page for non-authenticated users
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PublicEventPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Event Creation</h1>
        <Link
          href="/"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Sign In
        </Link>
      </header>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V9m-3 1V6a3 3 0 016 0v4m-6 1h6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-lg text-gray-600 mb-6">
            You need to be signed in to create events
          </p>
          <div className="max-w-md mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Account Benefits</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Create and manage personal events</li>
                      <li>Get email reminders for upcoming events</li>
                      <li>Sync across multiple devices</li>
                      <li>Access premium features (upgrade required)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>This is a demo application. Any email containing '@' and password with 6+ characters will work.</p>
        <p className="mt-2"><span className="font-semibold">Example:</span> user@example.com / password123</p>
      </div>
    </div>
  );
}