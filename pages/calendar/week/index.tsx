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
import Head from "next/head";
import CalendarNavigation from '@/components/CalendarNavigation';
import EventModal from '@/components/EventModal';
import { Event } from '@/types/Event';

// Sample event data for week view
const createSampleWeekEvents = (weekStart: Date): Event[] => {
  const events: Event[] = [];
  
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
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
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
  const getDayEvents = (day: Date): Event[] => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Check if the event occurs on this day
      return isSameDay(day, eventStart) || isSameDay(day, eventEnd) ||
        (day >= eventStart && day <= eventEnd);
    });
  };

  // Position calculation for events
  const getEventPosition = (event: Event) => {
    const startHour = new Date(event.startDate).getHours() + (new Date(event.startDate).getMinutes() / 60);
    const endHour = new Date(event.endDate).getHours() + (new Date(event.endDate).getMinutes() / 60);
    const top = Math.max(0, (startHour - 8) * 60); // 8 AM is the start of our grid (0px)
    const height = Math.min(12 * 60, (endHour - startHour) * 60); // Cap at the bottom of our grid
    return { top, height };
  };

  const handleViewChange = (view: 'month' | 'week' | 'day') => {
    router.push(`/calendar${view === 'month' ? '' : `/${view}`}?date=${format(currentDate, 'yyyy-MM-dd')}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Head>
        <title>Week View - Calendar App</title>
      </Head>

      <CalendarNavigation
        currentView="week"
        onViewChange={handleViewChange}
        authUser={authUser}
        onLogout={logout}
      />

      <div style={{ 
        maxWidth: '100%', 
        width: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        opacity: pageReady ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        <div style={{ 
          borderRadius: '0.5rem', 
          backgroundColor: 'white', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <button
                onClick={() => {
                  const newDate = subWeeks(currentDate, 1);
                  router.push(`/calendar/week?date=${format(newDate, 'yyyy-MM-dd')}`);
                }}
                style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                &larr; Previous
              </button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                {format(startOfWeek(currentDate), 'MMMM d')} - {format(endOfWeek(currentDate), 'MMMM d, yyyy')}
              </h2>
              <button
                onClick={() => {
                  const newDate = addWeeks(currentDate, 1);
                  router.push(`/calendar/week?date=${format(newDate, 'yyyy-MM-dd')}`);
                }}
                style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Next &rarr;
              </button>
            </div>
            
            {/* Week view grid */}
            <div style={{ display: 'flex', marginTop: '1rem' }}>
              {/* Time column */}
              <div style={{ width: '4rem', paddingRight: '0.5rem', flexShrink: 0 }}>
                <div style={{ height: '3rem', borderBottom: '1px solid transparent' }}></div>
                {HOURS.map(hour => (
                  <div key={hour} style={{ height: '60px', fontSize: '0.75rem', color: '#6b7280', textAlign: 'right' }}>
                    {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid #e5e7eb' }}>
                {/* Day headers */}
                {weekDays.map((day, index) => (
                  <div key={day.toString()} style={{ textAlign: 'center' }}>
                    <div style={{ height: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{format(day, "EEE")}</div>
                      <Link href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`} style={{ textDecoration: 'none' }}>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: 500, 
                          color: '#111827',
                          ...(isSameDay(day, new Date()) ? {
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '9999px',
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          } : {})
                        }}>
                          {format(day, "d")}
                        </div>
                      </Link>
                    </div>
                    
                    {/* All day events */}
                    <div style={{ minHeight: '1.25rem', backgroundColor: '#f9fafb', padding: '0.25rem', borderBottom: '1px solid #e5e7eb' }}>
                      {getDayEvents(day)
                        .filter(event => event.isAllDay)
                        .slice(0, 1)
                        .map(event => (
                          <div 
                            key={event.id} 
                            onClick={() => setSelectedEvent(event)}
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.25rem', 
                              borderRadius: '0.25rem', 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              cursor: 'pointer',
                              backgroundColor: event.color?.split(' ')[0] || '#dbeafe',
                              color: event.color?.split(' ')[1] || '#1e40af',
                              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'scale(1.01)';
                              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                      {getDayEvents(day).filter(event => event.isAllDay).length > 1 && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', padding: '0 0.25rem' }}>
                          + {getDayEvents(day).filter(event => event.isAllDay).length - 1} more
                        </div>
                      )}
                    </div>
                    
                    {/* Time slots */}
                    <div style={{ position: 'relative' }}>
                      {HOURS.map(hour => (
                        <div key={hour} style={{ height: '60px', borderBottom: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}></div>
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
                              style={{ 
                                position: 'absolute',
                                top: `${top}px`, 
                                height: `${height}px`,
                                left: '0.125rem',
                                right: '0.125rem',
                                fontSize: '0.75rem',
                                borderRadius: '0.25rem',
                                padding: '0.25rem',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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
                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.zIndex = 'auto';
                              }}
                              title={`${event.title}\n${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')}\n${event.description || ''}`}
                            >
                              <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.title}
                              </div>
                              {height >= 30 && (
                                <div style={{ fontSize: '0.625rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
        </div>
        
        {/* Event Modal */}
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </div>
    </div>
  );
}