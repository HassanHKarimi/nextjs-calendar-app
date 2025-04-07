import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the user's session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const eventId = req.query.eventId as string;
    
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    
    // Check if event exists and belongs to the user
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        userId: session.user.id
      }
    });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Handle GET request (fetch event)
    if (req.method === "GET") {
      return res.status(200).json(event);
    }
    
    // Handle PUT request (update event)
    if (req.method === "PUT") {
      const { title, description, startDate, endDate, location, isAllDay, color } = req.body;
      
      if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const updatedEvent = await db.event.update({
        where: {
          id: eventId
        },
        data: {
          title,
          description: description || "",
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location: location || "",
          isAllDay: Boolean(isAllDay),
          color: color || "blue"
        }
      });
      
      return res.status(200).json(updatedEvent);
    }
    
    // Handle DELETE request (delete event)
    if (req.method === "DELETE") {
      await db.event.delete({
        where: {
          id: eventId
        }
      });
      
      return res.status(200).json({ message: "Event deleted successfully" });
    }
    
    // Handle unsupported methods
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("[EVENT_DETAIL_API]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
