import { Metadata } from "next";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEventsByWeek } from "@/data/event";
import { WeeklyCalendar } from "@/components/weekly-calendar";

export const metadata: Metadata = {
  title: "Weekly Calendar",
  description: "Your weekly calendar view",
};

export default async function WeeklyCalendarPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Handle date navigation through query params
  const currentDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  // Get start and end of week for display
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  // Format date for page title
  const formattedDate = `${format(weekStart, "MMMM d")} - ${format(
    weekEnd,
    "MMMM d, yyyy"
  )}`;

  // Calculate next/prev weeks for navigation
  const prevWeek = format(subWeeks(currentDate, 1), "yyyy-MM-dd");
  const nextWeek = format(addWeeks(currentDate, 1), "yyyy-MM-dd");

  // Fetch events for the current week
  const events = await getEventsByWeek(session.user.id, currentDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
      </div>

      <WeeklyCalendar
        date={currentDate}
        events={events}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
      />
    </div>
  );
}
