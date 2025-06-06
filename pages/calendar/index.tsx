// Fully functional calendar page (with auth required)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, subDays, addWeeks, subWeeks, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay } from 'date-fns';
import CleanEventModal from "../../components/CleanEventModal";
import MonthView from "../../components/MonthView";
import WeekView from "../../components/WeekView";
import DayView from "../../components/DayView";
import UserUtilityBar from "../../components/UserUtilityBar";
import { Event as BaseEvent, createSampleEvent } from "../../utils/event/event-utils";
import { Event } from "../../types/Event";

// Debug flag
const DEBUG = true;

// Log timestamp for debugging
const logWithTimestamp = (message: string, data?: any) => {
  if (!DEBUG) return;
  const now = new Date();
  const timestamp = now.toISOString().split('T')[1].split('.')[0] + '.' + now.getMilliseconds();
  console.log(`[${timestamp}] [CalendarPage] ${message}`, data || '');
};

// Sample event data - updated to match event-utils Event interface
const SAMPLE_EVENTS: BaseEvent[] = [
  {
    id: "event-1",
    title: "Client Meeting",
    description: "Meeting with client to discuss project requirements",
    start: new Date(2025, 3, 2, 10, 0), // April 2, 2025, 10:00 AM
    end: new Date(2025, 3, 2, 11, 30), // April 2, 2025, 11:30 AM
    location: "Conference Room A"
  },
  {
    id: "event-2", 
    title: "Team Standup",
    description: "Daily team standup meeting",
    start: new Date(2025, 3, 5, 9, 0), // April 5, 2025, 9:00 AM
    end: new Date(2025, 3, 5, 9, 30), // April 5, 2025, 9:30 AM
    location: "Main Office"
  },
  {
    id: "event-3",
    title: "Code Review",
    description: "Review new features and code changes",
    start: new Date(2025, 3, 8, 14, 0), // April 8, 2025, 2:00 PM
    end: new Date(2025, 3, 8, 15, 0), // April 8, 2025, 3:00 PM
    location: "Virtual"
  },
  {
    id: "event-4",
    title: "Team Meeting",
    description: "Weekly team sync-up",
    start: new Date(2025, 3, 12, 11, 0), // April 12, 2025, 11:00 AM
    end: new Date(2025, 3, 12, 12, 0), // April 12, 2025, 12:00 PM
    location: "Conference Room B"
  },
  {
    id: "event-5",
    title: "Product Launch",
    description: "Launch of new product features",
    start: new Date(2025, 3, 15, 9, 0), // April 15, 2025, 9:00 AM
    end: new Date(2025, 3, 15, 16, 0), // April 15, 2025, 4:00 PM
    location: "Main Conference Room"
  },
  {
    id: "event-6",
    title: "Project Review",
    description: "Review project progress and timeline",
    start: new Date(2025, 3, 17, 13, 0), // April 17, 2025, 1:00 PM
    end: new Date(2025, 3, 17, 15, 0), // April 17, 2025, 3:00 PM
    location: "Meeting Room 3"
  },
  {
    id: "event-7",
    title: "Project Deadline",
    description: "Final submission deadline",
    start: new Date(2025, 3, 19, 0, 0), // April 19, 2025, all day
    end: new Date(2025, 3, 19, 23, 59), // April 19, 2025, all day
    location: ""
  },
  {
    id: "event-8",
    title: "1:1 with Manager",
    description: "One-on-one meeting with manager",
    start: new Date(2025, 3, 22, 10, 0), // April 22, 2025, 10:00 AM
    end: new Date(2025, 3, 22, 10, 30), // April 22, 2025, 10:30 AM
    location: "Manager's Office"
  },
  {
    id: "event-9",
    title: "API Discussion",
    description: "Discussion about API design and implementation",
    start: new Date(2025, 3, 24, 14, 0), // April 24, 2025, 2:00 PM
    end: new Date(2025, 3, 24, 15, 30), // April 24, 2025, 3:30 PM
    location: "Virtual"
  },
  {
    id: "event-10",
    title: "UI/UX Workshop",
    description: "Workshop on UI/UX design principles",
    start: new Date(2025, 3, 26, 9, 0), // April 26, 2025, 9:00 AM
    end: new Date(2025, 3, 26, 12, 0), // April 26, 2025, 12:00 PM
    location: "Design Studio"
  },
  {
    id: "event-11",
    title: "Design Review",
    description: "Review of latest design changes",
    start: new Date(2025, 3, 29, 13, 0), // April 29, 2025, 1:00 PM
    end: new Date(2025, 3, 29, 14, 0), // April 29, 2025, 2:00 PM
    location: "Design Office"
  },
  {
    id: "event-12",
    title: "Client Meeting",
    description: "Follow-up meeting with client",
    start: new Date(2025, 4, 2, 11, 0), // May 2, 2025, 11:00 AM
    end: new Date(2025, 4, 2, 12, 30), // May 2, 2025, 12:30 PM
    location: "Conference Room A"
  }
];

