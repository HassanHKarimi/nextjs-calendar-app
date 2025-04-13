// Fully functional calendar page (with auth required)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, addDays, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, isSameDay } from 'date-fns';
import { EventModal } from "./utils/event-modal";

// Sample event data
const SAMPLE_EVENTS = [
  {
    id: "event-1",
    title: "Team Meeting",
    description: "Weekly team meeting to discuss project progress",
    startDate: new Date(new Date().setHours(10, 0, 0, 0)),
    endDate: new Date(new Date().setHours(11, 0, 0, 0)),
    location: "Conference Room A",
    isAllDay: false,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    userId: "demo-user",
  },
  {
    id: "event-2", 
    title: "Product Launch",
    description: "Launch of the new calendar feature",
    startDate: new Date(),
    endDate: new Date(),
    isAllDay: true,
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    userId: "demo-user",
  },
  {
    id: "event-3",
    title: "Project Deadline",
    description: "Final submission deadline for the calendar project",
    startDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    isAllDay: true,
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    userId: "demo-user",
  }
];

// Add a few more events to make the calendar look more populated
for (let i = 1; i <= 10; i++) {
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 28) - 7);
  
  const startHour = 9 + Math.floor(Math.random() * 8);
  const duration = 1 + Math.floor(Math.random() * 3);
  
  const startTime = new Date(eventDate);
  startTime.setHours(startHour, 0, 0, 0);
  
  const endTime = new Date(eventDate);
  endTime.setHours(startHour + duration, 0, 0, 0);
  
  const titles = [
    "Team Standup", 
    "Client Meeting", 
    "Design Review", 
    "Code Review", 
    "Planning Session",
    "Sprint Demo",
    "1:1 with Manager",
    "Project Review",
    "API Discussion",
    "UI/UX Workshop"
  ];
  
  const colors = [
    "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "bg-green-100 text-green-800 hover:bg-green-200",
    "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "bg-red-100 text-red-800 hover:bg-red-200",
    "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
  ];
  
  SAMPLE_EVENTS.push({
    id: `event-${i + 3}`,
    title: titles[i % titles.length],
    description: `Description for ${titles[i % titles.length]}`,
    startDate: startTime,
    endDate: endTime,
    isAllDay: Math.random() > 0.8,  // 20% chance of all-day event
    color: colors[i % colors.length],
    userId: "demo-user"
  });
}

