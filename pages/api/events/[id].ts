import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    // For now, we'll use the first user in the database
    // In a real app, you'd get this from the session
    const users = await db.user.findMany({ take: 1 });
    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }
    
    const userId = users[0].id;

    if (req.method === 'GET') {
      // Get a specific event
      const event = await db.event.findFirst({
        where: {
          id: id,
          userId: userId
        }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Transform the event to match our frontend Event interface
      const transformedEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.startDate,
        end: event.endDate,
        location: event.location,
        isAllDay: event.isAllDay,
        color: event.color,
        userId: event.userId
      };

      return res.status(200).json(transformedEvent);
    }

    if (req.method === 'PUT') {
      // Update an event
      const { title, description, start, end, location, isAllDay, color } = req.body;

      if (!title || !start || !end) {
        return res.status(400).json({ error: 'Title, start date, and end date are required' });
      }

      const updatedEvent = await db.event.update({
        where: {
          id: id,
          userId: userId
        },
        data: {
          title,
          description: description || null,
          startDate: new Date(start),
          endDate: new Date(end),
          location: location || null,
          isAllDay: isAllDay || false,
          color: color || 'blue'
        }
      });

      // Transform the response to match our frontend Event interface
      const transformedEvent = {
        id: updatedEvent.id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        start: updatedEvent.startDate,
        end: updatedEvent.endDate,
        location: updatedEvent.location,
        isAllDay: updatedEvent.isAllDay,
        color: updatedEvent.color,
        userId: updatedEvent.userId
      };

      return res.status(200).json(transformedEvent);
    }

    if (req.method === 'DELETE') {
      // Delete an event
      await db.event.delete({
        where: {
          id: id,
          userId: userId
        }
      });

      return res.status(200).json({ message: 'Event deleted successfully' });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Event API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 