export default function CalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const dateParam = router.query.date as string | undefined;
  const [dataLoading, setDataLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  
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

  // Use effect to load events from database
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { fetchEvents } = await import('../../utils/api/events');
        const dbEvents = await fetchEvents();
        setEvents(dbEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
        // Fallback to sample events if database fails
        setEvents(SAMPLE_EVENTS);
      }
    };
    
    if (authUser) {
      loadEvents();
    }
  }, [authUser]);

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

  // Show data loading state
  if (dataLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Loading...</h1>
        <p style={{ marginTop: '1rem' }}>Please wait while we retrieve your calendar</p>
      </div>
    );
  }

  // Handle event click
  const handleEventClick = (event: Event) => {
    logWithTimestamp('Event clicked', {
      eventId: event.id,
      eventTitle: event.title,
      hasSourceElement: !!(event as any).sourceElement
    });
    
    // Convert BaseEvent to Event with animation properties
    const eventWithAnimation: Event = {
      ...event,
      startDate: event.start,
      endDate: event.end,
      sourceElement: event.sourceElement,
      isAllDay: false
    };
    
    setSelectedEvent(eventWithAnimation);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300 ease-in-out" style={{ opacity: pageReady ? 1 : 0 }}>
      <div className="rounded-lg bg-white shadow-md overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="mb-6">
            {/* Mobile: Utility bar above title */}
            <div className="flex justify-end mb-4 sm:hidden">
              <UserUtilityBar 
                userName={authUser.name || 'User'} 
                onLogout={logout} 
              />
            </div>
            
            {/* Desktop: Title and utility bar side by side */}
            <div className="hidden sm:flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Your Calendar
              </h1>
              <UserUtilityBar 
                userName={authUser.name || 'User'} 
                onLogout={logout} 
              />
            </div>
            
            {/* Mobile: Title below utility bar */}
            <h1 className="text-2xl font-semibold text-gray-900 sm:hidden">
              Your Calendar
            </h1>
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
        <div className="p-3 sm:p-6">
          {currentView === 'month' && (
            <>
              {/* Month view navigation */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/calendar?date=${prevMonth}&view=month`}
                  className="text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="flex items-center">
                    &larr; Previous
                  </span>
                </Link>
                <h2 className="text-xl font-semibold">{formattedDate}</h2>
                <Link
                  href={`/calendar?date=${nextMonth}&view=month`}
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
                onEventClick={(event: any) => {
                  handleEventClick(event);
                }} 
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
                  onEventClick={(event: any) => {
                    handleEventClick(event);
                  }} 
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
                  onEventClick={(event: any) => {
                    handleEventClick(event);
                  }} 
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Event Modal */}
      {selectedEvent && (
        <CleanEventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          isOpen={!!selectedEvent} 
        />
      )}
    </div>
  );
}