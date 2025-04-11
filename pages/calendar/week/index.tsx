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
    const date = dateParam ? parseISO(dateParam) : new Date();
    if (!isNaN(date.getTime())) {
      setCurrentDate(date);
      const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday as start of week
      setEvents(createSampleWeekEvents(weekStart));
    } else {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
      setEvents(createSampleWeekEvents(weekStart));
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Loading Calendar...</h2>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show data loading state
  if (dataLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">Loading Calendar</h1>
        <p className="mt-4 text-gray-600">Please wait while we retrieve your events</p>
        <div className="mt-8 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Calendar</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-gray-600">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
                  {authUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="font-medium">{authUser?.name || 'User'}</span>
              </div>
              <button 
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 hover:underline"
              >
                Logout
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/calendar" className="rounded-md bg-blue-100 px-4 py-2 text-blue-800 font-medium hover:bg-blue-200 transition-colors">
                Month
              </Link>
              <Link href="/calendar/day" className="rounded-md bg-blue-100 px-4 py-2 text-blue-800 font-medium hover:bg-blue-200 transition-colors">
                Day
              </Link>
              <Link href="/calendar/new-event" className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
                + New Event
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <Link
              href={`/calendar/week?date=${prevWeek}`}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Previous week"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">{formattedDateRange}</h2>
            <Link
              href={`/calendar/week?date=${nextWeek}`}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Next week"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Week view grid */}
          <div className="flex">
            {/* Time column */}
            <div className="w-20 flex-shrink-0 pr-4">
              <div className="h-16"></div> {/* Empty space for day headers */}
              {HOURS.map(hour => (
                <div key={hour} className="h-[60px] relative">
                  <span className="absolute -top-3 text-xs text-gray-500">
                    {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Day columns */}
            <div className="flex-grow grid grid-cols-7 divide-x divide-gray-200">
              {/* Day headers */}
              {weekDays.map((day, index) => (
                <div key={day.toString()} className="relative">
                  <div className="h-16 flex flex-col justify-center items-center border-b border-gray-200">
                    <div className="text-xs font-medium text-gray-500 mb-1">{format(day, "EEE")}</div>
                    <Link href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`}>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        isSameDay(day, new Date()) ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-900"
                      }`}>
                        {format(day, "d")}
                      </div>
                    </Link>
                  </div>
                  
                  {/* All day events */}
                  <div className="bg-gray-50 px-1 py-2 border-b border-gray-200">
                    {getDayEvents(day)
                      .filter(event => event.isAllDay)
                      .slice(0, 1)
                      .map(event => (
                        <button 
                          key={event.id} 
                          onClick={() => setSelectedEvent(event)}
                          className={`text-xs p-1 rounded-md w-full text-left truncate ${event.color} cursor-pointer hover:opacity-90 mb-1`}
                          title={event.title}
                        >
                          <div className="flex items-center">
                            <div className="w-1 h-4 rounded-full bg-current mr-1"></div>
                            <span className="truncate">{event.title}</span>
                          </div>
                        </button>
                      ))}
                    {getDayEvents(day).filter(event => event.isAllDay).length > 1 && (
                      <button 
                        onClick={() => router.push(`/calendar/day?date=${format(day, "yyyy-MM-dd")}`)}
                        className="text-xs text-gray-500 hover:text-gray-700 w-full text-left px-1"
                      >
                        + {getDayEvents(day).filter(event => event.isAllDay).length - 1} more
                      </button>
                    )}
                  </div>
                  
                  {/* Time grid */}
                  <div className="relative">
                    {HOURS.map(hour => (
                      <div key={hour} className="h-[60px] border-b border-gray-100"></div>
                    ))}
                    
                    {/* Current time indicator */}
                    {isSameDay(day, new Date()) && (
                      <div className="absolute left-0 right-0 flex items-center" style={{ 
                        top: `${(new Date().getHours() - 8 + new Date().getMinutes() / 60) * 60}px` 
                      }}>
                        <div className="w-1 h-1 rounded-full bg-red-500 ml-1"></div>
                        <div className="flex-grow h-[1px] bg-red-500 ml-1"></div>
                      </div>
                    )}
                    
                    {/* Time-based events */}
                    {getDayEvents(day)
                      .filter(event => !event.isAllDay)
                      .map(event => {
                        const { top, height } = getEventPosition(event);
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`absolute mx-1 rounded-md px-1 shadow-sm text-xs ${event.color} overflow-hidden cursor-pointer hover:opacity-90 border-l-2 border-current`}
                            style={{ 
                              top: `${top}px`, 
                              height: `${Math.max(height, 20)}px`,
                              left: '2px',
                              right: '2px'
                            }}
                            title={`${event.title}\n${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')}\n${event.description || ''}`}
                          >
                            <div className="font-medium truncate">
                              {event.title}
                            </div>
                            {height >= 30 && (
                              <div className="text-[10px] truncate opacity-75">
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
        
        {/* Filter section */}
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-grow">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Calendar Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">Work Events</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">Personal Events</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">Holidays</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">Birthdays</span>
              </label>
            </div>
            <div className="mt-6">
              <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Manage Categories...
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-grow">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Team Members</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">
                    A
                  </div>
                  <span className="text-gray-700">Alex Johnson</span>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 text-xs">
                    S
                  </div>
                  <span className="text-gray-700">Sarah Williams</span>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-xs">
                    J
                  </div>
                  <span className="text-gray-700">John Smith</span>
                </div>
              </label>
            </div>
            <div className="mt-6">
              <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Manage Team...
              </button>
            </div>
          </div>
        </div>
        
        {/* Upgrade banner */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-indigo-900">Team Calendar Features</h3>
              <p className="mt-2 text-indigo-800">Collaborate with your team more effectively with shared calendars.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Shared team availability view
                </li>
                <li className="flex items-center text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Meeting scheduling assistant
                </li>
                <li className="flex items-center text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Calendar permissions management
                </li>
              </ul>
            </div>
            <div className="mt-6 md:mt-0">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Upgrade to Team Plan
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}