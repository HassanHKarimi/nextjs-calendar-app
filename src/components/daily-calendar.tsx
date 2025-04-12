"use client";

import Link from "next/link";
import { useState } from "react";
import { format, isSameDay, addHours, setHours, setMinutes } from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getColorClass, formatTime } from "@/lib/utils";
import { Event } from "@prisma/client";
import dynamic from "next/dynamic";

// Dynamically import the EventModal to avoid SSR issues
const EventModal = dynamic(() => import("../pages/calendar/components/event-modal").then(mod => mod.EventModal), {
  ssr: false,
});

type DailyCalendarProps = {
  date: Date;
  events: Event[];
  prevDay: string;
  nextDay: string;
};

export function DailyCalendar({ date, events, prevDay, nextDay }: DailyCalendarProps) {
  // State to track the selected event for the modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Create time slots for the day (hourly)
  const hours = Array.from({ length: 24 }, (_, i) => {
    return setHours(setMinutes(new Date(date), 0), i);
  });

  // Group events by time slot
  function getEventsForHour(hour: Date) {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const hourEnd = addHours(hour, 1);

      return (
        // Event starts during this hour
        (eventStart >= hour && eventStart < hourEnd) ||
        // Event ends during this hour
        (eventEnd > hour && eventEnd <= hourEnd) ||
        // Event spans over this hour
        (eventStart <= hour && eventEnd >= hourEnd)
      );
    });
  }

  // Find all-day events
  const allDayEvents = events.filter((event) => event.isAllDay);
  
  // Handler for event clicks
  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.preventDefault();
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
        <Link href={`/calendar/day?date=${prevDay}`} className="text-sm text-muted-foreground hover:text-foreground">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-lg font-semibold">
          {format(date, "EEEE, MMMM d, yyyy")}
        </h2>
        <Link href={`/calendar/day?date=${nextDay}`} className="text-sm text-muted-foreground hover:text-foreground">
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="border-b p-2">
          <div className="mb-1 font-medium text-sm">All day</div>
          <div className="space-y-1">
            {allDayEvents.map((event) => (
              <a
                key={event.id}
                href={`/calendar/event/${event.id}`}
                onClick={(e) => handleEventClick(e, event)}
                className={cn(
                  "block rounded-md px-3 py-1.5 text-sm border shadow-sm hover:shadow-md transition-all",
                  "bg-gray-50 dark:bg-gray-800/50",
                  "hover:scale-[1.02] hover:-translate-y-[1px] cursor-pointer",
                  getColorClass(event.color)
                )}
              >
                {event.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hourly events */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          const hasEvents = hourEvents.length > 0;

          return (
            <div 
              key={hour.toISOString()} 
              className={cn(
                "flex min-h-[60px] p-2",
                hasEvents ? "bg-accent/10" : ""
              )}
            >
              <div className="w-16 pt-1 flex-shrink-0 text-muted-foreground text-sm">
                {format(hour, "h a")}
              </div>
              
              <div className="flex-1">
                {hasEvents ? (
                  <div className="space-y-1">
                    {hourEvents.map((event) => (
                      <a
                        key={event.id}
                        href={`/calendar/event/${event.id}`}
                        onClick={(e) => handleEventClick(e, event)}
                        className={cn(
                          "block rounded-md px-3 py-1.5 text-sm border shadow-sm hover:shadow-md transition-all",
                          "bg-gray-50 dark:bg-gray-800/50",
                          "hover:scale-[1.02] hover:-translate-y-[1px] cursor-pointer",
                          getColorClass(event.color)
                        )}
                      >
                        <div className="font-medium">{event.title}</div>
                        {!event.isAllDay && (
                          <div className="text-xs flex items-center mt-0.5">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="h-full">
                    <Link
                      href={`/calendar/new-event?date=${format(hour, "yyyy-MM-dd'T'HH:mm")}`}
                      className="block h-full rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent/20"
                    >
                      + Add event
                    </Link>
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
