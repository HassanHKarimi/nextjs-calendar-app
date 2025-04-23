import { isSameDay } from 'date-fns';

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
}

/**
 * Filter events for a specific day
 */
export const filterEventsForDay = (events: Event[], day: Date): Event[] => {
  return events.filter(event => isSameDay(new Date(event.start), day));
};

/**
 * Get color class for an event based on its title
 */
export const getEventColorClass = (eventTitle: string): string => {
  const title = eventTitle.toLowerCase();
  
  if (title.includes('meeting') || title.includes('sync') || title.includes('standup')) {
    return 'event-blue';
  } else if (title.includes('lunch') || title.includes('dinner') || title.includes('breakfast')) {
    return 'event-green';
  } else if (title.includes('interview') || title.includes('review')) {
    return 'event-purple';
  } else if (title.includes('deadline') || title.includes('due') || title.includes('submit')) {
    return 'event-red';
  } else if (title.includes('planning') || title.includes('strategy')) {
    return 'event-yellow';
  } else if (title.includes('workshop') || title.includes('training')) {
    return 'event-indigo';
  } else if (title.includes('call') || title.includes('chat')) {
    return 'event-pink';
  }
  
  // Default color
  return 'event-gray';
};

/**
 * Get time display for an event
 */
export const getEventTimeDisplay = (event: Event): string => {
  try {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();
    
    const formatTimeComponent = (hour: number, minute: number) => {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      return `${formattedHour}:${minute.toString().padStart(2, '0')} ${amPm}`;
    };
    
    return `${formatTimeComponent(startHour, startMinute)} - ${formatTimeComponent(endHour, endMinute)}`;
  } catch (error) {
    return 'Invalid time';
  }
};

/**
 * Create a sample event
 */
export const createSampleEvent = (
  id: string,
  title: string,
  startDate: Date,
  durationMinutes: number = 60,
  location: string = '',
  description: string = ''
): Event => {
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + durationMinutes);
  
  return {
    id,
    title,
    start: startDate,
    end: endDate,
    location,
    description
  };
};

/**
 * Generate sample events for the calendar
 */
export const generateSampleEvents = (): Event[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  // Create dates at specific times
  const meeting1 = new Date(today);
  meeting1.setHours(10, 0, 0, 0);
  
  const lunch = new Date(today);
  lunch.setHours(12, 30, 0, 0);
  
  const meeting2 = new Date(today);
  meeting2.setHours(14, 0, 0, 0);
  
  const deadline = new Date(tomorrow);
  deadline.setHours(17, 0, 0, 0);
  
  const planning = new Date(nextWeek);
  planning.setHours(9, 0, 0, 0);
  
  return [
    createSampleEvent('1', 'Team Meeting', meeting1, 60, 'Conference Room A', 'Weekly team sync meeting'),
    createSampleEvent('2', 'Lunch with Client', lunch, 90, 'Bistro Downtown', 'Discuss project proposal'),
    createSampleEvent('3', 'Product Review', meeting2, 120, 'Zoom Call', 'Review Q3 product roadmap'),
    createSampleEvent('4', 'Project Deadline', deadline, 30, '', 'Submit final deliverables'),
    createSampleEvent('5', 'Strategic Planning', planning, 180, 'Board Room', 'Quarterly planning session')
  ];
}; 