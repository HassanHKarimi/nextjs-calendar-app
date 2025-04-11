// utils/seedEvents.ts

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  location?: string;
  isAllDay?: boolean;
  type?: string;
  color: string;
  tags?: string[];
  participants?: string[];
  userId: string;
}

// Mock data for the calendar
export const generateSeedEvents = (userId: string): CalendarEvent[] => {
  // Current date for reference
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  // Helper to create Date objects for this month
  const createDate = (day: number, hour: number = 0, minute: number = 0): Date => {
    return new Date(year, month, day, hour, minute);
  };
  
  // Helper to create event IDs
  const createId = (): string => {
    return Math.random().toString(36).substring(2, 11);
  };
  
  // Generate events
  const events: CalendarEvent[] = [
    // Work meetings
    {
      id: createId(),
      title: "Team Stand-up",
      description: "Daily team sync meeting to discuss progress and blockers",
      startDate: createDate(today.getDate(), 9, 30),
      endDate: createDate(today.getDate(), 10, 0),
      location: "Conference Room A",
      type: "meeting",
      color: "bg-blue-600 text-white",
      tags: ["work", "important"],
      participants: ["alex.johnson", "sarah.williams", "john.smith"],
      userId
    },
    {
      id: createId(),
      title: "Project Planning",
      description: "Quarterly planning session for the Q3 product roadmap",
      startDate: createDate(today.getDate() + 2, 13, 0),
      endDate: createDate(today.getDate() + 2, 15, 0),
      location: "Main Conference Room",
      type: "meeting",
      color: "bg-blue-600 text-white",
      tags: ["work", "planning"],
      participants: ["alex.johnson", "sarah.williams"],
      userId
    },
    {
      id: createId(),
      title: "Client Presentation",
      description: "Present the new dashboard design to the client",
      startDate: createDate(today.getDate() + 5, 11, 0),
      endDate: createDate(today.getDate() + 5, 12, 30),
      location: "Client Office",
      type: "meeting",
      color: "bg-blue-600 text-white",
      tags: ["work", "client"],
      participants: ["alex.johnson", "john.smith"],
      userId
    },
    
    // Personal events
    {
      id: createId(),
      title: "Dentist Appointment",
      description: "Regular check-up",
      startDate: createDate(today.getDate() + 1, 14, 0),
      endDate: createDate(today.getDate() + 1, 15, 0),
      location: "Dental Clinic",
      type: "appointment",
      color: "bg-yellow-600 text-white",
      tags: ["personal", "health"],
      participants: [],
      userId
    },
    {
      id: createId(),
      title: "Gym Session",
      description: "Weekly workout routine",
      startDate: createDate(today.getDate() + 3, 18, 0),
      endDate: createDate(today.getDate() + 3, 19, 30),
      location: "Local Gym",
      type: "personal",
      color: "bg-green-600 text-white",
      tags: ["personal", "health"],
      participants: [],
      userId
    },
    
    // Holidays and special days
    {
      id: createId(),
      title: "Independence Day",
      startDate: createDate(4, 0, 0), // July 4th, all day
      endDate: createDate(4, 23, 59),
      isAllDay: true,
      type: "holiday",
      color: "bg-purple-600 text-white",
      tags: ["holiday"],
      participants: [],
      userId
    },
    {
      id: createId(),
      title: "Company Offsite",
      description: "Annual team building retreat",
      startDate: createDate(today.getDate() + 10, 0, 0),
      endDate: createDate(today.getDate() + 12, 23, 59),
      isAllDay: true,
      location: "Mountain Resort",
      type: "event",
      color: "bg-indigo-600 text-white",
      tags: ["work", "important"],
      participants: ["alex.johnson", "sarah.williams", "john.smith"],
      userId
    },
    
    // Reminders and tasks
    {
      id: createId(),
      title: "Submit Quarterly Report",
      description: "Deadline for Q2 financial report",
      startDate: createDate(today.getDate() + 7, 0, 0),
      endDate: createDate(today.getDate() + 7, 23, 59),
      isAllDay: true,
      type: "reminder",
      color: "bg-red-600 text-white",
      tags: ["work", "deadline"],
      participants: [],
      userId
    },
    {
      id: createId(),
      title: "Pay Rent",
      startDate: createDate(1, 0, 0), // 1st of the month
      endDate: createDate(1, 23, 59),
      isAllDay: true,
      type: "reminder",
      color: "bg-red-600 text-white",
      tags: ["personal", "finance"],
      participants: [],
      userId
    },
    
    // Additional events to fill the calendar
    {
      id: createId(),
      title: "Birthday Party",
      description: "Sarah's surprise birthday celebration",
      startDate: createDate(today.getDate() + 15, 19, 0),
      endDate: createDate(today.getDate() + 15, 22, 0),
      location: "Riverside Restaurant",
      type: "event",
      color: "bg-pink-600 text-white",
      tags: ["personal", "celebration"],
      participants: ["sarah.williams"],
      userId
    },
    {
      id: createId(),
      title: "Flight to New York",
      description: "Business trip for client meeting",
      startDate: createDate(today.getDate() + 20, 8, 45),
      endDate: createDate(today.getDate() + 20, 12, 30),
      location: "Airport",
      type: "travel",
      color: "bg-blue-600 text-white",
      tags: ["work", "travel"],
      participants: [],
      userId
    },
    {
      id: createId(),
      title: "Virtual Conference",
      description: "Annual tech conference with keynote speakers",
      startDate: createDate(today.getDate() - 2, 9, 0),
      endDate: createDate(today.getDate() - 2, 17, 0),
      location: "Online",
      type: "meeting",
      color: "bg-teal-600 text-white",
      tags: ["work", "learning"],
      participants: [],
      userId
    }
  ];
  
  return events;
};

// Function to store events in session storage
export const storeSeedEvents = (userId: string): void => {
  if (typeof window !== 'undefined') {
    // Check if we already have events stored
    const existing = sessionStorage.getItem(`calendarEvents-${userId}`);
    
    if (!existing) {
      const events = generateSeedEvents(userId);
      sessionStorage.setItem(`calendarEvents-${userId}`, JSON.stringify(events));
    }
  }
};

// Function to get stored events
export const getStoredEvents = (userId: string): CalendarEvent[] => {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(`calendarEvents-${userId}`);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored events:', error);
      }
    }
  }
  
  return [];
};

// Function to add new event
export const addEvent = (event: CalendarEvent): void => {
  if (typeof window !== 'undefined' && event.userId) {
    const stored = getStoredEvents(event.userId);
    const updated = [...stored, event];
    
    sessionStorage.setItem(`calendarEvents-${event.userId}`, JSON.stringify(updated));
  }
};

// Function to update existing event
export const updateEvent = (event: CalendarEvent): void => {
  if (typeof window !== 'undefined' && event.userId) {
    const stored = getStoredEvents(event.userId);
    const updated = stored.map(e => e.id === event.id ? event : e);
    
    sessionStorage.setItem(`calendarEvents-${event.userId}`, JSON.stringify(updated));
  }
};

// Function to delete event
export const deleteEvent = (eventId: string, userId: string): void => {
  if (typeof window !== 'undefined') {
    const stored = getStoredEvents(userId);
    const updated = stored.filter(e => e.id !== eventId);
    
    sessionStorage.setItem(`calendarEvents-${userId}`, JSON.stringify(updated));
  }
};