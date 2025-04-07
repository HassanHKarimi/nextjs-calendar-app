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
    
    // Handle GET request (fetch events)
    if (req.method === "GET") {
      const events = await db.event.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          startDate: "asc"
        }
      });
      
      return res.status(200).json(events);
    }
    
    // Handle POST request (create event)
    if (req.method === "POST") {
      const { title, description, startDate, endDate, location, isAllDay, color } = req.body;
      
      if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const event = await db.event.create({
        data: {
          title,
          description: description || "",
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location: location || "",
          isAllDay: Boolean(isAllDay),
          color: color || "blue",
          userId: session.user.id
        }
      });
      
      return res.status(201).json(event);
    }
    
    // Handle unsupported methods
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("[EVENTS_API]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
