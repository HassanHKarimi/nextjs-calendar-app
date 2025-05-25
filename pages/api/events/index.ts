import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // For now, we'll use the first user in the database
    // In a real app, you'd get this from the session
    const users = await db.user.findMany({ take: 1 });
    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }
    
    const userId = users[0].id;

    if (req.method === 'GET') {
      // Fetch events for the authenticated user
      const events = await db.event.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          startDate: 'asc'
        }
      });

      // Transform the events to match our frontend Event interface
      const transformedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.startDate,
        end: event.endDate,
        location: event.location,
        isAllDay: event.isAllDay,
        color: event.color,
        userId: event.userId,
        // Tech event fields
        category: event.category,
        tags: event.tags,
        eventType: event.eventType,
        website: event.website,
        registrationUrl: event.registrationUrl,
        price: event.price,
        organizer: event.organizer,
        venue: event.venue,
        city: event.city,
        country: event.country,
        timezone: event.timezone,
        capacity: event.capacity,
        difficulty: event.difficulty,
        language: event.language,
        cfpDeadline: event.cfpDeadline,
        isRecurring: event.isRecurring,
        sourceUrl: event.sourceUrl,
        verified: event.verified,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }));

      return res.status(200).json(transformedEvents);
    }

    if (req.method === 'POST') {
      // Create a new event
      const { 
        title, description, start, end, location, isAllDay, color,
        // Tech event fields
        category, tags, eventType, website, registrationUrl, price,
        organizer, venue, city, country, timezone, capacity, difficulty,
        language, cfpDeadline, isRecurring, sourceUrl, verified
      } = req.body;

      if (!title || !start || !end) {
        return res.status(400).json({ error: 'Title, start date, and end date are required' });
      }

      const newEvent = await db.event.create({
        data: {
          title,
          description: description || null,
          startDate: new Date(start),
          endDate: new Date(end),
          location: location || null,
          isAllDay: isAllDay || false,
          color: color || 'blue',
          userId: userId,
          // Tech event fields
          category: category || null,
          tags: tags || [],
          eventType: eventType || null,
          website: website || null,
          registrationUrl: registrationUrl || null,
          price: price || null,
          organizer: organizer || null,
          venue: venue || null,
          city: city || null,
          country: country || null,
          timezone: timezone || null,
          capacity: capacity || null,
          difficulty: difficulty || null,
          language: language || null,
          cfpDeadline: cfpDeadline ? new Date(cfpDeadline) : null,
          isRecurring: isRecurring || false,
          sourceUrl: sourceUrl || null,
          verified: verified || false
        }
      });

      // Transform the response to match our frontend Event interface
      const transformedEvent = {
        id: newEvent.id,
        title: newEvent.title,
        description: newEvent.description,
        start: newEvent.startDate,
        end: newEvent.endDate,
        location: newEvent.location,
        isAllDay: newEvent.isAllDay,
        color: newEvent.color,
        userId: newEvent.userId,
        // Tech event fields
        category: newEvent.category,
        tags: newEvent.tags,
        eventType: newEvent.eventType,
        website: newEvent.website,
        registrationUrl: newEvent.registrationUrl,
        price: newEvent.price,
        organizer: newEvent.organizer,
        venue: newEvent.venue,
        city: newEvent.city,
        country: newEvent.country,
        timezone: newEvent.timezone,
        capacity: newEvent.capacity,
        difficulty: newEvent.difficulty,
        language: newEvent.language,
        cfpDeadline: newEvent.cfpDeadline,
        isRecurring: newEvent.isRecurring,
        sourceUrl: newEvent.sourceUrl,
        verified: newEvent.verified,
        createdAt: newEvent.createdAt,
        updatedAt: newEvent.updatedAt
      };

      return res.status(201).json(transformedEvent);
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Events API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 