import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Edit, ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { getEventById } from "@/data/event";
import { Button } from "@/components/ui/button";
import { formatDateRange, getColorClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Event Details",
  description: "View details of a calendar event",
};

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await auth();

  if (!session?.user) {
    return notFound();
  }

  const event = await getEventById(params.eventId);

  if (!event || event.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto pt-8">
      <Link href="/calendar" className="inline-flex items-center mb-6 text-sm">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Calendar
      </Link>
      
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <Button asChild size="sm" variant="outline">
          <Link href={`/calendar/event/${event.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>
      
      <div className={cn(
        "mb-8 p-2 rounded-md inline-flex items-center text-sm",
        getColorClass(event.color)
      )}>
        <Calendar className="mr-2 h-4 w-4" />
        <span>{formatDateRange(
          new Date(event.startDate),
          new Date(event.endDate),
          event.isAllDay
        )}</span>
      </div>
      
      {event.location && (
        <div className="flex items-start mb-4">
          <MapPin className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">Location</h3>
            <p>{event.location}</p>
          </div>
        </div>
      )}
      
      {event.description && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Description</h3>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8 border-t pt-4 text-sm text-muted-foreground">
        <p>Created: {format(new Date(event.createdAt), "PPpp")}</p>
        {event.updatedAt !== event.createdAt && (
          <p>Last modified: {format(new Date(event.updatedAt), "PPpp")}</p>
        )}
      </div>
    </div>
  );
}
