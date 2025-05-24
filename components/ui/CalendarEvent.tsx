import React, { useRef, useEffect } from 'react';
import { Event, getEventColorClass } from '../../utils/event/event-utils';

export interface CalendarEventProps {
  event: Event;
  onClick?: (event: Event & { sourceElement: HTMLDivElement | null }) => void;
  isCompact?: boolean;
}

// Debug flag
const DEBUG = false; // Disabled by default in production

const CalendarEvent: React.FC<CalendarEventProps> = ({ 
  event, 
  onClick,
  isCompact = false
}) => {
  const eventRef = useRef<HTMLDivElement>(null);
  const colorClass = getEventColorClass(event.title);
  
  // Log with timestamp for debugging
  const logWithTimestamp = (message: string, data?: any) => {
    if (!DEBUG) return;
    const now = new Date();
    const timestamp = now.toISOString().split('T')[1].split('.')[0] + '.' + now.getMilliseconds();
    console.log(`[${timestamp}] [CalendarEvent] ${message}`, data || '');
  };

  // Check ref on mount for debugging
  useEffect(() => {
    if (DEBUG && eventRef.current) {
      logWithTimestamp('CalendarEvent mounted', {
        eventId: event.id,
        eventTitle: event.title,
        domElement: eventRef.current.tagName,
        hasRef: !!eventRef.current
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Log click for debugging
    logWithTimestamp('Event clicked', {
      eventId: event.id,
      eventTitle: event.title,
      hasRef: !!eventRef.current,
      elementClicked: e.target
    });
    
    if (onClick) {
      // Make sure we have a valid DOM element reference
      if (!eventRef.current) {
        logWithTimestamp('WARNING: No ref available for event!');
      }
      
      // Pass the DOM element reference along with the event
      onClick({
        ...event,
        sourceElement: eventRef.current
      } as Event & { sourceElement: HTMLDivElement | null });
    }
  };

  const eventTime = () => {
    const start = new Date(event.start);
    const hour = start.getHours();
    const minute = start.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };
  
  if (isCompact) {
    return (
      <div 
        ref={eventRef}
        data-event-id={event.id}
        data-id={`event-${event.id}`}
        className={`px-2 py-1 mb-1 text-base rounded cursor-pointer truncate transition-all duration-200 
                   transform hover:scale-[1.02] hover:shadow-sm z-[1] hover:z-[10] ${colorClass}`}
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label={`Event: ${event.title}`}
      >
        <span className="font-medium">{event.title}</span>
      </div>
    );
  }
  
  return (
    <div 
      ref={eventRef}
      data-event-id={event.id}
      data-id={`event-${event.id}`}
      className={`px-2 py-1 mb-1 text-sm rounded cursor-pointer truncate transition-all duration-200 
                 transform hover:scale-[1.02] hover:shadow-md z-[1] hover:z-[10] ${colorClass}`}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`Event: ${event.title}`}
    >
      <div className="font-medium">{event.title}</div>
      <div className="text-xs opacity-75">{eventTime()}</div>
    </div>
  );
};

export default CalendarEvent; 