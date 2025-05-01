import { Event } from './event-utils';

// Sample event data - updated to match event-utils Event interface
export const SAMPLE_EVENTS: Event[] = [
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