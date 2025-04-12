import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EventForm } from "@/components/event-form";

export const metadata: Metadata = {
  title: "Create New Event",
  description: "Create a new event in your calendar",
};

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: { date?: string; allDay?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Get the date from the URL if provided, otherwise use current date
  const dateParam = searchParams.date;
  const isAllDay = searchParams.allDay === "true";

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <EventForm 
        userId={session.user.id} 
        initialDate={dateParam}
        initialAllDay={isAllDay}
      />
    </div>
  );
}
