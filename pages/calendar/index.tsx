// Fully functional calendar page (with auth required)
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, subDays, addWeeks, subWeeks, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay } from 'date-fns';
import EventModal from "../../components/EventModal";
import MonthView from "../../components/MonthView";
import WeekView from "../../components/WeekView";
import DayView from "../../components/DayView";
import { Event } from "../../utils/event/event-utils";
import { SAMPLE_EVENTS } from "../../utils/event/sample-events";

export default function CalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const dateParam = router.query.date as string | undefined;
  const [dataLoading, setDataLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const eventRefs = useRef<{ [key: string]: any }>({});
  
  // Handle view changes
  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    setCurrentView(view);
    
    // Update the URL
    router.push({
      pathname: '/calendar',
      query: { 
        date: format(currentDate, 'yyyy-MM-dd'),
        view 
      }
    }, undefined, { shallow: true });
  };

  // Use effect to sync view with URL
  useEffect(() => {
    const view = router.query.view as string;
    if (view && ['month', 'week', 'day'].includes(view)) {
      setCurrentView(view as 'month' | 'week' | 'day');
    }
  }, [router.query.view]);

  // Use effect to load events
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use the sample events
    setEvents(SAMPLE_EVENTS);
  }, []);

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
  
  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        // Get view from URL or use default
        const viewParam = router.query.view as 'month' | 'week' | 'day' | undefined;
        if (viewParam && ['month', 'week', 'day'].includes(viewParam)) {
          setCurrentView(viewParam as 'month' | 'week' | 'day');
        }

        // Parse date from URL or use default
        if (dateParam) {
          try {
            const date = new Date(dateParam);
            if (!isNaN(date.getTime())) {
              setCurrentDate(date);
            }
          } catch {
            // If date parsing fails, use default date
            setCurrentDate(new Date(2025, 3, 17)); // April 17, 2025
          }
        }

        // Simulate loading time for data
        const timer = setTimeout(() => {
          setDataLoading(false);
          // Add a small delay before showing the page for smooth transition
          setTimeout(() => setPageReady(true), 100);
        }, 300);
        return () => clearTimeout(timer);
      } catch (e) {
        console.error("Auth check error:", e);
        router.push('/');
      }
    }
    checkAuth();
  }, [router]);
  
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Loading...</h2>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            borderRadius: '50%',
            border: '4px solid #3b82f6', 
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
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

  const handleEventClick = (event: Event, clickEvent: React.MouseEvent) => {
    setSelectedEvent(event);
    setSelectedEventId(event.id);
    const eventRefObj = eventRefs.current[event.id];
    const node = eventRefObj?.node as HTMLElement | null;
    if (node) {
      const rect = node.getBoundingClientRect();
      setModalPosition({ x: rect.left, y: rect.top });
    } else {
      // fallback: use clickEvent position (less accurate)
      setModalPosition({ x: clickEvent.clientX, y: clickEvent.clientY });
    }
  };

  // Show data loading state
  if (dataLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Loading...</h1>
        <p style={{ marginTop: '1rem' }}>Please wait while we retrieve your calendar</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300 ease-in-out" style={{ opacity: pageReady ? 1 : 0 }}>
      <div className="rounded-lg bg-white shadow-md overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              Your Calendar
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Logged in as <span className="font-medium text-gray-900">{authUser.name}</span>
              </span>
              <button 
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 bg-red-100 rounded-md transition-colors hover:bg-red-200"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button 
                onClick={() => handleViewChange('month')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-none text-sm font-medium transition-colors ${
                  currentView === 'month' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-transparent text-gray-900'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Month
              </button>
              <button 
                onClick={() => handleViewChange('week')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-none text-sm font-medium transition-colors ${
                  currentView === 'week' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-transparent text-gray-900'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Week
              </button>
              <button 
                onClick={() => handleViewChange('day')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-none text-sm font-medium transition-colors ${
                  currentView === 'day' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-transparent text-gray-900'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Day
              </button>
            </div>

            <Link 
              href="/calendar/new-event"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Event
            </Link>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="p-6">
          {currentView === 'month' && (
            <>
              {/* Month view navigation */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/calendar?date=${format(subMonths(currentDate, 1), 'yyyy-MM-dd')}&view=month`}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    &larr; Previous
                  </span>
                </Link>
                <h2 className="text-xl font-semibold">{formattedDate}</h2>
                <Link
                  href={`/calendar?date=${format(addMonths(currentDate, 1), 'yyyy-MM-dd')}&view=month`}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    Next &rarr;
                  </span>
                </Link>
              </div>
              
              {/* Use the MonthView component */}
              <MonthView 
                currentDate={currentDate} 
                events={events} 
                onEventClick={(event, clickEvent) => handleEventClick(event, clickEvent)} 
                eventRefs={eventRefs}
              />
            </>
          )}

          {currentView === 'week' && (
            <>
              {/* Week view navigation */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/calendar?date=${format(subWeeks(currentDate, 1), 'yyyy-MM-dd')}&view=week`}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    &larr; Previous
                  </span>
                </Link>
                <h2 className="text-xl font-semibold">
                  {format(startOfWeek(currentDate), "MMM d")} - {format(endOfWeek(currentDate), "MMM d, yyyy")}
                </h2>
                <Link
                  href={`/calendar?date=${format(addWeeks(currentDate, 1), 'yyyy-MM-dd')}&view=week`}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    Next &rarr;
                  </span>
                </Link>
              </div>
              
              {/* Use the WeekView component */}
              <div className="overflow-x-auto">
                <WeekView 
                  currentDate={currentDate} 
                  events={events} 
                  onEventClick={(event, clickEvent) => handleEventClick(event, clickEvent)} 
                />
              </div>
            </>
          )}

          {currentView === 'day' && (
            <>
              {/* Day view navigation */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/calendar?date=${format(subDays(currentDate, 1), 'yyyy-MM-dd')}&view=day`}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    &larr; Previous
                  </span>
                </Link>
                <h2 className="text-xl font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
                <Link
                  href={`/calendar?date=${format(addDays(currentDate, 1), 'yyyy-MM-dd')}&view=day`}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    Next &rarr;
                  </span>
                </Link>
              </div>
              
              {/* Use the DayView component */}
              <div className="overflow-x-auto">
                <DayView 
                  currentDate={currentDate} 
                  events={events} 
                  onEventClick={(event, clickEvent) => handleEventClick(event, clickEvent)} 
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => {
            setSelectedEvent(null);
            setSelectedEventId(null);
          }} 
          position={modalPosition}
          layoutId={selectedEventId ? `event-${format(selectedEvent.start, 'yyyy-MM-dd')}-${selectedEventId}` : undefined}
        />
      )}
    </div>
  );
}