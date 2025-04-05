import { Metadata } from "next";
import { format, addDays, subDays } from "date-fns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEventsByDay } from "@/data/event";
import { DailyCalendar } from "@/components/daily-calendar";

export const metadata: Metadata = {
  title: "Daily Calendar",
  description: "Your daily calendar view",
};

export default async function DailyCalendarPage({
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

  // Format date for page title
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");

  // Calculate next/prev dates for navigation
  const prevDay = format(subDays(currentDate, 1), "yyyy-MM-dd");
  const nextDay = format(addDays(currentDate, 1), "yyyy-MM-dd");

  // Fetch events for the current day
  const events = await getEventsByDay(session.user.id, currentDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
      </div>

      <DailyCalendar
        date={currentDate}
        events={events}
        prevDay={prevDay}
        nextDay={nextDay}
      />
    </div>
  );
}
