import React from 'react';
import { format, isSameDay, addHours } from 'date-fns';
import { Event } from '@/types/Event';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

// Hours array for the day view (7 AM to 8 PM)
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);

export default function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  // Filter events for the current day
  const dayEvents = events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    return (
      isSameDay(currentDate, eventStart) || 
      isSameDay(currentDate, eventEnd) ||
      (currentDate >= eventStart && currentDate <= eventEnd)
    );
  });

  // Event positioning helper
  const getEventPosition = (event: Event) => {
    const startHour = new Date(event.startDate).getHours() + (new Date(event.startDate).getMinutes() / 60);
    const endHour = new Date(event.endDate).getHours() + (new Date(event.endDate).getMinutes() / 60);
    const top = (startHour - 7) * 60; // 7 AM is the start of our grid (0px)
    const height = (endHour - startHour) * 60;
    return { top, height };
  };

  return (
    <div className="day-container">
      <div className="day-header">
        <div className="day-name">{format(currentDate, 'EEEE')}</div>
        <div className={`day-number ${isSameDay(currentDate, new Date()) ? 'day-number-current' : ''}`}>
          {format(currentDate, 'd')}
        </div>
      </div>
      
      {/* All day events */}
      <div className="day-all-day-row">
        {dayEvents
          .filter(event => event.isAllDay)
          .map(event => (
            <div 
              key={event.id}
              onClick={() => onEventClick(event)}
              className="day-event all-day"
              title={event.title}
            >
              {event.title}
            </div>
          ))}
      </div>
      
      <div className="day-grid">
        <div className="day-time-column">
          <div className="day-time-header"></div>
          {HOURS.map(hour => (
            <div key={`hour-${hour}`} className="day-time-label">
              {format(addHours(new Date().setHours(hour, 0, 0, 0), 0), 'h a')}
            </div>
          ))}
        </div>
        
        <div className="day-event-container">
          {HOURS.map(hour => (
            <div 
              key={`hour-${hour}`} 
              className="day-hour-cell"
            ></div>
          ))}
          
          {/* Events */}
          {dayEvents
            .filter(event => !event.isAllDay)
            .map(event => {
              const { top, height } = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="day-event"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`
                  }}
                  title={`${event.title} (${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')})`}
                >
                  <div className="day-event-title">{event.title}</div>
                  {height > 50 && (
                    <>
                      <div className="day-event-time">
                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                      </div>
                      {height > 80 && event.location && (
                        <div className="day-event-location">{event.location}</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
} 