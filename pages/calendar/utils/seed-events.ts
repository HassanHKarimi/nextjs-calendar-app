// pages/calendar/utils/seed-events.ts
import { addDays, setYear, setMonth, setDate, getYear } from 'date-fns';

// Define event type for type safety
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isAllDay: boolean;
  color: string;
  userId?: string;
  type?: string;
  tags?: string[];
  participants?: string[];
  isCompleted?: boolean;
}

/**
 * Create a date for the current year
 * @param month Zero-indexed month (0 = January)
 * @param day Day of the month
 * @returns Date object
 */
const createDate = (month: number, day: number): Date => {
  const currentYear = getYear(new Date());
  const date = new Date();
  date.setFullYear(currentYear, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Generate holidays for the current year
 */
export const generateHolidays = (): CalendarEvent[] => {
  const currentYear = getYear(new Date());
  
  // Function to create a holiday event
  const createHoliday = (
    id: string,
    title: string,
    description: string,
    month: number, // 0-indexed month (0 = January)
    day: number
  ): CalendarEvent => {
    const date = createDate(month, day);
    
    return {
      id,
      title,
      description,
      startDate: date,
      endDate: date,
      isAllDay: true,
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      type: "holiday",
      tags: ["holiday"],
      participants: []
    };
  };
  
  return [
    createHoliday(
      "holiday-new-year",
      "New Year's Day",
      "First day of the year.",
      0, // January
      1
    ),
    createHoliday(
      "holiday-mlk-day",
      "Martin Luther King Jr. Day",
      "Honors the civil rights leader.",
      0, // January
      // Third Monday in January - simplified approximation
      15
    ),
    createHoliday(
      "holiday-presidents-day",
      "Presidents' Day",
      "Honors U.S. presidents, especially Washington and Lincoln.",
      1, // February
      // Third Monday in February - simplified approximation
      15
    ),
    createHoliday(
      "holiday-memorial-day",
      "Memorial Day",
      "Honors those who died while serving in the U.S. military.",
      4, // May
      // Last Monday in May - simplified approximation 
      30
    ),
    createHoliday(
      "holiday-independence-day",
      "Independence Day",
      "Celebrates the Declaration of Independence.",
      6, // July
      4
    ),
    createHoliday(
      "holiday-labor-day",
      "Labor Day",
      "Honors the American labor movement.",
      8, // September
      // First Monday in September - simplified approximation
      1
    ),
    createHoliday(
      "holiday-columbus-day",
      "Columbus Day / Indigenous Peoples' Day",
      "Commemorates the arrival of Columbus in the Americas and/or honors Native American peoples.",
      9, // October
      // Second Monday in October - simplified approximation
      8
    ),
    createHoliday(
      "holiday-veterans-day",
      "Veterans Day",
      "Honors military veterans.",
      10, // November
      11
    ),
    createHoliday(
      "holiday-thanksgiving",
      "Thanksgiving Day",
      "Day of giving thanks for the blessings of the harvest and of the preceding year.",
      10, // November
      // Fourth Thursday in November - simplified approximation
      24
    ),
    createHoliday(
      "holiday-christmas",
      "Christmas Day",
      "Christian festival celebrating the birth of Jesus.",
      11, // December
      25
    ),
  ];
};

/**
 * Generate observances for the current year
 */
export const generateObservances = (): CalendarEvent[] => {
  const currentYear = getYear(new Date());
  
  // Function to create an observance event
  const createObservance = (
    id: string,
    title: string,
    description: string,
    month: number, // 0-indexed month (0 = January)
    day: number
  ): CalendarEvent => {
    const date = createDate(month, day);
    
    return {
      id,
      title,
      description,
      startDate: date,
      endDate: date,
      isAllDay: true,
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      type: "observance",
      tags: ["observance"],
      participants: []
    };
  };
  
  return [
    createObservance(
      "observance-groundhog-day",
      "Groundhog Day",
      "Traditional holiday featuring a groundhog to predict the arrival of spring.",
      1, // February
      2
    ),
    createObservance(
      "observance-valentines-day",
      "Valentine's Day",
      "Celebration of love and affection.",
      1, // February
      14
    ),
    createObservance(
      "observance-st-patricks-day",
      "St. Patrick's Day",
      "Celebration of Irish culture and heritage.",
      2, // March
      17
    ),
    createObservance(
      "observance-earth-day",
      "Earth Day",
      "Day to demonstrate support for environmental protection.",
      3, // April
      22
    ),
    createObservance(
      "observance-mothers-day",
      "Mother's Day",
      "Celebration honoring mothers and motherhood.",
      4, // May
      // Second Sunday in May - simplified approximation
      14
    ),
    createObservance(
      "observance-fathers-day",
      "Father's Day",
      "Celebration honoring fathers and fatherhood.",
      5, // June
      // Third Sunday in June - simplified approximation
      18
    ),
    createObservance(
      "observance-halloween",
      "Halloween",
      "A celebration observed in many countries on 31 October.",
      9, // October
      31
    ),
  ];
};

/**
 * Generate personal events
 */
export const generatePersonalEvents = (userId: string): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];
  
  // Generate a birthday
  const birthdayMonth = Math.floor(Math.random() * 12);
  const birthdayDay = Math.floor(Math.random() * 28) + 1; // Avoid edge cases with month lengths
  
  const birthdayDate = createDate(birthdayMonth, birthdayDay);
  events.push({
    id: `personal-birthday-${userId}`,
    title: "My Birthday",
    description: "Annual birthday celebration.",
    startDate: birthdayDate,
    endDate: birthdayDate,
    isAllDay: true,
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    userId,
    type: "personal",
    tags: ["birthday", "personal"],
    participants: []
  });
  
  // Generate an anniversary if appropriate
  if (Math.random() > 0.5) {
    const anniversaryMonth = Math.floor(Math.random() * 12);
    const anniversaryDay = Math.floor(Math.random() * 28) + 1;
    
    const anniversaryDate = createDate(anniversaryMonth, anniversaryDay);
    events.push({
      id: `personal-anniversary-${userId}`,
      title: "Anniversary",
      description: "Annual anniversary celebration.",
      startDate: anniversaryDate,
      endDate: anniversaryDate,
      isAllDay: true,
      color: "bg-red-100 text-red-800 hover:bg-red-200",
      userId,
      type: "personal",
      tags: ["anniversary", "personal"],
      participants: []
    });
  }
  
  // Add a few upcoming appointments
  for (let i = 1; i <= 3; i++) {
    const futureDay = addDays(today, Math.floor(Math.random() * 60) + 7); // 7-67 days in the future
    const startHour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
    
    const startDate = new Date(futureDay);
    startDate.setHours(startHour, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startHour + 1, 0, 0, 0); // 1 hour appointment
    
    const appointmentTypes = [
      { title: "Doctor Appointment", location: "Medical Center", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
      { title: "Dentist Appointment", location: "Dental Clinic", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
      { title: "Haircut", location: "Salon", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
      { title: "Car Service", location: "Auto Shop", color: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
      { title: "Massage", location: "Spa", color: "bg-purple-100 text-purple-800 hover:bg-purple-200" }
    ];
    
    const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    
    events.push({
      id: `personal-appointment-${i}-${userId}`,
      title: appointmentType.title,
      description: `Scheduled ${appointmentType.title.toLowerCase()}.`,
      startDate,
      endDate,
      location: appointmentType.location,
      isAllDay: false,
      color: appointmentType.color,
      userId,
      type: "appointment",
      tags: ["appointment", "personal"],
      participants: []
    });
  }
  
  return events;
};

/**
 * Generate work events
 */
export const generateWorkEvents = (userId: string): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];
  
  // Add regular team meetings for the next 4 weeks
  for (let week = 0; week < 4; week++) {
    // Monday morning standup
    const mondayStandup = addDays(today, (week * 7) + (1 - today.getDay()));
    if (mondayStandup >= today) {
      const startDate = new Date(mondayStandup);
      startDate.setHours(9, 30, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(10, 0, 0, 0);
      
      events.push({
        id: `work-standup-${week}-${userId}`,
        title: "Team Standup",
        description: "Weekly team standup meeting to discuss progress and blockers.",
        startDate,
        endDate,
        location: "Conference Room A",
        isAllDay: false,
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        userId,
        type: "meeting",
        tags: ["meeting", "work", "recurring"],
        participants: ["alex.johnson", "sarah.williams", "john.smith"]
      });
    }
    
    // Wednesday lunch & learn
    const wednesdayLunch = addDays(today, (week * 7) + (3 - today.getDay()));
    if (wednesdayLunch >= today) {
      const startDate = new Date(wednesdayLunch);
      startDate.setHours(12, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(13, 0, 0, 0);
      
      events.push({
        id: `work-lunch-learn-${week}-${userId}`,
        title: "Lunch & Learn Session",
        description: "Weekly lunch session to learn about new technologies and share knowledge.",
        startDate,
        endDate,
        location: "Main Conference Room",
        isAllDay: false,
        color: "bg-green-100 text-green-800 hover:bg-green-200",
        userId,
        type: "meeting",
        tags: ["meeting", "work", "learning", "recurring"],
        participants: ["alex.johnson", "sarah.williams", "john.smith"]
      });
    }
    
    // Friday planning
    const fridayPlanning = addDays(today, (week * 7) + (5 - today.getDay()));
    if (fridayPlanning >= today) {
      const startDate = new Date(fridayPlanning);
      startDate.setHours(14, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(15, 0, 0, 0);
      
      events.push({
        id: `work-planning-${week}-${userId}`,
        title: "Sprint Planning",
        description: "Weekly planning session to prioritize and assign tasks for the coming sprint.",
        startDate,
        endDate,
        location: "Conference Room B",
        isAllDay: false,
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        userId,
        type: "meeting",
        tags: ["meeting", "work", "planning", "recurring"],
        participants: ["alex.johnson", "sarah.williams", "john.smith"]
      });
    }
  }
  
  // Add a few one-off work events
  const eventTypes = [
    {
      title: "Client Presentation",
      description: "Presentation of project progress to the client.",
      location: "Main Conference Room",
      duration: 2, // hours
      color: "bg-red-100 text-red-800 hover:bg-red-200",
      tags: ["meeting", "work", "client"]
    },
    {
      title: "Design Review",
      description: "Review of the latest design mockups with the design team.",
      location: "Design Lab",
      duration: 1.5, // hours
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      tags: ["meeting", "work", "design"]
    },
    {
      title: "Code Review",
      description: "Team code review session for quality control.",
      location: "Dev Room",
      duration: 1, // hours
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      tags: ["meeting", "work", "development"]
    },
    {
      title: "Project Deadline",
      description: "Final submission deadline for the current project phase.",
      location: "",
      duration: 0, // all day
      color: "bg-red-100 text-red-800 hover:bg-red-200",
      tags: ["deadline", "work", "important"]
    }
  ];
  
  for (let i = 1; i <= 4; i++) {
    const futureDay = addDays(today, Math.floor(Math.random() * 30) + 3); // 3-33 days in the future
    const eventType = eventTypes[i - 1];
    
    // Skip weekends
    if (futureDay.getDay() === 0 || futureDay.getDay() === 6) {
      futureDay.setDate(futureDay.getDate() + (futureDay.getDay() === 0 ? 1 : 2));
    }
    
    if (eventType.duration > 0) {
      // Time-specific event
      const startHour = 9 + Math.floor(Math.random() * 6); // Between 9 AM and 3 PM
      
      const startDate = new Date(futureDay);
      startDate.setHours(startHour, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(startHour + eventType.duration, eventType.duration % 1 * 60, 0, 0);
      
      events.push({
        id: `work-event-${i}-${userId}`,
        title: eventType.title,
        description: eventType.description,
        startDate,
        endDate,
        location: eventType.location,
        isAllDay: false,
        color: eventType.color,
        userId,
        type: "meeting",
        tags: eventType.tags,
        participants: ["alex.johnson", "sarah.williams", "john.smith"].slice(0, Math.floor(Math.random() * 3) + 1)
      });
    } else {
      // All day event
      const date = new Date(futureDay);
      date.setHours(0, 0, 0, 0);
      
      events.push({
        id: `work-all-day-${i}-${userId}`,
        title: eventType.title,
        description: eventType.description,
        startDate: date,
        endDate: date,
        location: eventType.location,
        isAllDay: true,
        color: eventType.color,
        userId,
        type: "deadline",
        tags: eventType.tags,
        participants: []
      });
    }
  }
  
  return events;
};

/**
 * Generate all seed events for a user
 */
export const generateAllEvents = (userId: string): CalendarEvent[] => {
  return [
    ...generateHolidays(),
    ...generateObservances(),
    ...generatePersonalEvents(userId),
    ...generateWorkEvents(userId)
  ];
};

export default generateAllEvents;