import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { 
  getEventById,
  updateEvent,
  deleteEvent
} from "@/data/event";
import { EventSchema } from "@/schemas";

interface Params {
  params: { eventId: string }
}

// GET /api/events/[eventId] - Get a specific event
export async function GET(
  req: Request,
  { params }: Params
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the event
    const event = await getEventById(params.eventId);

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Check ownership
    if (event.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PUT /api/events/[eventId] - Update an event
export async function PUT(
  req: Request,
  { params }: Params
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // Validate the request body
    const validatedData = EventSchema.safeParse(body);
    
    if (!validatedData.success) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    // Get the event
    const event = await getEventById(params.eventId);

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Check ownership
    if (event.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update the event
    const updatedEvent = await updateEvent(
      params.eventId,
      session.user.id,
      validatedData.data
    );

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("[EVENT_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE /api/events/[eventId] - Delete an event
export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the event
    const event = await getEventById(params.eventId);

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Check ownership
    if (event.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete the event
    await deleteEvent(params.eventId, session.user.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
