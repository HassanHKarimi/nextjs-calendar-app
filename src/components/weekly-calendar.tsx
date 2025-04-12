"use client";

import Link from "next/link";
import { 
  format, 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  setHours,
  setMinutes,
  addHours,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getColorClass } from "@/lib/utils";
import { Event } from "@prisma/client";

type WeeklyCalendarProps = {
  date: Date;
  events: Event[];
  prevWeek: string;
  nextWeek: string;
};

export function WeeklyCalendar({ date, events, prevWeek, nextWeek }: WeeklyCalendarProps) {
  // Create days for the week
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Create time slots (hourly, from 8am to 8pm for simplicity)
  const hours = Array.from({ length: 13 }, (_, i) => {
    return setHours(setMinutes(new Date(date), 0), i + 8);
  });

  // Helper function to get events for a specific day and hour
  function getEventsForDayAndHour(day: Date, hour: Date) {
    return events.filter((event) => {
      if (!isSameDay(day, new Date(event.startDate)) && 
          !isSameDay(day, new Date(event.endDate)) &&
          !(new Date(event.startDate) < day && new Date(event.endDate) > day)) {
        return false;
      }

      // Skip all-day events
      if (event.isAllDay) return false;

      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const hourEnd = addHours(hour, 1);
      const dayStart = new Date(day);
      dayStart.setHours(hour.getHours(), 0, 0, 0);
      const dayHourEnd = new Date(day);
      dayHourEnd.setHours(hourEnd.getHours(), 0, 0, 0);

      return (
        // Event starts during this hour
        (eventStart >= dayStart && eventStart < dayHourEnd) ||
        // Event ends during this hour
        (eventEnd > dayStart && eventEnd <= dayHourEnd) ||
        // Event spans over this hour
        (eventStart <= dayStart && eventEnd >= dayHourEnd)
      );
    });
  }

  // Find all-day events for a specific day
  function getAllDayEventsForDay(day: Date) {
    return events.filter((event) => {
      if (!event.isAllDay) return false;

      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      return (
        isSameDay(day, eventStart) || 
        isSameDay(day, eventEnd) || 
        (eventStart < day && eventEnd > day)
      );
    });
  }

  return (
    <div className="rounded-lg border bg-card">
      {/* Calendar navigation */}
      <div className="flex items-center justify-between border-b p-4">
        <Link href={`/calendar/week?date=${prevWeek}`} className="text-sm text-muted-foreground hover:text-foreground">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-lg font-semibold">
          {format(weekStart, "MMMM d")} - {format(weekEnd, "MMMM d, yyyy")}
        </h2>
        <Link href={`/calendar/week?date=${nextWeek}`} className="text-sm text-muted-foreground hover:text-foreground">
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "py-3 text-center border-r border-gray-200 dark:border-gray-800 last:border-r-0",
              isToday(day) && "bg-accent/50"
            )}
          >
            <Link href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`}>
              <div 
                className={cn(
                  "text-sm font-medium",
                  isToday(day) && "text-primary"
                )}
              >
                {format(day, "EEE")}
              </div>
              <div 
                className={cn(
                  "mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                  isToday(day) && "bg-primary text-primary-foreground font-semibold"
                )}
              >
                {format(day, "d")}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* All-day events */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
        {days.map((day) => {
          const allDayEvents = getAllDayEventsForDay(day);
          
          return (
            <div
              key={`allday-${day.toISOString()}`}
              className={cn(
                "p-2 min-h-[60px] border-r border-gray-200 dark:border-gray-800 last:border-r-0", 
                isToday(day) && "bg-accent/50"
              )}
            >
              {allDayEvents.length > 0 ? (
                <div className="space-y-1">
                  {allDayEvents.slice(0, 2).map((event) => (
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
                  {allDayEvents.length > 2 && (
                    <div className="px-1 text-xs text-muted-foreground">
                      + {allDayEvents.length - 2} more
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/calendar/new-event?date=${format(day, "yyyy-MM-dd")}&allDay=true`}
                  className="block h-full rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-accent/20"
                >
                  + Add
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Hourly grid */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        {hours.map((hour) => (
          <div key={hour.toISOString()} className="grid grid-cols-7 border-b last:border-b-0 border-gray-200 dark:border-gray-800">
            {/* Time label */}
            <div className="col-span-7 border-b pl-2 py-1 text-xs text-muted-foreground border-gray-200 dark:border-gray-800">
              {format(hour, "h a")}
            </div>

            {/* Events for each day at this hour */}
            {days.map((day) => {
              const hourlyEvents = getEventsForDayAndHour(day, hour);
              
              return (
                <div
                  key={`${day.toISOString()}-${hour.toISOString()}`}
                  className={cn(
                    "min-h-[60px] p-1 border-r border-gray-200 dark:border-gray-800 last:border-r-0",
                    isToday(day) && "bg-accent/20"
                  )}
                >
                  {hourlyEvents.length > 0 ? (
                    <div className="space-y-1">
                      {hourlyEvents.map((event) => (
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
                    </div>
                  ) : (
                    <Link
                      href={`/calendar/new-event?date=${format(day, "yyyy-MM-dd")}T${format(hour, "HH:mm")}`}
                      className="block h-full rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-accent/20"
                    >
                      + Add
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
