// Fully functional calendar page (with auth required)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, subDays, addWeeks, subWeeks, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay } from 'date-fns';
import { EventModal } from "./utils/event-modal";
import MonthView from "../../components/MonthView";
import WeekView from "../../components/WeekView";
import DayView from "../../components/DayView";

// Sample event data
const SAMPLE_EVENTS = [
  {
    id: "event-1",
    title: "Client Meeting",
    description: "Meeting with client to discuss project requirements",
    startDate: new Date(2025, 3, 2, 10, 0), // April 2, 2025, 10:00 AM
    endDate: new Date(2025, 3, 2, 11, 30), // April 2, 2025, 11:30 AM
    location: "Conference Room A",
    isAllDay: false,
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    userId: "demo-user",
  },
  {
    id: "event-2", 
    title: "Team Standup",
    description: "Daily team standup meeting",
    startDate: new Date(2025, 3, 5, 9, 0), // April 5, 2025, 9:00 AM
    endDate: new Date(2025, 3, 5, 9, 30), // April 5, 2025, 9:30 AM
    location: "Main Office",
    isAllDay: false,
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    userId: "demo-user",
  },
  {
    id: "event-3",
    title: "Code Review",
    description: "Review new features and code changes",
    startDate: new Date(2025, 3, 8, 14, 0), // April 8, 2025, 2:00 PM
    endDate: new Date(2025, 3, 8, 15, 0), // April 8, 2025, 3:00 PM
    location: "Virtual",
    isAllDay: false,
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    userId: "demo-user",
  },
  {
    id: "event-4",
    title: "Team Meeting",
    description: "Weekly team sync-up",
    startDate: new Date(2025, 3, 12, 11, 0), // April 12, 2025, 11:00 AM
    endDate: new Date(2025, 3, 12, 12, 0), // April 12, 2025, 12:00 PM
    location: "Conference Room B",
    isAllDay: false,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    userId: "demo-user",
  },
  {
    id: "event-5",
    title: "Product Launch",
    description: "Launch of new product features",
    startDate: new Date(2025, 3, 15, 9, 0), // April 15, 2025, 9:00 AM
    endDate: new Date(2025, 3, 15, 16, 0), // April 15, 2025, 4:00 PM
    location: "Main Conference Room",
    isAllDay: false,
    color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    userId: "demo-user",
  },
  {
    id: "event-6",
    title: "Project Review",
    description: "Review project progress and timeline",
    startDate: new Date(2025, 3, 17, 13, 0), // April 17, 2025, 1:00 PM
    endDate: new Date(2025, 3, 17, 15, 0), // April 17, 2025, 3:00 PM
    location: "Meeting Room 3",
    isAllDay: false,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    userId: "demo-user",
  },
  {
    id: "event-7",
    title: "Project Deadline",
    description: "Final submission deadline",
    startDate: new Date(2025, 3, 19, 0, 0), // April 19, 2025, all day
    endDate: new Date(2025, 3, 19, 23, 59), // April 19, 2025, all day
    location: "",
    isAllDay: true,
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    userId: "demo-user",
  },
  {
    id: "event-8",
    title: "1:1 with Manager",
    description: "One-on-one meeting with manager",
    startDate: new Date(2025, 3, 22, 10, 0), // April 22, 2025, 10:00 AM
    endDate: new Date(2025, 3, 22, 10, 30), // April 22, 2025, 10:30 AM
    location: "Manager's Office",
    isAllDay: false,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    userId: "demo-user",
  },
  {
    id: "event-9",
    title: "API Discussion",
    description: "Discussion about API design and implementation",
    startDate: new Date(2025, 3, 24, 14, 0), // April 24, 2025, 2:00 PM
    endDate: new Date(2025, 3, 24, 15, 30), // April 24, 2025, 3:30 PM
    location: "Virtual",
    isAllDay: false,
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    userId: "demo-user",
  },
  {
    id: "event-10",
    title: "UI/UX Workshop",
    description: "Workshop on UI/UX design principles",
    startDate: new Date(2025, 3, 26, 9, 0), // April 26, 2025, 9:00 AM
    endDate: new Date(2025, 3, 26, 12, 0), // April 26, 2025, 12:00 PM
    location: "Design Studio",
    isAllDay: false,
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    userId: "demo-user",
  },
  {
    id: "event-11",
    title: "Design Review",
    description: "Review of latest design changes",
    startDate: new Date(2025, 3, 29, 13, 0), // April 29, 2025, 1:00 PM
    endDate: new Date(2025, 3, 29, 14, 0), // April 29, 2025, 2:00 PM
    location: "Design Office",
    isAllDay: false,
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    userId: "demo-user",
  },
  {
    id: "event-12",
    title: "Client Meeting",
    description: "Follow-up meeting with client",
    startDate: new Date(2025, 4, 2, 11, 0), // May 2, 2025, 11:00 AM
    endDate: new Date(2025, 4, 2, 12, 30), // May 2, 2025, 12:30 PM
    location: "Conference Room A",
    isAllDay: false,
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    userId: "demo-user",
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

  return (
    <div style={{ 
      width: '1200px', 
      margin: '0 auto', 
      padding: '2rem 1rem',
      opacity: pageReady ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <div style={{ 
        borderRadius: '1rem', 
        backgroundColor: 'white', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        {/* Calendar Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 600, 
              color: '#1f2937'
            }}>
              Your Calendar
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Logged in as <span style={{ fontWeight: 500, color: '#1f2937' }}>{authUser.name}</span>
              </span>
              <button 
                onClick={logout}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#ef4444',
                  backgroundColor: '#fee2e2',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
              >
                Logout
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#f3f4f6',
              borderRadius: '16px',
              padding: '4px'
            }}>
              <button 
                onClick={() => handleViewChange('month')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: currentView === 'month' ? '#111827' : 'transparent',
                  color: currentView === 'month' ? 'white' : '#111827',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: currentView === 'week' ? '#111827' : 'transparent',
                  color: currentView === 'week' ? 'white' : '#111827',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: currentView === 'day' ? '#111827' : 'transparent',
                  color: currentView === 'day' ? 'white' : '#111827',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#111827',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
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
        <div style={{ padding: '1.5rem' }}>
          {currentView === 'month' && (
            <>
              {/* Month view navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link
                  href={`/calendar?date=${prevMonth}&view=month`}
                  style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    &larr; Previous
                  </span>
                </Link>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{formattedDate}</h2>
                <Link
                  href={`/calendar?date=${nextMonth}&view=month`}
                  style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Next &rarr;
                  </span>
                </Link>
              </div>
              
              {/* Use the MonthView component */}
              <MonthView 
                currentDate={currentDate} 
                events={events} 
                onEventClick={(event) => setSelectedEvent(event)} 
              />
            </>
          )}

          {currentView === 'week' && (
            <>
              {/* Week view navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link
                  href={`/calendar?date=${format(subWeeks(currentDate, 1), 'yyyy-MM-dd')}&view=week`}
                  style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    &larr; Previous
                  </span>
                </Link>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  {format(startOfWeek(currentDate), "MMM d")} - {format(endOfWeek(currentDate), "MMM d, yyyy")}
                </h2>
                <Link
                  href={`/calendar?date=${format(addWeeks(currentDate, 1), 'yyyy-MM-dd')}&view=week`}
                  style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Next &rarr;
                  </span>
                </Link>
              </div>
              
              {/* Use the WeekView component */}
              <WeekView 
                currentDate={currentDate} 
                events={events} 
                onEventClick={(event) => setSelectedEvent(event)} 
              />
            </>
          )}

          {currentView === 'day' && (
            <>
              {/* Day view navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Link
                  href={`/calendar?date=${format(subDays(currentDate, 1), 'yyyy-MM-dd')}&view=day`}
                  style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    &larr; Previous
                  </span>
                </Link>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
                <Link
                  href={`/calendar?date=${format(addDays(currentDate, 1), 'yyyy-MM-dd')}&view=day`}
                  style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Next &rarr;
                  </span>
                </Link>
              </div>
              
              {/* Use the DayView component */}
              <DayView 
                currentDate={currentDate} 
                events={events} 
                onEventClick={(event) => setSelectedEvent(event)} 
              />
            </>
          )}
        </div>
      </div>
      
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}