export default function CalendarPage() {
  const router = useRouter();
  // State hooks - always declare ALL hooks unconditionally
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const dateParam = router.query.date as string | undefined;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(SAMPLE_EVENTS);
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Your Calendar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              Logged in as <span style={{ fontWeight: '500' }}>{authUser?.name || 'User'}</span>
            </div>
            <button 
              onClick={logout}
              style={{ fontSize: '0.875rem', color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Logout
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/calendar/day"
              style={{ borderRadius: '0.25rem', backgroundColor: '#2563eb', padding: '0.5rem 1rem', color: 'white', textDecoration: 'none' }}
            >
              Day View
            </Link>
            <Link
              href="/calendar/week"
              style={{ borderRadius: '0.25rem', backgroundColor: '#2563eb', padding: '0.5rem 1rem', color: 'white', textDecoration: 'none' }}
            >
              Week View
            </Link>
            <Link
              href="/calendar/new-event"
              style={{ borderRadius: '0.25rem', backgroundColor: '#16a34a', padding: '0.5rem 1rem', color: 'white', textDecoration: 'none' }}
            >
              New Event
            </Link>
          </div>
        </div>
      </header>

      <div style={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: 'white', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <Link
            href={`/calendar?date=${prevMonth}`}
            style={{ borderRadius: '0.25rem', backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', textDecoration: 'none', color: '#111827' }}
          >
            &larr; Previous
          </Link>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{formattedDate}</h2>
          <Link
            href={`/calendar?date=${nextMonth}`}
            style={{ borderRadius: '0.25rem', backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', textDecoration: 'none', color: '#111827' }}
          >
            Next &rarr;
          </Link>
        </div>
        
        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e5e7eb' }}>
          {/* Day names */}
          {weekDays.map((day) => (
            <div
              key={day}
              style={{ padding: '0.5rem 0', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563' }}
            >
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid #e5e7eb' }}>
          {days.map((day) => {
            // Get events for this day
            const dayEvents = events.filter((event) => {
              const eventStart = new Date(event.startDate);
              const eventEnd = new Date(event.endDate);
              
              return (
                (day >= eventStart && day <= eventEnd) ||
                isSameDay(day, eventStart) ||
                isSameDay(day, eventEnd)
              );
            });

            // Style based on month and current day
            const dayStyle = {
              minHeight: '120px', 
              padding: '0.5rem',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: isToday(day) ? '#ebf5ff' : 
                              !isSameMonth(day, currentDate) ? '#f9fafb' : 'white',
              color: !isSameMonth(day, currentDate) ? '#9ca3af' : 'inherit'
            };

            return (
              <div
                key={day.toString()}
                style={dayStyle}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Link
                    href={`/calendar/day?date=${format(day, "yyyy-MM-dd")}`}
                    style={{ 
                      display: 'inline-flex',
                      height: '2rem',
                      width: '2rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      ...(isToday(day) ? { backgroundColor: '#3b82f6', color: 'white', fontWeight: '600' } : {})
                    }}
                  >
                    {format(day, "d")}
                  </Link>
                </div>

                <div style={{ marginTop: '0.25rem', maxHeight: '80px', overflow: 'auto' }}>
                  {dayEvents.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {dayEvents.slice(0, 3).map((event) => {
                        // Convert Tailwind color classes to inline styles
                        let eventStyle = {
                          display: 'block',
                          width: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          borderRadius: '0.125rem',
                          padding: '0.125rem 0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: 'none',
                          backgroundColor: '#dbeafe', // Default blue
                          color: '#1e40af'
                        };
                        
                        // Map color classes to inline styles
                        if (event.color.includes('green')) {
                          eventStyle.backgroundColor = '#dcfce7';
                          eventStyle.color = '#166534';
                        } else if (event.color.includes('red')) {
                          eventStyle.backgroundColor = '#fee2e2';
                          eventStyle.color = '#b91c1c';
                        } else if (event.color.includes('yellow')) {
                          eventStyle.backgroundColor = '#fef9c3';
                          eventStyle.color = '#854d0e';
                        } else if (event.color.includes('purple')) {
                          eventStyle.backgroundColor = '#f3e8ff';
                          eventStyle.color = '#6b21a8';
                        } else if (event.color.includes('indigo')) {
                          eventStyle.backgroundColor = '#e0e7ff';
                          eventStyle.color = '#3730a3';
                        }
                        
                        return (
                          <button
                            key={event.id}
                            onClick={() => {
                              console.log("Event clicked:", event);
                              alert(`Opening event: ${event.title}`);
                              setSelectedEvent(event);
                            }}
                            style={eventStyle}
                            title={`${event.title}${event.isAllDay ? ' (All day)' : ` (${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')})`}\n${event.description || ''}`}
                          >
                            {event.title}
                          </button>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div style={{ padding: '0 0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                          + {dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
        <p>This is a demo calendar with sample events. Click on a day to view detailed schedule.</p>
        <p style={{ marginTop: '0.5rem' }}>Logged in as: <span style={{ fontWeight: '600' }}>{authUser?.email || 'user@example.com'}</span></p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            backgroundColor: '#fffbeb', 
            borderLeftWidth: '4px', 
            borderLeftColor: '#fbbf24', 
            padding: '1rem', 
            maxWidth: '28rem' 
          }}>
            <div style={{ display: 'flex' }}>
              <div style={{ marginLeft: '0.75rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#854d0e' }}>Premium Features</h3>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#a16207' }}>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }}>
                    <li style={{ marginBottom: '0.25rem' }}>Event sharing - <span style={{ fontWeight: '600' }}>Requires Upgrade</span></li>
                    <li style={{ marginBottom: '0.25rem' }}>Recurring events - <span style={{ fontWeight: '600' }}>Requires Upgrade</span></li>
                    <li style={{ marginBottom: '0.25rem' }}>Calendar integrations - <span style={{ fontWeight: '600' }}>Requires Upgrade</span></li>
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