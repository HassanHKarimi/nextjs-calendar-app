// pages/calendar/day/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";
import { EventModal } from "../utils/event-modal";

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

  // Add an all-day event
  events.push({
    id: "day-event-all-day",
    title: "Company Holiday",
    description: "Office closed for company-wide holiday",
    startDate: new Date(date),
    endDate: new Date(date),
    isAllDay: true,
    color: "bg-indigo-100 text-indigo-800",
  });
  
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

  // Format dates for navigation
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const prevDay = format(subDays(currentDate, 1), "yyyy-MM-dd");
  const nextDay = format(addDays(currentDate, 1), "yyyy-MM-dd");

  // Separate all-day events
  const allDayEvents = events.filter(event => event.isAllDay);
  const timeEvents = events.filter(event => !event.isAllDay);

  // Event positioning helper
  const getEventPosition = (event: any) => {
    const startHour = new Date(event.startDate).getHours() + (new Date(event.startDate).getMinutes() / 60);
    const endHour = new Date(event.endDate).getHours() + (new Date(event.endDate).getMinutes() / 60);
    const top = (startHour - 7) * 60; // 7 AM is the start of our grid (0px)
    const height = (endHour - startHour) * 60;
    return { top, height };
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Daily Calendar</h1>
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
              <Link href="/calendar/week" className="rounded-md bg-blue-100 px-4 py-2 text-blue-800 font-medium hover:bg-blue-200 transition-colors">
                Week
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
              href={`/calendar/day?date=${prevDay}`}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Previous day"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">{formattedDate}</h2>
            <Link
              href={`/calendar/day?date=${nextDay}`}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Next day"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* All-day events section */}
          {allDayEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">ALL DAY</h3>
              <div className="space-y-2">
                {allDayEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left p-3 rounded-lg ${event.color} hover:opacity-90 transition-opacity flex items-center`}
                  >
                    <div className="w-2 h-6 rounded-full bg-current mr-3"></div>
                    <span className="font-medium">{event.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Day schedule view */}
          <div className="flex">
            {/* Time column */}
            <div className="w-20 flex-shrink-0 pr-4">
              {HOURS.map(hour => (
                <div key={hour} className="h-[60px] relative">
                  <span className="absolute -top-3 text-xs text-gray-500">
                    {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Events column */}
            <div className="flex-grow relative">
              {/* Hour grid lines */}
              {HOURS.map(hour => (
                <div key={hour} className="h-[60px] border-t border-gray-200"></div>
              ))}
              
              {/* Current time indicator */}
              {isSameDay(currentDate, new Date()) && (
                <div className="absolute left-0 right-0 flex items-center" style={{ 
                  top: `${(new Date().getHours() - 7 + new Date().getMinutes() / 60) * 60}px` 
                }}>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="flex-grow h-[1px] bg-red-500"></div>
                </div>
              )}
              
              {/* Events */}
              {timeEvents.map(event => {
                const { top, height } = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`absolute left-0 right-0 mx-1 rounded-lg p-2 shadow-sm ${event.color} hover:opacity-90 transition-opacity overflow-hidden cursor-pointer border-l-4 border-current`}
                    style={{ 
                      top: `${top}px`, 
                      height: `${height}px`,
                    }}
                  >
                    <div className="font-medium text-sm">
                      {event.title}
                    </div>
                    <div className="text-xs opacity-75">
                      {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                    </div>
                    {height > 60 && event.location && (
                      <div className="text-xs mt-1 opacity-75">
                        {event.location}
                      </div>
                    )}
                    {height > 80 && event.description && (
                      <div className="text-xs mt-1 line-clamp-2 opacity-75">
                        {event.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button className="flex items-center justify-center gap-2 bg-white rounded-lg border border-gray-200 shadow-sm py-4 px-6 text-gray-700 hover:bg-gray-50 transition-colors flex-grow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Schedule Meeting</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 bg-white rounded-lg border border-gray-200 shadow-sm py-4 px-6 text-gray-700 hover:bg-gray-50 transition-colors flex-grow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Create Recurring Event</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 bg-white rounded-lg border border-gray-200 shadow-sm py-4 px-6 text-gray-700 hover:bg-gray-50 transition-colors flex-grow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Invite Participants</span>
          </button>
        </div>
        
        {/* Upgrade prompt */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-900">Calendar Pro Features</h3>
              <p className="mt-2 text-blue-800">Unlock advanced features like reminders, recurring events, and more.</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Email and SMS notifications
                </li>
                <li className="flex items-center text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Time blocking and focus mode
                </li>
                <li className="flex items-center text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Full day schedule export
                </li>
              </ul>
            </div>
            <div className="mt-6 md:mt-0">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Upgrade Now
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