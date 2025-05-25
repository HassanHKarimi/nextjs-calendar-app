import { Event } from '../event/event-utils';

const API_BASE = '/api/events';

export interface CreateEventData {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  isAllDay?: boolean;
  color?: string;
}

export interface UpdateEventData extends CreateEventData {
  id: string;
}

// Fetch all events for the current user
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(API_BASE);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    
    const events = await response.json();
    
    // Transform the dates back to Date objects
    return events.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

// Create a new event
export async function createEvent(eventData: CreateEventData): Promise<Event> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventData,
        start: eventData.start.toISOString(),
        end: eventData.end.toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }
    
    const event = await response.json();
    
    // Transform the dates back to Date objects
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// Update an existing event
export async function updateEvent(eventData: UpdateEventData): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE}/${eventData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: eventData.title,
        description: eventData.description,
        start: eventData.start.toISOString(),
        end: eventData.end.toISOString(),
        location: eventData.location,
        isAllDay: eventData.isAllDay,
        color: eventData.color
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }
    
    const event = await response.json();
    
    // Transform the dates back to Date objects
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

// Delete an event
export async function deleteEvent(eventId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/${eventId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// Get a specific event by ID
export async function fetchEvent(eventId: string): Promise<Event> {
  try {
    const response = await fetch(`${API_BASE}/${eventId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }
    
    const event = await response.json();
    
    // Transform the dates back to Date objects
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
} 