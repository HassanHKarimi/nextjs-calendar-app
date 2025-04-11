// Fully functional calendar page (with auth required)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay } from 'date-fns';
import { EventModal } from "../../components/EventModal";
import { FilterPanel, FilterState } from "../../components/FilterPanel";
import { CalendarEvent } from "../../utils/seedEvents";

// Empty placeholder for when there are no events
const EMPTY_EVENTS: CalendarEvent[] = [];

export default function CalendarPage() {
  const router = useRouter();
  // State hooks - always declare ALL hooks unconditionally
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const dateParam = router.query.date as string | undefined;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(EMPTY_EVENTS);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(EMPTY_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);
  
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
            
            // Load seed events from session storage
            const userId = auth.user.id;
            const storedEvents = sessionStorage.getItem(`calendarEvents-${userId}`);
            
            if (storedEvents) {
              try {
                const parsedEvents = JSON.parse(storedEvents);
                setEvents(parsedEvents);
                setFilteredEvents(parsedEvents);
              } catch (error) {
                console.error('Error parsing stored events:', error);
                setEvents(EMPTY_EVENTS);
                setFilteredEvents(EMPTY_EVENTS);
              }
            } else {
              setEvents(EMPTY_EVENTS);
              setFilteredEvents(EMPTY_EVENTS);
            }
            
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

  // Effect to apply filters when they change
  useEffect(() => {
    if (!filters) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event => {
      // Check event type
      if (event.type && !filters.eventTypes[event.type]) {
        return false;
      }

      // Check tags
      if (event.tags && event.tags.length > 0) {
        const hasActiveTag = event.tags.some(tag => filters.tags[tag]);
        if (!hasActiveTag) {
          return false;
        }
      }

      // Check participants
      if (event.participants && event.participants.length > 0) {
        const hasActiveParticipant = event.participants.some(participant => 
          filters.participants[participant]
        );
        if (!hasActiveParticipant) {
          return false;
        }
      }

      // Date range checking would go here

      return true;
    });

    setFilteredEvents(filtered);
  }, [filters, events]);
  
  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('calendarAuth');
      router.push('/');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">Loading Calendar</h1>
        <p className="mt-4 text-gray-600">Please wait while we retrieve your events</p>
        <div className="mt-8 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Your Calendar</h1>
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
              <Link href="/calendar/day" className="rounded-md bg-blue-100 px-4 py-2 text-blue-800 font-medium hover:bg-blue-200 transition-colors">
                Day
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
            <div className="flex items-center">
              <Link
                href={`/calendar?date=${prevMonth}`}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors mr-2"
                aria-label="Previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h2 className="text-2xl font-bold text-gray-900">{formattedDate}</h2>
              <Link
                href={`/calendar?date=${nextMonth}`}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors ml-2"
                aria-label="Next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <button 
              onClick={() => setIsFilterPanelOpen(true)}
              className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
              {filters && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs">!</span>}
            </button>
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Day names */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="bg-gray-100 py-3 text-center text-sm font-medium text-gray-700"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day) => {
              // Get events for this day
              const dayEvents = filteredEvents.filter((event) => {
                const eventStart = new Date(event.startDate);
                const eventEnd = new Date(event.endDate);
                
                return (
                  (day >= eventStart && day <= eventEnd) ||
                  isSameDay(day, eventStart) ||
                  isSameDay(day, eventEnd)
                );
              });

              // Sort events - all day events first, then by start time
              dayEvents.sort((a, b) => {
                if (a.isAllDay && !b.isAllDay) return -1;
                if (!a.isAllDay && b.isAllDay) return 1;
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
              });

              return (
                <div
                  key={day.toString()}
                  className={`min-h-[130px] p-2 ${
                    !isSameMonth(day, currentDate) ? "bg-gray-50 text-gray-400" : "bg-white"
                  } ${isToday(day) ? "bg-blue-50" : ""}`}
                >
                  <div className="mb-2">
                    <Link
                      href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                        isToday(day) 
                          ? "bg-blue-600 text-white font-semibold" 
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {format(day, "d")}
                    </Link>
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[90px] scrollbar-thin">
                    {dayEvents.length > 0 && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`block w-full truncate rounded-md px-2 py-1 text-xs font-medium text-left ${event.color}`}
                            title={`${event.title}${event.isAllDay ? ' (All day)' : ` (${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')})`}\n${event.description || ''}`}
                          >
                            {event.isAllDay && (
                              <span className="inline-block w-2 h-2 rounded-full bg-current mr-1"></span>
                            )}
                            {!event.isAllDay && (
                              <span className="text-[10px] mr-1 font-normal opacity-75">
                                {format(new Date(event.startDate), "h:mm")}
                              </span>
                            )}
                            {event.title}
                          </button>
                        ))}
                        {dayEvents.length > 3 && (
                          <button 
                            onClick={() => router.push(`/calendar/day?date=${format(day, "yyyy-MM-dd")}`)}
                            className="w-full text-xs px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                          >
                            + {dayEvents.length - 3} more
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Event categories */}
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="text-sm font-medium text-gray-700 mr-2">Event Categories:</div>
            {/* Holidays */}
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-sm font-medium text-purple-800">
              <span className="w-2 h-2 rounded-full bg-purple-600 mr-1"></span>
              Holidays
            </span>
            {/* Observances */}
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span>
              Observances
            </span>
            {/* Meetings */}
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
              <span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span>
              Meetings
            </span>
            {/* Personal */}
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
              <span className="w-2 h-2 rounded-full bg-yellow-600 mr-1"></span>
              Personal
            </span>
            {/* Deadlines */}
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
              <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
              Deadlines
            </span>
          </div>
        </div>
        
        {/* Feature highlight */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reminders</h3>
            </div>
            <p className="text-gray-600 mb-4">Get notified before your events start.</p>
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Upgrade to access reminder notifications for your events.
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recurring Events</h3>
            </div>
            <p className="text-gray-600 mb-4">Set up repeating events on a regular schedule.</p>
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Upgrade to create daily, weekly, or monthly recurring events.
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Sharing</h3>
            </div>
            <p className="text-gray-600 mb-4">Share your calendar with friends, family, or coworkers.</p>
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              Upgrade to share your calendar with others.
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Calendar Pro includes reminders, recurring events, calendar sharing, and more.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Upgrade to Pro
          </button>
        </div>
      </main>
      
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      
      {/* Filter Panel */}
      {isFilterPanelOpen && (
        <FilterPanel 
          onFilterChange={handleFilterChange} 
          isOpen={isFilterPanelOpen} 
          onClose={() => setIsFilterPanelOpen(false)} 
        />
      )}
    </div>
  );
}