"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Calendar, List } from "lucide-react";

const routes = [
  {
    label: "Month",
    icon: CalendarDays,
    href: "/calendar",
  },
  {
    label: "Week",
    icon: Calendar,
    href: "/calendar/week",
  },
  {
    label: "Day",
    icon: List,
    href: "/calendar/day",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r bg-background p-4 space-y-4 w-56">
      <Button 
        asChild 
        size="sm" 
        className="justify-start bg-gray-800 hover:bg-gray-700 text-white py-1 px-3 text-sm font-medium rounded-md"
      >
        <Link href="/calendar/new-event">
          <Plus className="mr-2 h-3.5 w-3.5" />
          New Event
        </Link>
      </Button>

      <div className="mt-6 space-y-0.5">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "w-full justify-start py-1 px-3 text-xs font-medium rounded",
              pathname === route.href
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
            )}
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-3.5 w-3.5" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
