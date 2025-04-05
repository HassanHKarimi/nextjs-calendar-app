import { Metadata } from "next";
import { format, addMonths, subMonths } from "date-fns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEventsByMonth } from "@/data/event";
import { MonthlyCalendar } from "@/components/monthly-calendar";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Your monthly calendar view",
};

export default async function CalendarPage({
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
  const formattedDate = format(currentDate, "MMMM yyyy");

  // Calculate next/prev month dates for navigation
  const prevMonth = format(subMonths(currentDate, 1), "yyyy-MM-dd");
  const nextMonth = format(addMonths(currentDate, 1), "yyyy-MM-dd");

  // Fetch events for the current month
  const events = await getEventsByMonth(session.user.id, currentDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
      </div>

      <MonthlyCalendar 
        date={currentDate} 
        events={events} 
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
    </div>
  );
}
