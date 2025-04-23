import React from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  addHours
} from 'date-fns';
import { Event } from '@/utils/event/event-utils';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

// Hours for the week view (8 AM to 7 PM)
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

export default function WeekView({ currentDate, events, onEventClick }: WeekViewProps) {
  // Get days for the current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start week on Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });

  // Filter events for a specific day
  const getDayEvents = (day: Date): Event[] => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Check if the event occurs on this day
      return (
        isSameDay(day, eventStart) || 
        isSameDay(day, eventEnd) ||
        (day >= eventStart && day <= eventEnd)
      );
    });
  };

  // Position calculation for events
  const getEventPosition = (event: Event) => {
    const startHour = new Date(event.start).getHours() + (new Date(event.start).getMinutes() / 60);
    const endHour = new Date(event.end).getHours() + (new Date(event.end).getMinutes() / 60);
    const top = Math.max(0, (startHour - 8) * 60); // 8 AM is the start of our grid (0px)
    const height = Math.min(12 * 60, (endHour - startHour) * 60); // Cap at the bottom of our grid
    return { top, height };
  };

  return (
    <div className="week-container">
      <div className="week-grid">
        {/* Time column */}
        <div className="week-time-column">
          <div className="week-time-header"></div>
          {HOURS.map(hour => (
            <div key={`hour-${hour}`} className="week-time-label">
              {format(addHours(new Date().setHours(hour, 0, 0, 0), 0), 'h a')}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map(day => (
          <div key={format(day, 'yyyy-MM-dd')} className="week-day-column">
            <div className="week-day-header">
              <div className="week-day-name">{format(day, 'EEE')}</div>
              <div className={`week-day-number ${isSameDay(day, new Date()) ? 'week-day-number-current' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>

            {/* Hourly grid */}
            <div className="week-event-container">
              {HOURS.map(hour => (
                <div key={`${day.toString()}-${hour}`} className="week-hour-cell"></div>
              ))}

              {/* Events */}
              {getDayEvents(day).map(event => {
                const { top, height } = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="week-day-event"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                    }}
                    title={`${event.title} (${format(new Date(event.start), 'h:mm a')} - ${format(new Date(event.end), 'h:mm a')})`}
                  >
                    <div className="week-event-title">{event.title}</div>
                    {height > 30 && (
                      <div className="week-event-time">
                        {format(new Date(event.start), 'h:mm a')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 