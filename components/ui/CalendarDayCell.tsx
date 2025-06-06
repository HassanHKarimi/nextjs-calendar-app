import { format, isSameMonth, isToday } from 'date-fns';
import React from 'react';
import { Event } from '@/utils/event/event-utils';
import CalendarEvent from './CalendarEvent';

interface CalendarDayCellProps {
  day: Date;
  currentMonth: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function CalendarDayCell({ day, currentMonth, events, onEventClick }: CalendarDayCellProps) {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isTodayDate = isToday(day);
  
  // Cell classes
  const cellClasses = `
    month-day-cell 
    ${isTodayDate ? 'month-day-cell-current' : ''}
    ${!isCurrentMonth ? 'text-gray-300' : ''}
    h-full flex flex-col
  `.trim();

  // Day number classes
  const dayNumberClasses = `
    ${isTodayDate ? 'month-day-number-current' : 'month-day-number'}
  `.trim();

  return (
    <div className={cellClasses}>
      <div className={dayNumberClasses}>
        {format(day, 'd')}
      </div>
      
      <div className="mt-1 flex-1 overflow-hidden">
        {events.length > 0 && (
          <div className="flex flex-col gap-0 sm:gap-1 h-full">
            {events.slice(0, 4).map((event) => (
              <CalendarEvent 
                key={event.id}
                event={event}
                onClick={onEventClick}
                isCompact={true}
              />
            ))}
            {events.length > 4 && (
              <div className="month-event-more text-xs text-gray-500 px-1">
                + {events.length - 4} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 