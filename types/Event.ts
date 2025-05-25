import { Event as BaseEvent } from '@/utils/event/event-utils';

export interface Event extends BaseEvent {
  // Add animation support
  sourceElement?: HTMLElement;
  
  // Standardize date properties (maintain compatibility)
  startDate?: Date;
  endDate?: Date;
  
  // Add additional properties for compatibility
  isAllDay?: boolean;
  color?: string;
  
  // Enhanced Tech Event Fields
  category?: string;        // Conference, Meetup, Workshop, Hackathon, Webinar, etc.
  tags?: string[];         // Array of technology tags
  eventType?: string;      // In-person, Virtual, Hybrid
  website?: string;        // Official event website
  registrationUrl?: string; // Registration link
  price?: string;          // Free, Paid, or specific amount
  organizer?: string;      // Event organizer name
  venue?: string;          // Detailed venue information
  city?: string;           // City name
  country?: string;        // Country name
  timezone?: string;       // Event timezone
  capacity?: number;       // Maximum attendees
  difficulty?: string;     // Beginner, Intermediate, Advanced
  language?: string;       // Primary language
  cfpDeadline?: Date;      // Call for Papers deadline
  isRecurring?: boolean;   // For recurring events
  sourceUrl?: string;      // Where we found this event
  verified?: boolean;      // Whether event details are verified
  
  // Database fields
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Event; 