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
    <div className="flex h-full flex-col border-r bg-background p-4 space-y-4 w-60">
      <Button asChild size="sm" className="justify-start">
        <Link href="/calendar/new-event">
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Link>
      </Button>

      <div className="mt-8 space-y-1">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={pathname === route.href ? "secondary" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "w-full justify-start",
              pathname === route.href
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
