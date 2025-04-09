// Fully functional calendar page (with auth required)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay } from 'date-fns';
import { EventModal } from "../utils/event-modal";

// Sample event data
const SAMPLE_EVENTS = [
  {
    id: "event-1",
    title: "Team Meeting",
    description: "Weekly team meeting to discuss project progress",
    startDate: new Date(new Date().setHours(10, 0, 0, 0)),
    endDate: new Date(new Date().setHours(11, 0, 0, 0)),
    location: "Conference Room A",
    isAllDay: false,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    userId: "demo-user",
  },
  {
    id: "event-2", 
    title: "Product Launch",
    description: "Launch of the new calendar feature",
    startDate: new Date(),
    endDate: new Date(),
    isAllDay: true,
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    userId: "demo-user",
  },
  {
    id: "event-3",
    title: "Project Deadline",
    description: "Final submission deadline for the calendar project",
    startDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    isAllDay: true,
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    userId: "demo-user",
  }
];

// Add a few more events to make the calendar look more populated
for (let i = 1; i <= 10; i++) {
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 28) - 7);
  
  const startHour = 9 + Math.floor(Math.random() * 8);
  const duration = 1 + Math.floor(Math.random() * 3);
  
  const startTime = new Date(eventDate);
  startTime.setHours(startHour, 0, 0, 0);
  
  const endTime = new Date(eventDate);
  endTime.setHours(startHour + duration, 0, 0, 0);
  
  const titles = [
    "Team Standup", 
    "Client Meeting", 
    "Design Review", 
    "Code Review", 
    "Planning Session",
    "Sprint Demo",
    "1:1 with Manager",
    "Project Review",
    "API Discussion",
    "UI/UX Workshop"
  ];
  
  const colors = [
    "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "bg-green-100 text-green-800 hover:bg-green-200",
    "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "bg-red-100 text-red-800 hover:bg-red-200",
    "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
  ];
  
  SAMPLE_EVENTS.push({
    id: `event-${i + 3}`,
    title: titles[i % titles.length],
    description: `Description for ${titles[i % titles.length]}`,
    startDate: startTime,
    endDate: endTime,
    isAllDay: Math.random() > 0.8,  // 20% chance of all-day event
    color: colors[i % colors.length],
    userId: "demo-user"
  });
}

export default function CalendarPage() {
  const router = useRouter();
  // State hooks - always declare ALL hooks unconditionally
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const dateParam = router.query.date as string | undefined;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Use effect to check auth status client-side
  useEffect(() => {
    // Only run this effect on the client-side
    if (typeof window !== 'undefined') {
      try {
        const storedAuth = sessionStorage.getItem('calendarAuth');
        if (storedAuth) {
          const auth = JSON.parse(storedAuth);
          if (auth.isAuthenticated && auth.user) {
            setAuthUser(auth.user);
            setLoading(false);
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Auth error:', err);
        router.push('/');
      }
    } else {
      // During SSR, we don't want to show loading indefinitely
      setLoading(false);
    }
  }, [router]);
  
  // Effect to handle date parameter from URL
  useEffect(() => {
    // Parse date from URL or use current date
    if (dateParam) {
      try {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          setCurrentDate(parsedDate);
        }
      } catch (e) {
        console.error("Invalid date in URL", e);
      }
    }
    // Simulate loading time for data
    const timer = setTimeout(() => setDataLoading(false), 500);
    return () => clearTimeout(timer);
  }, [dateParam]);
  
  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('calendarAuth');
      router.push('/');
    }
  };
  
  // Return loading state if not authenticated yet
  if (loading || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Calculate month dates
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Format dates for navigation
  const formattedDate = format(currentDate, "MMMM yyyy");
  const prevMonth = format(subMonths(currentDate, 1), "yyyy-MM-dd");
  const nextMonth = format(addMonths(currentDate, 1), "yyyy-MM-dd");
  
  // Weekday headers
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Show data loading state
  if (dataLoading) {
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
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            <div className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{authUser?.name || 'User'}</span>
            </div>
            <button 
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
          <div className="flex gap-2">
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
        </div>
      </header>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <Link
            href={`/calendar?date=${prevMonth}`}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
          >
            &larr; Previous
          </Link>
          <h2 className="text-xl font-semibold">{formattedDate}</h2>
          <Link
            href={`/calendar?date=${nextMonth}`}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
          >
            Next &rarr;
          </Link>
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 border-b">
          {/* Day names */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 divide-x divide-y">
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
                key={day.toString()}
                className={`min-h-[120px] p-2 ${
                  !isSameMonth(day, currentDate) ? "bg-gray-100 text-gray-400" : ""
                } ${isToday(day) ? "bg-blue-50" : ""}`}
              >
                <div className="flex justify-between">
                  <Link
                    href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      isToday(day) ? "bg-blue-500 text-white font-semibold" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </Link>
                </div>

                <div className="mt-1 max-h-[80px] space-y-1 overflow-y-auto">
                  {dayEvents.length > 0 && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`block w-full truncate rounded-sm px-1 py-0.5 text-xs font-medium text-left ${event.color}`}
                          title={`${event.title}${event.isAllDay ? ' (All day)' : ` (${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')})`}\n${event.description || ''}`}
                        >
                          {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="px-1 text-xs text-gray-500">
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
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>This is a demo calendar with sample events. Click on a day to view detailed schedule.</p>
        <p className="mt-2">Logged in as: <span className="font-semibold">{authUser?.email || 'user@example.com'}</span></p>
        <div className="mt-4 flex justify-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Premium Features</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Event sharing - <span className="font-semibold">Requires Upgrade</span></li>
                    <li>Recurring events - <span className="font-semibold">Requires Upgrade</span></li>
                    <li>Calendar integrations - <span className="font-semibold">Requires Upgrade</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}