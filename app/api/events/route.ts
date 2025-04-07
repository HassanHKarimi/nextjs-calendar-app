import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get the user's session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const events = await db.event.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        startDate: "asc"
      }
    });
    
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("[EVENTS_API]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the user's session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { title, description, startDate, endDate, location, isAllDay, color } = body;
    
    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
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
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("[EVENTS_API]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
