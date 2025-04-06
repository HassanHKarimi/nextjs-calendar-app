import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = RegisterSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedData.data;
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
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
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
