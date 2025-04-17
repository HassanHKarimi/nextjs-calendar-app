// pages/calendar/week/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  format, 
  addWeeks, 
  subWeeks, 
  parseISO, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay,
  eachDayOfInterval
} from "date-fns";
import { EventModal } from "../utils/event-modal";

// Sample event data for week view
const createSampleWeekEvents = (weekStart: Date) => {
  const events = [];
  
  // Monday morning meeting (first day of week)
  const monday = new Date(weekStart);
  monday.setHours(9, 0, 0, 0);
  events.push({
    id: "week-event-1",
    title: "Weekly Planning",
    description: "Weekly team planning session",
    startDate: monday,
    endDate: new Date(new Date(monday).setHours(10, 0, 0, 0)),
    location: "Conference Room A",
    isAllDay: false,
    color: "bg-blue-100 text-blue-800",
  });
  
  // Wednesday lunch (third day of week)
  const wednesday = addDays(weekStart, 2);
  wednesday.setHours(12, 0, 0, 0);
  events.push({
    id: "week-event-2",
    title: "Lunch & Learn",
    description: "Technical presentation during lunch",
    startDate: wednesday,
    endDate: new Date(new Date(wednesday).setHours(13, 0, 0, 0)),
    location: "Cafeteria",
    isAllDay: false,
    color: "bg-green-100 text-green-800",
  });
  
  // Friday afternoon (fifth day of week)
  const friday = addDays(weekStart, 4);
  friday.setHours(14, 0, 0, 0);
  events.push({
    id: "week-event-3",
    title: "Sprint Review",
    description: "End of sprint review and demo",
    startDate: friday,
    endDate: new Date(new Date(friday).setHours(15, 30, 0, 0)),
    location: "Main Conference Room",
    isAllDay: false,
    color: "bg-purple-100 text-purple-800",
  });
  
  // Add an all-day event
  const thursday = addDays(weekStart, 3);
  events.push({
    id: "week-event-4",
    title: "Company Offsite",
    description: "Annual company team building",
    startDate: thursday,
    endDate: thursday,
    isAllDay: true,
    color: "bg-yellow-100 text-yellow-800",
  });
  
  // Add some random events throughout the week
  for (let day = 0; day < 7; day++) {
    // Skip weekend days (Saturday and Sunday) - if you want fewer events
    if (day === 0 || day === 6) continue;
    
    // 60% chance of having an event on this day
    if (Math.random() > 0.4) {
      const currentDay = addDays(weekStart, day);
      const hour = 8 + Math.floor(Math.random() * 8); // 8 AM to 4 PM
      
      const startTime = new Date(currentDay);
      startTime.setHours(hour, Math.floor(Math.random() * 4) * 15, 0, 0);
      
      const duration = 30 + Math.floor(Math.random() * 5) * 15; // 30 to 105 minutes
      const endTime = new Date(startTime.getTime() + duration * 60000);
      
      const titles = [
        "Client Meeting", 
        "Product Review", 
        "Design Critique", 
        "1:1 with Manager",
        "Feature Planning"
      ];
      
      const colors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-purple-100 text-purple-800",
        "bg-yellow-100 text-yellow-800",
        "bg-red-100 text-red-800",
      ];
      
      events.push({
        id: `week-random-event-${day}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: `Random event for day ${day}`,
        startDate: startTime,
        endDate: endTime,
        isAllDay: Math.random() > 0.9, // 10% chance of all-day event
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }
  
  return events;
};

// Hours array for the day columns
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

export default function WeekView() {
  const router = useRouter();
  // Handle authentication errors gracefully
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const dateParam = router.query.date as string;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
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
    const date = dateParam ? parseISO(dateParam) : new Date();
    if (!isNaN(date.getTime())) {
      setCurrentDate(date);
      const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday as start of week
      setEvents(createSampleWeekEvents(weekStart));
    } else {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
      setEvents(createSampleWeekEvents(weekStart));
    }
    
    // Simulate loading time with smoother transitions
    const timer = setTimeout(() => {
      setDataLoading(false);
      // Add a small delay before showing the page for smooth transition
      setTimeout(() => setPageReady(true), 100);
    }, 300);
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

  // Calculate week dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Format dates for navigation
  const formattedDateRange = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  const prevWeek = format(subWeeks(currentDate, 1), "yyyy-MM-dd");
  const nextWeek = format(addWeeks(currentDate, 1), "yyyy-MM-dd");

  // Event positioning helper for a specific day
  const getDayEvents = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Check if the event occurs on this day
      return isSameDay(day, eventStart) || isSameDay(day, eventEnd) ||
        (day >= eventStart && day <= eventEnd);
    });
  };

  // Position calculation for events
  const getEventPosition = (event: any) => {
    const startHour = new Date(event.startDate).getHours() + (new Date(event.startDate).getMinutes() / 60);
    const endHour = new Date(event.endDate).getHours() + (new Date(event.endDate).getMinutes() / 60);
    const top = Math.max(0, (startHour - 8) * 60); // 8 AM is the start of our grid (0px)
    const height = Math.min(12 * 60, (endHour - startHour) * 60); // Cap at the bottom of our grid
    return { top, height };
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{
      opacity: pageReady ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weekly Calendar</h1>
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
              href="/calendar/day"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Day View
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
            href={`/calendar/week?date=${prevWeek}`}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
          >
            &larr; Previous Week
          </Link>
          <h2 className="text-xl font-semibold">{formattedDateRange}</h2>
          <Link
            href={`/calendar/week?date=${nextWeek}`}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200"
          >
            Next Week &rarr;
          </Link>
        </div>
        
        {/* Week view grid */}
        <div className="mt-4 flex">
          {/* Time column */}
          <div className="w-16 pr-2 flex-shrink-0">
            <div className="h-12 border-b border-transparent"></div>
            {HOURS.map(hour => (
              <div key={hour} className="h-[60px] text-xs text-gray-500 text-right">
                {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          <div className="flex-grow grid grid-cols-7 divide-x">
            {/* Day headers */}
            {weekDays.map((day, index) => (
              <div key={day.toString()} className="text-center">
                <div className="h-12 flex flex-col justify-center border-b">
                  <div className="text-xs text-gray-500">{format(day, "EEE")}</div>
                  <Link href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`}>
                    <div className={`text-sm font-medium ${isSameDay(day, new Date()) ? "bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>
                      {format(day, "d")}
                    </div>
                  </Link>
                </div>
                
                {/* All day events */}
                <div className="min-h-[20px] bg-gray-50 p-1">
                  {getDayEvents(day)
                    .filter(event => event.isAllDay)
                    .slice(0, 1)
                    .map(event => (
                      <div 
                        key={event.id} 
                        onClick={() => setSelectedEvent(event)}
                        className={`text-xs p-1 rounded truncate ${event.color} cursor-pointer hover:opacity-90`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  {getDayEvents(day).filter(event => event.isAllDay).length > 1 && (
                    <div className="text-xs text-gray-500 px-1">
                      + {getDayEvents(day).filter(event => event.isAllDay).length - 1} more
                    </div>
                  )}
                </div>
                
                {/* Time slots */}
                <div className="relative">
                  {HOURS.map(hour => (
                    <div key={hour} className="h-[60px] border-b border-gray-100"></div>
                  ))}
                  
                  {/* Events */}
                  {getDayEvents(day)
                    .filter(event => !event.isAllDay)
                    .map(event => {
                      const { top, height } = getEventPosition(event);
                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`absolute mx-1 rounded-sm px-1 shadow-sm text-xs ${event.color} overflow-hidden cursor-pointer hover:opacity-90`}
                          style={{ 
                            top: `${top}px`, 
                            height: `${height}px`,
                            left: '2px',
                            right: '2px'
                          }}
                          title={`${event.title}\n${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')}\n${event.description || ''}`}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          {height >= 30 && (
                            <div className="text-[10px] truncate">
                              {format(new Date(event.startDate), 'h:mm a')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>This is a demo calendar with sample events. Click on a day to view detailed schedule.</p>
        <p className="mt-2">Logged in as: <span className="font-semibold">{authUser?.email || 'user@example.com'}</span></p>
        
        <div className="mt-4 flex justify-center">
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 max-w-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-purple-800">Team Calendar Features</h3>
                <div className="mt-2 text-sm text-purple-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Team member availability view - <span className="font-semibold">Requires Team Plan</span></li>
                    <li>Meeting scheduling assistant - <span className="font-semibold">Requires Team Plan</span></li>
                    <li>Shared calendar permissions - <span className="font-semibold">Requires Team Plan</span></li>
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