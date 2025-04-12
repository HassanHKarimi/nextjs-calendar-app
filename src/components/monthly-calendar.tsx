"use client";

import Link from "next/link";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  startOfWeek,
  endOfWeek
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getColorClass } from "@/lib/utils";
import { Event } from "@prisma/client";

type MonthlyCalendarProps = {
  date: Date;
  events: Event[];
  prevMonth: string;
  nextMonth: string;
};

export function MonthlyCalendar({ date, events, prevMonth, nextMonth }: MonthlyCalendarProps) {
  // Create calendar days for the grid
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Day names for the header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-lg border bg-card">
      {/* Calendar navigation */}
      <div className="flex items-center justify-between border-b p-4">
        <Link href={`/calendar?date=${prevMonth}`} className="text-sm text-muted-foreground hover:text-foreground">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-lg font-semibold">
          {format(date, "MMMM yyyy")}
        </h2>
        <Link href={`/calendar?date=${nextMonth}`} className="text-sm text-muted-foreground hover:text-foreground">
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-b">
        {/* Day names */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l">
        {days.map((day) => {
          // Get events for this day
          const dayEvents = events.filter((event) => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            
            return (
              (day >= eventStart && day <= eventEnd) ||
              isSameDay(day, eventStart) ||
              isSameDay(day, eventEnd)
            );
          });

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-800",
                !isSameMonth(day, date) && "bg-muted/50 text-muted-foreground",
                isToday(day) && "bg-accent/50"
              )}
            >
              <div className="flex justify-between">
                <Link 
                  href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`} 
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm",
                    isToday(day) && "bg-primary text-primary-foreground font-semibold",
                  )}
                >
                  {format(day, "d")}
                </Link>
              </div>

              <div className="mt-1 max-h-[80px] space-y-1.5 overflow-y-auto">
                {dayEvents.length > 0 && (
                  <div className="space-y-1.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <Link
                        key={event.id}
                        href={`/calendar/event/${event.id}`}
                        className={cn(
                          "block truncate rounded-md px-2 py-1 text-xs font-medium border shadow-sm hover:shadow-md transition-shadow",
                          getColorClass(event.color)
                        )}
                      >
                        {event.title}
                      </Link>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="px-1 text-xs text-muted-foreground">
                        + {dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
