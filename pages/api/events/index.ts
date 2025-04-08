// Using Pages API Router for event listing and creation
// This provides better compatibility with Vercel deployment

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]";

import { db } from "@/lib/db";
import { EventSchema } from "@/schemas";
import { createEvent, getEventsByUserId } from "@/data/event";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the current authenticated session
  const session = await getServerSession(req, res, options);

  if (!session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }

  // GET - List all events for current user
  if (req.method === "GET") {
    try {
      const events = await getEventsByUserId(userId);
      return res.status(200).json(events);
    } catch (error) {
      console.error("[EVENTS_GET]", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  // POST - Create a new event
  else if (req.method === "POST") {
    try {
      const body = req.body;
      
      const validatedData = EventSchema.safeParse(body);
      
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid request data" });
      }

      const event = await createEvent(userId, validatedData.data);
      
      return res.status(201).json(event);
    } catch (error) {
      console.error("[EVENTS_POST]", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  // Handle unsupported methods
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}