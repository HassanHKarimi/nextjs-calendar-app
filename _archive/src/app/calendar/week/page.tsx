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
  // For demo purposes, create a dummy user ID and sample events
  const dummyUserId = "demo-user-123";

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

  // Create sample events for demo week view
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  
  const mondayMeeting = new Date(weekStart);
  mondayMeeting.setHours(10, 0, 0, 0);
  
  const wednesdayMeeting = new Date(weekStart);
  wednesdayMeeting.setDate(weekStart.getDate() + 3); // Wednesday
  wednesdayMeeting.setHours(14, 0, 0, 0);
  
  const fridayMeeting = new Date(weekStart);
  fridayMeeting.setDate(weekStart.getDate() + 5); // Friday
  fridayMeeting.setHours(11, 0, 0, 0);
  
  const sampleEvents = [
    {
      id: "weekly-event-1",
      title: "Planning Meeting",
      description: "Weekly planning session",
      startDate: mondayMeeting,
      endDate: new Date(new Date(mondayMeeting).setHours(mondayMeeting.getHours() + 1)),
      location: "Main Conference Room",
      isAllDay: false,
      color: "blue",
      userId: dummyUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "weekly-event-2",
      title: "Mid-week Review",
      description: "Review progress on calendar app",
      startDate: wednesdayMeeting,
      endDate: new Date(new Date(wednesdayMeeting).setHours(wednesdayMeeting.getHours() + 2)),
      location: "Meeting Room 2",
      isAllDay: false,
      color: "green",
      userId: dummyUserId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "weekly-event-3",
      title: "Demo Preparation",
      description: "Prepare for next week's demo",
      startDate: fridayMeeting,
      endDate: new Date(new Date(fridayMeeting).setHours(fridayMeeting.getHours() + 1, 30)),
      location: "Team Area",
      isAllDay: false,
      color: "purple",
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

      <WeeklyCalendar
        date={currentDate}
        events={events}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
      />
    </div>
  );
}
