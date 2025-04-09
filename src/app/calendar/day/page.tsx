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
  // For demo purposes, create a dummy user ID and sample events
  const dummyUserId = "demo-user-123";

  // Handle date navigation through query params
  const currentDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  // Format date for page title
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");

  // Calculate next/prev dates for navigation
  const prevDay = format(subDays(currentDate, 1), "yyyy-MM-dd");
  const nextDay = format(addDays(currentDate, 1), "yyyy-MM-dd");

  // Create sample events for demo
  const startTime = new Date(currentDate);
  startTime.setHours(9, 0, 0, 0);
  
  const endTime = new Date(currentDate);
  endTime.setHours(10, 30, 0, 0);
  
  const lunchTime = new Date(currentDate);
  lunchTime.setHours(12, 0, 0, 0);
  
  const lunchEndTime = new Date(currentDate);
  lunchEndTime.setHours(13, 0, 0, 0);
  
  const sampleEvents = [
    {
      id: "daily-event-1",
      title: "Morning Meeting",
      description: "Daily standup with the team",
      startDate: startTime,
      endDate: endTime,
      location: "Conference Room B",
      isAllDay: false,
      color: "blue",
      userId: dummyUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "daily-event-2",
      title: "Lunch with Client",
      description: "Discuss calendar app features",
      startDate: lunchTime,
      endDate: lunchEndTime,
      location: "Cafe Deluxe",
      isAllDay: false,
      color: "green",
      userId: dummyUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Use sample events for the demo
  const events = sampleEvents;

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
