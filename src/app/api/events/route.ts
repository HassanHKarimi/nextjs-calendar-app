import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createEvent, getEventsByUserId } from "@/data/event";
import { EventSchema } from "@/schemas";

// GET /api/events - Get all events for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Make TypeScript happy by providing a default value
    const userId = session.user.id || "";
    if (!userId) {
      return new NextResponse("User ID not found", { status: 400 });
    }

    const events = await getEventsByUserId(userId);
    
    return NextResponse.json(events);
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/events - Create a new event
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Make TypeScript happy by providing a default value
    const userId = session.user.id || "";
    if (!userId) {
      return new NextResponse("User ID not found", { status: 400 });
    }

    const body = await req.json();
    
    // Validate the request body
    const validatedData = EventSchema.safeParse(body);
    
    if (!validatedData.success) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const event = await createEvent(userId, validatedData.data);
    
    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
