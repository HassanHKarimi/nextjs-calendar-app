// components/ui/toaster.tsx
"use client";

import React from "react";

// Simple toast component
export function Toaster() {
  const [toasts, setToasts] = React.useState<
    { id: string; message: string; type: "success" | "error" | "info" }[]
  >([]);

  // Function to add a toast
  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Create a global toast function
  React.useEffect(() => {
    // @ts-ignore - Add toast function to window
    window.toast = addToast;
  }, []);

  // If no toasts, return null
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md text-white ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}