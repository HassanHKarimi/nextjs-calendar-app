// Using Pages API Router for event CRUD operations
// This provides better compatibility with Vercel deployment

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]";

import { db } from "@/lib/db";
import { EventSchema } from "@/schemas";
import { getEventById, updateEvent, deleteEvent } from "@/data/event";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the current authenticated session
  const session = await getServerSession(req, res, options);

  if (!session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const eventId = req.query.eventId as string;

  // GET - Fetch single event
  if (req.method === "GET") {
    try {
      const event = await getEventById(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if the user owns this event
      if (event.userId !== session.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return res.status(200).json(event);
    } catch (error) {
      console.error("[EVENT_GET]", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  // PUT - Update an event
  else if (req.method === "PUT") {
    try {
      const body = req.body;

      const validatedData = EventSchema.safeParse(body);
      
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid request data" });
      }

      const event = await getEventById(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check ownership
      if (event.userId !== session.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedEvent = await updateEvent(
        eventId,
        session.user.id,
        validatedData.data
      );

      return res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("[EVENT_PUT]", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  // DELETE - Remove an event
  else if (req.method === "DELETE") {
    try {
      const event = await getEventById(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check ownership
      if (event.userId !== session.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await deleteEvent(eventId, session.user.id);

      return res.status(204).end();
    } catch (error) {
      console.error("[EVENT_DELETE]", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  // Handle unsupported methods
  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}