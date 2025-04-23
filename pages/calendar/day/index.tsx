// pages/calendar/day/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  format,
  addDays,
  subDays,
  parseISO,
  isSameDay
} from "date-fns";
import Head from "next/head";
import CalendarNavigation from '@/components/CalendarNavigation';
import EventModal from '@/components/EventModal';
import { Event } from '@/types/Event';

// Hours array for the day view
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

// Sample event data for day view
const createSampleDayEvents = (date: Date): Event[] => {
  const events: Event[] = [];
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

export default function DayView() {
  const router = useRouter();
  // Handle authentication errors gracefully
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const dateParam = router.query.date as string;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
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

  // Format dates for navigation
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const prevDay = format(subDays(currentDate, 1), "yyyy-MM-dd");
  const nextDay = format(addDays(currentDate, 1), "yyyy-MM-dd");

  // Event positioning helper
  const getEventPosition = (event: Event) => {
    const startHour = new Date(event.startDate).getHours() + (new Date(event.startDate).getMinutes() / 60);
    const endHour = new Date(event.endDate).getHours() + (new Date(event.endDate).getMinutes() / 60);
    const top = (startHour - 7) * 60; // 7 AM is the start of our grid (0px)
    const height = (endHour - startHour) * 60;
    return { top, height };
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const loadEvents = async () => {
    let loadedEvents: Event[] = [];
    
    if (authUser) {
      // ... existing code ...
    }
  };

  const handleCellClick = (startTime: Date) => {
    router.push({
      pathname: "/calendar/event",
      query: { 
        date: startTime.toISOString(),
        view: "day" 
      },
    });
  };

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    router.push(`/calendar${view === 'month' ? '' : `/${view}`}?date=${format(currentDate, 'yyyy-MM-dd')}`);
  };

  return (
    <div className="calendar-container">
      <Head>
        <title>Day View - Calendar App</title>
      </Head>

      <CalendarNavigation
        currentView="day"
        onViewChange={handleViewChange}
        authUser={authUser}
        onLogout={logout}
      />

      <div className="calendar-content" style={{ opacity: pageReady ? 1 : 0 }}>
        <div className="calendar-card">
          <div className="calendar-card-inner">
            {/* Date Navigation - Match the Month view style */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative' }}>
              <Link
                href={`/calendar/day?date=${prevDay}`}
                style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  &larr; Previous
                </span>
              </Link>
              <h2 className="date-heading">{formattedDate}</h2>
              <Link
                href={`/calendar/day?date=${nextDay}`}
                style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Next &rarr;
                </span>
              </Link>
              
              {/* Add New Event button for consistency */}
              <div style={{ position: 'absolute', right: '0', top: '-2rem' }}>
                <Link
                  href={{
                    pathname: "/calendar/event",
                    query: { date: currentDate.toISOString(), view: "day" }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#111827',
                    color: 'white',
                    borderRadius: '0.75rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
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

            {/* Day schedule view */}
            <div style={{ position: 'relative', marginTop: '1rem' }}>
              {/* Hour indicators */}
              <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
                {HOURS.map(hour => (
                  <div key={hour} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    height: '60px', 
                    borderTop: '1px solid #e5e7eb' 
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      marginTop: '-0.5rem', 
                      marginLeft: '-2.5rem', 
                      width: '2rem', 
                      paddingRight: '0.5rem', 
                      textAlign: 'right' 
                    }}>
                      {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Events */}
              <div style={{ position: 'absolute', top: 0, left: '3.5rem', right: '1rem' }}>
                {events.map(event => {
                  const { top, height } = getEventPosition(event);
                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      style={{ 
                        position: 'absolute',
                        top: `${top}px`, 
                        height: `${height}px`,
                        maxWidth: 'calc(100% - 8px)',
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        backgroundColor: event.color?.split(' ')[0] || '#dbeafe',
                        color: event.color?.split(' ')[1] || '#1e40af',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.zIndex = '10';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.zIndex = 'auto';
                      }}
                    >
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: '0.75rem' }}>
                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                      </div>
                      {height > 60 && event.location && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          📍 {event.location}
                        </div>
                      )}
                      {height > 80 && event.description && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {event.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}