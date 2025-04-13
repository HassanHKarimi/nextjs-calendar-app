import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "../../../lib/db";
import { RegisterSchema } from "../../../schemas";
import { getUserByEmail } from "../../../data/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body = req.body;
    
    // Validate request body
    const validatedData = RegisterSchema.safeParse(body);
    
    if (!validatedData.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const { name, email, password } = validatedData.data;
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // Create some default events for the new user
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Add a welcome event
    await db.event.create({
      data: {
        title: "Welcome to Calendar App",
        description: "This is your first event! You can create, edit, and delete events. Try it out by clicking on any day in the calendar.",
        startDate: today,
        endDate: today,
        isAllDay: true,
        color: "blue",
        userId: user.id,
      },
    });
    
    // Add an example meeting
    const meetingStart = new Date(tomorrow);
    meetingStart.setHours(10, 0, 0, 0);
    
    const meetingEnd = new Date(tomorrow);
    meetingEnd.setHours(11, 0, 0, 0);
    
    await db.event.create({
      data: {
        title: "Team Meeting",
        description: "Weekly team meeting to discuss project progress",
        startDate: meetingStart,
        endDate: meetingEnd,
        location: "Conference Room A",
        isAllDay: false,
        color: "green",
        userId: user.id,
      },
    });
    
    // Add a reminder event
    const reminderDate = new Date(tomorrow);
    reminderDate.setDate(reminderDate.getDate() + 2);
    
    await db.event.create({
      data: {
        title: "Don't forget to...",
        description: "This is a reminder event. You can set reminders for anything important!",
        startDate: reminderDate,
        endDate: reminderDate,
        isAllDay: true,
        color: "purple",
        userId: user.id,
      },
    });
    
    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("[REGISTER_API]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}