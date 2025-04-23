import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { Event } from '@/types/Event';
import CalendarDayCell from './ui/CalendarDayCell';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function MonthView({ currentDate, events, onEventClick }: MonthViewProps) {
  // Get all dates for the current month view (including days from prev/next months that appear in the grid)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Get all the days in the range
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Create week rows
  const weeks: Date[][] = [];
  let week: Date[] = [];

  calendarDays.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  // Filter events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      return (
        (day >= eventStart && day <= eventEnd) ||
        format(day, 'yyyy-MM-dd') === format(eventStart, 'yyyy-MM-dd') ||
        format(day, 'yyyy-MM-dd') === format(eventEnd, 'yyyy-MM-dd')
      );
    });
  };

  return (
    <div className="month-container">
      <div className="month-grid">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="month-day-header">
            {day}
          </div>
        ))}
      
        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            {week.map((day) => {
              const dayEvents = getEventsForDay(day);
              return (
                <CalendarDayCell 
                  key={format(day, 'yyyy-MM-dd')}
                  day={day}
                  currentMonth={monthStart}
                  events={dayEvents}
                  onEventClick={onEventClick}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 