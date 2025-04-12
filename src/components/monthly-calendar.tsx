"use client";

import Link from "next/link";
import { useState } from "react";
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
import dynamic from "next/dynamic";

// Import the EventModal component with no SSR to prevent hydration issues
const EventModal = dynamic(() => import("@/components/calendar/event-modal"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  ),
});

type MonthlyCalendarProps = {
  date: Date;
  events: Event[];
  prevMonth: string;
  nextMonth: string;
};

export function MonthlyCalendar({ date, events, prevMonth, nextMonth }: MonthlyCalendarProps) {
  // State to track the selected event for the modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Create calendar days for the grid
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Day names for the header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Handler for event clicks with debugging
  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log("Event clicked:", event); // For debugging
    setSelectedEvent(event);
  };

  return (
    <div className="rounded-lg border bg-card">
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
      
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
                      <button
                        key={event.id}
                        onClick={(e) => handleEventClick(e, event)}
                        className={cn(
                          "block w-full text-left truncate rounded-md px-2 py-1 text-xs font-medium border shadow-sm hover:shadow-md transition-all cursor-pointer",
                          "bg-gray-50 dark:bg-gray-800/50",
                          "hover:scale-[1.02] hover:-translate-y-[1px]",
                          getColorClass(event.color)
                        )}
                      >
                        {event.title}
                      </button>
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
