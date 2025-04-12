import { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getEventById } from "@/data/event";
import { EventForm } from "@/components/event-form";

export const metadata: Metadata = {
  title: "Edit Event",
  description: "Edit your calendar event",
};

interface EditEventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await auth();

  if (!session?.user) {
    return notFound();
  }

  const event = await getEventById(params.eventId);

  if (!event || event.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <EventForm 
        userId={session.user.id} 
        eventId={params.eventId}
      />
    </div>
  );
}
