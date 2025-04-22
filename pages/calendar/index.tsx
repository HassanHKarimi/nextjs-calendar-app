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
  // State hooks - always declare ALL hooks unconditionally
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const dateParam = router.query.date as string | undefined;
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 17)); // April 17, 2025
  const [events, setEvents] = useState(SAMPLE_EVENTS);
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
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              {formattedDate}
            </h1>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>Logged in as:</span>
              <span style={{ fontWeight: 500, color: '#1f2937' }}>{authUser.name}</span>
              <button 
                onClick={logout}
                style={{
                  marginLeft: '1rem',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
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
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              href={`/calendar/month?date=${prevMonth}`}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                ...(router.pathname === '/calendar/month' && {
                  backgroundColor: '#3b82f6',
                  color: 'white'
                })
              }}
              onMouseOver={(e) => {
                if (router.pathname !== '/calendar/month') {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseOut={(e) => {
                if (router.pathname !== '/calendar/month') {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              Month View
            </Link>
          </div>
        </div>

        {/* Calendar content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Link
              href={`/calendar?date=${prevMonth}`}
              style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                &larr; Previous
              </span>
            </Link>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{formattedDate}</h2>
            <Link
              href={`/calendar?date=${nextMonth}`}
              style={{ color: '#111827', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Next &rarr;
              </span>
            </Link>
          </div>
          
          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%' }}>
            {/* Day names */}
            {weekDays.map((day) => (
              <div
                key={day}
                style={{ 
                  padding: '0.75rem 0', 
                  textAlign: 'center', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#4b5563' 
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            width: '100%',
            borderTop: '1px solid #e5e7eb'
          }}>
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
                height: '120px', 
                padding: '0.5rem',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: isToday(day) ? '#ebf5ff' : 
                                !isSameMonth(day, currentDate) ? '#f9fafb' : 'white',
                color: !isSameMonth(day, currentDate) ? '#9ca3af' : 'inherit',
                position: 'relative' as const
              };

              return (
                <div
                  key={day.toString()}
                  style={dayStyle}
                >
                  <div style={{ 
                    fontSize: isToday(day) ? '16px' : '14px', 
                    fontWeight: isToday(day) ? 'bold' : 'normal',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isToday(day) ? '24px' : 'auto',
                    height: isToday(day) ? '24px' : 'auto',
                    borderRadius: isToday(day) ? '50%' : '0',
                    backgroundColor: isToday(day) ? '#3b82f6' : 'transparent',
                    color: isToday(day) ? 'white' : 'inherit',
                    margin: isToday(day) ? '0 auto' : '0'
                  }}>
                    {format(day, "d")}
                  </div>

                  <div style={{ marginTop: '0.25rem', maxHeight: '80px', overflow: 'hidden' }}>
                    {dayEvents.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {dayEvents.slice(0, 3).map((event) => {
                          // Set event background colors based on event type/title
                          let bgColor = '#e8f0fe'; // Default light blue
                          let textColor = '#1e40af';
                          
                          if (event.title.includes('Client Meeting')) {
                            bgColor = '#e6f4ea'; // Light green
                            textColor = '#166534';
                          } else if (event.title.includes('Team Standup')) {
                            bgColor = '#fce8e6'; // Light red
                            textColor = '#991b1b';
                          } else if (event.title.includes('Project')) {
                            bgColor = '#fce8e6'; // Light red
                            textColor = '#991b1b';
                          } else if (event.title.includes('Design')) {
                            bgColor = '#f3e8fd'; // Light purple
                            textColor = '#86198f';
                          } else if (event.title.includes('1:1')) {
                            bgColor = '#e8f0fe'; // Light blue
                            textColor = '#1e40af';
                          } else if (event.title.includes('Review')) {
                            bgColor = '#fef7e0'; // Light yellow
                            textColor = '#854d0e';
                          } else if (event.title.includes('UI/UX')) {
                            bgColor = '#fef7e0'; // Light yellow
                            textColor = '#854d0e';
                          } else if (event.title.includes('Team Meeting')) {
                            bgColor = '#e8f0fe'; // Light blue
                            textColor = '#1e40af';
                          } else if (event.title.includes('Product')) {
                            bgColor = '#e8f0fe'; // Light blue
                            textColor = '#1e40af';
                          } else if (event.title.includes('API')) {
                            bgColor = '#f3e8fd'; // Light purple
                            textColor = '#6b21a8';
                          } else if (event.title.includes('Code')) {
                            bgColor = '#fef7e0'; // Light yellow
                            textColor = '#854d0e';
                          }
                          
                          return (
                            <div
                              key={event.id}
                              onClick={() => {
                                setSelectedEvent(event);
                              }}
                              style={{
                                display: 'block',
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderRadius: '6px',
                                padding: '0.25rem 0.5rem',
                                fontSize: '13px',
                                fontWeight: '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: bgColor,
                                color: textColor,
                                maxWidth: '100%',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                e.currentTarget.style.zIndex = '10';
                                e.currentTarget.style.position = 'relative';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                e.currentTarget.style.zIndex = 'auto';
                                e.currentTarget.style.position = 'static';
                              }}
                              title={`${event.title}${event.isAllDay ? ' (All day)' : ` (${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')})`}\n${event.description || ''}`}
                            >
                              {event.title.length > 18 ? `${event.title.substring(0, 18)}...` : event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div style={{ 
                            fontSize: '13px', 
                            color: '#6b7280', 
                            padding: '0.125rem 0.5rem',
                            textAlign: 'left'
                          }}>
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
      </div>
      
      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}