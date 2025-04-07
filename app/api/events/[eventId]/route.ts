import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: {
    eventId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Get the user's session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const eventId = params.eventId;
    
    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }
    
    // Check if event exists and belongs to the user
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        userId: session.user.id
      }
    });
    
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("[EVENT_DETAIL_API]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // Get the user's session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const eventId = params.eventId;
    
    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }
    
    // Check if event exists and belongs to the user
    const existingEvent = await db.event.findUnique({
      where: {
        id: eventId,
        userId: session.user.id
      }
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
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
    
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("[EVENT_DETAIL_API]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Get the user's session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const eventId = params.eventId;
    
    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }
    
    // Check if event exists and belongs to the user
    const existingEvent = await db.event.findUnique({
      where: {
        id: eventId,
        userId: session.user.id
      }
    });
    
    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    
    await db.event.delete({
      where: {
        id: eventId
      }
    });
    
    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[EVENT_DETAIL_API]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
