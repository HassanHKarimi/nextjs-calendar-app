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
  // For demo purposes, create a dummy user ID and sample events
  const dummyUserId = "demo-user-123";
  
  // Handle date navigation through query params
  const currentDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  // Format date for page title
  const formattedDate = format(currentDate, "MMMM yyyy");

  // Calculate next/prev month dates for navigation
  const prevMonth = format(subMonths(currentDate, 1), "yyyy-MM-dd");
  const nextMonth = format(addMonths(currentDate, 1), "yyyy-MM-dd");

  // Create sample events for the demo
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const sampleEvents = [
    {
      id: "event-1",
      title: "Team Meeting",
      description: "Weekly team meeting to discuss project progress",
      startDate: tomorrow,
      endDate: new Date(new Date(tomorrow).setHours(tomorrow.getHours() + 1)),
      location: "Conference Room A",
      isAllDay: false,
      color: "green",
      userId: dummyUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "event-2",
      title: "Product Launch",
      description: "Launch of the new calendar feature",
      startDate: today,
      endDate: today,
      isAllDay: true,
      color: "blue",
      userId: dummyUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "event-3",
      title: "Project Deadline",
      description: "Final submission deadline for the calendar project",
      startDate: new Date(new Date().setDate(today.getDate() + 7)),
      endDate: new Date(new Date().setDate(today.getDate() + 7)),
      isAllDay: true,
      color: "red",
      userId: dummyUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Use sample events instead of database query for demo
  const events = sampleEvents;

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
