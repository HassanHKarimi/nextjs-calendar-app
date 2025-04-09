// pages/calendar/day/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addDays, subDays, parseISO } from "date-fns";
import { EventModal } from "../../utils/event-modal";

// Sample event data for day view
const createSampleDayEvents = (date: Date) => {
  const events = [];
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  // Morning meeting
  const morning = new Date(date);
  morning.setHours(9, 0, 0, 0);
  events.push({
    id: "day-event-1",
    title: "Morning Standup",
    description: "Daily team standup meeting",
    startDate: morning,
    endDate: new Date(new Date(morning).setHours(9, 30, 0, 0)),
    location: "Conference Room A",
    isAllDay: false,
    color: "bg-blue-100 text-blue-800",
  });
  
  // Lunch meeting
  const lunch = new Date(date);
  lunch.setHours(12, 0, 0, 0);
  events.push({
    id: "day-event-2",
    title: "Lunch with Client",
    description: "Discuss calendar app requirements",
    startDate: lunch,
    endDate: new Date(new Date(lunch).setHours(13, 0, 0, 0)),
    location: "Downtown Cafe",
    isAllDay: false,
    color: "bg-green-100 text-green-800",
  });
  
  // Afternoon meeting
  const afternoon = new Date(date);
  afternoon.setHours(14, 30, 0, 0);
  events.push({
    id: "day-event-3",
    title: "Product Demo",
    description: "Demo of the calendar app to stakeholders",
    startDate: afternoon,
    endDate: new Date(new Date(afternoon).setHours(15, 30, 0, 0)),
    location: "Main Conference Room",
    isAllDay: false,
    color: "bg-purple-100 text-purple-800",
  });
  
  // Add some random events
  for (let i = 1; i <= 3; i++) {
    const hour = 8 + Math.floor(Math.random() * 9); // 8 AM to 5 PM
    const startTime = new Date(date);
    startTime.setHours(hour, Math.floor(Math.random() * 4) * 15, 0, 0);
    
    const duration = 30 + Math.floor(Math.random() * 5) * 15; // 30 to 105 minutes
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    const titles = [
      "Team Meeting", 
      "Code Review", 
      "Design Session", 
      "Client Call",
      "Planning"
    ];
    
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
    ];
    
    // Only add if not conflicting with existing events
    const conflicts = events.some(event => 
      (startTime >= new Date(event.startDate) && startTime < new Date(event.endDate)) ||
      (endTime > new Date(event.startDate) && endTime <= new Date(event.endDate)) ||
      (startTime <= new Date(event.startDate) && endTime >= new Date(event.endDate))
    );
    
    if (!conflicts) {
      events.push({
        id: `day-random-event-${i}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: `Random event ${i}`,
        startDate: startTime,
        endDate: endTime,
        isAllDay: false,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }
  
  return events;
};

// Hours array for the day view
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

export default function DayView() {
  const router = useRouter();
  // Handle authentication errors gracefully
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const dateParam = router.query.date as string;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
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
  
  // Effect to handle date parameter and load events
  useEffect(() => {
    // Parse date from URL or use current date
    if (dateParam) {
      try {
        const parsedDate = parseISO(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          setCurrentDate(parsedDate);
          setEvents(createSampleDayEvents(parsedDate));
        }
      } catch (e) {
        console.error("Invalid date in URL", e);
        setEvents(createSampleDayEvents(new Date()));
      }
    } else {
      setEvents(createSampleDayEvents(new Date()));
    }
    
    // Simulate loading time
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

  // Show data loading state
  if (dataLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Loading...</h1>
        <p className="mt-4">Please wait while we retrieve your calendar</p>
      </div>
    );
  }

  // Format dates for navigation
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const prevDay = format(subDays(currentDate, 1), "yyyy-MM-dd");
  const nextDay = format(addDays(currentDate, 1), "yyyy-MM-dd");

  // Event positioning helper
  const getEventPosition = (event: any) => {
    const startHour = new Date(event.startDate).getHours() + (new Date(event.startDate).getMinutes() / 60);
    const endHour = new Date(event.endDate).getHours() + (new Date(event.endDate).getMinutes() / 60);
    const top = (startHour - 7) * 60; // 7 AM is the start of our grid (0px)
    const height = (endHour - startHour) * 60;
    return { top, height };
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Daily Calendar</h1>
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
              href="/calendar"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Month View
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
            href={`/calendar/day?date=${prevDay}`}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
          >
            &larr; Previous Day
          </Link>
          <h2 className="text-xl font-semibold">{formattedDate}</h2>
          <Link
            href={`/calendar/day?date=${nextDay}`}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
          >
            Next Day &rarr;
          </Link>
        </div>
        
        {/* Day schedule view */}
        <div className="mt-4 relative">
          {/* Hour indicators */}
          <div className="border-l border-gray-200 pl-4">
            {HOURS.map(hour => (
              <div key={hour} className="flex items-start h-[60px] border-t border-gray-200">
                <div className="text-xs text-gray-500 -mt-2 -ml-10 w-8 pr-2 text-right">
                  {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
                </div>
              </div>
            ))}
          </div>
          
          {/* Events */}
          <div className="absolute top-0 left-14 right-4">
            {events.map(event => {
              const { top, height } = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`absolute rounded-sm p-2 shadow-sm border-l-4 border-l-blue-500 ${event.color} w-full overflow-hidden cursor-pointer hover:opacity-90`}
                  style={{ 
                    top: `${top}px`, 
                    height: `${height}px`,
                    maxWidth: 'calc(100% - 8px)'
                  }}
                >
                  <div className="font-semibold text-sm">
                    {event.title}
                  </div>
                  <div className="text-xs mt-1">
                    {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                  </div>
                  {height > 60 && (
                    <div className="text-xs mt-1 truncate">
                      {event.location && `📍 ${event.location}`}
                    </div>
                  )}
                  {height > 80 && (
                    <div className="text-xs mt-1 line-clamp-2">
                      {event.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>This is a demo calendar with sample events.</p>
        <p className="mt-2">Logged in as: <span className="font-semibold">{authUser?.email || 'user@example.com'}</span></p>
        
        <div className="mt-4 flex justify-center">
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 max-w-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">Pro Calendar Features</h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Full day schedule export - <span className="font-semibold">Requires Upgrade</span></li>
                    <li>Time blocking - <span className="font-semibold">Requires Upgrade</span></li>
                    <li>Email notifications - <span className="font-semibold">Requires Upgrade</span></li>
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